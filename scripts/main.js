let yo;
let weatherLocation = ("Viborg, Denmark"); // lokalitet som string
let weatherCoords = []; // lokalitet som koordinater
let importJson =  // hentet data i json format
{
  yr: null, // fra yr
  openWeather1Hour: null, // fra openweather (1/48 timer)
  openWeather3Hours: null, // fra openwather (3/120 timer)
  aerisWeather: null, // fra aerisweather (1/120 timer)
}
let data = // fortolket data fra json, hvert variabel er et array med forskellige kilder; [0]: yr, [1]: openweather, [2]: weatherbit, [3]: beregnet gennemsnit.
{
  location: weatherLocation, // lokalitet for vejret
  now: // vejret som det er lige nu.
  {
    time: [0, 0, 0, 0],
    temperature: [0, 0, 0, 0],
    pressure: [0, 0, 0, 0],
    cloudCover: [0, 0, 0, 0],
    precipitation: [0, 0, 0, 0],
    humidity: [0, 0, 0, 0],
    windSpeed: [0, 0, 0, 0],
    windDirection: [0, 0, 0, 0]
  },
  next48Hours: [], // vejret de næste 48 timer med mellemrum på 1 time.
  next5Days: []// vejret de næste 5 døgn (4 8-120 timer) med mellemrum på 6 timer.
}
let parsedData = 0; // antallet af json filer der er blevet behandlet
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
  for (let i = 0; i < 48; i++)
  {
    data.next48Hours[i] =
    {
      time: [0, 0, 0, 0],
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
  importJson.openWeather1Hour = null;
  importJson.openWeather3Hours = null;
  importJson.aerisWeather = null;
  parsedData = 0;
  updateWeatherCoords();
  setTimeout(function()
  {
    fetchYrWeather();
    fetchOpenWeather();
    fetchAerisWeather();
  }, 1000); //
}

function calculateAverages()
{
  if (parsedData != 4) break;

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
    line(50 + 90 * i, -data.next5Days[i].temperature[0] * 50 + 1300, 50 + 90 * (i + 1), -data.next5Days[i+1].temperature[0] * 50 + 1300);
    //line(50 + 90 * i, -data.next48Hours[i].temperature[0] * 80 + 1600, 50 + 90 * (i + 1), -data.next48Hours[i+1].temperature[0] * 80 + 1600);
    stroke(0,0,255);
    line(50 + 90 * i, -data.next5Days[i].temperature[1] * 50 + 1300, 50 + 90 * (i + 1), -data.next5Days[i+1].temperature[1] * 50 + 1300);
    //line(50 + 90 * i, -data.next48Hours[i].temperature[1] * 80 + 1600, 50 + 90 * (i + 1), -data.next48Hours[i+1].temperature[1] * 80 + 1600);
    stroke(0,255,0);
    line(50 + 90 * i, -data.next5Days[i].temperature[2] * 50 + 1300, 50 + 90 * (i + 1), -data.next5Days[i+1].temperature[2] * 50 + 1300);
    //line(50 + 90 * i, -data.next48Hours[i].temperature[2] * 80 + 1600, 50 + 90 * (i + 1), -data.next48Hours[i+1].temperature[2] * 80 + 1600);
  }

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
