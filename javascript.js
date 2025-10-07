// ===== CLEAN CODE METODA 1: Single Responsibility - Zarządzanie stanem gry =====
const gameStateManager = {
    currentGame: null,
    currentGameLoop: null,
    gameStates: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver'
    },
    currentState: 'menu',
    
    // Czytelna metoda zmiany stanu
    changeState(newState) {
        // Guard clause - wczesne wyjście
        if (!Object.values(this.gameStates).includes(newState)) {
            console.error(`Invalid state: ${newState}`);
            return false;
        }
        
        this.currentState = newState;
        this.handleStateTransition(newState);
        return true;
    },
    
    // Obsługa przejść między stanami
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
    
    // Pomocnicze metody o jasnych nazwach
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

// ===== CLEAN CODE METODA 2: DRY - Centralna obsługa dźwięków =====
const soundManager = {
    audioContext: null,
    isMuted: false,
    masterVolume: 0.5,
    
    // Konfiguracja dźwięków w jednym miejscu - DRY principle
    soundConfigs: {
        click: { frequency: 200, duration: 0.1, type: 'square' },
        pickup: { frequency: 800, duration: 0.2, type: 'sine' },
        hit: { frequency: 150, duration: 0.3, type: 'sawtooth' },
        bounce: { frequency: 400, duration: 0.1, type: 'sine' },
        score: { frequency: 600, duration: 0.3, type: 'sine' },
        lose: { frequency: 100, duration: 0.6, type: 'square' },
        shoot: { frequency: 300, duration: 0.15, type: 'triangle' },
        explode: { frequency: 80, duration: 0.4, type: 'sawtooth' },
        win: { frequency: 1000, duration: 0.5, type: 'sine' }
    },
    
    // Inicjalizacja z lazy loading
    init() {
        if (this.audioContext) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            return true;
        } catch (error) {
            console.error('Audio init failed:', error);
            return false;
        }
    },
    
    // Główna metoda odtwarzania - unikamy duplikacji kodu
    play(soundName, customVolume = 1) {
        // Multiple guard clauses dla czytelności
        if (this.isMuted) return;
        if (!this.audioContext) this.init();
        if (!this.soundConfigs[soundName]) return;
        
        const config = this.soundConfigs[soundName];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = config.type;
        oscillator.frequency.value = config.frequency;
        gainNode.gain.value = this.masterVolume * customVolume;
        
        // Fade out dla płynności
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, 
            this.audioContext.currentTime + config.duration
        );
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + config.duration);
    },
    
    // Metoda toggle z jasną nazwą
    toggleMute() {
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('soundToggle');
        if (btn) {
            btn.textContent = this.isMuted ? '🔇 Dźwięk: OFF' : '🔊 Dźwięk: ON';
        }
        return this.isMuted;
    }
};

