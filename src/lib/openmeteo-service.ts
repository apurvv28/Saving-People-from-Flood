import { CityId, CITIES } from './mock-data';

export interface OpenMeteoPrecipitationData {
  cityId: CityId;
  latitude: number;
  longitude: number;
  timestamp: string;
  currentPrecipitationMmHr: number;
  weatherCode: number;
  weatherDescription: string;
  isDrySpell: boolean;
  // 0-3h Nowcast step values at t = [0, 15, 30, 45, 60, 90, 120, 150, 180] mins
  nowcastTimelineMmHr: number[];
  source: string;
  windSpeedKmh?: number;
  windDirectionDeg?: number;
  cloudCoverPct?: number;
}

// Preset Historical Extreme Events for Backtesting
export interface HistoricalEvent {
  id: string;
  cityName: string;
  cityId: CityId;
  dateStr: string;
  title: string;
  peakPrecipitationMmHr: number;
  timelineMmHr: number[];
}

export const HISTORICAL_CLOUDBURST_EVENTS: HistoricalEvent[] = [
  {
    id: 'mumbai-2005',
    cityName: 'Mumbai',
    cityId: 'mumbai',
    dateStr: '2005-07-26',
    title: 'Mumbai July 26 Extreme Cloudburst (944mm Event)',
    peakPrecipitationMmHr: 120,
    timelineMmHr: [15, 45, 85, 110, 120, 105, 80, 50, 20]
  },
  {
    id: 'delhi-2023',
    cityName: 'Delhi NCR',
    cityId: 'delhi',
    dateStr: '2023-07-09',
    title: 'Delhi July 9 Torrential Downpour (153mm Event)',
    peakPrecipitationMmHr: 80,
    timelineMmHr: [10, 35, 65, 80, 75, 60, 40, 20, 5]
  },
  {
    id: 'chennai-2015',
    cityName: 'Chennai',
    cityId: 'chennai',
    dateStr: '2015-12-01',
    title: 'Chennai Dec 1 Great Deluge (490mm Event)',
    peakPrecipitationMmHr: 105,
    timelineMmHr: [20, 50, 90, 105, 100, 85, 60, 35, 15]
  }
];

export async function fetchOpenMeteoLivePrecipitation(cityId: CityId): Promise<OpenMeteoPrecipitationData> {
  const city = CITIES[cityId] || CITIES['mumbai'];
  const lat = city.center[0];
  const lng = city.center[1];

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation,rain,showers,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover&hourly=precipitation,precipitation_probability,wind_speed_10m,wind_direction_10m,cloud_cover&forecast_days=1&timezone=auto`;
    const res = await fetch(url, { next: { revalidate: 300 } }); // Cache 5 mins

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    const currentRain = data.current?.precipitation || 0;
    const weatherCode = data.current?.weather_code || 0;
    const hourlyRainArray: number[] = data.hourly?.precipitation || [];

    const windSpeedKmh = Number((data.current?.wind_speed_10m || 22.0).toFixed(1));
    const windDirectionDeg = Math.round(data.current?.wind_direction_10m || 240);
    const cloudCoverPct = Math.round(data.current?.cloud_cover ?? 80);

    // Extract next 3 hours of precipitation from Open-Meteo hourly array
    const h0 = hourlyRainArray[0] ?? currentRain;
    const h1 = hourlyRainArray[1] ?? currentRain;
    const h2 = hourlyRainArray[2] ?? currentRain;
    const h3 = hourlyRainArray[3] ?? currentRain;

    // Interpolate 15-minute steps for 0–3h nowcasting: t = [0, 15, 30, 45, 60, 90, 120, 150, 180]
    const nowcastTimelineMmHr = [
      currentRain,
      Number((currentRain * 0.7 + h0 * 0.3).toFixed(1)),
      Number((h0 * 0.8 + h1 * 0.2).toFixed(1)),
      Number((h0 * 0.4 + h1 * 0.6).toFixed(1)),
      Number(h1.toFixed(1)),
      Number((h1 * 0.5 + h2 * 0.5).toFixed(1)),
      Number(h2.toFixed(1)),
      Number((h2 * 0.5 + h3 * 0.5).toFixed(1)),
      Number(h3.toFixed(1))
    ];

    return {
      cityId,
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
      currentPrecipitationMmHr: currentRain,
      weatherCode,
      weatherDescription: getWeatherCodeDescription(weatherCode),
      isDrySpell: currentRain === 0 && Math.max(...nowcastTimelineMmHr) === 0,
      nowcastTimelineMmHr,
      source: 'Open-Meteo Live API (api.open-meteo.com)',
      windSpeedKmh,
      windDirectionDeg,
      cloudCoverPct
    };
  } catch (err) {
    console.warn(`[OpenMeteo] Fallback for ${cityId}:`, err);
    return {
      cityId,
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
      currentPrecipitationMmHr: 0,
      weatherCode: 0,
      weatherDescription: 'Clear / Dry Spell',
      isDrySpell: true,
      nowcastTimelineMmHr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      source: 'Open-Meteo API (Offline Mode)',
      windSpeedKmh: 15.0,
      windDirectionDeg: 240,
      cloudCoverPct: 50
    };
  }
}

function getWeatherCodeDescription(code: number): string {
  if (code === 0) return 'Clear Sky / Dry';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 80 && code <= 82) return 'Violent Heavy Downpour';
  if (code >= 95) return 'Thunderstorm Cloudburst';
  return 'Overcast Rain';
}
