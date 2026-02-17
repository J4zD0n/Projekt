// ===== GLOBAL SETTINGS =====
const settings = {
  sound: true,
  accentColor: '#0070f3',
  
  load() {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      Object.assign(this, JSON.parse(saved));
      this.apply();
    }
  },
  
  save() {
    localStorage.setItem('gameSettings', JSON.stringify(this));
  },
  
  apply() {
    document.documentElement.style.setProperty('--accent-primary', this.accentColor);
    const soundToggle = document.getElementById('soundToggle');
    const accentColorSelect = document.getElementById('accentColor');
    if (soundToggle) soundToggle.checked = this.sound;
    if (accentColorSelect) accentColorSelect.value = this.accentColor;
  }
};

// ===== SOUND SYSTEM =====
const soundSystem = {
  sounds: {},
  enabled: true,
  volume: 0.3,
  
  init() {
    // Utworzenie dźwięków za pomocą Web Audio API
    this.sounds = {
      click: this.createBeep(300, 0.1),
      collect: this.createBeep(600, 0.15),
      jump: this.createBeep(400, 0.12),
      gameOver: this.createBeep(200, 0.3),
      levelUp: this.createBeep(800, 0.2),
      achievement: this.createMelody([523, 659, 784], 0.15),
      coin: this.createBeep(800, 0.1)
    };
    
    const saved = localStorage.getItem('soundEnabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
    this.updateIcon();
  },
  
  createBeep(frequency, duration) {
    return () => {
      if (!this.enabled) return;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };
  },
  
  createMelody(frequencies, duration) {
    return () => {
      if (!this.enabled) return;
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createBeep(freq, duration)();
        }, index * 100);
      });
    };
  },
  
  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName]();
    }
  },
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    this.updateIcon();
    this.play('click');
  },
  
  updateIcon() {
    const icon = document.getElementById('soundIcon');
    if (icon) {
      icon.textContent = this.enabled ? '🔊' : '🔇';
    }
    const btn = document.getElementById('soundBtn');
    if (btn) {
      btn.classList.toggle('sound-off', !this.enabled);
    }
  }
};

// ===== LEVEL REWARDS SYSTEM =====
const levelRewardsSystem = {
  coins: 0,
  currentAvatar: '👤',
  currentFrame: '⬜',
  unlockedAvatars: {},
  unlockedFrames: {},
  activePowerUps: [],
  shopItems: {},
  
  // Nagrody za levele
  levelRewards: {
    5: { type: 'avatar', value: '👶', coins: 100, name: 'Nowicjusz' },
    10: { type: 'frame', value: '🟦', coins: 200, name: 'Niebieska Ramka' },
    15: { type: 'avatar', value: '🎮', coins: 300, name: 'Gracz' },
    20: { type: 'frame', value: '🟩', coins: 400, name: 'Zielona Ramka' },
    25: { type: 'avatar', value: '⚔️', coins: 500, name: 'Wojownik' },
    30: { type: 'frame', value: '🟨', coins: 600, name: 'Złota Ramka' },
    35: { type: 'avatar', value: '🦸', coins: 700, name: 'Bohater' },
    40: { type: 'frame', value: '🟪', coins: 800, name: 'Fioletowa Ramka' },
    45: { type: 'avatar', value: '👑', coins: 900, name: 'Król' },
    50: { type: 'frame', value: '🌈', coins: 1000, name: 'Tęczowa Ramka' }
  },

  // Przedmioty w sklepie
  shopItems: {
    avatars: {
      '🐉': { price: 500, name: 'Smok' },
      '🚀': { price: 800, name: 'Rakieta' },
      '🧙': { price: 1200, name: 'Czarodziej' },
      '🤖': { price: 1500, name: 'Robot' },
      '💫': { price: 2000, name: 'Gwiazda' }
    },
    frames: {
      '✨': { price: 1000, name: 'Lśniąca Ramka' },
      '🔥': { price: 1500, name: 'Ognista Ramka' },
      '💎': { price: 2500, name: 'Diamentowa Ramka' },
      '🎯': { price: 1800, name: 'Celownicza Ramka' }
    },
    powerups: {
      '2x_xp_1h': { price: 300, name: '2x XP (1h)', duration: 3600000, type: 'xp_boost' },
      'extra_life': { price: 500, name: 'Dodatkowe Życie', type: 'extra_life' },
      'time_slow': { price: 700, name: 'Spowolnienie Czasu', duration: 900000, type: 'time_slow' }
    }
  },

  init() {
    const saved = localStorage.getItem('levelRewards');
    if (saved) {
      const data = JSON.parse(saved);
      this.coins = data.coins || 0;
      this.currentAvatar = data.currentAvatar || '👤';
      this.currentFrame = data.currentFrame || '⬜';
      this.unlockedAvatars = data.unlockedAvatars || { '👤': true };
      this.unlockedFrames = data.unlockedFrames || { '⬜': true };
      this.activePowerUps = data.activePowerUps || [];
    }
    this.updateDisplay();
  },

  addCoins(amount) {
    this.coins += amount;
    this.save();
    this.updateDisplay();
    soundSystem.play('coin');
  },

  unlockLevelReward(level) {
    const reward = this.levelRewards[level];
    if (reward && !this.unlockedAvatars[reward.value] && !this.unlockedFrames[reward.value]) {
      if (reward.type === 'avatar') {
        this.unlockedAvatars[reward.value] = true;
        this.currentAvatar = reward.value;
      } else if (reward.type === 'frame') {
        this.unlockedFrames[reward.value] = true;
        this.currentFrame = reward.value;
      }
      
      this.addCoins(reward.coins);
      this.showRewardNotification(reward);
      this.save();
      return true;
    }
    return false;
  },

  showRewardNotification(reward) {
    const notification = document.getElementById('rewardNotification');
    const rewardIcon = document.getElementById('rewardIcon');
    const rewardText = document.getElementById('rewardText');
    const rewardDesc = document.getElementById('rewardDesc');

    if (notification && rewardIcon && rewardText && rewardDesc) {
      rewardIcon.textContent = reward.value;
      rewardText.textContent = `Odkryto: ${reward.name}`;
      rewardDesc.textContent = `+${reward.coins} monet!`;
      
      notification.classList.remove('hidden');
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.classList.add('hidden');
        }, 500);
      }, 4000);
    }
  },

  buyShopItem(category, itemKey) {
    const item = this.shopItems[category][itemKey];
    if (item && this.coins >= item.price) {
      this.coins -= item.price;
      
      if (category === 'avatars') {
        this.unlockedAvatars[itemKey] = true;
        this.currentAvatar = itemKey;
      } else if (category === 'frames') {
        this.unlockedFrames[itemKey] = true;
        this.currentFrame = itemKey;
      } else if (category === 'powerups') {
        this.activatePowerUp(item);
      }
      
      soundSystem.play('collect');
      this.save();
      this.updateDisplay();
      showNotification(`✅ Kupiono: ${item.name}`);
      return true;
    }
    return false;
  },

  activatePowerUp(powerUp) {
    powerUp.activatedAt = Date.now();
    this.activePowerUps.push(powerUp);
    
    if (powerUp.type === 'xp_boost') {
      showNotification(`🚀 Aktywowano: ${powerUp.name}`);
    } else if (powerUp.type === 'extra_life') {
      showNotification(`❤️ Aktywowano: ${powerUp.name}`);
    }
    
    // Automatyczne usuwanie po czasie
    if (powerUp.duration) {
      setTimeout(() => {
        this.deactivatePowerUp(powerUp);
      }, powerUp.duration);
    }
  },

  deactivatePowerUp(powerUp) {
    this.activePowerUps = this.activePowerUps.filter(p => p !== powerUp);
    showNotification(`⏰ Zakończono: ${powerUp.name}`);
  },

  getActivePowerUp(type) {
    return this.activePowerUps.find(powerUp => powerUp.type === type);
  },

  hasPowerUp(type) {
    return this.activePowerUps.some(powerUp => powerUp.type === type);
  },

  updateDisplay() {
    // Aktualizuj monety w UI
    const coinsEl = document.getElementById('playerCoins');
    if (coinsEl) coinsEl.textContent = this.coins;

    // Aktualizuj awatar i ramkę
    const avatarEl = document.getElementById('playerAvatar');
    const frameEl = document.getElementById('playerFrame');
    if (avatarEl) avatarEl.textContent = this.currentAvatar;
    if (frameEl) frameEl.textContent = this.currentFrame;

    // Aktualizuj sklep jeśli jest otwarty
    this.updateShopDisplay();
  },

  updateShopDisplay() {
    const shopContent = document.getElementById('shopContent');
    if (!shopContent) return;

    let html = `
      <div class="shop-section">
        <h3>💰 Twoje monety: ${this.coins}</h3>
      </div>
      
      <div class="shop-section">
        <h3>👤 Awatary</h3>
        <div class="shop-items">
    `;

    // Awatary
    Object.entries(this.shopItems.avatars).forEach(([emoji, item]) => {
      const owned = this.unlockedAvatars[emoji];
      const equipped = this.currentAvatar === emoji;
      html += `
        <div class="shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}">
          <div class="shop-item-icon">${emoji}</div>
          <div class="shop-item-info">
            <h4>${item.name}</h4>
            <p>${owned ? 'POSIADANE' : `${item.price} monet`}</p>
          </div>
          <button class="shop-btn" onclick="levelRewardsSystem.equipItem('avatars', '${emoji}')" 
            ${!owned ? 'disabled' : ''}>
            ${equipped ? '✅' : '🔲'}
          </button>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <div class="shop-section">
        <h3>🖼️ Ramki</h3>
        <div class="shop-items">
    `;

    // Ramki
    Object.entries(this.shopItems.frames).forEach(([emoji, item]) => {
      const owned = this.unlockedFrames[emoji];
      const equipped = this.currentFrame === emoji;
      html += `
        <div class="shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}">
          <div class="shop-item-icon">${emoji}</div>
          <div class="shop-item-info">
            <h4>${item.name}</h4>
            <p>${owned ? 'POSIADANE' : `${item.price} monet`}</p>
          </div>
          <button class="shop-btn" onclick="levelRewardsSystem.equipItem('frames', '${emoji}')" 
            ${!owned ? 'disabled' : ''}>
            ${equipped ? '✅' : '🔲'}
          </button>
        </div>
      `;
    });

    html += `
        </div>
      </div>

      <div class="shop-section">
        <h3>⚡ Boosty</h3>
        <div class="shop-items">
    `;

    // Boosty
    Object.entries(this.shopItems.powerups).forEach(([key, item]) => {
      const active = this.hasPowerUp(item.type);
      html += `
        <div class="shop-item ${active ? 'active' : ''}">
          <div class="shop-item-icon">⚡</div>
          <div class="shop-item-info">
            <h4>${item.name}</h4>
            <p>${item.price} monet</p>
          </div>
          <button class="shop-btn" onclick="levelRewardsSystem.buyShopItem('powerups', '${key}')" 
            ${this.coins < item.price || active ? 'disabled' : ''}>
            ${active ? '🎯' : 'KUP'}
          </button>
        </div>
      `;
    });

    html += `</div></div>`;
    shopContent.innerHTML = html;
  },

  equipItem(category, itemKey) {
    if (category === 'avatars' && this.unlockedAvatars[itemKey]) {
      this.currentAvatar = itemKey;
      showNotification(`✅ Założono awatar: ${itemKey}`);
    } else if (category === 'frames' && this.unlockedFrames[itemKey]) {
      this.currentFrame = itemKey;
      showNotification(`✅ Założono ramkę: ${itemKey}`);
    }
    this.save();
    this.updateDisplay();
  },

  save() {
    localStorage.setItem('levelRewards', JSON.stringify({
      coins: this.coins,
      currentAvatar: this.currentAvatar,
      currentFrame: this.currentFrame,
      unlockedAvatars: this.unlockedAvatars,
      unlockedFrames: this.unlockedFrames,
      activePowerUps: this.activePowerUps
    }));
  },

  reset() {
    this.coins = 0;
    this.currentAvatar = '👤';
    this.currentFrame = '⬜';
    this.unlockedAvatars = { '👤': true };
    this.unlockedFrames = { '⬜': true };
    this.activePowerUps = [];
    this.save();
    this.updateDisplay();
  }
};

// ===== XP AND LEVEL SYSTEM =====
const levelSystem = {
  xp: 0,
  level: 1,
  xpForNextLevel: 100,
  totalXP: 0,
  
  init() {
    const saved = localStorage.getItem('playerLevel');
    if (saved) {
      const data = JSON.parse(saved);
      this.xp = data.xp || 0;
      this.level = data.level || 1;
      this.totalXP = data.totalXP || 0;
      this.xpForNextLevel = this.calculateXPNeeded(this.level);
    }
    this.updateDisplay();
  },
  
  calculateXPNeeded(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  },
  
  addXP(amount) {
    // Sprawdź boost XP
    const xpBoost = levelRewardsSystem.getActivePowerUp('xp_boost');
    if (xpBoost) {
      amount *= 2;
    }

    const originalLevel = this.level;
    this.xp += amount;
    this.totalXP += amount;
    
    while (this.xp >= this.xpForNextLevel) {
      this.levelUp();
    }
    
    // Sprawdź nagrody za levele
    if (this.level > originalLevel) {
      for (let lvl = originalLevel + 1; lvl <= this.level; lvl++) {
        if (levelRewardsSystem.levelRewards[lvl]) {
          levelRewardsSystem.unlockLevelReward(lvl);
        }
      }
    }
    
    this.save();
    this.updateDisplay();
  },
  
  levelUp() {
    this.xp -= this.xpForNextLevel;
    this.level++;
    this.xpForNextLevel = this.calculateXPNeeded(this.level);
    
    // Dodaj monety za level up
    const coinsEarned = this.level * 10;
    levelRewardsSystem.addCoins(coinsEarned);
    
    soundSystem.play('levelUp');
    this.showLevelUpNotification();
  },
  
  showLevelUpNotification() {
    const notification = document.getElementById('levelUpNotification');
    const levelSpan = document.getElementById('newLevel');
    
    if (notification && levelSpan) {
      levelSpan.textContent = this.level;
      notification.classList.remove('hidden');
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.classList.add('hidden');
        }, 500);
      }, 3000);
    }
  },
  
  updateDisplay() {
    const percentage = (this.xp / this.xpForNextLevel) * 100;
    
    // Top bar
    const levelEl = document.getElementById('topBarLevel');
    const xpFill = document.getElementById('topBarXPFill');
    const xpText = document.getElementById('topBarXPText');
    
    if (levelEl) levelEl.textContent = this.level;
    if (xpFill) xpFill.style.width = percentage + '%';
    if (xpText) xpText.textContent = `${this.xp} / ${this.xpForNextLevel}`;
    
    // Pause menu
    const pauseLevel = document.getElementById('pausePlayerLevel');
    const pauseXP = document.getElementById('pausePlayerXP');
    
    if (pauseLevel) pauseLevel.textContent = this.level;
    if (pauseXP) pauseXP.textContent = `${this.xp} / ${this.xpForNextLevel}`;

    // Statystyki profilu
    const profileLevel = document.getElementById('profileLevel');
    const profileXP = document.getElementById('profileXP');
    const profileTotalXP = document.getElementById('profileTotalXP');

    if (profileLevel) profileLevel.textContent = this.level;
    if (profileXP) profileXP.textContent = `${this.xp} / ${this.xpForNextLevel}`;
    if (profileTotalXP) profileTotalXP.textContent = this.totalXP;
  },
  
  save() {
    localStorage.setItem('playerLevel', JSON.stringify({
      xp: this.xp,
      level: this.level,
      totalXP: this.totalXP
    }));
  },
  
  reset() {
    this.xp = 0;
    this.level = 1;
    this.totalXP = 0;
    this.xpForNextLevel = 100;
    this.save();
    this.updateDisplay();
  }
};

