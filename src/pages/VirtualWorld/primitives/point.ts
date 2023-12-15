export class Point {
  x: number;
  y: number;
  size = 18;
  constructor(x: number, y: number, size?: number) {
    this.x = x;
    this.y = y;

    if (size) this.size = size;
  }

  draw(ctx: CanvasRenderingContext2D, color = "black") {
    const radius = this.size / 2;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  equals(point: Point) {
    return this.x == point.x && this.y == point.y;
  }
}
