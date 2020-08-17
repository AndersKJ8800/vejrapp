// henter koordinater efter man har givet en lokalitet, fx. "Viborg, Denmark"
function updateWeatherCoords()
{
  let loc = weatherLocation.replace(/ /g, "+");
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&key=AIzaSyA6gpEIocAHIPsDmgv8Fuob3J7o_Cyu-7c")
  .then(response => response.json())
  .then(json => weatherCoords = [round(json.results[0].geometry.location.lat, 3), round(json.results[0].geometry.location.lng, 3)]);
}

// henter vejr data fra yr.no ud fra koordinater
function fetchYrWeather()
{
  fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + weatherCoords[0] + "&lon=" + weatherCoords[1]) // Viborg
  .then(response => response.json())
  .then(json => data.yr = json);
}

// henter vejr data fra openweathermap.org ud fra koordinater
function fetchOpenWeather()
{
  fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + weatherCoords[0] + "&lon=" + weatherCoords[1] + "&appid=a75b2f1551a5efc97ef0ac5b55d5bd83")
  .then(response => response.json())
  .then(json => data.openWeather = json);
}

function fetchWeatherBit()
{
  fetch("https://weatherbit-v1-mashape.p.rapidapi.com/forecast/hourly?lang=en&hours=48&lat=" + weatherCoords[0] + "&lon=" + weatherCoords[1], {
	   "method": "GET",
	    "headers":
      {
		      "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
		        "x-rapidapi-key": "221d67e149mshfe5c26dc12d4138p1857e9jsnb0c2c1aac3de"
	    }
  })
  .then(response => response.json())
  .then(json => data.weatherBit = json);
}
