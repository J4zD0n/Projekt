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

// ===== CLEAN CODE METODA 4: Composition over Inheritance - System komponentów =====
class GameComponent {
    constructor(x = 0, y = 0) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 0, height: 0 };
        this.color = '#ffffff';
        this.active = true;
    }
    
    // Podstawowe metody dla wszystkich komponentów
    update(deltaTime) {
        if (!this.active) return;
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
    
    render(ctx) {
        if (!this.active) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
    
    // Collision detection jako współdzielona funkcjonalność
    checkCollision(other) {
        return this.position.x < other.position.x + other.size.width &&
               this.position.x + this.size.width > other.position.x &&
               this.position.y < other.position.y + other.size.height &&
               this.position.y + this.size.height > other.position.y;
    }
    
    // Wrap around dla obiektów
    wrapAround(maxX, maxY) {
        if (this.position.x < 0) this.position.x = maxX;
        if (this.position.x > maxX) this.position.x = 0;
        if (this.position.y < 0) this.position.y = maxY;
        if (this.position.y > maxY) this.position.y = 0;
    }
}

// Kompozycja - tworzenie złożonych obiektów z prostych komponentów
const gameObjectFactory = {
    // Factory dla tworzenia różnych typów obiektów
    createBall(x, y, radius, speed) {
        const ball = new GameComponent(x, y);
        ball.radius = radius;
        ball.velocity = { x: speed, y: speed };
        ball.size = { width: radius * 2, height: radius * 2 };
        
        // Dodanie specyficznych metod dla piłki
        ball.bounce = function(axis) {
            if (axis === 'x') this.velocity.x *= -1;
            if (axis === 'y') this.velocity.y *= -1;
            soundManager.play('bounce');
        };
        
        // Override render dla okrągłego kształtu
        ball.render = function(ctx) {
            if (!this.active) return;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        };
        
        return ball;
    },
    
    createPaddle(x, y, width, height) {
        const paddle = new GameComponent(x, y);
        paddle.size = { width, height };
        paddle.speed = 5;
        
        // Metody specyficzne dla paletki
        paddle.moveLeft = function(limit = 0) {
            this.position.x = Math.max(limit, this.position.x - this.speed);
        };
        
        paddle.moveRight = function(limit) {
            this.position.x = Math.min(limit - this.size.width, this.position.x + this.speed);
        };
        
        paddle.moveUp = function(limit = 0) {
            this.position.y = Math.max(limit, this.position.y - this.speed);
        };
        
        paddle.moveDown = function(limit) {
            this.position.y = Math.min(limit - this.size.height, this.position.y + this.speed);
        };
        
        return paddle;
    },
    
    createBrick(x, y, width, height, color, points = 10) {
        const brick = new GameComponent(x, y);
        brick.size = { width, height };
        brick.color = color;
        brick.points = points;
        brick.health = 1;
        
        brick.hit = function() {
            this.health--;
            if (this.health <= 0) {
                this.active = false;
                soundManager.play('explode');
                return this.points;
            }
            soundManager.play('hit');
            return 0;
        };
        
        return brick;
    },
    
    createSnakeSegment(x, y, size) {
        const segment = new GameComponent(x, y);
        segment.size = { width: size, height: size };
        segment.color = '#00ff00';
        return segment;
    }
};

// ===== CLEAN CODE METODA 5: Open/Closed Principle - System rozszerzeń =====
const gamePluginSystem = {
    plugins: new Map(),
    hooks: new Map(),
    
    // Rejestracja pluginu - otwarte na rozszerzenia
    registerPlugin(name, plugin) {
        if (typeof plugin.init !== 'function') {
            throw new Error('Plugin must have init method');
        }
        
        this.plugins.set(name, plugin);
        
        // Inicjalizacja pluginu
        plugin.init();
        
        // Rejestracja hooków jeśli istnieją
        if (plugin.hooks) {
            Object.entries(plugin.hooks).forEach(([hookName, handler]) => {
                this.registerHook(hookName, handler);
            });
        }
        
        console.log(`Plugin '${name}' registered successfully`);
    },
    
    // System hooków - pozwala na rozszerzanie bez modyfikacji
    registerHook(hookName, handler) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName).push(handler);
    },
    
    // Wykonanie hooków
    executeHook(hookName, data = {}) {
        if (!this.hooks.has(hookName)) return data;
        
        const handlers = this.hooks.get(hookName);
        let result = data;
        
        handlers.forEach(handler => {
            result = handler(result) || result;
        });
        
        return result;
    },
    
    // Pobieranie pluginu
    getPlugin(name) {
        return this.plugins.get(name);
    },
    
    // Usuwanie pluginu
    removePlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin && typeof plugin.destroy === 'function') {
            plugin.destroy();
        }
        this.plugins.delete(name);
    }
};

