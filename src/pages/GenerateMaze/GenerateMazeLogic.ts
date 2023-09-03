interface MazeInterface {
  x: number;
  y: number;
  isWall: boolean;
  isEnterExit: boolean;
  isLastWall: boolean;
}

class GenerateMazeLogic {
  gridSize: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  maze: MazeInterface[] = [];

  constructor(canvas: HTMLCanvasElement, gridSize: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gridSize = gridSize;
  }

  generate() {
    if (!this.ctx) return;
    const { height, width } = this.canvas;
    this.maze = [];
    for (let i = 0; i <= width - this.gridSize; i += this.gridSize) {
      for (let j = 0; j <= height - this.gridSize; j += this.gridSize) {
        const randomBool = Math.random() < 0.1; //5% probability of getting true
        // Checking Walls
        const mazeObj = {
          x: i,
          y: j,
          isWall: true,
          isEnterExit: false,
          isLastWall: false,
        };
        if (
          j === 0 ||
          i === 0 ||
          i === width - this.gridSize ||
          j === height - this.gridSize
        ) {
          mazeObj.isEnterExit = randomBool;
          mazeObj.isLastWall = true;

          // overwrite
          // if (i === 160 && j === 0) {
          //   mazeObj.isEnterExit = true;
          // }
          // if (i === 0 && j === 200) {
          //   mazeObj.isEnterExit = true;
          // }
        }
        this.maze.push(mazeObj);
      }
    }

    this.renderMaze();
    this.generatePath();
    this.renderMaze();
  }

  renderMaze() {
    const docElement = document.documentElement;
    const color_a = getComputedStyle(docElement).getPropertyValue("--a");
    const color_p = getComputedStyle(docElement).getPropertyValue("--p");
    const color_b3 = getComputedStyle(docElement).getPropertyValue("--b3");
    const color_b2 = getComputedStyle(docElement).getPropertyValue("--b2");
    // draw maze
    this.maze.forEach((e) => {
      if (!this.ctx) return;
      let fillStyle = `hsl(${color_b2})`;
      if (e.isLastWall) {
        fillStyle = e.isEnterExit ? `hsl(${color_a})` : `hsl(${color_b3})`;
      }
      if (!e.isWall) fillStyle = `hsl(${color_p})`;

      this.ctx.fillStyle = fillStyle;
      this.ctx.fillRect(e.x, e.y, this.gridSize, this.gridSize);
    });
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generatePath() {
    // Step 1: Gather all isEnterExit points in an array
    const entranceExitPoints = this.maze.filter((point) => point.isEnterExit);
    // Step 2: Ensure there are at least two EnterExit points to connect
    if (entranceExitPoints.length < 2) {
      console.log("Cannot connect if there are fewer than two points");
      return; // Cannot connect if there are fewer than two points
    }

    // Step 5: Continue connecting the remaining points
    for (let i = 0; i < entranceExitPoints.length; i++) {
      let randomIndex;
      do {
        randomIndex = this.getRandomInt(0, entranceExitPoints.length - 1);
      } while (randomIndex === i);

      // Step 3: Generate the first two points
      const point1 = entranceExitPoints[i];
      const point2 = entranceExitPoints[randomIndex];

      // Step 4: Connect the two points
      this.connectPoints(point1, point2);
    }
  }

  connectPoints(point1: MazeInterface, point2: MazeInterface) {
    console.table([point1, point2]);
    const x1 = point1.x / this.gridSize;
    const y1 = point1.y / this.gridSize;
    const x2 = point2.x / this.gridSize;
    const y2 = point2.y / this.gridSize;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;

    let err = dx - dy;
    let x = x1;
    let y = y1;

    while (x !== x2 || y !== y2) {
      const currentCell = this.maze.find(
        (cell) => cell.x === x * this.gridSize && cell.y === y * this.gridSize
      );

      // Skip the last wall
      if (currentCell?.isLastWall) {
        x += sx;
        y += sy;
        continue;
      }

      if (currentCell) {
        currentCell.isWall = false;
        console.log(
          `Connected cell at (${x * this.gridSize}, ${y * this.gridSize})`
        );
      }

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }
}

export default GenerateMazeLogic;
