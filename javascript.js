// ===== DIFFICULTY LEVELS CONFIGURATION =====
const difficultyConfig = {
    snake: {
        easy: { speed: 150, multiplier: 1, name: "Łatwy", description: "Wolna prędkość" },
        medium: { speed: 100, multiplier: 1.5, name: "Średni", description: "Normalna prędkość" },
        hard: { speed: 70, multiplier: 2, name: "Trudny", description: "Szybka prędkość" },
        expert: { speed: 40, multiplier: 3, name: "Ekspert", description: "Ekstremalna prędkość" }
    },
    pong: {
        easy: { ballSpeed: 3, aiSpeed: 2, playerSpeed: 6, name: "Łatwy", description: "Wolna piłka, słabe AI" },
        medium: { ballSpeed: 4, aiSpeed: 3, playerSpeed: 5, name: "Średni", description: "Normalna rozgrywka" },
        hard: { ballSpeed: 6, aiSpeed: 4, playerSpeed: 5, name: "Trudny", description: "Szybka piłka, sprytne AI" },
        expert: { ballSpeed: 8, aiSpeed: 5, playerSpeed: 4, name: "Ekspert", description: "Maksymalna trudność" }
    }
};

// ===== BREAKOUT LEVEL MAPS =====
const breakoutLevels = [
    {
        name: "Klasyczna Matryca",
        map: [
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ]
    },
    {
        name: "Piramida Kwantowa",
        map: [
            [0,0,0,2,2,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ]
    },
    {
        name: "Cyber Forteca",
        map: [
            [3,0,3,0,0,3,0,3],
            [2,2,2,2,2,2,2,2],
            [0,1,1,1,1,1,1,0],
            [0,1,0,1,1,0,1,0],
            [1,1,1,1,1,1,1,1]
        ]
    },
    {
        name: "Diamentowy Rdzeń",
        map: [
            [0,0,0,3,3,0,0,0],
            [0,0,2,2,2,2,0,0],
            [0,2,1,1,1,1,2,0],
            [2,1,1,3,3,1,1,2],
            [1,1,1,1,1,1,1,1]
        ]
    },
    {
        name: "Szachownica Chaosu",
        map: [
            [2,1,2,1,2,1,2,1],
            [1,2,1,2,1,2,1,2],
            [2,1,2,1,2,1,2,1],
            [1,2,1,2,1,2,1,2],
            [3,1,3,1,3,1,3,1]
        ]
    },
    {
        name: "Spirala Mocy",
        map: [
            [3,3,3,3,3,3,3,3],
            [3,0,0,0,0,0,0,3],
            [3,0,2,2,2,2,0,3],
            [3,0,2,1,1,2,0,3],
            [3,3,3,3,3,3,3,3]
        ]
    },
    {
        name: "Neonowy Labirynt",
        map: [
            [1,0,1,1,1,1,0,1],
            [1,0,1,0,0,1,0,1],
            [1,1,1,0,0,1,1,1],
            [2,2,2,0,0,2,2,2],
            [3,3,3,3,3,3,3,3]
        ]
    },
    {
        name: "Kosmiczne Wrota",
        map: [
            [0,3,0,0,0,0,3,0],
            [3,2,3,0,0,3,2,3],
            [2,1,2,3,3,2,1,2],
            [1,1,1,2,2,1,1,1],
            [1,1,1,1,1,1,1,1]
        ]
    },
    {
        name: "Kwantowa Twierdza",
        map: [
            [3,3,3,3,3,3,3,3],
            [2,3,2,3,3,2,3,2],
            [1,2,1,2,2,1,2,1],
            [1,1,1,1,1,1,1,1],
            [2,1,2,1,1,2,1,2]
        ]
    },
    {
        name: "Finałowy Boss",
        map: [
            [3,3,3,3,3,3,3,3],
            [3,2,2,3,3,2,2,3],
            [3,2,2,3,3,2,2,3],
            [3,3,3,3,3,3,3,3],
            [0,1,1,1,1,1,1,0]
        ]
    }
];

// ===== GAME STATE MANAGEMENT =====
const gameStateManager = {
    currentGame: null,
    currentGameLoop: null,
    currentDifficulty: 'medium',
    gameStates: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },
    currentState: 'menu',
    
    changeState(newState) {
        if (!Object.values(this.gameStates).includes(newState)) {
            console.error(`Invalid state: ${newState}`);
            return false;
        }
        
        this.currentState = newState;
        this.handleStateTransition(newState);
        return true;
    },
    
    handleStateTransition(state) {
        switch(state) {
            case this.gameStates.MENU:
                this.cleanupCurrentGame();
                this.showMainMenu();
                break;
            case this.gameStates.PLAYING:
                this.hideMenus();
                break;
            case this.gameStates.GAME_OVER:
                this.cleanupCurrentGame();
                break;
        }
    },
    
    cleanupCurrentGame() {
        if (this.currentGameLoop) {
            clearInterval(this.currentGameLoop);
            this.currentGameLoop = null;
        }
        this.currentGame = null;
    },
    
    showMainMenu() {
        document.getElementById('gameMenu').style.display = 'grid';
        document.querySelectorAll('.game-area').forEach(area => {
            area.classList.remove('active');
        });
    },
    
    hideMenus() {
        document.getElementById('gameMenu').style.display = 'none';
    }
};

