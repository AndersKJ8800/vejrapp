let yo;
let weatherLocation = ("Viborg, Denmark"); // lokalitet som string
let weatherCoords = []; // lokalitet som koordinater
let data =  // hentet data i json format
{
  yr: null, // fra yr
  openWeather: null, // fra openweather
  weatherBit: null
}
let RES_X = 1920; // opløsning appen er bygget ud fra
let RES_Y = 960; // ^
let scaling = 1; // appens skalering
let windowXDiff = 0; // forskel mellem appens og vinduets opløsning
let windowYDiff = 0; // ^

function setup()
{
  updateLocation(weatherLocation);
  createCanvas(1,1);
  windowResized();
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
  // appen er designet ud fra en 1920 x 960 opløsning (2:1)
  // har vinduet ikke præcist de størrelser, skal appen skaleres.
  let xScale = windowWidth / RES_X;
  let yScale = windowHeight / RES_Y;
  scaling = 1;
  if (xScale < yScale) scaling = xScale;
  else scaling = yScale;
  // hvor skal appens nulpunkt være for at den er centreret
  windowXDiff = windowWidth - RES_X * scaling;
  windowYDiff = windowHeight - RES_Y * scaling;
}

function updateLocation(newLocation)
{
  weatherLocation = newLocation;
  data.yr = null;
  data.openWeather = null;
  data.weatherBit = null;
  updateWeatherCoords();
  setTimeout(function()
  {
    fetchYrWeather();
    fetchOpenWeather();
    fetchWeatherBit();
  }, 1000); //

}

/*function main()
{

  fill(255);
  noStroke();
  rect(150,150,350,600);
  rect(600,150,850,680);

  fill(100);
  textSize(24);
  text(data.properties.timeseries[0].data.instant.details.relative_humidity, 200, 200);


  translate(100, 350);
  for (let i = 0; i < 24; i++)
  {
    line(i * 50, -data.properties.timeseries[i].data.instant.details.air_temperature * 5, (i + 1) * 50, -data.properties.timeseries[i+1].data.instant.details.air_temperature * 5);
    print(data.properties.timeseries[i].data.instant.details.air_temperature);
  }
  translate(-100, -350);
}*/


function draw()
{
  background(200);
  translate(windowXDiff / 2, windowYDiff / 2);
  scale(scaling);
  // temp
  fill(127);
  noStroke();
  rect(0,0,RES_X,RES_Y);
  textSize(50);
  fill(0);
  try
  {
    text(weatherLocation + ": " + data.yr.properties.timeseries[0].data.instant.details.air_temperature + ", " + round((data.openWeather.list[0].main.temp -  273.15), 1) + ", " + data.weatherBit.data[0].temp + "°",100,50);
  } catch (sdfsdfsdf) {}

  yo = Object.keys(weatherIcons).map((key) => [Number(key), weatherIcons[key]])
  let j = 0;
  for (let i = 0; i < 19; i++)
  {
    image(yo[i][1], 0 + i * 100, 100);
    image(yo[i+19][1], 0 + i * 100, 200);
    image(yo[i+19+19][1], 0 + i * 100, 300);
    image(yo[i+19+19+19][1], 0 + i * 100, 400);
    try {
      image(yo[i+19+19+19+19][1], 0 + i * 100, 500);
    } catch (esdfsdf) {}
  }

  //


}
