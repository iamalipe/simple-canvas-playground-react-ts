import { useEffect, useRef, useState } from "react";

// --- Types ---
interface GameConfig {
  laneCount: number;
  laneWidth: number;
  trackComplexity: number;
  crashOnEdge: boolean;
}

interface UIRefs {
  timer: HTMLDivElement | null;
  speed: HTMLDivElement | null;
  progress: HTMLSpanElement | null;
  endTitle: HTMLHeadingElement | null;
  endTime: HTMLParagraphElement | null;
  overlay: HTMLDivElement | null;
  mobileControls: HTMLDivElement | null;
}

// --- Game Logic Engine ---
class CarRacingLogic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  uiRefs: UIRefs;

  // Game State
  state: "PLAYING" | "FINISHED" | "CRASHED" = "PLAYING";
  startTime: number = 0;
  endTime: number = 0;
  lastTime: number = 0;
  animationFrameId: number | null = null;

  // Camera
  camera = { x: 0, y: 0, zoom: 1 };
  viewMode: "FOLLOW" | "MAP" = "FOLLOW";
  trackBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

  // Physics Config
  config = {
    laneCount: 3,
    laneWidth: 60,
    trackSegmentLength: 40,
    grassColor: "#3a6b3a",
    roadColor: "#555555",
    lineColor: "#ffffff",
    shoulderColor: "#c0392b",
    shoulderAltColor: "#ecf0f1",
    crashOnEdge: false,
  };

  // Car Physics
  car = {
    x: 0,
    y: 0,
    width: 24,
    height: 44,
    angle: -Math.PI / 2,
    speed: 0,
    maxSpeed: 800,
    acceleration: 400,
    friction: 200,
    turnSpeed: 2.5,
    color: "#3498db",
    offRoad: false,
  };

  // Inputs
  input = { up: false, down: false, left: false, right: false };

  // Data
  track: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, uiRefs: UIRefs) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", {
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.uiRefs = uiRefs;

    // Bind loop
    this.gameLoop = this.gameLoop.bind(this);
  }

  initialize(initialConfig: GameConfig) {
    this.updateConfig(initialConfig);
    this.resize();
    this.generateTrack(initialConfig.trackComplexity);
    this.startLoop();
  }

  updateConfig(newConfig: GameConfig) {
    this.config.laneCount = newConfig.laneCount;
    this.config.laneWidth = newConfig.laneWidth;
    this.config.crashOnEdge = newConfig.crashOnEdge;
  }

  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // Detect mobile for UI visibility
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (this.uiRefs.mobileControls) {
      this.uiRefs.mobileControls.style.display = isMobile ? "block" : "none";
    }
  }

  setInput(key: keyof typeof this.input, value: boolean) {
    this.input[key] = value;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "FOLLOW" ? "MAP" : "FOLLOW";
    return this.viewMode;
  }

  startLoop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.lastTime = Date.now();
    this.gameLoop();
  }

  stopLoop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  // --- Logic Core ---

  generateTrack(complexity: number) {
    this.track = [];
    let x = 0;
    let y = 0;
    let angle = -Math.PI / 2;

    // Start Straight
    for (let i = 0; i < 5; i++) {
      this.track.push({ x, y });
      y -= this.config.trackSegmentLength;
    }

    // Procedural Generation
    for (let i = 0; i < complexity; i++) {
      const curvature = (Math.random() - 0.5) * 0.8;
      angle += curvature;
      if (angle > 0) angle = -0.1;
      if (angle < -Math.PI) angle = -Math.PI + 0.1;

      x += Math.cos(angle) * this.config.trackSegmentLength;
      y += Math.sin(angle) * this.config.trackSegmentLength;
      this.track.push({ x, y });
    }

    // End Straight
    for (let i = 0; i < 10; i++) {
      x += Math.cos(angle) * this.config.trackSegmentLength;
      y += Math.sin(angle) * this.config.trackSegmentLength;
      this.track.push({ x, y });
    }

    this.track = this.smoothTrack(this.track, 4);
    this.updateTrackBounds();
    this.resetCar();

    this.state = "PLAYING";
    this.startTime = Date.now();

    // Hide overlay directly
    if (this.uiRefs.overlay) this.uiRefs.overlay.style.opacity = "0";
    if (this.uiRefs.overlay) this.uiRefs.overlay.style.pointerEvents = "none";
  }

  smoothTrack(points: { x: number; y: number }[], iterations: number) {
    let smoothed = [...points];
    for (let iter = 0; iter < iterations; iter++) {
      let newPoints = [smoothed[0]];
      for (let i = 1; i < smoothed.length - 1; i++) {
        const prev = smoothed[i - 1];
        const curr = smoothed[i];
        const next = smoothed[i + 1];
        newPoints.push({
          x: (prev.x + curr.x + next.x) / 3,
          y: (prev.y + curr.y + next.y) / 3,
        });
      }
      newPoints.push(smoothed[smoothed.length - 1]);
      smoothed = newPoints;
    }
    return smoothed;
  }

  updateTrackBounds() {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    this.track.forEach((p) => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    const margin = (this.config.laneCount * this.config.laneWidth) / 2 + 150;
    this.trackBounds = {
      minX: minX - margin,
      maxX: maxX + margin,
      minY: minY - margin,
      maxY: maxY + margin,
    };
  }

  resetCar() {
    if (this.track.length > 1) {
      const p1 = this.track[0];
      const p2 = this.track[1];
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      this.car.x = p1.x;
      this.car.y = p1.y;
      this.car.angle = angle;
      this.car.speed = 0;
    }
  }

  // --- Update Loop ---

  gameLoop() {
    const now = Date.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.updatePhysics(dt);
    this.draw();
    this.updateHUD();

    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  }

  updatePhysics(dt: number) {
    if (this.state !== "PLAYING") return;

    // Acceleration
    if (this.input.up) this.car.speed += this.car.acceleration * dt;
    else if (this.input.down) this.car.speed -= this.car.acceleration * dt;
    else {
      if (this.car.speed > 0) this.car.speed -= this.car.friction * dt;
      if (this.car.speed < 0) this.car.speed += this.car.friction * dt;
      if (Math.abs(this.car.speed) < 10) this.car.speed = 0;
    }

    // Steering
    if (Math.abs(this.car.speed) > 10) {
      const dir = this.car.speed > 0 ? 1 : -1;
      if (this.input.left) this.car.angle -= this.car.turnSpeed * dt * dir;
      if (this.input.right) this.car.angle += this.car.turnSpeed * dt * dir;
    }

    // Movement
    this.car.x += Math.cos(this.car.angle) * this.car.speed * dt;
    this.car.y += Math.sin(this.car.angle) * this.car.speed * dt;

    this.checkOffRoad();
    this.checkProgress();

    // Speed Caps
    const currentMax = this.car.offRoad ? 150 : this.car.maxSpeed;
    if (this.car.speed > currentMax) this.car.speed = currentMax;
    if (this.car.speed < -currentMax / 2) this.car.speed = -currentMax / 2;

    // Camera
    let targetX, targetY, targetZoom;
    if (this.viewMode === "MAP") {
      const w = this.trackBounds.maxX - this.trackBounds.minX;
      const h = this.trackBounds.maxY - this.trackBounds.minY;
      const scaleX = this.canvas.width / w;
      const scaleY = this.canvas.height / h;
      targetZoom = Math.min(scaleX, scaleY) * 0.9;
      targetX = (this.trackBounds.minX + this.trackBounds.maxX) / 2;
      targetY = (this.trackBounds.minY + this.trackBounds.maxY) / 2;
    } else {
      targetX = this.car.x;
      targetY = this.car.y;
      targetZoom = 1;
    }
    this.camera.x += (targetX - this.camera.x) * 5 * dt;
    this.camera.y += (targetY - this.camera.y) * 5 * dt;
    this.camera.zoom += (targetZoom - this.camera.zoom) * 5 * dt;
  }

  checkOffRoad() {
    let minDistSq = Infinity;

    // Optimization: Check surrounding segments only if we tracked index,
    // but linear scan is fast enough for <500 points
    for (let i = 0; i < this.track.length - 1; i++) {
      const p1 = this.track[i];
      const p2 = this.track[i + 1];
      const distSq = this.distToSegmentSquared(
        this.car.x,
        this.car.y,
        p1.x,
        p1.y,
        p2.x,
        p2.y
      );
      if (distSq < minDistSq) {
        minDistSq = distSq;
      }
    }

    const totalTrackWidth = this.config.laneCount * this.config.laneWidth;
    const safeDist = totalTrackWidth / 2 - this.car.width / 2;

    if (minDistSq > safeDist * safeDist) {
      this.car.offRoad = true;
      if (this.config.crashOnEdge) this.endGame(false);
    } else {
      this.car.offRoad = false;
    }
  }

  checkProgress() {
    let minDist = Infinity;
    let idx = 0;
    for (let i = 0; i < this.track.length; i++) {
      const d =
        (this.car.x - this.track[i].x) ** 2 +
        (this.car.y - this.track[i].y) ** 2;
      if (d < minDist) {
        minDist = d;
        idx = i;
      }
    }

    const pct = Math.min(100, Math.floor((idx / this.track.length) * 100));
    if (this.uiRefs.progress) this.uiRefs.progress.innerText = pct + "%";

    if (idx >= this.track.length - 2) {
      this.endGame(true);
    }
  }

  endGame(finished: boolean) {
    if (this.state !== "PLAYING") return;

    this.state = finished ? "FINISHED" : "CRASHED";
    this.endTime = Date.now();

    const timeStr = this.formatTime(this.endTime - this.startTime);

    if (this.uiRefs.endTitle) {
      this.uiRefs.endTitle.innerText = finished ? "FINISHED!" : "CRASHED!";
      this.uiRefs.endTitle.style.color = finished ? "#2c3e50" : "#e74c3c";
    }
    if (this.uiRefs.endTime) {
      this.uiRefs.endTime.innerText = finished
        ? `Time: ${timeStr}`
        : "You went off track!";
    }
    if (this.uiRefs.overlay) {
      this.uiRefs.overlay.style.opacity = "1";
      this.uiRefs.overlay.style.pointerEvents = "auto";
    }
  }

  // --- Rendering ---

  draw() {
    // Background
    this.ctx.fillStyle = this.config.grassColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();

    // Camera
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    this.ctx.translate(cx, cy);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    this.drawTrack();
    this.drawCar();

    this.ctx.restore();
  }

  drawTrack() {
    const totalWidth = this.config.laneCount * this.config.laneWidth;

    // Road
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = this.config.roadColor;
    this.ctx.lineWidth = totalWidth;
    this.ctx.beginPath();
    if (this.track.length > 0)
      this.ctx.moveTo(this.track[0].x, this.track[0].y);
    for (let i = 1; i < this.track.length; i++)
      this.ctx.lineTo(this.track[i].x, this.track[i].y);
    this.ctx.stroke();

    // Borders
    this.ctx.strokeStyle = "#000000";
    this.ctx.lineWidth = totalWidth + 4;
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = "source-over";

    // Curbs (Stripes)
    this.ctx.strokeStyle = this.config.shoulderColor;
    this.ctx.lineWidth = totalWidth + 20;
    this.ctx.setLineDash([40, 40]);
    this.ctx.lineDashOffset = 0;
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.stroke();

    this.ctx.strokeStyle = this.config.shoulderAltColor;
    this.ctx.lineDashOffset = 40;
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.setLineDash([]);

    // Lane Markers
    if (this.config.laneCount > 1) {
      this.ctx.strokeStyle = this.config.lineColor;
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([20, 30]);
      const halfWidth = totalWidth / 2;
      for (let l = 1; l < this.config.laneCount; l++) {
        const offset = -halfWidth + l * this.config.laneWidth;
        this.drawOffsetPath(offset);
      }
      this.ctx.setLineDash([]);
    }

    // Start/Finish Lines
    if (this.track.length > 0) {
      this.drawCheckeredLine(this.track[0], this.track[1], totalWidth);
      this.drawCheckeredLine(
        this.track[this.track.length - 2],
        this.track[this.track.length - 1],
        totalWidth
      );
    }
  }

  drawOffsetPath(offset: number) {
    this.ctx.beginPath();
    for (let i = 0; i < this.track.length - 1; i++) {
      const p1 = this.track[i];
      const p2 = this.track[i + 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;

      const ox1 = p1.x + nx * offset;
      const oy1 = p1.y + ny * offset;
      const ox2 = p2.x + nx * offset;
      const oy2 = p2.y + ny * offset;

      if (i === 0) this.ctx.moveTo(ox1, oy1);
      this.ctx.lineTo(ox2, oy2);
    }
    this.ctx.stroke();
  }

  drawCheckeredLine(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    width: number
  ) {
    this.ctx.save();
    this.ctx.translate(p1.x, p1.y);
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    this.ctx.rotate(angle);

    const checkW = width / 8;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, -width / 2, 20, width);
    this.ctx.fillStyle = "black";
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 0)
          this.ctx.fillRect(r * 10, -width / 2 + c * checkW, 10, checkW);
      }
    }
    this.ctx.restore();
  }

  drawCar() {
    this.ctx.save();
    this.ctx.translate(this.car.x, this.car.y);
    this.ctx.rotate(this.car.angle);

    // Shadow
    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.ctx.fillRect(
      -this.car.height / 2 + 5,
      -this.car.width / 2 + 5,
      this.car.height,
      this.car.width
    );

    // Body
    this.ctx.fillStyle = this.car.color;
    this.ctx.fillRect(
      -this.car.height / 2,
      -this.car.width / 2,
      this.car.height,
      this.car.width
    );

    // Windshield & Roof
    this.ctx.fillStyle = "#aaddff";
    this.ctx.fillRect(0, -this.car.width / 2 + 2, 10, this.car.width - 4);
    this.ctx.fillStyle = "#2980b9";
    this.ctx.fillRect(-10, -this.car.width / 2 + 2, 10, this.car.width - 4);

    // Lights
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.car.height / 2 - 2, -this.car.width / 2 + 2, 2, 6);
    this.ctx.fillRect(this.car.height / 2 - 2, this.car.width / 2 - 8, 2, 6);

    // Brake Lights
    this.ctx.fillStyle = this.input.down ? "#ff0000" : "#880000";
    if (this.input.down) {
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = "red";
    }
    this.ctx.fillRect(-this.car.height / 2, -this.car.width / 2 + 2, 2, 6);
    this.ctx.fillRect(-this.car.height / 2, this.car.width / 2 - 8, 2, 6);

    this.ctx.restore();
  }

  updateHUD() {
    if (this.state === "PLAYING") {
      const timeMs = Date.now() - this.startTime;
      if (this.uiRefs.timer)
        this.uiRefs.timer.innerText = this.formatTime(timeMs);
    }
    if (this.uiRefs.speed) {
      this.uiRefs.speed.innerText =
        Math.floor(Math.abs(this.car.speed) * 0.1) + " km/h";
    }
  }

  // --- Utilities ---

  formatTime(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }.${millis < 10 ? "0" + millis : millis}`;
  }

  distToSegmentSquared(
    pX: number,
    pY: number,
    vX: number,
    vY: number,
    wX: number,
    wY: number
  ) {
    const l2 = (vX - wX) ** 2 + (vY - wY) ** 2;
    if (l2 === 0) return (pX - vX) ** 2 + (pY - vY) ** 2;
    let t = ((pX - vX) * (wX - vX) + (pY - vY) * (wY - vY)) / l2;
    t = Math.max(0, Math.min(1, t));
    return (pX - (vX + t * (wX - vX))) ** 2 + (pY - (vY + t * (wY - vY))) ** 2;
  }
}

// --- Main React Component ---

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

  // Initialize Logic
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
  }, []); // Run once on mount

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
    <div className="flex w-full h-screen bg-gray-900 overflow-hidden relative">
      <style>{`
        /* Custom ranges and scrollbar */
        input[type=range] { accent-color: #3498db; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      `}</style>

      {/* --- Game Canvas --- */}
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* --- Settings UI --- */}
      <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md text-white p-5 rounded-xl border border-white/10 w-72 shadow-xl z-20">
        <h1 className="text-xl font-bold text-blue-400 mb-4 uppercase tracking-wider">
          Track Generator
        </h1>

        {/* Controls */}
        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Complexity</label>
          <input
            type="range"
            min="50"
            max="300"
            value={config.trackComplexity}
            onChange={(e) =>
              setConfig({ ...config, trackComplexity: Number(e.target.value) })
            }
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center mb-4">
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

        <div className="mt-4 pt-4 border-t border-white/20 font-mono text-lg">
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
          <p ref={endTimeRef} className="text-xl text-gray-600 mb-6 font-mono">
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
  );
};

export default CarRacing;