// ===== STATISTICS SYSTEM =====
const statsManager = {
    stats: {},
    
    init() {
        this.loadStats();
        this.updateDisplay();
    },
    
    loadStats() {
        const saved = localStorage.getItem('gameStats');
        this.stats = saved ? JSON.parse(saved) : {
            snake: { bestScore: 0, gamesPlayed: 0 },
            pong: { bestScore: 0, gamesPlayed: 0 },
            breakout: { bestLevel: 0, bestScore: 0, gamesPlayed: 0 },
            wordle: { solved: 0, gamesPlayed: 0, streak: 0 }
        };
    },
    
    saveStats() {
        localStorage.setItem('gameStats', JSON.stringify(this.stats));
        this.updateDisplay();
    },
    
    updateScore(game, score, level = null) {
        if (!this.stats[game]) {
            this.stats[game] = { bestScore: 0, gamesPlayed: 0 };
        }
        
        this.stats[game].gamesPlayed++;
        
        if (score > this.stats[game].bestScore) {
            this.stats[game].bestScore = score;
            showNotification(`🏆 Nowy rekord w ${game.toUpperCase()}: ${score}!`);
        }
        
        if (level && (!this.stats[game].bestLevel || level > this.stats[game].bestLevel)) {
            this.stats[game].bestLevel = level;
            showNotification(`🎯 Najwyższy poziom w ${game.toUpperCase()}: ${level}!`);
        }
        
        this.saveStats();
    },
    
    updateWordle(won) {
        this.stats.wordle.gamesPlayed++;
        if (won) {
            this.stats.wordle.solved++;
            this.stats.wordle.streak++;
        } else {
            this.stats.wordle.streak = 0;
        }
        this.saveStats();
    },
    
    updateDisplay() {
        if (this.stats.snake) {
            const snakeBest = document.getElementById('snakeBest');
            if (snakeBest) snakeBest.textContent = this.stats.snake.bestScore;
        }
        if (this.stats.pong) {
            const pongBest = document.getElementById('pongBest');
            if (pongBest) pongBest.textContent = this.stats.pong.bestScore;
        }
        if (this.stats.breakout) {
            const breakoutBest = document.getElementById('breakoutBest');
            if (breakoutBest) breakoutBest.textContent = this.stats.breakout.bestLevel || 0;
        }
        if (this.stats.wordle) {
            const wordleSolved = document.getElementById('wordleSolved');
            if (wordleSolved) wordleSolved.textContent = this.stats.wordle.solved;
        }
    },
    
    getStatsHTML() {
        return `
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>🐍 Snake</h3>
                    <p>Najlepszy wynik: ${this.stats.snake?.bestScore || 0}</p>
                    <p>Rozegrane gry: ${this.stats.snake?.gamesPlayed || 0}</p>
                </div>
                <div class="stat-item">
                    <h3>🏓 Pong</h3>
                    <p>Najlepszy wynik: ${this.stats.pong?.bestScore || 0}</p>
                    <p>Rozegrane gry: ${this.stats.pong?.gamesPlayed || 0}</p>
                </div>
                <div class="stat-item">
                    <h3>🧱 Breakout</h3>
                    <p>Najwyższy poziom: ${this.stats.breakout?.bestLevel || 0}</p>
                    <p>Najlepszy wynik: ${this.stats.breakout?.bestScore || 0}</p>
                    <p>Rozegrane gry: ${this.stats.breakout?.gamesPlayed || 0}</p>
                </div>
                <div class="stat-item">
                    <h3>🔤 Wordle</h3>
                    <p>Rozwiązane: ${this.stats.wordle?.solved || 0}</p>
                    <p>Seria wygranych: ${this.stats.wordle?.streak || 0}</p>
                </div>
            </div>
        `;
    }
};

