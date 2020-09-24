class Button
{
  constructor(type, text, x, y, width, height, activeWindow)
  {
    this.type = type;
    this.x = x - width / 2;
    this.y = y - height / 2;
    this.width = width;
    this.height = height;
    this.activeWindow = activeWindow;
    this.text = text.charAt(0).toUpperCase() + text.substring(1);
  }
  update()
  {
    switch(this.type)
    {
      case "slideshowLeft":
        changeSlideshowNo(-1);
        break;
      case "slideshowRight":
        changeSlideshowNo(1);
        break;
    }
    if (this.type.includes("start"))
    {
      // sæt scene til whatever aktivitet
      switch(this.type.substring(5))
      {
        case slideshow[0].activityType:
          break;
        case slideshow[1].activityType:
          break;
        case slideshow[2].activityType:
          break;
        case slideshow[3].activityType:
          break;
        case slideshow[4].activityType:
          break;
        case slideshow[5].activityType:
          break;
        case slideshow[6].activityType:
          break;
      }
    }
  }
  draw()
  {
    g.fill(0);
    g.stroke(0);
    g.strokeWeight(1);
    g.textSize(96);
    g.textFont("sans-serif");
    g.textAlign(CENTER, CENTER);
    switch(this.type)
    {
      case "slideshowLeft":
        g.stroke(255);
        g.fill(255);
        g.text(this.text, this.x + this.width / 3, this.y + this.height / 2 + 50);
        break;
      case "slideshowRight":
        g.stroke(255);
        g.fill(255);
        g.text(this.text, this.x + this.width / 1.5, this.y + this.height / 2 + 50);
        break;
      default:
        g.noStroke();
        g.fill(color[1]);
        g.rect(this.x, this.y, this.width, this.height, 25);
        g.fill(color[0]);
        g.textSize(56);
        g.text(this.text, this.x + this.width / 2, this.y + this.height / 2);
    }
  }
}
