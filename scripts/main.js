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
    isDay: null,
    symbol_code: [null, null, null, null],
    time: [null, null, null, null],
    temperature: [null, null, null, null],
    pressure: [null, null, null, null],
    cloudCover: [null, null, null, null],
    precipitation: [null, null, null, null],
    humidity: [null, null, null, null],
    windSpeed: [null, null, null, null],
    windDirection: [null, null, null, null]
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
  parsedData++;
  if (parsedData == 4)
  {
    // definerer indeks 3 til gennemsnittet af 0, 1 og 2 ved først at lægge dem til under et loop og derefter dividere med 3
    for (let i = 0; i < 3; i++)
    {
      data.now.temperature[3] += data.now.temperature[i];
      data.now.pressure[3] += data.now.pressure[i];
      data.now.cloudCover[3] += data.now.cloudCover[i];
      data.now.precipitation[3] += data.now.precipitation[i];
      data.now.humidity[3] += data.now.humidity[i];
      data.now.windSpeed[3] += data.now.windSpeed[i];
      data.now.windDirection [3] += data.now.windDirection[i];
      for (let j = 0; j < data.next48Hours.length; j++)
      {
        data.next48Hours[j].temperature[3] += data.next48Hours[j].temperature[i];
        data.next48Hours[j].pressure[3] += data.next48Hours[j].pressure[i];
        data.next48Hours[j].cloudCover[3] += data.next48Hours[j].cloudCover[i];
        data.next48Hours[j].precipitation[3] += data.next48Hours[j].precipitation[i];
        data.next48Hours[j].humidity[3] += data.next48Hours[j].humidity[i];
        data.next48Hours[j].windSpeed[3] += data.next48Hours[j].windSpeed[i];
        data.next48Hours[j].windDirection [3] += data.next48Hours[j].windDirection[i];
      }
      for (let j = 0; j < data.next5Days.length; j++)
      {
        data.next5Days[j].temperature[3] += data.next5Days[j].temperature[i];
        data.next5Days[j].cloudCover[3] += data.next5Days[j].cloudCover[i];
        data.next5Days[j].precipitation[3] += data.next5Days[j].precipitation[i];
        data.next5Days[j].humidity[3] += data.next5Days[j].humidity[i];
        data.next5Days[j].windSpeed[3] += data.next5Days[j].windSpeed[i];
        data.next5Days[j].windDirection [3] += data.next5Days[j].windDirection[i];
      }
    }
    data.now.temperature[3] = round(data.now.temperature[3] / 3, 1);
    data.now.pressure[3] = round(data.now.pressure[3] / 2, 1);
    data.now.cloudCover[3] = round(data.now.cloudCover[3] / 3, 1);
    data.now.precipitation[3] = round(data.now.precipitation[3] / 3, 1);
    data.now.humidity[3] = round(data.now.humidity[3] / 3, 1);
    data.now.windSpeed[3] = round(data.now.windSpeed[3] / 3, 1);
    data.now.windDirection[3] = round(data.now.windDirection[3] / 3, 1);
    for (let i = 0; i < data.next48Hours.length; i++)
    {
      data.next48Hours[i].temperature[3] = round(data.next48Hours[i].temperature[3] / 3, 1);
      data.next48Hours[i].pressure[3] = round(data.next48Hours[i].pressure[3] / 2, 1);
      data.next48Hours[i].cloudCover[3] = round(data.next48Hours[i].cloudCover[3] / 3, 1);
      data.next48Hours[i].precipitation[3] = round(data.next48Hours[i].precipitation[3] / 3, 1);
      data.next48Hours[i].humidity[3] = round(data.next48Hours[i].humidity[3] / 3, 1);
      data.next48Hours[i].windSpeed[3] = round(data.next48Hours[i].windSpeed[3] / 3, 1);
      data.next48Hours[i].windDirection[3] = round(data.next48Hours[i].windDirection[3] / 3, 1);
    }
    for (let i = 0; i < data.next5Days.length; i++)
    {
      data.next5Days[i].temperature[3] = round(data.next5Days[i].temperature[3] / 3, 1);
      data.next5Days[i].cloudCover[3] = round(data.next5Days[i].cloudCover[3] / 3, 1);
      data.next5Days[i].precipitation[3] = round(data.next5Days[i].precipitation[3] / 3, 1);
      data.next5Days[i].humidity[3] = round(data.next5Days[i].humidity[3] / 3, 1);
      data.next5Days[i].windSpeed[3] = round(data.next5Days[i].windSpeed[3] / 3, 1);
      data.next5Days[i].windDirection[3] = round(data.next5Days[i].windDirection[3] / 3, 1);
    }
  }
}

function setup()
{
  for (let i = 0; i < 48; i++)
  {
    data.next48Hours[i] =
    {
      isDay: null,
      symbol_code: [null, null, null, null],
      time: [null, null, null, null],
      temperature: [null, null, null, null],
      pressure: [null, null, null, null],
      cloudCover: [null, null, null, null],
      precipitation: [null, null, null, null],
      humidity: [null, null, null, null],
      windSpeed: [null, null, null, null],
      windDirection: [null, null, null, null]
    };
  }
  for (let i = 0; i < 21; i++)
  {
    data.next5Days[i] =
    {
      isDay: null,
      symbol_code: [null, null, null, null],
      time: [null, null, null, null],
      temperature: [null, null, null, null],
      cloudCover: [null, null, null, null],
      precipitation: [null, null, null, null],
      humidity: [null, null, null, null],
      windSpeed: [null, null, null, null],
      windDirection: [null, null, null, null]
    }
  }
  updateLocation(weatherLocation);
  createCanvas(1,1);
  windowResized();
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
  for (let i = 0; i < data.next48Hours.length-2; i++)
  {
    stroke(255,0,0);
    line(50 + 39 * i, -data.next48Hours[i].temperature[0] * 50 + 1100, 50 + 39 * (i + 1), -data.next48Hours[i+1].temperature[0] * 50 + 1100);

    try
    {
      if (data.next48Hours[i].symbol_code.typeof != "undefined")
      {
        translate(50,0);
        scale(0.5);
        image(weatherIcons[data.next48Hours[i].symbol_code[0]], 78 * i, 100);
        scale(2);
        translate(-50,0);
      }
    }
    catch (expression) {}
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
