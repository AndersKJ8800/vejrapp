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
    print(maxGraphSpeed);



    this.g.background(0,25); // delet





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