// ===== INPUT HANDLER =====
const inputHandler = {
    activeKeys: new Set(),
    keyMap: {
        'ArrowUp': 'up', 'ArrowDown': 'down', 
        'ArrowLeft': 'left', 'ArrowRight': 'right',
        'w': 'up', 'W': 'up',
        's': 'down', 'S': 'down',
        'a': 'left', 'A': 'left',
        'd': 'right', 'D': 'right',
        ' ': 'shoot', 'Space': 'shoot',
        'Enter': 'enter',
        'Backspace': 'backspace',
        'Escape': 'pause',
        'p': 'pause', 'P': 'pause'
    },
    
    normalizeKey(key) {
        return this.keyMap[key] || key.toLowerCase();
    },
    
    handleKeyDown(event) {
        const key = this.normalizeKey(event.key);
        
        if (this.activeKeys.has(key)) return key;
        
        this.activeKeys.add(key);
        
        if (this.shouldPreventDefault(event.key)) {
            event.preventDefault();
        }
        
        return key;
    },
    
    handleKeyUp(event) {
        const key = this.normalizeKey(event.key);
        this.activeKeys.delete(key);
        return key;
    },
    
    shouldPreventDefault(key) {
        const preventKeys = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        return preventKeys.includes(key);
    },
    
    isPressed(action) {
        return this.activeKeys.has(action);
    },
    
    clearAll() {
        this.activeKeys.clear();
    }
};

// ===== DIFFICULTY SELECTION =====
function selectDifficulty(game) {
    const modal = document.getElementById('difficultyModal');
    const title = document.getElementById('difficultyTitle');
    const options = document.getElementById('difficultyOptions');
    
    title.textContent = `Wybierz poziom trudności - ${game === 'snake' ? 'Quantum Snake' : 'Cyber Pong'}`;
    options.innerHTML = '';
    
    const difficulties = difficultyConfig[game];
    
    Object.keys(difficulties).forEach(level => {
        const config = difficulties[level];
        const btn = document.createElement('div');
        btn.className = `difficulty-btn ${level}`;
        btn.innerHTML = `
            <h3>${config.name}</h3>
            <p>${config.description}</p>
            ${level === 'easy' ? '<p>Mnożnik: x1</p>' : ''}
            ${level === 'medium' ? '<p>Mnożnik: x1.5</p>' : ''}
            ${level === 'hard' ? '<p>Mnożnik: x2</p>' : ''}
            ${level === 'expert' ? '<p>Mnożnik: x3</p>' : ''}
        `;
        btn.onclick = () => {
            gameStateManager.currentDifficulty = level;
            modal.classList.add('hidden');
            uiStart(game);
        };
        options.appendChild(btn);
    });
    
    modal.classList.remove('hidden');
}

// ===== UI START =====
function uiStart(game) {
    gameStateManager.changeState('playing');
    
    document.getElementById('gameMenu').style.display = 'none';
    
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    
    if (game === 'wordle') {
        document.getElementById('wordleGame').classList.add('active');
        wordleGame.init();
        gameStateManager.currentGame = game;
    } else {
        showCountdown(() => {
            switch(game) {
                case 'snake':
                    document.getElementById('snakeGame').classList.add('active');
                    initSnake();
                    break;
                case 'pong':
                    document.getElementById('pongGame').classList.add('active');
                    initPong();
                    break;
                case 'breakout':
                    document.getElementById('breakoutGame').classList.add('active');
                    initBreakout();
                    break;
            }
            gameStateManager.currentGame = game;
        });
    }
}

