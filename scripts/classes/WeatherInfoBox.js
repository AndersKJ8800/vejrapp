let weatherPriorities =
{
  faldskærmsudspring: [],
  flyvning: [],
  roning: [],
  løb: [],
  mountainbiking: [],
  sejlads: [],
  vandring: []
}

class WeatherInfoBox
{
  constructor(temperaturePriority, windSpeedPriority, precipitationPriority, cloudCoverPriority, windDirectionPriority, humidityPriority, pressurePriority)
  {
    this.temperaturePriority = temperaturePriority;
    this.windSpeedPriority = windSpeedPriority;
    this.precipitationPriority = precipitationPriority;
    this.windDirectionPriority = windDirectionPriority;
    this.cloudCoverPriority = cloudCoverPriority;
    this.humidityPriority = humidityPriority;
    this.pressurePriority = pressurePriority;
    this.showWeatherNow = true;
    this.dW = createGraphics(RES_X / 6, RES_Y / 1.5); // detailedWeather
    this.h48 = createGraphics(RES_X * 11 / 16 - RES_X / 9, RES_Y / 1.5); // graf, 48 timer
    this.h120 = createGraphics(RES_X * 11 / 16 - RES_X / 9, RES_Y / 1.5); // graf, 120 timer
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





    this.h48.background(0,255,0);
    g.image(this.h48,RES_X / 3.2,RES_Y + yOffset * 1.135);
  }
}
