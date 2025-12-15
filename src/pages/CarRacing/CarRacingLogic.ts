// --- Types ---
export interface GameConfig {
  laneCount: number;
  laneWidth: number;
  trackComplexity: number;
  crashOnEdge: boolean;
  showSensors: boolean;
  aiMode: boolean;
}

export interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  speed: number;
  maxSpeed: number;
  acceleration: number;
  friction: number;
  turnSpeed: number;
  color: string;
  offRoad: boolean;
  sensor: Sensor | null;
  brain: NeuralNetwork | null;
}

export interface UIRefs {
  timer: HTMLDivElement | null;
  speed: HTMLDivElement | null;
  progress: HTMLSpanElement | null;
  endTitle: HTMLHeadingElement | null;
  endTime: HTMLParagraphElement | null;
  overlay: HTMLDivElement | null;
  mobileControls: HTMLDivElement | null;
}
// --- Math Helpers ---
function lerp(A: number, B: number, t: number) {
  return A + (B - A) * t;
}

function getIntersection(
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number },
  D: { x: number; y: number }
) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}

// --- Neural Network Classes ---
class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }
    Level.#randomize(this);
  }

  static #randomize(level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs: number[], level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }
    return level.outputs;
  }
}

class NeuralNetwork {
  levels: Level[];
  constructor(neuronCounts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs: number[], network: NeuralNetwork) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  // Basic mutation for Phase 3
  static mutate(network: NeuralNetwork, amount: number = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

// --- Sensor Class ---
class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;
  rays: { x: number; y: number }[][];
  readings: ({ x: number; y: number; offset: number } | null)[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2; // 90 degrees
    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: { x: number; y: number }[][]) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders));
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength, // Standard math rotation fix
        // Note: car.angle logic in main loop uses cos for X, sin for Y.
        // Let's match the car's coordinate system exactly.
        // In main loop: x += Math.cos(angle), y += Math.sin(angle)
      };

      // Re-calculating end based on main loop coordinate system
      // Car angle 0 faces RIGHT. -PI/2 faces UP.
      // We want rays spreading around the car's facing direction.
      end.x = this.car.x + Math.cos(rayAngle) * this.rayLength;
      end.y = this.car.y + Math.sin(rayAngle) * this.rayLength;

      this.rays.push([start, end]);
    }
  }

  #getReading(
    ray: { x: number; y: number }[],
    roadBorders: { x: number; y: number }[][]
  ) {
    const touches = [];

    for (let i = 0; i < roadBorders.length; i++) {
      const border = roadBorders[i];
      for (let j = 1; j < border.length; j++) {
        const touch = getIntersection(ray[0], ray[1], border[j - 1], border[j]);
        if (touch) {
          touches.push(touch);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset == minOffset) || null;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i]!;
      }

      // Draw visible ray (Yellow)
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw collision ray part (Red - unseen by car but good for debug)
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
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
    showSensors: true,
    aiMode: false,
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
    sensor: null as Sensor | null,
    brain: null as NeuralNetwork | null,
  };

  // Inputs
  input = { up: false, down: false, left: false, right: false };

  // Data
  track: { x: number; y: number }[] = [];
  roadBorders: { x: number; y: number }[][] = []; // [LeftBorderPoints, RightBorderPoints]

  constructor(canvas: HTMLCanvasElement, uiRefs: UIRefs) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", {
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.uiRefs = uiRefs;
    this.car.sensor = new Sensor(this.car);
    // 5 inputs (sensors), 6 hidden neurons, 4 outputs (Up,Down,Left,Right)
    this.car.brain = new NeuralNetwork([this.car.sensor.rayCount, 6, 4]);
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
    this.config.showSensors = newConfig.showSensors;
    this.config.aiMode = newConfig.aiMode; // added
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
    this.computeTrackBorders();
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
      const newPoints = [smoothed[0]];
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

  computeTrackBorders() {
    // Calculate Left and Right borders based on track spine
    // These are used for raycasting intersection
    const width = (this.config.laneCount * this.config.laneWidth) / 2;
    const leftBorder = [];
    const rightBorder = [];

    for (let i = 0; i < this.track.length - 1; i++) {
      const p1 = this.track[i];
      const p2 = this.track[i + 1];

      // Normal calculation
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len; // Normal X
      const ny = dx / len; // Normal Y

      // Offset vertices
      leftBorder.push({
        x: p1.x + nx * width,
        y: p1.y + ny * width,
      });
      rightBorder.push({
        x: p1.x - nx * width,
        y: p1.y - ny * width,
      });

      // Add final point for last segment
      if (i === this.track.length - 2) {
        leftBorder.push({
          x: p2.x + nx * width,
          y: p2.y + ny * width,
        });
        rightBorder.push({
          x: p2.x - nx * width,
          y: p2.y - ny * width,
        });
      }
    }

    this.roadBorders = [leftBorder, rightBorder];
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
    // AI Control Logic
    if (this.config.aiMode && this.car.brain && this.car.sensor) {
      // Inputs: 1 - offset (so 1 is Close/Touching, 0 is Far)
      const offsets = this.car.sensor.readings.map((s) =>
        s == null ? 0 : 1 - s.offset
      );

      const outputs = NeuralNetwork.feedForward(offsets, this.car.brain);

      // Map outputs to controls [Up, Down, Left, Right]
      this.input.up = !!outputs[0];
      this.input.down = !!outputs[1];
      this.input.left = !!outputs[2];
      this.input.right = !!outputs[3];
    }
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

    // Sensors
    if (this.car.sensor) {
      this.car.sensor.update(this.roadBorders);
    }

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

    // DEBUG: Draw Calculated Borders for Sensors
    /*
    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    this.ctx.lineWidth = 2;
    this.roadBorders.forEach(border => {
        this.ctx.beginPath();
        if(border.length > 0) this.ctx.moveTo(border[0].x, border[0].y);
        for(let i=1; i<border.length; i++) this.ctx.lineTo(border[i].x, border[i].y);
        this.ctx.stroke();
    });
    */
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

    // Draw Sensors (Independent of car rotation in draw because sensor rays are absolute coords)
    if (this.config.showSensors && this.car.sensor) {
      this.car.sensor.draw(this.ctx);
    }
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

export default CarRacingLogic;
