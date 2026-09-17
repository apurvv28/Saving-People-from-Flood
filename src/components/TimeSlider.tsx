'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Clock, CloudRain } from 'lucide-react';
import { getRadarPrecipitationForTime } from '@/lib/hydraulic-engine';
import { useLanguage } from '@/context/LanguageContext';

interface TimeSliderProps {
  timeOffsetMins: number;
  setTimeOffsetMins: React.Dispatch<React.SetStateAction<number>>;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  timeOffsetMins,
  setTimeOffsetMins
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffsetMins((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            return 180;
          }
          return prev + 15;
        });
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, setTimeOffsetMins]);

  const rainIntensity = getRadarPrecipitationForTime(timeOffsetMins);

  const hours = Math.floor(timeOffsetMins / 60);
  const mins = timeOffsetMins % 60;
  const timeLabel = `+${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

  const presetTimes = [0, 30, 60, 120, 180];

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all active:scale-95 shadow-xs"
            title={isPlaying ? t.slider.pause : t.slider.play}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setTimeOffsetMins(0);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-all active:scale-95"
            title={t.slider.reset}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700">
              {t.landing.metricLeadTimeSub}:
            </span>
            <span className="text-xs font-mono font-bold text-teal-900 bg-teal-50/90 border border-teal-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
              {timeLabel} ({timeOffsetMins} {t.slider.plusMin})
            </span>
          </div>
        </div>

        {/* Live Rainfall Intensity */}
        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <CloudRain className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="text-slate-500 font-semibold">{t.slider.rainRateLabel}</span>
          <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">{rainIntensity} mm/h</span>
        </div>
      </div>

      {/* Main Scrubber Slider */}
      <div className="relative pt-1 px-1">
        <input
          type="range"
          min={0}
          max={180}
          step={15}
          value={timeOffsetMins}
          onChange={(e) => setTimeOffsetMins(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 rounded-lg cursor-pointer"
        />

        {/* Ticks and preset buttons */}
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-2">
          {presetTimes.map((presetTime) => (
            <button
              key={presetTime}
              onClick={() => setTimeOffsetMins(presetTime)}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                timeOffsetMins === presetTime
                  ? 'bg-teal-600 text-white font-bold shadow-2xs'
                  : 'hover:text-slate-900 hover:bg-slate-100 font-medium'
              }`}
            >
              {presetTime === 0 ? t.slider.nowLive : `+${presetTime}${t.slider.plusMin}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
