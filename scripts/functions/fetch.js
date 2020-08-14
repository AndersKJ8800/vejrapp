// henter koordinater efter man har givet en lokalitet, fx. "Viborg, Denmark"
function fetchCoords(loc)
{
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&key=AIzaSyA6gpEIocAHIPsDmgv8Fuob3J7o_Cyu-7c")
  .then(response => response.json())
  .then(json => data.location = json);
}

// henter vejr data fra yr.no ud fra koordinater
function fetchYrWeather(coords)
{
  fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + coords[0] + "&lon=" + coords[1]) // Viborg
  .then(response => response.json())
  .then(json => data.weather.yr = json);
}
