// Funktioner der tolker data fra fetch funktionerne

function parseYrWeather()
{
  let currentDay = day();
  let currentHour = hour();
  let currentMinute = minute();
  if (currentMinute >= 30) currentHour++; // afrunder currentHour til den nærmeste time
  currentHour = currentHour.toString();
  if (currentHour.length == 1) currentHour = "0" + currentHour;
  let currentTimeseriesNo;
  let currentTimeseries;
  // finder det element i timeseries hvis tid er tættest på den nuværende
  for (let i = 0; i < 51 /*de første 52 elementer af timeseries har en timers mellemrum, resten har seks timer*/; i++)
  {
    if (importJson.yr.properties.timeseries[i].time.includes(currentDay + "T" + currentHour))
    {
      currentTimeseriesNo = i;
      currentTimeseries = importJson.yr.properties.timeseries[i].data;
      break;
    }
  }
  // anvise data til næste 48 timer
  for (let i = 0; i < 48; i++)
  {
    data.next48Hours[i].temperature[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.air_temperature,
    data.next48Hours[i].pressure[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.air_pressure_at_sea_level,
    data.next48Hours[i].cloudCover[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.cloud_area_fraction,
    data.next48Hours[i].humidity[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.relative_humidity,
    data.next48Hours[i].precipitation[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.next_1_hours.details.precipitation_amount,
    data.next48Hours[i].windSpeed[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.wind_speed,
    data.next48Hours[i].windDirection[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.wind_from_direction
  }
  // anvise data til nu
  data.now.temperature[0] = data.next48Hours[0].temperature[0];
  data.now.pressure[0] = data.next48Hours[0].pressure[0];
  data.now.cloudCover[0] = data.next48Hours[0].cloudCover[0];
  data.now.humidity[0] = data.next48Hours[0].humidity[0];
  data.now.precipitation[0] = data.next48Hours[0].precipitation[0];
  data.now.windSpeed[0] = data.next48Hours[0].windSpeed[0];
  data.now.windDirection[0] = data.next48Hours[0].windDirection[0];
}
