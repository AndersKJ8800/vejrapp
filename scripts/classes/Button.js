class Button
{
  constructor(x, y, width, height, color)
  {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
  }
  update()
  {
    print(this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + "button pressed");
  }
  draw()
  {
    fill(this.color[0], this.color[1], this.color[2]);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}
