'use strict';

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  particlesContainer.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (10 + Math.random() * 5) + 's';
    particlesContainer.appendChild(particle);
  }
}

const AudioEngine = (() => {
  let ctx = null;
  let muted = false;

  function ensureContext() {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) ctx = new Ctx();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function beep({ frequency = 440, type = 'sine', duration = 0.06, volume = 0.2, attack = 0.005, decay = 0.12, detune = 0 } = {}) {
    if (muted) return;
    ensureContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);
    if (detune) osc.detune.setValueAtTime(detune, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + attack + decay + duration + 0.05);
  }

  function play(name) {
    const map = {
      click:   { frequency: 700, type: 'square',  duration: 0.03, volume: 0.15 },
      pickup:  { frequency: 880, type: 'triangle',duration: 0.06, volume: 0.22 },
      hit:     { frequency: 200, type: 'sawtooth',duration: 0.08, volume: 0.2 },
      bounce:  { frequency: 520, type: 'square',  duration: 0.05, volume: 0.16 },
      score:   { frequency: 1200,type: 'triangle',duration: 0.09, volume: 0.22 },
      lose:    { frequency: 140, type: 'sine',    duration: 0.18, volume: 0.28 },
      shoot:   { frequency: 950, type: 'sawtooth',duration: 0.05, volume: 0.15, detune: -300 },
      explode: { frequency: 90,  type: 'square',  duration: 0.25, volume: 0.3 },
      win:     { frequency: 1000,type: 'square',  duration: 0.18, volume: 0.22 },
    };
    beep(map[name] || {});
  }

  return {
    unlock: ensureContext,
    play,
    setMuted: (m) => { muted = m; },
    isMuted: () => muted
  };
})();

const countdownEl = document.getElementById('countdown');
function showCountdown(onDone) {
  if (!countdownEl) { onDone && onDone(); return; }
  let n = 3;
  countdownEl.classList.remove('hidden');
  countdownEl.textContent = n;
  const iv = setInterval(() => {
    n--;
    if (n <= 0) {
      countdownEl.textContent = 'GO!';
      AudioEngine.play('score');
      setTimeout(() => {
        countdownEl.classList.add('hidden');
        countdownEl.textContent = '';
        clearInterval(iv);
        onDone && onDone();
      }, 350);
    } else {
      AudioEngine.play('click');
      countdownEl.textContent = n;
    }
  }, 650);
}

function vibrate(ms = 40) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

let currentGame = null;
const gameLoops = {};

function startGame(gameType) {
  document.getElementById('gameMenu').style.display = 'none';
  document.querySelectorAll('.game-area').forEach(a => a.classList.remove('active'));
  document.getElementById(gameType + 'Game').classList.add('active');
  currentGame = gameType;
  Object.keys(gameLoops).forEach(k => { clearInterval(gameLoops[k]); gameLoops[k] = null; });

  showCountdown(() => {
    if (gameType === 'snake') initSnake();
    else if (gameType === 'pong') initPong();
    else if (gameType === 'breakout') initBreakout();
    else if (gameType === 'asteroids') initAsteroids();
  });
}

function backToMenu() {
  Object.keys(gameLoops).forEach(k => { clearInterval(gameLoops[k]); gameLoops[k] = null; });
  document.getElementById('gameMenu').style.display = 'grid';
  document.querySelectorAll('.game-area').forEach(a => a.classList.remove('active'));
  currentGame = null;
}

window.uiStart = (game) => {
  AudioEngine.unlock();
  AudioEngine.play('click');
  startGame(game);
};

// SNAKE GAME
let snake, food, direction, snakeScore;
const SNAKE_STEP = 20;

function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');

  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: 0 };
  snakeScore = 0;

  generateFood();
  updateSnakeScore();

  if (gameLoops.snake) clearInterval(gameLoops.snake);
  gameLoops.snake = setInterval(updateSnake, 100);

  drawSnake(ctx);
}

