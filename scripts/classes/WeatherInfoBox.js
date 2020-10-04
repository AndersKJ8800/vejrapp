class WeatherInfoBox
{
  constructor(array)
  {
    this.showSubGraph = array[0];
    this.showWindDirection = array[1];
    this.tables = array[2];
    this.height = RES_Y / 1.5;
    this.showWeatherNow = true;
    this.dW = createGraphics(RES_X / 6, this.height); // detailedWeather
    this.uW = {}; // upcomingWeather
    { // højder
      let hMainGraph = 0;
      let hSubGraph = 0;
      let hTablesGraph = 0;
      this.uW.width = RES_X * 11 / 16 - RES_X / 9;
      if (this.showSubGraph)
      {
        if (this.tables.length == 2)
        {
          hMainGraph = 308;
          hSubGraph = 128;
          hTablesGraph = 180;
        }
        else
        {
          hMainGraph = 348;
          hSubGraph = 148;
          hTablesGraph = 120;
        }
      }
      else
      {
        hMainGraph = 406;
        hSubGraph = 0;
        hTablesGraph = 210;
      }
      this.uW.graph = new Graph(this.uW.width, hMainGraph, hSubGraph);
      this.uW.tables = new TablesGraph(this.uW.width, hTablesGraph);
    }
  }
  draw(yOffset)
  {
    this.dW.fill(color[1]);
    this.dW.rect(0, 0, this.dW.width, this.dW.height, 15);
    this.dW.noStroke();
    this.dW.textAlign(CENTER, TOP);
    this.dW.translate(this.dW.width / 2, 0);
    this.dW.textSize(30);
    this.dW.text("vejret nu", 0, 20);
    this.dW.textSize(100);
    this.dW.fill(color[2]);
    this.dW.text(" 15°", 0, 100);
    this.dW.translate(-this.dW.width / 2, 0);
    g.image(this.dW,RES_X / 9,RES_Y + yOffset * 1.135);
    g.image(this.uW.graph.draw(), RES_X / 3.2, RES_Y + yOffset * 1.135);
  }
}