// ===== CLEAN CODE METODA 3: Input Validation - Bezpieczna obsługa wejścia =====
const inputHandler = {
    activeKeys: new Set(),
    
    // Mapowanie klawiszy - separation of concerns
    keyMap: {
        'ArrowUp': 'up', 'ArrowDown': 'down', 
        'ArrowLeft': 'left', 'ArrowRight': 'right',
        'w': 'up', 'W': 'up',
        's': 'down', 'S': 'down',
        'a': 'left', 'A': 'left',
        'd': 'right', 'D': 'right',
        ' ': 'shoot', 'Space': 'shoot',
        'Enter': 'confirm', 'Escape': 'pause',
        'p': 'pause', 'P': 'pause'
    },
    
    // Sanityzacja i walidacja klawisza
    sanitizeKey(key) {
        if (typeof key !== 'string') return '';
        // Ograniczenie długości i usunięcie niebezpiecznych znaków
        return key.substring(0, 20).replace(/[<>\"\']/g, '');
    },
    
    // Normalizacja klawisza do akcji
    normalizeKey(key) {
        const sanitized = this.sanitizeKey(key);
        return this.keyMap[sanitized] || sanitized.toLowerCase();
    },
    
    // Obsługa keydown z walidacją
    handleKeyDown(event) {
        const key = this.normalizeKey(event.key);
        
        // Zapobieganie wielokrotnemu wywołaniu
        if (this.activeKeys.has(key)) return key;
        
        this.activeKeys.add(key);
        
        // Zapobieganie domyślnym akcjom dla niektórych klawiszy
        if (this.shouldPreventDefault(event.key)) {
            event.preventDefault();
        }
        
        return key;
    },
    
    // Obsługa keyup
    handleKeyUp(event) {
        const key = this.normalizeKey(event.key);
        this.activeKeys.delete(key);
        return key;
    },
    
    // Określenie czy zapobiec domyślnej akcji
    shouldPreventDefault(key) {
        const preventKeys = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        return preventKeys.includes(key);
    },
    
    // Sprawdzenie czy klawisz jest wciśnięty
    isPressed(action) {
        return this.activeKeys.has(action);
    },
    
    // Czyszczenie stanu
    clearAll() {
        this.activeKeys.clear();
    }
};

// ===== ISTNIEJĄCY KOD GRY Z INTEGRACJĄ CLEAN CODE =====

// Zmienne globalne
let currentGame = null;
let snakeGame, pongGame, breakoutGame;

// Inicjalizacja cząsteczek
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

// Funkcja startująca grę z UI
function uiStart(game) {
    soundManager.play('click');
    gameStateManager.changeState('playing');
    
    // Ukryj menu
    document.getElementById('gameMenu').style.display = 'none';
    
    // Pokaż odpowiednią grę
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    
    // Licznik startowy
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

// Pokazanie licznika
function showCountdown(callback) {
    const countdown = document.getElementById('countdown');
    countdown.classList.remove('hidden');
    let count = 3;
    
    const interval = setInterval(() => {
        if (count > 0) {
            countdown.textContent = count;
            soundManager.play('click');
            count--;
        } else {
            countdown.textContent = 'GO!';
            soundManager.play('score');
            setTimeout(() => {
                countdown.classList.add('hidden');
                callback();
            }, 500);
            clearInterval(interval);
        }
    }, 1000);
}

// Powrót do menu
function backToMenu() {
    soundManager.play('click');
    gameStateManager.changeState('menu');
    inputHandler.clearAll();
}

// ===== SNAKE GAME =====
function initSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    snakeGame = {
        snake: [{x: 200, y: 200}],
        dx: 20,
        dy: 0,
        food: {x: 0, y: 0},
        score: 0,
        gameOver: false
    };
    
    generateFood();
    
    // Czyszczenie poprzedniej pętli
    if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
    }
    
    gameStateManager.currentGameLoop = setInterval(() => {
        if (!snakeGame.gameOver) {
            updateSnake();
            drawSnake();
        }
    }, 100);
}

function generateFood() {
    if (!snakeGame) return;
    
    const canvas = document.getElementById('snakeCanvas');
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
    
    // Wrap around
    if (head.x < 0) head.x = 380;
    if (head.x >= 400) head.x = 0;
    if (head.y < 0) head.y = 380;
    if (head.y >= 400) head.y = 0;
    
    // Kolizja z samym sobą
    if (snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        snakeGame.gameOver = true;
        soundManager.play('lose');
        return;
    }
    
    snakeGame.snake.unshift(head);
    
    // Jedzenie
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score += 10;
        document.getElementById('snakeScore').textContent = `Energia: ${snakeGame.score}`;
        soundManager.play('pickup');
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
    
    // Rysuj węża
    ctx.fillStyle = '#00ff00';
    snakeGame.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00';
        ctx.fillRect(segment.x, segment.y, 18, 18);
    });
    
    // Rysuj jedzenie
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(snakeGame.food.x, snakeGame.food.y, 18, 18);
    
    // Game Over
    if (snakeGame.gameOver) {
        ctx.fillStyle = '#ff0000';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', 200, 200);
    }
}