function generateFood() {
  const canvas = document.getElementById('snakeCanvas');
  const cols = Math.floor(canvas.width / SNAKE_STEP);
  const rows = Math.floor(canvas.height / SNAKE_STEP);

  let fx, fy;
  do {
    fx = Math.floor(Math.random() * cols) * SNAKE_STEP;
    fy = Math.floor(Math.random() * rows) * SNAKE_STEP;
  } while (snake && snake.some(seg => seg.x === fx && seg.y === fy));

  food = { x: fx, y: fy };
}

function updateSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');

  if (direction.x === 0 && direction.y === 0) {
    drawSnake(ctx);
    return;
  }

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver('snake'); return;
  }

  for (let seg of snake) {
    if (head.x === seg.x && head.y === seg.y) { gameOver('snake'); return; }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10; updateSnakeScore(); AudioEngine.play('pickup'); vibrate(30); generateFood();
  } else {
    snake.pop();
  }

  drawSnake(ctx);
}

function drawSnake(ctx) {
  const canvas = ctx.canvas;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ff0000'; ctx.fillRect(food.x, food.y, SNAKE_STEP, SNAKE_STEP);
  ctx.fillStyle = '#00ff00'; for (let seg of snake) ctx.fillRect(seg.x, seg.y, SNAKE_STEP, SNAKE_STEP);
}

function updateSnakeScore() {
  document.getElementById('snakeScore').textContent = `Energia: ${snakeScore}`;
}

function resetSnake() { AudioEngine.play('click'); initSnake(); }

// PONG GAME
let pongBall, player, computer, pongPlayerScore, pongComputerScore;

function initPong() {
  const canvas = document.getElementById('pongCanvas');
  const ctx = canvas.getContext('2d');

  pongBall = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, size: 10 };
  player = { x: 10, y: canvas.height / 2 - 25, width: 10, height: 50, dy: 0 };
  computer = { x: canvas.width - 20, y: canvas.height / 2 - 25, width: 10, height: 50 };
  pongPlayerScore = 0;
  pongComputerScore = 0;

  updatePongScore();

  if (gameLoops.pong) clearInterval(gameLoops.pong);
  gameLoops.pong = setInterval(updatePong, 1000 / 60);

  drawPong(ctx);
}

function updatePong() {
  const canvas = document.getElementById('pongCanvas');
  const ctx = canvas.getContext('2d');
  const r = pongBall.size;

  pongBall.x += pongBall.dx;
  pongBall.y += pongBall.dy;

  if (pongBall.y - r <= 0 || pongBall.y + r >= canvas.height) {
    pongBall.dy = -pongBall.dy; AudioEngine.play('bounce');
  }

  if (pongBall.dx < 0 &&
      pongBall.x - r <= player.x + player.width &&
      pongBall.y >= player.y && pongBall.y <= player.y + player.height) {
    pongBall.x = player.x + player.width + r + 0.5;
    const relative = (pongBall.y - (player.y + player.height / 2)) / (player.height / 2);
    pongBall.dx = Math.abs(pongBall.dx) + 0.2;
    pongBall.dy = 5 * relative;
    AudioEngine.play('bounce');
  }

  if (pongBall.dx > 0 &&
      pongBall.x + r >= computer.x &&
      pongBall.y >= computer.y && pongBall.y <= computer.y + computer.height) {
    pongBall.x = computer.x - r - 0.5;
    const relative = (pongBall.y - (computer.y + computer.height / 2)) / (computer.height / 2);
    pongBall.dx = -Math.abs(pongBall.dx) - 0.2;
    pongBall.dy = 5 * relative;
    AudioEngine.play('bounce');
  }

  if (pongBall.x + r < 0) {
    pongComputerScore++; updatePongScore(); resetPongBall(canvas); AudioEngine.play('score'); vibrate(30);
  } else if (pongBall.x - r > canvas.width) {
    pongPlayerScore++; updatePongScore(); resetPongBall(canvas); AudioEngine.play('score'); vibrate(30);
  }

  player.y += player.dy;
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

  if (computer.y + computer.height / 2 < pongBall.y) computer.y += 3; else computer.y -= 3;
  computer.y = Math.max(0, Math.min(canvas.height - computer.height, computer.y));

  drawPong(ctx);
}