// ===== DAILY CHALLENGE SYSTEM =====
const dailyChallengeSystem = {
  currentChallenge: null,
  lastChallengeDate: null,
  streak: 0,
  progress: 0,
  
  challenges: [
    { id: 'snake_score', game: 'snake', title: 'Mistrz Węża', desc: 'Zdobądź 50 punktów w Snake', target: 50, reward: 200 },
    { id: 'pong_win', game: 'pong', title: 'Król Ponga', desc: 'Wygraj 7 punktów w Pong', target: 7, reward: 150 },
    { id: 'wordle_solve', game: 'wordle', title: 'Słowny Geniusz', desc: 'Rozwiąż 3 słowa w Wordle', target: 3, reward: 180 },
    { id: 'simon_level', game: 'simon', title: 'Pamięć Stalowa', desc: 'Osiągnij poziom 8 w Simon', target: 8, reward: 220 },
    { id: 'duck_pipes', game: 'duck', title: 'Latająca Kaczka', desc: 'Przeleć przez 15 rur', target: 15, reward: 190 },
    { id: 'mario_coins', game: 'mario', title: 'Kolekcjoner Monet', desc: 'Zbierz 10 monet w Mario', target: 10, reward: 170 },
    { id: 'racing_distance', game: 'racing', title: 'Szybki Kierowca', desc: 'Przejdź 200m w Racing', target: 200, reward: 200 },
    { id: 'tetris_lines', game: 'tetris', title: 'Mistrz Tetris', desc: 'Wyczyść 20 linii', target: 20, reward: 210 },
    { id: 'breakout_bricks', game: 'breakout', title: 'Rozbijacz Cegieł', desc: 'Zniszcz 50 cegieł', target: 50, reward: 190 }
  ],
  
  init() {
    const saved = localStorage.getItem('dailyChallenge');
    if (saved) {
      const data = JSON.parse(saved);
      this.streak = data.streak || 0;
      this.lastChallengeDate = data.lastChallengeDate;
    }
    this.checkDailyReset();
  },
  
  checkDailyReset() {
    const today = new Date().toDateString();
    
    if (this.lastChallengeDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (this.lastChallengeDate === yesterday.toDateString()) {
        // Kontynuacja streak
      } else if (this.lastChallengeDate) {
        // Przerwany streak
        this.streak = 0;
      }
      
      this.generateNewChallenge();
    }
  },
  
  generateNewChallenge() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const challengeIndex = dayOfYear % this.challenges.length;
    
    this.currentChallenge = { ...this.challenges[challengeIndex] };
    this.progress = 0;
    this.lastChallengeDate = today.toDateString();
    this.save();
  },
  
  updateProgress(game, value) {
    if (!this.currentChallenge || this.currentChallenge.game !== game) return;
    
    this.progress = Math.min(value, this.currentChallenge.target);
    
    if (this.progress >= this.currentChallenge.target) {
      this.completeChallenge();
    }
    
    this.updateDisplay();
  },
  
  completeChallenge() {
    if (!this.currentChallenge.completed) {
      this.currentChallenge.completed = true;
      this.streak++;
      
      levelSystem.addXP(this.currentChallenge.reward);
      levelRewardsSystem.addCoins(this.currentChallenge.reward / 2);
      soundSystem.play('achievement');
      
      showNotification(`🏆 Wyzwanie ukończone! +${this.currentChallenge.reward} XP | Streak: ${this.streak} 🔥`);
      
      this.save();
    }
  },
  
  updateDisplay() {
    if (!this.currentChallenge) return;
    
    const titleEl = document.getElementById('challengeTitle');
    const descEl = document.getElementById('challengeDescription');
    const rewardEl = document.getElementById('challengeReward');
    const progressBar = document.getElementById('challengeProgress');
    const progressText = document.getElementById('challengeProgressText');
    const streakEl = document.getElementById('streakDays');
    
    if (titleEl) titleEl.textContent = this.currentChallenge.title;
    if (descEl) descEl.textContent = this.currentChallenge.desc;
    if (rewardEl) rewardEl.textContent = `+${this.currentChallenge.reward} XP`;
    
    const percentage = (this.progress / this.currentChallenge.target) * 100;
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.textContent = `${this.progress} / ${this.currentChallenge.target}`;
    if (streakEl) streakEl.textContent = this.streak;
  },
  
  save() {
    localStorage.setItem('dailyChallenge', JSON.stringify({
      currentChallenge: this.currentChallenge,
      lastChallengeDate: this.lastChallengeDate,
      streak: this.streak,
      progress: this.progress
    }));
  }
};

// ===== PAUSE SYSTEM =====
const pauseSystem = {
  isPaused: false,
  
  toggle() {
    if (!gameStateManager.currentGame) return;
    
    this.isPaused = !this.isPaused;
    const pauseMenu = document.getElementById('pauseMenu');
    
    if (this.isPaused) {
      soundSystem.play('click');
      pauseMenu.classList.remove('hidden');
      levelSystem.updateDisplay();
      
      // Zatrzymaj aktualną grę
      if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
        gameStateManager.currentGameLoop = null;
      }
    } else {
      pauseMenu.classList.add('hidden');
      this.resumeGame();
    }
  },
  
  resumeGame() {
    const game = gameStateManager.currentGame;
    
    switch(game) {
      case 'snake':
        if (snakeGame && !snakeGame.gameOver) {
          const difficulty = difficultyConfig.snake[gameStateManager.currentDifficulty];
          gameStateManager.currentGameLoop = setInterval(() => {
            if (!snakeGame.gameOver) {
              updateSnake();
              drawSnake();
            }
          }, difficulty.speed);
        }
        break;
      case 'pong':
        if (pongGame) {
          gameStateManager.currentGameLoop = setInterval(() => {
            updatePong();
            drawPong();
          }, 1000 / 60);
        }
        break;
      case 'duck':
        if (duckGame && !duckGame.gameOver) {
          gameStateManager.currentGameLoop = setInterval(() => {
            if (!duckGame.gameOver) {
              updateDuck();
              drawDuck();
            }
          }, 1000 / 60);
        }
        break;
      case 'mario':
        if (marioGame && !marioGame.gameOver && !marioGame.levelComplete) {
          gameStateManager.currentGameLoop = setInterval(() => {
            if (!marioGame.gameOver && !marioGame.levelComplete) {
              updateMario();
              drawMario();
            }
          }, 1000 / 60);
        }
        break;
      case 'racing':
        if (racingGame && !racingGame.gameOver) {
          gameStateManager.currentGameLoop = setInterval(() => {
            if (!racingGame.gameOver) {
              updateRacing();
              drawRacing();
            }
          }, 1000 / 60);
        }
        break;
      case 'tetris':
        if (tetrisGame && !tetrisGame.gameOver) {
          gameStateManager.currentGameLoop = setInterval(() => {
            if (!tetrisGame.gameOver) {
              updateTetris();
              drawTetris();
            }
          }, tetrisGame.speed);
        }
        break;
      case 'breakout':
        if (breakoutGame && !breakoutGame.gameOver) {
          gameStateManager.currentGameLoop = setInterval(() => {
            if (!breakoutGame.gameOver) {
              updateBreakout();
              drawBreakout();
            }
          }, 1000 / 60);
        }
        break;
    }
  }
};

