import { useEffect, useRef, useState } from "react";
import TestMeLogic from "./TestMeLogic";

const TestMe = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<TestMeLogic | null>(null);

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

  useEffect(() => {
    setIsLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    logicRef.current = new TestMeLogic(canvas);

    // Add event listeners for key press and release
    window.addEventListener("resize", () => handleResize());

    setTimeout(() => handleResize(), 1100);
    fixedSideBarToggle();

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("resize", () => handleResize());
    };
  }, []);

  const onClickGenerate = () => {
    if (!logicRef.current) return;
    // logicRef.current.start();
  };

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-between h-12 px-4 pl-12 sm:pl-4">
        <h1 className="text-lg">Test Me</h1>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <canvas
          ref={canvasRef}
          className="border border-accent w-full h-full"
        ></canvas>
      </div>
      <div className="flex-none flex flex-wrap gap-4 px-4 pb-4">
        <button
          disabled={isLoading}
          onClick={onClickGenerate}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Generate
        </button>
      </div>
    </div>
  );
};
export default TestMe;
