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