// ===== COUNTDOWN =====
function showCountdown(callback) {
    const countdown = document.getElementById('countdown');
    countdown.classList.remove('hidden');
    let count = 3;
    
    const interval = setInterval(() => {
        if (count > 0) {
            countdown.textContent = count;
            count--;
        } else {
            countdown.textContent = 'GO!';
            setTimeout(() => {
                countdown.classList.add('hidden');
                callback();
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
}

// ===== BACK TO MENU =====
function backToMenu() {
    gameStateManager.changeState('menu');
    inputHandler.clearAll();
}

// ===== SNAKE GAME WITH DIFFICULTY =====
let snakeGame;

function initSnake() {
    const difficulty = difficultyConfig.snake[gameStateManager.currentDifficulty];
    
    // Ustaw badge trudności
    const badge = document.getElementById('snakeDifficulty');
    badge.textContent = difficulty.name;
    badge.className = `difficulty-badge ${gameStateManager.currentDifficulty}`;
    
    snakeGame = {
        snake: [{x: 200, y: 200}],
        dx: 20,
        dy: 0,
        food: {x: 0, y: 0},
        score: 0,
        gameOver: false,
        speed: difficulty.speed,
        multiplier: difficulty.multiplier
    };
    
    generateFood();
    
    if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
    }
    
    gameStateManager.currentGameLoop = setInterval(() => {
        if (!snakeGame.gameOver) {
            updateSnake();
            drawSnake();
        }
    }, snakeGame.speed);
}

function generateFood() {
    if (!snakeGame) return;
    
    do {
        snakeGame.food.x = Math.floor(Math.random() * 20) * 20;
        snakeGame.food.y = Math.floor(Math.random() * 20) * 20;
    } while (snakeGame.snake.some(segment => 
        segment.x === snakeGame.food.x && segment.y === snakeGame.food.y
    ));
}

function updateSnake() {
    const head = {
        x: snakeGame.snake[0].x + snakeGame.dx,
        y: snakeGame.snake[0].y + snakeGame.dy
    };
    
    if (head.x < 0) head.x = 380;
    if (head.x >= 400) head.x = 0;
    if (head.y < 0) head.y = 380;
    if (head.y >= 400) head.y = 0;
    
    if (snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        snakeGame.gameOver = true;
        statsManager.updateScore('snake', snakeGame.score);
        return;
    }
    
    snakeGame.snake.unshift(head);
    
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += Math.floor(10 * snakeGame.multiplier);
        document.getElementById('snakeScore').textContent = `Energia: ${snakeGame.score}`;
        generateFood();
    } else {
        snakeGame.snake.pop();
    }
}

function drawSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff00';
    snakeGame.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00';
        ctx.fillRect(segment.x, segment.y, 18, 18);
    });
    
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(snakeGame.food.x, snakeGame.food.y, 18, 18);
    
    if (snakeGame.gameOver) {
        ctx.fillStyle = '#ff0000';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 200, 200);
    }
}

function resetSnake() {
    initSnake();
}

// ===== PONG GAME WITH DIFFICULTY =====
let pongGame;

function initPong() {
    const difficulty = difficultyConfig.pong[gameStateManager.currentDifficulty];
    
    // Ustaw badge trudności
    const badge = document.getElementById('pongDifficulty');
    badge.textContent = difficulty.name;
    badge.className = `difficulty-badge ${gameStateManager.currentDifficulty}`;
    
    pongGame = {
        ball: {
            x: 300, 
            y: 150, 
            dx: difficulty.ballSpeed, 
            dy: difficulty.ballSpeed * 0.75, 
            radius: 8
        },
        player: {
            y: 100, 
            score: 0, 
            speed: difficulty.playerSpeed
        },
        ai: {
            y: 100, 
            score: 0,
            speed: difficulty.aiSpeed
        },
        paddleHeight: 80,
        paddleWidth: 15,
        difficulty: difficulty
    };
    
    if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
    }
    
    gameStateManager.currentGameLoop = setInterval(() => {
        updatePong();
        drawPong();
    }, 1000 / 60);
}

function updatePong() {
    // PŁYNNY RUCH PALETKI GRACZA
    if (inputHandler.isPressed('up')) {
        pongGame.player.y = Math.max(0, pongGame.player.y - pongGame.player.speed);
    }
    if (inputHandler.isPressed('down')) {
        pongGame.player.y = Math.min(220, pongGame.player.y + pongGame.player.speed);
    }
    
    // Aktualizacja piłki
    pongGame.ball.x += pongGame.ball.dx;
    pongGame.ball.y += pongGame.ball.dy;
    
    // Odbicie od ścian
    if (pongGame.ball.y - pongGame.ball.radius <= 0 || 
        pongGame.ball.y + pongGame.ball.radius >= 300) {
        pongGame.ball.dy = -pongGame.ball.dy;
    }
    
    // Odbicie od paletek
    if (pongGame.ball.x - pongGame.ball.radius <= 25) {
        if (pongGame.ball.y >= pongGame.player.y && 
            pongGame.ball.y <= pongGame.player.y + pongGame.paddleHeight) {
            pongGame.ball.dx = -pongGame.ball.dx;
            const relativeY = (pongGame.ball.y - pongGame.player.y) / pongGame.paddleHeight;
            pongGame.ball.dy = (relativeY - 0.5) * 8;
        }
    }
    
    if (pongGame.ball.x + pongGame.ball.radius >= 575) {
        if (pongGame.ball.y >= pongGame.ai.y && 
            pongGame.ball.y <= pongGame.ai.y + pongGame.paddleHeight) {
            pongGame.ball.dx = -pongGame.ball.dx;
        }
    }
    
    // Punkty
    if (pongGame.ball.x < 0) {
        pongGame.ai.score++;
        resetBall();
    }
    if (pongGame.ball.x > 600) {
        pongGame.player.score++;
        resetBall();
        statsManager.updateScore('pong', pongGame.player.score);
    }
    
    // AI - z poziomem trudności
    if (pongGame.ball.y < pongGame.ai.y + pongGame.paddleHeight / 2) {
        pongGame.ai.y = Math.max(0, pongGame.ai.y - pongGame.ai.speed);
    } else {
        pongGame.ai.y = Math.min(220, pongGame.ai.y + pongGame.ai.speed);
    }
    
    document.getElementById('pongScore').textContent = 
        `Człowiek: ${pongGame.player.score} | AI: ${pongGame.ai.score}`;
}