function drawPong(ctx) {
  const canvas = ctx.canvas;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(computer.x, computer.y, computer.width, computer.height);
  ctx.beginPath(); ctx.arc(pongBall.x, pongBall.y, pongBall.size, 0, Math.PI * 2); ctx.fill();
  ctx.setLineDash([5, 15]); ctx.strokeStyle = '#666';
  ctx.beginPath(); ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height); ctx.stroke();
}

function resetPongBall(canvas = document.getElementById('pongCanvas')) {
  const dirX = Math.random() > 0.5 ? 1 : -1;
  const dirY = Math.random() > 0.5 ? 1 : -1;
  pongBall.x = canvas.width / 2; pongBall.y = canvas.height / 2;
  pongBall.dx = dirX * 4; pongBall.dy = dirY * (2 + Math.random() * 2);
}

function updatePongScore() {
  document.getElementById('pongScore').textContent = `Człowiek: ${pongPlayerScore} | AI: ${pongComputerScore}`;
}

function resetPong() { AudioEngine.play('click'); initPong(); }

// BREAKOUT GAME
let breakoutBall, breakoutPaddle, breakoutBricks, breakoutScore, breakoutLives;

function initBreakout() {
  const canvas = document.getElementById('breakoutCanvas');
  const ctx = canvas.getContext('2d');

  breakoutBall = { x: 250, y: 350, dx: 4, dy: -4, size: 8 };
  breakoutPaddle = { x: 200, y: 370, width: 100, height: 10, dx: 0 };
  breakoutScore = 0;
  breakoutLives = 3;

  breakoutBricks = [];
  const rows = 6, cols = 10, bw = 45, bh = 15, gap = 5, x0 = 5, y0 = 50;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      breakoutBricks.push({ x: x0 + col * (bw + gap), y: y0 + row * (bh + gap), width: bw, height: bh, alive: true });
    }
  }

  updateBreakoutScore();

  if (gameLoops.breakout) clearInterval(gameLoops.breakout);
  gameLoops.breakout = setInterval(updateBreakout, 1000 / 60);

  drawBreakout(ctx);
}

function updateBreakout() {
  const canvas = document.getElementById('breakoutCanvas');
  const ctx = canvas.getContext('2d');
  const r = breakoutBall.size;

  breakoutBall.x += breakoutBall.dx;
  breakoutBall.y += breakoutBall.dy;

  if (breakoutBall.x - r <= 0 || breakoutBall.x + r >= canvas.width) { breakoutBall.dx = -breakoutBall.dx; AudioEngine.play('bounce'); }
  if (breakoutBall.y - r <= 0) { breakoutBall.dy = -breakoutBall.dy; AudioEngine.play('bounce'); }

  if (breakoutBall.y + r >= breakoutPaddle.y &&
      breakoutBall.x >= breakoutPaddle.x &&
      breakoutBall.x <= breakoutPaddle.x + breakoutPaddle.width &&
      breakoutBall.dy > 0) {
    breakoutBall.dy = -Math.abs(breakoutBall.dy);
    const hit = (breakoutBall.x - (breakoutPaddle.x + breakoutPaddle.width / 2)) / (breakoutPaddle.width / 2);
    breakoutBall.dx += hit * 1.5;
    AudioEngine.play('bounce');
  }

  if (breakoutBall.y - r > canvas.height) {
    breakoutLives--;
    if (breakoutLives <= 0) { gameOver('breakout'); return; }
    breakoutBall.x = 250; breakoutBall.y = 350; breakoutBall.dx = 4; breakoutBall.dy = -4;
    AudioEngine.play('lose'); vibrate(50);
    updateBreakoutScore();
  }

  for (let brick of breakoutBricks) {
    if (!brick.alive) continue;
    if (breakoutBall.x + r >= brick.x &&
        breakoutBall.x - r <= brick.x + brick.width &&
        breakoutBall.y + r >= brick.y &&
        breakoutBall.y - r <= brick.y + brick.height) {
      brick.alive = false;
      breakoutScore += 10; updateBreakoutScore(); AudioEngine.play('hit'); vibrate(20);
      breakoutBall.dy = -breakoutBall.dy;
      break;
    }
  }

  if (breakoutBricks.every(b => !b.alive)) { gameOver('breakout', true); return; }

  breakoutPaddle.x += breakoutPaddle.dx;
  breakoutPaddle.x = Math.max(0, Math.min(canvas.width - breakoutPaddle.width, breakoutPaddle.x));

  drawBreakout(ctx);
}

