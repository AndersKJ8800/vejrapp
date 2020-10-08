// Funktioner der fetcher data fra api'er.

// henter koordinater efter man har givet en lokalitet, fx. "Viborg, Denmark"
function updateWeatherCoords()
{
  let loc = weatherLocation.replace(/ /g, "+");
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&key=AIzaSyA6gpEIocAHIPsDmgv8Fuob3J7o_Cyu-7c")
  .then(response => response.json())
  .then(json => importJson.google = json);
}

// henter vejr data fra yr.no ud fra koordinater
function fetchYrWeather()
{
  fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + weatherCoords[0] + "&lon=" + weatherCoords[1])
  .then(response => response.json())
  .then(json => importJson.yr = json)
  .then(json => parseYrWeather());
}

// henter vejr data fra openweathermap.org ud fra koordinater
function fetchOpenWeather()
{
  fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + weatherCoords[0] + "&lon=" + weatherCoords[1] + "&appid=a75b2f1551a5efc97ef0ac5b55d5bd83")
  .then(response => response.json())
  .then(json => importJson.openWeather3Hours = json)
  .then(json => parseOpenWeather3Hours());

  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + weatherCoords[0] + "&lon=" + weatherCoords[1] + "&exclude=daily,minutely&appid=a75b2f1551a5efc97ef0ac5b55d5bd83")
  .then(response => response.json())
  .then(json => importJson.openWeather1Hour = json)
  .then(json => parseOpenWeather1Hour());
}

function fetchAerisWeather()
{
  fetch("https://api.aerisapi.com/forecasts/" + weatherCoords[0] + "," + weatherCoords[1] + "?filter=1hr&limit=130&fields=periods.dateTimeISO,periods.maxTempF,periods.maxTempC,periods.pop,periods.precipIN,periods.precipMM,periods.humidity,periods.sky,periods.solradWM2,periods.dewpointF,periods.dewpointC,periods.windDir,periods.windSpeedMaxMPH,periods.windSpeedMaxKPH,periods.weather&client_id=BKL8xbGmi9M83UvxP8Oyx&client_secret=q50Je6KF0dkdzBsPhHhT73FJmro5SYOtiHrJff3D")
  .then(response => response.json())
  .then(json => importJson.aerisWeather = json)
  .then(json => parseAerisWeather());
}
