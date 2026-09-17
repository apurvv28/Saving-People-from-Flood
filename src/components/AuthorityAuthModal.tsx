'use client';

import React, { useState } from 'react';
import { X, Shield, Lock, Mail, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import { CityId } from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';

interface AuthorityAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCityId?: CityId;
  onSuccessLogin: (cityId: CityId, loginId: string) => void;
}

export const AuthorityAuthModal: React.FC<AuthorityAuthModalProps> = ({
  isOpen,
  onClose,
  defaultCityId = 'mumbai',
  onSuccessLogin
}) => {
  const { t } = useLanguage();
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [selectedCity, setSelectedCity] = useState<CityId>(defaultCityId);
  const [loginId, setLoginId] = useState(`${defaultCityId}.aqua.gov.in`);
  const [password, setPassword] = useState('12345678');
  const [officerName, setOfficerName] = useState('Chief Disaster Officer');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCityChange = (cId: CityId) => {
    setSelectedCity(cId);
    setLoginId(`${cId}.aqua.gov.in`);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanLogin = loginId.trim().toLowerCase();

      // Validate login format & password
      if (password !== '12345678') {
        setErrorMsg(t.authModal.invalidCredentials);
        setIsSubmitting(false);
        return;
      }

      if (!cleanLogin.endsWith('.aqua.gov.in') && !cleanLogin.includes('aqua.gov.in')) {
        setErrorMsg(t.authModal.invalidCredentials);
        setIsSubmitting(false);
        return;
      }

      // Extract city from login id if available
      let detectedCity: CityId = selectedCity;
      if (cleanLogin.startsWith('mumbai')) detectedCity = 'mumbai';
      else if (cleanLogin.startsWith('delhi')) detectedCity = 'delhi';
      else if (cleanLogin.startsWith('chennai')) detectedCity = 'chennai';

      setIsSubmitting(false);
      onSuccessLogin(detectedCity, cleanLogin);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 text-teal-800">
            <Shield className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {t.authModal.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              authTab === 'login'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.landing.authorityLoginBtn}
          </button>
          <button
            onClick={() => setAuthTab('signup')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              authTab === 'signup'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Credentials Helper Hint Box */}
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>{t.authModal.demoNote}</span>
          </div>
          <p className="text-[11px] text-slate-600">
            ID: <code className="font-mono text-teal-800 font-bold bg-white px-1 py-0.5 rounded border border-teal-200">{selectedCity}.aqua.gov.in</code>
            <br />
            Passcode: <code className="font-mono text-teal-800 font-bold bg-white px-1 py-0.5 rounded border border-teal-200">12345678</code>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {/* Target City Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t.nav.selectCity}:</label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value as CityId)}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="mumbai">Mumbai (mumbai.aqua.gov.in)</option>
              <option value="delhi">Delhi NCR (delhi.aqua.gov.in)</option>
              <option value="chennai">Chennai (chennai.aqua.gov.in)</option>
            </select>
          </div>

          {authTab === 'signup' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Officer Name / Designation:</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="e.g. Chief Hydraulic Engineer"
                required
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-teal-600"
              />
            </div>
          )}

          {/* Login ID */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t.authModal.domainLabel}:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder={t.authModal.domainPlaceholder}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">{t.authModal.passcodeLabel}:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.authModal.passcodePlaceholder}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-teal-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-95"
          >
            <span>{isSubmitting ? t.authModal.loggingIn : t.authModal.loginBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

