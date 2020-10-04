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
    // temperatur graf // to do y akse skalering og placering
    this.g48h.fill(255,191,191);
    this.g48h.noStroke();
    this.g48h.beginShape();
    this.g48h.translate(100, 50);
    // polygon
    for (let i = 0; i < data.next48Hours.length; i++)
    {
      this.g48h.vertex(i * ((this.width - 200) / (data.next48Hours.length - 1)), -data.next48Hours[i].temperature[3][0] * 20 + 400);
    }
    for (let i = data.next48Hours.length - 1; i >= 0 ; i--)
    {
      this.g48h.vertex(i * ((this.width - 200) / (data.next48Hours.length - 1)), -data.next48Hours[i].temperature[3][2] * 20 + 400);
    }
    this.g48h.endShape();
    this.g48h.stroke(255,63,63);
    this.g48h.strokeWeight(4);
    // linje
    for (let i = 0; i < data.next48Hours.length - 1; i++)
    {
      this.g48h.line(
        0,
        -data.next48Hours[i].temperature[3][1] * 20 + 400,
        (this.width - 200) / (data.next48Hours.length - 1),
        -data.next48Hours[i+1].temperature[3][1] * 20 + 400
      );
      this.g48h.translate((this.width - 200) / (data.next48Hours.length - 1), 0);
    }
    this.g48h.translate(-100 - (this.width - 200), -50);
    // box
    this.g48h.noFill();
    this.g48h.stroke(color[3]);
    this.g48h.strokeWeight(5);
    this.g48h.rect(100, 50, this.width - 200, this.mainHeight - 100);
    // tick marks
    let tickSpacing = (this.mainHeight - 100) / ((maxGraphTemp - minGraphTemp) / 5);
    for (let i = 0; i < (maxGraphTemp - minGraphTemp) / 5; i++)
    {
      this.g48h.line(100, 50 + i * tickSpacing, 115, 50 + i * tickSpacing);
    }
    // tick mark units
    this.g48h.fill(color[2]);
    this.g48h.noStroke();
    this.g48h.textAlign(RIGHT, CENTER);
    this.g48h.textSize(36);
    for (let i = 0; i < (maxGraphTemp - minGraphTemp) / 5 + 1; i++)
    {
      this.g48h.text(maxGraphTemp - i * 5 + "°",90,54 + i * tickSpacing);
    }




    this.g48h.stroke(color[3]);
    this.g48h.noFill();





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