function togglePause() {
  pauseSystem.toggle();
}

function pauseBackToMenu() {
  pauseSystem.isPaused = false;
  const pauseMenu = document.getElementById('pauseMenu');
  if (pauseMenu) pauseMenu.classList.add('hidden');
  backToMenu();
}

function resetCurrentGame() {
  pauseSystem.isPaused = false;
  const pauseMenu = document.getElementById('pauseMenu');
  if (pauseMenu) pauseMenu.classList.add('hidden');
  
  const game = gameStateManager.currentGame;
  switch(game) {
    case 'snake': resetSnake(); break;
    case 'pong': resetPong(); break;
    case 'wordle': resetWordle(); break;
    case 'duck': resetDuck(); break;
    case 'mario': resetMario(); break;
    case 'racing': resetRacing(); break;
    case 'tetris': resetTetris(); break;
    case 'breakout': resetBreakout(); break;
  }
}

function startDailyChallenge() {
  if (dailyChallengeSystem.currentChallenge) {
    closeModal('dailyChallengeModal');
    uiStart(dailyChallengeSystem.currentChallenge.game);
  }
}

// ===== DIFFICULTY CONFIGURATION =====
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
    expert: { ballSpeed: 12, aiSpeed: 5, playerSpeed: 4, name: "Ekspert", description: "Maksymalna trudność" }
  }
};

// ===== WORDLE WORDS =====
const wordleWords = {
  4: [
    'KAWA', 'MAMA', 'TATA', 'PIES', 'KOZA', 'LOVE', 'HATE', 'GAME', 'PLAY', 
    'WORK', 'HOME', 'TREE', 'BOOK', 'FIRE', 'WIND', 'RAIN', 'SNOW', 'STAR', 
    'MOON', 'FISH', 'BIRD', 'TIME', 'YEAR', 'WEEK', 'HOUR', 'DARK', 'GOOD', 
    'EVIL', 'FAST', 'SLOW', 'KREW', 'KROK', 'LATO', 'ZIMA', 'WINO', 'PIWO'
  ],
  5: [
    'KWIAT', 'MOTOR', 'SPORT', 'PRACA', 'GRUPA', 'ABOUT', 'APPLE', 'WORLD', 
    'MUSIC', 'HOUSE', 'WATER', 'PLANT', 'BRAIN', 'CLOUD', 'DREAM', 'EARTH', 
    'FOCUS', 'GLASS', 'HEART', 'HORSE', 'IMAGE', 'LIGHT', 'MAGIC', 'MONEY', 
    'OCEAN', 'PARTY', 'PEACE', 'POWER', 'QUEEN', 'ROBOT', 'SMILE', 'TIGER', 
    'VOICE', 'WATCH', 'YOUNG', 'ZEBRA', 'ANGER', 'BREAD', 'CHAIR', 'DANCE'
  ],
  6: [
    'KOMPUT', 'TELEFO', 'KLAWIS', 'PROGRA', 'FUNKCJ', 'SYSTEM',
    'COFFEE', 'FLOWER', 'GARDEN', 'MARKET', 'OFFICE', 'PENCIL',
    'RANDOM', 'SCHOOL', 'SEARCH', 'SIMPLE', 'SPRING', 'SUMMER',
    'TRAVEL', 'WINTER', 'ACTION', 'BEAUTY', 'CHANGE', 'CHOICE'
  ]
};