// Przykładowe pluginy rozszerzające funkcjonalność
const scoreMultiplierPlugin = {
    multiplier: 1,
    comboCount: 0,
    lastScoreTime: 0,
    
    init() {
        console.log('Score Multiplier Plugin initialized');
        this.multiplier = 1;
        this.comboCount = 0;
    },
    
    hooks: {
        'onScore': function(data) {
            const now = Date.now();
            const plugin = gamePluginSystem.getPlugin('scoreMultiplier');
            
            // Combo system - jeśli punkty zdobyte w ciągu 2 sekund
            if (now - plugin.lastScoreTime < 2000) {
                plugin.comboCount++;
                plugin.multiplier = Math.min(5, 1 + plugin.comboCount * 0.5);
            } else {
                plugin.comboCount = 0;
                plugin.multiplier = 1;
            }
            
            plugin.lastScoreTime = now;
            
            // Modyfikacja punktów
            data.points = Math.floor(data.points * plugin.multiplier);
            
            if (plugin.multiplier > 1) {
                console.log(`COMBO x${plugin.multiplier.toFixed(1)}!`);
            }
            
            return data;
        }
    },
    
    reset() {
        this.multiplier = 1;
        this.comboCount = 0;
        this.lastScoreTime = 0;
    },
    
    destroy() {
        console.log('Score Multiplier Plugin destroyed');
        this.reset();
    }
};

const particleEffectsPlugin = {
    particles: [],
    maxParticles: 100,
    
    init() {
        console.log('Particle Effects Plugin initialized');
        this.particles = [];
    },
    
    hooks: {
        'onCollision': function(data) {
            const plugin = gamePluginSystem.getPlugin('particleEffects');
            plugin.createExplosion(data.x, data.y);
            return data;
        },
        
        'onRender': function(data) {
            const plugin = gamePluginSystem.getPlugin('particleEffects');
            if (data.ctx) {
                plugin.renderParticles(data.ctx);
            }
            return data;
        }
    },
    
    createExplosion(x, y, count = 10) {
        for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }
    },
    
    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life--;
            return p.life > 0;
        });
    },
    
    renderParticles(ctx) {
        this.updateParticles();
        
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life / 30;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            ctx.restore();
        });
    },
    
    destroy() {
        console.log('Particle Effects Plugin destroyed');
        this.particles = [];
    }
};

// Rejestracja pluginów przy starcie
gamePluginSystem.registerPlugin('scoreMultiplier', scoreMultiplierPlugin);
gamePluginSystem.registerPlugin('particleEffects', particleEffectsPlugin);

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
    
    // Wykonanie hooka przed startem gry
    gamePluginSystem.executeHook('beforeGameStart', { game });
    
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
        
        // Hook po starcie gry
        gamePluginSystem.executeHook('afterGameStart', { game });
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
    
    // Reset pluginów
    const scorePlugin = gamePluginSystem.getPlugin('scoreMultiplier');
    if (scorePlugin) scorePlugin.reset();
}

// ===== SNAKE GAME =====
function initSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    snakeGame = {
        snake: [],
        dx: 20,
        dy: 0,
        food: null,
        score: 0,
        gameOver: false
    };
    
    // Użycie factory do tworzenia segmentów węża
    const startSegment = gameObjectFactory.createSnakeSegment(200, 200, 18);
    snakeGame.snake.push(startSegment);
    
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
    let x, y;
    
    do {
        x = Math.floor(Math.random() * 20) * 20;
        y = Math.floor(Math.random() * 20) * 20;
    } while (snakeGame.snake.some(segment => 
        segment.position.x === x && segment.position.y === y
    ));
    
    snakeGame.food = gameObjectFactory.createSnakeSegment(x, y, 18);
    snakeGame.food.color = '#ff00ff';
}

