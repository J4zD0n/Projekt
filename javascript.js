function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 5) + 's';
        particlesContainer.appendChild(particle);
    }
}

let currentGame = null;
let gameLoops = {};

window.addEventListener('load', () => {
    createParticles();
    generateFood();
});

function startGame(gameType) {
    document.getElementById('gameMenu').style.display = 'none';
    document.querySelectorAll('.game-area').forEach(area => area.classList.remove('active'));
    document.getElementById(gameType + 'Game').classList.add('active');
    currentGame = gameType;
    
    if (gameType === 'snake') initSnake();
    else if (gameType === 'pong') initPong();
    else if (gameType === 'breakout') initBreakout();
    else if (gameType === 'asteroids') initAsteroids();
}

function backToMenu() {
    Object.values(gameLoops).forEach(loop => {
        if (loop) clearInterval(loop);
    });
    
    document.getElementById('gameMenu').style.display = 'grid';
    document.querySelectorAll('.game-area').forEach(area => area.classList.remove('active'));
    currentGame = null;
}

let snake, food, direction, snakeScore;

function initSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    snake = [{x: 200, y: 200}];
    direction = {x: 0, y: 0};
    snakeScore = 0;
    
    generateFood();
    updateSnakeScore();
    
    if (gameLoops.snake) clearInterval(gameLoops.snake);
    gameLoops.snake = setInterval(updateSnake, 100);
    
    drawSnake(ctx);
}

function updateSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    if (direction.x === 0 && direction.y === 0) {
        drawSnake(ctx);
        return;
    }
    
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameOver('snake');
        return;
    }
    
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver('snake');
            return;
        }
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        updateSnakeScore();
        generateFood();
    } else {
        snake.pop();
    }
    
    drawSnake(ctx);
}

function drawSnake(ctx) {
    const canvas = document.getElementById('snakeCanvas');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff00';
    for (let segment of snake) {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    }
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, 20, 20);
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
    
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            return;
        }
    }
}

function updateSnakeScore() {
    document.getElementById('snakeScore').textContent = `Energia: ${snakeScore}`;
}

function resetSnake() {
    initSnake();
}

let pongBall, player, computer, pongPlayerScore, pongComputerScore;

function initPong() {
    const canvas = document.getElementById('pongCanvas');
    
    pongBall = {x: 300, y: 150, dx: 4, dy: 4, size: 10};
    player = {x: 10, y: 125, width: 10, height: 50, dy: 0};
    computer = {x: 580, y: 125, width: 10, height: 50};
    pongPlayerScore = 0;
    pongComputerScore = 0;
    
    updatePongScore();
    
    if (gameLoops.pong) clearInterval(gameLoops.pong);
    gameLoops.pong = setInterval(updatePong, 1000/60);
    
    const ctx = canvas.getContext('2d');
    drawPong(ctx);
}

function updatePong() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    pongBall.x += pongBall.dx;
    pongBall.y += pongBall.dy;
    
    if (pongBall.y <= 0 || pongBall.y >= canvas.height - pongBall.size) {
        pongBall.dy = -pongBall.dy;
    }
    
    if (pongBall.x <= player.x + player.width && 
        pongBall.y >= player.y && pongBall.y <= player.y + player.height) {
        pongBall.dx = Math.abs(pongBall.dx);
    }
    
    if (pongBall.x >= computer.x - pongBall.size && 
        pongBall.y >= computer.y && pongBall.y <= computer.y + computer.height) {
        pongBall.dx = -Math.abs(pongBall.dx);
    }
    
    if (pongBall.x < 0) {
        pongComputerScore++;
        resetPongBall();
        updatePongScore();
    } else if (pongBall.x > canvas.width) {
        pongPlayerScore++;
        resetPongBall();
        updatePongScore();
    }
    
    player.y += player.dy;
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
    
    if (computer.y + computer.height/2 < pongBall.y) {
        computer.y += 3;
    } else {
        computer.y -= 3;
    }
    computer.y = Math.max(0, Math.min(canvas.height - computer.height, computer.y));
    
    drawPong(ctx);
}

