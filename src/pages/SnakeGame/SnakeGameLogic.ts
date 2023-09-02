class SnakeGameLogic {
  gridSize: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  snake: { x: number; y: number }[] = [];
  snakeDirection: "LEFT" | "RIGHT" | "UP" | "DOWN" = "DOWN";
  food = { x: 0, y: 0 };
  speed = 50;
  score = 0;
  onScoreChange: ((score: number) => void) | undefined;
  onGameOver: ((lastScore: number) => void) | undefined;
  // const boundingClientRect = canvas.getBoundingClientRect();

  constructor(
    canvas: HTMLCanvasElement,
    gridSize: number,
    action?: {
      onScoreChange?: (score: number) => void;
      onGameOver?: (lastScore: number) => void;
    }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.gridSize = gridSize;
    if (action) {
      this.onScoreChange = action.onScoreChange;
      this.onGameOver = action.onGameOver;
    }
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

  startGame() {
    setInterval(() => {
      // Call the game loop logic here
      this.gameLoop();
    }, 500 - this.speed * 10); // Adjust the speed as needed
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
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.setBackground();
    this.moveSnake();

    if (this.checkCollision()) {
      // Handle game over logic here
      this.gameOver();
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

  checkCollision() {
    // Check collision with walls
    if (
      this.snake[0].x < 0 ||
      this.snake[0].x >= this.canvas.width ||
      this.snake[0].y < 0 ||
      this.snake[0].y >= this.canvas.height
    ) {
      return true; // Snake collided with the wall
    }

    // Check collision with itself
    for (let i = 1; i < this.snake.length; i++) {
      if (
        this.snake[i].x === this.snake[0].x &&
        this.snake[i].y === this.snake[0].y
      ) {
        return true; // Snake collided with itself
      }
    }

    // Check collision with food
    if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
      // Snake ate the food
      this.eatFood();
    }

    return false; // No collisions
  }

  eatFood() {
    // Generate a new food item
    this.generateFood();

    // Increase the score
    this.score++;
    this.onScoreChange && this.onScoreChange(this.score);

    // Increase the snake's speed as the score increases (you can adjust this logic)
    // this.score % 5 === 0 mean every 5 score speed + 1
    // max speed 45 mean gameLoop render every 50 ms
    if (this.score > 1 && this.score % 5 === 0 && this.speed < 45) {
      this.speed++;
    }

    // You can also increase the length of the snake here if needed

    // For example, you can add a new segment at the end of the snake:
    const tail = {
      x: this.snake[this.snake.length - 1].x,
      y: this.snake[this.snake.length - 1].y,
    };
    this.snake.push(tail);
  }

  gameOver() {
    if (!this.ctx) return;
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const lastScore = this.score;
    // Reset the game state
    this.snake = [];
    this.snakeDirection = "DOWN";
    this.score = 0;
    this.speed = 1;

    // Notify the score change (you can update this logic as needed)
    this.onScoreChange && this.onScoreChange(this.score);
    this.onGameOver && this.onGameOver(lastScore);

    // Restart the game by initializing it again
    this.initialize();
  }
}

export default SnakeGameLogic;