function resetBall() {
    pongGame.ball.x = 300;
    pongGame.ball.y = 150;
    const speed = pongGame.difficulty.ballSpeed;
    pongGame.ball.dx = (Math.random() > 0.5 ? speed : -speed);
    pongGame.ball.dy = (Math.random() - 0.5) * speed * 1.5;
}

function drawPong() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Linia środkowa
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 300);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Paletki
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(10, pongGame.player.y, pongGame.paddleWidth, pongGame.paddleHeight);
    ctx.fillRect(575, pongGame.ai.y, pongGame.paddleWidth, pongGame.paddleHeight);
    
    // Piłka
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(pongGame.ball.x, pongGame.ball.y, pongGame.ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function resetPong() {
    initPong();
}

// ===== BREAKOUT GAME WITH LEVELS =====
let breakoutGame;

function initBreakout() {
    breakoutGame = {
        ball: {x: 250, y: 350, dx: 3, dy: -3, radius: 8},
        paddle: {x: 210, width: 80, height: 10, speed: 7},
        bricks: [],
        score: 0,
        lives: 3,
        gameOver: false,
        currentLevel: 0,
        totalBricks: 0
    };
    
    loadBreakoutLevel(0);
    
    if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
    }
    
    gameStateManager.currentGameLoop = setInterval(() => {
        if (!breakoutGame.gameOver) {
            updateBreakout();
            drawBreakout();
        }
    }, 1000 / 60);
}

function loadBreakoutLevel(levelIndex) {
    if (levelIndex >= breakoutLevels.length) {
        // Wszystkie poziomy ukończone
        breakoutGame.gameOver = true;
        showNotification('🎉 GRATULACJE! Ukończyłeś wszystkie poziomy!');
        statsManager.updateScore('breakout', breakoutGame.score, breakoutGame.currentLevel);
        return;
    }
    
    const level = breakoutLevels[levelIndex];
    breakoutGame.currentLevel = levelIndex + 1;
    breakoutGame.bricks = [];
    breakoutGame.totalBricks = 0;
    
    document.getElementById('breakoutLevel').textContent = breakoutGame.currentLevel;
    
    for (let r = 0; r < level.map.length; r++) {
        breakoutGame.bricks[r] = [];
        for (let c = 0; c < level.map[r].length; c++) {
            const brickType = level.map[r][c];
            if (brickType > 0) {
                breakoutGame.totalBricks++;
                breakoutGame.bricks[r][c] = {
                    x: c * 60 + 15,
                    y: r * 30 + 40,
                    width: 50,
                    height: 20,
                    destroyed: false,
                    hits: brickType,
                    maxHits: brickType,
                    color: getBrickColor(brickType)
                };
            } else {
                breakoutGame.bricks[r][c] = null;
            }
        }
    }
    
    // Reset pozycji piłki
    breakoutGame.ball.x = 250;
    breakoutGame.ball.y = 350;
    breakoutGame.ball.dx = 3 + levelIndex * 0.5;
    breakoutGame.ball.dy = -(3 + levelIndex * 0.5);
}

function getBrickColor(type) {
    switch(type) {
        case 1: return '#00ff00';  // Zielony - 1 trafienie
        case 2: return '#ffff00';  // Żółty - 2 trafienia
        case 3: return '#ff0000';  // Czerwony - 3 trafienia
        default: return '#ffffff';
    }
}

