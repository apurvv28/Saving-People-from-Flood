'use client';

import React from 'react';
import { X, Printer, Shield, FileCheck, AlertTriangle } from 'lucide-react';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';
import { CityId, CITIES } from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';

interface SitRepExporterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCityId: CityId;
  timeOffsetMins: number;
}

export const SitRepExporter: React.FC<SitRepExporterProps> = ({
  isOpen,
  onClose,
  selectedCityId,
  timeOffsetMins
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const city = CITIES[selectedCityId];
  const snapshot = getHydraulicSnapshotAtTime(timeOffsetMins, selectedCityId);
  const now = new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 text-teal-800">
            <Shield className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {t.sitrep.title} ({city.name})
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.sitrep.generatePdf}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-900 text-xs space-y-4 font-mono">
          <div className="border-b border-slate-300 pb-3 flex justify-between items-start">
            <div>
              <h2 className="text-base font-bold text-teal-800">MINISTRY OF EARTH SCIENCES (MoES)</h2>
              <p className="text-slate-600 text-[11px]">National Centre for Medium Range Weather Forecasting (NCMRWF)</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{t.sitrep.summaryHeading} ({city.name.toUpperCase()})</p>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              <p>Generated: {now}</p>
              <p>Lead Time: <span className="text-teal-700 font-bold">{snapshot.timeLabel}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <p className="text-slate-500 text-[10px]">{t.slider.rainRateLabel}</p>
              <p className="text-sm font-bold text-teal-700">{snapshot.rainfallRateMmHr} mm/h</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <p className="text-slate-500 text-[10px]">{t.nav.maxDepth}</p>
              <p className="text-sm font-bold text-red-600">{snapshot.maxWaterDepthCm} cm</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <p className="text-slate-500 text-[10px]">{t.drainage.criticalNodes}</p>
              <p className="text-sm font-bold text-red-600">{snapshot.criticalSurchargeNodesCount}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-800 flex items-center space-x-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.sitrep.criticalZones}</span>
            </p>
            <div className="space-y-1.5">
              {snapshot.roadStates.filter(r => r.waterDepthCm >= 15).map(r => (
                <div key={r.roadId} className="flex justify-between p-2 rounded bg-white border border-slate-200">
                  <span>{r.roadId}</span>
                  <span className="text-red-600 font-bold">{r.waterDepthCm} cm ({r.severity.toUpperCase()})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-800 flex items-center space-x-1.5 text-[11px]">
              <FileCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>RECOMMENDED INTERVENTIONS</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
              <li>Deploy high-capacity mobile dewatering pumps at low elevation underpasses.</li>
              <li>Issue emergency traffic diversion alerts via Navigation API for critical corridors.</li>
              <li>Activate flood-safe transit corridors for ambulances and emergency vehicles.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

