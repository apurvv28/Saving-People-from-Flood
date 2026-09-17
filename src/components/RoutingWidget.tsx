'use client';

import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Truck,
  Car,
  Bike,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Footprints,
  AlertCircle,
  Siren,
  LifeBuoy,
  Home,
  PhoneCall
} from 'lucide-react';
import {
  VehicleType,
  VEHICLE_PROFILES,
  calculateFloodSafeRoutes,
  calculateFloodSafeRoutesAsync,
  EnhancedNavigationRoute
} from '@/lib/routing-engine';
import {
  getEvacuationZonesForCity,
  generateEvacuationPlanForZone,
  EvacuationPlan
} from '@/lib/evacuation-service';
import { CityId, CITIES, NavigationRoute } from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';
import { EvacuationPlanModal } from '@/components/EvacuationPlanModal';

interface RoutingWidgetProps {
  selectedCityId: CityId;
  timeOffsetMins: number;
  activeRoute: NavigationRoute | null;
  setActiveRoute: (route: NavigationRoute | null) => void;
  routePinMode?: 'none' | 'origin' | 'destination';
  setRoutePinMode?: (mode: 'none' | 'origin' | 'destination') => void;
  pinnedOrigin?: [number, number] | null;
  pinnedDestination?: [number, number] | null;
}