function updateBreakout() {
    // PŁYNNY RUCH PALETKI
    if (inputHandler.isPressed('left')) {
        breakoutGame.paddle.x = Math.max(0, breakoutGame.paddle.x - breakoutGame.paddle.speed);
    }
    if (inputHandler.isPressed('right')) {
        breakoutGame.paddle.x = Math.min(420, breakoutGame.paddle.x + breakoutGame.paddle.speed);
    }
    
    // Aktualizacja piłki
    breakoutGame.ball.x += breakoutGame.ball.dx;
    breakoutGame.ball.y += breakoutGame.ball.dy;
    
    // Odbicie od ścian
    if (breakoutGame.ball.x + breakoutGame.ball.radius > 500 || 
        breakoutGame.ball.x - breakoutGame.ball.radius < 0) {
        breakoutGame.ball.dx = -breakoutGame.ball.dx;
    }
    
    if (breakoutGame.ball.y - breakoutGame.ball.radius < 0) {
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
    }
    
    // Strata życia
    if (breakoutGame.ball.y > 400) {
        breakoutGame.lives--;
        if (breakoutGame.lives <= 0) {
            breakoutGame.gameOver = true;
            statsManager.updateScore('breakout', breakoutGame.score, breakoutGame.currentLevel);
        } else {
            breakoutGame.ball.x = 250;
            breakoutGame.ball.y = 350;
            breakoutGame.ball.dx = 3 + (breakoutGame.currentLevel - 1) * 0.5;
            breakoutGame.ball.dy = -(3 + (breakoutGame.currentLevel - 1) * 0.5);
        }
    }
    
    // Odbicie od paletki
    if (breakoutGame.ball.y + breakoutGame.ball.radius >= 380 &&
        breakoutGame.ball.x >= breakoutGame.paddle.x &&
        breakoutGame.ball.x <= breakoutGame.paddle.x + breakoutGame.paddle.width) {
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
        const relativeX = (breakoutGame.ball.x - breakoutGame.paddle.x) / breakoutGame.paddle.width;
        breakoutGame.ball.dx = (relativeX - 0.5) * 8;
    }
    
    // Kolizje z cegłami
    let bricksDestroyed = 0;
    for (let r = 0; r < breakoutGame.bricks.length; r++) {
        for (let c = 0; c < breakoutGame.bricks[r].length; c++) {
            const brick = breakoutGame.bricks[r][c];
            if (brick && !brick.destroyed) {
                if (breakoutGame.ball.x > brick.x &&
                    breakoutGame.ball.x < brick.x + brick.width &&
                    breakoutGame.ball.y > brick.y &&
                    breakoutGame.ball.y < brick.y + brick.height) {
                    breakoutGame.ball.dy = -breakoutGame.ball.dy;
                    brick.hits--;
                    
                    if (brick.hits <= 0) {
                        brick.destroyed = true;
                        breakoutGame.score += 10 * brick.maxHits;
                        bricksDestroyed++;
                    } else {
                        // Zmień kolor cegły po trafieniu
                        brick.color = getBrickColor(brick.hits);
                    }
                }
            }
            
            if (brick && brick.destroyed) {
                bricksDestroyed++;
            }
        }
    }
    
    // Sprawdzenie czy poziom ukończony
    if (bricksDestroyed >= breakoutGame.totalBricks) {
        if (breakoutGame.currentLevel < breakoutLevels.length) {
            showLevelComplete();
            setTimeout(() => {
                loadBreakoutLevel(breakoutGame.currentLevel);
            }, 2000);
        } else {
            // Gra ukończona!
            breakoutGame.gameOver = true;
            showNotification('🎉 GRATULACJE! Ukończyłeś wszystkie poziomy!');
            statsManager.updateScore('breakout', breakoutGame.score, breakoutGame.currentLevel);
        }
    }
    
    document.getElementById('breakoutScore').textContent = 
        `Hack Points: ${breakoutGame.score} | System Lives: ${breakoutGame.lives}`;
}

function drawBreakout() {
    const canvas = document.getElementById('breakoutCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Rysuj cegły
    for (let r = 0; r < breakoutGame.bricks.length; r++) {
        for (let c = 0; c < breakoutGame.bricks[r].length; c++) {
            const brick = breakoutGame.bricks[r][c];
            if (brick && !brick.destroyed) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                // Dodaj efekt dla mocniejszych cegieł
                if (brick.hits > 1) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
                }
            }
        }
    }
    
    // Paletka
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(breakoutGame.paddle.x, 380, breakoutGame.paddle.width, breakoutGame.paddle.height);
    
    // Piłka
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(breakoutGame.ball.x, breakoutGame.ball.y, breakoutGame.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Game Over
    if (breakoutGame.gameOver) {
        ctx.fillStyle = breakoutGame.lives > 0 ? '#00ff00' : '#ff0000';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(breakoutGame.lives > 0 ? 'YOU WIN!' : 'GAME OVER', 250, 200);
    }
}

function showLevelComplete() {
    const div = document.createElement('div');
    div.className = 'level-complete';
    div.textContent = `Poziom ${breakoutGame.currentLevel} ukończony!`;
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 1500);
}

function resetBreakout() {
    initBreakout();
}