function resetSnake() {
    soundManager.play('click');
    initSnake();
}

// ===== PONG GAME =====
function initPong() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    pongGame = {
        ball: {x: 300, y: 150, dx: 4, dy: 3, radius: 8},
        player: {y: 100, score: 0},
        ai: {y: 100, score: 0},
        paddleHeight: 80,
        paddleWidth: 15
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
    // Aktualizacja piłki
    pongGame.ball.x += pongGame.ball.dx;
    pongGame.ball.y += pongGame.ball.dy;
    
    // Odbicie od ścian
    if (pongGame.ball.y - pongGame.ball.radius <= 0 || 
        pongGame.ball.y + pongGame.ball.radius >= 300) {
        pongGame.ball.dy = -pongGame.ball.dy;
        soundManager.play('bounce');
    }
    
    // Odbicie od paletek
    if (pongGame.ball.x - pongGame.ball.radius <= 25) {
        if (pongGame.ball.y >= pongGame.player.y && 
            pongGame.ball.y <= pongGame.player.y + pongGame.paddleHeight) {
            pongGame.ball.dx = -pongGame.ball.dx;
            const relativeY = (pongGame.ball.y - pongGame.player.y) / pongGame.paddleHeight;
            pongGame.ball.dy = (relativeY - 0.5) * 8;
            soundManager.play('hit');
        }
    }
    
    if (pongGame.ball.x + pongGame.ball.radius >= 575) {
        if (pongGame.ball.y >= pongGame.ai.y && 
            pongGame.ball.y <= pongGame.ai.y + pongGame.paddleHeight) {
            pongGame.ball.dx = -pongGame.ball.dx;
            soundManager.play('hit');
        }
    }
    
    // Punkty
    if (pongGame.ball.x < 0) {
        pongGame.ai.score++;
        resetBall();
        soundManager.play('score');
    }
    if (pongGame.ball.x > 600) {
        pongGame.player.score++;
        resetBall();
        soundManager.play('score');
    }
    
    // AI
    const aiSpeed = 3;
    if (pongGame.ball.y < pongGame.ai.y + pongGame.paddleHeight / 2) {
        pongGame.ai.y = Math.max(0, pongGame.ai.y - aiSpeed);
    } else {
        pongGame.ai.y = Math.min(220, pongGame.ai.y + aiSpeed);
    }
    
    document.getElementById('pongScore').textContent = 
        `Człowiek: ${pongGame.player.score} | AI: ${pongGame.ai.score}`;
}

function resetBall() {
    pongGame.ball.x = 300;
    pongGame.ball.y = 150;
    pongGame.ball.dx = (Math.random() > 0.5 ? 4 : -4);
    pongGame.ball.dy = (Math.random() - 0.5) * 6;
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
    soundManager.play('click');
    initPong();
}

