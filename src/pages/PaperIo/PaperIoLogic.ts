// Step 1: Track Mouse Movement draw a Dot on Mouse Pointer

class PaperIoLogic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  mouseX: number;
  mouseY: number;
  dotRadius: number;
  dots: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mouseX = 0;
    this.mouseY = 0;
    this.dotRadius = 5;

    // Add mouse move event listener
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
  }

  initialize() {
    console.log("hello initialize");
    // Start the animation loop
    this.animate();
  }

  // Handle mouse movement
  handleMouseMove(event: MouseEvent) {
    // Get mouse position relative to canvas
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
    // Add current mouse position to dots array
    this.dots.push({ x: this.mouseX, y: this.mouseY });
  }

  // Draw dot at mouse position
  drawDot() {
    if (!this.ctx) return;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all dots
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.fill();
    this.ctx.closePath();
  }
  drawDots() {
    if (!this.ctx) return;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all dots
    this.dots.forEach((dot) => {
      if (!this.ctx) return;
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, this.dotRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  // Animation loop
  animate() {
    // this.drawDot();
    this.drawDots();
    requestAnimationFrame(this.animate.bind(this));
  }
}

export default PaperIoLogic;
