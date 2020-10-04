let weatherLocation = ("Viborg, Denmark"); // lokalitet som string
let weatherCoords = []; // lokalitet som koordinater
let importJson =  // hentet data i json format
{
  yr: null, // fra yr
  openWeather1Hour: null, // fra openweather (1/48 timer)
  openWeather3Hours: null, // fra openwather (3/120 timer)
  aerisWeather: null, // fra aerisweather (1/120 timer)
}
let dataElements = ["temperature", "pressure", "cloudCover", "precipitation", "humidity", "windSpeed", "windDirection"];
let data = // fortolket data fra json, hvert variabel er et array med forskellige kilder; [0]: yr, [1]: openweather, [2]: weatherbit, [3]: beregnet gennemsnit.
{
  location: weatherLocation, // lokalitet for vejret
  now: // vejret som det er lige nu.
  {
    isDay: null, // dag eller nat, bool
    symbol_code: [null, null, null], // kode for symbol
    time: [null, null, null], // tid for vejret
    temperature: [null, null, null, [null, null, null]],
    pressure: [null, null, null, [null, null, null]],
    cloudCover: [null, null, null, [null, null, null]],
    precipitation: [null, null, null, [null, null, null]],
    humidity: [null, null, null, [null, null, null]],
    windSpeed: [null, null, null, [null, null, null]],
    windDirection: [null, null, null, [null, null, null]]
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
let button =
{
  slideshowLeft: new Button("slideshowLeft", "<", 106, RES_Y / 1.8, 212, 960, ["mainMenu"]),
  slideshowRight: new Button("slideshowRight", ">", RES_X - 106, RES_Y / 1.8, 212, 960, ["mainMenu"])
}; // button objekter
let slideshow = {};
let currentSlideshowImage = 0;
let g; // grafik buffer hvor alt tegnes som tegnes til sidst i et frame
let activeWindow = // objekt der indikerer hvilke vinduer er aktive og kan interageres med
{
  mainMenu: true,
  weatherGraphs: false
}
let color = [0,255,null,null];
color[2] = (color[0] + color[1]) / 2;
color[3] = (color[2] + color[1]) / 2;

function setup()
{
  for (let i = 0; i < 48; i++)
  {
    data.next48Hours[i] =
    {
      isDay: null,
      symbol_code: [null, null, null],
      time: [null, null, null],
      temperature: [null, null, null, [null, null, null]],
      pressure: [null, null, null, [null, null, null]],
      cloudCover: [null, null, null, [null, null, null]],
      precipitation: [null, null, null, [null, null, null]],
      humidity: [null, null, null, [null, null, null]],
      windSpeed: [null, null, null, [null, null, null]],
      windDirection: [null, null, null, [null, null, null]]
    };
  }
  for (let i = 0; i < 21; i++)
  {
    data.next5Days[i] =
    {
      isDay: null,
      symbol_code: [null, null, null],
      time: [null, null, null],
      temperature: [null, null, null, [null, null, null]],
      cloudCover: [null, null, null, [null, null, null]],
      precipitation: [null, null, null, [null, null, null]],
      humidity: [null, null, null, [null, null, null]],
      windSpeed: [null, null, null, [null, null, null]],
      windDirection: [null, null, null, [null, null, null]]
    }
  }
  angleMode(DEGREES);
  updateLocation(weatherLocation);
  createCanvas(1,1);
  windowResized();
  g = createGraphics(RES_X, RES_Y);
  slideshow =
  [
    new SlideshowImage("faldskærmsudspring"),
    new SlideshowImage("flyvning"),
    new SlideshowImage("roning"),
    new SlideshowImage("løb"),
    new SlideshowImage("mountainbiking"),
    new SlideshowImage("sejlads"),
    new SlideshowImage("vandring")
  ];
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

  drawSlideshow();

  if (activeWindow.mainMenu)
  {
    button["slideshowLeft"].draw();
    button["slideshowRight"].draw();
    g.noStroke();
    for (let i = 0; i < slideshow.length; i++)
    {
      g.fill(color[1]);
      g.circle(RES_X / 2 - 3 * 45 + i * 45, RES_Y / 1.08, 20);
      if (i == currentSlideshowImage)
      {
        g.fill(color[0] + abs(slideshowImageOffset / (RES_X / 0.85)) * (color[1] - color[0]));
        g.circle(RES_X / 2 - 3 * 45 + i * 45, RES_Y / 1.08, 13);
      }
    }

  }



  image(g,0,0);

  /*{
    let no = 0
    strokeWeight(2);
    for (let i = 0; i < data.next48Hours.length - 1; i++)
    {
      translate(50,0);
      noStroke();
      fill(255);
      quad(
        (i) * 35, data.next48Hours[i][dataElements[no]][3][0] * 20,
        (i) * 35, data.next48Hours[i][dataElements[no]][3][2] * 20,
        (i+1) * 35, data.next48Hours[i+1][dataElements[no]][3][2] * 20,
        (i+1) * 35, data.next48Hours[i+1][dataElements[no]][3][0] * 20,
      );
      stroke(0);
      line(i * 35, data.next48Hours[i][dataElements[no]][3][1] * 20, (i+1) * 35, data.next48Hours[i+1][dataElements[no]][3][1] * 20);
      stroke(255,0,0);
      line(i * 35, data.next48Hours[i][dataElements[no]][0] * 20, (i+1) * 35, data.next48Hours[i+1][dataElements[no]][0] * 20);
      stroke(0,255,0);
      line(i * 35, data.next48Hours[i][dataElements[no]][1] * 20, (i+1) * 35, data.next48Hours[i+1][dataElements[no]][1] * 20);
      stroke(0,0,255);
      line(i * 35, data.next48Hours[i][dataElements[no]][2] * 20, (i+1) * 35, data.next48Hours[i+1][dataElements[no]][2] * 20);

      translate(-50,0);
    }
  }*/
}
