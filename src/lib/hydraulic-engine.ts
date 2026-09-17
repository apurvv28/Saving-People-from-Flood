import { CityId, getCityDataset, RoadSegment, DrainageNode } from './mock-data';
import { getCityTideData, CityTideData } from './tide-service';
import { getPumpingStationsForCity, getTotalCityPumpingCapacityLps } from './pumping-station-service';
import { getPhysicsDerivedManholes, PhysicsManhole } from './physics-manhole-engine';

export interface NowcastTimeStep {
  timeOffsetMins: number; // 0, 15, 30, 45, 60, 90, 120, 150, 180
  timeLabel: string;
  rainfallRateMmHr: number;
  tideData: CityTideData;
  activePumpingDischargeLps: number;
  totalFloodedRoadsCount: number;
  maxWaterDepthCm: number;
  criticalSurchargeNodesCount: number;
  roadStates: {
    roadId: string;
    waterDepthCm: number;
    severity: 'safe' | 'warning' | 'critical' | 'severe';
  }[];
  nodeStates: {
    nodeId: string;
    surchargePct: number;
    status: 'normal' | 'capacity_warning' | 'surcharging_backflow' | 'blocked';
  }[];
  physicsManholes?: import('./physics-manhole-engine').PhysicsManhole[];
  overflowingManholesCount?: number;
  totalManholeOverflowRateLps?: number;
}