function drawBreakout(ctx) {
  const canvas = ctx.canvas;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let brick of breakoutBricks) {
    if (!brick.alive) continue;
    ctx.fillStyle = `hsl(${(brick.x + brick.y) % 360}, 70%, 50%)`;
    ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
  }

  ctx.fillStyle = '#fff';
  ctx.fillRect(breakoutPaddle.x, breakoutPaddle.y, breakoutPaddle.width, breakoutPaddle.height);

  ctx.beginPath(); ctx.arc(breakoutBall.x, breakoutBall.y, breakoutBall.size, 0, Math.PI * 2); ctx.fill();
}

function updateBreakoutScore() {
  document.getElementById('breakoutScore').textContent = `Hack Points: ${breakoutScore} | System Lives: ${breakoutLives}`;
}

function resetBreakout() { AudioEngine.play('click'); initBreakout(); }

// ASTEROIDS GAME
let ship, asteroids, bullets, asteroidsScore, asteroidsLives;

function initAsteroids() {
  const canvas = document.getElementById('asteroidsCanvas');
  const ctx = canvas.getContext('2d');

  ship = { x: canvas.width / 2, y: canvas.height / 2, angle: 0, velX: 0, velY: 0, size: 10 };
  asteroids = [];
  bullets = [];
  asteroidsScore = 0;
  asteroidsLives = 3;

  for (let i = 0; i < 5; i++) createAsteroid();

  updateAsteroidsScore();

  if (gameLoops.asteroids) clearInterval(gameLoops.asteroids);
  gameLoops.asteroids = setInterval(updateAsteroids, 1000 / 60);

  drawAsteroids(ctx);
}

function createAsteroid() {
  const canvas = document.getElementById('asteroidsCanvas');
  asteroids.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    velX: (Math.random() - 0.5) * 3,
    velY: (Math.random() - 0.5) * 3,
    size: 18 + Math.random() * 24
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

  for (let a of asteroids) {
    a.x += a.velX; a.y += a.velY;
    if (a.x < 0) a.x = canvas.width;
    if (a.x > canvas.width) a.x = 0;
    if (a.y < 0) a.y = canvas.height;
    if (a.y > canvas.height) a.y = 0;

    const dx = ship.x - a.x, dy = ship.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < ship.size + a.size) {
      asteroidsLives--; AudioEngine.play('lose'); vibrate(60);
      if (asteroidsLives <= 0) { gameOver('asteroids'); return; }
      ship.x = canvas.width / 2; ship.y = canvas.height / 2; ship.velX = 0; ship.velY = 0;
      updateAsteroidsScore();
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.velX; b.y += b.velY; b.life--;
    if (b.life <= 0) { bullets.splice(i, 1); continue; }
    if (b.x < 0) b.x = canvas.width; if (b.x > canvas.width) b.x = 0;
    if (b.y < 0) b.y = canvas.height; if (b.y > canvas.height) b.y = 0;

    for (let j = asteroids.length - 1; j >= 0; j--) {
      const a = asteroids[j];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      if (dist < a.size) {
        bullets.splice(i, 1); asteroids.splice(j, 1);
        asteroidsScore += 10; AudioEngine.play('explode'); vibrate(35);
        updateAsteroidsScore();
        if (asteroids.length < 3) createAsteroid();
        break;
      }
    }
  }

  drawAsteroids(ctx);
}

