import React, { useState } from 'react';
import { Shield, CloudRain, AlertTriangle, Building2, Languages, MapPin, ArrowLeft, RefreshCw, Activity, Droplets, Waves, Smartphone, Menu, X, PhoneCall, Home } from 'lucide-react';
import { CITIES, CityId } from '@/lib/mock-data';
import { HISTORICAL_CLOUDBURST_EVENTS } from '@/lib/openmeteo-service';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';

interface HeaderNavbarProps {
  selectedCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
  onGoToLanding: () => void;
  onGoToCitizenApp?: () => void;
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
  onGoToCitizenApp,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentCity = CITIES[selectedCityId];

  return (
    <>
      <header className="w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2.5 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Brand & Hamburger Menu Trigger */}
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu Icon Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center p-2 rounded-xl bg-[#f8f9fa] hover:bg-slate-200 text-slate-800 transition-all border border-[#dadce0] active:scale-95 shadow-2xs"
            title="Citizen Portal Menu"
          >
            <Menu className="w-4 h-4 text-slate-700" />
          </button>

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
            <option value="live">{t.nav.liveWeather}</option>
            {HISTORICAL_CLOUDBURST_EVENTS.filter(e => e.cityId === selectedCityId).map(evt => (
              <option key={evt.id} value={evt.id}>{evt.title}</option>
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
            <Waves className="w-3.5 h-3.5 text-sky-600" />
            <span>{t.nav.yamunaStage}</span>
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
                {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Citizen App Quick Switcher */}
        {onGoToCitizenApp && (
          <button
            onClick={onGoToCitizenApp}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1a73e8]/10 hover:bg-[#1a73e8]/20 text-[#1a73e8] border border-[#1a73e8]/30 font-bold text-xs shadow-2xs transition-all active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>{t.citizenApp?.appTitle || 'Citizen App'}</span>
          </button>
        )}

        {/* Ground Truth Report Button (Google Maps Primary Blue Button) */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-sm transition-all active:scale-95"
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
      {/* Hamburger Menu Drawer Overlay & Slide-out Sheet */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Side Drawer Sheet */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 border-r border-slate-200">
            {/* Drawer Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-teal-600 text-white shadow-md">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight font-mono text-white">AquaAlert</h3>
                  <p className="text-[10px] text-teal-400 font-bold">Flood Safe Sentinel System</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Items */}
            <div className="p-4 space-y-5 text-xs flex-1">
              {/* City Selection */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Select Active City Region
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {(['mumbai', 'delhi', 'chennai'] as CityId[]).map((cId) => {
                    const isSelected = selectedCityId === cId;
                    const cData = CITIES[cId];
                    return (
                      <button
                        key={cId}
                        onClick={() => {
                          onSelectCity(cId);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-300 text-teal-900 font-extrabold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                          <div>
                            <div className="text-xs">{cData.name}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{cData.state}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Portal Navigation
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onGoToLanding();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold transition-all"
                  >
                    <Home className="w-4 h-4 text-teal-600" />
                    <span>{t.nav.backToLanding}</span>
                  </button>

                  {onGoToCitizenApp && (
                    <button
                      onClick={() => {
                        onGoToCitizenApp();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#1a73e8]/10 hover:bg-[#1a73e8]/20 border border-[#1a73e8]/30 text-[#1a73e8] font-bold transition-all"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{t.citizenApp?.appTitle || 'Citizen Portal Application'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenReportModal();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold transition-all shadow-xs"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.nav.reportWater}</span>
                  </button>

                  {authorityAuth?.isLoggedIn ? (
                    <button
                      onClick={() => {
                        if (onGoToAuthorityDashboard) onGoToAuthorityDashboard();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all"
                    >
                      <Building2 className="w-4 h-4 text-teal-400" />
                      <span>{t.nav.authorityPortal}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold transition-all"
                    >
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>{t.nav.authorityCenter}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Language / भाषा
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        if (setLang) setLang(l.code);
                      }}
                      className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                        lang === l.code
                          ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {l.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indian Emergency Helplines Box */}
              <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 space-y-2 text-red-950">
                <div className="flex items-center space-x-2 font-bold text-xs text-red-800">
                  <PhoneCall className="w-4 h-4 text-red-600 shrink-0" />
                  <span>India Toll-Free Helplines</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                  <a href="tel:1078" className="p-1.5 rounded-lg bg-white border border-red-200 flex flex-col hover:bg-red-100">
                    <span className="text-[9.5px] text-slate-500 font-sans">NDRF Disaster</span>
                    <span className="font-extrabold text-red-700">1078</span>
                  </a>
                  <a href="tel:1077" className="p-1.5 rounded-lg bg-white border border-red-200 flex flex-col hover:bg-red-100">
                    <span className="text-[9.5px] text-slate-500 font-sans">State Control</span>
                    <span className="font-extrabold text-red-700">1077</span>
                  </a>
                  <a href="tel:112" className="p-1.5 rounded-lg bg-white border border-red-200 flex flex-col hover:bg-red-100">
                    <span className="text-[9.5px] text-slate-500 font-sans">National Emergency</span>
                    <span className="font-extrabold text-red-700">112</span>
                  </a>
                  <a href="tel:108" className="p-1.5 rounded-lg bg-white border border-red-200 flex flex-col hover:bg-red-100">
                    <span className="text-[9.5px] text-slate-500 font-sans">Ambulance Triage</span>
                    <span className="font-extrabold text-red-700">108</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[10.5px] text-slate-500 font-medium">
              AquaAlert Urban Flood Resilience Platform
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