function drawPong(ctx) {
    const canvas = document.getElementById('pongCanvas');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
    
    ctx.beginPath();
    ctx.arc(pongBall.x, pongBall.y, pongBall.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
}

function resetPongBall() {
    const canvas = document.getElementById('pongCanvas');
    pongBall.x = canvas.width / 2;
    pongBall.y = canvas.height / 2;
    pongBall.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    pongBall.dy = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function updatePongScore() {
    document.getElementById('pongScore').textContent = `Człowiek: ${pongPlayerScore} | AI: ${pongComputerScore}`;
}

function resetPong() {
    initPong();
}

let breakoutBall, breakoutPaddle, breakoutBricks, breakoutScore, breakoutLives;

function initBreakout() {
    const canvas = document.getElementById('breakoutCanvas');
    
    breakoutBall = {x: 250, y: 350, dx: 4, dy: -4, size: 8};
    breakoutPaddle = {x: 200, y: 370, width: 100, height: 10, dx: 0};
    breakoutScore = 0;
    breakoutLives = 3;
    
    breakoutBricks = [];
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 10; col++) {
            breakoutBricks.push({
                x: col * 50,
                y: row * 20 + 50,
                width: 45,
                height: 15,
                alive: true
            });
        }
    }
    
    updateBreakoutScore();
    
    if (gameLoops.breakout) clearInterval(gameLoops.breakout);
    gameLoops.breakout = setInterval(updateBreakout, 1000/60);
    
    const ctx = canvas.getContext('2d');
    drawBreakout(ctx);
}

function updateBreakout() {
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    
    breakoutBall.x += breakoutBall.dx;
    breakoutBall.y += breakoutBall.dy;
    
    if (breakoutBall.x <= 0 || breakoutBall.x >= canvas.width - breakoutBall.size) {
        breakoutBall.dx = -breakoutBall.dx;
    }
    if (breakoutBall.y <= 0) {
        breakoutBall.dy = -breakoutBall.dy;
    }
    
    if (breakoutBall.y + breakoutBall.size >= breakoutPaddle.y &&
        breakoutBall.x >= breakoutPaddle.x && 
        breakoutBall.x <= breakoutPaddle.x + breakoutPaddle.width) {
        breakoutBall.dy = -breakoutBall.dy;
    }
    
    if (breakoutBall.y > canvas.height) {
        breakoutLives--;
        if (breakoutLives <= 0) {
            gameOver('breakout');
            return;
        }
        breakoutBall.x = 250;
        breakoutBall.y = 350;
        breakoutBall.dx = 4;
        breakoutBall.dy = -4;
        updateBreakoutScore();
    }
    
    for (let brick of breakoutBricks) {
        if (brick.alive &&
            breakoutBall.x >= brick.x && breakoutBall.x <= brick.x + brick.width &&
            breakoutBall.y >= brick.y && breakoutBall.y <= brick.y + brick.height) {
            brick.alive = false;
            breakoutBall.dy = -breakoutBall.dy;
            breakoutScore += 10;
            updateBreakoutScore();
            break;
        }
    }
    
    if (breakoutBricks.every(brick => !brick.alive)) {
        gameOver('breakout', true);
        return;
    }
    
    breakoutPaddle.x += breakoutPaddle.dx;
    breakoutPaddle.x = Math.max(0, Math.min(canvas.width - breakoutPaddle.width, breakoutPaddle.x));
    
    drawBreakout(ctx);
}

function drawBreakout(ctx) {
    const canvas = document.getElementById('breakoutCanvas');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let brick of breakoutBricks) {
        if (brick.alive) {
            ctx.fillStyle = `hsl(${(brick.x + brick.y) % 360}, 70%, 50%)`;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
    }
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(breakoutPaddle.x, breakoutPaddle.y, breakoutPaddle.width, breakoutPaddle.height);
    
    ctx.beginPath();
    ctx.arc(breakoutBall.x, breakoutBall.y, breakoutBall.size, 0, Math.PI * 2);
    ctx.fill();
}

function updateBreakoutScore() {
    document.getElementById('breakoutScore').textContent = `Hack Points: ${breakoutScore} | System Lives: ${breakoutLives}`;
}

function resetBreakout() {
    initBreakout();
}

let ship, asteroids, bullets, asteroidsScore, asteroidsLives;

function initAsteroids() {
    const canvas = document.getElementById('asteroidsCanvas');
    
    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        angle: 0,
        velX: 0,
        velY: 0,
        size: 8
    };
    
    asteroids = [];
    bullets = [];
    asteroidsScore = 0;
    asteroidsLives = 3;
    
    for (let i = 0; i < 5; i++) {
        createAsteroid();
    }
    
    updateAsteroidsScore();
    
    if (gameLoops.asteroids) clearInterval(gameLoops.asteroids);
    gameLoops.asteroids = setInterval(updateAsteroids, 1000/60);
    
    const ctx = canvas.getContext('2d');
    drawAsteroids(ctx);
}

