'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { TimeSlider } from '@/components/TimeSlider';
import { DrainageGraphPanel } from '@/components/DrainageGraphPanel';
import { AlertFeed } from '@/components/AlertFeed';
import { SitRepExporter } from '@/components/SitRepExporter';
import { TideWaterbodyWidget } from '@/components/TideWaterbodyWidget';
import { CityId, CITIES } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { getPumpingStationsForCity } from '@/lib/pumping-station-service';
import { Building2, Zap, FileText, CheckCircle2, Power, Languages, Shield, ArrowLeft, Map, Sliders } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { ThemeToggle } from '@/components/ThemeToggle';

// Dynamically import OpenLayersMapCanvas with SSR disabled
const OpenLayersMapCanvas = dynamic(
  () => import('@/components/OpenLayersMapCanvas').then((mod) => mod.OpenLayersMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-3 rounded-2xl border border-gray-200">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-blue-800 font-mono font-bold">
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
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const [timeOffsetMins, setTimeOffsetMins] = useState(0);
  const [isSitRepModalOpen, setIsSitRepModalOpen] = useState(false);
  const [pumpStates, setPumpStates] = useState<Record<string, boolean>>({});
  const [mobileTab, setMobileTab] = useState<'map' | 'panel'>('map');

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
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans overflow-x-hidden">
      {/* Authority Command Header (Shadcn Dark Command Bar) */}
      <header className="w-full bg-gray-950/95 backdrop-blur-xl text-white px-4 md:px-5 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToLanding}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-gray-300 text-xs font-bold transition-all border border-gray-700/80 active:scale-95"
            title={t.nav.backToLanding}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm md:text-base font-black tracking-tight text-white font-mono">
                  {t.dashboard.title}
                </h1>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {city.name} Command
                </span>
              </div>
              <p className="text-[10.5px] text-gray-400 font-medium">{t.dashboard.subTitle}</p>
            </div>
          </div>
        </div>

        {/* City Selector, Language & Officer Status */}
        <div className="flex items-center space-x-2.5 flex-wrap">
          <ThemeToggle />
          {/* Language Selector */}
          <div className="relative flex items-center bg-gray-900 border border-gray-700 px-2 py-1 rounded-xl text-xs">
            <Languages className="w-3.5 h-3.5 text-blue-400 mr-1 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs text-white focus:outline-none pr-1 cursor-pointer font-bold"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="bg-gray-900 text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection Dropdown */}
          <div className="flex items-center bg-gray-900 border border-gray-700 px-2.5 py-1 rounded-xl text-xs">
            <span className="hidden sm:inline text-gray-400 mr-1 font-medium">{t.nav.selectCity}:</span>
            <select
              value={selectedCityId}
              onChange={(e) => onSelectCity(e.target.value as CityId)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              <option value="mumbai" className="bg-gray-900 text-white">Mumbai</option>
              <option value="delhi" className="bg-gray-900 text-white">Delhi NCR</option>
              <option value="chennai" className="bg-gray-900 text-white">Chennai</option>
            </select>
          </div>

          {/* SitRep Exporter Button */}
          <button
            onClick={() => setIsSitRepModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-gray-950 font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.dashboard.exportSitRep}</span>
          </button>

          {/* Officer Badge & Logout */}
          <div className="flex items-center space-x-1.5 bg-gray-900 border border-gray-700 px-2.5 py-1 rounded-xl text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-mono font-bold text-gray-200 text-[11px] truncate max-w-[100px]">{authorityAuth.loginId.split('.')[0]}</span>
            <button
              onClick={onLogoutAuthority}
              className="ml-1 text-gray-400 hover:text-orange-400 font-bold text-[11px] transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Mobile View Switcher (Visible on screens < lg) */}
      <div className="lg:hidden flex justify-center px-4 pt-2.5">
        <div className="bg-gray-200/90 backdrop-blur-md p-1 rounded-2xl flex space-x-1 border border-gray-300 shadow-2xs w-full max-w-sm">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              mobileTab === 'map' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Command GIS Map</span>
          </button>
          <button
            onClick={() => setMobileTab('panel')}
            className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              mobileTab === 'panel' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>SCADA & Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Authority Command Workspace */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1800px] mx-auto w-full lg:h-[calc(100vh-76px)] overflow-y-auto lg:overflow-hidden">
        {/* Left Side Authority Controls (4 Cols on Desktop, Toggled on Mobile) */}
        <div className={`${mobileTab === 'panel' ? 'flex' : 'hidden'} lg:flex lg:col-span-4 flex-col gap-3.5 overflow-y-auto pr-1`}>
          {/* Tide & Water-Body Telemetry Widget */}
          <TideWaterbodyWidget
            selectedCityId={selectedCityId}
            timeOffsetMins={timeOffsetMins}
            rainfallRateMmHr={snapshot.rainfallRateMmHr}
          />

          {/* Dewatering Pump Control Station */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                  {t.dashboard.pumpControllerTitle} ({city.name})
                </h2>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded-full font-mono font-bold border border-blue-200">
                {pumpingStations.length} Stations
              </span>
            </div>

            <div className="space-y-2 text-xs max-h-60 overflow-y-auto pr-1">
              {pumpingStations.map((pump) => {
                const isActive = pumpStates[pump.id] ?? pump.isOperational;

                return (
                  <div key={pump.id} className="p-3 rounded-xl bg-gray-50/90 border border-gray-200 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{pump.name}</p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        Cap: {pump.capacityLps.toLocaleString()} L/s • Pumps: {pump.activePumpsCount}/{pump.totalPumpsCount}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[180px]">{pump.locationName}</p>
                    </div>

                    <button
                      onClick={() => togglePump(pump.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isActive ? t.dashboard.activatePump : t.dashboard.deactivatePump}</span>
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
            onSelectFeature={() => {
              setMobileTab('map');
            }}
          />
        </div>

        {/* Center/Right OpenLayers Spatial GIS Canvas (8 Cols on Desktop, Toggled on Mobile) */}
        <div className={`${mobileTab === 'map' ? 'flex' : 'hidden'} lg:flex lg:col-span-8 flex-col gap-3 h-full relative`}>
          <div className="flex-1 relative min-h-[420px] md:min-h-[500px]">
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
