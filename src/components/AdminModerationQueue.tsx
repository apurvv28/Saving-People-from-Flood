'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Truck,
  Layers,
  Clock,
  Filter,
  RefreshCw,
  Sparkles,
  MapPin,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import {
  CitizenSignal,
  SignalStatus,
  ISSUE_TYPE_CONFIG,
  getCitizenSignals,
  updateSignalStatus,
  getActiveBlockagePenalty
} from '@/lib/citizen-signals-service';

interface AdminModerationQueueProps {
  selectedCityId: string;
}

export const AdminModerationQueue: React.FC<AdminModerationQueueProps> = ({ selectedCityId }) => {
  const [signals, setSignals] = useState<CitizenSignal[]>(() => getCitizenSignals(selectedCityId));
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const refreshList = () => {
    setSignals(getCitizenSignals(selectedCityId));
  };

  const handleAction = (id: string, newStatus: SignalStatus, actionLabel: string) => {
    updateSignalStatus(id, newStatus, 'MUNICIPAL_DISASTER_CELL_01');
    refreshList();
    setActionNotice(`${actionLabel} applied for signal ${id}. Hydraulic capacity factor recalculated.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const pendingCount = signals.filter((s) => s.status === 'active').length;
  const validatedCount = signals.filter((s) => s.status === 'validated').length;
  const resolvedCount = signals.filter((s) => s.status === 'resolved').length;
  const activePenalty = getActiveBlockagePenalty(selectedCityId);

  const filteorangeSignals = signals.filter((s) => {
    if (activeTab === 'pending') return s.status === 'active';
    if (activeTab === 'validated') return s.status === 'validated';
    if (activeTab === 'resolved') return s.status === 'resolved';
    if (activeTab === 'rejected') return s.status === 'rejected';
    return true; // 'all'
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Authority Command Header */}
      <div className="panel rounded-2xl p-6 sm:p-8 border border-blue-500/30 bg-gradient-to-r from-gray-900/90 via-gray-850/80 to-gray-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              Municipal Command & Moderation Portal
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-100 tracking-tight">
            Stormwater Drain Moderation & Crew Dispatch Desk
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Verify citizen-reported clogs and sewer backflows. Approving a report automatically applies
            a dynamic head-loss penalty to the corresponding node in the 0–3h flood nowcasting engine.
          </p>
        </div>

        <button
          onClick={refreshList}
          className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 text-xs font-bold flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          <span>Sync Queue</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/40 text-blue-300 text-xs font-medium flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card rounded-2xl p-5 border border-gray-800/80 bg-gray-900/60 flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400">Pending Operator Review</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">{pendingCount}</span>
            <span className="text-xs text-gray-400">Awaiting triage</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">Citizen crowdsourced reports</p>
        </div>

        <div className="card rounded-2xl p-5 border border-gray-800/80 bg-gray-900/60 flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400">Validated Bottlenecks</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">{validatedCount}</span>
            <span className="text-xs text-orange-400">Active Hotspots</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">Affecting hydraulic flow velocities</p>
        </div>

        <div className="card rounded-2xl p-5 border border-gray-800/80 bg-gray-900/60 flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400">Clogs Cleaorange & Resolved</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-green-400 font-mono">{resolvedCount}</span>
            <span className="text-xs text-green-400">Fully Restoorange</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">Desilting crews completed work</p>
        </div>

        <div className="card rounded-2xl p-5 border border-gray-800/80 bg-gray-900/60 flex flex-col justify-between">
          <span className="text-xs font-semibold text-gray-400">Hydraulic Mesh Multiplier</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              {Math.round(activePenalty * 100)}%
            </span>
            <span className="text-xs text-blue-400">Capacity</span>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">Real-time SWMM calibration factor</p>
        </div>
      </div>

      {/* Main Moderation Table / Cards */}
      <div className="panel rounded-2xl p-6 sm:p-7 border border-gray-800/80 bg-gray-900/50 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-gray-100 text-base">Triage & Dispatch Stream</h3>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-850 p-1 rounded-xl border border-gray-750">
            {[
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'validated', label: `Validated (${validatedCount})` },
              { id: 'resolved', label: `Resolved (${resolvedCount})` },
              { id: 'all', label: `All Reports (${signals.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Signals Moderation Queue Cards */}
        <div className="space-y-4">
          {filteorangeSignals.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-mono">
              No reports in this category. System operations operating nominally.
            </div>
          ) : (
            filteorangeSignals.map((sig) => {
              const cfg = ISSUE_TYPE_CONFIG[sig.issueType];
              return (
                <div
                  key={sig.id}
                  className="card rounded-xl p-5 border border-gray-800 bg-gray-850/60 hover:border-blue-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${cfg.badgeColor}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[11px] font-mono text-blue-300 bg-gray-750 px-2 py-0.5 rounded border border-gray-700">
                        {sig.nearestManholeId}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {new Date(sig.reportedAt).toLocaleTimeString()}
                      </span>
                      <span className="text-[11px] text-orange-400 font-mono font-bold">
                        {Math.round(sig.severityRatio * 100)}% Head Restriction
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-100 text-sm leading-snug">
                      {sig.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {sig.description}
                    </p>

                    <div className="text-[11px] text-gray-400 flex items-center space-x-3">
                      <span>Reporter: <strong className="text-gray-200">{sig.reporterAlias}</strong></span>
                      <span>•</span>
                      <span>Coordinates: <strong className="text-gray-200">{sig.latitude.toFixed(4)}, {sig.longitude.toFixed(4)}</strong></span>
                      {sig.verifiedBy && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">Verified by: {sig.verifiedBy}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Group */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
                    {sig.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleAction(sig.id, 'validated', 'Verified & Applied Model Restriction')}
                          className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold shadow-md shadow-green-600/20 flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify & Restrict</span>
                        </button>
                        <button
                          onClick={() => handleAction(sig.id, 'rejected', 'Dismissed false report')}
                          className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-400 hover:text-orange-400 text-xs font-semibold border border-gray-700 transition-colors"
                          title="Dismiss report"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {sig.status === 'validated' && (
                      <button
                        onClick={() => handleAction(sig.id, 'resolved', 'Desilting completed, capacity restoorange')}
                        className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Crew & Resolve</span>
                      </button>
                    )}

                    {sig.status === 'resolved' && (
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-xl border border-blue-500/30 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Clog Cleaorange</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

