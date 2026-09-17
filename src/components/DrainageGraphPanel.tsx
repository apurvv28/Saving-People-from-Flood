'use client';

import React, { useState } from 'react';
import { Network, Activity, Zap, Waves, AlertTriangle, Gauge, ArrowUpRight } from 'lucide-react';
import { CityId, getCityDataset, DRAINAGE_PIPES } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { getTopSurchargingManholes } from '@/lib/physics-manhole-engine';

interface DrainageGraphPanelProps {
  selectedCityId: CityId;
  timeOffsetMins: number;
}

export const DrainageGraphPanel: React.FC<DrainageGraphPanelProps> = ({
  selectedCityId,
  timeOffsetMins
}) => {
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);
  const { nodes } = getCityDataset(selectedCityId);
  const topManholes = getTopSurchargingManholes(selectedCityId, 8, timeOffsetMins);
  const [activeTab, setActiveTab] = useState<'physics_manholes' | 'outfalls_pipes'>('physics_manholes');

  const overflowingCount = snapshot.overflowingManholesCount || 0;
  const totalOverflowLps = snapshot.totalManholeOverflowRateLps || 0;

  return (
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      {/* Header with Physics Metrics */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-teal-700" />
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              1D Underground Drainage & Surcharge Telemetry
            </h2>
            <p className="text-[10.5px] text-slate-500">
              Physics Model: Manning Full-Pipe Capacity + CartoDEM Invert Gradients
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {overflowingCount > 0 && (
            <span className="flex items-center space-x-1 text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>{overflowingCount} Overflowing</span>
            </span>
          )}
          <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full font-mono font-semibold">
            Manning n=0.013
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-100 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('physics_manholes')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'physics_manholes'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>Physics Manholes ({snapshot.physicsManholes?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('outfalls_pipes')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'outfalls_pipes'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>Trunk Outfalls & Conduits</span>
        </button>
      </div>

      {activeTab === 'physics_manholes' ? (
        <div className="space-y-2">
          {/* Summary Banner */}
          <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Total Derived MH</p>
              <p className="text-sm font-bold text-slate-800 font-mono">{snapshot.physicsManholes?.length || 0}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Surface Overflow</p>
              <p className={`text-sm font-bold font-mono ${overflowingCount > 0 ? 'text-red-600' : 'text-teal-700'}`}>
                {overflowingCount} Chambers
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Discharge Spill</p>
              <p className={`text-sm font-bold font-mono ${totalOverflowLps > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                {totalOverflowLps} L/s
              </p>
            </div>
          </div>

          {/* Manholes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {topManholes.map((mh) => {
              const isOverflowing = mh.surfaceOverflowDepthCm > 0;
              const isWarning = mh.hydraulicCapacityPct >= 70;

              let barColor = 'bg-teal-500';
              if (isOverflowing || mh.hydraulicCapacityPct >= 120) barColor = 'bg-red-600';
              else if (mh.hydraulicCapacityPct >= 100) barColor = 'bg-orange-500';
              else if (isWarning) barColor = 'bg-amber-500';

              return (
                <div
                  key={mh.id}
                  className={`p-2.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                    isOverflowing
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800 text-[11.5px]">{mh.name}</span>
                        {mh.isGalli && (
                          <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[9px] font-bold">
                            Galli
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[190px]">
                        {mh.derivedLocationLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-xs ${
                          isOverflowing ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-teal-700'
                        }`}
                      >
                        {mh.hydraulicCapacityPct}%
                      </span>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Q: {mh.inflowRunoffLps}/{mh.capacityLps} L/s
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${Math.min(100, mh.hydraulicCapacityPct)}%` }}
                    />
                  </div>

                  {/* Chamber Details */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5 border-t border-slate-100 font-mono">
                    <span>Rim: {mh.rimElevationMeters}m MSL</span>
                    <span>Inv: -{mh.invertDepthMeters}m</span>
                    <span>Ø{mh.pipeDiameterMm}mm</span>
                  </div>

                  {/* Overflow Alert Tag */}
                  {isOverflowing && (
                    <div className="flex items-center justify-between text-[10px] bg-red-100/70 text-red-800 px-2 py-0.5 rounded font-medium">
                      <span>⚠️ Street Surcharge</span>
                      <span className="font-bold font-mono">+{mh.surfaceOverflowDepthCm} cm</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Municipal Outfalls ({nodes.length})</span>
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {nodes.map((node) => {
                const liveState = snapshot.nodeStates.find(n => n.nodeId === node.id);
                const surcharge = liveState ? liveState.surchargePct : 0;
                const isSurcharging = surcharge >= 100;

                return (
                  <div key={node.id} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="font-semibold text-slate-800 text-[11px]">{node.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Invert Depth: {node.invertDepthMeters}m • Cap: {node.capacityLps} L/s
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold text-xs ${isSurcharging ? 'text-red-600' : 'text-teal-700'}`}>
                        {surcharge}%
                      </span>
                      {node.pumpActive && (
                        <p className="text-[9px] text-teal-700 font-bold flex items-center justify-end space-x-0.5">
                          <Zap className="w-2.5 h-2.5" />
                          <span>PUMP ON</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center space-x-1">
              <Waves className="w-3.5 h-3.5 text-teal-600" />
              <span>Conduits & Canals ({DRAINAGE_PIPES.length})</span>
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {DRAINAGE_PIPES.map((pipe) => {
                const source = nodes.find(n => n.id === pipe.sourceNodeId);
                const target = nodes.find(n => n.id === pipe.targetNodeId);

                return (
                  <div key={pipe.id} className="p-2 rounded-lg bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-slate-800">
                      <span className="truncate">{source?.name.split(' ')[0] || 'Node-A'} ➔ {target?.name.split(' ')[0] || 'Node-B'}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        pipe.flowDirection === 'reverse_backflow' ? 'bg-red-100 text-red-800' : 'bg-teal-50 text-teal-800'
                      }`}>
                        {pipe.flowDirection === 'reverse_backflow' ? 'BACKFLOW' : 'GRAVITY'}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Dia: {pipe.diameterMm}mm</span>
                      <span>Length: {pipe.lengthMeters}m</span>
                      <span>Slope: {pipe.slopePct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