export function getRadarPrecipitationForTime(timeOffsetMins: number): number {
  const availableTimes = [0, 15, 30, 45, 60, 90, 120, 150, 180];
  const defaultRates = [25, 45, 85, 65, 35, 15, 5, 0, 0];
  let closestIdx = 0;
  let minDiff = Math.abs(timeOffsetMins - availableTimes[0]);

  for (let i = 0; i < availableTimes.length; i++) {
    const diff = Math.abs(timeOffsetMins - availableTimes[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return defaultRates[closestIdx] || 0;
}

export function getHydraulicSnapshotAtTime(
  timeOffsetMins: number,
  cityId: CityId = 'mumbai',
  liveOpenMeteoTimelineMmHr?: number[],
  overriddenPumpStates?: Record<string, boolean>
): NowcastTimeStep {
  const { roads, nodes } = getCityDataset(cityId);

  const timeIndexMap: Record<number, number> = {
    0: 0, 15: 1, 30: 2, 45: 3, 60: 4, 90: 5, 120: 6, 150: 7, 180: 8
  };

  const availableTimes = [0, 15, 30, 45, 60, 90, 120, 150, 180];
  let closestTime = availableTimes[0];
  let minDiff = Math.abs(timeOffsetMins - closestTime);

  for (const t of availableTimes) {
    const diff = Math.abs(timeOffsetMins - t);
    if (diff < minDiff) {
      minDiff = diff;
      closestTime = t;
    }
  }

  const idx = timeIndexMap[closestTime] || 0;

  // 1. Live Open-Meteo Rain Rate
  let rainfallRateMmHr = 0;
  if (liveOpenMeteoTimelineMmHr && liveOpenMeteoTimelineMmHr.length > idx) {
    rainfallRateMmHr = liveOpenMeteoTimelineMmHr[idx];
  } else {
    rainfallRateMmHr = getRadarPrecipitationForTime(closestTime);
  }

  // 2. Real Oceanographic Tide & River Stage Data
  const tideData = getCityTideData(cityId, closestTime, rainfallRateMmHr);
  const outfallBackpressure = tideData.outfallBackpressureCoeff;

  // 3. Municipal Dewatering SCADA Pumping Capacity
  const stations = getPumpingStationsForCity(cityId);
  let activePumpingDischargeLps = 0;
  stations.forEach(st => {
    const isOverrideActive = overriddenPumpStates ? (overriddenPumpStates[st.id] ?? st.isOperational) : st.isOperational;
    if (isOverrideActive) {
      activePumpingDischargeLps += st.currentDischargeLps;
    }
  });

  // Calculate pumping mitigation ratio (0.4 to 1.0)
  const totalMaxCap = stations.reduce((a, s) => a + s.capacityLps, 1);
  const pumpActiveRatio = activePumpingDischargeLps / totalMaxCap;
  const pumpMitigationFactor = Math.max(0.45, 1.0 - pumpActiveRatio * 0.45);

  // 4. Calculate Physics-Derived Manholes & Surcharges
  const physicsManholes = getPhysicsDerivedManholes(cityId, closestTime, rainfallRateMmHr);
  const overflowingManholesCount = physicsManholes.filter(m => m.surfaceOverflowDepthCm > 0).length;
  const totalManholeOverflowRateLps = physicsManholes.reduce((sum, m) => sum + m.overflowRateLps, 0);

  // 5. Calculate road water depth in cm coupled with DEM, tide backpressure, SCADA pumps & manhole backflow
  const roadStates = roads.map(road => {
    const demFactor = Math.max(0.2, (5.0 - road.demElevationMeters) / 3.0);
    const calculatedDepth = Math.round((rainfallRateMmHr * 0.7) * demFactor);
    const baseDepth = Math.max(calculatedDepth, Math.round(road.depthsTimelineCm[idx] * (rainfallRateMmHr / 50.0 || 1.0)));

    // Low elevation roads experience tide backwater surcharge penalties
    const tidePenaltyMultiplier = 1.0 + Math.max(0, (3.5 - road.demElevationMeters) / 2.5) * outfallBackpressure * 0.75;
    let finalDepth = Math.round(baseDepth * tidePenaltyMultiplier * pumpMitigationFactor);

    // If physics manholes along this road are actively overflowing onto street surface, add water depth
    const roadManholes = physicsManholes.filter(m => m.roadId === road.id);
    const maxMhOverflow = roadManholes.length > 0 ? Math.max(...roadManholes.map(m => m.surfaceOverflowDepthCm)) : 0;
    if (maxMhOverflow > 0) {
      finalDepth += Math.round(maxMhOverflow * 0.4);
    }

    let severity: 'safe' | 'warning' | 'critical' | 'severe' = 'safe';
    if (finalDepth >= 40) severity = 'severe';
    else if (finalDepth >= 20) severity = 'critical';
    else if (finalDepth >= 8) severity = 'warning';

    return {
      roadId: road.id,
      waterDepthCm: finalDepth,
      severity
    };
  });

  // 6. Calculate manhole node surcharge level % coupled with tide backpressure & pumps
  const nodeStates = nodes.map(node => {
    const baseSurcharge = Math.round(node.surchargeTimelinePct[idx] * (rainfallRateMmHr / 45.0 || 1.0));
    const tideNodePenalty = 1.0 + outfallBackpressure * 0.5;
    const surchargePct = Math.round(baseSurcharge * tideNodePenalty * pumpMitigationFactor);

    let status: 'normal' | 'capacity_warning' | 'surcharging_backflow' | 'blocked' = 'normal';
    if (surchargePct > 100) status = 'surcharging_backflow';
    else if (surchargePct > 70) status = 'capacity_warning';

    return {
      nodeId: node.id,
      surchargePct,
      status
    };
  });

  const maxWaterDepthCm = roadStates.length > 0 ? Math.max(...roadStates.map(r => r.waterDepthCm)) : 0;
  const totalFloodedRoadsCount = roadStates.filter(r => r.waterDepthCm > 5).length;
  const criticalSurchargeNodesCount = nodeStates.filter(n => n.surchargePct >= 100).length;

  const hours = Math.floor(closestTime / 60);
  const mins = closestTime % 60;
  const timeLabel = `+${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} (T+${closestTime}m)`;

  return {
    timeOffsetMins: closestTime,
    timeLabel,
    rainfallRateMmHr,
    tideData,
    activePumpingDischargeLps,
    totalFloodedRoadsCount,
    maxWaterDepthCm,
    criticalSurchargeNodesCount,
    roadStates,
    nodeStates,
    physicsManholes,
    overflowingManholesCount,
    totalManholeOverflowRateLps
  };
}
