'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RoutingWidget } from '@/components/RoutingWidget';
import { AlertFeed } from '@/components/AlertFeed';
import { TimeSlider } from '@/components/TimeSlider';
import { CityId, CITIES, CitizenReport, NavigationRoute } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import {
  Shield,
  MapPin,
  Navigation,
  AlertOctagon,
  Camera,
  Languages,
  ArrowLeft,
  Crosshair,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
  Send,
  Layers,
  Sparkles,
  PhoneCall,
  Phone,
  Clock,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { INDIAN_EMERGENCY_SERVICES } from '@/lib/emergency-data';
import { ThemeToggle } from '@/components/ThemeToggle';

// Dynamically import OpenLayersMapCanvas with SSR disabled
const OpenLayersMapCanvas = dynamic(
  () => import('@/components/OpenLayersMapCanvas').then((mod) => mod.OpenLayersMapCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-white flex flex-col items-center justify-center space-y-3 rounded-2xl border border-slate-200">
        <div className="w-9 h-9 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-teal-800 font-mono font-bold">
          Loading Public Citizen Map Canvas...
        </p>
      </div>
    )
  }
);

interface CitizenAppViewProps {
  selectedCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
  onGoToLanding: () => void;
  onOpenAuthModal: () => void;
  citizenReports: CitizenReport[];
  onAddReport: (report: CitizenReport) => void;
}

