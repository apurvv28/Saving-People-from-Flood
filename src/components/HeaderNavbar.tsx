'use client';

import React from 'react';
import { Shield, CloudRain, AlertTriangle, Building2, Languages, MapPin, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { CITIES, CityId } from '@/lib/mock-data';
import { HISTORICAL_CLOUDBURST_EVENTS } from '@/lib/openmeteo-service';

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
  lang: string;
  setLang: (lang: string) => void;
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
  lang,
  setLang,
  maxWaterDepthCm,
  floodedRoadsCount,
  surchargingNodesCount,
  rainfallRateMmHr,
  openMeteoSource,
  onOpenReportModal
}) => {
  const currentCity = CITIES[selectedCityId];

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Brand & City Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onGoToLanding}
          className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-tight text-teal-800">
              AquaAlert
            </h1>

            {/* City Dropdown Switcher */}
            <div className="relative flex items-center bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-teal-600 mr-1" />
              <select
                value={selectedCityId}
                onChange={(e) => onSelectCity(e.target.value as CityId)}
                className="bg-transparent text-xs font-bold text-teal-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="mumbai">Mumbai Public</option>
                <option value="delhi">Delhi NCR Public</option>
                <option value="chennai">Chennai Public</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Public Citizen Urban Flood Nowcasting Portal</p>
        </div>
      </div>

      {/* Real-time Status Badges */}
      <div className="hidden lg:flex items-center space-x-3 text-xs font-medium">
        {/* Open-Meteo Live API Stream Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200">
          <CloudRain className="w-4 h-4 text-teal-600" />
          <div>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-teal-800">
              <span>Open-Meteo API</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
            </div>
            <span className="font-bold text-teal-700">{rainfallRateMmHr} mm/h</span>
          </div>
        </div>

        {/* Rain Source Event Switcher */}
        <div className="relative flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
          <select
            value={selectedEventId || 'live'}
            onChange={(e) => onSelectEventId(e.target.value === 'live' ? null : e.target.value)}
            className="bg-transparent text-xs text-slate-700 font-bold focus:outline-none pr-1 cursor-pointer"
          >
            <option value="live">⚡ Open-Meteo Live Weather</option>
            {HISTORICAL_CLOUDBURST_EVENTS.filter(e => e.cityId === selectedCityId).map(evt => (
              <option key={evt.id} value={evt.id}>🌧️ {evt.title}</option>
            ))}
          </select>
        </div>

        {selectedCityId === 'mumbai' && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800" title="WRD Pravah daily storage bulletin across 7 BMC supply lakes">
            <span>💧 7 Lakes: 87%</span>
            <span className="text-blue-600 font-normal">(231d runway)</span>
          </div>
        )}

        {selectedCityId === 'delhi' && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-xs font-bold text-sky-900" title="Yamuna River Stage Level at Old Railway Bridge Gauge">
            <span>🏞️ Yamuna Stage: 204.8m</span>
            <span className="text-sky-600 font-normal">(Warn: 204.5m)</span>
          </div>
        )}

        {selectedCityId === 'chennai' && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900" title="CMWSSB Chembarambakkam, Poondi & Puzhal Reservoir Storage">
            <span>💧 5 Reservoirs: 82%</span>
            <span className="text-indigo-600 font-normal">(180d runway)</span>
          </div>
        )}

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <div>
            <span className="text-slate-500">Max Depth: </span>
            <span className={`font-bold ${maxWaterDepthCm > 30 ? 'text-red-600' : 'text-amber-700'}`}>
              {maxWaterDepthCm} cm
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls & Authority Access */}
      <div className="flex items-center space-x-2">
        {/* Language Selector */}
        <div className="relative flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
          <Languages className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs text-slate-700 focus:outline-none pr-1 cursor-pointer font-medium"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        {/* Ground Truth Report Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Report Water</span>
        </button>

        {/* Authority Command Center Access Button */}
        {authorityAuth?.isLoggedIn ? (
          <button
            onClick={onGoToAuthorityDashboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-800 text-white font-bold text-xs shadow-xs transition-all hover:bg-teal-900"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-300" />
            <span>Authority Portal ({authorityAuth.loginId.split('.')[0]})</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Authority Command Center</span>
          </button>
        )}
      </div>
    </header>
  );
};