function createAsteroid() {
    const canvas = document.getElementById('asteroidsCanvas');
    asteroids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velX: (Math.random() - 0.5) * 4,
        velY: (Math.random() - 0.5) * 4,
        size: 20 + Math.random() * 20
    });
}

function updateAsteroids() {
    const canvas = document.getElementById('asteroidsCanvas');
    const ctx = canvas.getContext('2d');
    
    ship.x += ship.velX;
    ship.y += ship.velY;
    ship.velX *= 0.99;
    ship.velY *= 0.99;
    
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    if (ship.y > canvas.height) ship.y = 0;
    
    for (let asteroid of asteroids) {
        asteroid.x += asteroid.velX;
        asteroid.y += asteroid.velY;
        
        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;
        
        let dx = ship.x - asteroid.x;
        let dy = ship.y - asteroid.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ship.size + asteroid.size) {
            asteroidsLives--;
            if (asteroidsLives <= 0) {
                gameOver('asteroids');
                return;
            }
            ship.x = canvas.width / 2;
            ship.y = canvas.height / 2;
            ship.velX = 0;
            ship.velY = 0;
            updateAsteroidsScore();
        }
    }
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.x += bullet.velX;
        bullet.y += bullet.velY;
        bullet.life--;
        
        if (bullet.life <= 0) {
            bullets.splice(i, 1);
            continue;
        }
        
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            let dx = bullet.x - asteroid.x;
            let dy = bullet.y - asteroid.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < asteroid.size) {
                bullets.splice(i, 1);
                asteroids.splice(j, 1);
                asteroidsScore += 10;
                updateAsteroidsScore();
                
                if (asteroids.length < 3) {
                    createAsteroid();
                }
                break;
            }
        }
    }
    
    drawAsteroids(ctx);
}

function drawAsteroids(ctx) {
    const canvas = document.getElementById('asteroidsCanvas');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-ship.size, ship.size);
    ctx.lineTo(0, -ship.size);
    ctx.lineTo(ship.size, ship.size);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    
    ctx.fillStyle = '#888';
    for (let asteroid of asteroids) {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.fillStyle = '#ff0';
    for (let bullet of bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateAsteroidsScore() {
    document.getElementById('asteroidsScore').textContent = `Space Points: ${asteroidsScore} | Ship Lives: ${asteroidsLives}`;
}

function resetAsteroids() {
    initAsteroids();
}

function gameOver(game, won = false) {
    if (gameLoops[game]) {
        clearInterval(gameLoops[game]);
    }
    
    let message = won ? 'WYGRAŁEŚ! MISJA ZAKOŃCZONA SUKCESEM!' : 'GAME OVER - SYSTEM FAILURE';
    alert(message);
}

document.addEventListener('keydown', (e) => {
    if (!currentGame) return;
    
    switch(currentGame) {
        case 'snake':
            if (e.key === 'ArrowUp' || e.key === 'w') direction = {x: 0, y: -20};
            if (e.key === 'ArrowDown' || e.key === 's') direction = {x: 0, y: 20};
            if (e.key === 'ArrowLeft' || e.key === 'a') direction = {x: -20, y: 0};
            if (e.key === 'ArrowRight' || e.key === 'd') direction = {x: 20, y: 0};
            break;
            
        case 'pong':
            if (e.key === 'ArrowUp' || e.key === 'w') player.dy = -5;
            if (e.key === 'ArrowDown' || e.key === 's') player.dy = 5;
            break;
            
        case 'breakout':
            if (e.key === 'ArrowLeft' || e.key === 'a') breakoutPaddle.dx = -6;
            if (e.key === 'ArrowRight' || e.key === 'd') breakoutPaddle.dx = 6;
            break;
            
        case 'asteroids':
            if (e.key === 'ArrowUp') {
                ship.velX += Math.cos(ship.angle - Math.PI/2) * 0.5;
                ship.velY += Math.sin(ship.angle - Math.PI/2) * 0.5;
            }
            if (e.key === 'ArrowLeft') ship.angle -= 0.1;
            if (e.key === 'ArrowRight') ship.angle += 0.1;
            if (e.key === ' ') {
                e.preventDefault();
                bullets.push({
                    x: ship.x,
                    y: ship.y,
                    velX: Math.cos(ship.angle - Math.PI/2) * 8,
                    velY: Math.sin(ship.angle - Math.PI/2) * 8,
                    life: 60
                });
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (!currentGame) return;
    
    switch(currentGame) {
        case 'pong':
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
                player.dy = 0;
            }
            break;
            
        case 'breakout':
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd') {
                breakoutPaddle.dx = 0;
            }
            break;
    }
});