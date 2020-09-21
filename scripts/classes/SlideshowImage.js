let noOfSlideshowImages = 0;
let slideshowImageOffset = 0;
let slideshowScrollingDirection = 1;

class SlideshowImage
{
  constructor(activityType)
  {
    this.no = noOfSlideshowImages;
    noOfSlideshowImages++;
    this.image = backgroundImages[activityType];
    this.activityType = activityType;
    button["slideshowImage" + this.activityType] = new Button("start" + activityType, RES_X / 2, RES_Y / 1.25, 200, 120, "mainMenu");
  }
  update()
  {

  }
  draw()
  {
    g.translate((this.no - currentSlideshowImage) * RES_X + slideshowImageOffset * slideshowScrollingDirection, 0);
    g.image(this.image, 0, 0);
    button["slideshowImage" + this.activityType].draw();
    g.translate(-((this.no - currentSlideshowImage) * RES_X + slideshowImageOffset * slideshowScrollingDirection), 0);

    g.translate((this.no - currentSlideshowImage - noOfSlideshowImages) * RES_X + slideshowImageOffset * slideshowScrollingDirection, 0);
    g.image(this.image, 0, 0);

    g.translate(-((this.no - currentSlideshowImage - noOfSlideshowImages) * RES_X + slideshowImageOffset * slideshowScrollingDirection), 0);
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
  }
}

function drawSlideshow()
{
  if (slideshowImageOffset > 0)
  {
    slideshowImageOffset -= slideshowImageOffset / (20) + 1;
  }
  if (slideshowImageOffset <= 0)
  {
    slideshowImageOffset = 0;

  }
  for (let i = 0; i < noOfSlideshowImages; i++)
  {
    slideshow[i].draw();
  }
}
