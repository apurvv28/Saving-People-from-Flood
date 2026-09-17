'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { LandingPage } from '@/components/LandingPage';
import { HeaderNavbar, AppTab } from '@/components/HeaderNavbar';
import { TimeSlider } from '@/components/TimeSlider';
import { RoutingWidget } from '@/components/RoutingWidget';
import { AlertFeed } from '@/components/AlertFeed';
import { ReportModal } from '@/components/ReportModal';
import { AuthorityAuthModal } from '@/components/AuthorityAuthModal';
import { AuthorityDashboard } from '@/components/AuthorityDashboard';
import { HydroRoutingPanel } from '@/components/HydroRoutingPanel';
import { CitizenSignalDesk } from '@/components/CitizenSignalDesk';
import { AdminModerationQueue } from '@/components/AdminModerationQueue';
import { WaterBodiesAtlas } from '@/components/WaterBodiesAtlas';
import { SitRepExporter } from '@/components/SitRepExporter';
import { CityId, CITIES, INITIAL_CITIZEN_REPORTS, CitizenReport, NavigationRoute } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { HISTORICAL_CLOUDBURST_EVENTS } from '@/lib/openmeteo-service';
import { Map, Sliders, Zap, Radio, FileCheck, Anchor, Layers, Compass } from 'lucide-react';

// Dynamically import OpenLayersMapCanvas with SSR disabled
const OpenLayersMapCanvas = dynamic(
  () => import('@/components/OpenLayersMapCanvas').then((mod) => mod.OpenLayersMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-space-900 flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-800">
        <div className="w-9 h-9 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-cyan-400 font-mono font-bold">
          Loading OpenLayers GIS Vector Engine...
        </p>
      </div>
    )
  }
);

