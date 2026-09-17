'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { Style, Stroke, Fill, Circle as CircleStyle, Text } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { createEmpty, extend } from 'ol/extent';
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
import { CityId, CITIES, CitizenReport, NavigationRoute, getCityDataset } from '@/lib/mock-data';
import { getDemSurfaceGrid, getDemContours, getElevationAtCoordinate, DEM_LEGEND } from '@/lib/dem-service';
import { getRealWaterwaysDataset } from '@/lib/real-waterways-service';
import { getPumpingStationsForCity } from '@/lib/pumping-station-service';
import { getPhysicsDerivedManholes, PhysicsManhole } from '@/lib/physics-manhole-engine';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { getEvacuationZonesForCity, SAFE_ASSEMBLY_SHELTERS } from '@/lib/evacuation-service';
import { EnhancedNavigationRoute, RouteRiskSegment } from '@/lib/routing-engine';
import { getGroundwaterColor } from '@/lib/groundwater-service';
import {
  Layers,
  Compass,
  Mountain,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Waves,
  Activity,
  Route,
  MapPin,
  X,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Home
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface OpenLayersMapCanvasProps {
  selectedCityId: CityId;
  timeOffsetMins: number;
  personaMode: 'citizen' | 'authority';
  activeRoute: NavigationRoute | null;
  citizenReports: CitizenReport[];
  selectedFeatureId: string | null;
  setSelectedFeatureId: (id: string | null) => void;
  routePinMode?: 'none' | 'origin' | 'destination';
  setRoutePinMode?: (mode: 'none' | 'origin' | 'destination') => void;
  pinnedOrigin?: [number, number] | null;
  pinnedDestination?: [number, number] | null;
  onLocationPicked?: (mode: 'origin' | 'destination', coords: [number, number]) => void;
}

export const OpenLayersMapCanvas: React.FC<OpenLayersMapCanvasProps> = ({
  selectedCityId,
  timeOffsetMins,
  personaMode,
  activeRoute,
  citizenReports,
  selectedFeatureId,
  setSelectedFeatureId,
  routePinMode = 'none',
  setRoutePinMode,
  pinnedOrigin,
  pinnedDestination,
  onLocationPicked
}) => {
  const { t } = useLanguage();
  const mapElementRef = useRef<HTMLDivElement>(null);
  const popupElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  const routePinModeRef = useRef(routePinMode);
  const onLocationPickedRef = useRef(onLocationPicked);
  const setRoutePinModeRef = useRef(setRoutePinMode);

  useEffect(() => {
    routePinModeRef.current = routePinMode;
  }, [routePinMode]);

  useEffect(() => {
    onLocationPickedRef.current = onLocationPicked;
  }, [onLocationPicked]);

  useEffect(() => {
    setRoutePinModeRef.current = setRoutePinMode;
  }, [setRoutePinMode]);

  // GIS Layer Toggle States - Layers start disabled until requested by user
  const [baseLayerType, setBaseLayerType] = useState<'osm' | 'topo' | 'hot' | 'satellite'>('osm');
  const [showDemLayer, setShowDemLayer] = useState(false);
  const [showRoadsLayer, setShowRoadsLayer] = useState(false);
  const [showRouteLayer, setShowRouteLayer] = useState(false);
  const [showDrainageLayer, setShowDrainageLayer] = useState(false);
  const [showManholesLayer, setShowManholesLayer] = useState(false);
  const [showEvacuationLayer, setShowEvacuationLayer] = useState(false);
  const [showReportsLayer, setShowReportsLayer] = useState(false);
  const [showHotspotsLayer, setShowHotspotsLayer] = useState(false);
  const [showDeluge2005Layer, setShowDeluge2005Layer] = useState(false);
  const [showGroundwaterLayer, setShowGroundwaterLayer] = useState(false);

  // Automatically enable route layer when user calculates a route or deploys evacuation path
  useEffect(() => {
    if (activeRoute) {
      setShowRouteLayer(true);
    }
  }, [activeRoute]);

  // Unified Drawer & Accordion State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('roads');

  // Popup Feature Inspection Data
  const [popupContent, setPopupContent] = useState<{
    title: string;
    subtitle: string;
    badge?: { text: string; color: string };
    details: { label: string; value: string; color?: string }[];
  } | null>(null);

  // Live Lat/Lng Cursor Telemetry
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string; elev: number }>({
    lat: '0.0000',
    lng: '0.0000',
    elev: 0
  });

  const city = CITIES[selectedCityId];
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);
  const evacZones = getEvacuationZonesForCity(selectedCityId, timeOffsetMins);
  const activeEvacZones = evacZones.filter(z => z.active);

  // Derive Overall Risk Summary for the At-A-Glance Status Bar
  const overflowingCount = snapshot.overflowingManholesCount || 0;
  const severeRoads = snapshot.roadStates.filter(r => r.waterDepthCm >= 40);
  const criticalRoads = snapshot.roadStates.filter(r => r.waterDepthCm >= 20 && r.waterDepthCm < 40);
  const warningRoads = snapshot.roadStates.filter(r => r.waterDepthCm >= 8 && r.waterDepthCm < 20);
  const maxDepth = snapshot.maxWaterDepthCm;

  let overallRisk: 'severe' | 'critical' | 'warning' | 'normal' = 'normal';
  if (activeEvacZones.length > 0 || overflowingCount > 0 || severeRoads.length > 0) overallRisk = 'severe';
  else if (criticalRoads.length > 0) overallRisk = 'critical';
  else if (warningRoads.length > 0) overallRisk = 'warning';

  const activeLayersCount = [
    showDemLayer,
    showRoadsLayer,
    showDrainageLayer,
    showManholesLayer,
    showRouteLayer,
    showEvacuationLayer,
    showReportsLayer,
    showHotspotsLayer,
    showDeluge2005Layer,
    showGroundwaterLayer
  ].filter(Boolean).length;

  // 100% Free Open-Access Base Tile Layers
  const osmStandardLayerRef = useRef<TileLayer<OSM>>(
    new TileLayer({
      source: new OSM({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }),
      visible: true
    })
  );

  const openTopoLayerRef = useRef<TileLayer<XYZ>>(
    new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attributions: '&copy; OpenTopoMap'
      }),
      visible: false
    })
  );

  const osmHotLayerRef = useRef<TileLayer<XYZ>>(
    new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attributions: '&copy; OSM France'
      }),
      visible: false
    })
  );

  const esriSatLayerRef = useRef<TileLayer<XYZ>>(
    new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles &copy; Esri World Imagery'
      }),
      visible: false
    })
  );

  // Vector Sources
  const demVectorSourceRef = useRef(new VectorSource());
  const roadsVectorSourceRef = useRef(new VectorSource());
  const drainageVectorSourceRef = useRef(new VectorSource());
  const manholesVectorSourceRef = useRef(new VectorSource());
  const routeVectorSourceRef = useRef(new VectorSource());
  const evacuationVectorSourceRef = useRef(new VectorSource());
  const sheltersVectorSourceRef = useRef(new VectorSource());
  const reportsVectorSourceRef = useRef(new VectorSource());
  const hotspotsVectorSourceRef = useRef(new VectorSource());
  const deluge2005VectorSourceRef = useRef(new VectorSource());
  const groundwaterVectorSourceRef = useRef(new VectorSource());
  const pinsVectorSourceRef = useRef(new VectorSource());

  // Cluster Sources for Manholes & Citizen Pins (Zoom-based clustering)
  const manholesClusterSourceRef = useRef(
    new Cluster({
      distance: 35,
      minDistance: 20,
      source: manholesVectorSourceRef.current
    })
  );

  const reportsClusterSourceRef = useRef(
    new Cluster({
      distance: 40,
      minDistance: 25,
      source: reportsVectorSourceRef.current
    })
  );

  // Initialize Map
  useEffect(() => {
    if (!mapElementRef.current) return;

    // Create Popup Overlay
    const overlay = new Overlay({
      element: popupElementRef.current!,
      autoPan: { animation: { duration: 250 } },
      positioning: 'bottom-center',
      offset: [0, -12]
    });
    overlayRef.current = overlay;

    const demVectorLayer = new VectorLayer({
      source: demVectorSourceRef.current,
      zIndex: 5,
      opacity: 0.55
    });

    const drainageVectorLayer = new VectorLayer({
      source: drainageVectorSourceRef.current,
      zIndex: 15
    });

    const roadsVectorLayer = new VectorLayer({
      source: roadsVectorSourceRef.current,
      zIndex: 25
    });

    // Manholes Cluster Layer with Dynamic Severity Styling
    const manholesVectorLayer = new VectorLayer({
      source: manholesClusterSourceRef.current,
      zIndex: 30,
      style: (clusterFeature) => {
        const features = clusterFeature.get('features') as Feature[];
        if (!features || features.length === 0) return [];

        // 1. Single Unclustered Feature (Zoomed In)
        if (features.length === 1) {
          const mh = features[0].getProperties();
          const isOverflowing = mh.surfaceOverflowDepthCm > 0;
          const isSurcharging = mh.hydraulicCapacityPct >= 100;
          const isWarning = mh.hydraulicCapacityPct >= 70;
          const isGalli = mh.isGalli;

          if (isOverflowing) {
            return [
              new Style({
                image: new CircleStyle({
                  radius: 13,
                  stroke: new Stroke({ color: 'rgba(220, 38, 38, 0.85)', width: 2, lineDash: [3, 3] }),
                  fill: new Fill({ color: 'rgba(239, 68, 68, 0.25)' })
                })
              }),
              new Style({
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({ color: '#dc2626' }),
                  stroke: new Stroke({ color: '#ffffff', width: 2 })
                }),
                text: new Text({
                  text: `+${mh.surfaceOverflowDepthCm}cm`,
                  font: 'bold 9.5px sans-serif',
                  fill: new Fill({ color: '#991b1b' }),
                  stroke: new Stroke({ color: '#ffffff', width: 3 }),
                  offsetY: -15
                })
              })
            ];
          }

          let pinColor = isGalli ? '#0284c7' : '#059669'; // Galli blue vs main road emerald
          let pinRadius = isGalli ? 5 : 5.5;

          if (isSurcharging) {
            pinColor = '#ea580c'; // Critical Orange
            pinRadius = 7;
          } else if (isWarning) {
            pinColor = '#d97706'; // Warning Amber
            pinRadius = 6;
          }

          return [
            new Style({
              image: new CircleStyle({
                radius: pinRadius,
                fill: new Fill({ color: pinColor }),
                stroke: new Stroke({
                  color: isSurcharging ? '#fed7aa' : '#ffffff',
                  width: 2
                })
              })
            })
          ];
        }

        // 2. Clustered Features (> 1 Nodes)
        let worstStatus: 'overflow' | 'surcharge' | 'warning' | 'normal' = 'normal';
        let maxOverflow = 0;

        for (const f of features) {
          const props = f.getProperties();
          if (props.surfaceOverflowDepthCm > 0 || props.hydraulicCapacityPct >= 120) {
            worstStatus = 'overflow';
            maxOverflow = Math.max(maxOverflow, props.surfaceOverflowDepthCm);
            break;
          } else if (props.hydraulicCapacityPct >= 100) {
            worstStatus = 'surcharge';
          } else if (props.hydraulicCapacityPct >= 70) {
            if (worstStatus === 'normal') worstStatus = 'warning';
          }
        }

        let clusterColor = '#059669'; // Normal Emerald
        let strokeColor = '#34d399';
        let ringColor = 'rgba(5, 150, 105, 0.2)';

        if (worstStatus === 'overflow') {
          clusterColor = '#dc2626'; // Severe Red
          strokeColor = '#fca5a5';
          ringColor = 'rgba(220, 38, 38, 0.25)';
        } else if (worstStatus === 'surcharge') {
          clusterColor = '#ea580c'; // Critical Orange
          strokeColor = '#fed7aa';
          ringColor = 'rgba(234, 88, 12, 0.2)';
        } else if (worstStatus === 'warning') {
          clusterColor = '#d97706'; // Warning Amber
          strokeColor = '#fef08a';
          ringColor = 'rgba(217, 119, 6, 0.2)';
        }

        const radius = Math.min(22, 12 + Math.log2(features.length) * 2.8);

        return [
          new Style({
            image: new CircleStyle({
              radius: radius + 3.5,
              stroke: new Stroke({ color: strokeColor, width: 1.5 }),
              fill: new Fill({ color: ringColor })
            })
          }),
          new Style({
            image: new CircleStyle({
              radius,
              fill: new Fill({ color: clusterColor }),
              stroke: new Stroke({ color: '#ffffff', width: 2 })
            }),
            text: new Text({
              text: features.length.toString(),
              font: 'bold 10.5px sans-serif',
              fill: new Fill({ color: '#ffffff' })
            })
          })
        ];
      }
    });

    const evacuationVectorLayer = new VectorLayer({
      source: evacuationVectorSourceRef.current,
      zIndex: 18,
      opacity: 0.85
    });

    const routeVectorLayer = new VectorLayer({
      source: routeVectorSourceRef.current,
      zIndex: 35
    });

    const sheltersVectorLayer = new VectorLayer({
      source: sheltersVectorSourceRef.current,
      zIndex: 40
    });

    // Citizen Reports Cluster Layer
    const reportsVectorLayer = new VectorLayer({
      source: reportsClusterSourceRef.current,
      zIndex: 45,
      style: (clusterFeature) => {
        const features = clusterFeature.get('features') as Feature[];
        if (!features || features.length === 0) return [];

        if (features.length === 1) {
          return [
            new Style({
              image: new CircleStyle({
                radius: 7.5,
                fill: new Fill({ color: '#d97706' }),
                stroke: new Stroke({ color: '#ffffff', width: 2 })
              })
            })
          ];
        }

        const radius = Math.min(20, 11 + Math.log2(features.length) * 2.5);
        return [
          new Style({
            image: new CircleStyle({
              radius,
              fill: new Fill({ color: '#d97706' }),
              stroke: new Stroke({ color: '#ffffff', width: 2 })
            }),
            text: new Text({
              text: features.length.toString(),
              font: 'bold 10.5px sans-serif',
              fill: new Fill({ color: '#ffffff' })
            })
          })
        ];
      }
    });

    const groundwaterVectorLayer = new VectorLayer({
      source: groundwaterVectorSourceRef.current,
      zIndex: 6,
      opacity: 0.65
    });

    const hotspotsVectorLayer = new VectorLayer({
      source: hotspotsVectorSourceRef.current,
      zIndex: 32
    });

    const deluge2005VectorLayer = new VectorLayer({
      source: deluge2005VectorSourceRef.current,
      zIndex: 33
    });

    const pinsVectorLayer = new VectorLayer({
      source: pinsVectorSourceRef.current,
      zIndex: 50
    });

    const map = new Map({
      target: mapElementRef.current,
      layers: [
        osmStandardLayerRef.current,
        openTopoLayerRef.current,
        osmHotLayerRef.current,
        esriSatLayerRef.current,
        demVectorLayer,
        groundwaterVectorLayer,
        drainageVectorLayer,
        evacuationVectorLayer,
        roadsVectorLayer,
        manholesVectorLayer,
        hotspotsVectorLayer,
        deluge2005VectorLayer,
        routeVectorLayer,
        sheltersVectorLayer,
        reportsVectorLayer,
        pinsVectorLayer
      ],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([city.center[1], city.center[0]]),
        zoom: city.zoom,
        maxZoom: 19
      })
    });

    mapRef.current = map;

    // Pointer move listener for coordinates telemetry
    map.on('pointermove', (evt) => {
      const lonLat = toLonLat(evt.coordinate);
      const lat = lonLat[1];
      const lng = lonLat[0];
      const elev = getElevationAtCoordinate(lat, lng, selectedCityId);

      setCursorCoords({
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
        elev
      });
    });

    // Feature Single-Click Handler with Cluster Auto-Zoom and Map Pin Picker Intercept
    map.on('singleclick', (evt) => {
      if (routePinModeRef.current && routePinModeRef.current !== 'none') {
        const lonLat = toLonLat(evt.coordinate);
        const lat = lonLat[1];
        const lng = lonLat[0];

        if (onLocationPickedRef.current) {
          onLocationPickedRef.current(routePinModeRef.current, [lat, lng]);
        }
        if (setRoutePinModeRef.current) {
          setRoutePinModeRef.current('none');
        }

        overlay.setPosition(undefined);
        setPopupContent(null);
        return;
      }

      let featureFound = false;

      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (featureFound) return;

        // Check if clicked feature is a cluster from manholes or reports
        const clusterFeatures = feature.get('features') as Feature[] | undefined;

        if (clusterFeatures) {
          // If cluster has multiple items, smoothly zoom in to un-cluster!
          if (clusterFeatures.length > 1) {
            featureFound = true;
            const extent = createEmpty();
            clusterFeatures.forEach(f => extend(extent, f.getGeometry()!.getExtent()));
            map.getView().fit(extent, { duration: 450, maxZoom: 18, padding: [60, 60, 60, 60] });
            overlay.setPosition(undefined);
            setPopupContent(null);
            return;
          }

          // Single feature within cluster
          if (clusterFeatures.length === 1) {
            const singleFeature = clusterFeatures[0];
            const props = singleFeature.getProperties();

            if (props.type === 'physics_manhole') {
              featureFound = true;
              const isOverflowing = props.surfaceOverflowDepthCm > 0;
              const isWarning = props.hydraulicCapacityPct >= 70;
              let statusColor = 'text-emerald-700';
              if (isOverflowing) statusColor = 'text-red-600 font-bold';
              else if (isWarning) statusColor = 'text-amber-600 font-bold';

              setPopupContent({
                title: props.name,
                subtitle: props.derivedLocationLabel,
                badge: {
                  text: props.isGalli ? 'Galli Catchpit' : 'Roadway Manhole',
                  color: props.isGalli ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'
                },
                details: [
                  { label: 'Road / Galli', value: props.roadName, color: 'text-slate-800 font-semibold' },
                  { label: 'Corridor Category', value: props.highwayCategory || (props.isGalli ? 'Galli / Local Lane' : 'Municipal Thoroughfare') },
                  { label: 'Rim Alt (z_rim)', value: `${props.rimElevationMeters} m MSL` },
                  { label: 'Invert Depth', value: `${props.invertDepthMeters} m` },
                  { label: 'Pipe Diameter', value: `Ø${props.pipeDiameterMm}mm (${props.pipeSlopePct}% slope)` },
                  { label: 'Hydraulic Capacity', value: `${props.capacityLps} L/s` },
                  { label: 'Inflow Runoff', value: `${props.inflowRunoffLps} L/s` },
                  { label: 'Hydraulic Load', value: `${props.hydraulicCapacityPct}%`, color: statusColor },
                  {
                    label: 'Surcharge Status',
                    value: isOverflowing ? `+${props.surfaceOverflowDepthCm} cm (STREET OVERFLOW)` : '0 cm (Contained)',
                    color: isOverflowing ? 'text-red-600 font-bold' : 'text-emerald-700'
                  },
                  { label: 'Backpressure Coeff', value: `${Math.round(props.backpressureFactor * 100)}% resistance` }
                ]
              });
              overlay.setPosition(evt.coordinate);
              return;
            }

            if (props.type === 'report') {
              featureFound = true;
              setPopupContent({
                title: 'Citizen Ground-Truth Report',
                subtitle: props.locationName,
                badge: { text: 'Verified', color: 'bg-amber-100 text-amber-800' },
                details: [
                  { label: 'Observed Depth', value: `${props.waterDepthCm} cm`, color: 'text-amber-700 font-bold' },
                  { label: 'User Note', value: `"${props.userNote}"` }
                ]
              });
              overlay.setPosition(evt.coordinate);
              return;
            }
          }
        }

        const props = feature.getProperties();

        if (props.type === 'road') {
          featureFound = true;
          const isCritical = props.waterDepthCm >= 20;
          const isWarning = props.waterDepthCm >= 8;
          const isGalli = props.isGalli || props.highwayCategory === 'Galli / Local Lane';

          setPopupContent({
            title: props.name,
            subtitle: `Borough: ${props.borough} • Alt: ${props.demElevationMeters}m MSL`,
            badge: {
              text: isGalli ? 'Galli / Local Lane' : (props.highwayCategory || 'Arterial Corridor'),
              color: isGalli ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'
            },
            details: [
              {
                label: 'Water Depth',
                value: `${props.waterDepthCm} cm`,
                color: isCritical ? 'text-red-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-emerald-700'
              },
              {
                label: 'Severity Level',
                value: props.severity.toUpperCase(),
                color: isCritical ? 'text-red-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-emerald-700'
              },
              {
                label: 'Corridor Passability',
                value: props.waterDepthCm >= 35 ? 'IMPASSABLE / CLOSED' : props.waterDepthCm >= 15 ? 'HIGH-CLEARANCE ONLY' : 'OPEN TO TRAFFIC'
              },
              { label: 'Drainage Node Ref', value: props.drainNodeId || 'Trunk Connected' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'real_waterway') {
          featureFound = true;
          setPopupContent({
            title: props.name,
            subtitle: props.description,
            badge: { text: props.category.replace('_', ' ').toUpperCase(), color: 'bg-blue-100 text-blue-800' },
            details: [
              { label: 'Channel Width', value: `${props.widthMeters} meters` },
              { label: 'Discharge Flow', value: `${props.currentFlowLps} L/s` },
              { label: 'Capacity Load', value: `${props.surchargePct}%`, color: props.surchargePct >= 100 ? 'text-red-600 font-bold' : 'text-emerald-700' },
              { label: 'Data Source', value: 'Authentic OpenStreetMap GIS Vectors' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'pumping_station') {
          featureFound = true;
          setPopupContent({
            title: props.name,
            subtitle: `Municipal Dewatering SCADA Station (${props.locationName})`,
            badge: { text: props.isOperational ? 'OPERATIONAL' : 'STANDBY', color: props.isOperational ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800' },
            details: [
              { label: 'Pumping Capacity', value: `${props.capacityLps} L/s` },
              { label: 'Current Discharge', value: `${props.currentDischargeLps} L/s`, color: 'text-emerald-700 font-bold' },
              { label: 'Active Units', value: `${props.activePumpsCount} / ${props.totalPumpsCount}` },
              { label: 'Power Source', value: props.powerStatus === 'grid_active' ? 'Grid Power' : 'Diesel Generator' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'evacuation_zone') {
          featureFound = true;
          setPopupContent({
            title: props.name,
            subtitle: `Borough: ${props.borough} • Municipal Inundation Catchment`,
            badge: {
              text: props.severity === 'severe' ? 'CRITICAL EVACUATION' : 'ELEVATED ADVISORY',
              color: 'bg-red-600 text-white'
            },
            details: [
              { label: 'Surface Water Depth', value: `${props.waterDepthCm} cm`, color: 'text-red-600 font-bold' },
              { label: 'At-Risk Population', value: `${props.evacueePopulation?.toLocaleString()} residents` },
              { label: 'Overflowing Catchpits', value: `${props.overflowingManholesCount} active surcharge` },
              { label: 'Evacuation Protocol', value: 'High-Ground Foot Refuge', color: 'text-emerald-700 font-bold' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'safe_shelter') {
          featureFound = true;
          setPopupContent({
            title: props.name,
            subtitle: props.address,
            badge: { text: 'HIGH-GROUND REFUGE', color: 'bg-emerald-600 text-white' },
            details: [
              { label: 'Elevation Above MSL', value: `${props.elevationMeters} m`, color: 'text-emerald-700 font-bold' },
              { label: 'Refuge Capacity', value: `${props.capacityPersons?.toLocaleString()} persons` },
              { label: 'Relief Facilities', value: (props.facilities || []).slice(0, 2).join(', ') },
              { label: 'Emergency Helpline', value: props.contactEmergency }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'route_segment') {
          featureFound = true;
          setPopupContent({
            title: props.roadName,
            subtitle: `Corridor Category: ${props.highwayCategory}`,
            badge: {
              text: props.riskSeverity.toUpperCase(),
              color: props.riskSeverity === 'safe' ? 'bg-emerald-100 text-emerald-800' :
                     props.riskSeverity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            },
            details: [
              { label: 'Segment Flood Depth', value: `${props.waterDepthCm} cm`, color: props.waterDepthCm >= 20 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold' },
              { label: 'Wading Status', value: props.isPassable ? 'PASSABLE / CLEAR' : 'IMPASSABLE / BLOCKED' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'flood_hotspot') {
          featureFound = true;
          setPopupContent({
            title: props.name,
            subtitle: `Location: ${props.location || 'BMC Designated Spot'} • Ward ${props.ward || 'N/A'}`,
            badge: {
              text: (props.categoryLabel || 'Hotspot').toUpperCase(),
              color: props.category === 'chronic_spot' ? 'bg-red-600 text-white' : props.category === 'subway' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'
            },
            details: [
              { label: 'Official Register', value: 'BMC Disaster Management Spot Directory' },
              { label: 'Spot Category', value: props.categoryLabel || 'Flood Hotspot' },
              { label: 'Location Details', value: props.location || 'Low-lying intersection' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'deluge_2005') {
          featureFound = true;
          setPopupContent({
            title: '26 July 2005 Extreme Deluge Benchmark',
            subtitle: props.name,
            badge: { text: '944mm HISTORIC HIGH WATER', color: 'bg-amber-600 text-white' },
            details: [
              { label: 'Recorded Depth', value: props.depthLabel || 'High Inundation', color: 'text-amber-800 font-bold' },
              { label: 'Historical Context', value: props.note || 'BMC 26 July 2005 Disaster Log' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'groundwater_ward') {
          featureFound = true;
          setPopupContent({
            title: 'Ward Groundwater Depth',
            subtitle: props.wardName,
            badge: { text: (props.category || 'Monitored').toUpperCase(), color: 'bg-emerald-100 text-emerald-800' },
            details: [
              { label: 'Interpolated Water Table', value: props.depthM != null ? `${props.depthM} m below ground level` : 'No Depth Data', color: 'text-emerald-700 font-bold' },
              { label: 'Methodology', value: 'Ward IDW Surface from CGWB Year Book Wells' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'groundwater_well') {
          featureFound = true;
          setPopupContent({
            title: 'CGWB Hydrograph Monitoring Well',
            subtitle: props.name,
            badge: { text: 'CGWB STATION', color: 'bg-slate-100 text-slate-800' },
            details: [
              { label: 'Depth to Water Table', value: `${props.depthMeters} m bgl`, color: 'text-slate-800 font-bold' },
              { label: 'Reading Period', value: props.readingDate || 'Recent Survey' },
              { label: 'Agency', value: 'Central Ground Water Board (CGWB) Maharashtra' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        } else if (props.type === 'route') {
          featureFound = true;
          setPopupContent({
            title: props.name,
            subtitle: 'Flood-Safe Evacuation Corridor',
            badge: { text: props.isSafe ? 'Clear Path' : 'Hazard Warning', color: props.isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800' },
            details: [
              { label: 'Max Water Depth', value: `${props.maxDepthCm || 0} cm` },
              { label: 'Clearance Status', value: props.isSafe ? 'Passable for Vehicle' : 'Avoid Route' }
            ]
          });
          overlay.setPosition(evt.coordinate);
        }
      });

      if (!featureFound) {
        overlay.setPosition(undefined);
        setPopupContent(null);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Update Map Center on City Change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.getView().animate({
        center: fromLonLat([city.center[1], city.center[0]]),
        zoom: city.zoom,
        duration: 1000
      });
    }
  }, [selectedCityId]);

  // Base Map Layer Control
  useEffect(() => {
    osmStandardLayerRef.current.setVisible(baseLayerType === 'osm');
    openTopoLayerRef.current.setVisible(baseLayerType === 'topo');
    osmHotLayerRef.current.setVisible(baseLayerType === 'hot');
    esriSatLayerRef.current.setVisible(baseLayerType === 'satellite');
  }, [baseLayerType]);

  // Update DEM Surface Model Layer Features
  useEffect(() => {
    const source = demVectorSourceRef.current;
    source.clear();

    if (!showDemLayer) return;

    const gridCells = getDemSurfaceGrid(selectedCityId);
    gridCells.forEach(cell => {
      const minCorner = fromLonLat([cell.bounds[0][1], cell.bounds[0][0]]);
      const maxCorner = fromLonLat([cell.bounds[1][1], cell.bounds[1][0]]);

      const ring = [
        [minCorner[0], minCorner[1]],
        [maxCorner[0], minCorner[1]],
        [maxCorner[0], maxCorner[1]],
        [minCorner[0], maxCorner[1]],
        [minCorner[0], minCorner[1]]
      ];

      const feature = new Feature({
        geometry: new Polygon([ring]),
        type: 'dem_cell',
        elevationMeters: cell.elevationMeters,
        category: cell.category
      });

      feature.setStyle(
        new Style({
          fill: new Fill({ color: cell.color }),
          stroke: new Stroke({ color: 'rgba(255,255,255,0.06)', width: 0.5 })
        })
      );

      source.addFeature(feature);
    });

    const contours = getDemContours(selectedCityId);
    contours.forEach(contour => {
      const coords = contour.coordinates.map(pt => fromLonLat([pt[1], pt[0]]));
      const feature = new Feature({
        geometry: new LineString(coords),
        type: 'dem_contour',
        label: contour.label,
        elevation: contour.elevationMeters
      });

      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: '#1e293b',
            width: 1.5,
            lineDash: [4, 4]
          }),
          text: new Text({
            text: `${contour.elevationMeters}m`,
            font: 'bold 10px sans-serif',
            fill: new Fill({ color: '#0f172a' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 }),
            placement: 'line'
          })
        })
      );

      source.addFeature(feature);
    });
  }, [selectedCityId, showDemLayer]);

  // Update Authentic Real Waterways & Drainage Canals Vector Layer
  useEffect(() => {
    const source = drainageVectorSourceRef.current;
    source.clear();

    if (!showDrainageLayer) return;

    const dataset = getRealWaterwaysDataset(selectedCityId, timeOffsetMins);

    dataset.waterways.forEach(w => {
      const coords = w.coordinates.map(pt => fromLonLat([pt[1], pt[0]]));
      const waterwayFeature = new Feature({
        geometry: new LineString(coords),
        type: 'real_waterway',
        id: w.id,
        name: w.name,
        category: w.category,
        widthMeters: w.widthMeters,
        currentFlowLps: w.currentFlowLps,
        surchargePct: w.surchargePct,
        description: w.description
      });

      let strokeColor = '#0284c7';
      let strokeWidth = Math.max(3, Math.min(10, w.widthMeters / 6));

      if (w.category === 'river') {
        strokeColor = '#0369a1';
        strokeWidth = 9;
      } else if (w.surchargePct >= 100) {
        strokeColor = '#dc2626';
      } else if (w.surchargePct >= 70) {
        strokeColor = '#d97706';
      }

      waterwayFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: strokeWidth,
            lineCap: 'round',
            lineJoin: 'round'
          })
        })
      );

      source.addFeature(waterwayFeature);

      // Render Outfall Gate Pin at the endpoint of the waterway
      if (coords.length > 0) {
        const lastCoord = coords[coords.length - 1];
        const outfallFeature = new Feature({
          geometry: new Point(lastCoord),
          type: 'real_outfall',
          name: `${w.name} Outfall Gate`,
          capacityLps: w.capacityLps,
          surchargePct: w.surchargePct
        });

        outfallFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({ color: '#312e81' }),
              stroke: new Stroke({ color: '#ffffff', width: 2 })
            })
          })
        );

        source.addFeature(outfallFeature);
      }
    });

    // Render SCADA Dewatering Pumping Stations
    const pumpingStations = getPumpingStationsForCity(selectedCityId);
    pumpingStations.forEach(st => {
      const coord = fromLonLat([st.lng, st.lat]);
      const pumpFeature = new Feature({
        geometry: new Point(coord),
        type: 'pumping_station',
        name: st.name,
        locationName: st.locationName,
        capacityLps: st.capacityLps,
        currentDischargeLps: st.currentDischargeLps,
        activePumpsCount: st.activePumpsCount,
        totalPumpsCount: st.totalPumpsCount,
        powerStatus: st.powerStatus,
        scadaMode: st.scadaMode,
        isOperational: st.isOperational,
        description: st.description
      });

      pumpFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 8.5,
            fill: new Fill({ color: st.isOperational ? '#059669' : '#64748b' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 })
          }),
          text: new Text({
            text: st.name.split(' ')[0],
            font: 'bold 9.5px sans-serif',
            fill: new Fill({ color: '#0f172a' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetY: -14
          })
        })
      );

      source.addFeature(pumpFeature);
    });
  }, [selectedCityId, timeOffsetMins, showDrainageLayer]);

  // Update Road Network Flood Overlay
  useEffect(() => {
    const source = roadsVectorSourceRef.current;
    source.clear();

    if (!showRoadsLayer) return;

    const snapshotData = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);
    const { roads } = getCityDataset(selectedCityId);

    roads.forEach(road => {
      const roadState = snapshotData.roadStates.find(r => r.roadId === road.id);
      const depthCm = roadState ? roadState.waterDepthCm : 0;
      const severity = roadState ? roadState.severity : 'safe';
      const isGalli = road.highwayCategory === 'Galli / Local Lane' || road.id.startsWith('galli-');

      // Consistent 4-Tier Severity Palette
      let strokeColor = '#059669'; // Safe Emerald (<8cm)
      let strokeWidth = isGalli ? 4.5 : 6;

      if (depthCm >= 40) {
        strokeColor = '#dc2626'; // Severe Red (>=40cm)
        strokeWidth = isGalli ? 6.5 : 8;
      } else if (depthCm >= 20) {
        strokeColor = '#ea580c'; // Critical Orange (20-40cm)
        strokeWidth = isGalli ? 5.5 : 7;
      } else if (depthCm >= 8) {
        strokeColor = '#d97706'; // Warning Amber (8-20cm)
        strokeWidth = isGalli ? 5 : 6.5;
      }

      const coordinates = road.coordinates.map(coord => fromLonLat([coord[1], coord[0]]));
      const roadFeature = new Feature({
        geometry: new LineString(coordinates),
        type: 'road',
        id: road.id,
        name: road.name,
        borough: road.borough,
        highwayCategory: road.highwayCategory,
        isGalli,
        demElevationMeters: road.demElevationMeters,
        waterDepthCm: depthCm,
        severity,
        drainNodeId: road.drainNodeId
      });

      roadFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: strokeColor,
            width: strokeWidth,
            lineDash: isGalli ? [8, 4] : undefined,
            lineCap: 'round',
            lineJoin: 'round'
          })
        })
      );

      source.addFeature(roadFeature);
    });
  }, [selectedCityId, timeOffsetMins, showRoadsLayer]);

  // Update Physics-Derived Manholes Vector Layer
  useEffect(() => {
    const source = manholesVectorSourceRef.current;
    source.clear();

    if (!showManholesLayer) return;

    const manholes = getPhysicsDerivedManholes(selectedCityId, timeOffsetMins);

    manholes.forEach(mh => {
      const coord = fromLonLat([mh.lng, mh.lat]);

      const mhFeature = new Feature({
        geometry: new Point(coord),
        type: 'physics_manhole',
        id: mh.id,
        name: mh.name,
        roadId: mh.roadId,
        roadName: mh.roadName,
        highwayCategory: mh.highwayCategory,
        isGalli: mh.isGalli,
        derivedLocationLabel: mh.derivedLocationLabel,
        rimElevationMeters: mh.rimElevationMeters,
        invertDepthMeters: mh.invertDepthMeters,
        pipeDiameterMm: mh.pipeDiameterMm,
        pipeSlopePct: mh.pipeSlopePct,
        capacityLps: mh.capacityLps,
        inflowRunoffLps: mh.inflowRunoffLps,
        upstreamRunoffLps: mh.upstreamRunoffLps,
        hydraulicCapacityPct: mh.hydraulicCapacityPct,
        surchargeHeadMeters: mh.surchargeHeadMeters,
        surfaceOverflowDepthCm: mh.surfaceOverflowDepthCm,
        overflowRateLps: mh.overflowRateLps,
        backpressureFactor: mh.backpressureFactor,
        status: mh.status
      });

      source.addFeature(mhFeature);
    });
  }, [selectedCityId, timeOffsetMins, showManholesLayer]);

  // Update Evacuation Zones (Flood-Prone Catchments & Underpasses)
  useEffect(() => {
    const source = evacuationVectorSourceRef.current;
    source.clear();

    if (!showEvacuationLayer) return;

    const zones = getEvacuationZonesForCity(selectedCityId, timeOffsetMins);
    zones.forEach(zone => {
      // Show active zones or zones with notable depth
      if (!zone.active && zone.waterDepthCm < 15) return;

      const ring = zone.boundary.map(coord => fromLonLat([coord[1], coord[0]]));
      const zoneFeature = new Feature({
        geometry: new Polygon([ring]),
        type: 'evacuation_zone',
        id: zone.id,
        name: zone.name,
        borough: zone.borough,
        severity: zone.severity,
        waterDepthCm: zone.waterDepthCm,
        overflowingManholesCount: zone.overflowingManholesCount,
        evacueePopulation: zone.evacueePopulation,
        description: zone.description
      });

      const isExtreme = zone.severity === 'severe' || zone.waterDepthCm >= 40;

      zoneFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: isExtreme ? 'rgba(220, 38, 38, 0.9)' : 'rgba(234, 88, 12, 0.85)',
            width: 2.5,
            lineDash: [8, 5]
          }),
          fill: new Fill({
            color: isExtreme ? 'rgba(239, 68, 68, 0.18)' : 'rgba(249, 115, 22, 0.14)'
          }),
          text: new Text({
            text: `${zone.name}\nDepth: ${zone.waterDepthCm}cm • At-Risk: ${zone.evacueePopulation.toLocaleString()}`,
            font: 'bold 9.5px sans-serif',
            fill: new Fill({ color: isExtreme ? '#991b1b' : '#9a3412' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            overflow: true
          })
        })
      );

      source.addFeature(zoneFeature);
    });
  }, [selectedCityId, timeOffsetMins, showEvacuationLayer]);

  // Update Safe Assembly Shelters (High-Elevation Municipal Relief Centers)
  useEffect(() => {
    const source = sheltersVectorSourceRef.current;
    source.clear();

    if (!showEvacuationLayer) return;

    const shelters = SAFE_ASSEMBLY_SHELTERS[selectedCityId] || [];
    shelters.forEach(shelter => {
      const coord = fromLonLat([shelter.coordinates[1], shelter.coordinates[0]]);
      const shelterFeature = new Feature({
        geometry: new Point(coord),
        type: 'safe_shelter',
        id: shelter.id,
        name: shelter.name,
        address: shelter.address,
        elevationMeters: shelter.elevationMeters,
        capacityPersons: shelter.capacityPersons,
        facilities: shelter.facilities,
        contactEmergency: shelter.contactEmergency
      });

      shelterFeature.setStyle([
        new Style({
          image: new CircleStyle({
            radius: 14,
            fill: new Fill({ color: 'rgba(16, 185, 129, 0.22)' }),
            stroke: new Stroke({ color: 'rgba(5, 150, 105, 0.6)', width: 1.5 })
          })
        }),
        new Style({
          image: new CircleStyle({
            radius: 7.5,
            fill: new Fill({ color: '#059669' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          }),
          text: new Text({
            text: `${shelter.name.split(' ')[0]} (+${shelter.elevationMeters}m)`,
            font: 'bold 9.5px sans-serif',
            fill: new Fill({ color: '#064e3b' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetY: -15
          })
        })
      ]);

      source.addFeature(shelterFeature);
    });
  }, [selectedCityId, showEvacuationLayer]);

  // Update Chronic Flood Hotspots & Subways Vector Layer
  useEffect(() => {
    const source = hotspotsVectorSourceRef.current;
    source.clear();

    if (!showHotspotsLayer) return;

    fetch(`/data/${selectedCityId}-flood-hotspots.geojson`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data || !data.features) return;
        const format = new GeoJSON();
        const features = format.readFeatures(data, {
          dataProjection: 'EPSG:4326',
          featureProjection: mapRef.current?.getView().getProjection() || 'EPSG:3857'
        });

        features.forEach(f => {
          const props = f.getProperties();
          const category = props.category || 'flooding_spot';
          let color = '#ea580c'; // flooding_spot orange
          let label = 'Flooding Spot';

          if (category === 'chronic_spot') {
            color = '#dc2626'; // chronic red
            label = 'Chronic Flood Spot';
          } else if (category === 'subway') {
            color = '#2563eb'; // subway blue
            label = 'Flood-Prone Subway';
          }

          f.setProperties({
            type: 'flood_hotspot',
            category,
            categoryLabel: props.category_label || label,
            name: props.name || label,
            ward: props.ward,
            location: props.location
          });

          f.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({ color }),
                stroke: new Stroke({ color: '#ffffff', width: 2 })
              }),
              text: new Text({
                text: props.name || label,
                font: 'bold 9.5px sans-serif',
                fill: new Fill({ color: '#0f172a' }),
                stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
                offsetY: -14
              })
            })
          );
        });

        source.addFeatures(features);
      })
      .catch(() => {});
  }, [selectedCityId, showHotspotsLayer]);

  // Update Historic Deluge Benchmark Vector Layer (2005 / 2023 Extremes)
  useEffect(() => {
    const source = deluge2005VectorSourceRef.current;
    source.clear();

    if (!showDeluge2005Layer) return;

    const delugeFile =
      selectedCityId === 'delhi'
        ? '/geojson/delhi-flood-2023-hotspots.geojson'
        : selectedCityId === 'chennai'
        ? '/geojson/chennai-flood-2005-hotspots.geojson'
        : '/geojson/mumbai-flood-2005-hotspots.geojson';

    fetch(delugeFile)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data || !data.features) return;
        const format = new GeoJSON();
        const features = format.readFeatures(data, {
          dataProjection: 'EPSG:4326',
          featureProjection: mapRef.current?.getView().getProjection() || 'EPSG:3857'
        });

        features.forEach(f => {
          const props = f.getProperties();
          f.setProperties({
            type: 'deluge_2005',
            name: props.name || '2005 Deluge High Water Mark',
            depthLabel: props.depth_label,
            note: props.note
          });

          f.setStyle(
            new Style({
              image: new CircleStyle({
                radius: 8,
                fill: new Fill({ color: '#f59e0b' }),
                stroke: new Stroke({ color: '#78350f', width: 2 })
              }),
              text: new Text({
                text: `2005: ${props.depth_label || 'High Water'}`,
                font: 'bold 9.5px sans-serif',
                fill: new Fill({ color: '#78350f' }),
                stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
                offsetY: -15
              })
            })
          );
        });

        source.addFeatures(features);
      })
      .catch(() => {});
  }, [selectedCityId, showDeluge2005Layer]);

  // Update Ward Groundwater Depth IDW Vector Layer
  useEffect(() => {
    const source = groundwaterVectorSourceRef.current;
    source.clear();

    if (!showGroundwaterLayer) return;

    const wardFile = selectedCityId === 'mumbai' ? '/geojson/mumbai-wards-2023.geojson' : selectedCityId === 'delhi' ? '/geojson/delhi-districts.geojson' : '/geojson/chennai-wards-2022.geojson';

    Promise.all([
      fetch(wardFile).then(r => (r.ok ? r.json() : null)),
      fetch(`/api/groundwater?city=${selectedCityId}`).then(r => (r.ok ? r.json() : null))
    ]).then(([wardsGeoJson, gwApiData]) => {
      if (!wardsGeoJson || !wardsGeoJson.features) return;

      const format = new GeoJSON();
      const features = format.readFeatures(wardsGeoJson, {
        dataProjection: 'EPSG:4326',
        featureProjection: mapRef.current?.getView().getProjection() || 'EPSG:3857'
      });

      const wardMap: Record<number, any> = {};
      (gwApiData?.wards || []).forEach((w: any) => {
        wardMap[Number(w.wardNumber)] = w;
      });

      features.forEach(f => {
        const props = f.getProperties();
        const wardNo = Number(props.ward_no || props.ward_id || props.FID);
        const wardData = wardMap[wardNo];
        const depthM = wardData?.depthM ?? null;
        const fillColor = getGroundwaterColor(depthM);

        f.setProperties({
          type: 'groundwater_ward',
          wardNumber: wardNo,
          wardName: wardData?.wardName || props.ward_label || `Ward ${wardNo}`,
          depthM,
          category: wardData?.category || 'moderate'
        });

        f.setStyle(
          new Style({
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: '#334155', width: 1.2 })
          })
        );
      });

      source.addFeatures(features);

      // Render CGWB Station Pins
      const stations = gwApiData?.stations || [];
      stations.forEach((well: any) => {
        const reading = well.readings?.[well.readings.length - 1];
        if (!reading) return;
        const depth = Math.abs(reading.depth_m_bgl);
        const coord = fromLonLat([well.lng || well.lon, well.lat]);

        const wellFeature = new Feature({
          geometry: new Point(coord),
          type: 'groundwater_well',
          name: well.name,
          depthMeters: depth,
          readingDate: `${reading.month}/${reading.year}`
        });

        wellFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({ color: getGroundwaterColor(depth) }),
              stroke: new Stroke({ color: '#0f172a', width: 1.5, lineDash: [2, 2] })
            })
          })
        );

        source.addFeature(wellFeature);
      });
    }).catch(() => {});
  }, [selectedCityId, showGroundwaterLayer]);

  // Update Active Route Layer Features (Vehicle-Aware Segment Risk & Evacuation Styling)
  useEffect(() => {
    const source = routeVectorSourceRef.current;
    source.clear();

    if (!showRouteLayer || !activeRoute) return;

    const enhanced = activeRoute as EnhancedNavigationRoute;
    const isBlocked = enhanced.isBlocked;
    const isEvacuation =
      enhanced.name?.toLowerCase().includes('evacuation') ||
      enhanced.id?.includes('evac') ||
      enhanced.vehicleType === 'pedestrian';

    // 1. Render Segment-Level Risk Polylines if available
    if (enhanced.segments && enhanced.segments.length > 0) {
      enhanced.segments.forEach((seg) => {
        const coords = seg.coordinates.map(pt => fromLonLat([pt[1], pt[0]]));
        if (coords.length < 2) return;

        const segFeature = new Feature({
          geometry: new LineString(coords),
          type: 'route_segment',
          roadName: seg.roadName,
          highwayCategory: seg.highwayCategory,
          waterDepthCm: seg.waterDepthCm,
          riskSeverity: seg.riskSeverity,
          isPassable: seg.isPassable
        });

        let strokeColor = '#059669'; // Safe
        let strokeWidth = isEvacuation ? 7 : 6;
        let lineDash: number[] | undefined = undefined;

        if (seg.riskSeverity === 'severe' || !seg.isPassable) {
          strokeColor = '#dc2626'; // Impassable
          strokeWidth = 7.5;
          lineDash = [6, 4];
        } else if (seg.riskSeverity === 'critical') {
          strokeColor = '#ea580c'; // Critical
          strokeWidth = 7;
        } else if (seg.riskSeverity === 'warning') {
          strokeColor = '#d97706'; // Warning
          strokeWidth = 6.5;
        }

        segFeature.setStyle([
          ...(isEvacuation
            ? [
                new Style({
                  stroke: new Stroke({
                    color: strokeColor === '#dc2626' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                    width: strokeWidth + 6
                  })
                })
              ]
            : []),
          new Style({
            stroke: new Stroke({
              color: strokeColor,
              width: strokeWidth,
              lineDash,
              lineCap: 'round',
              lineJoin: 'round'
            })
          })
        ]);

        source.addFeature(segFeature);
      });
    } else {
      // Fallback single line
      const coordinates = activeRoute.coordinates.map(coord => fromLonLat([coord[1], coord[0]]));
      const routeFeature = new Feature({
        geometry: new LineString(coordinates),
        type: 'route',
        name: activeRoute.name,
        isSafe: activeRoute.isSafe,
        maxDepthCm: activeRoute.maxWaterDepthCm
      });

      routeFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: isBlocked ? '#dc2626' : (activeRoute.isSafe ? '#059669' : '#dc2626'),
            width: 6,
            lineDash: isBlocked || !activeRoute.isSafe ? [8, 4] : undefined,
            lineCap: 'round',
            lineJoin: 'round'
          })
        })
      );

      source.addFeature(routeFeature);
    }

    // 2. Terminal Markers (Start Departure & Destination Refuge)
    if (activeRoute.coordinates && activeRoute.coordinates.length > 1) {
      const startCoord = fromLonLat([activeRoute.coordinates[0][1], activeRoute.coordinates[0][0]]);
      const startPoint = new Feature({
        geometry: new Point(startCoord),
        type: 'route_node'
      });
      startPoint.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7.5,
            fill: new Fill({ color: '#10b981' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          }),
          text: new Text({
            text: 'START',
            font: 'bold 9px sans-serif',
            fill: new Fill({ color: '#064e3b' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetY: -13
          })
        })
      );
      source.addFeature(startPoint);

      const lastIdx = activeRoute.coordinates.length - 1;
      const endCoord = fromLonLat([activeRoute.coordinates[lastIdx][1], activeRoute.coordinates[lastIdx][0]]);
      const endPoint = new Feature({
        geometry: new Point(endCoord),
        type: 'route_node'
      });
      endPoint.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 8.5,
            fill: new Fill({ color: isEvacuation ? '#059669' : '#2563eb' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          }),
          text: new Text({
            text: isEvacuation ? 'REFUGE' : 'DEST',
            font: 'bold 9px sans-serif',
            fill: new Fill({ color: isEvacuation ? '#064e3b' : '#1e3a8a' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 }),
            offsetY: -14
          })
        })
      );
      source.addFeature(endPoint);
    }
  }, [activeRoute, showRouteLayer]);

  // Update Citizen Reports Features
  useEffect(() => {
    const source = reportsVectorSourceRef.current;
    source.clear();

    if (!showReportsLayer) return;

    citizenReports.forEach(report => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([report.lng, report.lat])),
        type: 'report',
        id: report.id,
        locationName: report.locationName,
        waterDepthCm: report.waterDepthCm,
        userNote: report.userNote
      });

      source.addFeature(feature);
    });
  }, [citizenReports, showReportsLayer]);

  // Render Interactive Pinned Markers (Start Origin A & Destination Refuge B)
  useEffect(() => {
    const source = pinsVectorSourceRef.current;
    source.clear();

    if (pinnedOrigin) {
      const coord = fromLonLat([pinnedOrigin[1], pinnedOrigin[0]]);
      const originPoint = new Feature({
        geometry: new Point(coord),
        type: 'pinned_origin'
      });

      originPoint.setStyle([
        new Style({
          image: new CircleStyle({
            radius: 16,
            fill: new Fill({ color: 'rgba(16, 185, 129, 0.25)' }),
            stroke: new Stroke({ color: 'rgba(16, 185, 129, 0.6)', width: 2 })
          })
        }),
        new Style({
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({ color: '#059669' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 })
          }),
          text: new Text({
            text: 'START (A)',
            font: 'bold 10px sans-serif',
            fill: new Fill({ color: '#064e3b' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            offsetY: -17
          })
        })
      ]);

      source.addFeature(originPoint);
    }

    if (pinnedDestination) {
      const coord = fromLonLat([pinnedDestination[1], pinnedDestination[0]]);
      const destPoint = new Feature({
        geometry: new Point(coord),
        type: 'pinned_destination'
      });

      destPoint.setStyle([
        new Style({
          image: new CircleStyle({
            radius: 16,
            fill: new Fill({ color: 'rgba(239, 68, 68, 0.25)' }),
            stroke: new Stroke({ color: 'rgba(239, 68, 68, 0.6)', width: 2 })
          })
        }),
        new Style({
          image: new CircleStyle({
            radius: 9,
            fill: new Fill({ color: '#dc2626' }),
            stroke: new Stroke({ color: '#ffffff', width: 2.5 })
          }),
          text: new Text({
            text: 'DEST (B)',
            font: 'bold 10px sans-serif',
            fill: new Fill({ color: '#7f1d1d' }),
            stroke: new Stroke({ color: '#ffffff', width: 3 }),
            offsetY: -17
          })
        })
      ]);

      source.addFeature(destPoint);
    }
  }, [pinnedOrigin, pinnedDestination]);

  // Fly to Selected Feature (from AlertFeed or DrainageGraphPanel)
  useEffect(() => {
    if (!selectedFeatureId || !mapRef.current || !overlayRef.current) return;

    if (selectedFeatureId.startsWith('physics-mh-') || selectedFeatureId.startsWith('mh-')) {
      const manholes = getPhysicsDerivedManholes(selectedCityId, timeOffsetMins);
      const mh = manholes.find(m => m.id === selectedFeatureId);
      if (mh) {
        const coord = fromLonLat([mh.lng, mh.lat]);
        mapRef.current.getView().animate({ center: coord, zoom: 17, duration: 600 });
        const isOverflowing = mh.surfaceOverflowDepthCm > 0;
        const isWarning = mh.hydraulicCapacityPct >= 70;
        let statusColor = 'text-emerald-700';
        if (isOverflowing) statusColor = 'text-red-600 font-bold';
        else if (isWarning) statusColor = 'text-amber-600 font-bold';

        setPopupContent({
          title: mh.name,
          subtitle: mh.derivedLocationLabel,
          badge: {
            text: mh.isGalli ? 'Galli Catchpit' : 'Roadway Manhole',
            color: mh.isGalli ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'
          },
          details: [
            { label: 'Road / Galli', value: mh.roadName, color: 'text-slate-800 font-semibold' },
            { label: 'Rim Alt (z_rim)', value: `${mh.rimElevationMeters} m MSL` },
            { label: 'Pipe Diameter', value: `Ø${mh.pipeDiameterMm}mm (${mh.pipeSlopePct}% slope)` },
            { label: 'Hydraulic Capacity', value: `${mh.capacityLps} L/s` },
            { label: 'Inflow Runoff', value: `${mh.inflowRunoffLps} L/s` },
            { label: 'Hydraulic Load', value: `${mh.hydraulicCapacityPct}%`, color: statusColor },
            {
              label: 'Surcharge Status',
              value: isOverflowing ? `+${mh.surfaceOverflowDepthCm} cm (STREET OVERFLOW)` : '0 cm (Contained)',
              color: isOverflowing ? 'text-red-600 font-bold' : 'text-emerald-700'
            }
          ]
        });
        overlayRef.current.setPosition(coord);
      }
    } else {
      const { roads } = getCityDataset(selectedCityId);
      const road = roads.find(r => r.id === selectedFeatureId);
      if (road && road.coordinates.length > 0) {
        const midIdx = Math.floor(road.coordinates.length / 2);
        const midCoord = road.coordinates[midIdx];
        const coord = fromLonLat([midCoord[1], midCoord[0]]);
        mapRef.current.getView().animate({ center: coord, zoom: 16, duration: 600 });
        const snapshotData = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);
        const roadState = snapshotData.roadStates.find(r => r.roadId === road.id);
        const depthCm = roadState ? roadState.waterDepthCm : 0;
        const severity = roadState ? roadState.severity : 'safe';
        const isCritical = depthCm >= 20;
        const isWarning = depthCm >= 8;
        const isGalli = road.highwayCategory === 'Galli / Local Lane' || road.id.startsWith('galli-');

        setPopupContent({
          title: road.name,
          subtitle: `Borough: ${road.borough} • DEM Alt: ${road.demElevationMeters}m MSL`,
          badge: {
            text: isGalli ? 'Galli / Local Lane' : (road.highwayCategory || 'Arterial Corridor'),
            color: isGalli ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'
          },
          details: [
            {
              label: 'Water Depth',
              value: `${depthCm} cm`,
              color: isCritical ? 'text-red-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-emerald-700'
            },
            {
              label: 'Severity Level',
              value: severity.toUpperCase(),
              color: isCritical ? 'text-red-600 font-bold' : isWarning ? 'text-amber-600 font-bold' : 'text-emerald-700'
            },
            {
              label: 'Corridor Passability',
              value: depthCm >= 35 ? 'IMPASSABLE / CLOSED' : depthCm >= 15 ? 'HIGH-CLEARANCE ONLY' : 'OPEN TO TRAFFIC'
            }
          ]
        });
        overlayRef.current.setPosition(coord);
      }
    }
  }, [selectedFeatureId, selectedCityId, timeOffsetMins]);

  // Overall Status Bar Color Classes
  const statusStyles = {
    severe: {
      dot: 'bg-red-500 animate-ping',
      border: 'border-red-300 bg-red-50/90 text-red-900',
      badge: 'bg-red-600 text-white',
      label: 'SEVERE FLOOD EMERGENCY'
    },
    critical: {
      dot: 'bg-orange-500 animate-pulse',
      border: 'border-orange-300 bg-orange-50/90 text-orange-950',
      badge: 'bg-orange-600 text-white',
      label: 'CRITICAL INUNDATION WATCH'
    },
    warning: {
      dot: 'bg-amber-500',
      border: 'border-amber-300 bg-amber-50/90 text-amber-950',
      badge: 'bg-amber-500 text-white',
      label: 'ELEVATED FLOOD ADVISORY'
    },
    normal: {
      dot: 'bg-emerald-500',
      border: 'border-emerald-200 bg-white/95 text-slate-800',
      badge: 'bg-emerald-600 text-white',
      label: 'FLOOD RISK NORMAL'
    }
  }[overallRisk];

  const toggleAccordion = (key: string) => {
    setExpandedAccordion(prev => (prev === key ? null : key));
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs select-none">
      {/* 1. OpenLayers Map Canvas Element */}
      <div ref={mapElementRef} className="w-full h-full z-0 bg-slate-100" />

      {/* Active Pin Picker Mode Notification Banner */}
      {routePinMode !== 'none' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-teal-500/50 flex items-center space-x-3 animate-pulse">
          <MapPin className={`w-5 h-5 ${routePinMode === 'origin' ? 'text-emerald-400' : 'text-red-400'}`} />
          <span className="text-xs font-bold">
            Click anywhere on the map to set{' '}
            <span
              className={
                routePinMode === 'origin'
                  ? 'text-emerald-400 font-mono font-extrabold underline'
                  : 'text-red-400 font-mono font-extrabold underline'
              }
            >
              {routePinMode === 'origin' ? 'Start Origin (A)' : 'Destination Refuge (B)'}
            </span>
          </span>
          <button
            onClick={() => setRoutePinMode && setRoutePinMode('none')}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all ml-1"
            title="Cancel Pin Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Primary At-a-Glance Flood Risk Status Bar (Top Center) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 max-w-[94vw] pointer-events-auto">
        <div className={`flex items-center gap-2 md:gap-3 px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-all ${statusStyles.border}`}>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${statusStyles.dot}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${overallRisk === 'severe' ? 'bg-red-600' : overallRisk === 'critical' ? 'bg-orange-600' : overallRisk === 'warning' ? 'bg-amber-500' : 'bg-emerald-600'}`} />
            </span>
            <span className="font-extrabold text-xs tracking-tight text-slate-800">
              {city.name}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusStyles.badge}`}>
              {statusStyles.label}
            </span>
            {activeEvacZones.length > 0 && (
              <span className="hidden md:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-red-700 text-white text-[9.5px] font-extrabold uppercase tracking-wider animate-pulse shadow-sm">
                <span>{activeEvacZones.length} EVACUATION {activeEvacZones.length === 1 ? 'ZONE' : 'ZONES'}</span>
              </span>
            )}
          </div>

          {/* Quick Glancing Metrics */}
          <div className="hidden sm:flex items-center space-x-2 border-l border-slate-300/60 pl-2.5 text-[11px] font-mono">
            <span className="text-slate-600">{snapshot.rainfallRateMmHr} mm/h</span>
            <span className="text-slate-300">•</span>
            <span className={overflowingCount > 0 ? 'text-red-600 font-bold' : 'text-slate-600'}>
              {overflowingCount} Overflow
            </span>
            <span className="text-slate-300">•</span>
            {activeEvacZones.length > 0 ? (
              <span className="text-red-700 font-bold truncate max-w-[140px]">
                {activeEvacZones[0].name.split(' ')[0]} Evac
              </span>
            ) : (
              <span className={maxDepth >= 20 ? 'text-red-600 font-bold' : 'text-slate-600'}>
                Max: {maxDepth}cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Collapsible Side Drawer Trigger Button (Authority Only) */}
      {!isDrawerOpen && personaMode === 'authority' && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="absolute top-3 right-3 z-20 flex items-center space-x-2 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-teal-800 font-bold text-xs shadow-md hover:bg-slate-50 transition-all group"
          title="Open GIS Layers & Legend Manager"
        >
          <Layers className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Layers & Legend</span>
          <span className="px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono text-[10px] font-bold">
            {activeLayersCount}/7
          </span>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {/* 4. Unified Slide-Out Sidebar Drawer (Layers & Interactive Legend) */}
      {isDrawerOpen && personaMode === 'authority' && (
        <div className="absolute top-3 right-3 z-30 w-80 md:w-84 max-h-[calc(100%-24px)] flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden transition-all animate-in fade-in slide-in-from-right-3 duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 bg-slate-50/70 shrink-0">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span className="font-bold text-slate-800 text-xs">Layers & Legend</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-50 text-teal-700 font-bold rounded-full border border-teal-200">
                {activeLayersCount}/7 Active
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-all"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="p-3.5 space-y-3 overflow-y-auto flex-1 text-xs">
            {/* Base Map Selector (Segmented Control) */}
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                Base Map Source
              </span>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setBaseLayerType('osm')}
                  className={`py-1 px-1.5 rounded-lg font-bold text-[10.5px] transition-all ${
                    baseLayerType === 'osm'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  OSM
                </button>
                <button
                  onClick={() => setBaseLayerType('topo')}
                  className={`py-1 px-1.5 rounded-lg font-bold text-[10.5px] transition-all ${
                    baseLayerType === 'topo'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Topo
                </button>
                <button
                  onClick={() => setBaseLayerType('hot')}
                  className={`py-1 px-1.5 rounded-lg font-bold text-[10.5px] transition-all ${
                    baseLayerType === 'hot'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  HOT
                </button>
                <button
                  onClick={() => setBaseLayerType('satellite')}
                  className={`py-1 px-1.5 rounded-lg font-bold text-[10.5px] transition-all ${
                    baseLayerType === 'satellite'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Unified Layer Rows with Inline Accordion Legends */}
            <div className="space-y-2 pt-1">
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                Map Layers & Legends
              </span>

              {/* 0. BMC Chronic Flood Hotspots & Subways */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Chronic Spots & Subways</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showHotspotsLayer}
                      onChange={(e) => setShowHotspotsLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('hotspots')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'hotspots' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'hotspots' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-[10.5px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
                        <span className="text-slate-600">Chronic Spot</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                        <span className="text-slate-600">Flood Subway</span>
                      </div>
                      <div className="flex items-center space-x-1.5 col-span-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shrink-0" />
                        <span className="text-slate-600">Other Monitored Hotspot</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      BMC Official Disaster Management Spot Register
                    </div>
                  </div>
                )}
              </div>

              {/* 0b. 26 July 2005 Extreme Deluge Benchmark */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Waves className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">2005 Deluge Benchmark</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showDeluge2005Layer}
                      onChange={(e) => setShowDeluge2005Layer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('deluge2005')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'deluge2005' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'deluge2005' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-[10.5px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-800 shrink-0" />
                      <span className="text-amber-900 font-bold">26 July 2005 Historic High Water Marks</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      944mm single-day extreme cloudburst benchmark data
                    </div>
                  </div>
                )}
              </div>

              {/* 0c. CGWB Groundwater Wards & Wells */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Mountain className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Groundwater Depth & Wells</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showGroundwaterLayer}
                      onChange={(e) => setShowGroundwaterLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('groundwater')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'groundwater' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'groundwater' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-[10.5px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-green-500 shrink-0" />
                        <span className="text-slate-600">0-3m Healthy</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-lime-500 shrink-0" />
                        <span className="text-slate-600">3-6m Moderate</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500 shrink-0" />
                        <span className="text-slate-600">6-10m Declining</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
                        <span className="text-slate-600">10-15m Stressed</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shrink-0" />
                        <span className="text-slate-600">15-25m Critical</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-red-900 shrink-0" />
                        <span className="text-slate-600">&gt;25m Crisis</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      Ward IDW surface estimate from CGWB Year Book wells
                    </div>
                  </div>
                )}
              </div>

              {/* 1. Road Inundation Layer */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Route className="w-4 h-4 text-slate-700" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Road Inundation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showRoadsLayer}
                      onChange={(e) => setShowRoadsLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('roads')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'roads' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'roads' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-[10.5px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="text-slate-600">&lt;8cm Safe</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-slate-600">8-20cm Warning</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-slate-600">20-40cm Critical</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-red-600 shrink-0" />
                        <span className="text-red-600 font-bold">&gt;40cm Impassable</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                      <span>Solid line: Highway</span>
                      <span>Dashed line: Local Galli</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Physics Manhole & Galli Graph Layer */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Underground Manholes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showManholesLayer}
                      onChange={(e) => setShowManholesLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('manholes')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'manholes' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'manholes' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-[10.5px]">
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="text-slate-600">&lt;70% Contained</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-slate-600">70-99% Warning</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-slate-600">100-120% Surcharge</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 border border-red-300" />
                        <span className="text-red-600 font-bold">&gt;120% Overflow</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span className="font-semibold">Clustering Active:</span> Nodes cluster by worst severity at zoom-out. Click badge to zoom into cluster.
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Real Rivers & Drainage Canals Layer */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Waves className="w-4 h-4 text-sky-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Rivers & Drainage Canals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showDrainageLayer}
                      onChange={(e) => setShowDrainageLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('drainage')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'drainage' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'drainage' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-1.5 text-[10.5px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-2 bg-sky-700 rounded-full" />
                        <span className="font-semibold text-slate-700">Major River Spine</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[10px]">Mithi / Yamuna / Adyar</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-1.5 bg-teal-600 rounded-full" />
                        <span className="font-semibold text-slate-700">Drainage Nallah</span>
                      </div>
                      <span className="text-emerald-700 font-mono text-[10px]">Normal Discharge</span>
                    </div>
                    <div className="flex items-center space-x-2 pt-0.5 text-[10px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-indigo-900" />
                      <span>Sluice Outfall Gate Pin</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-600 ml-2" />
                      <span>SCADA Pump Station</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. CartoDEM v3 Elevation Layer */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Mountain className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">CartoDEM v3 Elevation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showDemLayer}
                      onChange={(e) => setShowDemLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('dem')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'dem' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'dem' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-1 text-[10.5px]">
                    {DEM_LEGEND.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-3 h-3 rounded-xs border border-black/10 shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-slate-700">{item.label}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[9.5px]">{item.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Evacuation Zones & Safe Shelters Layer */}
              <div className="border border-red-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-red-50/50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Evacuation Zones & Shelters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showEvacuationLayer}
                      onChange={(e) => setShowEvacuationLayer(e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('evac')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'evac' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'evac' && (
                  <div className="px-3 pb-3 pt-1 border-t border-red-100 bg-red-50/30 space-y-1.5 text-[10.5px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-2 border border-dashed border-red-600 bg-red-200/60 rounded-xs" />
                        <span className="font-semibold text-slate-700">Evacuation Basin Polygon</span>
                      </div>
                      <span className="text-red-600 font-mono text-[10px] font-bold">&gt;25-40cm Sump</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-300" />
                        <span className="font-semibold text-slate-700">Safe Assembly Shelter</span>
                      </div>
                      <span className="text-emerald-700 font-mono text-[10px] font-bold">&gt;6m MSL Refuge</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="font-semibold text-slate-700">Foot Evacuation Galli Corridor</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[10px]">Zero Stalling</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Vehicle Flood-Safe Routing & Segment Risk Layer */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Vehicle Navigation Route</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showRouteLayer}
                      onChange={(e) => setShowRouteLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('route')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'route' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'route' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-1.5 text-[10.5px]">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        <span className="text-slate-700 font-medium">Safe Corridor</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-slate-700 font-medium">Warning (8-20cm)</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-slate-700 font-medium">Critical (20-40cm)</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-red-600 shrink-0 border border-red-300" />
                        <span className="text-red-600 font-bold">Impassable / Block</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span>Start Departure</span>
                      <span>High-Elevation Refuge</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. Citizen Ground-Truth Reports Layer */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="flex items-center justify-between p-2.5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-slate-800 text-[11.5px]">Citizen Ground-Truth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showReportsLayer}
                      onChange={(e) => setShowReportsLayer(e.target.checked)}
                      className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <button
                      onClick={() => toggleAccordion('reports')}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                    >
                      {expandedAccordion === 'reports' ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedAccordion === 'reports' && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-1 text-[10.5px]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white shrink-0" />
                      <span className="text-slate-700">Crowdsourced waterlogged depth pin</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Minimal Coordinate & Elevation Floating Glass Chip (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-full text-[11px] font-mono text-slate-200 shadow-xl flex items-center space-x-2.5">
        <Compass className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span>{cursorCoords.lat}° N, {cursorCoords.lng}° E</span>
        <span className="w-1 h-1 rounded-full bg-slate-500" />
        <span className="font-bold text-teal-300">
          {cursorCoords.elev} m MSL
        </span>
      </div>

      {/* 6. Feature Inspection Popup Card */}
      <div ref={popupElementRef} className="ol-popup-card min-w-[220px] max-w-[280px]">
        {popupContent && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1.5">
              <h4 className="font-bold text-teal-900 text-xs truncate">{popupContent.title}</h4>
              {popupContent.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${popupContent.badge.color}`}>
                  {popupContent.badge.text}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">{popupContent.subtitle}</p>
            <div className="border-t border-slate-200 pt-1.5 space-y-1 text-[11px]">
              {popupContent.details.map((d, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10.5px]">{d.label}:</span>
                  <span className={`font-bold font-mono text-[10.5px] ${d.color || 'text-slate-800'}`}>
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
