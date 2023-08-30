import { useEffect, useRef } from "react";

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  }, []);

  return (
    <div className="flex-1 w-full overflow-auto flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-center h-12">
        <h1 className="text-lg">Snake Game v1.0.0</h1>
      </div>
      <div className="flex-1 p-4">
        <canvas
          ref={canvasRef}
          className="border border-accent w-full h-full"
        ></canvas>
      </div>
      <div className="flex-none flex flex-wrap gap-4 px-4 pb-4">
        <button className="daisy-btn daisy-btn-accent daisy-btn-sm">
          Button 01
        </button>
        <button className="daisy-btn daisy-btn-accent daisy-btn-sm">
          Button 01
        </button>
      </div>
    </div>
  );
};
export default SnakeGame;
