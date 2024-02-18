import { useEffect, useRef } from "react";
import VirtualWorldLogic from "./VirtualWorldLogic";

export const VIRTUALWORLD_VERSION = "v0.0.1";

const VirtualWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<VirtualWorldLogic | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    logicRef.current = new VirtualWorldLogic(canvas);

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const boundingClientRect = canvas.getBoundingClientRect();
      canvas.height = boundingClientRect.height;
      canvas.width = boundingClientRect.width;

      if (!logicRef.current) return;
      logicRef.current.initialize();
    };

    setTimeout(handleResize, 1500);
    const ele = document.getElementById(
      "side-bar-toggle"
    ) as HTMLInputElement | null;
    if (ele) ele.checked = true;

    // Cleanup when the component unmounts
    return () => {
      // window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onAddRandomPoint = () => {
    if (!logicRef.current) return;
    logicRef.current.addRandomPoint();
  };

  const onAddRandomSegment = () => {
    if (!logicRef.current) return;
    logicRef.current.addRandomSegment();
  };

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-between h-12 px-4 pl-12 sm:pl-4">
        <h1 className="text-lg">Virtual World {VIRTUALWORLD_VERSION}</h1>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <canvas
          ref={canvasRef}
          className="border border-accent w-full h-full"
        ></canvas>
      </div>
      <div className="flex-none flex flex-wrap gap-4 px-4 pb-4">
        <button
          onClick={onAddRandomPoint}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Add Random Point
        </button>
        <button
          onClick={onAddRandomSegment}
          className="daisy-btn daisy-btn-accent daisy-btn-sm"
        >
          Add Segment Point
        </button>
      </div>
    </div>
  );
};
export default VirtualWorld;
