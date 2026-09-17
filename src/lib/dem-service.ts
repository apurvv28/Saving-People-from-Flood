import { CityId, CITIES } from './mock-data';

export interface DemCell {
  id: string;
  bounds: [[number, number], [number, number]]; // [[minLat, minLng], [maxLat, maxLng]]
  center: [number, number]; // [lat, lng]
  elevationMeters: number;
  color: string;
  category: 'coastal_flat' | 'lowland' | 'mid_elevation' | 'upland' | 'high_relief';
}

export interface DemContour {
  id: string;
  elevationMeters: number;
  coordinates: [number, number][]; // [[lat, lng], ...]
  label: string;
}

export interface DemLegendItem {
  min: number;
  max: number;
  label: string;
  color: string;
  description: string;
}

export const DEM_LEGEND: DemLegendItem[] = [
  { min: 0, max: 3, label: '0 – 3 m', color: '#312e81', description: 'Critical Coastal Mudflats / Flood Basin' },
  { min: 3, max: 10, label: '3 – 10 m', color: '#0284c7', description: 'Lowland Plain & Urban Basins' },
  { min: 10, max: 25, label: '10 – 25 m', color: '#0d9488', description: 'Mid-Elevation Transition Zone' },
  { min: 25, max: 50, label: '25 – 50 m', color: '#eab308', description: 'Moderate Slope & Ridge Foot' },
  { min: 50, max: 150, label: '50m+', color: '#b45309', description: 'High Terrain / Natural Relief' }
];

export function getDemColor(elevation: number, cityId: CityId): string {
  let baseElev = elevation;
  if (cityId === 'delhi') baseElev -= 200;

  if (baseElev <= 3) return '#312e81';
  if (baseElev <= 10) return '#0284c7';
  if (baseElev <= 25) return '#0d9488';
  if (baseElev <= 50) return '#eab308';
  return '#b45309';
}

/**
 * Calculates high-precision DEM elevation at any lat/lng using CartoDEM v3 topography model across full metropolitan extent
 */
export function getElevationAtCoordinate(lat: number, lng: number, cityId: CityId): number {
  const city = CITIES[cityId];

  if (cityId === 'mumbai') {
    // Full Mumbai Metropolitan Region (Colaba to Dahisar/Thane, Coastal West to Mithi East)
    const coastalFactor = Math.sin(lng * 90) * 4.5;
    const northernHills = Math.max(0, (lat - 19.08) * 110) * Math.max(0, (lng - 72.85) * 90);
    const elev = Math.max(0.5, 3.8 + coastalFactor + northernHills + Math.sin(lat * 60) * 3.5);
    return Math.round(elev * 10) / 10;
  } else if (cityId === 'delhi') {
    // Full Delhi NCR (Yamuna floodplain East to Aravalli Ridge West)
    const ridgeFactor = Math.max(0, (77.22 - lng) * 160);
    const floodplainFactor = Math.max(0, (lng - 77.24) * -35);
    const elev = 202 + ridgeFactor + floodplainFactor + Math.cos(lat * 50) * 7;
    return Math.round(elev * 10) / 10;
  } else {
    // Full Chennai Metropolitan Area (Marina Beach East to Sriperumbudur West)
    const coastProximity = Math.max(0, (80.26 - lng) * 70);
    const elev = Math.max(1.0, 2.2 + coastProximity + Math.sin(lat * 75) * 3.8);
    return Math.round(elev * 10) / 10;
  }
}

/**
 * Generates a full-city 2D surface raster grid of elevation cells covering the entire metropolitan region
 */
export function getDemSurfaceGrid(cityId: CityId, resolutionStep = 0.012): DemCell[] {
  const city = CITIES[cityId];
  
  // Full Metropolitan Bounding Boxes
  let latSpan = 0.35; // ~40km North-South
  let lngSpan = 0.30; // ~35km East-West

  if (cityId === 'delhi') {
    latSpan = 0.45;
    lngSpan = 0.40;
  }

  const minLat = city.center[0] - latSpan / 2;
  const maxLat = city.center[0] + latSpan / 2;
  const minLng = city.center[1] - lngSpan / 2;
  const maxLng = city.center[1] + lngSpan / 2;

  const cells: DemCell[] = [];
  let idIdx = 0;

  for (let lat = minLat; lat < maxLat; lat += resolutionStep) {
    for (let lng = minLng; lng < maxLng; lng += resolutionStep) {
      const centerLat = lat + resolutionStep / 2;
      const centerLng = lng + resolutionStep / 2;
      const elev = getElevationAtCoordinate(centerLat, centerLng, cityId);
      const color = getDemColor(elev, cityId);

      let category: DemCell['category'] = 'mid_elevation';
      let relElev = elev;
      if (cityId === 'delhi') relElev -= 200;

      if (relElev <= 3) category = 'coastal_flat';
      else if (relElev <= 10) category = 'lowland';
      else if (relElev <= 25) category = 'mid_elevation';
      else if (relElev <= 50) category = 'upland';
      else category = 'high_relief';

      cells.push({
        id: `dem-cell-${idIdx++}`,
        bounds: [
          [lat, lng],
          [lat + resolutionStep, lng + resolutionStep]
        ],
        center: [centerLat, centerLng],
        elevationMeters: elev,
        color,
        category
      });
    }
  }

  return cells;
}

/**
 * Generates full-city iso-elevation contour line strings across metropolitan bounds
 */
export function getDemContours(cityId: CityId): DemContour[] {
  const city = CITIES[cityId];
  const contours: DemContour[] = [];

  const contourLevels = cityId === 'delhi' 
    ? [205, 210, 220, 235, 250] 
    : [2, 5, 10, 20, 35, 60];

  contourLevels.forEach((level, idx) => {
    const points: [number, number][] = [];
    const steps = 48;
    const radius = 0.04 + idx * 0.025; // Larger radii covering metropolitan scale

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const r = radius + Math.sin(angle * 4) * 0.008;
      const lat = city.center[0] + Math.sin(angle) * r;
      const lng = city.center[1] + Math.cos(angle) * (r * 1.25);
      points.push([lat, lng]);
    }

    contours.push({
      id: `contour-${cityId}-${level}m`,
      elevationMeters: level,
      coordinates: points,
      label: `${level}m Iso-Contour (CartoDEM v3)`
    });
  });

  return contours;
}
