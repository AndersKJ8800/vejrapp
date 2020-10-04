class Graph
{
  constructor(width, mainHeight, subHeight)
  {
    this.g48h = createGraphics(width, mainHeight + subHeight);
    this.g48h.noStroke();
    this.g48h.fill(color[1]);
    this.g48h.rect(0, 0, this.g48h.width, this.g48h.height, 10);
    this.graphIsMade = false;
    this.mainHeight = mainHeight;
    this.subHeight = subHeight;
    this.width = width;

  }
  makeGraph()
  {
    this.graphIsMade = true;
    let maxGraphTemp = 0;
    let minGraphTemp = 9999;
    for (let i = 0; i < data.next48Hours.length; i++)
    {
      if (maxGraphTemp < data.next48Hours[i].temperature[3][2])
      {
        maxGraphTemp = data.next48Hours[i].temperature[3][2];
      }
      if (minGraphTemp > data.next48Hours[i].temperature[3][0])
      {
        minGraphTemp = data.next48Hours[i].temperature[3][0];
      }
    }
    minGraphTemp = round(minGraphTemp / 5 - 0.5) * 5;
    maxGraphTemp = round(maxGraphTemp / 5 + 0.5) * 5;
    this.g48h.stroke(color[3]);
    this.g48h.strokeWeight(5);
    this.g48h.rect(100, 50, this.width - 200, this.mainHeight - 100);
    //this.g48h.line(100, this.mainHeight - 50, this.width - 100, this.mainHeight - 50);
    for (let i = 0; i < (maxGraphTemp - minGraphTemp) / 5; i++)
    {
      let spacing = (this.mainHeight - 100) / ((maxGraphTemp - minGraphTemp) / 5);
      this.g48h.line(100, 50 + i * spacing, 115, 50 + i * spacing);
    }

    this.g48h.rect(100, this.mainHeight, this.width - 200, this.subHeight - 50);

    // do tacks



  }
  draw(yOffset)
  {
    if (parsedData == 4 && !this.graphIsMade)
    {
      this.makeGraph();
    }

    return(this.g48h)
  }
}
