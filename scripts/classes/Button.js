class Button
{
  constructor(type, x, y, width, height, activeWindow)
  {
    this.type = type;
    this.x = x - width / 2;
    this.y = y - height / 2;
    this.width = width;
    this.height = height;
    this.activeWindow = activeWindow;
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
  }
  draw()
  {
    g.fill(0);
    g.stroke(0);
    g.strokeWeight(1);
    g.textSize(96);
    g.textFont("monospace");
    g.textAlign(LEFT);
    switch(this.type)
    {
      case "slideshowLeft":
        g.stroke(255);
        g.fill(255);
        g.text("<", this.x + 25, this.y + this.height / 2 + 50);
        break;
      case "slideshowRight":
        g.stroke(255);
        g.fill(255);
        g.textAlign(RIGHT);
        g.text(">", this.x - 25 + this.width, this.y + this.height / 2 + 50);
        break;
      default:
        g.noStroke();
        g.fill(255,0,0);
        g.rect(this.x, this.y, this.width, this.height);
    }
  }
}
