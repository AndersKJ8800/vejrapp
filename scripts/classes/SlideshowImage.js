let noOfSlideshowImages = 0;
let slideshowImageOffset = 0;
let slideshowImageOffsetTime = 1000;
let initialOffset = 0;
let slideshowScrollingDirection = 1;
let slideshowButtonText = [];
let weatherFeatures = // vis subgraf (bool), vis vindretning (bool), tabeller som skal vises i rækkefølge (array)
{
  faldskærmsudspring: [true, true, ["skydække"]],
  flyvning: [true, true, ["skydække"]],
  roning: [true, false, ["skydække"]],
  løb: [true, false, ["skydække", "luftfugtighed"]],
  mountainbiking: [false, null, ["skydække", "luftfugtighed"]],
  sejlads: [true, true, ["skydække"]],
  vandring: [true, false, ["skydække", "luftfugtighed"]]
}

class SlideshowImage
{
  constructor(activityType)
  {
    this.no = noOfSlideshowImages;
    noOfSlideshowImages++;
    this.image = backgroundImages[activityType];
    this.activityType = activityType;
    textSize(56);
    button["slideshowImage" + this.activityType] = new Button("start" + activityType, this.activityType, RES_X / 2, RES_Y / 1.25, textWidth(this.activityType) + 70, 120, ["mainMenu"]);
    this.weatherInfoBox = new WeatherInfoBox(weatherFeatures[this.activityType]);
  }
  draw()
  {
    g.translate((this.no - currentSlideshowImage) * RES_X + slideshowImageOffset * slideshowScrollingDirection, 0);
    g.image(this.image, 0, 0);
    button["slideshowImage" + this.activityType].draw();
    this.weatherInfoBox.draw(button["slideshowImage" + this.activityType].yOffset);
    g.translate(-((this.no - currentSlideshowImage) * RES_X + slideshowImageOffset * slideshowScrollingDirection), 0);

    g.translate((this.no - currentSlideshowImage - noOfSlideshowImages) * RES_X + slideshowImageOffset * slideshowScrollingDirection, 0);
    g.image(this.image, 0, 0);

    g.translate(-((this.no - currentSlideshowImage - noOfSlideshowImages) * RES_X + slideshowImageOffset * slideshowScrollingDirection), 0);

    if (activeWindow.weatherGraphs)
    {
      if (abs(button["slideshowImage" + this.activityType].yOffset) < 660)
      {
        button["slideshowImage" + this.activityType].yOffset -= 30;
      }
    }
    else
    {
      if (abs(button["slideshowImage" + this.activityType].yOffset) > 0)
      {
        button["slideshowImage" + this.activityType].yOffset += 30;
      }
    }
  }
}

function changeSlideshowNo(delta)
{
  if (delta === -1 || delta === 1)
  {
    if (delta > 0)
    {
      slideshowScrollingDirection = 1;
    }
    else
    {
      slideshowScrollingDirection = -1;
    }
    currentSlideshowImage += delta;
    if (currentSlideshowImage < 0) currentSlideshowImage = noOfSlideshowImages - 1;
    if (currentSlideshowImage > noOfSlideshowImages - 1) currentSlideshowImage = 0;
    slideshowImageOffset += RES_X;
    initialOffset = slideshowImageOffset;
    slideshowImageOffsetTime = 0;
  }
}

function drawSlideshow()
{
  if (slideshowImageOffsetTime < 1000)
  {
    slideshowImageOffsetTime += deltaTime;
    slideshowImageOffset = (cos(slideshowImageOffsetTime / (5 + 5/9)) + 1) * (initialOffset / 2);
  }
  else
  {
    slideshowImageOffset = 0;
  }


  for (let i = 0; i < noOfSlideshowImages; i++)
  {
    slideshow[i].draw();
  }
}
