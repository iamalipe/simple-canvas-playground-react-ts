import { useEffect, useRef, useState } from "react";
import SnakeGameLogic from "./SnakeGameLogic";

export const SNAKEGAME_VERSION = "v1.0.1";

const SnakeGame = () => {
  const [highlightedButton, setHighlightedButton] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<SnakeGameLogic | null>(null);
  const displayScoreRef = useRef<HTMLElement | null>(null);
  const highestScoreRef = useRef<HTMLElement | null>(null);

  // snake game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gridSize = 20;
    let highestScore = 0;

    const onScoreChange = (score: number) => {
      if (!displayScoreRef.current) return;
      displayScoreRef.current.innerText = score.toString();
    };
    const onGameOver = (lastScore: number) => {
      if (highestScore < lastScore) {
        if (!highestScoreRef.current) return;
        highestScoreRef.current.innerText = lastScore.toString();
      }
      highestScore = lastScore;
    };

    gameRef.current = new SnakeGameLogic(canvas, gridSize, {
      onScoreChange,
      onGameOver,
    });

    const keyDownHandler = (event: KeyboardEvent) => {
      if (!gameRef.current) return;
      gameRef.current.handleKeyDown(event);
      if (event.key === "ArrowUp") {
        setHighlightedButton((prev) => ({ ...prev, up: true }));
      } else if (event.key === "ArrowDown") {
        setHighlightedButton((prev) => ({ ...prev, down: true }));
      } else if (event.key === "ArrowLeft") {
        setHighlightedButton((prev) => ({ ...prev, left: true }));
      } else if (event.key === "ArrowRight") {
        setHighlightedButton((prev) => ({ ...prev, right: true }));
      }
    };

    const keyUpHandler = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setHighlightedButton((prev) => ({ ...prev, up: false }));
      } else if (event.key === "ArrowDown") {
        setHighlightedButton((prev) => ({ ...prev, down: false }));
      } else if (event.key === "ArrowLeft") {
        setHighlightedButton((prev) => ({ ...prev, left: false }));
      } else if (event.key === "ArrowRight") {
        setHighlightedButton((prev) => ({ ...prev, right: false }));
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
    window.addEventListener("keyup", keyUpHandler);
    window.addEventListener("resize", handleResize);
    handleResize();
    gameRef.current.initialize();
    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <div className="bg-base-200 flex-none flex items-center justify-between h-12 px-4">
        <h1 className="text-lg">Snake Game {SNAKEGAME_VERSION}</h1>
        <span>
          Highest score :{" "}
          <strong ref={highestScoreRef} id="display-highest-score">
            0
          </strong>{" "}
          | Score :{" "}
          <strong ref={displayScoreRef} id="display-score">
            0
          </strong>
        </span>
      </div>
      <div className="flex-1 p-4">
        <canvas
          ref={canvasRef}
          className="border border-accent w-full h-full"
        ></canvas>
      </div>
      <div className="flex-none flex flex-wrap gap-4 px-4 pb-4">
        <button
          className={`daisy-btn daisy-btn-accent daisy-btn-sm ${
            highlightedButton.up && "daisy-btn-outline"
          }`}
        >
          Up
        </button>
        <button
          className={`daisy-btn daisy-btn-accent daisy-btn-sm ${
            highlightedButton.down && "daisy-btn-outline"
          }`}
        >
          Down
        </button>
        <button
          className={`daisy-btn daisy-btn-accent daisy-btn-sm ${
            highlightedButton.left && "daisy-btn-outline"
          }`}
        >
          Left
        </button>
        <button
          className={`daisy-btn daisy-btn-accent daisy-btn-sm ${
            highlightedButton.right && "daisy-btn-outline"
          }`}
        >
          Right
        </button>
      </div>
    </div>
  );
};
export default SnakeGame;