export const CitizenAppView: React.FC<CitizenAppViewProps> = ({
  selectedCityId,
  onSelectCity,
  onGoToLanding,
  onOpenAuthModal,
  citizenReports,
  onAddReport
}) => {
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const [activeTab, setActiveTab] = useState<'alerts' | 'routing' | 'report' | 'emergency'>('routing');
  const [timeOffsetMins, setTimeOffsetMins] = useState(0);
  const [activeRoute, setActiveRoute] = useState<NavigationRoute | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  // Live GPS Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);

  // Map Pin Picker State
  const [routePinMode, setRoutePinMode] = useState<'none' | 'origin' | 'destination'>('none');
  const [pinnedOrigin, setPinnedOrigin] = useState<[number, number] | null>(null);
  const [pinnedDestination, setPinnedDestination] = useState<[number, number] | null>(null);

  // Citizen Quick Report Form State inside App View
  const [reportDepthCm, setReportDepthCm] = useState(20);
  const [reportLocation, setReportLocation] = useState('');
  const [reportNote, setReportNote] = useState('');
  const [reportPhoto, setReportPhoto] = useState<string | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessToast, setReportSuccessToast] = useState(false);

  const city = CITIES[selectedCityId];
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);

  // Trigger Browser GPS Location
  const handleAcquireGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatusText(t.citizenApp.gpsDenied);
      return;
    }

    setIsLocating(true);
    setGpsStatusText('Acquiring GPS Signal...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const label = `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, label });
        setPinnedOrigin(coords);
        setReportLocation(label);
        setIsLocating(false);
        setGpsStatusText(t.citizenApp.gpsAcquired);
        setTimeout(() => setGpsStatusText(null), 4000);
      },
      (err) => {
        setIsLocating(false);
        setGpsStatusText(t.citizenApp.gpsDenied);
        setTimeout(() => setGpsStatusText(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleLocationPicked = (mode: 'origin' | 'destination', coords: [number, number]) => {
    if (mode === 'origin') {
      setPinnedOrigin(coords);
    } else {
      setPinnedDestination(coords);
    }
  };

  const handleSubmitGroundReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);

    setTimeout(() => {
      const coords = pinnedOrigin || [city.center[0], city.center[1]];
      const newReport: CitizenReport = {
        id: `report-citizen-${Date.now()}`,
        cityId: selectedCityId,
        timestamp: 'Just now',
        lat: coords[0],
        lng: coords[1],
        locationName: reportLocation || `${city.name} Central`,
        coordinates: coords,
        waterDepthCm: reportDepthCm,
        userNote: reportNote || 'Reported via Citizen App',
        verified: true,
        upvotes: 1,
        timestampMinsAgo: 0,
        status: 'pending',
        photoUrl: reportPhoto || undefined
      };

      onAddReport(newReport);
      setIsSubmittingReport(false);
      setReportSuccessToast(true);
      setReportNote('');
      setTimeout(() => setReportSuccessToast(false), 4000);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      {/* Citizen App Header Navbar */}
      <header className="w-full bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToLanding}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200/80 active:scale-95"
            title={t.nav.backToLanding}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md shadow-teal-700/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black tracking-tight text-slate-900 font-mono">
                  {t.citizenApp.appTitle}
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  {city.name}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-medium truncate max-w-[280px]">
                {t.citizenApp.appSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Header Controls: Live GPS, Language, City Selector */}
        <div className="flex items-center space-x-2 flex-wrap">
          <ThemeToggle />
          {/* Live GPS Locate Me Button */}
          <button
            onClick={handleAcquireGpsLocation}
            disabled={isLocating}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1a73e8]/10 hover:bg-[#1a73e8]/20 text-[#1a73e8] border border-[#1a73e8]/30 font-bold text-xs shadow-2xs transition-all active:scale-95"
          >
            <Crosshair className={`w-3.5 h-3.5 text-[#1a73e8] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : t.citizenApp.useLiveGps}</span>
          </button>

          {/* City Selection Dropdown */}
          <div className="flex items-center bg-slate-100/90 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0" />
            <select
              value={selectedCityId}
              onChange={(e) => onSelectCity(e.target.value as CityId)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi NCR</option>
              <option value="chennai">Chennai</option>
            </select>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100/90 rounded-xl px-2.5 py-1.5 border border-slate-200 shadow-2xs">
            <Languages className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs text-slate-800 focus:outline-none pr-1 cursor-pointer font-bold"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* GPS Status Toast Banner */}
      {gpsStatusText && (
        <div className="bg-teal-600 text-white text-xs font-bold py-1.5 px-4 text-center shadow-xs flex items-center justify-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 animate-bounce" />
          <span>{gpsStatusText}</span>
        </div>
      )}

      {/* Citizen App 4-Tab Pill Selector (Google Maps Floating Navigation) */}
      <div className="px-4 pt-3 max-w-5xl mx-auto w-full">
        <div className="bg-white p-1.5 rounded-2xl flex space-x-1 border border-[#dadce0] shadow-md">
          <button
            onClick={() => setActiveTab('routing')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'routing'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.citizenApp.tabRoute}</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'alerts'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{t.citizenApp.tabAlerts}</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'report'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.citizenApp.tabReport}</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`flex-1 py-2 px-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'emergency'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.citizenApp.tabEmergency || 'Emergency'}</span>
          </button>
        </div>
      </div>

      {/* Main Citizen Application Workspace */}
      <main className="flex-1 p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1700px] mx-auto w-full">
        {/* Left Side Active Tab View (5 Cols Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          {/* TAB 1: VEHICLE-AWARE SAFE ROUTE PLANNER */}
          {activeTab === 'routing' && (
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
          )}

          {/* TAB 2: LIVE FLOOD HAZARD ALERTS FEED */}
          {activeTab === 'alerts' && (
            <AlertFeed
              selectedCityId={selectedCityId}
              timeOffsetMins={timeOffsetMins}
              onSelectFeature={(id) => setSelectedFeatureId(id)}
            />
          )}

          {/* TAB 3: CITIZEN GROUND WATERLOGGING REPORT FORM */}
          {activeTab === 'report' && (
            <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{t.reportModal.title}</h3>
                  <p className="text-slate-500 text-[11px] font-medium">{t.reportModal.subTitle}</p>
                </div>
              </div>

              {reportSuccessToast && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.reportModal.successToast}</span>
                </div>
              )}

              <form onSubmit={handleSubmitGroundReport} className="space-y-3.5">
                {/* Location Input & Live GPS Trigger */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700 font-bold">
                    <span>{t.reportModal.locationLabel}</span>
                    <button
                      type="button"
                      onClick={handleAcquireGpsLocation}
                      className="text-[10.5px] text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      <Crosshair className="w-3 h-3" />
                      <span>{t.citizenApp.useLiveGps}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    placeholder="e.g. Hindmata Junction, Dadar / SV Road Subway"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Water Depth Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-700">{t.reportModal.depthLabel}</span>
                    <span className="font-mono text-teal-800 text-sm font-black bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                      {reportDepthCm} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={120}
                    step={5}
                    value={reportDepthCm}
                    onChange={(e) => setReportDepthCm(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Additional Details */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">{t.reportModal.obsLabel}</span>
                  <textarea
                    rows={2}
                    value={reportNote}
                    onChange={(e) => setReportNote(e.target.value)}
                    placeholder={t.reportModal.obsPlaceholder}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="w-full py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-extrabold text-xs shadow-md shadow-[#1a73e8]/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingReport ? t.reportModal.submitting : t.reportModal.submitBtn}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: INDIAN EMERGENCY TOLL-FREE HELPLINES */}
          {activeTab === 'emergency' && (
            <div className="bg-white p-5 rounded-2xl border border-[#dadce0] shadow-md space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{t.emergencyServices.title}</h3>
                    <p className="text-slate-500 text-[11px] font-medium">{t.emergencyServices.subTitle}</p>
                  </div>
                </div>
                <span className="text-[10.5px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {t.emergencyServices.tollFree}
                </span>
              </div>

              <div className="space-y-3">
                {INDIAN_EMERGENCY_SERVICES.map((srv) => {
                  const title = (t.emergencyServices as any)[srv.titleKey] || srv.badgeText;
                  const desc = (t.emergencyServices as any)[srv.descKey] || '';

                  return (
                    <div
                      key={srv.id}
                      className="p-3.5 rounded-2xl border border-[#dadce0] bg-[#f8f9fa] hover:border-[#1a73e8] hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase border ${srv.badgeColor}`}>
                            {srv.badgeText}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            24x7 Active
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs group-hover:text-[#1a73e8] transition-colors">
                          {title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                          {desc}
                        </p>
                      </div>

                      <a
                        href={srv.telUri}
                        className="px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-extrabold text-xs shadow-md shadow-[#1a73e8]/20 transition-all flex items-center justify-center space-x-1.5 shrink-0 active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{t.emergencyServices.callNow} {srv.number}</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side Map Canvas & Timeline Scrubber (7 Cols Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-3 h-full relative">
          {/* Spatial GIS Canvas */}
          <div className="flex-1 relative min-h-[440px] md:min-h-[520px]">
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
    </div>
  );
};
