let yo;
let weatherLocation = ("Viborg, Denmark"); // lokalitet som string
let weatherCoords = []; // lokalitet som koordinater
let importJson =  // hentet data i json format
{
  yr: null, // fra yr
  openWeather1Hour: null, // fra openweather (1/48 timer)
  openWeather3Hours: null, // fra openwather (3/120 timer)
  weatherBit: null
}
let data = // fortolket data fra json, hvert variabel er et array med forskellige kilder; [0]: yr, [1]: openweather, [2]: weatherbit, [3]: beregnet gennemsnit.
{
  location: weatherLocation, // lokalitet for vejret
  now: // vejret som det er lige nu.
  {
    temperature: [],
    pressure: [],
    cloudCover: [],
    precipitation: [],
    humidity: [],
    windSpeed: [],
    windDirection: []
  },
  next48Hours: [], // vejret de næste 48 timer med mellemrum på 1 time.
  next5Days: []// vejret de næste 5 døgn (48-120 timer) med mellemrum på 6 timer.
}
let RES_X = 1920; // opløsning / forhold appen er bygget ud fra
let RES_Y = 960; // ^
let scaling = 1; // appens skalering
let windowXDiff = 0; // forskel mellem appens og vinduets opløsning
let windowYDiff = 0; // ^
let buttons = [
  new Button(200, 400, 80, 50, [255,0,0]),
  new Button(300, 600, 80, 50, [0,255,0]),
  new Button(300, 200, 80, 50, [0,0,255])
]; // button objekter

function setup()
{
  for (let i = 0; i < 49; i++)
  {
    data.next48Hours[i] =
    {
      temperature: [0, 0, 0, 0],
      pressure: [0, 0, 0, 0],
      cloudCover: [0, 0, 0, 0],
      precipitation: [0, 0, 0, 0],
      humidity: [0, 0, 0, 0],
      windSpeed: [0, 0, 0, 0],
      windDirection: [0, 0, 0, 0]
    };
  }
  for (let i = 0; i < 21; i++)
  {
    data.next5Days[i] =
    {
      time: [0, 0, 0, 0],
      temperature: [0, 0, 0, 0],
      cloudCover: [0, 0, 0, 0],
      precipitation: [0, 0, 0, 0],
      humidity: [0, 0, 0, 0],
      windSpeed: [0, 0, 0, 0],
      windDirection: [0, 0, 0, 0]
    }
  }
  updateLocation(weatherLocation);
  createCanvas(1,1);
  windowResized();
}

function windowResized()
{
  resizeCanvas(windowWidth, windowHeight);
  // appen er designet ud fra en 1920 x 960 opløsning (2:1)
  // har vinduet ikke præcist de størrelser, skal appen skaleres.
  // appen skaleres så meget som muligt mens den forbeholder et 2:1 størrelsesforhold.
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
  importJson.yr = null;
  importJson.openWeather = null;
  importJson.weatherBit = null;
  updateWeatherCoords();
  setTimeout(function()
  {
    fetchYrWeather();
    fetchOpenWeather();
    fetchWeatherBit();
  }, 1000); //

}

function draw()
{
  background(200);
  translate(windowXDiff / 2, windowYDiff / 2);
  scale(scaling);
  fill(127);
  noStroke();
  rect(0,0,RES_X,RES_Y);
  textSize(50);
  fill(0);

  strokeWeight(10);
  for(let i = 0; i < data.next5Days.length-2; i++)
  {
    stroke(255,0,0);
    line(50 + 90 * i, -data.next5Days[i].temperature[0] * 25 + 1000, 50 + 90 * (i + 1), -data.next5Days[i+1].temperature[0] * 25 + 1000);
    stroke(255,255,255);
    line(50 + 90 * i, -data.next5Days[i].windSpeed[0] * 50 + 900, 50 + 90 * (i + 1), -data.next5Days[i+1].windSpeed[0] * 50 + 900);
    stroke(0,0,255);
    line(50 + 90 * i, -data.next5Days[i].humidity[0] * 15 + 1700, 50 + 90 * (i + 1), -data.next5Days[i+1].humidity[0] * 15 + 1700);
    stroke(80,80,80);
    line(50 + 90 * i, -data.next5Days[i].cloudCover[0] * 8 + 1000, 50 + 90 * (i + 1), -data.next5Days[i+1].cloudCover[0] * 8 + 1000);
  }

  try
  {
    text(weatherLocation + ": " + importJson.yr.properties.timeseries[0].importJson.instant.details.air_temperature + ", " + round((importJson.openWeather.list[0].main.temp -  273.15), 1) + ", " + importJson.weatherBit.data[0].temp + "°",100,50);
  } catch (exceptionIgnored) {}

  for (let i = 0; i < buttons.length; i++)
  {
    //buttons[i].draw();
  }

}

function mousePressed()
{
  let y = round((mouseY - (windowYDiff / 2)) / scaling);
  let x = round((mouseX - (windowXDiff / 2)) / scaling);
  for (let i = 0; i < buttons.length; i++)
  {
    if (x >= buttons[i].x && x <= buttons[i].x + buttons[i].width)
    {
      if (y >= buttons[i].y && y <= buttons[i].y + buttons[i].height)
      {
        buttons[i].update();
      }
    }
  }
}
