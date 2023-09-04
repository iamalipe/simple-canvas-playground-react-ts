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

  start() {
    this.generate();
    // this.render();
  }
  stop() {
    // clearInterval(this.intervalRef);
  }

  generate() {
    if (!this.ctx) return;
    const { height, width } = this.canvas;
    this.maze = [];
    for (let i = 0; i <= width - this.gridSize; i += this.gridSize) {
      for (let j = 0; j <= height - this.gridSize; j += this.gridSize) {
        const randomBool = Math.random() < 0.05; //5% probability of getting true
        // Checking Walls
        const mazeObj: MazeInterface = {
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
    console.log([point1, point2]);
  }
}

export default GenerateMazeLogic;
