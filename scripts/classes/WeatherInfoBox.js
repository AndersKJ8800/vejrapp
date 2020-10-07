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
    this.uW.width = RES_X * 11 / 16 - RES_X / 9;
    this.uW.graph = new Graph(this.uW.width, 420);
    this.uW.subGraph = new SubGraph(this.uW.width, 196);
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
    g.fill(color[1]);
    g.rect(RES_X / 3.2, RES_Y + yOffset * 1.135, this.uW.width, 640, 10);
    g.image(this.uW.graph.draw(), RES_X / 3.2, RES_Y + yOffset * 1.135);
  }
}
