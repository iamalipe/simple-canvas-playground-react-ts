import { useEffect, useRef, useState } from "react";
import GenerateMazeLogic from "./GenerateMazeLogic";
import Logic_RecursiveBacktracking from "./Logic_RecursiveBacktracking";

export const GENERATE_MAZE_VERSION = "v0.0.1";

const LOGIC_LIST = [
  "Maze Generator 1",
  "Depth-First Search Maze Generator Algorithm with Recursive Backtracking",
];

const GenerateMaze = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<
    GenerateMazeLogic | Logic_RecursiveBacktracking | null
  >(null);

  const [selectedLogic, setSelectedLogic] = useState(LOGIC_LIST[1]);
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

  // "Maze Generator 1"
  useEffect(() => {
    // its only works for LOGIC_LIST[0]
    if (selectedLogic !== LOGIC_LIST[0]) return;
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gridSize = 10;
    logicRef.current = new GenerateMazeLogic(canvas, gridSize);

    // Add event listeners for key press and release
    window.addEventListener("resize", () => handleResize(gridSize));

    setTimeout(() => handleResize(gridSize), 1100);
    fixedSideBarToggle();

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("resize", () => handleResize(gridSize));
    };
  }, [selectedLogic]);

  // Depth-First Search Maze Generator Algorithm with Recursive Backtracking
  useEffect(() => {
    // its only works for LOGIC_LIST[1]
    if (selectedLogic !== LOGIC_LIST[1]) return;
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridSize = 15;
    logicRef.current = new Logic_RecursiveBacktracking(canvas, gridSize);

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
          className="daisy-select daisy-select-sm daisy-select-bordered"
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
      </div>
    </div>
  );
};
export default GenerateMaze;
