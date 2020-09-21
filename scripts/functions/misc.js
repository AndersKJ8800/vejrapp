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
    for (let i = 0; i < 7; i++)
    {
      data.now[dataElements[i]][3][0] = Math.min(data.now[dataElements[i]][0], data.now[dataElements[i]][1], data.now[dataElements[i]][2]);
      data.now[dataElements[i]][3][2] = Math.max(data.now[dataElements[i]][0], data.now[dataElements[i]][1], data.now[dataElements[i]][2]);
      for (let j = 0; j < 48; j++)
      {
        data.next48Hours[j][dataElements[i]][3][0] = Math.min(data.next48Hours[j][dataElements[i]][0], data.next48Hours[j][dataElements[i]][1], data.next48Hours[j][dataElements[i]][2]);
        data.next48Hours[j][dataElements[i]][3][2] = Math.max(data.next48Hours[j][dataElements[i]][0], data.next48Hours[j][dataElements[i]][1], data.next48Hours[j][dataElements[i]][2]);
      }
      if (dataElements[i] != "pressure")
      {
        for (let j = 0; j < 21; j++)
        {
          data.next5Days[j][dataElements[i]][3][0] = Math.min(data.next5Days[j][dataElements[i]][0], data.next5Days[j][dataElements[i]][1], data.next5Days[j][dataElements[i]][2]);
          data.next5Days[j][dataElements[i]][3][2] = Math.max(data.next5Days[j][dataElements[i]][0], data.next5Days[j][dataElements[i]][1], data.next5Days[j][dataElements[i]][2]);
        }
      }
      for (let j = 0; j < 3; j++)
      {
        data.now[dataElements[i]][3][1] += data.now[dataElements[i]][j] / 3;
        for (let k = 0; k < 48; k++)
        {
          data.next48Hours[k][dataElements[i]][3][1] += data.next48Hours[k][dataElements[i]][j] / 3;
        }
        if (dataElements[i] != "pressure")
        {
          for (let k = 0; k < 21; k++)
          {
            data.next5Days[k][dataElements[i]][3][1] += data.next5Days[k][dataElements[i]][j] / 3;
          }
        }
      }
    }
  }
}

function mousePressed()
{
  let y = round((mouseY - (windowYDiff / 2)) / scaling);
  let x = round((mouseX - (windowXDiff / 2)) / scaling);
  let buttons = Object.values(button);
  for (let i = 0; i < buttons.length; i++)
  {
    if (x >= buttons[i].x && x <= buttons[i].x + buttons[i].width)
    {
      if (y >= buttons[i].y && y <= buttons[i].y + buttons[i].height)
      {
        for (let j = 0; j < buttons[i].activeWindow.length; j++)
        {
          if (activeWindow[buttons[i].activeWindow[j]])
          {
            buttons[i].update();
          }
        }
      }
    }
  }
}