function drawAsteroids(ctx) {
  const canvas = ctx.canvas;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -ship.size);
  ctx.lineTo(-ship.size * 0.8, ship.size);
  ctx.lineTo(ship.size * 0.8, ship.size);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#888';
  for (let a of asteroids) {
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ff0';
  for (let b of bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateAsteroidsScore() {
  document.getElementById('asteroidsScore').textContent = `Space Points: ${asteroidsScore} | Ship Lives: ${asteroidsLives}`;
}

function resetAsteroids() { AudioEngine.play('click'); initAsteroids(); }

function gameOver(game, won = false) {
  if (gameLoops[game]) clearInterval(gameLoops[game]);
  AudioEngine.play(won ? 'win' : 'lose');
  setTimeout(() => {
    alert(won ? 'WYGRAŁEŚ! MISJA ZAKOŃCZONA SUKCESEM!' : 'GAME OVER - SYSTEM FAILURE');
  }, 10);
}

// KEYBOARD CONTROLS
document.addEventListener('keydown', (e) => {
  if (!currentGame) return;
  const key = e.key.toLowerCase();

  switch (currentGame) {
    case 'snake':
      if (!snake) return;
      let nd = null;
      if (key === 'arrowup' || key === 'w') nd = { x: 0, y: -SNAKE_STEP };
      if (key === 'arrowdown' || key === 's') nd = { x: 0, y: SNAKE_STEP };
      if (key === 'arrowleft' || key === 'a') nd = { x: -SNAKE_STEP, y: 0 };
      if (key === 'arrowright' || key === 'd') nd = { x: SNAKE_STEP, y: 0 };
      if (nd) {
        if (snake.length > 1) {
          const nextX = snake[0].x + nd.x, nextY = snake[0].y + nd.y;
          if (nextX === snake[1].x && nextY === snake[1].y) return;
        }
        direction = nd;
      }
      break;

    case 'pong':
      if (key === 'arrowup' || key === 'w') player.dy = -6;
      if (key === 'arrowdown' || key === 's') player.dy = 6;
      break;

    case 'breakout':
      if (key === 'arrowleft' || key === 'a') breakoutPaddle.dx = -7;
      if (key === 'arrowright' || key === 'd') breakoutPaddle.dx = 7;
      break;

    case 'asteroids':
      if (key === 'arrowup') {
        ship.velX += Math.cos(ship.angle - Math.PI / 2) * 0.5;
        ship.velY += Math.sin(ship.angle - Math.PI / 2) * 0.5;
      }
      if (key === 'arrowleft') ship.angle -= 0.1;
      if (key === 'arrowright') ship.angle += 0.1;
      if (e.code === 'Space') {
        e.preventDefault();
        bullets.push({
          x: ship.x, y: ship.y,
          velX: Math.cos(ship.angle - Math.PI / 2) * 8,
          velY: Math.sin(ship.angle - Math.PI / 2) * 8,
          life: 60
        });
        AudioEngine.play('shoot');
      }
      break;
  }
});

document.addEventListener('keyup', (e) => {
  if (!currentGame) return;
  const key = e.key.toLowerCase();
  switch (currentGame) {
    case 'pong':
      if (['arrowup', 'arrowdown', 'w', 's'].includes(key)) player.dy = 0;
      break;
    case 'breakout':
      if (['arrowleft', 'arrowright', 'a', 'd'].includes(key)) breakoutPaddle.dx = 0;
      break;
  }
});

// SOUND TOGGLE
const soundToggle = document.getElementById('soundToggle');
if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    const to = !AudioEngine.isMuted();
    AudioEngine.setMuted(to);
    soundToggle.textContent = to ? '🔇 Dźwięk: OFF' : '🔊 Dźwięk: ON';
    if (!to) AudioEngine.play('click');
  });
}

// EXPOSE GLOBAL FUNCTIONS
window.backToMenu = backToMenu;
window.resetSnake = resetSnake;
window.resetPong = resetPong;
window.resetBreakout = resetBreakout;
window.resetAsteroids = resetAsteroids;

// INIT
window.addEventListener('load', () => { 
  createParticles(); 
});