'use client';

import React, { useState } from 'react';
import {
  Waves,
  Droplets,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Compass,
  Sparkles,
  RefreshCw,
  Sliders,
  Anchor
} from 'lucide-react';

interface WaterBodiesAtlasProps {
  selectedCityId: string;
}

interface LakeAsset {
  id: string;
  name: string;
  type: string;
  currentFtlPct: number;
  storageMcm: number;
  maxStorageMcm: number;
  encroachmentPct: number;
  restorationPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  floodAttenuationCapacityM3: number;
  status: 'SAFE_MARGIN' | 'HIGH_FILL' | 'CRITICAL_BUFFER';
}

interface OutfallGate {
  id: string;
  name: string;
  basin: string;
  gateType: string;
  status: 'GRAVITY_OUTFLOW' | 'FLAP_LOCKED_TIDE' | 'PUMPING_ACTIVE';
  currentDischargeCusecs: number;
  seaLevelHeadM: number;
}

const MUMBAI_LAKES: LakeAsset[] = [
  {
    id: 'lake-powai',
    name: 'Powai Lake Retention Basin',
    type: 'Urban Buffer Lake',
    currentFtlPct: 68,
    storageMcm: 5.4,
    maxStorageMcm: 8.2,
    encroachmentPct: 14,
    restorationPriority: 'HIGH',
    floodAttenuationCapacityM3: 2800000,
    status: 'SAFE_MARGIN'
  },
  {
    id: 'lake-vihar',
    name: 'Vihar Lake Catchment Dam',
    type: 'Potable Drinking & Flood Attenuation',
    currentFtlPct: 82,
    storageMcm: 22.8,
    maxStorageMcm: 27.6,
    encroachmentPct: 4,
    restorationPriority: 'MEDIUM',
    floodAttenuationCapacityM3: 4800000,
    status: 'HIGH_FILL'
  },
  {
    id: 'lake-tulsi',
    name: 'Tulsi Lake High-Elevation Basin',
    type: 'Upland Catchment Reservoir',
    currentFtlPct: 91,
    storageMcm: 7.3,
    maxStorageMcm: 8.0,
    encroachmentPct: 2,
    restorationPriority: 'MEDIUM',
    floodAttenuationCapacityM3: 700000,
    status: 'CRITICAL_BUFFER'
  },
  {
    id: 'tank-chembur',
    name: 'Chembur Charai Retention Tank',
    type: 'Suburban Retention Pond',
    currentFtlPct: 54,
    storageMcm: 0.8,
    maxStorageMcm: 1.5,
    encroachmentPct: 28,
    restorationPriority: 'CRITICAL',
    floodAttenuationCapacityM3: 700000,
    status: 'SAFE_MARGIN'
  }
];

const MUMBAI_OUTFALLS: OutfallGate[] = [
  {
    id: 'out-mahim',
    name: 'Mithi River Mahim Bay Tidal Flap Gate',
    basin: 'Mithi Central Basin',
    gateType: 'Automated Hydraulic Radial Flap Gate',
    status: 'FLAP_LOCKED_TIDE',
    currentDischargeCusecs: 0,
    seaLevelHeadM: 4.42
  },
  {
    id: 'out-lovegrove',
    name: 'Love Grove Worli Outfall & Pumping Station',
    basin: 'Worli-Dadar South SWD Main',
    gateType: 'Archimedes Screw Heavy Pumping Matrix',
    status: 'PUMPING_ACTIVE',
    currentDischargeCusecs: 1420,
    seaLevelHeadM: 4.18
  },
  {
    id: 'out-cleaveland',
    name: 'Cleave-land Bunder Sluice Regulators',
    basin: 'Hindmata-Parel Lowland Collector',
    gateType: 'Pneumatic Drop-Grip Storm Gate',
    status: 'GRAVITY_OUTFLOW',
    currentDischargeCusecs: 850,
    seaLevelHeadM: 2.15
  },
  {
    id: 'out-hajiali',
    name: 'Haji Ali Bay Stormwater Sluice',
    basin: 'South Mumbai Coastal Drainage',
    gateType: 'Tidal Flap Lockout Valve',
    status: 'FLAP_LOCKED_TIDE',
    currentDischargeCusecs: 0,
    seaLevelHeadM: 4.35
  }
];

