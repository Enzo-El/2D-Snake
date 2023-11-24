const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const tryAgainButton = document.getElementById('try-again-button');
const speedButtons = document.querySelectorAll('.speed-button');
const gameContainer = document.getElementById('game-container');

// Declaration of the variables to be used in the snake game.
let gridSize = 20;
let canvasSize = calculateCanvasSize();
let snake = [{ x: 5, y: 5 }];
let direction = 'right';
let food = generateFood();
let gameRunning = false;
let speedLevel = 150; // Default speed

let intervalId;

// Triggers the start/restart of the snake game.
startButton.addEventListener('click', startGame);
tryAgainButton.addEventListener('click', tryAgain);

// This is for the speed setting within the Speed Buttons.
speedButtons.forEach((button, index) => {
    button.addEventListener('click', () => setSpeed(index + 1));
});

// This will add event listener for keyboard input (arrow keys) for snake movement.
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

// Function to calculate the playable area.
function calculateCanvasSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.min(width, height);
}

// Function to formally start the snake game.
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startButton.disabled = true;
        tryAgainButton.classList.add('hidden');
        speedButtons.forEach(button => button.disabled = true);
        canvasSize = calculateCanvasSize();
        gridSize = Math.floor(canvasSize / 30); // Adjust grid size dynamically
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        intervalId = setInterval(update, speedLevel);
    }
}

// Function to try again once game over.
function tryAgain() {
    snake = [{ x: 5, y: 5 }];
    direction = 'right';
    food = generateFood();
    tryAgainButton.classList.add('hidden');
    clearInterval(intervalId);
    intervalId = setInterval(update, speedLevel);
}

// Function to set the speed of movement of the snake.
function setSpeed(level) {
    speedLevel = 150 / level;
    if (gameRunning) {
        clearInterval(intervalId);
        intervalId = setInterval(update, speedLevel);
    }
}

// Function to generate and respawn a random food.
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
}

// Function for movement of the Snake (head first logic) and getting larger when eating food.
function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    snake.unshift(head);
    if (!eatFood()) {
        snake.pop();
    }
}

// Function to check if there is a hit/collision in the playable area (canvas).
function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize ||
        checkSelfCollision()
    );
}

// Function to check if there is a hit/collision with the snake's body itself.
function checkSelfCollision() {
    const head = snake[0];
    return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
}

// Function for eating food.
function eatFood() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Function to draw the snake and the food.
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = 'green';
    for (const segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }

    // Draw Food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Function to end the game.
function endGame() {
    gameRunning = false;
    startButton.disabled = false;
    speedButtons.forEach(button => button.disabled = false);
    clearInterval(intervalId);
    tryAgainButton.classList.remove('hidden');
}

// Function to decide whether to end the game (if there is a collision/hit) or to continue (no hit/nor collision).
function update() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (eatFood()) {
        food = generateFood();
    }
    draw();
}
