let data;
let dataLocation;
let weatherLocation;
let weatherCoords = [];

function setup()
{
  updateLocation("Viborg, Denmark");
  createCanvas(windowWidth, windowHeight);
  main();
}

async function fetchCoords(loc)
{
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + loc + "&key=AIzaSyA6gpEIocAHIPsDmgv8Fuob3J7o_Cyu-7c")
  .then(response => response.json())
  .then(json => dataLocation = json);
}

function fetchYrWeather(coords)
{
  // Henter vejr data i json-format fra yr.no
  fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" + coords[0] + "&lon=" + coords[1]) // Viborg
  .then(response => response.json())
  .then(json => data = json);
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
  if (windowWidth / windowHeight > 1600 / 900) scale(windowHeight / 900, windowHeight / 900);
  else scale(windowWidth / 1600, windowWidth / 1600);
  main();
}

function updateLocation(newLocation)
{
  weatherLocation = newLocation.replace(/ /g, "+");
  fetchCoords(weatherLocation);
  setTimeout(function()
  {
    weatherCoords[0] = round(dataLocation.results[0].geometry.location.lat, 3);
    weatherCoords[1] = round(dataLocation.results[0].geometry.location.lng, 3);
    fetchYrWeather(weatherCoords);
  }, 1000); //


}

function main()
{
  /*background(200);

  fill(255);
  noStroke();
  rect(150,150,350,600);
  rect(600,150,850,680);

  fill(100);
  textSize(24);
  text(data.properties.timeseries[0].data.instant.details.relative_humidity, 200, 200);
  */

  /*translate(100, 350);
  for (let i = 0; i < 24; i++)
  {
    line(i * 50, -data.properties.timeseries[i].data.instant.details.air_temperature * 5, (i + 1) * 50, -data.properties.timeseries[i+1].data.instant.details.air_temperature * 5);
    print(data.properties.timeseries[i].data.instant.details.air_temperature);
  }
  translate(-100, -350);*/
}


function draw()
{

}
