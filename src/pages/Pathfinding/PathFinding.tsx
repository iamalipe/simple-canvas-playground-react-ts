import { useEffect, useRef, useState } from "react";
import { MazeSaveObjectInterface } from "../GenerateMaze/MazeInterface";
import AStarAlgorithm from "./AStarAlgorithm";

export const PATHFINDING_VERSION = "v0.0.1";

// https://en.wikipedia.org/wiki/Pathfinding
// https://www.graphable.ai/blog/pathfinding-algorithms

const PathFinding = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<AStarAlgorithm | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [mazeList, setMazeList] = useState<MazeSaveObjectInterface[]>([]);
  const [selectedMaze, setSelectedMaze] = useState<string | undefined>(
    undefined
  );

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

  const loadMazeList = () => {
    const mazeListJson = localStorage.getItem("mazeList");
    if (mazeListJson) {
      const mazeListLoad = JSON.parse(mazeListJson);
      if (Array.isArray(mazeListLoad)) setMazeList(mazeListLoad);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    logicRef.current = new AStarAlgorithm(canvas);
    const mousemove = (e: MouseEvent) => {
      if (!logicRef.current) return;
      logicRef.current.mousemove(e);
    };

    // Add event listeners for key press and release
    window.addEventListener("resize", () => handleResize());
    canvas.addEventListener("mousemove", mousemove);

    setTimeout(() => handleResize(), 1100);
    fixedSideBarToggle();

    loadMazeList();
    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("resize", () => handleResize());
      canvas.removeEventListener("mousemove", mousemove);
    };
  }, []);

  const onClickStart = () => {
    if (!logicRef.current) return;
    logicRef.current.start();
  };
  const onMazeLoad = () => {
    if (!logicRef.current) return;
    if (!selectedMaze) return;
    const findMaze = mazeList.find((e) => e.hash === selectedMaze);
    if (!findMaze) return;
    logicRef.current.load(findMaze);
  };

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-between h-12 px-4 pl-12 sm:pl-4">
        <h1 className="text-lg">Path Finding {PATHFINDING_VERSION}</h1>
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
          value={selectedMaze}
          onChange={(e) => setSelectedMaze(e.target.value)}
          disabled={isLoading}
        >
          <option value={undefined}>Select maze.</option>
          {mazeList.map((e, index) => (
            <option key={index} value={e.hash}>
              {`Maze ${index + 1}`}
            </option>
          ))}
        </select>
        <button
          disabled={selectedMaze === undefined}
          onClick={onMazeLoad}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Load
        </button>
        <button
          disabled={isLoading}
          onClick={onClickStart}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Start
        </button>
      </div>
    </div>
  );
};
export default PathFinding;
