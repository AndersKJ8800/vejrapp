class SubGraph
{
  constructor(width, height)
  {
    this.width = width;
    this.height = height;
    this.g = createGraphics(width, height)
    this.g48h = g;
    this.g120h = g;
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
    let maxGraphSpeed = 6;
    let minGraphSpeed = 0;
    for (let i = 0; i < graphData.length; i++)
    {
      if (maxGraphSpeed < graphData[i].windSpeed[3][2])
      {
        maxGraphSpeed = graphData[i].windSpeed[3][2];
      }
    }
    maxGraphSpeed = round(maxGraphSpeed / 2 + 0.499) * 2;
    let speedTickSpacing = (this.height - 50) / ((maxGraphSpeed) / 2);

    //polygon, vindhastighed
    this.g.fill(0,50);
    this.g.noStroke();
    this.g.beginShape();
    this.g.push();
    this.g.scale(1 + graphData.start / (graphData.length - 1), 1);
    this.g.translate(100,0);
    for (let i = graphData.start; i < graphData.length; i++)
    {
      this.g.vertex(
        (i - graphData.start) * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphSpeed - graphData[i].windSpeed[3][0]) * (speedTickSpacing / 2) + 25
      );
    }
    for (let i = graphData.length - 1; i >= graphData.start ; i--)
    {
      this.g.vertex(
        (i - graphData.start) * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphSpeed - graphData[i].windSpeed[3][2]) * (speedTickSpacing / 2) + 25
      );
    }
    this.g.endShape();
    // linje, vindhastighed
    this.g.stroke(127);
    this.g.strokeWeight(4);
    this.g.beginShape(LINES)
    for (let i = graphData.start; i < graphData.length - 1; i++)
    {
      this.g.vertex(
        (i - graphData.start) * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphSpeed - graphData[i].windSpeed[3][1]) * (speedTickSpacing / 2) + 25
      );
      this.g.vertex(
        (i - graphData.start + 1) * ((this.width - 200) / (graphData.length - 1)),
        (maxGraphSpeed - graphData[i+1].windSpeed[3][1]) * (speedTickSpacing / 2) + 25
      );
    }
    this.g.endShape();
    this.g.pop();

    //tick marks (vandret)
    for (let i = graphData.start; i < maxGraphSpeed / 2; i++)
    {
      // linje
      this.g.strokeWeight(3);
      this.g.stroke(color[3], 127);
      this.g.line(100, 50 + i * speedTickSpacing, this.width - 100, 50 + i * speedTickSpacing);
      //tick
      this.g.strokeWeight(5);
      this.g.stroke(color[3]);
      this.g.line(100, 50 + i * speedTickSpacing, 115, 50 + i * speedTickSpacing);
    }
    // tick mark units
    this.g.fill(color[2]);
    this.g.noStroke();
    this.g.textAlign(RIGHT, CENTER);
    for (let i = 0; i < maxGraphSpeed / 2 + 1; i++)
    {
      this.g.textSize(24);
      this.g.text(maxGraphSpeed - i * 2,60,50 + (i-1) * speedTickSpacing);
      this.g.textSize(16);
      this.g.text("m/s",90,52 + (i-1) * speedTickSpacing);
    }




    // box
    this.g.stroke(color[3]);
    this.g.noFill();
    this.g.strokeWeight(5);
    this.g.rect(100, 25, this.width - 200, this.height - 50);

    //this.g.background(0,25); // delet





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