// ===== ACHIEVEMENTS SYSTEM =====
const achievementsManager = {
  achievements: {
    snake: [
      { id: 'snake_10', name: 'Pierwszy Kęs', desc: 'Zdobądź 10 punktów', points: 10, unlocked: false },
      { id: 'snake_50', name: 'Wąż Początkujący', desc: 'Zdobądź 50 punktów', points: 50, unlocked: false },
      { id: 'snake_100', name: 'Wąż Ekspert', desc: 'Zdobądź 100 punktów', points: 100, unlocked: false },
      { id: 'snake_200', name: 'Legendarny Wąż', desc: 'Zdobądź 200 punktów', points: 200, unlocked: false }
    ],
    pong: [
      { id: 'pong_5', name: 'Pierwsze Odbicie', desc: 'Wygraj 5 punktów', points: 5, unlocked: false },
      { id: 'pong_10', name: 'Mistrz Paletki', desc: 'Wygraj 10 punktów', points: 10, unlocked: false },
      { id: 'pong_15', name: 'Niepokonany', desc: 'Wygraj 15 punktów', points: 15, unlocked: false }
    ],
    wordle: [
      { id: 'wordle_1', name: 'Pierwsze Słowo', desc: 'Odgadnij pierwsze słowo', count: 1, unlocked: false },
      { id: 'wordle_5', name: 'Słowny Mistrz', desc: 'Odgadnij 5 słów', count: 5, unlocked: false },
      { id: 'wordle_10', name: 'Guru Słów', desc: 'Odgadnij 10 słów', count: 10, unlocked: false },
      { id: 'wordle_25', name: 'Legenda Wordle', desc: 'Odgadnij 25 słów', count: 25, unlocked: false }
    ],
    simon: [
      { id: 'simon_5', name: 'Pamięć Żelazna', desc: 'Osiągnij poziom 5', level: 5, unlocked: false },
      { id: 'simon_10', name: 'Super Pamięć', desc: 'Osiągnij poziom 10', level: 10, unlocked: false },
      { id: 'simon_15', name: 'Mistrz Pamięci', desc: 'Osiągnij poziom 15', level: 15, unlocked: false },
      { id: 'simon_20', name: 'Legendarny Umysł', desc: 'Osiągnij poziom 20', level: 20, unlocked: false }
    ],
    duck: [
      { id: 'duck_5', name: 'Pierwszy Lot', desc: 'Przeleć przez 5 rur', points: 5, unlocked: false },
      { id: 'duck_10', name: 'Doświadczona Kaczka', desc: 'Przeleć przez 10 rur', points: 10, unlocked: false },
      { id: 'duck_20', name: 'Mistrz Lotu', desc: 'Przeleć przez 20 rur', points: 20, unlocked: false }
    ],
    mario: [
      { id: 'mario_1', name: 'Pierwsza Przygoda', desc: 'Ukończ pierwszy poziom', level: 1, unlocked: false },
      { id: 'mario_3', name: 'Zbieracz Monet', desc: 'Ukończ 3 poziomy', level: 3, unlocked: false },
      { id: 'mario_5', name: 'Super Gracz', desc: 'Ukończ 5 poziomów', level: 5, unlocked: false }
    ],
    racing: [
      { id: 'racing_100', name: 'Początkujący Kierowca', desc: 'Przejdź 100m', distance: 100, unlocked: false },
      { id: 'racing_250', name: 'Doświadczony Kierowca', desc: 'Przejdź 250m', distance: 250, unlocked: false },
      { id: 'racing_500', name: 'Król Drogi', desc: 'Przejdź 500m', distance: 500, unlocked: false }
    ],
    tetris: [
      { id: 'tetris_10', name: 'Pierwszy Tetris', desc: 'Zdobądź 1000 punktów', points: 1000, unlocked: false },
      { id: 'tetris_20', name: 'Mistrz Klocków', desc: 'Zdobądź 5000 punktów', points: 5000, unlocked: false },
      { id: 'tetris_30', name: 'Legenda Tetris', desc: 'Zdobądź 10000 punktów', points: 10000, unlocked: false }
    ],
    breakout: [
      { id: 'breakout_100', name: 'Rozbijacz', desc: 'Zdobądź 500 punktów', points: 500, unlocked: false },
      { id: 'breakout_500', name: 'Mistrz Breakout', desc: 'Zdobądź 2000 punktów', points: 2000, unlocked: false },
      { id: 'breakout_1000', name: 'Niezniszczalny', desc: 'Zdobądź 5000 punktów', points: 5000, unlocked: false }
    ]
  },
  
  progress: {
    snakeBest: 0,
    pongBest: 0,
    wordleSolved: 0,
    simonBest: 0,
    duckBest: 0,
    marioBest: 0,
    racingBest: 0,
    tetrisBest: 0,
    breakoutBest: 0
  },
  
  init() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      this.achievements = JSON.parse(saved);
    }
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
      this.progress = JSON.parse(savedProgress);
    }
    this.updateDisplay();
  },
  
  save() {
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
    localStorage.setItem('gameProgress', JSON.stringify(this.progress));
  },
  
  checkAchievements(game, value) {
    let newUnlocks = [];
    
    if (game === 'snake' && value > this.progress.snakeBest) {
      this.progress.snakeBest = value;
      this.achievements.snake.forEach(ach => {
        if (!ach.unlocked && value >= ach.points) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
          levelSystem.addXP(50);
        }
      });
    }
    
    if (game === 'pong' && value > this.progress.pongBest) {
      this.progress.pongBest = value;
      this.achievements.pong.forEach(ach => {
        if (!ach.unlocked && value >= ach.points) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'wordle') {
      this.progress.wordleSolved++;
      this.achievements.wordle.forEach(ach => {
        if (!ach.unlocked && this.progress.wordleSolved >= ach.count) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'simon' && value > this.progress.simonBest) {
      this.progress.simonBest = value;
      this.achievements.simon.forEach(ach => {
        if (!ach.unlocked && value >= ach.level) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'duck' && value > this.progress.duckBest) {
      this.progress.duckBest = value;
      this.achievements.duck.forEach(ach => {
        if (!ach.unlocked && value >= ach.points) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'mario' && value > this.progress.marioBest) {
      this.progress.marioBest = value;
      this.achievements.mario.forEach(ach => {
        if (!ach.unlocked && value >= ach.level) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'racing' && value > this.progress.racingBest) {
      this.progress.racingBest = value;
      this.achievements.racing.forEach(ach => {
        if (!ach.unlocked && value >= ach.distance) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'tetris' && value > this.progress.tetrisBest) {
      this.progress.tetrisBest = value;
      this.achievements.tetris.forEach(ach => {
        if (!ach.unlocked && value >= ach.points) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (game === 'breakout' && value > this.progress.breakoutBest) {
      this.progress.breakoutBest = value;
      this.achievements.breakout.forEach(ach => {
        if (!ach.unlocked && value >= ach.points) {
          ach.unlocked = true;
          newUnlocks.push(ach.name);
        }
      });
    }
    
    if (newUnlocks.length > 0) {
      newUnlocks.forEach(name => {
        showNotification(`🏆 Osiągnięcie: ${name}!`);
      });
    }
    
    this.save();
    this.updateDisplay();
  },
  
  updateDisplay() {
    const updates = {
      'snakeBest': this.progress.snakeBest || 0,
      'pongBest': this.progress.pongBest || 0,
      'wordleSolved': this.progress.wordleSolved || 0,
      'simonBest': this.progress.simonBest || 0,
      'duckBest': this.progress.duckBest || 0,
      'marioBest': this.progress.marioBest || 0,
      'racingBest': this.progress.racingBest || 0,
      'tetrisBest': this.progress.tetrisBest || 0,
      'breakoutBest': this.progress.breakoutBest || 0
    };
    
    Object.entries(updates).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  },
  
  getAchievementsHTML() {
    let html = '<div class="achievements-container">';
    
    Object.entries(this.achievements).forEach(([game, achs]) => {
      const gameIcons = {
        snake: '🐍', pong: '🏓', wordle: '🔤', simon: '🎵',
        duck: '🦆', mario: '🍄', racing: '🏎️',
        tetris: '🧩', breakout: '🔨'
      };
      
      html += `
        <div class="achievement-section">
          <h3>${gameIcons[game]} ${game.toUpperCase()}</h3>
          <div class="achievement-list">
      `;
      
      achs.forEach(ach => {
        html += `
          <div class="achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">${ach.unlocked ? '🏆' : '🔒'}</div>
            <div class="achievement-info">
              <h4>${ach.name}</h4>
              <p>${ach.desc}</p>
            </div>
          </div>
        `;
      });
      
      html += `</div></div>`;
    });
    
    html += '</div>';
    return html;
  },
  
  resetAll() {
    Object.values(this.achievements).forEach(gameAchs => {
      gameAchs.forEach(ach => ach.unlocked = false);
    });
    this.progress = {
      snakeBest: 0, pongBest: 0, wordleSolved: 0, simonBest: 0,
      duckBest: 0, marioBest: 0, racingBest: 0,
      tetrisBest: 0, breakoutBest: 0
    };
    this.save();
    this.updateDisplay();
  }
};

// ===== GAME STATE MANAGER =====
const gameStateManager = {
  currentGame: null,
  currentGameLoop: null,
  currentDifficulty: 'medium',
  
  cleanupCurrentGame() {
    if (this.currentGameLoop) {
      clearInterval(this.currentGameLoop);
      this.currentGameLoop = null;
    }
    this.currentGame = null;
  }
};

// ===== INPUT HANDLER =====
const inputHandler = {
  activeKeys: new Set(),
  keyMap: {
    'ArrowUp': 'up', 'ArrowDown': 'down', 
    'ArrowLeft': 'left', 'ArrowRight': 'right',
    'w': 'up', 'W': 'up', 's': 'down', 'S': 'down',
    'a': 'left', 'A': 'left', 'd': 'right', 'D': 'right',
    'Enter': 'enter', 'Backspace': 'backspace',
    ' ': 'space', 'Space': 'space',
    'Escape': 'escape'
  },
  
  handleKeyDown(event) {
    const key = this.keyMap[event.key] || event.key.toLowerCase();
    if (this.activeKeys.has(key)) return key;
    this.activeKeys.add(key);
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
    }
    return key;
  },
  
  handleKeyUp(event) {
    const key = this.keyMap[event.key] || event.key.toLowerCase();
    this.activeKeys.delete(key);
    return key;
  },
  
  isPressed(action) {
    return this.activeKeys.has(action);
  },
  
  clearAll() {
    this.activeKeys.clear();
  }
};

// ===== UI FUNCTIONS =====
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

function selectDifficulty(game) {
  const modal = document.getElementById('difficultyModal');
  const title = document.getElementById('difficultyTitle');
  const options = document.getElementById('difficultyOptions');
  
  title.textContent = `Wybierz poziom trudności - ${game.toUpperCase()}`;
  options.innerHTML = '';
  
  const difficulties = difficultyConfig[game];
  
  Object.keys(difficulties).forEach(level => {
    const config = difficulties[level];
    const btn = document.createElement('div');
    btn.className = `difficulty-btn ${level}`;
    btn.innerHTML = `
      <h3>${config.name}</h3>
      <p>${config.description}</p>
      ${game === 'snake' ? `<p>Mnożnik: x${config.multiplier}</p>` : ''}
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

function selectWordleMode() {
  const modal = document.getElementById('wordleModal');
  if (modal) modal.classList.remove('hidden');
}

function startWordleMode(length) {
  const modal = document.getElementById('wordleModal');
  if (modal) modal.classList.add('hidden');
  wordleGame.currentWordLength = length;
  uiStart('wordle');
}

function uiStart(game) {
  const gameMenu = document.getElementById('gameMenu');
  if (gameMenu) gameMenu.style.display = 'none';
  
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  const gameScreen = document.getElementById(game + 'Game');
  if (gameScreen) {
    gameScreen.classList.add('active');
  }
  
  gameStateManager.currentGame = game;
  
  // Pokazanie komunikatu "Ready?" zamiast odliczania
  showReadyMessage(() => {
    switch(game) {
      case 'snake': initSnake(); break;
      case 'pong': initPong(); break;
      case 'wordle': wordleGame.init(); break;
      case 'simon': initSimon(); break;
      case 'duck': initDuck(); break;
      case 'mario': initMario(); break;
      case 'racing': initRacing(); break;
      case 'tetris': initTetris(); break;
      case 'breakout': initBreakout(); break;
    }
  });
}

function backToMenu() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  
  const gameMenu = document.getElementById('gameMenu');
  if (gameMenu) gameMenu.style.display = 'grid';
  
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.classList.remove('active');
  });
}

function showReadyMessage(callback) {
  const notification = document.getElementById('notification');
  if (!notification) {
    callback();
    return;
  }
  
  notification.textContent = '🎮 READY?';
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.textContent = 'GO! 🚀';
    setTimeout(() => {
      notification.classList.remove('show');
      callback();
    }, 600);
  }, 800);
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

function resetAllProgress() {
  if (confirm('Czy na pewno chcesz zresetować wszystkie osiągnięcia i postępy?')) {
    achievementsManager.resetAll();
    levelSystem.reset();
    levelRewardsSystem.reset();
    dailyChallengeSystem.streak = 0;
    dailyChallengeSystem.save();
    showNotification('✓ Wszystkie dane zresetowane');
    closeModal('settingsModal');
  }
}

function openShop() {
  levelRewardsSystem.updateShopDisplay();
  const shopModal = document.getElementById('shopModal');
  if (shopModal) shopModal.classList.remove('hidden');
}

function openProfile() {
  levelSystem.updateDisplay();
  levelRewardsSystem.updateDisplay();
  const profileModal = document.getElementById('profileModal');
  if (profileModal) profileModal.classList.remove('hidden');
}

// ===== SNAKE GAME =====
let snakeGame;

function initSnake() {
  const difficulty = difficultyConfig.snake[gameStateManager.currentDifficulty];
  
  const badge = document.getElementById('snakeDifficulty');
  if (badge) badge.textContent = difficulty.name;
  
  snakeGame = {
    snake: [{x: 200, y: 200}],
    dx: 20, dy: 0,
    food: {x: 0, y: 0},
    score: 0,
    gameOver: false,
    speed: difficulty.speed,
    multiplier: difficulty.multiplier,
    direction: 'right'
  };
  
  generateFood();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!snakeGame.gameOver) {
      updateSnake();
      drawSnake();
    }
  }, snakeGame.speed);
}

function generateFood() {
  do {
    snakeGame.food.x = Math.floor(Math.random() * 20) * 20;
    snakeGame.food.y = Math.floor(Math.random() * 20) * 20;
  } while (snakeGame.snake.some(s => s.x === snakeGame.food.x && s.y === snakeGame.food.y));
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
  
  if (snakeGame.snake.some(s => s.x === head.x && s.y === head.y)) {
    snakeGame.gameOver = true;
    achievementsManager.checkAchievements('snake', snakeGame.score);
    levelSystem.addXP(Math.floor(snakeGame.score / 2));
    dailyChallengeSystem.updateProgress('snake', snakeGame.score);
    soundSystem.play('gameOver');
    return;
  }
  
  snakeGame.snake.unshift(head);
  
  if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
    snakeGame.score += Math.floor(10 * snakeGame.multiplier);
    const scoreEl = document.getElementById('snakeScore');
    if (scoreEl) scoreEl.textContent = `Wynik: ${snakeGame.score}`;
    soundSystem.play('collect');
    generateFood();
  } else {
    snakeGame.snake.pop();
  }
}

function drawSnake() {
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 400, 400);
  
  snakeGame.snake.forEach((segment, i) => {
    if (i === 0) {
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const greenValue = Math.max(100, 200 - i * 10);
      ctx.fillStyle = `rgb(0, ${greenValue}, 0)`;
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(snakeGame.food.x + 10, snakeGame.food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();
  
  if (snakeGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 180);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Wynik: ${snakeGame.score}`, 200, 220);
  }
}

function resetSnake() {
  initSnake();
}

// ===== PONG GAME =====
let pongGame;

function initPong() {
  const difficulty = difficultyConfig.pong[gameStateManager.currentDifficulty];
  
  const badge = document.getElementById('pongDifficulty');
  if (badge) badge.textContent = difficulty.name;
  
  pongGame = {
    ball: { x: 300, y: 150, dx: difficulty.ballSpeed, dy: difficulty.ballSpeed, radius: 8 },
    player: { y: 110, score: 0, speed: difficulty.playerSpeed },
    ai: { y: 110, score: 0, speed: difficulty.aiSpeed },
    paddleHeight: 80,
    paddleWidth: 15
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    updatePong();
    drawPong();
  }, 1000 / 60);
}

function updatePong() {
  if (inputHandler.isPressed('up')) {
    pongGame.player.y = Math.max(0, pongGame.player.y - pongGame.player.speed);
  }
  if (inputHandler.isPressed('down')) {
    pongGame.player.y = Math.min(220, pongGame.player.y + pongGame.player.speed);
  }
  
  pongGame.ball.x += pongGame.ball.dx;
  pongGame.ball.y += pongGame.ball.dy;
  
  if (pongGame.ball.y <= 0 || pongGame.ball.y >= 300) {
    pongGame.ball.dy = -pongGame.ball.dy;
  }
  
  if (pongGame.ball.x <= 25 && pongGame.ball.y >= pongGame.player.y && 
      pongGame.ball.y <= pongGame.player.y + 80) {
    pongGame.ball.dx = Math.abs(pongGame.ball.dx);
  }
  
  if (pongGame.ball.x >= 575 && pongGame.ball.y >= pongGame.ai.y && 
      pongGame.ball.y <= pongGame.ai.y + 80) {
    pongGame.ball.dx = -Math.abs(pongGame.ball.dx);
  }
  
  if (pongGame.ball.x < 0) {
    pongGame.ai.score++;
    pongGame.ball.x = 300;
    pongGame.ball.y = 150;
  }
  if (pongGame.ball.x > 600) {
    pongGame.player.score++;
    achievementsManager.checkAchievements('pong', pongGame.player.score);
    levelSystem.addXP(5);
    dailyChallengeSystem.updateProgress('pong', pongGame.player.score);
    soundSystem.play('collect');
    pongGame.ball.x = 300;
    pongGame.ball.y = 150;
  }
  
  if (pongGame.ball.y < pongGame.ai.y + 40) {
    pongGame.ai.y = Math.max(0, pongGame.ai.y - pongGame.ai.speed);
  } else {
    pongGame.ai.y = Math.min(220, pongGame.ai.y + pongGame.ai.speed);
  }
  
  const scoreEl = document.getElementById('pongScore');
  if (scoreEl) {
    scoreEl.textContent = `Ty: ${pongGame.player.score} | AI: ${pongGame.ai.score}`;
  }
}

function drawPong() {
  const canvas = document.getElementById('pongCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 600, 300);
  
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(10, pongGame.player.y, 15, 80);
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(575, pongGame.ai.y, 15, 80);
  
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(pongGame.ball.x, pongGame.ball.y, 8, 0, Math.PI * 2);
  ctx.fill();
}

function resetPong() {
  initPong();
}

// ===== WORDLE GAME =====
const wordleGame = {
  currentWordLength: 5,
  wordList: [],
  currentWord: '',
  currentRow: 0,
  currentTile: 0,
  gameBoard: [],
  gameActive: false,
  attempts: 6,
  
  init() {
    this.attempts = this.currentWordLength === 4 ? 5 : 6;
    this.wordList = wordleWords[this.currentWordLength] || wordleWords[5];
    
    const letterCount = document.getElementById('wordleLetterCount');
    if (letterCount) letterCount.textContent = this.currentWordLength;
    
    const modeBadge = document.getElementById('wordleModeBadge');
    if (modeBadge) {
      modeBadge.textContent = `${this.currentWordLength} liter`;
    }
    
    this.createBoard();
    this.createKeyboard();
    this.selectNewWord();
    this.gameActive = true;
    this.currentTile = 0;
  },
  
  selectNewWord() {
    this.currentWord = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    console.log('🎯 Słowo:', this.currentWord);
  },
  
  createBoard() {
    const board = document.getElementById('wordleBoard');
    if (!board) return;
    
    board.innerHTML = '';
    this.gameBoard = [];
    
    for (let i = 0; i < this.attempts; i++) {
      const row = document.createElement('div');
      row.className = 'wordle-row';
      row.style.gridTemplateColumns = `repeat(${this.currentWordLength}, 1fr)`;
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
    if (!keyboard) return;
    
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
    } else if (key === '⌫') {
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
    if (this.currentTile < this.currentWordLength) {
      const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
      if (tile) {
        tile.textContent = letter;
        tile.classList.add('filled');
      }
      this.gameBoard[this.currentRow][this.currentTile] = letter;
      this.currentTile++;
    }
  },
  
  deleteLetter() {
    if (this.currentTile > 0) {
      this.currentTile--;
      const tile = document.getElementById(`tile-${this.currentRow}-${this.currentTile}`);
      if (tile) {
        tile.textContent = '';
        tile.classList.remove('filled');
      }
      this.gameBoard[this.currentRow][this.currentTile] = '';
    }
  },
  
  isValidWord(word) {
    return this.wordList.includes(word);
  },
  
  submitGuess() {
    if (this.currentTile !== this.currentWordLength) {
      showNotification(`Wpisz ${this.currentWordLength} liter!`);
      return;
    }
    
    const guess = this.gameBoard[this.currentRow].join('');
    
    if (!this.isValidWord(guess)) {
      for (let i = 0; i < this.currentWordLength; i++) {
        const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
        if (tile) {
          tile.style.animation = 'shake 0.5s';
          setTimeout(() => { tile.style.animation = ''; }, 500);
        }
      }
      showNotification('Nie ma takiego słowa!');
      return;
    }
    
    const letterCount = {};
    for (let letter of this.currentWord) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    
    const tileStates = new Array(this.currentWordLength);
    
    for (let i = 0; i < this.currentWordLength; i++) {
      if (guess[i] === this.currentWord[i]) {
        tileStates[i] = 'correct';
        letterCount[guess[i]]--;
      }
    }
    
    for (let i = 0; i < this.currentWordLength; i++) {
      if (tileStates[i]) continue;
      
      if (this.currentWord.includes(guess[i]) && letterCount[guess[i]] > 0) {
        tileStates[i] = 'present';
        letterCount[guess[i]]--;
      } else {
        tileStates[i] = 'absent';
      }
    }
    
    tileStates.forEach((state, i) => {
      setTimeout(() => {
        const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
        if (tile) tile.classList.add(state);
      }, i * 100);
    });
    
    setTimeout(() => {
      if (guess === this.currentWord) {
        this.gameActive = false;
        achievementsManager.checkAchievements('wordle', 1);
        levelSystem.addXP(50);
        dailyChallengeSystem.updateProgress('wordle', 1);
        soundSystem.play('achievement');
        showNotification('🎉 Brawo!');
      } else if (this.currentRow === this.attempts - 1) {
        this.gameActive = false;
        showNotification(`Słowo: ${this.currentWord}`);
      } else {
        this.currentRow++;
        this.currentTile = 0;
      }
    }, this.currentWordLength * 100 + 200);
  },
  
  reset() {
    this.currentRow = 0;
    this.currentTile = 0;
    this.gameActive = true;
    
    document.querySelectorAll('.wordle-tile').forEach(tile => {
      tile.textContent = '';
      tile.className = 'wordle-tile';
    });
    
    this.selectNewWord();
    this.gameBoard = Array(this.attempts).fill().map(() => 
      Array(this.currentWordLength).fill(''));
  }
};

function resetWordle() {
  wordleGame.reset();
}

// ===== SIMON SAYS GAME =====
let simonGame;

const simonLevels = Array.from({length: 20}, (_, i) => ({
  level: i + 1,
  speed: Math.max(150, 800 - i * 35)
}));

function initSimon() {
  simonGame = {
    sequence: [],
    playerSequence: [],
    level: 1,
    playing: false,
    canPlay: false,
    gameOver: false
  };
  
  const startBtn = document.getElementById('simonStart');
  if (startBtn) {
    startBtn.onclick = startSimon;
    startBtn.textContent = 'Start';
  }
  
  document.querySelectorAll('.simon-btn').forEach(btn => {
    btn.onclick = () => {
      if (simonGame.canPlay && !simonGame.gameOver) {
        const color = parseInt(btn.dataset.color);
        playColor(color);
        simonGame.playerSequence.push(color);
        checkSimonSequence();
      }
    };
  });
  
  updateSimonScore();
}

function startSimon() {
  simonGame = {
    sequence: [],
    playerSequence: [],
    level: 1,
    playing: true,
    canPlay: false,
    gameOver: false
  };
  
  const startBtn = document.getElementById('simonStart');
  if (startBtn) startBtn.textContent = 'Gra...';
  
  updateSimonScore();
  nextSimonRound();
}

function nextSimonRound() {
  if (simonGame.gameOver) return;
  
  simonGame.playerSequence = [];
  simonGame.sequence.push(Math.floor(Math.random() * 4));
  simonGame.canPlay = false;
  
  const currentLevel = simonLevels[Math.min(simonGame.level - 1, simonLevels.length - 1)];
  
  updateSimonScore();
  
  setTimeout(() => {
    playSequence(currentLevel.speed);
  }, 500);
}

function playSequence(speed) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < simonGame.sequence.length) {
      playColor(simonGame.sequence[i]);
      i++;
    } else {
      clearInterval(interval);
      simonGame.canPlay = true;
    }
  }, speed);
}

function playColor(color) {
  const btn = document.querySelector(`[data-color="${color}"]`);
  if (!btn) return;
  
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 300);
}

function checkSimonSequence() {
  const currentIndex = simonGame.playerSequence.length - 1;
  
  if (simonGame.playerSequence[currentIndex] !== simonGame.sequence[currentIndex]) {
    simonGame.gameOver = true;
    simonGame.canPlay = false;
    
    achievementsManager.checkAchievements('simon', simonGame.level);
    levelSystem.addXP(simonGame.level * 10);
    dailyChallengeSystem.updateProgress('simon', simonGame.level);
    soundSystem.play('gameOver');
    showNotification(`❌ Koniec! Poziom: ${simonGame.level}`);
    
    const startBtn = document.getElementById('simonStart');
    if (startBtn) startBtn.textContent = 'Restart';
    
    return;
  }
  
  if (simonGame.playerSequence.length === simonGame.sequence.length) {
    showNotification(`✅ Poziom ${simonGame.level}!`);
    simonGame.level++;
    setTimeout(nextSimonRound, 1000);
  }
}

function updateSimonScore() {
  const best = achievementsManager.progress.simonBest || 0;
  const scoreEl = document.getElementById('simonScore');
  
  if (scoreEl) {
    scoreEl.textContent = `Poziom: ${simonGame.level} | Sekwencja: ${simonGame.sequence.length} | Rekord: ${best}`;
  }
}

// ===== DUCK HUNT =====
let duckGame;

function initDuck() {
  duckGame = {
    duck: { y: 200, velocity: 0, radius: 15 },
    pipes: [],
    score: 0,
    gameOver: false,
    gravity: 0.3,
    jump: -6,
    pipeSpeed: 1.5,
    pipeGap: 180,
    frameCount: 0
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!duckGame.gameOver) {
      updateDuck();
      drawDuck();
    }
  }, 1000 / 60);
}

function updateDuck() {
  duckGame.frameCount++;
  
  duckGame.duck.velocity += duckGame.gravity;
  duckGame.duck.y += duckGame.duck.velocity;
  
  if (duckGame.duck.velocity > 8) {
    duckGame.duck.velocity = 8;
  }
  
  if (duckGame.duck.y + duckGame.duck.radius > 400 || duckGame.duck.y - duckGame.duck.radius < 0) {
    duckGame.gameOver = true;
    achievementsManager.checkAchievements('duck', duckGame.score);
    levelSystem.addXP(duckGame.score * 5);
    dailyChallengeSystem.updateProgress('duck', duckGame.score);
    soundSystem.play('gameOver');
  }
  
  if (duckGame.frameCount % 120 === 0) {
    const pipeY = Math.random() * (400 - duckGame.pipeGap - 100) + 50;
    duckGame.pipes.push({
      x: 400,
      y: pipeY,
      scored: false
    });
  }
  
  duckGame.pipes.forEach((pipe, index) => {
    pipe.x -= duckGame.pipeSpeed;
    
    if (pipe.x + 50 < 0) {
      duckGame.pipes.splice(index, 1);
    }
    
    if (!pipe.scored && pipe.x + 50 < 100) {
      duckGame.score++;
      pipe.scored = true;
    }
    
    if (
      100 > pipe.x && 100 < pipe.x + 50 &&
      (duckGame.duck.y - duckGame.duck.radius < pipe.y ||
       duckGame.duck.y + duckGame.duck.radius > pipe.y + duckGame.pipeGap)
    ) {
      duckGame.gameOver = true;
      achievementsManager.checkAchievements('duck', duckGame.score);
      levelSystem.addXP(duckGame.score * 5);
      dailyChallengeSystem.updateProgress('duck', duckGame.score);
      soundSystem.play('gameOver');
    }
  });
  
  const scoreEl = document.getElementById('duckScore');
  if (scoreEl) scoreEl.textContent = `Wynik: ${duckGame.score}`;
}

function drawDuck() {
  const canvas = document.getElementById('duckCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Rury
  duckGame.pipes.forEach(pipe => {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(pipe.x, 0, 50, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + duckGame.pipeGap, 50, 400 - pipe.y - duckGame.pipeGap);
    
    ctx.fillStyle = '#008800';
    ctx.fillRect(pipe.x - 5, pipe.y - 20, 60, 20);
    ctx.fillRect(pipe.x - 5, pipe.y + duckGame.pipeGap, 60, 20);
  });
  
  // KACZKA
  const dx = 100;
  const dy = duckGame.duck.y;
  
  // Ciało kaczki (żółte)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(dx, dy, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Głowa kaczki
  ctx.beginPath();
  ctx.arc(dx + 12, dy - 5, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Dziób (pomarańczowy)
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.moveTo(dx + 20, dy - 5);
  ctx.lineTo(dx + 28, dy - 3);
  ctx.lineTo(dx + 20, dy - 1);
  ctx.fill();
  
  // Oko
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(dx + 15, dy - 7, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Skrzydło
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.ellipse(dx - 3, dy + 3, 8, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  if (duckGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 180);
    ctx.font = '25px Arial';
    ctx.fillText(`Wynik: ${duckGame.score}`, 200, 220);
  }
}

function resetDuck() {
  initDuck();
}

// ===== MARIO PLATFORMER =====
let marioGame;

const marioLevels = [
  {
    platforms: [
      {x: 0, y: 350, width: 200, height: 50},
      {x: 250, y: 300, width: 100, height: 20},
      {x: 400, y: 250, width: 100, height: 20},
      {x: 550, y: 200, width: 150, height: 20},
      {x: 750, y: 300, width: 100, height: 20},
      {x: 900, y: 350, width: 300, height: 50}
    ],
    coins: [
      {x: 280, y: 250}, {x: 430, y: 200}, {x: 600, y: 150},
      {x: 780, y: 250}, {x: 1000, y: 300}
    ],
    flag: {x: 1100, y: 250}
  },
  {
    platforms: [
      {x: 0, y: 350, width: 150, height: 50},
      {x: 200, y: 320, width: 80, height: 20},
      {x: 330, y: 270, width: 80, height: 20},
      {x: 460, y: 220, width: 80, height: 20},
      {x: 590, y: 270, width: 80, height: 20},
      {x: 720, y: 320, width: 80, height: 20},
      {x: 850, y: 350, width: 200, height: 50}
    ],
    coins: [
      {x: 230, y: 270}, {x: 360, y: 220}, {x: 490, y: 170},
      {x: 620, y: 220}, {x: 750, y: 270}, {x: 950, y: 300}
    ],
    flag: {x: 1000, y: 250}
  },
  {
    platforms: [
      {x: 0, y: 350, width: 100, height: 50},
      {x: 150, y: 300, width: 60, height: 20},
      {x: 260, y: 250, width: 60, height: 20},
      {x: 370, y: 200, width: 60, height: 20},
      {x: 480, y: 150, width: 60, height: 20},
      {x: 590, y: 200, width: 60, height: 20},
      {x: 700, y: 250, width: 60, height: 20},
      {x: 810, y: 300, width: 60, height: 20},
      {x: 920, y: 350, width: 200, height: 50}
    ],
    coins: [
      {x: 180, y: 250}, {x: 290, y: 200}, {x: 400, y: 150},
      {x: 510, y: 100}, {x: 620, y: 150}, {x: 730, y: 200},
      {x: 840, y: 250}, {x: 1000, y: 300}
    ],
    flag: {x: 1050, y: 250}
  }
];

function initMario() {
  marioGame = {
    mario: {
      x: 50, y: 300, width: 24, height: 32,
      velocityX: 0, velocityY: 0,
      onGround: false, speed: 4, jumpPower: -11,
      facingRight: true
    },
    camera: 0,
    currentLevel: 0,
    score: 0,
    coinsCollected: [],
    gameOver: false,
    levelComplete: false
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!marioGame.gameOver && !marioGame.levelComplete) {
      updateMario();
      drawMario();
    }
  }, 1000 / 60);
}

function updateMario() {
  const gravity = 0.5;
  const level = marioLevels[marioGame.currentLevel];
  
  if (inputHandler.isPressed('left')) {
    marioGame.mario.velocityX = -marioGame.mario.speed;
    marioGame.mario.facingRight = false;
  } else if (inputHandler.isPressed('right')) {
    marioGame.mario.velocityX = marioGame.mario.speed;
    marioGame.mario.facingRight = true;
  } else {
    marioGame.mario.velocityX *= 0.8;
  }
  
  if (inputHandler.isPressed('space') && marioGame.mario.onGround) {
    marioGame.mario.velocityY = marioGame.mario.jumpPower;
    marioGame.mario.onGround = false;
    soundSystem.play('jump');
  }
  
  marioGame.mario.velocityY += gravity;
  
  marioGame.mario.x += marioGame.mario.velocityX;
  marioGame.mario.y += marioGame.mario.velocityY;
  
  marioGame.mario.onGround = false;
  
  level.platforms.forEach(platform => {
    if (
      marioGame.mario.x + marioGame.mario.width > platform.x &&
      marioGame.mario.x < platform.x + platform.width &&
      marioGame.mario.y + marioGame.mario.height > platform.y &&
      marioGame.mario.y < platform.y + platform.height
    ) {
      if (marioGame.mario.velocityY > 0) {
        marioGame.mario.y = platform.y - marioGame.mario.height;
        marioGame.mario.velocityY = 0;
        marioGame.mario.onGround = true;
      }
    }
  });
  
  level.coins.forEach((coin, index) => {
    if (
      !marioGame.coinsCollected.includes(index) &&
      Math.abs(marioGame.mario.x - coin.x) < 20 &&
      Math.abs(marioGame.mario.y - coin.y) < 20
    ) {
      marioGame.coinsCollected.push(index);
      marioGame.score += 10;
      soundSystem.play('collect');
    }
  });
  
  if (
    Math.abs(marioGame.mario.x - level.flag.x) < 30 &&
    Math.abs(marioGame.mario.y - level.flag.y) < 50
  ) {
    marioGame.levelComplete = true;
    marioGame.currentLevel++;
    achievementsManager.checkAchievements('mario', marioGame.currentLevel);
    levelSystem.addXP(100);
    dailyChallengeSystem.updateProgress('mario', marioGame.coinsCollected.length);
    soundSystem.play('levelUp');
    
    if (marioGame.currentLevel >= marioLevels.length) {
      marioGame.gameOver = true;
      showNotification('🎉 Wszystkie poziomy!');
    } else {
      showNotification(`✅ Poziom ${marioGame.currentLevel}!`);
      setTimeout(() => {
        marioGame.mario.x = 50;
        marioGame.mario.y = 300;
        marioGame.camera = 0;
        marioGame.coinsCollected = [];
        marioGame.levelComplete = false;
      }, 2000);
    }
  }
  
  if (marioGame.mario.y > 400) {
    marioGame.mario.x = 50;
    marioGame.mario.y = 300;
    marioGame.mario.velocityX = 0;
    marioGame.mario.velocityY = 0;
  }
  
  marioGame.camera = Math.max(0, marioGame.mario.x - 200);
  
  const scoreEl = document.getElementById('marioScore');
  if (scoreEl) {
    scoreEl.textContent = `Poziom: ${marioGame.currentLevel + 1} | Monety: ${marioGame.coinsCollected.length} | Wynik: ${marioGame.score}`;
  }
}

function drawMario() {
  const canvas = document.getElementById('marioCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);
  
  const level = marioLevels[marioGame.currentLevel];
  
  ctx.fillStyle = '#8B4513';
  level.platforms.forEach(platform => {
    ctx.fillRect(
      platform.x - marioGame.camera,
      platform.y,
      platform.width,
      platform.height
    );
  });
  
  ctx.fillStyle = '#FFD700';
  level.coins.forEach((coin, index) => {
    if (!marioGame.coinsCollected.includes(index)) {
      ctx.beginPath();
      ctx.arc(coin.x - marioGame.camera, coin.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(level.flag.x - marioGame.camera, level.flag.y, 5, 100);
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(level.flag.x - marioGame.camera, level.flag.y);
  ctx.lineTo(level.flag.x - marioGame.camera + 30, level.flag.y + 10);
  ctx.lineTo(level.flag.x - marioGame.camera, level.flag.y + 20);
  ctx.fill();
  
  const mx = marioGame.mario.x - marioGame.camera;
  const my = marioGame.mario.y;
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(mx + 4, my, 16, 8);
  
  ctx.fillStyle = '#ffcc99';
  ctx.fillRect(mx + 4, my + 8, 16, 12);
  
  ctx.fillStyle = '#000';
  ctx.fillRect(mx + 8, my + 10, 3, 3);
  ctx.fillRect(mx + 13, my + 10, 3, 3);
  
  ctx.fillStyle = '#000';
  ctx.fillRect(mx + 6, my + 16, 12, 2);
  
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(mx + 4, my + 20, 16, 8);
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(mx + 6, my + 28, 6, 4);
  ctx.fillRect(mx + 12, my + 28, 6, 4);
  
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(mx + 4, my + 28, 4, 4);
  ctx.fillRect(mx + 16, my + 28, 4, 4);
  
  if (marioGame.levelComplete || marioGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      marioGame.gameOver ? 'UKOŃCZONO!' : `POZIOM ${marioGame.currentLevel}!`,
      300, 180
    );
    ctx.font = '20px Arial';
    ctx.fillText(`Wynik: ${marioGame.score}`, 300, 220);
  }
}

function resetMario() {
  marioGame.mario.x = 50;
  marioGame.mario.y = 300;
  marioGame.camera = 0;
  marioGame.currentLevel = 0;
  marioGame.score = 0;
  marioGame.coinsCollected = [];
  marioGame.gameOver = false;
  marioGame.levelComplete = false;
}

// ===== RACING GAME =====
let racingGame;

function initRacing() {
  racingGame = {
    car: { x: 175, y: 300, width: 50, height: 80, speed: 6 },
    obstacles: [],
    roadY: 0,
    distance: 0,
    gameOver: false,
    speed: 4,
    frameCount: 0
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!racingGame.gameOver) {
      updateRacing();
      drawRacing();
    }
  }, 1000 / 60);
}

function updateRacing() {
  racingGame.frameCount++;
  
  if (inputHandler.isPressed('left')) {
    racingGame.car.x = Math.max(75, racingGame.car.x - racingGame.car.speed);
  }
  if (inputHandler.isPressed('right')) {
    racingGame.car.x = Math.min(275, racingGame.car.x + racingGame.car.speed);
  }
  
  racingGame.roadY += racingGame.speed;
  if (racingGame.roadY > 40) racingGame.roadY = 0;
  
  racingGame.distance += racingGame.speed * 0.1;
  
  if (racingGame.frameCount % 60 === 0) {
    const lane = Math.floor(Math.random() * 3);
    racingGame.obstacles.push({
      x: 75 + lane * 100,
      y: -100,
      width: 50,
      height: 80
    });
  }
  
  racingGame.obstacles.forEach((obs, index) => {
    obs.y += racingGame.speed * 1.5;
    
    if (obs.y > 500) {
      racingGame.obstacles.splice(index, 1);
    }
    
    if (
      racingGame.car.x < obs.x + obs.width &&
      racingGame.car.x + racingGame.car.width > obs.x &&
      racingGame.car.y < obs.y + obs.height &&
      racingGame.car.y + racingGame.car.height > obs.y
    ) {
      racingGame.gameOver = true;
      achievementsManager.checkAchievements('racing', Math.floor(racingGame.distance));
      levelSystem.addXP(Math.floor(racingGame.distance));
      dailyChallengeSystem.updateProgress('racing', Math.floor(racingGame.distance));
      soundSystem.play('gameOver');
    }
  });
  
  if (racingGame.frameCount % 300 === 0) {
    racingGame.speed += 0.3;
  }
  
  const scoreEl = document.getElementById('racingScore');
  if (scoreEl) {
    scoreEl.textContent = `Dystans: ${Math.floor(racingGame.distance)}m | Prędkość: ${Math.floor(racingGame.speed * 10)} km/h`;
  }
}

function drawRacing() {
  const canvas = document.getElementById('racingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, 400, 500);
  
  ctx.fillStyle = '#333';
  ctx.fillRect(50, 0, 300, 500);
  
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 20]);
  ctx.beginPath();
  ctx.moveTo(150, 0);
  ctx.lineTo(150, 500);
  ctx.moveTo(250, 0);
  ctx.lineTo(250, 500);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.lineTo(50, 500);
  ctx.moveTo(350, 0);
  ctx.lineTo(350, 500);
  ctx.stroke();
  
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(racingGame.car.x, racingGame.car.y, racingGame.car.width, racingGame.car.height);
  ctx.fillStyle = '#ADD8E6';
  ctx.fillRect(racingGame.car.x + 5, racingGame.car.y + 10, 40, 30);
  ctx.fillStyle = '#000';
  ctx.fillRect(racingGame.car.x + 5, racingGame.car.y + 60, 15, 15);
  ctx.fillRect(racingGame.car.x + 30, racingGame.car.y + 60, 15, 15);
  
  racingGame.obstacles.forEach(obs => {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    ctx.fillStyle = '#ffcccc';
    ctx.fillRect(obs.x + 5, obs.y + 10, 40, 30);
    ctx.fillStyle = '#000';
    ctx.fillRect(obs.x + 5, obs.y + 60, 15, 15);
    ctx.fillRect(obs.x + 30, obs.y + 60, 15, 15);
  });
  
  if (racingGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 400, 500);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 220);
    ctx.font = '25px Arial';
    ctx.fillText(`Dystans: ${Math.floor(racingGame.distance)}m`, 200, 270);
  }
}

function resetRacing() {
  initRacing();
}

// ===== TETRIS GAME =====
let tetrisGame;

const TETRIS_PIECES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]]
};

const TETRIS_COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

function initTetris() {
  tetrisGame = {
    board: Array(20).fill().map(() => Array(10).fill(0)),
    currentPiece: null,
    currentX: 0,
    currentY: 0,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    speed: 500
  };
  
  tetrisGame.nextPiece = getRandomPiece();
  spawnNewPiece();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!tetrisGame.gameOver) {
      moveDown();
      drawTetris();
    }
  }, tetrisGame.speed);
}

