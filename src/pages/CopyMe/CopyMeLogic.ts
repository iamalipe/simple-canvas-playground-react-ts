class CopyMeLogic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  initialize() {
    console.log("hello initialize");
  }
}

export default CopyMeLogic;
