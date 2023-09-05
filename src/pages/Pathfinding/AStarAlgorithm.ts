import {
  MazeInterface,
  MazeSaveObjectInterface,
} from "../GenerateMaze/MazeInterface";

interface AStarMazeInterface extends MazeInterface {
  hello?: string;
}

class AStarAlgorithm {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  maze?: AStarMazeInterface[];
  color_base_content: string;
  color_base_100: string;
  color_primary: string;
  color_accent: string;
  gridSize: number;
  lineWidth: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    const docElement = document.documentElement;
    this.color_accent = `hsl(${getComputedStyle(docElement).getPropertyValue(
      "--a"
    )})`;
    this.color_primary = `hsl(${getComputedStyle(docElement).getPropertyValue(
      "--p"
    )})`;
    this.color_base_100 = `hsl(${getComputedStyle(docElement).getPropertyValue(
      "--b1"
    )})`;
    this.color_base_content = `hsl(${getComputedStyle(
      docElement
    ).getPropertyValue("--bc")})`;
    this.gridSize = 0;
    this.lineWidth = 0;
  }

  setColors() {
    const docElement = document.documentElement;
    this.color_accent = `hsl(${getComputedStyle(docElement).getPropertyValue(
      "--a"
    )})`;
    this.color_primary = `hsl(${getComputedStyle(docElement).getPropertyValue(
      "--p"
    )})`;
    this.color_base_100 = `hsl(${getComputedStyle(docElement).getPropertyValue(
      "--b1"
    )})`;
    this.color_base_content = `hsl(${getComputedStyle(
      docElement
    ).getPropertyValue("--bc")})`;
  }

  load(mazeSaveObject: MazeSaveObjectInterface) {
    this.maze = mazeSaveObject.maze;
    this.gridSize = mazeSaveObject.gridSize;
    this.lineWidth = mazeSaveObject.lineWidth;
    this.canvas.width = mazeSaveObject.canvasWidth;
    this.canvas.height = mazeSaveObject.canvasHeight;
    this.setColors();
    this.render();
  }

  render() {
    if (!this.maze) return;
    this.maze.forEach((e) => {
      this.drawMazeCell(e);
    });
  }

  drawMazeCell(mazeCall: MazeInterface) {
    if (!this.ctx) return;

    const x1 = this.gridSize * mazeCall.col;
    const x2 = x1 + this.gridSize;
    const y1 = this.gridSize * mazeCall.row;
    const y2 = y1 + this.gridSize;

    let fillStyle = this.color_base_100;
    if (mazeCall.isVisited) {
      fillStyle = this.color_primary;
    }
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(x1, y1, this.gridSize, this.gridSize);

    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    if (mazeCall.topWall) {
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y1);
    }
    if (mazeCall.rightWall) {
      this.ctx.moveTo(x2, y1);
      this.ctx.lineTo(x2, y2);
    }
    if (mazeCall.bottomWall) {
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(x1, y2);
    }
    if (mazeCall.leftWall) {
      this.ctx.moveTo(x1, y2);
      this.ctx.lineTo(x1, y1);
    }
    this.ctx.strokeStyle = this.color_base_content;
    this.ctx.stroke();
  }
}

export default AStarAlgorithm;