function getRandomPiece() {
  const pieces = Object.keys(TETRIS_PIECES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    shape: TETRIS_PIECES[randomPiece],
    color: TETRIS_COLORS[randomPiece],
    type: randomPiece
  };
}

function spawnNewPiece() {
  tetrisGame.currentPiece = tetrisGame.nextPiece;
  tetrisGame.nextPiece = getRandomPiece();
  tetrisGame.currentX = 3;
  tetrisGame.currentY = 0;
  
  if (checkCollision()) {
    tetrisGame.gameOver = true;
    const finalScore = tetrisGame.score;
    achievementsManager.checkAchievements('tetris', finalScore);
    levelSystem.addXP(tetrisGame.lines * 10);
    soundSystem.play('gameOver');
  }
  
  drawNextPiece();
}

function checkCollision(offsetX = 0, offsetY = 0, piece = tetrisGame.currentPiece.shape) {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const newX = tetrisGame.currentX + x + offsetX;
        const newY = tetrisGame.currentY + y + offsetY;
        
        if (newX < 0 || newX >= 10 || newY >= 20) return true;
        if (newY >= 0 && tetrisGame.board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function moveDown() {
  if (!checkCollision(0, 1)) {
    tetrisGame.currentY++;
  } else {
    mergePiece();
    clearLines();
    spawnNewPiece();
  }
}

function moveLeft() {
  if (!checkCollision(-1, 0)) {
    tetrisGame.currentX--;
    soundSystem.play('click');
  }
}

function moveRight() {
  if (!checkCollision(1, 0)) {
    tetrisGame.currentX++;
    soundSystem.play('click');
  }
}

function rotatePiece() {
  const rotated = tetrisGame.currentPiece.shape[0].map((_, i) =>
    tetrisGame.currentPiece.shape.map(row => row[i]).reverse()
  );
  
  if (!checkCollision(0, 0, rotated)) {
    tetrisGame.currentPiece.shape = rotated;
    soundSystem.play('click');
  }
}

function hardDrop() {
  while (!checkCollision(0, 1)) {
    tetrisGame.currentY++;
  }
  mergePiece();
  clearLines();
  spawnNewPiece();
  soundSystem.play('collect');
}

function mergePiece() {
  tetrisGame.currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        const boardY = tetrisGame.currentY + y;
        const boardX = tetrisGame.currentX + x;
        if (boardY >= 0) {
          tetrisGame.board[boardY][boardX] = tetrisGame.currentPiece.color;
        }
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;
  
  for (let y = tetrisGame.board.length - 1; y >= 0; y--) {
    if (tetrisGame.board[y].every(cell => cell !== 0)) {
      tetrisGame.board.splice(y, 1);
      tetrisGame.board.unshift(Array(10).fill(0));
      linesCleared++;
      y++;
    }
  }
  
  if (linesCleared > 0) {
    tetrisGame.lines += linesCleared;
    const points = [0, 100, 300, 500, 800][linesCleared];
    tetrisGame.score += points * tetrisGame.level;
    
    tetrisGame.level = Math.floor(tetrisGame.lines / 10) + 1;
    tetrisGame.speed = Math.max(100, 500 - (tetrisGame.level - 1) * 50);
    
    dailyChallengeSystem.updateProgress('tetris', tetrisGame.lines);
    levelSystem.addXP(linesCleared * 15);
    soundSystem.play('collect');
    
    updateTetrisScore();
  }
}

function updateTetrisScore() {
  const scoreEl = document.getElementById('tetrisScore');
  if (scoreEl) {
    scoreEl.textContent = `Wynik: ${tetrisGame.score} | Linie: ${tetrisGame.lines} | Poziom: ${tetrisGame.level}`;
  }
}

function drawTetris() {
  const canvas = document.getElementById('tetrisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 300, 600);
  
  // Rysuj planszę
  tetrisGame.board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = cell;
        ctx.fillRect(x * 30, y * 30, 29, 29);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * 30, y * 30, 29, 29);
      }
    });
  });
  
  // Rysuj aktualny klocek
  if (tetrisGame.currentPiece) {
    ctx.fillStyle = tetrisGame.currentPiece.color;
    tetrisGame.currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const drawX = (tetrisGame.currentX + x) * 30;
          const drawY = (tetrisGame.currentY + y) * 30;
          ctx.fillRect(drawX, drawY, 29, 29);
          ctx.strokeStyle = '#000';
          ctx.strokeRect(drawX, drawY, 29, 29);
        }
      });
    });
  }
  
  // Siatka
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  for (let i = 0; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 30, 0);
    ctx.lineTo(i * 30, 600);
    ctx.stroke();
  }
  for (let i = 0; i <= 20; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 30);
    ctx.lineTo(300, i * 30);
    ctx.stroke();
  }
  
  if (tetrisGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, 300, 600);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 150, 280);
    ctx.font = '20px Arial';
    ctx.fillText(`Wynik: ${tetrisGame.score}`, 150, 320);
  }
}