export const RoutingWidget: React.FC<RoutingWidgetProps> = ({
  selectedCityId,
  timeOffsetMins,
  activeRoute,
  setActiveRoute,
  routePinMode = 'none',
  setRoutePinMode,
  pinnedOrigin,
  pinnedDestination
}) => {
  const { t } = useLanguage();
  const city = CITIES[selectedCityId];

  // Routing Mode: Standard Vehicle Route Planner vs Emergency Evacuation Mode
  const [activeTab, setActiveTab] = useState<'vehicle_routing' | 'evacuation_mode'>('vehicle_routing');

  const defaultLocations: Record<CityId, { origin: string; dest: string }> = {
    mumbai: { origin: 'Parel South (Lower Parel)', dest: 'Sion North Junction' },
    delhi: { origin: 'Connaught Place Outer Ring', dest: 'ITO Central Junction' },
    chennai: { origin: 'Velachery Station Road', dest: 'Saidapet Adyar Bridge' }
  };

  const [origin, setOrigin] = useState(defaultLocations[selectedCityId].origin);
  const [destination, setDestination] = useState(defaultLocations[selectedCityId].dest);
  const [vehicle, setVehicle] = useState<VehicleType>('ambulance');
  const [routesResult, setRoutesResult] = useState<{
    standardRoute: EnhancedNavigationRoute;
    safeRoute: EnhancedNavigationRoute;
  } | null>(null);

  // Evacuation Mode State
  const [selectedEvacZoneId, setSelectedEvacZoneId] = useState<string>('');
  const [evacuationPlan, setEvacuationPlan] = useState<EvacuationPlan | null>(null);
  const [isEvacModalOpen, setIsEvacModalOpen] = useState<boolean>(false);

  const evacZones = getEvacuationZonesForCity(selectedCityId, timeOffsetMins);
  const activeEvacZones = evacZones.filter(z => z.active);

  useEffect(() => {
    setOrigin(defaultLocations[selectedCityId].origin);
    setDestination(defaultLocations[selectedCityId].dest);
    setRoutesResult(null);
    setActiveRoute(null);
    if (evacZones.length > 0) {
      setSelectedEvacZoneId(evacZones[0].id);
    }
  }, [selectedCityId]);

  // Update origin/destination when map pin coordinates change
  useEffect(() => {
    if (pinnedOrigin) {
      setOrigin(`${pinnedOrigin[0].toFixed(4)}, ${pinnedOrigin[1].toFixed(4)}`);
    }
  }, [pinnedOrigin]);

  useEffect(() => {
    if (pinnedDestination) {
      setDestination(`${pinnedDestination[0].toFixed(4)}, ${pinnedDestination[1].toFixed(4)}`);
    }
  }, [pinnedDestination]);

  // Re-run routing when vehicle type, origin, destination, or time changes
  useEffect(() => {
    let isMounted = true;
    if (activeTab === 'vehicle_routing') {
      const results = calculateFloodSafeRoutes(origin, destination, vehicle, timeOffsetMins, selectedCityId);
      setRoutesResult(results);
      setActiveRoute(results.safeRoute);

      calculateFloodSafeRoutesAsync(origin, destination, vehicle, timeOffsetMins, selectedCityId).then((realResults) => {
        if (isMounted && realResults) {
          setRoutesResult(realResults);
          setActiveRoute(realResults.safeRoute);
        }
      });
    } else {
      const plan = generateEvacuationPlanForZone(selectedEvacZoneId, selectedCityId, timeOffsetMins);
      setEvacuationPlan(plan);
      if (plan) {
        setActiveRoute(plan.footRoute);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [origin, destination, vehicle, timeOffsetMins, selectedCityId, selectedEvacZoneId, activeTab]);

  const handleSearch = () => {
    const results = calculateFloodSafeRoutes(origin, destination, vehicle, timeOffsetMins, selectedCityId);
    setRoutesResult(results);
    setActiveRoute(results.safeRoute);

    calculateFloodSafeRoutesAsync(origin, destination, vehicle, timeOffsetMins, selectedCityId).then((realResults) => {
      if (realResults) {
        setRoutesResult(realResults);
        setActiveRoute(realResults.safeRoute);
      }
    });
  };

  const handleDeployEvacuation = (mode: 'foot' | 'vehicle') => {
    if (!evacuationPlan) return;
    if (mode === 'foot') {
      setActiveRoute(evacuationPlan.footRoute);
    } else {
      setActiveRoute(evacuationPlan.vehicleRoute);
    }
  };

  const vehicleOptions: { type: VehicleType; label: string; icon: React.ReactNode }[] = [
    { type: 'auto', label: t.routing.autoBike, icon: <Car className="w-3.5 h-3.5" /> },
    { type: 'hatchback', label: t.routing.hatchback, icon: <Car className="w-3.5 h-3.5" /> },
    { type: 'sedan', label: t.routing.carSedan, icon: <Car className="w-3.5 h-3.5" /> },
    { type: 'suv', label: t.routing.suv, icon: <Truck className="w-3.5 h-3.5" /> },
    { type: 'bus', label: t.routing.bus, icon: <Truck className="w-3.5 h-3.5" /> },
    { type: 'ambulance', label: t.routing.ambulance, icon: <Siren className="w-3.5 h-3.5" /> },
    { type: 'two_wheeler', label: t.routing.autoBike, icon: <Bike className="w-3.5 h-3.5" /> },
    { type: 'pedestrian', label: t.routing.pedestrian, icon: <Footprints className="w-3.5 h-3.5" /> },
  ];

  const currentProfile = VEHICLE_PROFILES[vehicle];

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
      {/* Tab Switcher: Flood-Safe Navigation vs Emergency Evacuation Mode */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-full">
          <button
            onClick={() => setActiveTab('vehicle_routing')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'vehicle_routing'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.routing.title.split(' ')[0]} {t.routing.title.split(' ')[1]}</span>
          </button>
          <button
            onClick={() => setActiveTab('evacuation_mode')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'evacuation_mode'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>{t.dashboard.evacRouteBtn.split(' ')[0]}</span>
            {activeEvacZones.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'vehicle_routing' ? (
        <div className="space-y-3 text-xs">
          {/* Origin & Destination */}
          <div className="space-y-2">
            <div
              className={`flex items-center space-x-2 p-2.5 rounded-xl border transition-all ${
                routePinMode === 'origin'
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={t.routing.originPlaceholder}
                className="w-full bg-transparent text-slate-800 font-medium focus:outline-none text-xs"
              />
              {setRoutePinMode && (
                <button
                  type="button"
                  onClick={() => setRoutePinMode(routePinMode === 'origin' ? 'none' : 'origin')}
                  className={`px-2 py-1 rounded-lg text-[10.5px] font-bold flex items-center space-x-1 transition-all shrink-0 ${
                    routePinMode === 'origin'
                      ? 'bg-emerald-600 text-white shadow-xs animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                  title="Pin origin on map"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{routePinMode === 'origin' ? t.routing.pickLocationPrompt : t.routing.pickOrigin}</span>
                </button>
              )}
            </div>

            <div
              className={`flex items-center space-x-2 p-2.5 rounded-xl border transition-all ${
                routePinMode === 'destination'
                  ? 'bg-red-50 border-red-500 ring-2 ring-red-400'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t.routing.destPlaceholder}
                className="w-full bg-transparent text-slate-800 font-medium focus:outline-none text-xs"
              />
              {setRoutePinMode && (
                <button
                  type="button"
                  onClick={() => setRoutePinMode(routePinMode === 'destination' ? 'none' : 'destination')}
                  className={`px-2 py-1 rounded-lg text-[10.5px] font-bold flex items-center space-x-1 transition-all shrink-0 ${
                    routePinMode === 'destination'
                      ? 'bg-red-600 text-white shadow-xs animate-pulse'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                  title="Pin destination on map"
                >
                  <MapPin className="w-3 h-3" />
                  <span>{routePinMode === 'destination' ? t.routing.pickLocationPrompt : t.routing.pickDest}</span>
                </button>
              )}
            </div>
          </div>

          {/* Vehicle Profiles Selector */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
              <span>{t.routing.vehicleProfileClearance}</span>
              <span className="text-teal-700 font-bold font-mono">{t.routing.maxSafe} {currentProfile.maxSafeDepthCm}cm</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {vehicleOptions.map((v) => {
                const isSelected = vehicle === v.type;
                return (
                  <button
                    key={v.type}
                    onClick={() => setVehicle(v.type)}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-medium'
                    }`}
                    title={`${v.label} (Clearance: ${VEHICLE_PROFILES[v.type].maxSafeDepthCm}cm)`}
                  >
                    {v.icon}
                    <span className="text-[10px] mt-1 truncate max-w-full">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <span>{t.routing.findRoute}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Route Results & Comparison */}
          {routesResult && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              {/* If Route is HARD BLOCKED */}
              {routesResult.safeRoute.isBlocked ? (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-2">
                  <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{t.routing.noSafeRouteFor} {currentProfile.name.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-red-700 leading-relaxed">
                    {routesResult.safeRoute.blockedReason || t.routing.noRouteFound}
                  </p>
                </div>
              ) : (
                /* Safe Route Card */
                <div
                  onClick={() => setActiveRoute(routesResult.safeRoute)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeRoute?.id === routesResult.safeRoute.id
                      ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <div className="flex items-center space-x-1.5 text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold">
                        {routesResult.safeRoute.name === 'AquaAlert Real Road Flood-Safe Route'
                          ? t.routing.realRoadSafeRoute
                          : routesResult.safeRoute.name}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {t.routing.riskSafe}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-600 mt-1.5 font-medium">
                    <span>{routesResult.safeRoute.distanceKm} km • {routesResult.safeRoute.durationMins} {t.slider.plusMin}</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      {t.nav.maxDepth}: {routesResult.safeRoute.maxWaterDepthCm} cm
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* EMERGENCY EVACUATION MODE */
        <div className="space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900">
            <div className="flex items-center space-x-2 font-bold text-xs text-red-800">
              <Siren className="w-4 h-4 text-red-600 animate-pulse" />
              <span>{t.dashboard.evacRouteBtn}</span>
            </div>
            <p className="text-[10.5px] text-red-700 mt-1 leading-relaxed">
              Auto-detects residents in extreme flood depressions and charts safest path to high-elevation relief centers.
            </p>
          </div>

          {/* Evacuation Zone Selector */}
          <div className="space-y-1">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              {t.routing.selectHazardZone}
            </span>
            <select
              value={selectedEvacZoneId}
              onChange={(e) => setSelectedEvacZoneId(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 text-xs focus:outline-none"
            >
              {evacZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.active ? '🔴 ' : '🟡 '} {z.name} ({z.waterDepthCm}cm)
                </option>
              ))}
            </select>
          </div>

          {evacuationPlan && (
            <div className="space-y-2.5 pt-1">
              {/* Nearest Safe Shelter Details */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    {t.routing.nearestShelter}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded">
                    +{evacuationPlan.elevationGainMeters}m Elevation
                  </span>
                </div>
                <h4 className="font-bold text-xs text-emerald-900">{evacuationPlan.nearestShelter.name}</h4>
                <p className="text-[10.5px] text-emerald-800">{evacuationPlan.nearestShelter.address}</p>
              </div>

              {/* Action Buttons to Deploy Evacuation Path */}
              <button
                onClick={() => setIsEvacModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <LifeBuoy className="w-4 h-4 animate-pulse" />
                <span>{t.evacuationModal.title}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDeployEvacuation('foot')}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition-all"
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{t.routing.pedestrian}</span>
                </button>
                <button
                  onClick={() => handleDeployEvacuation('vehicle')}
                  className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow-xs transition-all"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t.routing.rescueVehicleRoute}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evacuation Step-by-Step Modal */}
      <EvacuationPlanModal
        isOpen={isEvacModalOpen}
        onClose={() => setIsEvacModalOpen(false)}
        selectedCityId={selectedCityId}
        timeOffsetMins={timeOffsetMins}
        evacuationPlan={evacuationPlan}
        onDeployMapRoute={(route) => setActiveRoute(route)}
      />
    </div>
  );
};

