// Depth-First Search Maze Generator Algorithm with Recursive Backtracking
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_depth-first_search

interface Maze2Interface {
  col: number;
  row: number;
  rightWall: boolean;
  leftWall: boolean;
  topWall: boolean;
  bottomWall: boolean;
  isVisited: boolean;
  edge?: "top" | "bottom" | "left" | "right";
}

class Logic_RecursiveBacktracking {
  gridSize: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  maze: Maze2Interface[] = [];
  currentCell?: Maze2Interface;
  mazeStack: Maze2Interface[] = [];
  totalCol: number;
  totalRow: number;
  lineWidth: number;
  intervalRef: NodeJS.Timeout | undefined;
  animationFrameRef: number | undefined;
  color_base_content: string;
  color_base_100: string;
  color_primary: string;
  color_accent: string;

  constructor(canvas: HTMLCanvasElement, gridSize: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gridSize = gridSize;
    this.totalCol = canvas.width / gridSize;
    this.totalRow = canvas.height / gridSize;
    this.lineWidth = gridSize * 0.1;

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

  start() {
    if (this.intervalRef) clearInterval(this.intervalRef);
    if (this.animationFrameRef) cancelAnimationFrame(this.animationFrameRef);
    this.generateCell();
    const cellIndex = this.maze.findIndex((e) => e.col === 0 && e.row === 0);
    this.currentCell = this.maze[cellIndex];

    // this.intervalRef = setInterval(() => {
    //   this.render();
    //   this.drawCurrentCell();
    //   this.generateMaze();
    // }, 50);

    // this.inRecursiveStyle();

    this.inAnimationFrame();
  }

  inAnimationFrame() {
    this.render();
    this.drawCurrentCell();
    if (this.generateMaze()) {
      this.animationFrameRef = window.requestAnimationFrame(() =>
        this.inAnimationFrame()
      );
    } else {
      this.stop();
    }
  }

  stop() {
    if (this.intervalRef) clearInterval(this.intervalRef);
    if (this.animationFrameRef) cancelAnimationFrame(this.animationFrameRef);
    // this.maze = [];
    this.currentCell = undefined;
    this.mazeStack = [];
    console.log("maze complete");
  }

  inRecursiveStyle() {
    this.render();
    this.drawCurrentCell();
    if (this.generateMaze()) {
      this.inRecursiveStyle();
    } else {
      this.stop();
    }
  }

  logProgress() {
    const totalVisited = this.maze.filter((e) => e.isVisited);
    const progress =
      Math.round(
        (totalVisited.length / this.maze.length + Number.EPSILON) * 100
      ) / 100;
    console.log("Progress", progress);
  }

  generateCell() {
    if (!this.ctx) return;
    this.totalCol = this.canvas.width / this.gridSize;
    this.totalRow = this.canvas.height / this.gridSize;
    this.maze = [];
    this.mazeStack = [];
    this.currentCell = undefined;
    for (let col = 0; col < this.totalCol; col++) {
      for (let row = 0; row < this.totalRow; row++) {
        const mazeObj: Maze2Interface = {
          col,
          row,
          rightWall: true,
          leftWall: true,
          topWall: true,
          bottomWall: true,
          isVisited: false,
        };
        if (row === 0) mazeObj.edge = "top";
        if (col === this.totalCol) mazeObj.edge = "right";
        if (row === this.totalRow) mazeObj.edge = "bottom";
        if (col === 0) mazeObj.edge = "left";

        this.maze.push(mazeObj);
      }
    }
  }

  generateMaze() {
    if (!this.currentCell) return false;
    this.currentCell.isVisited = true;
    const next = this.checkNeighbour(this.currentCell);

    if (next) {
      this.mazeStack.push(this.currentCell);
      this.removeWalls(this.currentCell, next);
      this.currentCell = next;
      this.logProgress();
      return true;
    } else if (this.mazeStack.length > 0) {
      this.currentCell = this.mazeStack.pop();
      return true;
    } else {
      this.stop();
      return false;
    }
  }

  checkNeighbour(current: Maze2Interface) {
    const neighboursArray: Maze2Interface[] = [];
    const top = this.maze.find(
      (e) => e.col === current.col && e.row === current.row - 1
    );
    const right = this.maze.find(
      (e) => e.col === current.col + 1 && e.row === current.row
    );
    const bottom = this.maze.find(
      (e) => e.col === current.col && e.row === current.row + 1
    );
    const left = this.maze.find(
      (e) => e.col === current.col - 1 && e.row === current.row
    );

    if (top && !top.isVisited) {
      neighboursArray.push(top);
    }
    if (right && !right.isVisited) {
      neighboursArray.push(right);
    }
    if (bottom && !bottom.isVisited) {
      neighboursArray.push(bottom);
    }
    if (left && !left.isVisited) {
      neighboursArray.push(left);
    }

    // its return next cell or undefined
    if (neighboursArray.length > 0) {
      return neighboursArray[this.getRandomInt(0, neighboursArray.length - 1)];
    }
  }

  removeWalls(current: Maze2Interface, next: Maze2Interface) {
    const diffCol = current.col - next.col;
    const diffRow = current.row - next.row;
    if (diffRow === 1) {
      current.topWall = false;
      next.bottomWall = false;
    }
    if (diffCol === -1) {
      current.rightWall = false;
      next.leftWall = false;
    }
    if (diffRow === -1) {
      current.bottomWall = false;
      next.topWall = false;
    }
    if (diffCol === 1) {
      current.leftWall = false;
      next.rightWall = false;
    }
  }

  render() {
    this.maze.forEach((e) => {
      this.drawMazeCell(e);
    });
  }

  drawMazeCell(mazeCall: Maze2Interface) {
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

  drawCurrentCell() {
    if (!this.ctx) return;
    if (!this.currentCell) return;

    const x1 = this.gridSize * this.currentCell.col;
    const y1 = this.gridSize * this.currentCell.row;

    this.ctx.fillStyle = this.color_accent;
    this.ctx.fillRect(x1, y1, this.gridSize, this.gridSize);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default Logic_RecursiveBacktracking;
