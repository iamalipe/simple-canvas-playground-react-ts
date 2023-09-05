import { useEffect, useRef, useState } from "react";
import sha256 from "crypto-js/sha256";
import RecursiveBacktracking from "./RecursiveBacktracking";
import { toast } from "../../utils";
import { MazeSaveObjectInterface } from "./MazeInterface";

export const GENERATE_MAZE_VERSION = "v1.0.2";

const LOGIC_LIST = [
  "Depth-First Search Maze Generator Algorithm with Recursive Backtracking",
];

const GenerateMaze = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<RecursiveBacktracking | null>(null);

  const [selectedLogic, setSelectedLogic] = useState(LOGIC_LIST[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResize = (gridSize?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const boundingClientRect = canvas.getBoundingClientRect();
    canvas.height =
      gridSize !== undefined
        ? Math.floor(boundingClientRect.height / gridSize) * gridSize
        : boundingClientRect.height;
    canvas.width =
      gridSize !== undefined
        ? Math.floor(boundingClientRect.width / gridSize) * gridSize
        : boundingClientRect.width;
    setIsLoading(false);
  };

  const fixedSideBarToggle = () => {
    if (window.innerWidth < 640) {
      const ele = document.getElementById(
        "side-bar-toggle"
      ) as HTMLInputElement | null;
      if (ele) ele.checked = true;
    }
  };

  // Depth-First Search Maze Generator Algorithm with Recursive Backtracking
  useEffect(() => {
    if (selectedLogic !== LOGIC_LIST[0]) return;
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridSize = 15;
    logicRef.current = new RecursiveBacktracking(canvas, gridSize);

    // Add event listeners for key press and release
    window.addEventListener("resize", () => handleResize(gridSize));

    setTimeout(() => handleResize(gridSize), 1100);
    fixedSideBarToggle();

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("resize", () => handleResize(gridSize));
    };
  }, [selectedLogic]);

  const onClickGenerate = () => {
    if (!logicRef.current) return;
    logicRef.current.start();
  };

  const onClickStop = () => {
    if (!logicRef.current) return;
    logicRef.current.stop();
  };

  const onSaveMaze = () => {
    // This only save maze in localstorage
    if (!logicRef.current) return;
    if (logicRef.current.maze.length === 0) {
      toast("no generated maze found");
      return;
    }
    const visitedList = logicRef.current.maze.filter((e) => e.isVisited);
    if (visitedList.length !== logicRef.current.maze.length) {
      toast("maze wasn't complete, can't save, try after complete.");
      return;
    }

    const mazeListJson = localStorage.getItem("mazeList");
    if (mazeListJson) {
      const mazeList = JSON.parse(mazeListJson) as MazeSaveObjectInterface[];
      const mazeStringify = JSON.stringify(logicRef.current.maze);
      const hash = sha256(mazeStringify).toString();

      const hashFilter = mazeList.filter((e) => e.hash === hash);
      if (hashFilter.length > 0) {
        toast("already save this maze");
        return;
      }

      const mazeObj: MazeSaveObjectInterface = {
        date: new Date(),
        hash: hash,
        maze: logicRef.current.maze,
        canvasHeight: logicRef.current.canvas.height,
        canvasWidth: logicRef.current.canvas.width,
        gridSize: logicRef.current.gridSize,
        lineWidth: logicRef.current.lineWidth,
      };
      mazeList.push(mazeObj);
      localStorage.setItem("mazeList", JSON.stringify(mazeList));
    } else {
      const mazeList = [];
      const mazeStringify = JSON.stringify(logicRef.current.maze);
      const hash = sha256(mazeStringify).toString();

      const mazeObj: MazeSaveObjectInterface = {
        date: new Date(),
        hash: hash,
        maze: logicRef.current.maze,
        canvasHeight: logicRef.current.canvas.height,
        canvasWidth: logicRef.current.canvas.width,
        gridSize: logicRef.current.gridSize,
        lineWidth: logicRef.current.lineWidth,
      };
      mazeList.push(mazeObj);
      localStorage.setItem("mazeList", JSON.stringify(mazeList));
    }
  };

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-between h-12 px-4 pl-12 sm:pl-4">
        <h1 className="text-lg">Generate Maze {GENERATE_MAZE_VERSION}</h1>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <canvas
          ref={canvasRef}
          className="border border-accent w-full h-full"
        ></canvas>
      </div>
      <div className="flex-none flex flex-wrap gap-4 px-4 pb-4">
        <select
          className="daisy-select daisy-select-sm daisy-select-bordered max-w-xs"
          value={selectedLogic}
          onChange={(e) => setSelectedLogic(e.target.value)}
          disabled={isLoading}
        >
          <option disabled>Select maze logic.</option>
          {LOGIC_LIST.map((e, index) => (
            <option key={index} value={e}>
              {e}
            </option>
          ))}
        </select>
        <button
          disabled={isLoading}
          onClick={onClickGenerate}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Generate
        </button>
        <button
          disabled={isLoading}
          onClick={onClickStop}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Stop
        </button>
        <button
          disabled={isLoading}
          onClick={onSaveMaze}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default GenerateMaze;