function updateSnake() {
    const head = snakeGame.snake[0];
    const newHead = gameObjectFactory.createSnakeSegment(
        head.position.x + snakeGame.dx,
        head.position.y + snakeGame.dy,
        18
    );
    
    // Wrap around
    newHead.wrapAround(400, 400);
    
    // Kolizja z samym sobą
    if (snakeGame.snake.some(segment => 
        segment.position.x === newHead.position.x && 
        segment.position.y === newHead.position.y)) {
        snakeGame.gameOver = true;
        soundManager.play('lose');
        return;
    }
    
    snakeGame.snake.unshift(newHead);
    
    // Jedzenie z użyciem systemu pluginów
    if (newHead.position.x === snakeGame.food.position.x && 
        newHead.position.y === snakeGame.food.position.y) {
        
        // Hook dla systemu punktów
        const scoreData = gamePluginSystem.executeHook('onScore', { 
            points: 10, 
            game: 'snake' 
        });
        
        snakeGame.score += scoreData.points;
        document.getElementById('snakeScore').textContent = `Energia: ${snakeGame.score}`;
        soundManager.play('pickup');
        
        // Hook dla efektów
        gamePluginSystem.executeHook('onCollision', {
            x: snakeGame.food.position.x,
            y: snakeGame.food.position.y,
            type: 'food'
        });
        
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
    
    // Rysuj węża używając metod komponentów
    snakeGame.snake.forEach((segment, index) => {
        segment.color = index === 0 ? '#00ff00' : '#00cc00';
        segment.render(ctx);
    });
    
    // Rysuj jedzenie
    if (snakeGame.food) {
        snakeGame.food.render(ctx);
    }
    
    // Hook dla dodatkowych efektów renderowania
    gamePluginSystem.executeHook('onRender', { ctx, game: 'snake' });
    
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
    const scorePlugin = gamePluginSystem.getPlugin('scoreMultiplier');
    if (scorePlugin) scorePlugin.reset();
    initSnake();
}

// ===== PONG GAME =====
function initPong() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    pongGame = {
        ball: gameObjectFactory.createBall(300, 150, 8, 4),
        player: gameObjectFactory.createPaddle(10, 100, 15, 80),
        ai: gameObjectFactory.createPaddle(575, 100, 15, 80),
        playerScore: 0,
        aiScore: 0
    };
    
    pongGame.ball.color = '#ff00ff';
    pongGame.player.color = '#00ff00';
    pongGame.ai.color = '#00ff00';
    
    if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
    }
    
    gameStateManager.currentGameLoop = setInterval(() => {
        updatePong();
        drawPong();
    }, 1000 / 60);
}

function updatePong() {
    // Aktualizacja piłki używając komponentów
    pongGame.ball.update(1);
    
    // Odbicie od ścian
    if (pongGame.ball.position.y - pongGame.ball.radius <= 0 || 
        pongGame.ball.position.y + pongGame.ball.radius >= 300) {
        pongGame.ball.bounce('y');
    }
    
    // Odbicie od paletek
    if (pongGame.ball.checkCollision(pongGame.player)) {
        pongGame.ball.bounce('x');
        const relativeY = (pongGame.ball.position.y - pongGame.player.position.y) / pongGame.player.size.height;
        pongGame.ball.velocity.y = (relativeY - 0.5) * 8;
        soundManager.play('hit');
        
        gamePluginSystem.executeHook('onCollision', {
            x: pongGame.ball.position.x,
            y: pongGame.ball.position.y,
            type: 'paddle'
        });
    }
    
    if (pongGame.ball.checkCollision(pongGame.ai)) {
        pongGame.ball.bounce('x');
        soundManager.play('hit');
    }
    
    // Punkty
    if (pongGame.ball.position.x < 0) {
        pongGame.aiScore++;
        resetBall();
        soundManager.play('score');
    }
    if (pongGame.ball.position.x > 600) {
        const scoreData = gamePluginSystem.executeHook('onScore', { 
            points: 1, 
            game: 'pong' 
        });
        pongGame.playerScore += scoreData.points;
        resetBall();
        soundManager.play('score');
    }
    
    // AI
    const aiSpeed = 3;
    if (pongGame.ball.position.y < pongGame.ai.position.y + pongGame.ai.size.height / 2) {
        pongGame.ai.moveUp(0);
    } else {
        pongGame.ai.moveDown(300);
    }
    
    document.getElementById('pongScore').textContent = 
        `Człowiek: ${pongGame.playerScore} | AI: ${pongGame.aiScore}`;
}

function resetBall() {
    pongGame.ball.position.x = 300;
    pongGame.ball.position.y = 150;
    pongGame.ball.velocity.x = (Math.random() > 0.5 ? 4 : -4);
    pongGame.ball.velocity.y = (Math.random() - 0.5) * 6;
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
    
    // Rysowanie używając komponentów
    pongGame.player.render(ctx);
    pongGame.ai.render(ctx);
    pongGame.ball.render(ctx);
    
    // Hook dla efektów
    gamePluginSystem.executeHook('onRender', { ctx, game: 'pong' });
}

function resetPong() {
    soundManager.play('click');
    const scorePlugin = gamePluginSystem.getPlugin('scoreMultiplier');
    if (scorePlugin) scorePlugin.reset();
    initPong();
}

