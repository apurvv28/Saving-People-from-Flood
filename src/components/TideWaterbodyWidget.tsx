'use client';

import React from 'react';
import { CityId, CITIES } from '@/lib/mock-data';
import { getCityTideData } from '@/lib/tide-service';
import { getPumpingStationsForCity, getTotalCityPumpingCapacityLps } from '@/lib/pumping-station-service';
import { Waves, Zap, Gauge, AlertTriangle, Activity, Anchor, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface TideWaterbodyWidgetProps {
  selectedCityId: CityId;
  timeOffsetMins: number;
  rainfallRateMmHr?: number;
}

export const TideWaterbodyWidget: React.FC<TideWaterbodyWidgetProps> = ({
  selectedCityId,
  timeOffsetMins,
  rainfallRateMmHr = 25
}) => {
  const city = CITIES[selectedCityId];
  const tideData = getCityTideData(selectedCityId, timeOffsetMins, rainfallRateMmHr);
  const pumpingStations = getPumpingStationsForCity(selectedCityId);
  const activeDischargeLps = getTotalCityPumpingCapacityLps(selectedCityId, true);
  const maxCapacityLps = getTotalCityPumpingCapacityLps(selectedCityId, false);
  const pumpEfficiencyPct = Math.round((activeDischargeLps / maxCapacityLps) * 100);

  const getBackpressureColor = (coeff: number) => {
    if (coeff >= 0.7) return 'text-red-600 bg-red-50 border-red-200';
    if (coeff >= 0.35) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-teal-600 bg-teal-50 border-teal-200';
  };

  const getTideBadge = (state: string) => {
    switch (state) {
      case 'high_tide':
        return { label: 'COASTAL HIGH TIDE', bg: 'bg-red-600 text-white' };
      case 'rising_flood':
        return { label: 'RISING TIDE / STAGE', bg: 'bg-amber-500 text-slate-950' };
      case 'ebbing_discharge':
        return { label: 'EBBING GRAVITY DISCHARGE', bg: 'bg-teal-600 text-white' };
      default:
        return { label: 'LOW TIDE / NORMAL STAGE', bg: 'bg-slate-700 text-white' };
    }
  };

  const badge = getTideBadge(tideData.tideState);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
      {/* Header Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              <span>Tide, Outfall & SCADA Telemetry</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-slate-100 text-slate-700">
                {city.name}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[280px]">
              {tideData.stationName}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg font-mono border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Tide Level / River Stage Height */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold flex items-center gap-1">
              <Anchor className="w-3.5 h-3.5 text-sky-600" />
              {selectedCityId === 'delhi' ? 'River Stage' : 'Tide Height'}
            </span>
            <span className="font-mono text-[10px]">{tideData.datum.split('/')[0]}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold font-mono text-slate-900">
              {tideData.currentHeightMeters} <span className="text-xs font-semibold text-slate-500">m</span>
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              Peak: {tideData.highTidePeakHeightMeters}m
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                tideData.currentHeightMeters >= tideData.warningThresholdMeters ? 'bg-red-500' : 'bg-sky-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, tideData.tidePhasePct))}%` }}
            />
          </div>
        </div>

        {/* Outfall Backpressure Coefficient */}
        <div className={`p-3 rounded-xl border space-y-1 ${getBackpressureColor(tideData.outfallBackpressureCoeff)}`}>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              Outfall Gate Choke
            </span>
            <span className="font-mono text-[10px]">Backpressure</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold font-mono">
              {Math.round(tideData.outfallBackpressureCoeff * 100)}%
            </p>
            <span className="text-[10px] font-bold">
              {tideData.outfallBackpressureCoeff >= 0.7 ? 'Gravity Closed' : 'Normal Gravity'}
            </span>
          </div>
          <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-current transition-all"
              style={{ width: `${Math.round(tideData.outfallBackpressureCoeff * 100)}%` }}
            />
          </div>
        </div>

        {/* SCADA Dewatering Pumping Discharge */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              SCADA Dewatering
            </span>
            <span className="font-mono text-[10px] text-teal-700 font-bold">{pumpEfficiencyPct}% Cap</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold font-mono text-slate-900">
              {(activeDischargeLps / 1000).toFixed(1)}k <span className="text-xs font-semibold text-slate-500">L/s</span>
            </p>
            <span className="text-[10px] text-slate-500 font-mono">
              {pumpingStations.length} Stations
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all"
              style={{ width: `${pumpEfficiencyPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* 24-Hour Tide / River Stage Baseline Sparkline Curve */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-600">
          <span className="font-semibold flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            24-Hour Hydrological Baseline Curve
          </span>
          <span className="text-[10px] text-slate-400">Peak High Tide at {tideData.highTidePeakTime}</span>
        </div>

        <div className="flex items-end justify-between h-12 gap-1 pt-2 bg-slate-50/80 px-2 rounded-xl border border-slate-200/60">
          {tideData.tideTimeline24h.map((pt, idx) => {
            const minH = selectedCityId === 'delhi' ? 203.5 : 0.2;
            const maxH = selectedCityId === 'delhi' ? 206.0 : 5.2;
            const hPct = Math.round(((pt.heightMeters - minH) / (maxH - minH)) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div
                  className={`w-full rounded-t-xs transition-all ${
                    pt.isHighTide ? 'bg-red-500 group-hover:bg-red-600' : 'bg-sky-400 group-hover:bg-sky-600'
                  }`}
                  style={{ height: `${Math.max(15, Math.min(100, hPct))}%` }}
                />
                <span className="text-[8px] font-mono text-slate-400 hidden group-hover:block absolute -top-5 bg-slate-900 text-white px-1 rounded">
                  {pt.heightMeters}m
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hydrological Impact Note */}
      <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-950 text-[11px] flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <span className="font-bold">Hydraulic Impact: </span>
          {tideData.description}
        </p>
      </div>
    </div>
  );
};
