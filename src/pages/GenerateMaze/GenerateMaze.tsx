import { useEffect, useRef } from "react";
import GenerateMazeLogic from "./GenerateMazeLogic";

export const GENERATE_MAZE_VERSION = "v0.0.1";

const GenerateMaze = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<GenerateMazeLogic | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gridSize = 10;

    logicRef.current = new GenerateMazeLogic(canvas, gridSize);

    const keyDownHandler = (event: KeyboardEvent) => {
      if (!logicRef.current) return;
      if (event.code === "Space") {
        logicRef.current.generate();
      }
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const boundingClientRect = canvas.getBoundingClientRect();
      canvas.height =
        Math.floor(boundingClientRect.height / gridSize) * gridSize;
      canvas.width = Math.floor(boundingClientRect.width / gridSize) * gridSize;
    };

    // Add event listeners for key press and release
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("resize", handleResize);

    setTimeout(handleResize, 1100);
    const ele = document.getElementById(
      "side-bar-toggle"
    ) as HTMLInputElement | null;
    if (ele) ele.checked = true;

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClickGenerate = () => {
    if (!logicRef.current) return;
    logicRef.current.generate();
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
        <button
          onClick={onClickGenerate}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Generate
        </button>
      </div>
    </div>
  );
};
export default GenerateMaze;
