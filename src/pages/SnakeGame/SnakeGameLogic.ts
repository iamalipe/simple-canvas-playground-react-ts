class SnakeGameLogic {
  gridSize: number;
  fps: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  snake: { x: number; y: number }[];
  snakeDirection: "LEFT" | "RIGHT" | "UP" | "DOWN";
  food: { x: number; y: number };
  // const boundingClientRect = canvas.getBoundingClientRect();

  constructor(canvas: HTMLCanvasElement, gridSize: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gridSize = gridSize;
    this.fps = 60;
    this.snake = [];
    this.snakeDirection = "DOWN";
    this.food = { x: 0, y: 0 };
  }

  initialize() {
    this.setBackground();
    this.snake = [
      { x: this.gridSize * 2, y: this.gridSize * 4 },
      { x: this.gridSize * 2, y: this.gridSize * 3 },
      { x: this.gridSize * 2, y: this.gridSize * 2 },
    ];
    this.generateFood();
    this.drawFood();
    this.drawSnake();
  }

  handleKeyUp(event: KeyboardEvent) {
    // Handle user input to change snake direction
    console.log(event);
  }

  startGame() {
    setInterval(() => {
      // Call the game loop logic here
      this.gameLoop();
    }, 1000); // Adjust the speed as needed
  }

  handleKeyDown(event: KeyboardEvent) {
    // Handle user input to change snake direction
    switch (event.key) {
      case "ArrowUp":
        if (this.snakeDirection !== "DOWN") this.snakeDirection = "UP";
        break;
      case "ArrowDown":
        if (this.snakeDirection !== "UP") this.snakeDirection = "DOWN";
        break;
      case "ArrowLeft":
        if (this.snakeDirection !== "RIGHT") this.snakeDirection = "LEFT";
        break;
      case "ArrowRight":
        if (this.snakeDirection !== "LEFT") this.snakeDirection = "RIGHT";
        break;
      default:
        break;
    }
  }

  gameLoop() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.moveSnake();

    if (this.checkCollision()) {
      // Handle game over logic here
      console.log("Game Over!");
      return;
    }

    this.drawFood();
    this.drawSnake();
  }

  moveSnake() {
    const head = { ...this.snake[0] };

    switch (this.snakeDirection) {
      case "UP":
        head.y -= this.gridSize;
        break;
      case "DOWN":
        head.y += this.gridSize;
        break;
      case "LEFT":
        head.x -= this.gridSize;
        break;
      case "RIGHT":
        head.x += this.gridSize;
        break;
      default:
        break;
    }

    // Add the new head to the beginning of the snake array
    this.snake.unshift(head);

    // Remove the tail to keep the snake's length consistent
    if (this.snake.length > 1) {
      this.snake.pop();
    }
  }

  checkCollision() {
    return false;
  }

  drawSnake() {
    this.snake.forEach((segment, index) => {
      if (!this.ctx) return;
      if (index === 0) this.ctx.fillStyle = "darkgreen";
      else this.ctx.fillStyle = "green";
      this.ctx?.fillRect(segment.x, segment.y, this.gridSize, this.gridSize);
    });
  }

  drawFood() {
    if (!this.ctx) return;
    this.ctx.fillStyle = "red"; // Food color
    this.ctx?.fillRect(this.food.x, this.food.y, this.gridSize, this.gridSize);
  }

  generateFood() {
    // Generate random food position
    this.food = {
      x:
        Math.floor(Math.random() * (this.canvas.width / this.gridSize)) *
        this.gridSize,
      y:
        Math.floor(Math.random() * (this.canvas.height / this.gridSize)) *
        this.gridSize,
    };
  }

  setBackground() {
    if (!this.ctx) return;
    const color1 = getComputedStyle(document.documentElement).getPropertyValue(
      "--b3"
    );
    this.ctx.beginPath();
    this.ctx.strokeStyle = `hsl(${color1})`;
    for (let x = 0.5; x < this.canvas.width; x += this.gridSize) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
    }
    for (let y = 0.5; y < this.canvas.height; y += this.gridSize) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
    }

    this.ctx.stroke();
  }
}

export default SnakeGameLogic;
