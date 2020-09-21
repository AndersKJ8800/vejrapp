class Button
{
  constructor(x, y, width, height, activeWindow, color)
  {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.activeWindow = activeWindow;
  }
  update()
  {
    if (this.color[0] == 255)
    {
      changeSlideshowNo(-1);
    }
    else
    {
      changeSlideshowNo(1);
    }
  }
  draw()
  {
    g.fill(this.color[0], this.color[1], this.color[2]);
    g.noStroke();
    g.rect(this.x, this.y, this.width, this.height);
  }
}
