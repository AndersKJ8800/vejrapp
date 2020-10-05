class Graph
{
  constructor(width, mainHeight, subHeight)
  {
    this.width = width;
    this.mainHeight = mainHeight;
    this.subHeight = subHeight;
    this.g = createGraphics(this.width, this.mainHeight + this.subHeight);
    this.g.fill(color[1]);
    this.g.noStroke();
    this.g.rect(0, 0, this.g.width, this.g.height, 10);
    this.g48h = this.g;
    this.g5d = this.g;
    this.graphIsMade = false;
  }
  makeGraph(timePeriod)
  {
    let graphData = data[timePeriod];
    this.g = createGraphics(this.width, this.mainHeight + this.subHeight);
    this.g.fill(color[1]);
    this.g.noStroke();
    this.g.rect(0, 0, this.g.width, this.g.height, 10);
    let maxGraphTemp = 0;
    let minGraphTemp = 9999;
    for (let i = 0; i < graphData.length; i++)
    {
      if (maxGraphTemp < graphData[i].temperature[3][2])
      {
        maxGraphTemp = graphData[i].temperature[3][2] + 1;
      }
      if (minGraphTemp > graphData[i].temperature[3][0])
      {
        minGraphTemp = graphData[i].temperature[3][0] - 1;
      }
    }
    minGraphTemp = round(minGraphTemp / 5 - 0.5) * 5;
    maxGraphTemp = round(maxGraphTemp / 5 + 0.5) * 5;
    let tickSpacing = (this.mainHeight - 100) / ((maxGraphTemp - minGraphTemp) / 5);
    // temperatur graf // to do y akse skalering og placering
    this.g.fill(255,191,191);
    this.g.noStroke();
    this.g.beginShape();
    this.g.translate(100, 50);
    // polygon
    for (let i = 0; i < graphData.length; i++)
    {
      this.g.vertex(
        i * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphTemp - graphData[i].temperature[3][0]) * (tickSpacing / 5)
      );
    }
    for (let i = graphData.length - 1; i >= 0 ; i--)
    {
      this.g.vertex(
        i * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphTemp - graphData[i].temperature[3][2]) * (tickSpacing / 5)
      );
    }
    this.g.endShape();
    this.g.stroke(255,63,63);
    this.g.strokeWeight(4);
    // linje
    this.g.beginShape(LINES)
    for (let i = 0; i < graphData.length - 1; i++)
    {
      this.g.vertex(
        (this.width - 200) / (graphData.length - 1) * i,
        (maxGraphTemp - graphData[i].temperature[3][1]) * (tickSpacing / 5)
      );
      this.g.vertex(
        (this.width - 200) / (graphData.length - 1) * (i + 1),
        (maxGraphTemp - graphData[i+1].temperature[3][1]) * (tickSpacing / 5)
      );
    }
    this.g.endShape();
    this.g.translate(-100, -50);
    // box
    this.g.stroke(color[3]);
    this.g.noFill();
    this.g.strokeWeight(5);
    this.g.rect(100, 50, this.width - 200, this.mainHeight - 100);
    // tick marks (vandret)
    for (let i = 0; i < (maxGraphTemp - minGraphTemp) / 5; i++)
    {
      // linje
      this.g.strokeWeight(3);
      this.g.stroke(color[3], 127);
      this.g.line(100, 50 + i * tickSpacing, this.width - 100, 50 + i * tickSpacing);
      // tick
      this.g.strokeWeight(5);
      this.g.stroke(color[3]);
      this.g.line(100, 50 + i * tickSpacing, 115, 50 + i * tickSpacing);
    }
    // tick mark units
    this.g.fill(color[2]);
    this.g.noStroke();
    this.g.textAlign(RIGHT, CENTER);
    this.g.textSize(36);
    for (let i = 0; i < (maxGraphTemp - minGraphTemp) / 5 + 1; i++)
    {
      this.g.text(maxGraphTemp - i * 5 + "°",90,54 + i * tickSpacing);
    }
    // tick marks (lodret)
    this.g.push();
    this.g.translate(100, 50);
    for (let i = 0; i < graphData.length; i++)
    {
      let hour = parseInt(graphData[i].time[0].substring(11, 13));
      // timestamps
      if (hour % 3 == 0)
      {
        if (timePeriod == "next48Hours")
        {
          this.g.noStroke();
          this.g.fill(color[3]);
          this.g.textAlign(CENTER, TOP);
          this.g.text(hour, 0, this.mainHeight - 91);
        }
      }
      // linje
      if (hour % 6 == 0)
      {
        this.g.strokeWeight(3);
        this.g.stroke(color[3], 127);
        this.g.line(0, 0, 0, this.mainHeight - 100);
      }
      this.g.translate((this.width - 200) / (graphData.length - 1), 0);
    }
    this.g.pop();



    this.g.stroke(color[3]);
    this.g.noFill();





    this.g.rect(100, this.mainHeight, this.width - 200, this.subHeight - 50);

    // do tacks


    if (timePeriod == "next48Hours") this.g48h = this.g;
    if (timePeriod == "next5Days") this.g5d = this.g;

  }
  draw(yOffset)
  {
    if (parsedData == 4)
    {
      if (!this.graphIsMade)
      {
        this.makeGraph("next48Hours");
        this.makeGraph("next5Days");
        this.graphIsMade = true;
      }
    }
    else
    {
      this.graphIsMade = false;
    }

    if (parsedData == 4 && !this.graphIsMade)
    {
    }
    else
    {

    }

    return(this.g48h)
  }
}
