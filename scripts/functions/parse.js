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
  data.now.time[0] = currentTimeseries.time;
  data.now.temperature[0] = currentTimeseries.data.instant.details.air_temperature;
  data.now.pressure[0] = currentTimeseries.data.instant.details.air_pressure_at_sea_level;
  data.now.cloudCover[0] = currentTimeseries.data.instant.details.cloud_area_fraction;
  data.now.humidity[0] = currentTimeseries.data.instant.details.relative_humidity;
  data.now.precipitation[0] = currentTimeseries.data.next_1_hours.details.precipitation_amount;
  data.now.windSpeed[0] = currentTimeseries.data.instant.details.wind_speed;
  data.now.windDirection[0] = currentTimeseries.data.instant.details.wind_from_direction;
  // anviser data til næste 48 timer
  for (let i = 0; i < 48; i++)
  {
    data.next48Hours[i].time[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].time;
    data.next48Hours[i].temperature[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.air_temperature;
    data.next48Hours[i].pressure[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.air_pressure_at_sea_level;
    data.next48Hours[i].cloudCover[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.cloud_area_fraction;
    data.next48Hours[i].humidity[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.relative_humidity;
    data.next48Hours[i].precipitation[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.next_1_hours.details.precipitation_amount;
    data.next48Hours[i].windSpeed[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.wind_speed;
    data.next48Hours[i].windDirection[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.instant.details.wind_from_direction;
  }
  // anvise data til næste 5 dage
  {
    let loopHour = round((hour()+3)/6)*6;
    let loopDay = currentDay;
    let currentMonth = month();
    for (let i = 0; i < 21; i++)
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
        if (loopDay == 31 || (loopDay == 30 && (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11)) || (loopDay == 28 && currentMonth == 2))
        {
          loopDay = 1;
        }
        else
        {
          loopDay++;
        }
      }
    }
  }
  parsedData++;
}

// behandler det data fra openWeather med en times intervaller
// bliver brugt til vejret nu og 48 timer frem
function parseOpenWeather1Hour()
{
  // anviser data til vejret nu
  {
    data.now.temperature[1] = importJson.openWeather1Hour.current.dt;
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
  // anviser data til vejret 48 timer frem
  {
    for (let i = 0; i < 48; i++)
    {
      data.next48Hours[i].time[1] = importJson.openWeather1Hour.hourly[i].dt;
      data.next48Hours[i].temperature[1] = round((importJson.openWeather1Hour.hourly[i].temp - 273.15) * 10) / 10
      data.next48Hours[i].pressure[1] = importJson.openWeather1Hour.hourly[i].pressure;
      data.next48Hours[i].cloudCover[1] = importJson.openWeather1Hour.hourly[i].clouds;
      data.next48Hours[i].humidity[1] = importJson.openWeather1Hour.hourly[i].humidity;
      try
      {
        data.next48Hours[i].precipitation[1] = importJson.openWeather1Hour.hourly[i].rain["1h"];
      }
      catch
      {
        data.next48Hours[i].precipitation[1] = 0;
      }
      data.next48Hours[i].windSpeed[1] = importJson.openWeather1Hour.hourly[i].wind_speed;
      data.next48Hours[i].windDirection[1] = importJson.openWeather1Hour.hourly[i].wind_deg;
    }
  }
  parsedData++;
}

// behandler det data fra openWeather med tre timers intervaller
// bliver brugt til vejret 5 døgn frem
function parseOpenWeather3Hours()
// anvise data til næste 5 dage
{
  let loopHour = round((hour()+3)/6)*6;
  let loopDay = day();
  let currentMonth = month();
  for (let i = 0; i < 21; i++)
  {
    for (let j = 0; j < importJson.openWeather3Hours.list.length; j++)
    {
      if (importJson.openWeather3Hours.list[j].dt_txt.includes(loopDay + " " + loopHour) || importJson.openWeather3Hours.list[j].dt_txt.includes(loopDay + " 0" + loopHour))
      {
        data.next5Days[i].time[1] = importJson.openWeather3Hours.list[j].dt;
        data.next5Days[i].temperature[1] = round((importJson.openWeather3Hours.list[j].main.temp - 273.15) * 10) / 10;
        data.next5Days[i].cloudCover[1] = importJson.openWeather3Hours.list[j].clouds.all;
        data.next5Days[i].humidity[1] = importJson.openWeather3Hours.list[j].main.humidity;
        try
        {
          data.next5Days[i].precipitation[1] = importJson.openWeather3Hours.list[i].rain["3h"];
        }
        catch
        {
          data.next5Days[i].precipitation[1] = 0;
        }
        data.next5Days[i].windSpeed[1] = importJson.openWeather3Hours.list[i].wind.speed;
        data.next5Days[i].windDirection[1] = importJson.openWeather3Hours.list[i].wind.deg;
        break;
      }
    }
    loopHour += 6;
    if (loopHour > 18)
    {
      loopHour = 0;
      if (loopDay == 31 || (loopDay == 30 && (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11)) || (loopDay == 28 && currentMonth == 2))
      {
        loopDay = 1;
      }
      else
      {
        loopDay++;
      }
    }
  }
  parsedData++;
}

function parseAerisWeather()
{
  // nu
  data.now.time[2] = importJson.aerisWeather.response[0].periods[0].dateTimeISO;
  data.now.temperature[2] = importJson.aerisWeather.response[0].periods[0].maxTempC;
  data.now.cloudCover[2] = importJson.aerisWeather.response[0].periods[0].sky;
  data.now.humidity[2] = importJson.aerisWeather.response[0].periods[0].humidity;
  data.now.precipitation[2] = importJson.aerisWeather.response[0].periods[0].precipMM;
  data.now.windSpeed[2] = importJson.aerisWeather.response[0].periods[0].windSpeedMaxKPH;
  data.now.windDirection[2] = importJson.aerisWeather.response[0].periods[0].windDir;
  data.now.pressure[2] = null;
  // næste to døgn
  for (let i = 0; i < 48; i++)
  {
    data.next48Hours[i].time[2] = importJson.aerisWeather.response[0].periods[i].dateTimeISO;
    data.next48Hours[i].temperature[2] = importJson.aerisWeather.response[0].periods[i].maxTempC;
    data.next48Hours[i].cloudCover[2] = importJson.aerisWeather.response[0].periods[i].sky;
    data.next48Hours[i].humidity[2] = importJson.aerisWeather.response[0].periods[i].humidity;
    data.next48Hours[i].precipitation[2] = importJson.aerisWeather.response[0].periods[i].precipMM;
    data.next48Hours[i].windSpeed[2] = importJson.aerisWeather.response[0].periods[i].windSpeedMaxKPH;
    data.next48Hours[i].windDirection[2] = importJson.aerisWeather.response[0].periods[i].windDir;
    data.next48Hours[i].pressure[2] = null;
  }
  // næste 5 døgn
  {
    let currentHour = hour();
    let currentDay = day();
    let currentMonth = month();
    let loopDay = currentDay;
    let loopHour = round((hour()+3)/6)*6;
    for (let i = 0; i < 20; i++)
    {
      for (let j = 0; j < importJson.aerisWeather.response[0].periods.length; j++)
      {
        if (importJson.aerisWeather.response[0].periods[j].dateTimeISO.includes(loopDay + "T" + loopHour)
        || importJson.aerisWeather.response[0].periods[j].dateTimeISO.includes(loopDay + "T0" + loopHour))
        {
          data.next5Days[i].time[2] = importJson.aerisWeather.response[0].periods[j].dateTimeISO;
          data.next5Days[i].temperature[2] = importJson.aerisWeather.response[0].periods[j].maxTempC;
          data.next5Days[i].cloudCover[2] = importJson.aerisWeather.response[0].periods[j].sky;
          data.next5Days[i].humidity[2] = importJson.aerisWeather.response[0].periods[j].humidity;
          data.next5Days[i].precipitation[2] = importJson.aerisWeather.response[0].periods[j].precipMM; // to-do; tager kun nedbør den kommende time i stedet for 6 timer
          data.next5Days[i].windSpeed[2] = importJson.aerisWeather.response[0].periods[j].windSpeedMaxKPH;
          data.next5Days[i].windDirection[2] = importJson.aerisWeather.response[0].periods[j].windDir;
          //data.next5Days[i].pressure[2] = null;
          break
        }
      }
      loopHour += 6;
      if (loopHour > 18)
      {
        loopHour = 0;
        if (loopDay == 31 || (loopDay == 30 && (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11)) || (loopDay == 28 && currentMonth == 2))
        {
          loopDay = 1;
        }
        else
        {
          loopDay++;
        }
      }
    }
  }
  parsedData++;
}
