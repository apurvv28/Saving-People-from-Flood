'use client';

import React from 'react';
import { Shield, CloudRain, AlertTriangle, Building2, Languages, MapPin, ArrowLeft, RefreshCw, Activity, Droplets } from 'lucide-react';
import { CITIES, CityId } from '@/lib/mock-data';
import { HISTORICAL_CLOUDBURST_EVENTS } from '@/lib/openmeteo-service';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';

interface HeaderNavbarProps {
  selectedCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
  onGoToLanding: () => void;
  authorityAuth: { isLoggedIn: boolean; loginId: string; cityId: CityId } | null;
  onOpenAuthModal: () => void;
  onLogoutAuthority: () => void;
  onGoToAuthorityDashboard?: () => void;
  selectedEventId: string | null;
  onSelectEventId: (eventId: string | null) => void;
  lang?: string;
  setLang?: (lang: string) => void;
  maxWaterDepthCm: number;
  floodedRoadsCount: number;
  surchargingNodesCount: number;
  rainfallRateMmHr: number;
  openMeteoSource?: string;
  onOpenReportModal: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  selectedCityId,
  onSelectCity,
  onGoToLanding,
  authorityAuth,
  onOpenAuthModal,
  onLogoutAuthority,
  onGoToAuthorityDashboard,
  selectedEventId,
  onSelectEventId,
  maxWaterDepthCm,
  floodedRoadsCount,
  surchargingNodesCount,
  rainfallRateMmHr,
  openMeteoSource,
  onOpenReportModal
}) => {
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const currentCity = CITIES[selectedCityId];

  return (
    <header className="w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2.5 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Brand & City Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onGoToLanding}
          className="flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200/80 active:scale-95"
          title={t.nav.backToLanding}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md shadow-teal-700/20 ring-1 ring-teal-600/30">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-black tracking-tight text-slate-900 font-mono">
              {t.nav.brand}
            </h1>

            {/* City Dropdown Switcher (Shadcn Pill Design) */}
            <div className="relative flex items-center bg-teal-50/90 border border-teal-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1 shrink-0" />
              <select
                value={selectedCityId}
                onChange={(e) => onSelectCity(e.target.value as CityId)}
                className="bg-transparent text-xs font-bold text-teal-900 focus:outline-none cursor-pointer pr-1"
              >
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi NCR</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>
          </div>
          <p className="text-[10.5px] text-slate-500 font-medium">{t.nav.subTitle}</p>
        </div>
      </div>

      {/* Real-time Status Badges (Shadcn Pill Badges) */}
      <div className="hidden lg:flex items-center space-x-2.5 text-xs font-medium">
        {/* Open-Meteo Live API Stream Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-teal-50/90 border border-teal-200/80 shadow-2xs">
          <CloudRain className="w-4 h-4 text-teal-600 shrink-0" />
          <div>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-teal-900">
              <span>{t.nav.openMeteoApi}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="font-bold font-mono text-teal-800">{rainfallRateMmHr} mm/h</span>
          </div>
        </div>

        {/* Rain Source Event Switcher */}
        <div className="relative flex items-center bg-slate-100/90 rounded-xl px-2.5 py-1.5 border border-slate-200 text-xs shadow-2xs">
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
          <select
            value={selectedEventId || 'live'}
            onChange={(e) => onSelectEventId(e.target.value === 'live' ? null : e.target.value)}
            className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none pr-1 cursor-pointer"
          >
            <option value="live">⚡ {t.nav.liveWeather}</option>
            {HISTORICAL_CLOUDBURST_EVENTS.filter(e => e.cityId === selectedCityId).map(evt => (
              <option key={evt.id} value={evt.id}>🌧️ {evt.title}</option>
            ))}
          </select>
        </div>

        {selectedCityId === 'mumbai' && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200/80 text-xs font-bold text-blue-900 shadow-2xs" title="WRD Pravah daily storage bulletin across 7 BMC supply lakes">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.nav.lakes7}</span>
          </div>
        )}

        {selectedCityId === 'delhi' && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-50/90 border border-sky-200/80 text-xs font-bold text-sky-900 shadow-2xs" title="Yamuna River Stage Level at Old Railway Bridge Gauge">
            <span>🏞️ {t.nav.yamunaStage}</span>
          </div>
        )}

        {selectedCityId === 'chennai' && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/90 border border-indigo-200/80 text-xs font-bold text-indigo-900 shadow-2xs" title="CMWSSB Chembarambakkam, Poondi & Puzhal Reservoir Storage">
            <Droplets className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.nav.reservoirs5}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="text-slate-500 text-[10.5px] font-semibold">{t.nav.maxDepth}: </span>
            <span className={`font-bold font-mono ${maxWaterDepthCm > 30 ? 'text-red-600' : 'text-amber-700'}`}>
              {maxWaterDepthCm} cm
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls & Authority Access */}
      <div className="flex items-center space-x-2">
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
                {l.flag} {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Ground Truth Report Button (Shadcn Primary Teal Button) */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{t.nav.reportWater}</span>
        </button>

        {/* Authority Command Center Access Button */}
        {authorityAuth?.isLoggedIn ? (
          <button
            onClick={onGoToAuthorityDashboard}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.nav.authorityPortal} ({authorityAuth.loginId.split('.')[0]})</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.nav.authorityCenter}</span>
          </button>
        )}
      </div>
    </header>
  );
};
