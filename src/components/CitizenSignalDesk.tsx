'use client';

import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  LocateFixed,
  Waves,
  CloudRain,
  Flame,
  ThumbsUp,
  CheckCircle2,
  Clock,
  Camera,
  ShieldCheck,
  Filter,
  Sparkles,
  Send,
  UserCheck,
  Layers
} from 'lucide-react';
import {
  CitizenSignal,
  SignalIssueType,
  ISSUE_TYPE_CONFIG,
  getCitizenSignals,
  submitCitizenSignal,
  upvoteCitizenSignal,
  calculateNearestManhole,
  getActiveBlockagePenalty
} from '@/lib/citizen-signals-service';

interface CitizenSignalDeskProps {
  selectedCityId: string;
}

export const CitizenSignalDesk: React.FC<CitizenSignalDeskProps> = ({ selectedCityId }) => {
  const [signals, setSignals] = useState<CitizenSignal[]>(() => getCitizenSignals(selectedCityId));
  const [selectedIssue, setSelectedIssue] = useState<SignalIssueType>('blocked_inlet');
  const [severityPct, setSeverityPct] = useState(75);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reporterAlias, setReporterAlias] = useState('');
  const [lat, setLat] = useState(19.0178);
  const [lon, setLon] = useState(72.8478);
  const [nearestNode, setNearestNode] = useState('MH-042 (Dadar TT Main)');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const activePenalty = getActiveBlockagePenalty(selectedCityId);

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = Number(pos.coords.latitude.toFixed(4));
          const newLon = Number(pos.coords.longitude.toFixed(4));
          setLat(newLat);
          setLon(newLon);
          setNearestNode(calculateNearestManhole(newLat, newLon));
          setIsLocating(false);
        },
        () => {
          setLat(19.0178);
          setLon(72.8478);
          setNearestNode(calculateNearestManhole(19.0178, 72.8478));
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handlePresetPhoto = (url: string) => {
    setPhotoPreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSignal = submitCitizenSignal({
      cityId: selectedCityId,
      issueType: selectedIssue,
      title,
      description: description || 'Citizen reported severe drainage bottleneck.',
      latitude: lat,
      longitude: lon,
      nearestManholeId: nearestNode,
      severityRatio: severityPct / 100,
      reporterAlias: reporterAlias || 'CitizenObserver',
      photoUrl: photoPreview || undefined
    });

    setSignals([newSignal, ...signals]);
    setTitle('');
    setDescription('');
    setPhotoPreview(null);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const handleUpvote = (id: string) => {
    upvoteCitizenSignal(id);
    setSignals(getCitizenSignals(selectedCityId));
  };

  const filteorangeSignals = filterStatus === 'ALL'
    ? signals
    : signals.filter((s) => s.status === filterStatus);

  return (
    <div className="space-y-6 pb-12 text-base">
      {/* Top Header Banner */}
      <div className="panel rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-blue-500/30 bg-white/95 dark:bg-gradient-to-r dark:from-gray-900/90 dark:via-gray-850/80 dark:to-gray-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl m-2">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/40 text-base font-bold">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Citizen Ground-Truth Layer
            </span>
            <span className="badge bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/40 text-base font-bold">
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Direct SWMM Model Feedback
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Drain Blockage & Waterlogging Signal Desk
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            Report choked grates, overflowing stormwater nallas, and standing water in real time.
            Verified community signals directly calibrate the hydrodynamic drainage network capacity.
          </p>
        </div>

        {/* Global Blockage Penalty Card */}
        <div className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800 bg-gray-50/90 dark:bg-gray-850/90 min-w-[260px] shrink-0 text-right m-1.5 shadow-md">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 block">
            City Hydraulic Capacity Factor
          </span>
          <span className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono mt-1 block">
            {Math.round(activePenalty * 100)}%
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {signals.filter((s) => s.status === 'validated').length} Verified Hotspots Active
          </p>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/40 text-green-800 dark:text-green-300 text-base font-semibold flex items-center space-x-3 animate-fadeIn m-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <span>Report submitted successfully! Queued for municipal review and placed on GIS vector mesh.</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 m-2">
        {/* Left Column: Submission Form (5 Cols) */}
        <div className="lg:col-span-5 panel rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/60 space-y-5 m-1 shadow-xl">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-3">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center space-x-2.5">
              <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Submit Hazard Observation</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Coordinates are automatically linked to the nearest municipal SWD manhole.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Geolocation & Nearest Node Detection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Incident Location:</span>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1.5 font-bold"
                >
                  <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Detecting...' : 'Auto GPS'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 space-y-2 text-base">
                <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="font-mono">{lat.toFixed(4)}° N, {lon.toFixed(4)}° E</span>
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-mono bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-800">
                  Nearest Drainage Manhole: <strong className="text-gray-900 dark:text-gray-100">{nearestNode}</strong>
                </div>
              </div>
            </div>

            {/* Issue Category Chips */}
            <div className="space-y-2">
              <label className="text-base text-gray-700 dark:text-gray-300 font-medium block">Select Hazard Category:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['waterlogging', 'blocked_inlet', 'drain_overflow', 'sewer_backflow'] as SignalIssueType[]).map((type) => {
                  const cfg = ISSUE_TYPE_CONFIG[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedIssue(type);
                        setSeverityPct(Math.round(cfg.defaultSeverity * 100));
                      }}
                      className={`p-3 rounded-xl border text-left text-base font-bold transition-all flex flex-col justify-between m-1 ${
                        selectedIssue === type
                          ? 'border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300 shadow-sm'
                          : 'border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="leading-tight">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Slider */}
            <div className="space-y-2.5 p-4 rounded-xl bg-gray-100 dark:bg-gray-850 border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center text-base">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Estimated Blockage Severity:</span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{severityPct}% Penalty</span>
              </div>
              <input
                type="range"
                min={10}
                max={95}
                step={5}
                value={severityPct}
                onChange={(e) => setSeverityPct(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
                <span>10% (Standing puddle)</span>
                <span>50%</span>
                <span>95% (Fully submerged main)</span>
              </div>
            </div>

            {/* Title & Notes */}
            <div className="space-y-1.5">
              <label className="text-base text-gray-700 dark:text-gray-300 font-medium block">Report Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. Silt and trash choking catch-basin grate"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-850 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-base text-gray-700 dark:text-gray-300 font-medium block">Observation Notes:</label>
              <textarea
                rows={2}
                placeholder="Describe water depth, traffic blockage, or backflow..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-850 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Evidence Photo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-base">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Attach Evidence Photo:</span>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="text-orange-500 hover:underline text-sm font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {photoPreview ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-blue-500/40">
                  <img src={photoPreview} alt="Evidence" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-2 text-xs font-mono bg-black/80 px-2 py-0.5 rounded text-blue-300">
                    Photo Attached
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=400&q=80')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-2 transition-colors m-1"
                  >
                    <Camera className="w-4 h-4 text-blue-500" />
                    <span>Sample Clog Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetPhoto('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=80')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-2 transition-colors m-1"
                  >
                    <Waves className="w-4 h-4 text-blue-500" />
                    <span>Sample Flood Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reporter Handle */}
            <div className="space-y-1.5">
              <label className="text-base text-gray-700 dark:text-gray-300 font-medium block">Reporter Handle / Ward:</label>
              <input
                type="text"
                placeholder="e.g. KurlaResident_WardL"
                value={reporterAlias}
                onChange={(e) => setReporterAlias(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-850 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-base text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white font-bold text-base flex items-center justify-center space-x-2.5 shadow-lg shadow-orange-600/25 transition-all active:scale-95 m-1"
            >
              <Send className="w-5 h-5" />
              <span>Submit Ground-Truth Observation</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Community Stream (7 Cols) */}
        <div className="lg:col-span-7 panel rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/60 space-y-5 m-1 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center space-x-2.5">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Live Community Blockage Stream</span>
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Real-time crowd observations verified by municipal hydrologists.
                </p>
              </div>

              {/* Status Filter Dropdown */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-850 px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300 mr-2 font-medium">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-base font-bold text-gray-900 dark:text-gray-100 focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">All Reports</option>
                  <option value="validated" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Validated (Hotspots)</option>
                  <option value="active" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Pending Review</option>
                  <option value="resolved" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">Resolved</option>
                </select>
              </div>
            </div>

            {/* Cards Feed */}
            <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
              {filteorangeSignals.map((sig) => {
                const cfg = ISSUE_TYPE_CONFIG[sig.issueType];
                return (
                  <div
                    key={sig.id}
                    className="card rounded-2xl p-5 border border-gray-200 dark:border-gray-800/90 bg-gray-50/90 dark:bg-gray-850/70 hover:border-blue-500/50 transition-all space-y-3 m-1.5 shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-lg text-sm font-bold border ${cfg.badgeColor}`}>
                          {cfg.label}
                        </span>
                        <span className="text-sm font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-750 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 font-bold">
                          {sig.nearestManholeId}
                        </span>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        sig.status === 'validated'
                          ? 'bg-green-500/20 text-green-800 dark:text-green-300 border border-green-500/30'
                          : sig.status === 'resolved'
                          ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/30'
                      }`}>
                        {sig.status === 'validated' ? 'Validated by BMC' : sig.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-snug">
                      {sig.title}
                    </h4>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                      {sig.description}
                    </p>

                    {/* Photo Evidence */}
                    {sig.photoUrl && (
                      <div className="relative h-36 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
                        <img src={sig.photoUrl} alt="Hazard photo" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 text-xs font-mono bg-black/80 px-2 py-1 rounded text-blue-300">
                          Photographic Evidence
                        </span>
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono">By: {sig.reporterAlias}</span>
                        <span>•</span>
                        <span>{new Date(sig.reportedAt).toLocaleTimeString()}</span>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-base">
                          {Math.round(sig.severityRatio * 100)}% Penalty
                        </span>
                        <button
                          onClick={() => handleUpvote(sig.id)}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-sm font-bold border border-gray-300 dark:border-gray-700 flex items-center space-x-1.5 transition-colors active:scale-95"
                        >
                          <ThumbsUp className="w-4 h-4 text-blue-500" />
                          <span>{sig.upvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
