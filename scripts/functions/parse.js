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
  data.now.isDay = isDay(currentTimeseries.data.next_1_hours.summary.symbol_code);
  data.now.time[0] = currentTimeseries.time;
  data.now.symbol_code[0] = convertSymbolCode(currentTimeseries.data.next_1_hours.summary.symbol_code, data.now.isDay);
  data.now.temperature[0] = currentTimeseries.data.instant.details.air_temperature;
  data.now.pressure[0] = currentTimeseries.data.instant.details.air_pressure_at_sea_level;
  data.now.cloudCover[0] = currentTimeseries.data.instant.details.cloud_area_fraction;
  data.now.humidity[0] = currentTimeseries.data.instant.details.relative_humidity;
  data.now.precipitation[0] = currentTimeseries.data.next_1_hours.details.precipitation_amount;
  data.now.windSpeed[0] = currentTimeseries.data.instant.details.wind_speed;
  data.now.windDirection[0] = currentTimeseries.data.instant.details.wind_from_direction;
  // anviser data til næste 48 timer
  for (let i = 0; i < 46; i++)
  {
    data.next48Hours[i].isDay = isDay(importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.next_1_hours.summary.symbol_code);
    data.next48Hours[i].time[0] = importJson.yr.properties.timeseries[i + currentTimeseriesNo].time;
    data.next48Hours[i].symbol_code[0] = convertSymbolCode(importJson.yr.properties.timeseries[i + currentTimeseriesNo].data.next_1_hours.summary.symbol_code, data.next48Hours[i].isDay);
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
    for (let i = 0; i < 20; i++)
    {
      for (let j = 0; j < importJson.yr.properties.timeseries.length; j++)
      {
        if (importJson.yr.properties.timeseries[j].time.includes(loopDay + "T" + loopHour) || importJson.yr.properties.timeseries[j].time.includes(loopDay + "T0" + loopHour))
        {
          data.next5Days[i].isDay = isDay(importJson.yr.properties.timeseries[j].data.next_6_hours.summary.symbol_code);
          data.next5Days[i].time[0] = importJson.yr.properties.timeseries[j].time;
          data.next5Days[i].symbol_code[0] = convertSymbolCode(importJson.yr.properties.timeseries[j].data.next_6_hours.summary.symbol_code, data.next5Days[i].isDay);
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
  calculateAverages();
}

// behandler det data fra openWeather med en times intervaller
// bliver brugt til vejret nu og 48 timer frem
function parseOpenWeather1Hour()
{
  // anviser data til vejret nu
  {
    data.now.time[1] = importJson.openWeather1Hour.current.dt;
    data.now.symbol_code[1] = convertSymbolCode(importJson.openWeather1Hour.current.weather[0].description, data.now.isDay);
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
    for (let i = 0; i < 46; i++)
    {
      data.next48Hours[i].time[1] = importJson.openWeather1Hour.hourly[i].dt;
      data.next48Hours[i].symbol_code[1] = convertSymbolCode(importJson.openWeather1Hour.hourly[i].weather[0].description, data.next48Hours[i].isDay);
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
  calculateAverages();
}

// behandler det data fra openWeather med tre timers intervaller
// bliver brugt til vejret 5 døgn frem
function parseOpenWeather3Hours()
// anvise data til næste 5 dage
{
  let loopHour = round((hour()+3)/6)*6;
  let loopDay = day();
  let currentMonth = month();
  for (let i = 0; i < 20; i++)
  {
    for (let j = 0; j < importJson.openWeather3Hours.list.length; j++)
    {
      if (importJson.openWeather3Hours.list[j].dt_txt.includes(loopDay + " " + loopHour) || importJson.openWeather3Hours.list[j].dt_txt.includes(loopDay + " 0" + loopHour))
      {
        data.next5Days[i].time[1] = importJson.openWeather3Hours.list[j].dt_txt;
        data.next5Days[i].symbol_code[1] = convertSymbolCode(importJson.openWeather3Hours.list[j].weather[0].description, data.next5Days[i].isDay);
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
  calculateAverages();
}

function parseAerisWeather()
{
  // nu
  data.now.time[2] = importJson.aerisWeather.response[0].periods[0].dateTimeISO;
  data.now.symbol_code[2] = convertSymbolCode(importJson.aerisWeather.response[0].periods[0].weather, data.now.isDay);
  data.now.temperature[2] = importJson.aerisWeather.response[0].periods[0].maxTempC;
  data.now.cloudCover[2] = importJson.aerisWeather.response[0].periods[0].sky;
  data.now.humidity[2] = importJson.aerisWeather.response[0].periods[0].humidity;
  data.now.precipitation[2] = importJson.aerisWeather.response[0].periods[0].precipMM;
  data.now.windSpeed[2] = kphToMps(importJson.aerisWeather.response[0].periods[0].windSpeedMaxKPH);
  data.now.windDirection[2] = convertDirectionToAngle(importJson.aerisWeather.response[0].periods[0].windDir);
  // næste to døgn
  for (let i = 0; i < 46; i++)
  {
    data.next48Hours[i].time[2] = importJson.aerisWeather.response[0].periods[i].dateTimeISO;
    data.next48Hours[i].symbol_code[2] = convertSymbolCode(importJson.aerisWeather.response[0].periods[i].weather, data.next48Hours[i].isDay);
    data.next48Hours[i].temperature[2] = importJson.aerisWeather.response[0].periods[i].maxTempC;
    data.next48Hours[i].cloudCover[2] = importJson.aerisWeather.response[0].periods[i].sky;
    data.next48Hours[i].humidity[2] = importJson.aerisWeather.response[0].periods[i].humidity;
    data.next48Hours[i].precipitation[2] = importJson.aerisWeather.response[0].periods[i].precipMM;
    data.next48Hours[i].windSpeed[2] = kphToMps(importJson.aerisWeather.response[0].periods[i].windSpeedMaxKPH);
    data.next48Hours[i].windDirection[2] = convertDirectionToAngle(importJson.aerisWeather.response[0].periods[i].windDir);
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
          data.next5Days[i].symbol_code[2] = convertSymbolCode(importJson.aerisWeather.response[0].periods[j].weather, data.next5Days[i].isDay);
          data.next5Days[i].temperature[2] = importJson.aerisWeather.response[0].periods[j].maxTempC;
          data.next5Days[i].cloudCover[2] = importJson.aerisWeather.response[0].periods[j].sky;
          data.next5Days[i].humidity[2] = importJson.aerisWeather.response[0].periods[j].humidity;
          data.next5Days[i].precipitation[2] = importJson.aerisWeather.response[0].periods[j].precipMM; // to-do; tager kun nedbør den kommende time i stedet for 6 timer
          data.next5Days[i].windSpeed[2] = kphToMps(importJson.aerisWeather.response[0].periods[j].windSpeedMaxKPH);
          data.next5Days[i].windDirection[2] = convertDirectionToAngle(importJson.aerisWeather.response[0].periods[j].windDir);
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
  calculateAverages();
}

function isDay(string)
{
  if (string.includes("day")) return true;
  if (string.includes("night")) return false;
  return null;
}

function convertSymbolCode(string, isDay)
{
  let symbolCode;

  string = string.replace("_day", "");
  string = string.replace("_night", "");

  switch(string)
  {
    case "clearsky": // yr
      symbolCode = "01"; // skyfrit
      break;

    case "fair": // yr
      symbolCode = "02" // lidt skyer, nat
      break;

    case "partlycloudy": // yr
      symbolCode = "03" // delvist skyet, dag
      break;

    case "cloudy": // yr
      symbolCode = "04" // overskyet
      break;

    case "rainshowers": // yr
      symbolCode = "05" // delvist skyet, moderat regn, dag
      break;

    case "rainshowersandthunder":
      symbolCode = "06" // delvist skyet, moderat regn, lyn, dag
      break;

    case "sleetshowers":
      symbolCode = "07" // delvist skyet, moderat slud, dag
      break;

    case "snowshowers":
      symbolCode = "08" // delvist skyet, moderat sne, nat
      break;

    case "rain":
      symbolCode = "09" // overskyet, moderat regn
      break;

    case "heavyrain": // yr
      symbolCode = "10" // overskyet, meget regn
      break;

    case "heavyrainandthunder": // yr
      symbolCode = "11" // overskyet, meget regn, lyn
      break;

    case "sleet":
      symbolCode = "12" // overskyet, moderat slud
      break;

    case "snow":
      symbolCode = "13" // overskyet, moderat sne
      break;

    case "snowandthunder":
      symbolCode = "14" // overskyet, moderat sne, lyn
      break;

    case "fog": // yr
      symbolCode = "15" // tåge
      break;

    case "sleetshowersandthunder":
      symbolCode = "20" // delvist skyet, moderat slud, lyn, dag
      break;

    case "snowshowersandthunder":
      symbolCode = "21" // delvist skyet, moderat sne, lyn, dag
      break;

    case "rainandthunder":
      symbolCode = "22" // overskyet, moderat regn, lyn
      break;

    case "sleetandthundert":
      symbolCode = "23" // overskyet, moderat slud, lyn
      break;

    case "lightrainshowersandthunder": // yr
      symbolCode = "24" // delvist skyet, lidt regn, lyn, dag
      break;

    case "heavyrainshowersandthunder": // yr
      symbolCode = "25" // delvist skyet, meget regn, lyn, dag
      break;

    case "lightsleetshowersandthunder":
      symbolCode = "26" // delvist skyet, lidt slud, lyn, nat
      break;

    case "heavysleetshowersandthunder":
      symbolCode = "27" // delvist skyet, meget slud, lyn, nat
      break;

    case "lightsnowshowersandthunder":
      symbolCode = "28" // delvist skyet, lidt sne, lyn, nat
      break;

    case "heavysnowshowersandthunder":
      symbolCode = "29" // delvist skyet, meget sne, lyn, nat
      break;

    case "lightrainandthunder":
      symbolCode = "30" // overskyet, lidt regn, lyn
      break;

    case "lightsleetandthunder":
      symbolCode = "31" // overskyet, lidt slud, lyn
      break;

    case "heavysleetandthunder":
      symbolCode = "32" // overskyet, meget slud, lyn
      break;

    case "lightsnowandthunder":
      symbolCode = "33" // overskyet, lidt sne, lyn
      break;

    case "heavysnowandthunder":
      symbolCode = "34" // overskyet, meget sne, lyn
      break;

    case "lightrainshowers": // yr
      symbolCode = "40" // delvist skyet, lidt regn, nat
      break;

    case "heavyrainshowers": // yr
      symbolCode = "41" // delvist skyet, meget regn, dag
      break;

    case "lightsleetshowers":
      symbolCode = "42" // delvist skyet, lidt slud, dag
      break;

    case "heavysleetshowers":
      symbolCode = "43" // delvist skyet, meget slud, dag
      break;

    case "lightsnowshowers":
      symbolCode = "44" // delvist skyet, lidt sne, dag
      break;

    case "heavysnowshowers":
      symbolCode = "45" // delvist skyet, meget sne, nat
      break;

    case "lightrain":
      symbolCode = "46" // overskyet, lidt regn
      break;

    case "lightsleet":
      symbolCode = "47" // overskyet, lidt slud
      break;

    case "heavysleet":
      symbolCode = "48" // overskyet, meget slud
      break;

    case "lightsnow":
      symbolCode = "49" // overskyet, lidt sne
      break;

    case "heavysnow":
      symbolCode = "50" // overskyet, meget sne
      break;

    default:
      symbolCode = "unknown";
      break;
  }

  switch (symbolCode)
  {
    case "01":
    case "02":
    case "03":
    case "40":
    case "05":
    case "41":
    case "24":
    case "06":
    case "25":
    case "42":
    case "07":
    case "43":
    case "26":
    case "20":
    case "27":
    case "44":
    case "08":
    case "45":
    case "28":
    case "21":
    case "29":
      if (isDay)
      {
        symbolCode += "d";
      }
      else
      {
        symbolCode += "n";
      }
      break

  }

  return symbolCode;

}

function kphToMps(kph)
{
  return kph / 3.6;
}

function convertDirectionToAngle(dir)
{
  let angle = 0;
  switch(dir)
  {
    case "N":
      angle = 0;
      break;
    case "NNE":
      angle = 22.5;
      break;
    case "NE":
      angle = 45;
      break;
    case "ENE":
      angle = 67.5;
      break;
    case "E":
      angle = 90;
      break;
    case "ESE":
      angle = 112.5;
      break;
    case "SE":
      angle = 135;
      break;
    case "SSE":
      angle = 157.5;
      break;
    case "S":
      angle = 180;
      break;
    case "SSW":
      angle = 202.5;
      break;
    case "SW":
      angle = 225;
      break;
    case "WSW":
      angle = 247.5;
      break;
    case "W":
      angle = 270;
      break;
    case "WNW":
      angle = 292.5;
      break;
    case "NW":
      angle = 315;
      break;
    case "NNW":
      angle = 337.5;
      break;
  }
  return angle;
}
