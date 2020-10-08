class WeatherInfoBox
{
  constructor(array)
  {
    this.showSubGraph = array[0];
    this.showWindDirection = array[1];
    this.tables = array[2];
    this.height = RES_Y / 1.5;
    this.showWeatherNow = true;
    this.dW = {};
    this.dW = createGraphics(320, this.height); // detailedWeather
    this.dW.dataSet = "now";
    this.dW.dataSetN = 0;
    this.dW.timeAndDate = "";
    this.uW = {}; // upcomingWeather
    this.uW.width = round(RES_X * 11 / 16 - RES_X / 9);
    this.uW.graph = new Graph(this.uW.width, 420);
    this.uW.subGraph = new SubGraph(this.uW.width, 196);
  }
  draw(yOffset)
  {
    g.fill(color[1]);
    g.rect(RES_X / 3.2, RES_Y + yOffset * 1.135, this.uW.width, 640, 10);
    {
      g.push();
      g.fill(0,30);
      g.translate(99,49);
      g.translate(RES_X / 3.2, RES_Y + yOffset * 1.135);
      g.rectMode(CORNERS);
      let l = 0;
      if (currentDataSet == "next48Hours") l = 45;
      else l = 18;
      mouseOverDataN = round(((mouseX - (windowXDiff / 2)) / scaling - 700) / 905 * l + 0.5);
      if (mouseOverDataN <= 0 || mouseOverDataN > l) mouseOverDataN = false;
      let y = (mouseY - (windowYDiff / 2)) / scaling;
      if (y < 260 || y > 815) mouseOverDataN = false;
      if (mouseOverDataN !== false && parsedData == 4)
      {
        g.rect(
          ((mouseOverDataN - 1) / l) * (this.uW.graph.width - 200),
          0,
          (mouseOverDataN / l) * (this.uW.graph.width - 200),
          this.uW.graph.height - 100
        );
        g.rect(
          ((mouseOverDataN - 1) / l) * (this.uW.graph.width - 200),
          403,
          (mouseOverDataN / l) * (this.uW.graph.width - 200),
          357 + this.uW.subGraph.height
        );
      }
      g.pop();
    }
    this.uW.graph.draw();
    this.uW.subGraph.draw();
    if (parsedData == 4)
    {
      if (currentDataSet == "next48Hours") g.image(this.uW.graph.g48h, RES_X / 3.2, RES_Y + yOffset * 1.135);
      else g.image(this.uW.graph.g5d, RES_X / 3.2, RES_Y + yOffset * 1.135);
      if (currentDataSet == "next48Hours") g.image(this.uW.subGraph.g48h, RES_X / 3.2, RES_Y + yOffset * 1.135 + 429);
      else g.image(this.uW.subGraph.g5d, RES_X / 3.2, RES_Y + yOffset * 1.135 + 429);
    }

    this.dW.fill(color[1]);
    this.dW.noStroke();
    this.dW.rect(0, 0, this.dW.width, this.dW.height, 15);
    this.dW.textAlign(CENTER, TOP);
    this.dW.translate(this.dW.width / 2, 0);
    this.dW.fill(color[2]);
    this.dW.textSize(30);
    this.dW.dataSetN = mouseOverDataN;

    let dataSet;
    if (mouseOverDataN === false)
    {
      dataSet = data.now;
    }
    else
    {
      if (currentDataSet == "next48Hours") dataSet = data[currentDataSet][mouseOverDataN - 1];
      else  dataSet = data[currentDataSet][mouseOverDataN];

    }
    if (parsedData == 4)
    {
      this.dW.push();
      this.updateHighlight(dataSet, 42069);
      this.dW.text(this.dW.timeAndDate, 0, 210);
      this.dW.text(formattedWeatherLocation, 0, 70);
      this.dW.textSize(100);
      this.dW.text(round(dataSet.temperature[3][1]) + "°", 10, 110);
      this.dW.textAlign(LEFT, TOP);
      this.dW.textSize(50);
      let mm = round(dataSet.precipitation[3][1], 1).toString();
      if (mm.includes(".")) mm = mm.replace(".", ",");
      else mm = mm + ",0";
      this.dW.translate(-50, 270);
      this.dW.text(mm + " mm", 0, 0);
      this.dW.image(miscIcons.precipitation, -54, 0);
      let spacing = 80;
      if (this.tables[0] == "luftfugtighed" || this.tables[1] == "luftfugtighed")
      {
        this.dW.translate(0, spacing);
        this.dW.image(miscIcons.humidity, -55, 0);
        this.dW.text(round(dataSet.humidity[3][1]) + " %", 0, 0);
      }
      if (this.tables[0] == "skydække" || this.tables[1] == "skydække")
      {
        this.dW.translate(0, spacing);
        this.dW.image(miscIcons.cloudCover, -55, 0);
        this.dW.text(round(dataSet.cloudCover[3][1]) + " %", 0, 0);
      }
      if (this.showSubGraph)
      {
        this.dW.translate(0, spacing);
        this.dW.image(miscIcons.windSpeed, -55, 0);
        this.dW.text(round(dataSet.windSpeed[3][1]) + " m/s", 0, 0);
      }
      if (this.showWindDirection)
      {
        this.dW.translate(0, spacing);
        this.dW.push();
        this.dW.translate(-32,22.5);
        this.dW.angleMode(DEGREES);
        this.dW.rotate(round(dataSet.windDirection[3][1]));
        this.dW.imageMode(CENTER);
        this.dW.image(miscIcons.windDirection, 0, 0);
        this.dW.pop();
        this.dW.text(round(dataSet.windDirection[3][1]) + "°", 0, 0);
      }


      this.dW.pop();
    }
    this.dW.translate(-this.dW.width / 2, 0);

    g.image(this.dW,RES_X / 9,RES_Y + yOffset * 1.135);


  }

  updateHighlight(dataSet, n)
  {
    if (mouseOverDataN === false)
    {
      this.dW.timeAndDate = "vejret nu";
    }
    else
    {
      this.dW.textSize
      let time = dataSet.time[0].substring(11, 16);
      let date = dataSet.time[0].substring(8, 10) + "/" + dataSet.time[0].substring(5, 7);
      this.dW.timeAndDate = time + " " + date;
    }
  }
}