// ===== WORDLE GAME =====
const wordleGame = {
    wordList: [
        'KWANT', 'LASER', 'PLAZM', 'CYBER', 'MATRIX', 'PIXEL', 'ROBOT', 'KODER',
        'BAJTY', 'CACHE', 'CLOUD', 'DEBUG', 'FLASH', 'MODEM', 'MACRO', 'LOGIC',
        'VIRUS', 'STACK', 'SHELL', 'PATCH', 'PROXY', 'QUERY', 'REGEX', 'SCOPE',
        'SETUP', 'SPACE', 'SPAWN', 'SPEED', 'SPLIT', 'STYLE', 'SUPER', 'SWING',
        'SYNCH', 'TABLE', 'TOKEN', 'TOUCH', 'TRACK', 'TREND', 'TURBO', 'ULTRA',
        'UNITY', 'VALUE', 'WATCH', 'WORLD', 'ZEBRA', 'AUDIO', 'BLEND', 'BOOST',
        'BRAIN', 'CHAIN', 'CHAOS', 'CHARM', 'CHESS', 'CLOCK', 'CORAL', 'CRAFT'
    ],
    usedWords: [],
    currentWord: '',
    currentRow: 0,
    currentTile: 0,
    gameBoard: [],
    keyboardState: {},
    gameActive: false,
    
    init() {
        this.loadUsedWords();
        this.createBoard();
        this.createKeyboard();
        this.selectNewWord();
        this.gameActive = true;
    },
    
    loadUsedWords() {
        const saved = localStorage.getItem('wordleUsedWords');
        this.usedWords = saved ? JSON.parse(saved) : [];
        
        if (this.usedWords.length >= this.wordList.length - 1) {
            this.usedWords = [];
            localStorage.removeItem('wordleUsedWords');
        }
    },
    
    saveUsedWords() {
        localStorage.setItem('wordleUsedWords', JSON.stringify(this.usedWords));
    },
    
    selectNewWord() {
        const availableWords = this.wordList.filter(word => !this.usedWords.includes(word));
        
        if (availableWords.length === 0) {
            this.usedWords = [];
            this.saveUsedWords();
            this.selectNewWord();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        this.currentWord = availableWords[randomIndex];
        this.usedWords.push(this.currentWord);
        this.saveUsedWords();
        
        console.log('Debug - Current word:', this.currentWord);
    },
    
    createBoard() {
        const board = document.getElementById('wordleBoard');
        board.innerHTML = '';
        this.gameBoard = [];
        
        for (let i = 0; i < 6; i++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            const rowTiles = [];
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
                rowTiles.push('');
            }
            
            board.appendChild(row);
            this.gameBoard.push(rowTiles);
        }
    },
    
    createKeyboard() {
        const keyboard = document.getElementById('wordleKeyboard');
        keyboard.innerHTML = '';
        
        const rows = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
        ];
        
        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(key => {
                const button = document.createElement('button');
                button.className = 'keyboard-key';
                if (key === 'ENTER' || key === '⌫') {
                    button.className += ' wide';
                }
                button.textContent = key;
                button.id = `key-${key}`;
                button.onclick = () => this.handleKeyClick(key);
                rowDiv.appendChild(button);
            });
            
            keyboard.appendChild(rowDiv);
        });
    },
    
    handleKeyClick(key) {
        if (!this.gameActive) return;
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === '⌫' || key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (key.length === 1) {
            this.addLetter(key);
        }
    },
    
    handleKeyPress(key) {
        if (!this.gameActive) return;
        
        if (key === 'enter') {
            this.submitGuess();
        } else if (key === 'backspace') {
            this.deleteLetter();
        } else if (key.length === 1 && key.match(/[a-z]/i)) {
            this.addLetter(key.toUpperCase());
        }
    },
    
    addLetter(letter) {
        if (this.currentTile < 5 && this.currentRow < 6) {
            const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
            tile.textContent = letter;
            tile.classList.add('filled');
            this.gameBoard[this.currentRow][this.currentTile] = letter;
            this.currentTile++;
        }
    },
    
    deleteLetter() {
        if (this.currentTile > 0) {
            this.currentTile--;
            const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
            tile.textContent = '';
            tile.classList.remove('filled');
            this.gameBoard[this.currentRow][this.currentTile] = '';
        }
    },
    
    submitGuess() {
        if (this.currentTile !== 5) {
            this.showMessage('Słowo musi mieć 5 liter!');
            return;
        }
        
        const guess = this.gameBoard[this.currentRow].join('');
        
        const letterCount = {};
        for (let letter of this.currentWord) {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
        
        const tileStates = [];
        
        for (let i = 0; i < 5; i++) {
            if (guess[i] === this.currentWord[i]) {
                tileStates[i] = 'correct';
                letterCount[guess[i]]--;
            }
        }
        
        for (let i = 0; i < 5; i++) {
            if (tileStates[i]) continue;
            
            if (letterCount[guess[i]] > 0) {
                tileStates[i] = 'present';
                letterCount[guess[i]]--;
            } else {
                tileStates[i] = 'absent';
            }
        }
        
        tileStates.forEach((state, i) => {
            setTimeout(() => {
                const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
                tile.classList.add(state);
                
                const key = document.getElementById(`key-${guess[i]}`);
                if (key) {
                    if (state === 'correct' || 
                        (state === 'present' && !key.classList.contains('correct')) ||
                        (state === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present'))) {
                        key.classList.remove('correct', 'present', 'absent');
                        key.classList.add(state);
                    }
                }
            }, i * 100);
        });
        
        setTimeout(() => {
            if (guess === this.currentWord) {
                this.gameActive = false;
                this.showMessage('🎉 BRAWO! Odgadłeś słowo!', 'win');
                statsManager.updateWordle(true);
            } else if (this.currentRow === 5) {
                this.gameActive = false;
                this.showMessage(`Przegrałeś! Słowo to: ${this.currentWord}`, 'lose');
                statsManager.updateWordle(false);
            } else {
                this.currentRow++;
                this.currentTile = 0;
            }
        }, 600);
    },
    
    showMessage(text, type = '') {
        const messageEl = document.getElementById('wordleMessage');
        messageEl.textContent = text;
        messageEl.className = 'wordle-message ' + type;
        
        if (!type) {
            setTimeout(() => {
                messageEl.textContent = '';
            }, 2000);
        }
    },
    
    reset() {
        this.currentRow = 0;
        this.currentTile = 0;
        this.gameActive = true;
        this.keyboardState = {};
        
        document.querySelectorAll('.wordle-tile').forEach(tile => {
            tile.textContent = '';
            tile.className = 'wordle-tile';
        });
        
        document.querySelectorAll('.keyboard-key').forEach(key => {
            key.className = key.classList.contains('wide') ? 'keyboard-key wide' : 'keyboard-key';
        });
        
        document.getElementById('wordleMessage').textContent = '';
        document.getElementById('wordleMessage').className = 'wordle-message';
        
        this.selectNewWord();
        
        this.gameBoard = Array(6).fill().map(() => Array(5).fill(''));
    }
};

function resetWordle() {
    wordleGame.reset();
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// ===== THEME MANAGER =====
const themeManager = {
    currentTheme: 'dark',
    
    init() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            this.currentTheme = saved;
            this.applyTheme();
        }
    },
    
    toggle() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    },
    
    applyTheme() {
        if (this.currentTheme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
};

// ===== PARTICLES =====
function initParticles() {
    const container = document.getElementById('particles');
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('keydown', (e) => {
    const key = inputHandler.handleKeyDown(e);
    
    if (gameStateManager.currentGame === 'wordle') {
        wordleGame.handleKeyPress(key);
        return;
    }
    
    if (gameStateManager.currentGame === 'snake' && snakeGame && !snakeGame.gameOver) {
        const prevDx = snakeGame.dx;
        const prevDy = snakeGame.dy;
        
        switch(key) {
            case 'up':
                if (prevDy === 0) {
                    snakeGame.dx = 0;
                    snakeGame.dy = -20;
                }
                break;
            case 'down':
                if (prevDy === 0) {
                    snakeGame.dx = 0;
                    snakeGame.dy = 20;
                }
                break;
            case 'left':
                if (prevDx === 0) {
                    snakeGame.dx = -20;
                    snakeGame.dy = 0;
                }
                break;
            case 'right':
                if (prevDx === 0) {
                    snakeGame.dx = 20;
                    snakeGame.dy = 0;
                }
                break;
        }
    }
});

document.addEventListener('keyup', (e) => {
    inputHandler.handleKeyUp(e);
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    statsManager.init();
    themeManager.init();
    
    document.getElementById('statsBtn').addEventListener('click', () => {
        const modal = document.getElementById('statsModal');
        const content = document.getElementById('statsContent');
        content.innerHTML = statsManager.getStatsHTML();
        modal.classList.remove('hidden');
    });
    
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('statsModal').classList.add('hidden');
    });
    
    document.getElementById('themeBtn').addEventListener('click', () => {
        themeManager.toggle();
    });
    
    showNotification('🎮 Witaj w Gaming Hub! Wybierz poziom trudności i graj!');
});