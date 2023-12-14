// https://en.wikipedia.org/wiki/Pathfinding
// https://www.graphable.ai/blog/pathfinding-algorithms

// https://brilliant.org/wiki/a-star-search/
// f(n)=g(n)+h(n)
// where g = cost and h = heuristics

// import {
//   MazeInterface,
//   MazeSaveObjectInterface,
// } from "../GenerateMaze/MazeInterface";

export interface MazeInterface {
  col: number;
  row: number;
  rightWall: boolean;
  leftWall: boolean;
  topWall: boolean;
  bottomWall: boolean;
  isVisited: boolean;
  edge?: "top" | "bottom" | "left" | "right";
}

export interface MazeSaveObjectInterface {
  date: Date;
  hash: string;
  canvasHeight: number;
  canvasWidth: number;
  gridSize: number;
  lineWidth: number;
  maze: MazeInterface[];
}

interface AStarMazeInterface extends MazeInterface {
  highlight: boolean;
  startOrEnd?: "START" | "END";
  g: number;
  f: number;
  h: number;
}

class AStarAlgorithm {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  maze: AStarMazeInterface[] = [];
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
        isVisited: false,
        f: 0,
        g: 0,
        h: 0,
      };
      return returnObj;
    });

    this.maze = newMaze;
    this.gridSize = mazeSaveObject.gridSize;
    this.lineWidth = mazeSaveObject.lineWidth;
    this.canvas.width = mazeSaveObject.canvasWidth;
    this.canvas.height = mazeSaveObject.canvasHeight;
    this.canvas.style.width = mazeSaveObject.canvasWidth + "px";
    this.canvas.style.height = mazeSaveObject.canvasHeight + "px";
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
    if (!this.endPoint) return;
    this.startPoint.startOrEnd = "START";
    this.endPoint.startOrEnd = "END";
    console.log("Start");
    this.runAStar();
  }

  runAStar() {
    if (!this.startPoint || !this.endPoint) return;

    const openSet: AStarMazeInterface[] = [];
    const closedSet: AStarMazeInterface[] = [];

    openSet.push(this.startPoint);

    while (openSet.length > 0) {
      // Find the node with the lowest f value in the open set
      let currentNode = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < currentNode.f) {
          currentNode = openSet[i];
        }
      }

      // Remove the current node from the open set
      openSet.splice(openSet.indexOf(currentNode), 1);

      // Move the current node to the closed set
      closedSet.push(currentNode);

      // Check if the current node is the end node
      if (currentNode === this.endPoint) {
        // You've found the path, implement code to trace back the path
        // from the end node to the start node using parent references.
        // Set the 'highlight' property of nodes in the path to true.
        // Exit the loop.
        console.log("Path found!");
        break;
      }

      // Expand the current node's neighbors
      const neighbors = this.getNeighbors(currentNode);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) {
          continue; // Skip nodes in the closed set
        }

        const tentativeG =
          currentNode.g + this.calculateHeuristic(currentNode, neighbor);

        if (!openSet.includes(neighbor) || tentativeG < neighbor.g) {
          neighbor.g = tentativeG;
          neighbor.h = this.calculateHeuristic(neighbor, this.endPoint);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.startOrEnd = "START"; // Highlight the path as it's being explored
          // neighbor.parent = currentNode;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }
  }

  getNeighbors(node: AStarMazeInterface) {
    // Implement logic to find and return neighboring nodes of the given node
    // based on the maze structure. Be sure to handle walls and boundaries.
    // You can use the 'edge' property to determine the direction.
    // Return an array of valid neighboring nodes.
    // Example:
    const neighbors: AStarMazeInterface[] = [];
    console.log("getNeighbors", node);

    // Check if the neighbor exists and is not a wall
    // Add valid neighbors to the 'neighbors' array

    return neighbors;
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
    if (mazeCall.startOrEnd === "START") {
      fillStyle = "red";
    } else if (mazeCall.startOrEnd === "END") {
      fillStyle = "blue";
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
    console.log("mousemove", e);

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

  calculateHeuristic(nodeA: AStarMazeInterface, nodeB: AStarMazeInterface) {
    // Implement the heuristic calculation here
    return Math.abs(nodeA.col - nodeB.col) + Math.abs(nodeA.row - nodeB.row);
  }
}

export default AStarAlgorithm;
