// https://en.wikipedia.org/wiki/Pathfinding
// https://www.graphable.ai/blog/pathfinding-algorithms

// https://brilliant.org/wiki/a-star-search/
// f(n)=g(n)+h(n)
// where g = cost and h = heuristics

import {
  MazeInterface,
  MazeSaveObjectInterface,
} from "../GenerateMaze/MazeInterface";

interface AStarMazeInterface extends MazeInterface {
  highlight: boolean;
}

class AStarAlgorithm {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  maze: AStarMazeInterface[] = [];
  openSet: AStarMazeInterface[] = [];
  closeSet: AStarMazeInterface[] = [];
  color_base_content: string;
  color_base_100: string;
  color_primary: string;
  color_accent: string;
  gridSize: number = 0;
  lineWidth: number = 0;
  totalCol: number = 0;
  totalRow: number = 0;
  animationFrameRef: number | undefined;
  startPoint: AStarMazeInterface | undefined;
  endPoint: AStarMazeInterface | undefined;

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
    const newMaze = mazeSaveObject.maze.map((e) => {
      const returnObj: AStarMazeInterface = {
        ...e,
        highlight: false,
      };
      return returnObj;
    });

    this.maze = newMaze;
    this.gridSize = mazeSaveObject.gridSize;
    this.lineWidth = mazeSaveObject.lineWidth;
    this.canvas.width = mazeSaveObject.canvasWidth;
    this.canvas.height = mazeSaveObject.canvasHeight;
    this.totalCol = mazeSaveObject.canvasWidth / mazeSaveObject.gridSize;
    this.totalRow = mazeSaveObject.canvasWidth / mazeSaveObject.gridSize;
    this.setColors();
    this.renderLoop();
  }

  start() {
    this.startPoint = this.maze.find((e) => e.col === 0 && e.row === 0);
    this.endPoint = this.maze.find((e) => e.col === 40 && e.row === 40);
    if (this.maze.length <= 0) return;
    if (!this.startPoint) return;
    console.log("Start");

    this.openSet.push(this.startPoint);
  }

  renderLoop() {
    this.render();
    this.animationFrameRef = window.requestAnimationFrame(() =>
      this.renderLoop()
    );
  }

  render() {
    this.maze.forEach((e) => {
      this.drawMazeCell(e);
    });
  }

  drawMazeCell(mazeCall: AStarMazeInterface) {
    if (!this.ctx) return;

    const x1 = this.gridSize * mazeCall.col;
    const x2 = x1 + this.gridSize;
    const y1 = this.gridSize * mazeCall.row;
    const y2 = y1 + this.gridSize;

    let fillStyle = this.color_base_100;
    if (mazeCall.isVisited) {
      fillStyle = this.color_primary;
    }
    if (mazeCall.highlight) {
      fillStyle = "red";
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

  mousemove(e: MouseEvent) {
    console.log(e);

    // this.maze.forEach((maze) => {
    //   const x1 = maze.col * this.gridSize;
    //   const y1 = maze.row * this.gridSize;
    //   if (
    //     x1 < e.offsetX &&
    //     x1 + this.gridSize > e.offsetX &&
    //     y1 < e.offsetY &&
    //     y1 + this.gridSize > e.offsetY
    //   ) {
    //     maze.highlight = true;
    //   } else {
    //     maze.highlight = false;
    //   }
    // });
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default AStarAlgorithm;