function drawNextPiece() {
  const canvas = document.getElementById('nextPieceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 100, 100);
  
  if (tetrisGame.nextPiece) {
    ctx.fillStyle = tetrisGame.nextPiece.color;
    const offsetX = (4 - tetrisGame.nextPiece.shape[0].length) * 10;
    const offsetY = (4 - tetrisGame.nextPiece.shape.length) * 10;
    
    tetrisGame.nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillRect(offsetX + x * 20, offsetY + y * 20, 19, 19);
        }
      });
    });
  }
}

function resetTetris() {
  initTetris();
}

// ===== BREAKOUT GAME =====
let breakoutGame;

function initBreakout() {
  breakoutGame = {
    paddle: { x: 250, y: 450, width: 100, height: 15, speed: 8 },
    ball: { x: 300, y: 400, dx: 4, dy: -4, radius: 8, stuck: true },
    bricks: [],
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    bricksDestroyed: 0
  };
  
  createBricks();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!breakoutGame.gameOver) {
      updateBreakout();
      drawBreakout();
    }
  }, 1000 / 60);
}

function createBricks() {
  breakoutGame.bricks = [];
  const rows = 5 + breakoutGame.level;
  const cols = 10;
  const brickWidth = 55;
  const brickHeight = 20;
  const padding = 5;
  
  const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      breakoutGame.bricks.push({
        x: col * (brickWidth + padding) + 5,
        y: row * (brickHeight + padding) + 30,
        width: brickWidth,
        height: brickHeight,
        color: colors[row % colors.length],
        visible: true,
        points: (rows - row) * 10
      });
    }
  }
}

