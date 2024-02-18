export class Point {
  x: number;
  y: number;
  size = 18;
  constructor(x: number, y: number, size?: number) {
    this.x = x;
    this.y = y;

    if (size) this.size = size;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    { color = "black", outline = false, fill = false } = {}
  ) {
    const radius = this.size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
    if (outline) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (fill) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }

  equals(point: Point) {
    return this.x == point.x && this.y == point.y;
  }
}
