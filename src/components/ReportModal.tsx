'use client';

import React, { useState } from 'react';
import { X, Camera, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { CitizenReport, CityId } from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCityId: CityId;
  onAddReport: (report: CitizenReport) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  selectedCityId,
  onAddReport
}) => {
  const { t } = useLanguage();
  const [locationName, setLocationName] = useState('Central Junction');
  const [waterDepthCm, setWaterDepthCm] = useState(25);
  const [userNote, setUserNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: CitizenReport = {
        id: `rep-${Date.now()}`,
        cityId: selectedCityId,
        timestamp: 'Just now',
        lat: 19.0180 + (Math.random() - 0.5) * 0.01,
        lng: 72.8450 + (Math.random() - 0.5) * 0.01,
        locationName,
        waterDepthCm,
        userNote: userNote || 'Water depth observed',
        verified: true,
        upvotes: 1
      };

      onAddReport(newReport);
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-5 space-y-4 text-gray-900 dark:text-gray-100">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center space-x-2 text-blue-800">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-sm">
              {t.reportModal.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
            <p className="font-bold text-gray-900 text-sm">{t.reportModal.successToast}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t.reportModal.locationLabel}:</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-700 font-semibold">{t.reportModal.depthLabel}:</label>
                <span className="font-mono font-bold text-blue-700 text-sm">{waterDepthCm} cm</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={waterDepthCm}
                onChange={(e) => setWaterDepthCm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">{t.reportModal.obsLabel}:</label>
              <textarea
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                placeholder={t.reportModal.obsPlaceholder}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Photo Attachment Placeholder */}
            <div className="border border-dashed border-gray-300 p-3 rounded-xl flex items-center justify-center space-x-2 text-gray-500 hover:border-blue-600 cursor-pointer transition-all">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>{t.reportModal.photoLabel}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t.reportModal.submitting : t.reportModal.submitBtn}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