// Dynamically import CitizenAppView with SSR disabled
const CitizenAppView = dynamic(
  () => import('@/components/CitizenAppView').then((mod) => mod.CitizenAppView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-space-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-cyan-400 font-mono font-bold">
          Loading VRISHTI Citizen App...
        </p>
      </div>
    )
  }
);

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'citizen_app' | 'citizen_dashboard' | 'authority_dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<AppTab>('nowcast_gis');
  const [selectedCityId, setSelectedCityId] = useState<CityId>('mumbai');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [lang, setLang] = useState('en');
  const [timeOffsetMins, setTimeOffsetMins] = useState(0);
  const [mobileGisTab, setMobileGisTab] = useState<'map' | 'panel'>('map');

  // Authority Authentication State
  const [authorityAuth, setAuthorityAuth] = useState<{ isLoggedIn: boolean; loginId: string; cityId: CityId } | null>(null);

  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  // Map Pin Picker State for Routing
  const [routePinMode, setRoutePinMode] = useState<'none' | 'origin' | 'destination'>('none');
  const [pinnedOrigin, setPinnedOrigin] = useState<[number, number] | null>(null);
  const [pinnedDestination, setPinnedDestination] = useState<[number, number] | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSitRepOpen, setIsSitRepOpen] = useState(false);
  const [authDefaultCity, setAuthDefaultCity] = useState<CityId>('mumbai');

  // Active rain timeline from selected event or default
  const activeEvent = HISTORICAL_CLOUDBURST_EVENTS.find((e) => e.id === selectedEventId);
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId, activeEvent?.timelineMmHr);

  const handleSelectCityFromLanding = (cityId: CityId) => {
    setSelectedCityId(cityId);
    setSelectedEventId(null);
    setPinnedOrigin(null);
    setPinnedDestination(null);
    setRoutePinMode('none');
    setViewMode('citizen_dashboard');
  };

  const handleLocationPicked = (mode: 'origin' | 'destination', coords: [number, number]) => {
    if (mode === 'origin') {
      setPinnedOrigin(coords);
    } else {
      setPinnedDestination(coords);
    }
  };

  const handleOpenAuthModal = (cityId?: CityId) => {
    if (cityId) setAuthDefaultCity(cityId);
    setIsAuthModalOpen(true);
  };

  const handleSuccessLogin = (cityId: CityId, loginId: string) => {
    setAuthorityAuth({ isLoggedIn: true, loginId, cityId });
    setSelectedCityId(cityId);
    setViewMode('authority_dashboard');
  };

  const handleLogoutAuthority = () => {
    setAuthorityAuth(null);
    setViewMode('citizen_dashboard');
  };

  const handleAddReport = (report: CitizenReport) => {
    setCitizenReports((prev) => [report, ...prev]);
  };

  // 1. Landing View
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onSelectCity={handleSelectCityFromLanding}
          onGoToCitizenApp={() => setViewMode('citizen_app')}
          onOpenAuthModal={handleOpenAuthModal}
          authorityAuth={authorityAuth}
        />
        <AuthorityAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultCityId={authDefaultCity}
          onSuccessLogin={handleSuccessLogin}
        />
      </>
    );
  }

  // 2. Dedicated Mobile-First Citizen Web App View
  if (viewMode === 'citizen_app') {
    return (
      <CitizenAppView
        selectedCityId={selectedCityId}
        onSelectCity={(cityId) => setSelectedCityId(cityId)}
        onGoToLanding={() => setViewMode('landing')}
        onOpenAuthModal={() => handleOpenAuthModal(selectedCityId)}
        citizenReports={citizenReports}
        onAddReport={handleAddReport}
      />
    );
  }

  // 3. Separate Authority Command Dashboard View
  if (viewMode === 'authority_dashboard' && authorityAuth?.isLoggedIn) {
    return (
      <AuthorityDashboard
        selectedCityId={selectedCityId}
        onSelectCity={(cityId) => {
          setSelectedCityId(cityId);
          setSelectedEventId(null);
        }}
        onGoToLanding={() => setViewMode('landing')}
        onGoToCitizenDashboard={() => setViewMode('citizen_dashboard')}
        authorityAuth={authorityAuth}
        onLogoutAuthority={handleLogoutAuthority}
      />
    );
  }

  // 4. Dedicated Public Citizen Dashboard (Unified Web3 Hub)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-space-950 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden transition-colors duration-200">
      {/* Public Citizen Header Navigation with Tab Switcher */}
      <HeaderNavbar
        selectedCityId={selectedCityId}
        onSelectCity={(cityId) => {
          setSelectedCityId(cityId);
          setSelectedEventId(null);
        }}
        onGoToLanding={() => setViewMode('landing')}
        onGoToCitizenApp={() => setViewMode('citizen_app')}
        authorityAuth={authorityAuth}
        onOpenAuthModal={() => handleOpenAuthModal(selectedCityId)}
        onLogoutAuthority={handleLogoutAuthority}
        onGoToAuthorityDashboard={() => setViewMode('authority_dashboard')}
        selectedEventId={selectedEventId}
        onSelectEventId={setSelectedEventId}
        lang={lang}
        setLang={setLang}
        maxWaterDepthCm={snapshot.maxWaterDepthCm}
        floodedRoadsCount={snapshot.totalFloodedRoadsCount}
        surchargingNodesCount={snapshot.criticalSurchargeNodesCount}
        rainfallRateMmHr={snapshot.rainfallRateMmHr}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenSitRepModal={() => setIsSitRepOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Mobile Tab Switcher for Main Views (Screens < xl) */}
      <div className="xl:hidden flex justify-center px-4 pt-3 pb-1">
        <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 border border-slate-700 bg-space-900/90 shadow-lg w-full max-w-lg">
          {[
            { id: 'nowcast_gis', label: 'GIS Map', icon: Compass },
            { id: 'hydro_routing', label: 'Routing', icon: Zap },
            { id: 'citizen_signals', label: 'Signals', icon: Radio },
            { id: 'admin_moderation', label: 'Triage', icon: FileCheck },
            { id: 'water_bodies', label: 'Lakes', icon: Anchor }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AppTab)}
                className={`flex-1 min-w-[65px] py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-[1850px] mx-auto w-full">
        {/* Tab 1: Spatial GIS Inundation Nowcast */}
        {activeTab === 'nowcast_gis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full lg:h-[calc(100vh-92px)]">
            {/* Mobile Switcher for Map vs Panels (only inside GIS tab on mobile) */}
            <div className="lg:hidden flex justify-center col-span-1">
              <div className="bg-space-850 p-1 rounded-xl flex space-x-1 border border-slate-700 w-full max-w-sm">
                <button
                  onClick={() => setMobileGisTab('map')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                    mobileGisTab === 'map' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>GIS Canvas</span>
                </button>
                <button
                  onClick={() => setMobileGisTab('panel')}
                  className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                    mobileGisTab === 'panel' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Route Planner & Alerts</span>
                </button>
              </div>
            </div>

            {/* Left Column Control Panel (4 Cols on Desktop) */}
            <div className={`${mobileGisTab === 'panel' ? 'flex' : 'hidden'} lg:flex lg:col-span-4 flex-col gap-4 overflow-y-auto pr-1`}>
              <RoutingWidget
                selectedCityId={selectedCityId}
                timeOffsetMins={timeOffsetMins}
                activeRoute={activeRoute}
                setActiveRoute={setActiveRoute}
                routePinMode={routePinMode}
                setRoutePinMode={setRoutePinMode}
                pinnedOrigin={pinnedOrigin}
                pinnedDestination={pinnedDestination}
              />

              <AlertFeed
                selectedCityId={selectedCityId}
                timeOffsetMins={timeOffsetMins}
                onSelectFeature={(id) => {
                  setSelectedFeatureId(id);
                  setMobileGisTab('map');
                }}
              />
            </div>

            {/* Right Column OpenLayers Map Canvas & Time Slider (8 Cols on Desktop) */}
            <div className={`${mobileGisTab === 'map' ? 'flex' : 'hidden'} lg:flex lg:col-span-8 flex-col gap-3.5 h-full relative`}>
              <div className="flex-1 relative min-h-[460px] md:min-h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <OpenLayersMapCanvas
                  selectedCityId={selectedCityId}
                  timeOffsetMins={timeOffsetMins}
                  personaMode="citizen"
                  activeRoute={activeRoute}
                  citizenReports={citizenReports.filter((r) => r.cityId === selectedCityId || !r.cityId)}
                  selectedFeatureId={selectedFeatureId}
                  setSelectedFeatureId={setSelectedFeatureId}
                  routePinMode={routePinMode}
                  setRoutePinMode={setRoutePinMode}
                  pinnedOrigin={pinnedOrigin}
                  pinnedDestination={pinnedDestination}
                  onLocationPicked={handleLocationPicked}
                />
              </div>

              {/* 0–3 Hour Forecast Scrubber */}
              <TimeSlider
                timeOffsetMins={timeOffsetMins}
                setTimeOffsetMins={setTimeOffsetMins}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Dynamic Hydro-Routing with Web3 SCADA Audit Chain */}
        {activeTab === 'hydro_routing' && (
          <HydroRoutingPanel selectedCityId={selectedCityId} />
        )}

        {/* Tab 3: Crowdsourced Citizen Signals Desk */}
        {activeTab === 'citizen_signals' && (
          <CitizenSignalDesk selectedCityId={selectedCityId} />
        )}

        {/* Tab 4: Municipal Admin Moderation Queue */}
        {activeTab === 'admin_moderation' && (
          <AdminModerationQueue selectedCityId={selectedCityId} />
        )}

        {/* Tab 5: Catchment & Water Bodies Atlas */}
        {activeTab === 'water_bodies' && (
          <WaterBodiesAtlas selectedCityId={selectedCityId} />
        )}
      </main>

      {/* Global Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedCityId={selectedCityId}
        onAddReport={handleAddReport}
      />

      <AuthorityAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultCityId={authDefaultCity}
        onSuccessLogin={handleSuccessLogin}
      />

      <SitRepExporter
        isOpen={isSitRepOpen}
        onClose={() => setIsSitRepOpen(false)}
        selectedCityId={selectedCityId}
        timeOffsetMins={timeOffsetMins}
      />
    </div>
  );
}
