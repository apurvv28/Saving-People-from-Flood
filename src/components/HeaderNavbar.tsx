'use client';

import React, { useState } from 'react';
import {
  CloudRain,
  MapPin,
  ArrowLeft,
  Menu,
  Layers,
  Compass,
  FileCheck,
  Zap,
  Activity
} from 'lucide-react';
import { CITIES, CityId } from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';
import { ThemeToggle } from '@/components/ThemeToggle';

export type AppTab =
  | 'nowcast_gis'
  | 'hydro_routing'
  | 'citizen_signals'
  | 'admin_moderation'
  | 'water_bodies';

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
  onOpenSitRepModal?: () => void;
  activeTab?: AppTab;
  onSelectTab?: (tab: AppTab) => void;
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
  onOpenReportModal,
  onOpenSitRepModal,
  activeTab = 'nowcast_gis',
  onSelectTab
}) => {
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sticky top-0 z-50 transition-colors">
        <div className="max-w-[1900px] mx-auto flex items-center justify-between gap-3 flex-wrap">
          
          <div className="flex items-center space-x-2 shrink-0">
            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 transition-colors m-1"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Back to Landing */}
            <button
              onClick={onGoToLanding}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 transition-colors hidden sm:flex items-center justify-center m-1"
              title="Return to Landing"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Brand */}
            <div className="flex items-center space-x-2 ml-1">
              <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-gray-100 font-mono">
                VRISHTI
              </h1>
            </div>

            {/* City Selection Dropdown */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl text-base ml-4 m-1">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
              <select
                value={selectedCityId}
                onChange={(e) => onSelectCity(e.target.value as CityId)}
                className="bg-transparent font-bold text-gray-800 dark:text-gray-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi NCR</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>
          </div>

          {/* Horizontal Navigation Bar (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl m-1">
            {[
              { id: 'nowcast_gis', label: 'GIS Map', icon: Compass },
              { id: 'hydro_routing', label: 'Routing', icon: Zap },
              { id: 'citizen_signals', label: 'Signals', icon: Activity },
              { id: 'admin_moderation', label: 'Queue', icon: FileCheck },
              { id: 'water_bodies', label: 'Atlas', icon: Layers }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab && onSelectTab(tab.id as AppTab)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status & Actions */}
          <div className="flex items-center space-x-2 flex-wrap justify-end">
            {/* Live Rain Indication */}
            <div className="hidden md:flex items-center px-3 py-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 rounded-xl space-x-2 font-mono font-bold text-base m-1">
              <CloudRain className="w-4 h-4" />
              <span>{rainfallRateMmHr.toFixed(1)} mm/hr</span>
            </div>

            {/* Action Buttons */}
            {onGoToCitizenApp && (
              <button
                onClick={onGoToCitizenApp}
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl text-base font-bold transition-all m-1"
              >
                <span>Citizen UI</span>
              </button>
            )}

            <button
              onClick={onOpenReportModal}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-bold transition-all shadow-md shadow-blue-500/20 m-1"
            >
              <span>Report Hazard</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl z-40">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-500 dark:text-gray-400 px-2">City Focus</h3>
              <select
                value={selectedCityId}
                onChange={(e) => { onSelectCity(e.target.value as CityId); setIsMenuOpen(false); }}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl text-base font-bold text-gray-800 dark:text-gray-200"
              >
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi NCR</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-gray-500 dark:text-gray-400 px-2">Modules</h3>
              {[
                { id: 'nowcast_gis', label: 'GIS Flood Map', icon: Compass },
                { id: 'hydro_routing', label: 'Hydro Routing', icon: Zap },
                { id: 'citizen_signals', label: 'Citizen Signals', icon: Activity },
                { id: 'admin_moderation', label: 'Moderation Queue', icon: FileCheck },
                { id: 'water_bodies', label: 'Water Bodies Atlas', icon: Layers }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { onSelectTab && onSelectTab(tab.id as AppTab); setIsMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <button
                onClick={() => { onOpenReportModal(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-base font-bold"
              >
                <span>Report Hazard</span>
              </button>

              {onGoToCitizenApp && (
                <button
                  onClick={() => { onGoToCitizenApp(); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl text-base font-bold"
                >
                  Open Citizen App View
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
