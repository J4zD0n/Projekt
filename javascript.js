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

// ===== WORDLE WORDS BY LENGTH =====
const wordleWords = {
    3: [
        // Polskie słowa
        'KOT', 'PES', 'DOM', 'LAS', 'NOC', 'ROK', 'SEN', 'ZĄB', 'OKO', 'NOS',
        'RAK', 'SER', 'LÓD', 'MUR', 'KOŃ', 'BÓG', 'LEW', 'MIŚ', 'RÓG', 'TYŁ',
        'BAL', 'GAZ', 'KOD', 'LOT', 'MAJ', 'PAN', 'RAJ', 'SAD', 'TAK', 'WAL',
        'CUD', 'DYM', 'FOK', 'GRA', 'HUK', 'JAR', 'KIJ', 'LUZ', 'MAK', 'NIE',
        // Angielskie słowa
        'CAT', 'DOG', 'SUN', 'RUN', 'FUN', 'BAG', 'CAR', 'BUS', 'CUP', 'HAT',
        'BED', 'BOX', 'DAY', 'EAR', 'EGG', 'FLY', 'GOD', 'GUN', 'ICE', 'JOB',
        'KEY', 'LAW', 'MAN', 'MAP', 'NET', 'OWL', 'PEN', 'PIG', 'RED', 'SEA',
        'SKY', 'TOP', 'TOY', 'VAN', 'WAR', 'WEB', 'WIN', 'YES', 'ZOO', 'ZIP'
    ],
    4: [
        // Polskie słowa
        'KAWA', 'MOST', 'CZAS', 'PRĄD', 'ŚWIT', 'KRÓL', 'MAMA', 'TATA', 'BRAT', 'PIES',
        'KOZA', 'RYBA', 'PTAK', 'DACH', 'OKNO', 'STÓŁ', 'KARA', 'MAPA', 'NOGA', 'RĘKA',
        'GŁOWA', 'ŻYCIE', 'WODA', 'WIATR', 'BURZA', 'ŚNIEG', 'MRÓZ', 'NIEBO', 'POLE', 'GÓRA',
        // Angielskie słowa  
        'LOVE', 'HATE', 'GAME', 'PLAY', 'WORK', 'HOME', 'TREE', 'BOOK', 'GIRL', 'LIFE',
        'FIRE', 'WIND', 'RAIN', 'SNOW', 'STAR', 'MOON', 'FISH', 'BIRD', 'BEAR', 'WOLF',
        'TIME', 'YEAR', 'WEEK', 'HOUR', 'DARK', 'GOOD', 'EVIL', 'FAST', 'SLOW', 'HIGH',
        'JUMP', 'SWIM', 'WALK', 'TALK', 'SING', 'DRAW', 'COOK', 'BAKE', 'SHOP', 'BANK'
    ],
    5: [
        // Polskie słowa
        'KWANT', 'LASER', 'PLAZM', 'ROBOT', 'KODER', 'BAJTY', 'CACHE', 'CLOUD', 'DEBUG', 'FLASH',
        'MODEM', 'MACRO', 'LOGIC', 'VIRUS', 'STACK', 'SHELL', 'PATCH', 'PROXY', 'QUERY', 'REGEX',
        'SCOPE', 'SETUP', 'SPACE', 'SPAWN', 'SPEED', 'SPLIT', 'STYLE', 'SUPER', 'SWING', 'TABLE',
        'TOKEN', 'TOUCH', 'TRACK', 'TREND', 'TURBO', 'ULTRA', 'UNITY', 'VALUE', 'WATCH', 'WORLD',
        'ZEBRA', 'AUDIO', 'BLEND', 'BOOST', 'BRAIN', 'CHAIN', 'CHAOS', 'CHARM', 'CHESS', 'CLOCK',
        'CORAL', 'CRAFT', 'KARTA', 'MOTOR', 'PUNKT', 'SPORT', 'KWIAT', 'PRACA', 'SŁOWO', 'GRUPA',
        // Angielskie słowa
        'ABOUT', 'ABOVE', 'AFTER', 'AGAIN', 'ALIEN', 'ALLOW', 'ALONE', 'ALONG', 'ALPHA', 'AMBER',
        'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARMOR',
        'ARROW', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADGE', 'BASIC', 'BEACH',
        'BEAST', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BERRY', 'BIRTH', 'BLACK', 'BLADE', 'BLAME',
        'BLANK', 'BLAST', 'BLAZE', 'BLEED', 'BLEND', 'BLESS', 'BLIND', 'BLOCK', 'BLOOD', 'BLOOM'
    ]
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

// ===== WORDLE MODE SELECTION =====
function selectWordleMode() {
    const modal = document.getElementById('wordleModal');
    modal.classList.remove('hidden');
}

function startWordleMode(length) {
    const modal = document.getElementById('wordleModal');
    modal.classList.add('hidden');
    
    wordleGame.currentWordLength = length;
    uiStart('wordle');
}

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

// ===== IMPROVED SNAKE GAME WITH REAL SNAKE GRAPHICS =====
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
        multiplier: difficulty.multiplier,
        direction: 'right'
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
    
    // Tło
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Rysuj węża z gradientem i płynnymi łączeniami
    snakeGame.snake.forEach((segment, index) => {
        if (index === 0) {
            // Głowa węża
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.arc(segment.x + 10, segment.y + 10, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Oczy
            ctx.fillStyle = '#fff';
            let eyeX1, eyeY1, eyeX2, eyeY2;
            if (snakeGame.direction === 'right') {
                eyeX1 = segment.x + 13; eyeY1 = segment.y + 7;
                eyeX2 = segment.x + 13; eyeY2 = segment.y + 13;
            } else if (snakeGame.direction === 'left') {
                eyeX1 = segment.x + 7; eyeY1 = segment.y + 7;
                eyeX2 = segment.x + 7; eyeY2 = segment.y + 13;
            } else if (snakeGame.direction === 'up') {
                eyeX1 = segment.x + 7; eyeY1 = segment.y + 7;
                eyeX2 = segment.x + 13; eyeY2 = segment.y + 7;
            } else {
                eyeX1 = segment.x + 7; eyeY1 = segment.y + 13;
                eyeX2 = segment.x + 13; eyeY2 = segment.y + 13;
            }
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Źrenice
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, 1, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Ciało węża - gradient koloru
            const gradient = ctx.createRadialGradient(
                segment.x + 10, segment.y + 10, 0,
                segment.x + 10, segment.y + 10, 10
            );
            const greenValue = Math.max(100, 200 - index * 10);
            gradient.addColorStop(0, `rgb(0, ${greenValue}, 0)`);
            gradient.addColorStop(1, `rgb(0, ${Math.max(50, greenValue - 50)}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(segment.x + 10, segment.y + 10, 9, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    // Rysuj jabłko
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(snakeGame.food.x + 10, snakeGame.food.y + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Blask jabłka
    ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
    ctx.beginPath();
    ctx.arc(snakeGame.food.x + 8, snakeGame.food.y + 7, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Liść jabłka
    ctx.fillStyle = '#00aa00';
    ctx.fillRect(snakeGame.food.x + 8, snakeGame.food.y + 2, 4, 3);
    
    if (snakeGame.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 200, 180);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Courier New';
        ctx.fillText(`Wynik: ${snakeGame.score}`, 200, 220);
    }
}

function resetSnake() {
    initSnake();
}

// ===== IMPROVED PONG GAME WITH FIXED AI =====
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
            y: 110, 
            score: 0, 
            speed: difficulty.playerSpeed
        },
        ai: {
            y: 110, 
            score: 0,
            speed: difficulty.aiSpeed,
            targetY: 110
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
        pongGame.player.y = Math.min(300 - pongGame.paddleHeight, pongGame.player.y + pongGame.player.speed);
    }
    
    // Aktualizacja piłki
    pongGame.ball.x += pongGame.ball.dx;
    pongGame.ball.y += pongGame.ball.dy;
    
    // Odbicie od ścian
    if (pongGame.ball.y - pongGame.ball.radius <= 0) {
        pongGame.ball.y = pongGame.ball.radius;
        pongGame.ball.dy = Math.abs(pongGame.ball.dy);
    }
    if (pongGame.ball.y + pongGame.ball.radius >= 300) {
        pongGame.ball.y = 300 - pongGame.ball.radius;
        pongGame.ball.dy = -Math.abs(pongGame.ball.dy);
    }
    
    // Odbicie od paletki gracza
    if (pongGame.ball.dx < 0 && 
        pongGame.ball.x - pongGame.ball.radius <= 10 + pongGame.paddleWidth &&
        pongGame.ball.x - pongGame.ball.radius > 10) {
        if (pongGame.ball.y >= pongGame.player.y && 
            pongGame.ball.y <= pongGame.player.y + pongGame.paddleHeight) {
            pongGame.ball.x = 10 + pongGame.paddleWidth + pongGame.ball.radius;
            pongGame.ball.dx = Math.abs(pongGame.ball.dx);
            const relativeY = (pongGame.ball.y - pongGame.player.y) / pongGame.paddleHeight;
            pongGame.ball.dy = (relativeY - 0.5) * 8;
        }
    }
    
    // Odbicie od paletki AI
    if (pongGame.ball.dx > 0 && 
        pongGame.ball.x + pongGame.ball.radius >= 600 - 10 - pongGame.paddleWidth &&
        pongGame.ball.x + pongGame.ball.radius < 600 - 10) {
        if (pongGame.ball.y >= pongGame.ai.y && 
            pongGame.ball.y <= pongGame.ai.y + pongGame.paddleHeight) {
            pongGame.ball.x = 600 - 10 - pongGame.paddleWidth - pongGame.ball.radius;
            pongGame.ball.dx = -Math.abs(pongGame.ball.dx);
            const relativeY = (pongGame.ball.y - pongGame.ai.y) / pongGame.paddleHeight;
            pongGame.ball.dy = (relativeY - 0.5) * 6;
        }
    }
    
    // Punkty
    if (pongGame.ball.x < -20) {
        pongGame.ai.score++;
        resetBall();
    }
    if (pongGame.ball.x > 620) {
        pongGame.player.score++;
        resetBall();
        statsManager.updateScore('pong', pongGame.player.score);
    }
    
    // ULEPSZONE AI
    if (pongGame.ball.dx > 0) {
        // Piłka leci w stronę AI - przewiduj pozycję
        const timeToReachAI = (575 - pongGame.ball.x) / pongGame.ball.dx;
        let predictedY = pongGame.ball.y + pongGame.ball.dy * timeToReachAI;
        
        // Uwzględnij odbicia od ścian
        while (predictedY < 0 || predictedY > 300) {
            if (predictedY < 0) {
                predictedY = -predictedY;
            } else if (predictedY > 300) {
                predictedY = 600 - predictedY;
            }
        }
        
        pongGame.ai.targetY = predictedY - pongGame.paddleHeight / 2;
    } else {
        // Piłka leci w stronę gracza - wróć do środka
        pongGame.ai.targetY = 150 - pongGame.paddleHeight / 2;
    }
    
    // Płynny ruch AI do celu
    const diff = pongGame.ai.targetY - pongGame.ai.y;
    const maxMove = pongGame.ai.speed;
    
    if (Math.abs(diff) > maxMove) {
        pongGame.ai.y += diff > 0 ? maxMove : -maxMove;
    } else {
        pongGame.ai.y = pongGame.ai.targetY;
    }
    
    // Ograniczenia dla AI
    pongGame.ai.y = Math.max(0, Math.min(300 - pongGame.paddleHeight, pongGame.ai.y));
    
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
    
    // Paletki z gradientem
    const playerGradient = ctx.createLinearGradient(10, 0, 10 + pongGame.paddleWidth, 0);
    playerGradient.addColorStop(0, '#00ff00');
    playerGradient.addColorStop(1, '#00aa00');
    ctx.fillStyle = playerGradient;
    ctx.fillRect(10, pongGame.player.y, pongGame.paddleWidth, pongGame.paddleHeight);
    
    const aiGradient = ctx.createLinearGradient(575, 0, 575 + pongGame.paddleWidth, 0);
    aiGradient.addColorStop(0, '#ff0000');
    aiGradient.addColorStop(1, '#aa0000');
    ctx.fillStyle = aiGradient;
    ctx.fillRect(575, pongGame.ai.y, pongGame.paddleWidth, pongGame.paddleHeight);
    
    // Piłka z efektem świecenia
    const gradient = ctx.createRadialGradient(
        pongGame.ball.x, pongGame.ball.y, 0,
        pongGame.ball.x, pongGame.ball.y, pongGame.ball.radius * 2
    );
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.5, '#ff00ff');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pongGame.ball.x, pongGame.ball.y, pongGame.ball.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
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

// ===== IMPROVED WORDLE GAME WITH MULTIPLE WORD LENGTHS =====
const wordleGame = {
    currentWordLength: 5,
    wordList: [],
    usedWords: [],
    currentWord: '',
    currentRow: 0,
    currentTile: 0,
    gameBoard: [],
    keyboardState: {},
    gameActive: false,
    attempts: 6,
    
    init() {
        // Ustaw liczbę prób na podstawie długości słowa
        if (this.currentWordLength === 3) {
            this.attempts = 4;
        } else if (this.currentWordLength === 4) {
            this.attempts = 5;
        } else {
            this.attempts = 6;
        }
        
        // Ustaw odpowiednią listę słów
        this.wordList = wordleWords[this.currentWordLength] || wordleWords[5];
        
        // Aktualizuj UI
        document.getElementById('wordleLetterCount').textContent = this.currentWordLength;
        document.getElementById('wordleModeBadge').textContent = 
            this.currentWordLength === 3 ? 'Tryb: Łatwy' :
            this.currentWordLength === 4 ? 'Tryb: Średni' : 'Tryb: Trudny';
        
        // Ustaw CSS variable dla grid
        document.documentElement.style.setProperty('--word-length', this.currentWordLength);
        
        this.loadUsedWords();
        this.createBoard();
        this.createKeyboard();
        this.selectNewWord();
        this.gameActive = true;
        document.getElementById('wordleWarning').textContent = '';
    },
    
    loadUsedWords() {
        const key = `wordleUsedWords_${this.currentWordLength}`;
        const saved = localStorage.getItem(key);
        this.usedWords = saved ? JSON.parse(saved) : [];
        
        if (this.usedWords.length >= this.wordList.length - 1) {
            this.usedWords = [];
            localStorage.removeItem(key);
        }
    },
    
    saveUsedWords() {
        const key = `wordleUsedWords_${this.currentWordLength}`;
        localStorage.setItem(key, JSON.stringify(this.usedWords));
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
        
        for (let i = 0; i < this.attempts; i++) {
            const row = document.createElement('div');
            row.className = 'wordle-row';
            const rowTiles = [];
            
            for (let j = 0; j < this.currentWordLength; j++) {
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
        
        // Dodaj polskie znaki jeśli tryb 3 lub 4 literowy
        if (this.currentWordLength <= 4) {
            rows[1].push('Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż');
        }
        
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
        } else if (key.length === 1 && key.match(/[a-ząćęłńóśźż]/i)) {
            this.addLetter(key.toUpperCase());
        }
    },
    
    addLetter(letter) {
        if (this.currentTile < this.currentWordLength && this.currentRow < this.attempts) {
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
    
    isValidWord(word) {
        return this.wordList.includes(word);
    },
    
    submitGuess() {
        if (this.currentTile !== this.currentWordLength) {
            this.showMessage(`Słowo musi mieć ${this.currentWordLength} liter!`);
            return;
        }
        
        const guess = this.gameBoard[this.currentRow].join('');
        
        // Sprawdź czy słowo jest prawidłowe
        if (!this.isValidWord(guess)) {
            document.getElementById('wordleWarning').textContent = 'To nie jest prawidłowe słowo!';
            
            // Animacja trzęsienia dla nieprawidłowego słowa
            for (let i = 0; i < this.currentWordLength; i++) {
                const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
                tile.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    tile.style.animation = '';
                }, 500);
            }
            
            setTimeout(() => {
                document.getElementById('wordleWarning').textContent = '';
            }, 2000);
            
            return;
        }
        
        const letterCount = {};
        for (let letter of this.currentWord) {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
        
        const tileStates = [];
        
        for (let i = 0; i < this.currentWordLength; i++) {
            if (guess[i] === this.currentWord[i]) {
                tileStates[i] = 'correct';
                letterCount[guess[i]]--;
            }
        }
        
        for (let i = 0; i < this.currentWordLength; i++) {
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
            } else if (this.currentRow === this.attempts - 1) {
                this.gameActive = false;
                this.showMessage(`Przegrałeś! Słowo to: ${this.currentWord}`, 'lose');
                statsManager.updateWordle(false);
            } else {
                this.currentRow++;
                this.currentTile = 0;
            }
        }, this.currentWordLength * 100 + 100);
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
        document.getElementById('wordleWarning').textContent = '';
        
        this.selectNewWord();
        
        this.gameBoard = Array(this.attempts).fill().map(() => Array(this.currentWordLength).fill(''));
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
                    snakeGame.direction = 'up';
                }
                break;
            case 'down':
                if (prevDy === 0) {
                    snakeGame.dx = 0;
                    snakeGame.dy = 20;
                    snakeGame.direction = 'down';
                }
                break;
            case 'left':
                if (prevDx === 0) {
                    snakeGame.dx = -20;
                    snakeGame.dy = 0;
                    snakeGame.direction = 'left';
                }
                break;
            case 'right':
                if (prevDx === 0) {
                    snakeGame.dx = 20;
                    snakeGame.dy = 0;
                    snakeGame.direction = 'right';
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
    
    showNotification('🎮 Witaj w Gaming Hub! Wybierz grę i baw się dobrze!');
});