export const WaterBodiesAtlas: React.FC<WaterBodiesAtlasProps> = ({ selectedCityId }) => {
  const [lakes] = useState<LakeAsset[]>(MUMBAI_LAKES);
  const [outfalls] = useState<OutfallGate[]>(MUMBAI_OUTFALLS);
  const [tideMeters] = useState(4.38);

  const totalHeadroomMcm = lakes.reduce((sum, l) => sum + (l.maxStorageMcm - l.storageMcm), 0);

  return (
    <div className="space-y-6 pb-12 text-base">
      {/* Top Header Card */}
      <div className="panel rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-blue-500/30 bg-white/95 dark:bg-gradient-to-r dark:from-gray-900/90 dark:via-gray-850/80 dark:to-gray-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl m-2">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 text-base font-bold">
              <Waves className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Catchments & Water Bodies Atlas
            </span>
            <span className="badge bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 text-base font-bold">
              <Anchor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Coastal Outfall Flap Gate Sync
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Urban Lake Retention & Coastal Tidal Gating
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            Real-time Full Tank Level (FTL) headroom across urban retention water bodies, encroachment indices,
            and automated coastal storm flap gates synchronized to ocean tidal cycles.
          </p>
        </div>

        {/* Astronomical Tide Meter */}
        <div className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-850/90 min-w-[260px] shrink-0 text-right m-1.5 shadow-md">
          <div className="flex items-center justify-end space-x-2 text-blue-600 dark:text-blue-400 text-base font-bold">
            <Anchor className="w-5 h-5" />
            <span>High Tide Peak (Mumbai Port)</span>
          </div>
          <span className="text-4xl font-black text-orange-600 dark:text-orange-400 font-mono block mt-2">
            {tideMeters.toFixed(2)} m
          </span>
          <p className="text-base text-gray-600 dark:text-gray-300 mt-2 font-medium">
            <span className="text-orange-600 dark:text-orange-400 font-bold">Flap Gate Lockout:</span> Prevents marine surge backflow
          </p>
        </div>
      </div>

      {/* Urban Lakes Inventory Section */}
      <div className="space-y-4 m-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 flex items-center space-x-2.5">
            <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Urban Retention Reservoirs & Lake Capacities</span>
          </h3>
          <span className="text-base font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 dark:bg-gray-850 px-4 py-1.5 rounded-xl border border-blue-500/30">
            Total Flood Buffer Headroom: <strong className="text-gray-900 dark:text-gray-100">{totalHeadroomMcm.toFixed(1)} MCM</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lakes.map((lake) => (
            <div
              key={lake.id}
              className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850/70 hover:border-blue-500/50 transition-all space-y-4 flex flex-col justify-between m-1.5 shadow-md"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span className="text-sm font-mono font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-750 text-blue-700 dark:text-blue-300 border border-gray-200 dark:border-gray-700">
                    {lake.type}
                  </span>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                    lake.status === 'CRITICAL_BUFFER'
                      ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/40'
                      : lake.status === 'HIGH_FILL'
                      ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/40'
                      : 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/40'
                  }`}>
                    {lake.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug">
                  {lake.name}
                </h4>
              </div>

              {/* Progress Bar & Storage */}
              <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-600 dark:text-gray-400">Full Tank Level (FTL)</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{lake.currentFtlPct}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      lake.currentFtlPct > 88
                        ? 'bg-orange-500'
                        : lake.currentFtlPct > 70
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${lake.currentFtlPct}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-base bg-gray-50 dark:bg-gray-900/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800 font-mono">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-sm">Storage</span>
                    <strong className="text-gray-900 dark:text-gray-100 font-bold">{lake.storageMcm} / {lake.maxStorageMcm} MCM</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-sm">Cushion</span>
                    <strong className="text-blue-600 dark:text-blue-300 font-bold">{(lake.maxStorageMcm - lake.storageMcm).toFixed(1)} MCM</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-base text-gray-600 dark:text-gray-400 pt-1">
                  <span>Encroachment: <strong className="text-orange-600 dark:text-orange-400 font-bold">{lake.encroachmentPct}%</strong></span>
                  <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-750 text-gray-800 dark:text-gray-200 font-bold text-sm">
                    Priority: {lake.restorationPriority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coastal Outfalls & Flap Gate Telemetry */}
      <div className="panel rounded-2xl p-6 sm:p-7 border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/60 space-y-5 m-2 shadow-xl">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2.5">
            <Anchor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Coastal Stormwater Outfalls & Marine Backflow Lockout</span>
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300 mt-1 font-normal">
            Tidal flap gates automatically close during high tide to prevent seawater backflow into low-lying urban areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outfalls.map((gate) => (
            <div
              key={gate.id}
              className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-850/80 space-y-3 m-1.5 shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{gate.name}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                  gate.status === 'FLAP_LOCKED_TIDE'
                    ? 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-500/40'
                    : gate.status === 'PUMPING_ACTIVE'
                    ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40'
                    : 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/40'
                }`}>
                  {gate.status.replace(/_/g, ' ')}
                </span>
              </div>

              <p className="text-base text-gray-600 dark:text-gray-300">
                Basin: <strong className="text-gray-900 dark:text-gray-100">{gate.basin}</strong> • Gate: {gate.gateType}
              </p>

              <div className="grid grid-cols-2 gap-3 text-base bg-white dark:bg-gray-900/80 p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 font-mono">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-sm">Discharge Rate</span>
                  <strong className="text-gray-900 dark:text-gray-100 font-bold text-lg">{gate.currentDischargeCusecs} Cusecs</strong>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-sm">Sea Invert Head</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-bold text-lg">+{gate.seaLevelHeadM}m SL</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