function updateBreakout() {
  // Ruch paletki
  if (inputHandler.isPressed('left')) {
    breakoutGame.paddle.x = Math.max(0, breakoutGame.paddle.x - breakoutGame.paddle.speed);
  }
  if (inputHandler.isPressed('right')) {
    breakoutGame.paddle.x = Math.min(500, breakoutGame.paddle.x + breakoutGame.paddle.speed);
  }
  
  // Wypuszczenie piłki
  if (breakoutGame.ball.stuck && inputHandler.isPressed('space')) {
    breakoutGame.ball.stuck = false;
    soundSystem.play('jump');
  }
  
  if (breakoutGame.ball.stuck) {
    breakoutGame.ball.x = breakoutGame.paddle.x + breakoutGame.paddle.width / 2;
    breakoutGame.ball.y = breakoutGame.paddle.y - breakoutGame.ball.radius;
  } else {
    // Ruch piłki
    breakoutGame.ball.x += breakoutGame.ball.dx;
    breakoutGame.ball.y += breakoutGame.ball.dy;
    
    // Odbicie od ścian
    if (breakoutGame.ball.x - breakoutGame.ball.radius < 0 || 
        breakoutGame.ball.x + breakoutGame.ball.radius > 600) {
      breakoutGame.ball.dx = -breakoutGame.ball.dx;
      soundSystem.play('click');
    }
    
    if (breakoutGame.ball.y - breakoutGame.ball.radius < 0) {
      breakoutGame.ball.dy = -breakoutGame.ball.dy;
      soundSystem.play('click');
    }
    
    // Odbicie od paletki
    if (breakoutGame.ball.y + breakoutGame.ball.radius > breakoutGame.paddle.y &&
        breakoutGame.ball.x > breakoutGame.paddle.x &&
        breakoutGame.ball.x < breakoutGame.paddle.x + breakoutGame.paddle.width &&
        breakoutGame.ball.dy > 0) {
      
      const hitPos = (breakoutGame.ball.x - breakoutGame.paddle.x) / breakoutGame.paddle.width;
      breakoutGame.ball.dx = (hitPos - 0.5) * 10;
      breakoutGame.ball.dy = -Math.abs(breakoutGame.ball.dy);
      soundSystem.play('jump');
    }
    
    // Sprawdź kolizje z cegłami
    breakoutGame.bricks.forEach(brick => {
      if (brick.visible &&
          breakoutGame.ball.x + breakoutGame.ball.radius > brick.x &&
          breakoutGame.ball.x - breakoutGame.ball.radius < brick.x + brick.width &&
          breakoutGame.ball.y + breakoutGame.ball.radius > brick.y &&
          breakoutGame.ball.y - breakoutGame.ball.radius < brick.y + brick.height) {
        
        brick.visible = false;
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
        breakoutGame.score += brick.points;
        breakoutGame.bricksDestroyed++;
        
        dailyChallengeSystem.updateProgress('breakout', breakoutGame.bricksDestroyed);
        levelSystem.addXP(5);
        soundSystem.play('collect');
        
        updateBreakoutScore();
      }
    });
    
    // Sprawdź czy wszystkie cegły zniszczone
    if (breakoutGame.bricks.every(b => !b.visible)) {
      breakoutGame.level++;
      breakoutGame.ball.stuck = true;
      breakoutGame.ball.dx *= 1.1;
      breakoutGame.ball.dy *= 1.1;
      createBricks();
      soundSystem.play('levelUp');
      showNotification(`Poziom ${breakoutGame.level}!`);
    }
    
    // Utrata życia
    if (breakoutGame.ball.y > 500) {
      breakoutGame.lives--;
      soundSystem.play('gameOver');
      
      if (breakoutGame.lives <= 0) {
        breakoutGame.gameOver = true;
        achievementsManager.checkAchievements('breakout', breakoutGame.score);
        levelSystem.addXP(Math.floor(breakoutGame.score / 10));
      } else {
        breakoutGame.ball.stuck = true;
        breakoutGame.ball.x = 300;
        breakoutGame.ball.y = 400;
      }
    }
  }
  
  updateBreakoutScore();
}

