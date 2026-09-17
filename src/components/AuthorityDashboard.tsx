'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { TimeSlider } from '@/components/TimeSlider';
import { DrainageGraphPanel } from '@/components/DrainageGraphPanel';
import { AlertFeed } from '@/components/AlertFeed';
import { SitRepExporter } from '@/components/SitRepExporter';
import { TideWaterbodyWidget } from '@/components/TideWaterbodyWidget';
import { CityId, CITIES, NavigationRoute } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { getPumpingStationsForCity } from '@/lib/pumping-station-service';
import { Shield, Building2, Zap, Activity, FileText, CheckCircle2, AlertOctagon, RefreshCw, Power } from 'lucide-react';

// Dynamically import OpenLayersMapCanvas with SSR disabled
const OpenLayersMapCanvas = dynamic(
  () => import('@/components/OpenLayersMapCanvas').then((mod) => mod.OpenLayersMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-200">
        <div className="w-9 h-9 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-teal-800 font-mono font-bold">
          Loading OpenLayers Authority Command GIS Canvas...
        </p>
      </div>
    )
  }
);

interface AuthorityDashboardProps {
  selectedCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
  onGoToLanding: () => void;
  onGoToCitizenDashboard: () => void;
  authorityAuth: { isLoggedIn: boolean; loginId: string; cityId: CityId };
  onLogoutAuthority: () => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  selectedCityId,
  onSelectCity,
  onGoToLanding,
  onGoToCitizenDashboard,
  authorityAuth,
  onLogoutAuthority
}) => {
  const [timeOffsetMins, setTimeOffsetMins] = useState(0);
  const [isSitRepModalOpen, setIsSitRepModalOpen] = useState(false);
  const [pumpStates, setPumpStates] = useState<Record<string, boolean>>({});

  const city = CITIES[selectedCityId];
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId, undefined, pumpStates);
  const pumpingStations = getPumpingStationsForCity(selectedCityId);

  const togglePump = (pumpId: string) => {
    setPumpStates((prev) => {
      const current = prev[pumpId] ?? true;
      return {
        ...prev,
        [pumpId]: !current
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Authority Command Navbar */}
      <header className="w-full bg-teal-800 text-white px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToLanding}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-900/60 hover:bg-teal-900 text-teal-100 text-xs transition-all border border-teal-700"
            title="Back to Landing Page"
          >
            <span>← Landing</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Authority Command Portal
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-900/80 text-teal-200 border border-teal-600">
                  {city.name} Command
                </span>
              </div>
              <p className="text-[11px] text-teal-200">Ministry of Earth Sciences / Municipal Disaster Control Room</p>
            </div>
          </div>
        </div>

        {/* City Selector & Officer Status */}
        <div className="flex items-center space-x-3">
          {/* City Selection Dropdown */}
          <div className="flex items-center bg-teal-900/80 border border-teal-600 px-2.5 py-1 rounded-lg text-xs">
            <span className="text-teal-300 mr-1.5 font-medium">Jurisdiction:</span>
            <select
              value={selectedCityId}
              onChange={(e) => onSelectCity(e.target.value as CityId)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="mumbai" className="bg-teal-900 text-white">Mumbai Metro</option>
              <option value="delhi" className="bg-teal-900 text-white">Delhi NCR</option>
              <option value="chennai" className="bg-teal-900 text-white">Chennai Metro</option>
            </select>
          </div>

          {/* SitRep Exporter Button */}
          <button
            onClick={() => setIsSitRepModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Executive SitRep</span>
          </button>

          {/* Officer Badge & Logout */}
          <div className="flex items-center space-x-2 bg-teal-900/90 border border-teal-600 px-3 py-1 rounded-lg text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
            <span className="font-mono font-bold text-teal-100">{authorityAuth.loginId}</span>
            <button
              onClick={onLogoutAuthority}
              className="ml-2 text-teal-300 hover:text-red-300 font-bold underline transition-colors text-[11px]"
            >
              Exit Authority Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main Authority Command Workspace */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1800px] mx-auto w-full h-[calc(100vh-76px)]">
        {/* Left Side Authority Controls (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">
          {/* Tide & Water-Body Telemetry Widget */}
          <TideWaterbodyWidget
            selectedCityId={selectedCityId}
            timeOffsetMins={timeOffsetMins}
            rainfallRateMmHr={snapshot.rainfallRateMmHr}
          />

          {/* Dewatering Pump Control Station */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                  SCADA Dewatering Pumping Complex ({city.name})
                </h2>
              </div>
              <span className="text-[10px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full font-mono font-bold">
                {pumpingStations.length} Stations
              </span>
            </div>

            <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
              {pumpingStations.map((pump) => {
                const isActive = pumpStates[pump.id] ?? pump.isOperational;

                return (
                  <div key={pump.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{pump.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Cap: {pump.capacityLps.toLocaleString()} L/s • Pumps: {pump.activePumpsCount}/{pump.totalPumpsCount}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{pump.locationName}</p>
                    </div>

                    <button
                      onClick={() => togglePump(pump.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isActive ? 'SCADA ACTIVE' : 'STANDBY'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1D Drainage Network Graph Telemetry */}
          <DrainageGraphPanel
            selectedCityId={selectedCityId}
            timeOffsetMins={timeOffsetMins}
          />

          {/* Severe Inundation Bottlenecks Monitor */}
          <AlertFeed
            selectedCityId={selectedCityId}
            timeOffsetMins={timeOffsetMins}
            onSelectFeature={() => {}}
          />
        </div>

        {/* Center/Right OpenLayers Spatial GIS Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3 h-full relative">
          <div className="flex-1 relative min-h-[450px]">
            <OpenLayersMapCanvas
              selectedCityId={selectedCityId}
              timeOffsetMins={timeOffsetMins}
              personaMode="authority"
              activeRoute={null}
              citizenReports={[]}
              selectedFeatureId={null}
              setSelectedFeatureId={() => {}}
            />
          </div>

          {/* 0–3 Hour Forecast Timeline Scrubber */}
          <TimeSlider
            timeOffsetMins={timeOffsetMins}
            setTimeOffsetMins={setTimeOffsetMins}
          />
        </div>
      </main>

      {/* Situation Report Exporter Modal */}
      <SitRepExporter
        isOpen={isSitRepModalOpen}
        onClose={() => setIsSitRepModalOpen(false)}
        selectedCityId={selectedCityId}
        timeOffsetMins={timeOffsetMins}
      />
    </div>
  );
};
