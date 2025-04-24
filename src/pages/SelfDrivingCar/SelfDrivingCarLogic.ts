class SelfDrivingCarLogic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  car: Car;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.car = new Car(100, 100, 30, 50, this.ctx);
  }

  initialize() {
    console.log("hello initialize");
    this.car.draw();
    this.animate();
  }
  animate() {
    // this.car.update();
    this.car.draw();
    requestAnimationFrame(this.animate);
  }
}

class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D | null;
  controls: Controls;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    ctx: CanvasRenderingContext2D | null
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.controls = new Controls();
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    this.ctx.fill();
  }
  update() {
    console.log("update");

    if (this.controls.forward) {
      this.y -= 2;
    }
    if (this.controls.reverse) {
      this.y += 2;
    }
  }
}

class Controls {
  forward: boolean;
  left: boolean;
  right: boolean;
  reverse: boolean;
  constructor() {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;
    this.#addKeyboardListeners();
  }
  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;
        case "ArrowRight":
          this.right = true;
          break;
        case "ArrowUp":
          this.forward = true;
          break;
        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;
        case "ArrowRight":
          this.right = false;
          break;
        case "ArrowUp":
          this.forward = false;
          break;
        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }
}

export default SelfDrivingCarLogic;
