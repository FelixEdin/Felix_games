const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Sätt canvas till fullskärm
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const boxSize = 20; // Storlek på varje ruta
let score = 0;

// Ormens startposition och riktning
let snake = [{ x: 9 * boxSize, y: 10 * boxSize }];
let direction;
let food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
};

// Funktion för att rita ormen
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "lightgreen"; // Huvudet är grönt, kroppen ljusgrön
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
}

// Funktion för att skapa mat
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// Lyssnar på tangenttryckningar för att styra ormen
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
}

// Uppdatera spelets logik
function update() {
    // Ormens position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Flytta ormen beroende på riktning
    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "UP") snakeY -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;
    if (direction === "DOWN") snakeY += boxSize;

    // Om ormen äter maten
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").textContent = score;
        food = {
            x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
            y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize,
        };
    } else {
        // Ta bort den sista delen av ormen om den inte växer
        snake.pop();
    }

    // Skapar ormens nya huvud
    const newHead = {
        x: snakeX,
        y: snakeY,
    };

    // Kontrollera om ormen krockar med sig själv eller väggen
    if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        alert("Spelet över! Din poäng: " + score);
        location.reload();
    }

    snake.unshift(newHead); // Lägg till nytt huvud till ormen
}

// Kontrollera om ormen krockar med sig själv
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Funktion för att köra spelet
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
    drawFood(); // Rita mat
    drawSnake(); // Rita ormen
    update(); // Uppdatera spelet
}

// Starta spelet var 100ms
let game = setInterval(gameLoop, 100);