function updateBreakoutScore() {
  const scoreEl = document.getElementById('breakoutScore');
  if (scoreEl) {
    scoreEl.textContent = `Wynik: ${breakoutGame.score} | Życia: ${breakoutGame.lives} | Poziom: ${breakoutGame.level}`;
  }
}

function drawBreakout() {
  const canvas = document.getElementById('breakoutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 500);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 500);
  
  // Cegły
  breakoutGame.bricks.forEach(brick => {
    if (brick.visible) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }
  });
  
  // Paletka
  const paddleGradient = ctx.createLinearGradient(
    breakoutGame.paddle.x, 0, 
    breakoutGame.paddle.x + breakoutGame.paddle.width, 0
  );
  paddleGradient.addColorStop(0, '#0070f3');
  paddleGradient.addColorStop(1, '#00d4ff');
  ctx.fillStyle = paddleGradient;
  ctx.fillRect(
    breakoutGame.paddle.x, 
    breakoutGame.paddle.y, 
    breakoutGame.paddle.width, 
    breakoutGame.paddle.height
  );
  
  // Piłka
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(breakoutGame.ball.x, breakoutGame.ball.y, breakoutGame.ball.radius, 0, Math.PI * 2);
  ctx.fill();
  
  if (breakoutGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, 600, 500);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 300, 230);
    ctx.font = '25px Arial';
    ctx.fillText(`Wynik: ${breakoutGame.score}`, 300, 270);
  }
}

function resetBreakout() {
  initBreakout();
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
    document.body.classList.toggle('light-theme', this.currentTheme === 'light');
  }
};

// ===== EVENT LISTENERS =====
document.addEventListener('keydown', (e) => {
  const key = inputHandler.handleKeyDown(e);
  
  if (gameStateManager.currentGame === 'wordle') {
    wordleGame.handleKeyPress(key);
  } else if (gameStateManager.currentGame === 'snake' && snakeGame && !snakeGame.gameOver) {
    const prevDx = snakeGame.dx;
    const prevDy = snakeGame.dy;
    
    if (key === 'up' && prevDy === 0) {
      snakeGame.dx = 0; snakeGame.dy = -20; snakeGame.direction = 'up';
    } else if (key === 'down' && prevDy === 0) {
      snakeGame.dx = 0; snakeGame.dy = 20; snakeGame.direction = 'down';
    } else if (key === 'left' && prevDx === 0) {
      snakeGame.dx = -20; snakeGame.dy = 0; snakeGame.direction = 'left';
    } else if (key === 'right' && prevDx === 0) {
      snakeGame.dx = 20; snakeGame.dy = 0; snakeGame.direction = 'right';
    }
  } else if (gameStateManager.currentGame === 'duck' && duckGame && !duckGame.gameOver) {
    if (key === 'space') {
      duckGame.duck.velocity = duckGame.jump;
      soundSystem.play('jump');
    }
  } else if (gameStateManager.currentGame === 'tetris' && tetrisGame && !tetrisGame.gameOver) {
    if (key === 'left') moveLeft();
    else if (key === 'right') moveRight();
    else if (key === 'down') moveDown();
    else if (key === 'space') rotatePiece();
    else if (key === 'up') hardDrop();
  }
  
  // Obsługa ESC dla pauzy
  if (key === 'escape') {
    pauseSystem.toggle();
  }
});

document.addEventListener('keyup', (e) => {
  inputHandler.handleKeyUp(e);
});

document.addEventListener('click', (e) => {
  if (gameStateManager.currentGame === 'duck' && duckGame && !duckGame.gameOver) {
    const canvas = document.getElementById('duckCanvas');
    if (canvas && e.target === canvas) {
      duckGame.duck.velocity = duckGame.jump;
      soundSystem.play('jump');
    }
  }
});

// ===== INITIALIZATION =====
// Initialize missing elements
function initializeMissingElements() {
  // Shop navigation
  const shopNavBtn = document.getElementById('shopNavBtn');
  if (shopNavBtn) {
    shopNavBtn.onclick = (e) => {
      e.preventDefault();
      openShop();
    };
  }

  // Profile navigation
  const profileNavBtn = document.getElementById('profileNavBtn');
  if (profileNavBtn) {
    profileNavBtn.onclick = (e) => {
      e.preventDefault();
      openProfile();
    };
  }

  // Update profile stats
  updateProfileStats();
}

// Update profile statistics
function updateProfileStats() {
  const stats = achievementsManager.progress;
  
  const elements = {
    'profileSnakeBest': stats.snakeBest || 0,
    'profilePongBest': stats.pongBest || 0,
    'profileWordleSolved': stats.wordleSolved || 0,
    'profileSimonBest': stats.simonBest || 0,
    'profileDuckBest': stats.duckBest || 0,
    'profileMarioBest': stats.marioBest || 0,
    'profileRacingBest': stats.racingBest || 0,
    'profileTetrisBest': stats.tetrisBest || 0,
    'profileBreakoutBest': stats.breakoutBest || 0
  };
  
  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  achievementsManager.init();
  themeManager.init();
  settings.load();
  
  // Initialize new systems
  soundSystem.init();
  levelSystem.init();
  levelRewardsSystem.init();
  dailyChallengeSystem.init();
  
  // Initialize missing elements
  initializeMissingElements();
  
  const achievementsBtn = document.getElementById('achievementsBtn');
  if (achievementsBtn) {
    achievementsBtn.onclick = () => {
      const achievementsContent = document.getElementById('achievementsContent');
      if (achievementsContent) {
        achievementsContent.innerHTML = achievementsManager.getAchievementsHTML();
      }
      const achievementsModal = document.getElementById('achievementsModal');
      if (achievementsModal) {
        achievementsModal.classList.remove('hidden');
      }
    };
  }
  
  const achievementsNavBtn = document.getElementById('achievementsNavBtn');
  if (achievementsNavBtn) {
    achievementsNavBtn.onclick = (e) => {
      e.preventDefault();
      if (achievementsBtn) achievementsBtn.click();
    };
  }
  
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.onclick = () => {
      const settingsModal = document.getElementById('settingsModal');
      if (settingsModal) {
        settingsModal.classList.remove('hidden');
      }
    };
  }
  
  const settingsNavBtn = document.getElementById('settingsNavBtn');
  if (settingsNavBtn) {
    settingsNavBtn.onclick = (e) => {
      e.preventDefault();
      if (settingsBtn) settingsBtn.click();
    };
  }
  
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.onclick = () => {
      themeManager.toggle();
    };
  }
  
  // Sound button
  const soundBtn = document.getElementById('soundBtn');
  if (soundBtn) {
    soundBtn.onclick = () => {
      soundSystem.toggle();
    };
  }
  
  // Daily challenge button
  const dailyChallengeBtn = document.getElementById('dailyChallengeBtn');
  if (dailyChallengeBtn) {
    dailyChallengeBtn.onclick = () => {
      dailyChallengeSystem.updateDisplay();
      const modal = document.getElementById('dailyChallengeModal');
      if (modal) modal.classList.remove('hidden');
    };
  }
  
  // Shop button
  const shopBtn = document.getElementById('shopBtn');
  if (shopBtn) {
    shopBtn.onclick = () => {
      openShop();
    };
  }
  
  // Profile button
  const profileBtn = document.getElementById('profileBtn');
  if (profileBtn) {
    profileBtn.onclick = () => {
      openProfile();
    };
  }
  
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.onchange = (e) => {
      settings.sound = e.target.checked;
      settings.save();
    };
  }
  
  const accentColor = document.getElementById('accentColor');
  if (accentColor) {
    accentColor.onchange = (e) => {
      settings.accentColor = e.target.value;
      settings.apply();
      settings.save();
    };
  }
  
  showNotification('🎮 Gaming Hub - Ultimate Edition!');
});