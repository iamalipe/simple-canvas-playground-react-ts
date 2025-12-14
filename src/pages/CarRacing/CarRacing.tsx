import { useEffect, useRef, useState } from "react";
import CarRacingLogic, { GameConfig, UIRefs } from "./CarRacingLogic";
import "./style.css";

export const CARRACING_VERSION = "v1.0.0";

const CarRacing = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logicRef = useRef<CarRacingLogic | null>(null);

  // HUD Refs (For high-performance non-react updates)
  const timerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const endTitleRef = useRef<HTMLHeadingElement>(null);
  const endTimeRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobileControlsRef = useRef<HTMLDivElement>(null);

  // React State for Config
  const [config, setConfig] = useState<GameConfig>({
    laneCount: 3,
    laneWidth: 60,
    trackComplexity: 100,
    crashOnEdge: false,
  });

  const [viewModeText, setViewModeText] = useState("View Full Map");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const uiRefs: UIRefs = {
      timer: timerRef.current,
      speed: speedRef.current,
      progress: progressRef.current,
      endTitle: endTitleRef.current,
      endTime: endTimeRef.current,
      overlay: overlayRef.current,
      mobileControls: mobileControlsRef.current,
    };

    logicRef.current = new CarRacingLogic(canvas, uiRefs);
    logicRef.current.initialize(config);

    const handleResize = () => {
      if (logicRef.current) logicRef.current.resize();
    };

    const handleKeyDown = (e: KeyboardEvent) => handleInput(e.code, true);
    const handleKeyUp = (e: KeyboardEvent) => handleInput(e.code, false);

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (logicRef.current) logicRef.current.stopLoop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Sync config changes to Logic
  useEffect(() => {
    if (logicRef.current) {
      logicRef.current.updateConfig(config);
    }
  }, [config]);

  const handleInput = (code: string, isDown: boolean) => {
    if (!logicRef.current) return;
    switch (code) {
      case "ArrowUp":
      case "KeyW":
        logicRef.current.setInput("up", isDown);
        break;
      case "ArrowDown":
      case "KeyS":
        logicRef.current.setInput("down", isDown);
        break;
      case "ArrowLeft":
      case "KeyA":
        logicRef.current.setInput("left", isDown);
        break;
      case "ArrowRight":
      case "KeyD":
        logicRef.current.setInput("right", isDown);
        break;
    }
  };

  const generateNewTrack = () => {
    if (logicRef.current) {
      logicRef.current.generateTrack(config.trackComplexity);
      setViewModeText("View Full Map");
    }
  };

  const toggleView = () => {
    if (logicRef.current) {
      const mode = logicRef.current.toggleViewMode();
      setViewModeText(mode === "FOLLOW" ? "View Full Map" : "Follow Car");
    }
  };

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-between h-12 px-4 pl-12 sm:pl-4">
        <h1 className="text-lg">Car Racing {CARRACING_VERSION}</h1>
      </div>
      <div className="flex-1 p-4 overflow-auto relative">
        <canvas
          ref={canvasRef}
          className="border border-accent block w-full h-full"
        />
        {/* --- Settings UI --- */}
        <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md text-white p-4 rounded-xl border border-white/10 w-72 shadow-xl z-20">
          <h1 className="text-base font-bold text-blue-400 mb-2 uppercase tracking-wider">
            Track Generator
          </h1>

          {/* Controls */}
          <div className="mb-2">
            <label className="block text-gray-400 text-sm mb-1">
              Lanes: {config.laneCount}
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={config.laneCount}
              onChange={(e) =>
                setConfig({ ...config, laneCount: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-400 text-sm mb-1">
              Lane Width: {config.laneWidth}px
            </label>
            <input
              type="range"
              min="40"
              max="100"
              value={config.laneWidth}
              onChange={(e) =>
                setConfig({ ...config, laneWidth: Number(e.target.value) })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-400 text-sm mb-1">
              Complexity
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              value={config.trackComplexity}
              onChange={(e) =>
                setConfig({
                  ...config,
                  trackComplexity: Number(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="chkCrash"
              checked={config.crashOnEdge}
              onChange={(e) =>
                setConfig({ ...config, crashOnEdge: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="chkCrash"
              className="ml-2 text-sm font-medium text-gray-300"
            >
              Hard Mode (Crash)
            </label>
          </div>

          <button
            onClick={toggleView}
            className="w-full py-2 mb-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded transition-colors text-sm"
          >
            {viewModeText}
          </button>
          <button
            onClick={generateNewTrack}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition-colors text-sm"
          >
            Generate New Track
          </button>

          <div className="text-xs text-gray-500 mt-2 text-center">
            Arrows / WASD to drive
          </div>

          <div className="mt-2 pt-2 border-t border-white/20 font-mono text-base">
            Progress: <span ref={progressRef}>0%</span>
          </div>
        </div>

        {/* --- HUD --- */}
        <div className="absolute top-5 right-5 text-right pointer-events-none z-10">
          <div
            ref={timerRef}
            className="text-white font-mono text-3xl font-bold drop-shadow-md"
          >
            00:00.00
          </div>
          <div
            ref={speedRef}
            className="text-white font-mono text-2xl font-bold drop-shadow-md"
          >
            0 km/h
          </div>
        </div>

        {/* --- Overlay (End Game) --- */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex items-center justify-center bg-black/70 z-30 opacity-0 pointer-events-none transition-opacity duration-300"
        >
          <div className="bg-white p-10 rounded-2xl text-center shadow-2xl max-w-md w-full mx-4">
            <h2
              ref={endTitleRef}
              className="text-4xl font-bold text-gray-800 mb-2"
            >
              FINISHED!
            </h2>
            <p
              ref={endTimeRef}
              className="text-xl text-gray-600 mb-6 font-mono"
            >
              Time: 00:00.00
            </p>
            <button
              onClick={generateNewTrack}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-transform active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>

        {/* --- Mobile Controls --- */}
        <div
          ref={mobileControlsRef}
          className="absolute bottom-5 left-0 w-full h-36 hidden z-20 pointer-events-none"
        >
          <div
            onTouchStart={(e) => {
              e.preventDefault();
              handleInput("ArrowLeft", true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleInput("ArrowLeft", false);
            }}
            className="absolute left-5 bottom-5 w-20 h-20 bg-white/20 border-2 border-white/50 rounded-full flex items-center justify-center text-white text-2xl pointer-events-auto select-none active:bg-white/40"
          >
            ◀
          </div>

          <div
            onTouchStart={(e) => {
              e.preventDefault();
              handleInput("ArrowRight", true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleInput("ArrowRight", false);
            }}
            className="absolute left-28 bottom-5 w-20 h-20 bg-white/20 border-2 border-white/50 rounded-full flex items-center justify-center text-white text-2xl pointer-events-auto select-none active:bg-white/40"
          >
            ▶
          </div>

          <div
            onTouchStart={(e) => {
              e.preventDefault();
              handleInput("ArrowDown", true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleInput("ArrowDown", false);
            }}
            className="absolute right-28 bottom-5 w-20 h-20 bg-red-500/30 border-2 border-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold pointer-events-auto select-none active:bg-red-500/50"
          >
            STOP
          </div>

          <div
            onTouchStart={(e) => {
              e.preventDefault();
              handleInput("ArrowUp", true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleInput("ArrowUp", false);
            }}
            className="absolute right-5 bottom-5 w-20 h-20 bg-green-500/30 border-2 border-green-500 rounded-full flex items-center justify-center text-white text-2xl pointer-events-auto select-none active:bg-green-500/50"
          >
            ▲
          </div>
        </div>
      </div>
    </div>
  );
};
export default CarRacing;
