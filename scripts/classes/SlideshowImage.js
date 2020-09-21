let noOfSlideshowImages = 0;

class SlideshowImage
{
  constructor(activityType)
  {
    this.no = noOfSlideshowImages;
    noOfSlideshowImages++;
    this.image = backgroundImages["activityType"];
    this.activityType = activityType;
  }
  update()
  {

  }
  draw()
  {

  }
}
