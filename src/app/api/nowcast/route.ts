import { NextResponse } from 'next/server';
import { fetchOpenMeteoLivePrecipitation, HISTORICAL_CLOUDBURST_EVENTS } from '@/lib/openmeteo-service';
import { CityId } from '@/lib/mock-data';
import { getHydraulicSnapshotAtTime } from '@/lib/hydraulic-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeOffset = parseInt(searchParams.get('time') || '0', 10);
  const city = (searchParams.get('city') as CityId) || 'mumbai';
  const eventId = searchParams.get('eventId');

  let openMeteoData = await fetchOpenMeteoLivePrecipitation(city);

  // If historical cloudburst event selected for backtesting
  if (eventId) {
    const historicalEvent = HISTORICAL_CLOUDBURST_EVENTS.find(e => e.id === eventId);
    if (historicalEvent) {
      openMeteoData = {
        cityId: city,
        latitude: openMeteoData.latitude,
        longitude: openMeteoData.longitude,
        timestamp: historicalEvent.dateStr,
        currentPrecipitationMmHr: historicalEvent.timelineMmHr[0],
        weatherCode: 95,
        weatherDescription: historicalEvent.title,
        isDrySpell: false,
        nowcastTimelineMmHr: historicalEvent.timelineMmHr,
        source: `Open-Meteo Historical Archive (archive-api.open-meteo.com) [${historicalEvent.dateStr}]`
      };
    }
  }

  const snapshot = getHydraulicSnapshotAtTime(timeOffset, city, openMeteoData.nowcastTimelineMmHr);

  return NextResponse.json({
    success: true,
    city,
    timestamp: openMeteoData.timestamp,
    forecastLeadTimeMins: snapshot.timeOffsetMins,
    timeLabel: snapshot.timeLabel,
    openMeteoTelemetry: {
      source: openMeteoData.source,
      currentPrecipitationMmHr: openMeteoData.currentPrecipitationMmHr,
      weatherDescription: openMeteoData.weatherDescription,
      isDrySpell: openMeteoData.isDrySpell,
      nowcastTimelineMmHr: openMeteoData.nowcastTimelineMmHr
    },
    metrics: {
      maxWaterDepthCm: snapshot.maxWaterDepthCm,
      floodedRoadsCount: snapshot.totalFloodedRoadsCount,
      surchargingManholesCount: snapshot.criticalSurchargeNodesCount
    },
    windCloudTelemetry: snapshot.windCloudData,
    roadStates: snapshot.roadStates
  });
}