// ===== BREAKOUT GAME =====
function initBreakout() {
    const canvas = document.getElementById('breakoutCanvas');
    
    breakoutGame = {
        ball: {x: 250, y: 350, dx: 3, dy: -3, radius: 8},
        paddle: {x: 210, width: 80, height: 10},
        bricks: [],
        score: 0,
        lives: 3,
        gameOver: false
    };
    
    // Tworzenie cegieł
    for (let r = 0; r < 5; r++) {
        breakoutGame.bricks[r] = [];
        for (let c = 0; c < 8; c++) {
            breakoutGame.bricks[r][c] = {
                x: c * 60 + 15,
                y: r * 30 + 40,
                width: 50,
                height: 20,
                destroyed: false,
                color: `hsl(${r * 60}, 70%, 50%)`
            };
        }
    }
    
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

function updateBreakout() {
    // Aktualizacja piłki
    breakoutGame.ball.x += breakoutGame.ball.dx;
    breakoutGame.ball.y += breakoutGame.ball.dy;
    
    // Odbicie od ścian
    if (breakoutGame.ball.x + breakoutGame.ball.radius > 500 || 
        breakoutGame.ball.x - breakoutGame.ball.radius < 0) {
        breakoutGame.ball.dx = -breakoutGame.ball.dx;
        soundManager.play('bounce');
    }
    
    if (breakoutGame.ball.y - breakoutGame.ball.radius < 0) {
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
        soundManager.play('bounce');
    }
    
    // Strata życia
    if (breakoutGame.ball.y > 400) {
        breakoutGame.lives--;
        if (breakoutGame.lives <= 0) {
            breakoutGame.gameOver = true;
            soundManager.play('lose');
        } else {
            breakoutGame.ball.x = 250;
            breakoutGame.ball.y = 350;
            breakoutGame.ball.dx = 3;
            breakoutGame.ball.dy = -3;
            soundManager.play('hit');
        }
    }
    
    // Odbicie od paletki
    if (breakoutGame.ball.y + breakoutGame.ball.radius >= 380 &&
        breakoutGame.ball.x >= breakoutGame.paddle.x &&
        breakoutGame.ball.x <= breakoutGame.paddle.x + breakoutGame.paddle.width) {
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
        const relativeX = (breakoutGame.ball.x - breakoutGame.paddle.x) / breakoutGame.paddle.width;
        breakoutGame.ball.dx = (relativeX - 0.5) * 8;
        soundManager.play('hit');
    }
    
    // Kolizje z cegłami
    for (let r = 0; r < breakoutGame.bricks.length; r++) {
        for (let c = 0; c < breakoutGame.bricks[r].length; c++) {
            const brick = breakoutGame.bricks[r][c];
            if (!brick.destroyed) {
                if (breakoutGame.ball.x > brick.x &&
                    breakoutGame.ball.x < brick.x + brick.width &&
                    breakoutGame.ball.y > brick.y &&
                    breakoutGame.ball.y < brick.y + brick.height) {
                    breakoutGame.ball.dy = -breakoutGame.ball.dy;
                    brick.destroyed = true;
                    breakoutGame.score += 10;
                    soundManager.play('explode');
                }
            }
        }
    }
    
    // Sprawdzenie wygranej
    const allDestroyed = breakoutGame.bricks.every(row => 
        row.every(brick => brick.destroyed)
    );
    
    if (allDestroyed) {
        breakoutGame.gameOver = true;
        soundManager.play('win');
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
            if (!brick.destroyed) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
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

function resetBreakout() {
    soundManager.play('click');
    initBreakout();
}

// ===== Event Listeners z Clean Code =====
document.addEventListener('keydown', (e) => {
    const key = inputHandler.handleKeyDown(e);
    
    // Snake controls
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
    
    // Pong controls
    if (gameStateManager.currentGame === 'pong' && pongGame) {
        if (key === 'up') {
            pongGame.player.y = Math.max(0, pongGame.player.y - 20);
        } else if (key === 'down') {
            pongGame.player.y = Math.min(220, pongGame.player.y + 20);
        }
    }
    
    // Breakout controls
    if (gameStateManager.currentGame === 'breakout' && breakoutGame && !breakoutGame.gameOver) {
        if (key === 'left') {
            breakoutGame.paddle.x = Math.max(0, breakoutGame.paddle.x - 30);
        } else if (key === 'right') {
            breakoutGame.paddle.x = Math.min(420, breakoutGame.paddle.x + 30);
        }
    }
});

document.addEventListener('keyup', (e) => {
    inputHandler.handleKeyUp(e);
});

// Inicjalizacja przy załadowaniu
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    soundManager.init();
    
    // Event listener dla przycisku dźwięku
    document.getElementById('soundToggle').addEventListener('click', () => {
        soundManager.toggleMute();
        soundManager.play('click');
    });
});