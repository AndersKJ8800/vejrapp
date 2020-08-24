// Funktioner der tolker data fra fetch funktionerne og bliver kaldt fra dem

// behandler data fra yr
function parseYrWeather()
{
  let currentDay = day();
  let currentHour = hour();
  currentHour = currentHour.toString();
  if (currentHour.length == 1) currentHour = "0" + currentHour;
  let currentTimeseriesNo;
  let currentTimeseries;
  // finder det element i timeseries hvis tid er den næste time.
  for (let i = 0; i < 52 /*de første 53 elementer af timeseries har en timers mellemrum, resten har seks timer*/; i++)
  {
    if (importJson.yr.properties.timeseries[i].time.includes(currentDay + "T" + currentHour))
    {
      currentTimeseriesNo = i;
      currentTimeseries = importJson.yr.properties.timeseries[i];
      break;
    }
  }
  // anviser data til vejret nu
  data.now.temperature[0] = currentTimeseries.data.instant.details.air_temperature;
  data.now.pressure[0] = currentTimeseries.data.instant.details.air_pressure_at_sea_level;
  data.now.cloudCover[0] = currentTimeseries.data.instant.details.cloud_area_fraction;
  data.now.humidity[0] = currentTimeseries.data.instant.details.relative_humidity;
  data.now.precipitation[0] = currentTimeseries.data.next_1_hours.details.precipitation_amount;
  data.now.windSpeed[0] = currentTimeseries.data.instant.details.wind_speed;
  data.now.windDirection[0] = currentTimeseries.data.instant.details.wind_from_direction;
  // anviser data til næste 48 timer
  for (let i = 0; i < 49; i++)
  {
    data.next48Hours[i].temperature[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.air_temperature,
    data.next48Hours[i].pressure[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.air_pressure_at_sea_level,
    data.next48Hours[i].cloudCover[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.cloud_area_fraction,
    data.next48Hours[i].humidity[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.relative_humidity,
    data.next48Hours[i].precipitation[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.next_1_hours.details.precipitation_amount,
    data.next48Hours[i].windSpeed[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.wind_speed,
    data.next48Hours[i].windDirection[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.wind_from_direction
  }
  // anvise data til næste 5 dage
  {
    let loopHour = round((hour()+3)/6)*6;
    let loopDay = currentDay;
    for (let i = 0; i < 20; i++)
    {
      for (let j = 0; j < importJson.yr.properties.timeseries.length; j++)
      {
        if (importJson.yr.properties.timeseries[j].time.includes(loopDay + "T" + loopHour) || importJson.yr.properties.timeseries[j].time.includes(loopDay + "T0" + loopHour))
        {
          data.next5Days[i].time[0] = importJson.yr.properties.timeseries[j].time;
          data.next5Days[i].temperature[0] = importJson.yr.properties.timeseries[j].data.instant.details.air_temperature;
          data.next5Days[i].cloudCover[0] = importJson.yr.properties.timeseries[j].data.instant.details.cloud_area_fraction;
          data.next5Days[i].humidity[0] = importJson.yr.properties.timeseries[j].data.instant.details.relative_humidity;
          data.next5Days[i].precipitation[0] = importJson.yr.properties.timeseries[j].data.next_6_hours.details.precipitation_amount;
          data.next5Days[i].windSpeed[0] = importJson.yr.properties.timeseries[j].data.instant.details.wind_speed;
          data.next5Days[i].windDirection[0] = importJson.yr.properties.timeseries[j].data.instant.details.wind_from_direction;
          break;
        }
      }
      loopHour += 6;
      if (loopHour > 18)
      {
        loopHour = 0;
        loopDay++;
      }
    }
  }
}

// behandler det data fra openWeather med en times intervaller
// bliver brugt til vejret nu og 48 timer frem
function parseOpenWeather1Hour()
{
  // anviser data til vejret nu
  data.now.temperature[1] = round((importJson.openWeather1Hour.current.temp - 273.15) * 10) / 10; // temperatur omdannes til celcius og afrundes til et decimal
  data.now.pressure[1] = importJson.openWeather1Hour.current.pressure;
  data.now.cloudCover[1] = importJson.openWeather1Hour.current.clouds;
  data.now.humidity[1] = importJson.openWeather1Hour.current.humidity;

  if (typeof importJson.openWeather1Hour.current.rain !== "undefined")
  {
    data.now.precipitation[1] = importJson.openWeather1Hour.current.rain["1h"];
  }
  else
  {
    data.now.precipitation[1] = 0;
  }
  data.now.windSpeed[1] = importJson.openWeather1Hour.current.wind_speed;
  data.now.windDirection[1] = importJson.openWeather1Hour.current.wind_deg;

}

// behandler det data fra openWeather med tre timers intervaller
// bliver brugt til vejret 5 døgn frem
function parseOpenWeather3Hours()
{

}
