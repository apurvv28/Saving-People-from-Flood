'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Clock, CloudRain } from 'lucide-react';
import { getRadarPrecipitationForTime } from '@/lib/hydraulic-engine';

interface TimeSliderProps {
  timeOffsetMins: number;
  setTimeOffsetMins: React.Dispatch<React.SetStateAction<number>>;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  timeOffsetMins,
  setTimeOffsetMins
}) => {
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
    <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all active:scale-95 shadow-sm"
            title={isPlaying ? 'Pause Simulation' : 'Play 0–3h Forecast Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              setIsPlaying(false);
              setTimeOffsetMins(0);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all"
            title="Reset to Present Time"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-700">
              Forecast Lead Time:
            </span>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-lg">
              {timeLabel} ({timeOffsetMins} mins)
            </span>
          </div>
        </div>

        {/* Live Rainfall Intensity */}
        <div className="hidden sm:flex items-center space-x-2 text-xs">
          <CloudRain className="w-4 h-4 text-teal-600" />
          <span className="text-slate-500">Doppler Radar:</span>
          <span className="font-mono font-bold text-teal-700">{rainIntensity} mm/h</span>
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
          {presetTimes.map((t) => (
            <button
              key={t}
              onClick={() => setTimeOffsetMins(t)}
              className={`px-2 py-0.5 rounded-md transition-all ${
                timeOffsetMins === t
                  ? 'bg-teal-600 text-white font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t === 0 ? 'NOW (+0m)' : `+${t}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
