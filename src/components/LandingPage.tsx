'use client';

import React from 'react';
import { CITIES, CityId } from '@/lib/mock-data';
import { Building2, Languages, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/lib/i18n/translations';

interface LandingPageProps {
  onSelectCity: (cityId: CityId) => void;
  onGoToCitizenApp?: () => void;
  onOpenAuthModal: (defaultCity?: CityId) => void;
  authorityAuth: { isLoggedIn: boolean; loginId: string; cityId: CityId } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectCity,
  onGoToCitizenApp,
  onOpenAuthModal,
  authorityAuth
}) => {
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const cityList = Object.values(CITIES);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-black tracking-tight text-gray-950 dark:text-gray-100">
            VRISHTI
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {/* Language Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl">
            <Languages className="w-4 h-4 text-blue-600 mr-2" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent text-sm font-bold text-gray-900 dark:text-gray-100 focus:outline-none cursor-pointer"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="bg-white dark:bg-gray-900">
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Authority Auth Status / Login */}
          {authorityAuth?.isLoggedIn ? (
            <button
              onClick={() => onSelectCity(authorityAuth.cityId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl flex items-center space-x-2 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Enter Command ({authorityAuth.cityId})</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal()}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white text-sm font-bold rounded-xl flex items-center space-x-2 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Authority Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-5 max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4 max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-gray-950 dark:text-gray-100">
            Real-time flood intelligence for Indian metros
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
            Select your city to open the operations hub. Monitor street-level inundation, route citizens to safety, and manage municipal drainage.
          </p>
        </div>

        {/* City Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {cityList.map(city => (
            <div 
              key={city.id}
              onClick={() => onSelectCity(city.id)}
              className="group card bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-blue cursor-pointer transition-all p-6 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800/50">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {city.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {city.description}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                <span>Enter Operations Hub</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        VRISHTI — Municipal Flood Intelligence & Management Platform
      </footer>
    </div>
  );
};
