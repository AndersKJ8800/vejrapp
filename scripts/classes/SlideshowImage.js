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
  }
  update()
  {

  }
  draw()
  {
    g.image(this.image, (this.no - currentSlideshowImage) * RES_X + slideshowImageOffset * slideshowScrollingDirection, 0);
    g.image(this.image, (this.no - currentSlideshowImage - noOfSlideshowImages) * RES_X + slideshowImageOffset * slideshowScrollingDirection, 0);
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
    slideshowImageOffset -= slideshowImageOffset / 20 + 2;
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
