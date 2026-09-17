'use client';

import React from 'react';
import { AlertOctagon, Flame, MapPin } from 'lucide-react';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { CityId, getCityDataset } from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';

interface AlertFeedProps {
  selectedCityId: CityId;
  timeOffsetMins: number;
  onSelectFeature: (id: string) => void;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({
  selectedCityId,
  timeOffsetMins,
  onSelectFeature
}) => {
  const { t } = useLanguage();
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);
  const { roads, nodes } = getCityDataset(selectedCityId);

  const criticalRoads = snapshot.roadStates.filter(r => r.waterDepthCm >= 15);
  const surchargingManholes = snapshot.nodeStates.filter(n => n.surchargePct >= 100);
  const physicsOverflows = (snapshot.physicsManholes || []).filter(m => m.surfaceOverflowDepthCm > 0);

  const totalAlerts = criticalRoads.length + surchargingManholes.length + physicsOverflows.length;

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-red-600" />
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            {t.alerts.title}
          </h2>
        </div>
        <span className="flex items-center space-x-1 text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-mono font-bold">
          <span>{totalAlerts} {t.alerts.critical}</span>
        </span>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-xs">
        {criticalRoads.map((roadState) => {
          const road = roads.find(r => r.id === roadState.roadId);
          if (!road) return null;

          const getSeverityBadgeText = (sev: string) => {
            if (sev.toLowerCase().includes('crit')) return t.alerts.critical;
            if (sev.toLowerCase().includes('warn')) return t.alerts.warning;
            return t.alerts.advisory;
          };

          return (
            <div
              key={road.id}
              onClick={() => onSelectFeature(road.id)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-start justify-between space-x-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 font-semibold text-slate-800">
                  <Flame className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">{road.name}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t.alerts.borough}: {road.borough} • {t.alerts.elevation}: {road.demElevationMeters}m
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-mono font-bold text-red-600">
                  {roadState.waterDepthCm} cm
                </span>
                <p className="text-[9px] uppercase font-bold text-red-700">
                  {getSeverityBadgeText(roadState.severity)}
                </p>
              </div>
            </div>
          );
        })}

        {surchargingManholes.map((nodeState) => {
          const node = nodes.find(n => n.id === nodeState.nodeId);
          if (!node) return null;

          return (
            <div
              key={node.id}
              onClick={() => onSelectFeature(node.id)}
              className="p-2.5 rounded-xl bg-red-50 border border-red-200 hover:border-red-300 transition-all cursor-pointer flex items-start justify-between space-x-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 font-semibold text-red-900">
                  <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="truncate">{node.name}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {t.alerts.hydraulicBackflow} • {node.type}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-mono font-bold text-red-700">
                  {nodeState.surchargePct}%
                </span>
                <p className="text-[9px] uppercase font-bold text-red-800">
                  {t.alerts.tabSurcharge}
                </p>
              </div>
            </div>
          );
        })}

        {physicsOverflows.map((mh) => (
          <div
            key={mh.id}
            onClick={() => onSelectFeature(mh.id)}
            className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200 hover:border-orange-300 transition-all cursor-pointer flex items-start justify-between space-x-2"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5 font-semibold text-orange-950">
                <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="truncate">{mh.name}</span>
              </div>
              <p className="text-[11px] text-slate-600 truncate max-w-[200px]">
                {mh.derivedLocationLabel}
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Rim: {mh.rimElevationMeters}m • Q_in: {mh.inflowRunoffLps} L/s
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-mono font-bold text-red-600">
                +{mh.surfaceOverflowDepthCm} cm
              </span>
              <p className="text-[9px] uppercase font-bold text-red-700">
                {t.alerts.surfaceSpill}
              </p>
              <span className="text-[9px] font-mono text-orange-700">
                {mh.hydraulicCapacityPct}% Cap
              </span>
            </div>
          </div>
        ))}

        {totalAlerts === 0 && (
          <div className="p-4 text-center text-slate-500 text-xs">
            ✨ {t.alerts.noAlerts}
          </div>
        )}
      </div>
    </div>
  );
};

