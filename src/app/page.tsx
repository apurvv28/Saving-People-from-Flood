'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { LandingPage } from '@/components/LandingPage';
import { HeaderNavbar } from '@/components/HeaderNavbar';
import { TimeSlider } from '@/components/TimeSlider';
import { RoutingWidget } from '@/components/RoutingWidget';
import { AlertFeed } from '@/components/AlertFeed';
import { ReportModal } from '@/components/ReportModal';
import { AuthorityAuthModal } from '@/components/AuthorityAuthModal';
import { AuthorityDashboard } from '@/components/AuthorityDashboard';
import { CityId, CITIES, INITIAL_CITIZEN_REPORTS, CitizenReport, NavigationRoute } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { HISTORICAL_CLOUDBURST_EVENTS } from '@/lib/openmeteo-service';

// Dynamically import OpenLayersMapCanvas with SSR disabled
const OpenLayersMapCanvas = dynamic(
  () => import('@/components/OpenLayersMapCanvas').then((mod) => mod.OpenLayersMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-200">
        <div className="w-9 h-9 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-teal-800 font-mono font-bold">
          Loading OpenLayers GIS Vector Engine...
        </p>
      </div>
    )
  }
);

export default function Home() {
  const [viewMode, setViewMode] = useState<'landing' | 'citizen_dashboard' | 'authority_dashboard'>('landing');
  const [selectedCityId, setSelectedCityId] = useState<CityId>('mumbai');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [lang, setLang] = useState('en');
  const [timeOffsetMins, setTimeOffsetMins] = useState(0);

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
  const [authDefaultCity, setAuthDefaultCity] = useState<CityId>('mumbai');

  // Active rain timeline from selected event or default
  const activeEvent = HISTORICAL_CLOUDBURST_EVENTS.find(e => e.id === selectedEventId);
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

  // 2. Separate Authority Command Dashboard View
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

  // 3. Dedicated Public Citizen Dashboard (OpenLayers GIS Map)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Public Citizen Header Navigation */}
      <HeaderNavbar
        selectedCityId={selectedCityId}
        onSelectCity={(cityId) => {
          setSelectedCityId(cityId);
          setSelectedEventId(null);
        }}
        onGoToLanding={() => setViewMode('landing')}
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
      />

      {/* Public Citizen Dashboard Layout */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1800px] mx-auto w-full h-[calc(100vh-76px)]">
        {/* Left Side Control Panel (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto pr-1">
          {/* Flood Safe Route Planner */}
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

          {/* Live Hazard Alert Stream */}
          <AlertFeed
            selectedCityId={selectedCityId}
            timeOffsetMins={timeOffsetMins}
            onSelectFeature={(id) => setSelectedFeatureId(id)}
          />
        </div>

        {/* Center/Right OpenLayers GIS Canvas & Forecast Scrubber (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3 h-full relative">
          {/* OpenLayers Spatial GIS Canvas */}
          <div className="flex-1 relative min-h-[450px]">
            <OpenLayersMapCanvas
              selectedCityId={selectedCityId}
              timeOffsetMins={timeOffsetMins}
              personaMode="citizen"
              activeRoute={activeRoute}
              citizenReports={citizenReports.filter(r => r.cityId === selectedCityId || !r.cityId)}
              selectedFeatureId={selectedFeatureId}
              setSelectedFeatureId={setSelectedFeatureId}
              routePinMode={routePinMode}
              setRoutePinMode={setRoutePinMode}
              pinnedOrigin={pinnedOrigin}
              pinnedDestination={pinnedDestination}
              onLocationPicked={handleLocationPicked}
            />
          </div>

          {/* 0–3 Hour Forecast Timeline Scrubber */}
          <TimeSlider
            timeOffsetMins={timeOffsetMins}
            setTimeOffsetMins={setTimeOffsetMins}
          />
        </div>
      </main>

      {/* Modals */}
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
    </div>
  );
}
