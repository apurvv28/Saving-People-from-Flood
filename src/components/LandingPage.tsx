'use client';

import React, { useState } from 'react';
import { CITIES, CityId } from '@/lib/mock-data';
import {
  Shield,
  ArrowRight,
  CloudRain,
  ChevronDown,
  ChevronUp,
  Building2,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Languages,
  Clock,
  Layers,
  Crosshair,
  Navigation,
  Activity,
  Waves,
  Compass,
  FileSpreadsheet,
  Sparkles,
  Smartphone
} from 'lucide-react';
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

  // Interactive FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Live Rain Simulator state
  const [simRainRate, setSimRainRate] = useState<number>(65); // mm/h

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getSimInundationDepth = (rain: number) => {
    if (rain >= 80) return { depth: 55, severity: t.routing.riskHigh, color: 'text-red-600', bg: 'bg-red-50/80 border-red-200' };
    if (rain >= 50) return { depth: 32, severity: t.routing.riskModerate, color: 'text-orange-600', bg: 'bg-orange-50/80 border-orange-200' };
    if (rain >= 25) return { depth: 14, severity: t.routing.riskModerate, color: 'text-amber-600', bg: 'bg-amber-50/80 border-amber-200' };
    return { depth: 3, severity: t.routing.riskSafe, color: 'text-teal-700', bg: 'bg-teal-50/80 border-teal-200' };
  };

  const simResult = getSimInundationDepth(simRainRate);
  const faqs = t.faqs;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Radial Light Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-cyan-500/5 to-transparent pointer-events-none z-0" />

      {/* Header Bar (Shadcn Glassmorphic Top Nav) */}
      <header className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-50 flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md shadow-teal-700/20 ring-2 ring-teal-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900 font-mono">
                {t.nav.brand}
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800 border border-teal-200">
                v2.5 Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{t.nav.subTitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Selector (Shadcn Styled Pill Dropdown) */}
          <div className="relative flex items-center bg-slate-100/90 rounded-xl px-2.5 py-1.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
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

          <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-teal-900 bg-teal-50/90 px-3 py-1.5 rounded-xl border border-teal-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <CloudRain className="w-4 h-4 text-teal-600" />
            <span>MoES / NCMRWF Engine</span>
          </div>

          {/* Authority Portal Access Button */}
          {authorityAuth?.isLoggedIn ? (
            <div className="flex items-center space-x-1.5 bg-teal-50 border border-teal-200 text-teal-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Officer: {authorityAuth.loginId}</span>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>{t.landing.authorityLoginBtn}</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 z-10 space-y-12 pb-12">
        {/* Hero Section */}
        <section className="px-6 pt-14 pb-6 max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-800 border border-teal-500/20 text-xs font-bold shadow-2xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.landing.leadTimeBadge}</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            {t.landing.heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-cyan-600 to-blue-800" : ""}>
                {word}{' '}
              </span>
            ))}
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium">
            {t.landing.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onGoToCitizenApp && (
              <button
                onClick={onGoToCitizenApp}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-extrabold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center space-x-2 active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-white" />
                <span>{t.citizenApp?.appTitle || 'Launch Citizen App'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <a
              href="#select-city"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 active:scale-95"
            >
              <span>{t.landing.selectCityTitle}</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </a>
            <button
              onClick={() => onOpenAuthModal()}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition-all flex items-center space-x-2 active:scale-95"
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>{t.landing.authorityLoginBtn}</span>
            </button>
          </div>
        </section>

        {/* Shadcn UI Metric Impact Bar */}
        <section className="px-6 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t.landing.metricLeadTimeSub, val: t.landing.metricLeadTime, icon: Clock, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              { label: t.landing.metricHydraulicsSub, val: t.landing.metricHydraulics, icon: Layers, color: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: t.landing.metricPrecisionSub, val: t.landing.metricPrecision, icon: Crosshair, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { label: t.landing.metricDetoursSub, val: t.landing.metricDetours, icon: Navigation, color: 'text-purple-600 bg-purple-50 border-purple-200' },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-500/40 transition-all duration-300 flex items-center space-x-3.5 group"
                >
                  <div className={`p-2.5 rounded-xl border ${metric.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight font-mono">
                      {metric.val}
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold">{metric.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Highlights Section (Shadcn Feature Cards) */}
        <section className="px-6 max-w-5xl mx-auto w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: t.landing.feature1Title,
                sub: t.landing.feature1Sub,
                icon: Waves,
                color: 'from-teal-500 to-cyan-600'
              },
              {
                title: t.landing.feature2Title,
                sub: t.landing.feature2Sub,
                icon: Compass,
                color: 'from-blue-500 to-indigo-600'
              },
              {
                title: t.landing.feature3Title,
                sub: t.landing.feature3Sub,
                icon: FileSpreadsheet,
                color: 'from-purple-500 to-pink-600'
              }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-400/50 transition-all duration-300 space-y-2.5"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.sub}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Metro City Selection Cards (Shadcn UI Card Design) */}
        <section id="select-city" className="px-6 max-w-6xl mx-auto w-full space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.landing.selectCityTitle}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{t.landing.selectCitySub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cityList.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/50 border-t-4 border-t-teal-600 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group space-y-5"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shadow-2xs group-hover:bg-teal-50 transition-colors">
                        <Building2 className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {city.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{city.state}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-mono font-bold border border-teal-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.landing.liveRadar}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {city.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.landing.highRiskHotspots}</span>
                    <div className="flex flex-wrap gap-1">
                      {city.highRiskZones.map((zone) => (
                        <span key={zone} className="text-[10.5px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex justify-between items-center font-mono">
                    <span className="text-slate-400">{t.landing.authorityLoginDomain}</span>
                    <span className="font-bold text-teal-800">{city.id}.aqua.gov.in</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onSelectCity(city.id)}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 group-hover:shadow-md active:scale-95"
                  >
                    <span>{t.landing.launchDashboard} ({city.name})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenAuthModal(city.id)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                  >
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t.landing.authorityLoginBtn} ({city.id}.aqua.gov.in)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Hydraulic Rain Simulator (Shadcn Card Component) */}
        <section className="px-6 max-w-5xl mx-auto w-full">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {t.landing.simTitle}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{t.landing.simSub}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                Live Hydrologic Gauge
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Control Slider */}
              <div className="md:col-span-6 space-y-3.5 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700">{t.landing.simRainRate}</span>
                  <span className="font-mono text-teal-700 text-sm px-2.5 py-0.5 rounded-lg bg-teal-50 border border-teal-200">
                    {simRainRate} mm/h
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={simRainRate}
                  onChange={(e) => setSimRainRate(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                />

                {/* Rain Preset Buttons */}
                <div className="flex space-x-2 pt-1">
                  {[
                    { label: t.landing.moderate, val: 15 },
                    { label: t.landing.heavy, val: 45 },
                    { label: t.landing.cloudburst, val: 85 }
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => setSimRainRate(preset.val)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        simRainRate === preset.val
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Output Card */}
              <div className="md:col-span-6">
                <div className={`p-4 rounded-xl border ${simResult.bg} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{t.landing.predictedDepth}</span>
                    <span className={`text-xs uppercase font-extrabold px-2 py-0.5 rounded-full ${simResult.color} bg-white/70 border border-current`}>
                      {simResult.severity}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className={`text-3xl font-mono font-black ${simResult.color}`}>{simResult.depth} cm</span>
                    <span className="text-xs text-slate-600 font-medium">{t.landing.underpassLocation}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-700 pt-2 border-t border-slate-200/80 leading-relaxed">
                    {simRainRate >= 50
                      ? t.landing.capacityExceeded
                      : t.landing.capacityAdequate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Accordion (Shadcn Accordion Style) */}
        <section className="px-6 max-w-4xl mx-auto w-full space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.landing.faqBadge}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.landing.faqMainHeading}
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden transition-all shadow-2xs hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between hover:text-teal-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-teal-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50 font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 bg-white/80 backdrop-blur-md space-y-1 z-10">
        <p className="font-bold text-slate-800">{t.landing.footerTitle}</p>
        <p>{t.landing.footerSub}</p>
      </footer>
    </div>
  );
};
