'use client';

import React, { useState } from 'react';
import { CITIES, CityId } from '@/lib/mock-data';
import {
  Shield,
  ArrowRight,
  CloudRain,
  Navigation,
  Network,
  ChevronDown,
  ChevronUp,
  Building2,
  HelpCircle,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onSelectCity: (cityId: CityId) => void;
  onOpenAuthModal: (defaultCity?: CityId) => void;
  authorityAuth: { isLoggedIn: boolean; loginId: string; cityId: CityId } | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectCity,
  onOpenAuthModal,
  authorityAuth
}) => {
  const cityList = Object.values(CITIES);

  // Interactive FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Live Rain Simulator state on Landing Page
  const [simRainRate, setSimRainRate] = useState<number>(65); // mm/h

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const getSimInundationDepth = (rain: number) => {
    if (rain >= 80) return { depth: 55, severity: 'Severe', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (rain >= 50) return { depth: 32, severity: 'Critical', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
    if (rain >= 25) return { depth: 14, severity: 'Warning', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    return { depth: 3, severity: 'Safe', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' };
  };

  const simResult = getSimInundationDepth(simRainRate);

  const faqs = [
    {
      q: 'What credentials do municipal authorities use to log in?',
      a: 'Official municipal control room officers log in using their city authority domain: cityname.aqua.gov.in (e.g., mumbai.aqua.gov.in, delhi.aqua.gov.in, chennai.aqua.gov.in) with passcode: 12345678. Authority access unlocks 1D subterranean drainage telemetry, outfall dewatering pump controls, and executive SitRep PDF generators.'
    },
    {
      q: 'How does AquaAlert predict street flooding 0–3 hours in advance?',
      a: 'Traditional weather models only forecast volume of rain. AquaAlert couples live Doppler Radar rainfall nowcasts with a 2D Digital Elevation Model (DEM) and a 1D directed graph representation of subterranean stormwater drains to pinpoint street inundation depths in centimeters.'
    },
    {
      q: 'Which Indian metropolitan cities are currently active?',
      a: 'AquaAlert currently features high-resolution spatial models for Mumbai (Hindmata, Dadar, Kurla, Andheri), Delhi NCR (Minto Bridge, ITO Junction, Pul Prahladpur), and Chennai (Velachery, T. Nagar, Saidapet).'
    },
    {
      q: 'How does the Flood-Safe Emergency Navigation API work?',
      a: 'Standard navigation apps use static road speed limits. AquaAlert dynamically increases travel-time weights when predicted water depth exceeds vehicle clearance thresholds (e.g., >15cm for sedans, >25cm for ambulances), routing vehicles safely around flooded underpasses.'
    },
    {
      q: 'How can citizens contribute ground-truth report corrections?',
      a: 'Citizens and ground volunteers can tap "Report Water" to submit local water depth observations, location tags, and ground photos.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-teal-800">
              AquaAlert
            </h1>
            <p className="text-xs text-slate-500 font-medium">Urban Flood Hydro-Dynamic Prediction System (SIH26085)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3.5 py-1.5 rounded-lg border border-teal-200">
            <CloudRain className="w-4 h-4 text-teal-600" />
            <span>MoES / NCMRWF Coupled Engine</span>
          </div>

          {/* Authority Portal Access Button */}
          {authorityAuth?.isLoggedIn ? (
            <div className="flex items-center space-x-1.5 bg-teal-50 border border-teal-200 text-teal-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Officer: {authorityAuth.loginId}</span>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Authority Login / Sign Up</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 max-w-6xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
          <span>0–3 Hour Forward-Looking Lead Time</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Coupled Surface & Subterranean Urban Flood Intelligence
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Predict street-level water depths, manhole surcharge backflows, and generate flood-safe emergency transit routes in real-time.
        </p>
      </section>

      {/* Interactive Metric Impact Banner */}
      <section className="px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-2xl font-extrabold text-teal-700">0–3 h</p>
            <p className="text-xs text-slate-500 font-medium">Forecast Lead Time</p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-2xl font-extrabold text-teal-700">1D + 2D</p>
            <p className="text-xs text-slate-500 font-medium">Coupled Hydraulics</p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-2xl font-extrabold text-teal-700">Street-Level</p>
            <p className="text-xs text-slate-500 font-medium">Depth Precision (cm)</p>
          </div>
          <div className="p-3">
            <p className="text-2xl font-extrabold text-teal-700">100%</p>
            <p className="text-xs text-slate-500 font-medium">Dynamic Safe Detours</p>
          </div>
        </div>
      </section>

      {/* Interactive City Selector Cards */}
      <section className="px-6 py-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-slate-900">
            Select Metro City Command Center
          </h3>
          <p className="text-xs text-slate-500">Choose a city below to open its live interactive GIS flood dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cityList.map((city) => (
            <div
              key={city.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏙️</span>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {city.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{city.state}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-mono font-bold border border-teal-200">
                    Live Radar
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {city.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-bold text-slate-500">High-Risk Micro-Hotspots:</span>
                  <div className="flex flex-wrap gap-1">
                    {city.highRiskZones.map((zone) => (
                      <span key={zone} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex justify-between items-center font-mono">
                  <span>Authority Login:</span>
                  <span className="font-bold text-teal-800">{city.id}.aqua.gov.in</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onSelectCity(city.id)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 group-hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <span>Launch {city.name} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenAuthModal(city.id)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Authority Login ({city.id}.aqua.gov.in)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Live Rainfall Hydraulic Simulator Preview */}
      <section className="px-6 py-8 max-w-5xl mx-auto w-full space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Interactive Hydraulic Runoff Simulator Preview
                </h3>
                <p className="text-xs text-slate-500">Adjust rainfall intensity to test predicted street inundation and drainage response</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Live Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Control Slider */}
            <div className="md:col-span-6 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">Simulated Rain Rate:</span>
                <span className="font-mono font-bold text-teal-700 text-sm">{simRainRate} mm/h</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={simRainRate}
                onChange={(e) => setSimRainRate(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-200 rounded-lg cursor-pointer"
              />

              {/* Rain Preset Buttons */}
              <div className="flex space-x-2 pt-1">
                {[
                  { label: 'Moderate (15 mm/h)', val: 15 },
                  { label: 'Heavy (45 mm/h)', val: 45 },
                  { label: 'Cloudburst (85 mm/h)', val: 85 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    onClick={() => setSimRainRate(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      simRainRate === preset.val
                        ? 'bg-teal-600 text-white border-teal-600 font-bold'
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
                  <span className="text-xs font-bold text-slate-700">Predicted Street Water Depth:</span>
                  <span className={`text-xs uppercase font-extrabold ${simResult.color}`}>{simResult.severity}</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-3xl font-mono font-extrabold ${simResult.color}`}>{simResult.depth} cm</span>
                  <span className="text-xs text-slate-500 font-medium">at low elevation underpass</span>
                </div>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                  {simRainRate >= 50
                    ? '⚠️ Drainage pipe capacity exceeded (>100%). Manhole backflow surcharging onto surface.'
                    : '✅ Drainage network capacity adequate. Water flowing via gravity.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="px-6 py-10 max-w-4xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Everything You Need to Know About AquaAlert
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
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
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-slate-50 space-y-1">
        <p className="font-bold text-slate-700">AquaAlert • Urban Flood Hydro-Dynamic Prediction System</p>
        <p>Ministry of Earth Sciences (MoES) • National Centre for Medium Range Weather Forecasting (NCMRWF)</p>
      </footer>
    </div>
  );
};
