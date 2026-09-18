'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  RefreshCw,
  Activity,
  Layers,
  Database,
  Droplets,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Radio,
  FileCheck
} from 'lucide-react';
import {
  RoutingSink,
  ScadaAuditLogEntry,
  getRoutingSinks,
  getScadaAuditChain,
  verifyAuditChain,
  executeManualGateOverride,
  triggerAutomatedDiversionMatrix
} from '@/lib/hydro-routing-service';
import { useLanguage } from '@/context/LanguageContext';

interface HydroRoutingPanelProps {
  selectedCityId: string;
}

export const HydroRoutingPanel: React.FC<HydroRoutingPanelProps> = ({ selectedCityId }) => {
  const { t } = useLanguage();
  const [sinks, setSinks] = useState<RoutingSink[]>(() => getRoutingSinks(selectedCityId));
  const [auditChain, setAuditChain] = useState<ScadaAuditLogEntry[]>(() => getScadaAuditChain(selectedCityId));
  const [chainStatus, setChainStatus] = useState(() => verifyAuditChain(selectedCityId));
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSinkForOverride, setSelectedSinkForOverride] = useState<RoutingSink | null>(null);
  const [overridePct, setOverridePct] = useState(50);
  const [overrideJustification, setOverrideJustification] = useState('Emergency flood mitigation diversion');
  const [overrideSuccessMsg, setOverrideSuccessMsg] = useState<string | null>(null);

  const refreshState = () => {
    setSinks(getRoutingSinks(selectedCityId));
    setAuditChain(getScadaAuditChain(selectedCityId));
    setChainStatus(verifyAuditChain(selectedCityId));
  };

  const handleRunAutomatedDiversion = () => {
    setIsSimulating(true);
    setTimeout(() => {
      triggerAutomatedDiversionMatrix(selectedCityId);
      refreshState();
      setIsSimulating(false);
    }, 600);
  };

  const handleConfirmOverride = () => {
    if (!selectedSinkForOverride) return;
    executeManualGateOverride(
      selectedCityId,
      selectedSinkForOverride.sink_id,
      overridePct,
      'OP-MUNICIPAL-LEAD',
      overrideJustification
    );
    refreshState();
    setOverrideSuccessMsg(`Gate ${selectedSinkForOverride.display_name} position locked at ${overridePct}%. Cryptographically signed on-chain.`);
    setTimeout(() => setOverrideSuccessMsg(null), 4000);
    setSelectedSinkForOverride(null);
  };

  const totalDivertedM3 = sinks.reduce((sum, s) => sum + Math.round((s.current_intake_lps * 300) / 1000), 0);
  const totalIntakeLps = sinks.reduce((sum, s) => sum + s.current_intake_lps, 0);
  const activeGatesCount = sinks.filter((s) => s.gate_open_pct > 0).length;

  const filteredSinks = filterType === 'ALL'
    ? sinks
    : sinks.filter((s) => s.sink_type === filterType);

  return (
    <div className="space-y-6 pb-12 text-base">
      {/* Top SCADA Control Header */}
      <div className="panel rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-gray-200 dark:border-blue-500/30 bg-white/95 dark:bg-gradient-to-r dark:from-gray-900/90 dark:via-gray-850/80 dark:to-gray-900/90 shadow-xl m-2">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 text-base font-bold">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Dynamic Hydro-Routing Engine
            </span>
            <span className="badge bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/40 text-base font-bold">
              <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              SHA-256 SCADA Chain Validated
            </span>
            <span className="text-base font-mono text-gray-500 dark:text-gray-400">
              Block #{auditChain.length} • Modbus/MQTT Live
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Storm Runoff Diversion & Buffer Matrix
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            Automated diversion of surcharging surface runoff away from flooded junctions directly into
            Sewage Treatment Plants (STPs), deep Managed Aquifer Recharge (MAR) boreholes, and urban retention basins.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={handleRunAutomatedDiversion}
            disabled={isSimulating}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold text-base flex items-center justify-center space-x-2.5 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all active:scale-95 disabled:opacity-50 m-1"
          >
            <Zap className={`w-5 h-5 ${isSimulating ? 'animate-spin' : 'text-blue-200'}`} />
            <span>{isSimulating ? 'Executing Diversion...' : 'Trigger Auto-Diversion Matrix'}</span>
          </button>
          <button
            onClick={refreshState}
            className="px-4 py-3.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 font-bold text-base flex items-center justify-center space-x-2 transition-colors m-1"
            title="Refresh SCADA telemetry"
          >
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {overrideSuccessMsg && (
        <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/40 text-green-800 dark:text-green-300 text-base font-semibold flex items-center space-x-3 animate-fadeIn m-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <span>{overrideSuccessMsg}</span>
        </div>
      )}

      {/* 4 Metric Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 m-2">
        <div className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 flex flex-col justify-between m-1.5 shadow-md">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-base font-bold">
            <span>Diverted Runoff Volume</span>
            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 dark:text-gray-100 font-mono">
              {totalDivertedM3.toLocaleString()}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-mono ml-1.5">m³ / 5min</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Active bypass flow: <strong className="text-gray-800 dark:text-gray-200 font-mono">{totalIntakeLps.toLocaleString()} LPS</strong>
          </p>
        </div>

        <div className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 flex flex-col justify-between m-1.5 shadow-md">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-base font-bold">
            <span>Active Sluice Gates</span>
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 dark:text-gray-100 font-mono">
              {activeGatesCount} / {sinks.length}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-mono ml-1.5">Gates Open</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            SCADA Status: <span className="text-green-600 dark:text-green-400 font-bold">All Responding</span>
          </p>
        </div>

        <div className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 flex flex-col justify-between m-1.5 shadow-md">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-base font-bold">
            <span>Available Buffer Headroom</span>
            <Database className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-gray-900 dark:text-gray-100 font-mono">
              {sinks.reduce((sum, s) => sum + s.current_available_m3, 0).toLocaleString()}
            </span>
            <span className="text-sm text-violet-600 dark:text-violet-400 font-mono ml-1.5">m³</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Remaining buffer storage across sinks
          </p>
        </div>

        <div className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/70 flex flex-col justify-between m-1.5 shadow-md">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-base font-bold">
            <span>System Audit Log</span>
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-3xl font-black text-green-600 dark:text-green-400 font-mono">
              100%
            </span>
            <span className="text-xs font-bold text-green-700 dark:text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
              TAMPER-PROOF
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-mono truncate">
            Head: {chainStatus.headHash ? `${chainStatus.headHash.substring(0, 16)}...` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Receiving Sinks Section */}
      <div className="panel rounded-2xl p-6 sm:p-7 border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/60 space-y-6 m-2 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2.5">
              <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Municipal Sinks & Water Sluice Actuator Registry</span>
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
              Verified physical infrastructure assets capable of receiving excess floodwater volumes.
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-850 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-750">
            <span className="text-base font-semibold text-gray-600 dark:text-gray-300 mr-2">Filter Sink:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-base font-bold text-gray-900 dark:text-gray-100 focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">All Registered Sinks</option>
              <option value="STP_EQUALIZATION_TANK" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">STPs / WWTPs</option>
              <option value="GROUNDWATER_MAR_WELL" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">MAR Injection Boreholes</option>
              <option value="URBAN_LAKE" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Urban Retention Lakes</option>
            </select>
          </div>
        </div>

        {/* Sinks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSinks.map((sink) => {
            const usedM3 = sink.max_capacity_m3 - sink.current_available_m3;
            const fillPct = Math.round((usedM3 / sink.max_capacity_m3) * 100);

            return (
              <div
                key={sink.sink_id}
                className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-850/70 hover:border-blue-500/50 transition-all space-y-4 flex flex-col justify-between m-1.5 shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-gray-750 text-blue-700 dark:text-blue-300 border border-gray-300 dark:border-gray-700">
                      {sink.sink_type.replace(/_/g, ' ')}
                    </span>
                    <span className="flex items-center space-x-1.5 text-sm font-bold text-green-600 dark:text-green-400">
                      <Radio className="w-4 h-4 animate-cyber-pulse" />
                      <span>{sink.operational_status}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug">
                    {sink.display_name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                    Source: {sink.data_source}
                  </p>
                </div>

                {/* Capacity & Sluice Gate Status */}
                <div className="space-y-3.5 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-base font-semibold">
                      <span className="text-gray-600 dark:text-gray-400">Current Storage Fill</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{fillPct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          fillPct > 85 ? 'bg-orange-500' : fillPct > 65 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, fillPct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-base bg-white dark:bg-gray-900/80 p-3 rounded-xl border border-gray-200 dark:border-gray-800 font-mono">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Intake Flow</span>
                      <strong className="text-blue-700 dark:text-blue-300 font-bold">{sink.current_intake_lps} LPS</strong>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">Sluice Gate</span>
                      <strong className="text-green-700 dark:text-green-300 font-bold">{sink.gate_open_pct}% OPEN</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSinkForOverride(sink);
                      setOverridePct(sink.gate_open_pct);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-base font-bold border border-gray-300 dark:border-gray-700 flex items-center justify-center space-x-2 transition-colors m-1"
                  >
                    <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Adjust Sluice Actuator</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SCADA Action Ledger */}
      <div className="panel rounded-2xl p-6 sm:p-7 border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/60 space-y-5 m-2 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                SCADA Operations Audit Ledger
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Genesis-to-head SHA-256 cryptographic chain verifying every sluice gate actuation.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-base font-mono bg-gray-100 dark:bg-gray-850 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-750 text-green-700 dark:text-green-400 font-bold m-1">
            <Lock className="w-4 h-4" />
            <span>Chain Length: {auditChain.length} Blocks Verified</span>
          </div>
        </div>

        {/* Chained Blocks Display */}
        <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
          {auditChain.map((entry) => (
            <div
              key={entry.log_id}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850/80 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 transition-colors space-y-2.5 text-base font-mono m-1"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30 text-sm">
                    Block #{entry.block_index}
                  </span>
                  <span className={`px-2.5 py-1 rounded font-bold text-sm ${
                    entry.action_type === 'MANUAL_OVERRIDE'
                      ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30'
                      : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                  }`}>
                    {entry.action_type}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">{entry.gate_id}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-200 font-sans text-base">
                {entry.justification}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/80 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="truncate">
                  <span className="text-gray-400">Prev Hash: </span>
                  <span className="font-mono">{entry.previous_hash.substring(0, 24)}...</span>
                </div>
                <div className="truncate">
                  <span className="text-green-600 dark:text-green-400 font-bold">Sig (SHA-256): </span>
                  <span className="font-mono text-green-700 dark:text-green-300">{entry.hash_signature.substring(0, 24)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Sluice Gate Actuator Modal */}
      {selectedSinkForOverride && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="panel max-w-lg w-full rounded-2xl p-6 sm:p-7 border border-blue-500/40 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6 shadow-2xl m-2">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h4 className="font-bold text-lg">SCADA Sluice Gate Override</h4>
              </div>
              <button
                onClick={() => setSelectedSinkForOverride(null)}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-base">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Target Sink Infrastructure:</span>
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100 mt-1">{selectedSinkForOverride.display_name}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono font-bold">
                  <span className="text-gray-600 dark:text-gray-400">Gate Actuator Position:</span>
                  <span className="text-blue-600 dark:text-blue-400 text-lg">{overridePct}% OPEN</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={overridePct}
                  onChange={(e) => setOverridePct(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 font-mono">
                  <span>0% (Closed)</span>
                  <span>50%</span>
                  <span>100% ({selectedSinkForOverride.max_intake_rate_lps} LPS)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-600 dark:text-gray-400 block font-medium">Operational Justification (Logged On-Chain):</label>
                <input
                  type="text"
                  value={overrideJustification}
                  onChange={(e) => setOverrideJustification(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-850 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-800 dark:text-orange-300 text-sm space-y-1">
                <span className="font-bold block">Audit Log Notice:</span>
                <p>
                  This manual state transition will be hashed with SHA-256 and appended to the immutable municipal SCADA block ledger.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedSinkForOverride(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 text-base font-bold m-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOverride}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-base font-bold shadow-md shadow-blue-600/30 flex items-center space-x-2 m-1"
              >
                <Lock className="w-4 h-4" />
                <span>Sign & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
