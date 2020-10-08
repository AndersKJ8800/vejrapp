class Graph
{
  constructor(width, height)
  {
    this.width = width;
    this.height = height;
    this.g = createGraphics(this.width, this.height);
    this.g48h = this.g;
    this.g5d = this.g;
    this.graphIsMade = false;
    this.graphDataLength = 0;
  }
  makeGraph(timePeriod)
  {
    let graphData = data[timePeriod];
    if (timePeriod == "next5Days") graphData.length = 19;
    if (timePeriod == "next48Hours") graphData.length = 46;
    graphData.start = 0;
    if (timePeriod == "next5Days") graphData.start = 1;
    if (timePeriod == "next48Hours") graphData.length = 46;
    this.g = createGraphics(this.width, this.height);
    let maxGraphPrecip = 8;
    let maxGraphTemp = -9999;
    let minGraphTemp = 9999;
    for (let i = graphData.start; i < graphData.length; i++)
    {
      if (maxGraphPrecip < graphData[i].precipitation[3][2])
      {
        maxGraphPrecip = graphData[i].precipitation[3][2];
      }
      if (maxGraphTemp < graphData[i].temperature[3][2])
      {
        maxGraphTemp = graphData[i].temperature[3][2] + 5;
      }
      if (minGraphTemp > graphData[i].temperature[3][0])
      {
        minGraphTemp = graphData[i].temperature[3][0] - 1;
      }
    }
    maxGraphPrecip = round(maxGraphPrecip / 2 + 0.499) * 2;
    maxGraphTemp = round(maxGraphTemp / 5 + 0.499) * 5;
    minGraphTemp = round(minGraphTemp / 5 - 0.5) * 5;
    let tempTickSpacing = (this.height - 100) / ((maxGraphTemp - minGraphTemp) / 5);
    let precipTickSpacing = (this.height - 100) / maxGraphPrecip;

    // temperatur og nedbør graf
    this.g.translate(100, 50);
    // polygon, nedbør
    this.g.push();
    this.g.scale(1 - graphData.start / (graphData.length - 1), 1);
    this.g.fill(63, 63, 127);
    this.g.noStroke();
    this.g.rectMode(CORNERS);
    for (let i = graphData.start; i < graphData.length - 1; i++)
    {
      this.g.rect(
        (i - graphData.start) * ((this.width - 200) / (graphData.length - 1 - graphData.start)) + 5,
        318,
        ((i + 1) - graphData.start) * ((this.width - 200) / (graphData.length - 1 - graphData.start)) - 5,
        318 - graphData[i].precipitation[3][1] * precipTickSpacing
      );
    }
    this.g.pop();

    // polygon, temp
    this.g.fill(255,0,0,50);
    this.g.noStroke();
    this.g.beginShape();
    this.g.push();
    this.g.scale(1 + graphData.start / (graphData.length - 1), 1);
    for (let i = graphData.start; i < graphData.length; i++)
    {
      this.g.vertex(
        (i - graphData.start) * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphTemp - graphData[i].temperature[3][0]) * (tempTickSpacing / 5)
      );
    }
    for (let i = graphData.length - 1; i >= graphData.start ; i--)
    {
      this.g.vertex(
        (i - graphData.start) * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphTemp - graphData[i].temperature[3][2]) * (tempTickSpacing / 5)
      );
    }
    this.g.endShape();
    this.g.stroke(255,63,63);
    this.g.strokeWeight(4);
    // linje, temp
    this.g.beginShape(LINES)
    for (let i = graphData.start; i < graphData.length - 1; i++)
    {
      this.g.vertex(
        (this.width - 200) / (graphData.length - 1) * (i - graphData.start),
        (maxGraphTemp - graphData[i].temperature[3][1]) * (tempTickSpacing / 5)
      );
      this.g.vertex(
        (this.width - 200) / (graphData.length - 1) * ((i - graphData.start) + 1),
        (maxGraphTemp - graphData[i+1].temperature[3][1]) * (tempTickSpacing / 5)
      );
    }
    this.g.endShape();
    this.g.pop();
    this.g.translate(-100, -50);
    // box
    this.g.stroke(color[3]);
    this.g.noFill();
    this.g.strokeWeight(5);
    this.g.rect(100, 50, this.width - 200, this.height - 100);
    // tick marks (vandret)
    for (let i = graphData.start; i < (maxGraphTemp - minGraphTemp) / 5; i++)
    {
      // linje
      this.g.strokeWeight(3);
      this.g.stroke(color[3], 127);
      this.g.line(100, 50 + i * tempTickSpacing, this.width - 100, 50 + i * tempTickSpacing);
      // tick
      this.g.strokeWeight(5);
      this.g.stroke(color[3]);
      this.g.line(100, 50 + i * tempTickSpacing, 115, 50 + i * tempTickSpacing);
    }
    // tick mark units (temperatur)
    this.g.fill(color[2]);
    this.g.noStroke();
    this.g.textAlign(RIGHT, CENTER);
    this.g.textSize(36);
    for (let i = 0; i < (maxGraphTemp - minGraphTemp) / 5 + 1; i++)
    {
      this.g.text(maxGraphTemp - i * 5 + "°",90,54 + i * tempTickSpacing);
    }
    // nedbør
    this.g.textAlign(LEFT, CENTER);
    for (let i = 0; i < maxGraphPrecip + 1; i += 2)
    {
      this.g.textSize(30);
      this.g.text(maxGraphPrecip - i, this.width - 90, 51 + i * precipTickSpacing);
      this.g.textSize(20);
      this.g.text("mm", this.width - 68, 54 + i * precipTickSpacing);
    }
    // tick marks (lodret) og vejr-ikoner
    this.g.push();
    this.g.translate(100, 50);
    let gS = createGraphics(this.width - 204, this.height - 100); // grafik, symboler
    for (let i = graphData.start; i < graphData.length; i++)
    {
      let hour = parseInt(graphData[i].time[0].substring(11, 13));
      let day = parseInt(graphData[i].time[0].substring(8, 10));
      let month = parseInt(graphData[i].time[0].substring(5, 7));
      if (hour % 6 == 0 && i != graphData.start)
      {
        // linje
        if (hour == 0) this.g.stroke(color[2], 180);
        else this.g.stroke(color[3], 127);
        this.g.strokeWeight(3);
        this.g.line(0, 0, 0, this.height - 100);
        // timestamps
        this.g.noStroke();
        this.g.fill((color[2] + color[3]) / 2);
        if (timePeriod == "next48Hours")
        {
          this.g.textAlign(CENTER, TOP);
          this.g.text(hour, 0, this.height - 91);
        }
        else
        {
          if (hour == 0)
          {
            this.g.textAlign(LEFT, TOP);
            this.g.text(day + " / " + month, 0, this.height - 91);
          }
        }
      }
      // vejr-ikoner
      if (hour % 3 == 0 && i < graphData.length - 1 && i > 0)
      {
        gS.scale(1/2, 1/2);
        gS.image(
          weatherIcons[graphData[i].symbol_code[0]],
          -50,
          (maxGraphTemp - (graphData[i].temperature[3][2] + graphData[i].temperature[3][1]) / 2) * (tempTickSpacing / 5) * 2 - 30
        );
        gS.scale(2, 2);
      }
      gS.translate((this.width - 200) / (graphData.length - 1), 0);
      this.g.translate((this.width - 200) / (graphData.length - 1), 0);
    }
    this.g.pop();
    this.g.image(gS,102,0);



    this.g.stroke(color[3]);
    this.g.noFill();

    return this.g;
  }
  draw()
  {
    if (parsedData == 4)
    {
      if (!this.graphIsMade)
      {
        this.g48h = this.makeGraph("next48Hours");
        this.g5d = this.makeGraph("next5Days");
        this.graphIsMade = true;
      }
    }
    else
    {
      this.graphIsMade = false;
    }

  }
}