// ===== BREAKOUT GAME =====
function initBreakout() {
    const canvas = document.getElementById('breakoutCanvas');
    
    breakoutGame = {
        ball: gameObjectFactory.createBall(250, 350, 8, 3),
        paddle: gameObjectFactory.createPaddle(210, 380, 80, 10),
        bricks: [],
        score: 0,
        lives: 3,
        gameOver: false
    };
    
    breakoutGame.ball.velocity.y = -3;
    breakoutGame.ball.color = '#ff00ff';
    breakoutGame.paddle.color = '#00ff00';
    breakoutGame.paddle.speed = 30;
    
    // Tworzenie cegieł używając factory
    for (let r = 0; r < 5; r++) {
        breakoutGame.bricks[r] = [];
        for (let c = 0; c < 8; c++) {
            const brick = gameObjectFactory.createBrick(
                c * 60 + 15,
                r * 30 + 40,
                50,
                20,
                `hsl(${r * 60}, 70%, 50%)`,
                10 + r * 5
            );
            breakoutGame.bricks[r][c] = brick;
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
    breakoutGame.ball.update(1);
    
    // Odbicie od ścian
    if (breakoutGame.ball.position.x + breakoutGame.ball.radius > 500 || 
        breakoutGame.ball.position.x - breakoutGame.ball.radius < 0) {
        breakoutGame.ball.bounce('x');
    }
    
    if (breakoutGame.ball.position.y - breakoutGame.ball.radius < 0) {
        breakoutGame.ball.bounce('y');
    }
    
    // Strata życia
    if (breakoutGame.ball.position.y > 400) {
        breakoutGame.lives--;
        if (breakoutGame.lives <= 0) {
            breakoutGame.gameOver = true;
            soundManager.play('lose');
        } else {
            breakoutGame.ball.position.x = 250;
            breakoutGame.ball.position.y = 350;
            breakoutGame.ball.velocity.x = 3;
            breakoutGame.ball.velocity.y = -3;
            soundManager.play('hit');
        }
    }
    
    // Odbicie od paletki
    if (breakoutGame.ball.checkCollision(breakoutGame.paddle)) {
        breakoutGame.ball.bounce('y');
        const relativeX = (breakoutGame.ball.position.x - breakoutGame.paddle.position.x) / breakoutGame.paddle.size.width;
        breakoutGame.ball.velocity.x = (relativeX - 0.5) * 8;
        soundManager.play('hit');
    }
    
    // Kolizje z cegłami
    for (let r = 0; r < breakoutGame.bricks.length; r++) {
        for (let c = 0; c < breakoutGame.bricks[r].length; c++) {
            const brick = breakoutGame.bricks[r][c];
            if (brick.active && breakoutGame.ball.checkCollision(brick)) {
                breakoutGame.ball.bounce('y');
                const points = brick.hit();
                
                if (points > 0) {
                    const scoreData = gamePluginSystem.executeHook('onScore', { 
                        points, 
                        game: 'breakout' 
                    });
                    breakoutGame.score += scoreData.points;
                    
                    gamePluginSystem.executeHook('onCollision', {
                        x: brick.position.x + brick.size.width / 2,
                        y: brick.position.y + brick.size.height / 2,
                        type: 'brick'
                    });
                }
            }
        }
    }
    
    // Sprawdzenie wygranej
    const allDestroyed = breakoutGame.bricks.every(row => 
        row.every(brick => !brick.active)
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
    
    // Rysuj cegły używając komponentów
    for (let r = 0; r < breakoutGame.bricks.length; r++) {
        for (let c = 0; c < breakoutGame.bricks[r].length; c++) {
            breakoutGame.bricks[r][c].render(ctx);
        }
    }
    
    // Paletka i piłka
    breakoutGame.paddle.render(ctx);
    breakoutGame.ball.render(ctx);
    
    // Hook dla efektów
    gamePluginSystem.executeHook('onRender', { ctx, game: 'breakout' });
    
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
    const scorePlugin = gamePluginSystem.getPlugin('scoreMultiplier');
    if (scorePlugin) scorePlugin.reset();
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
            pongGame.player.moveUp(0);
        } else if (key === 'down') {
            pongGame.player.moveDown(300);
        }
    }
    
    // Breakout controls
    if (gameStateManager.currentGame === 'breakout' && breakoutGame && !breakoutGame.gameOver) {
        if (key === 'left') {
            breakoutGame.paddle.moveLeft(0);
        } else if (key === 'right') {
            breakoutGame.paddle.moveRight(500);
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