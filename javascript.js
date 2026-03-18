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
  audioContext: null,
  
  init() {
    try {
      // Spróbuj stworzyć AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log("🔊 AudioContext stworzony");
    } catch (e) {
      console.log("🔇 Nie można stworzyć AudioContext:", e);
      this.enabled = false;
      this.updateIcon();
      return;
    }
    
    // Utwórz dźwięki tylko jeśli AudioContext działa
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
      if (!this.enabled || !this.audioContext) return;
      
      try {
        // Unlock AudioContext przy pierwszym dźwięku
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
      } catch (e) {
        console.log("🔇 Błąd dźwięku:", e);
      }
    };
  },
  
  createMelody(frequencies, duration) {
    return () => {
      if (!this.enabled || !this.audioContext) return;
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createBeep(freq, duration)();
        }, index * 100);
      });
    };
  },
  
  play(soundName) {
    if (this.sounds[soundName] && this.enabled) {
      try {
        this.sounds[soundName]();
      } catch (e) {
        console.log("🔇 Nie można odtworzyć dźwięku", soundName, e);
      }
    }
  },
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    this.updateIcon();
    
    // Odtwórz dźwięk tylko jeśli włączamy
    if (this.enabled) {
      this.play('click');
    }
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

  shopItems: {
    avatars: {
      '👤': { price: 0, name: 'Domyślny', default: true },
      '🐉': { price: 500, name: 'Smok' },
      '🚀': { price: 800, name: 'Rakieta' },
      '🧙': { price: 1200, name: 'Czarodziej' },
      '🤖': { price: 1500, name: 'Robot' },
      '💫': { price: 2000, name: 'Gwiazda' }
    },
    frames: {
      '⬜': { price: 0, name: 'Domyślna', default: true },
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
      this.unlockedAvatars = data.unlockedAvatars || {};
      this.unlockedFrames = data.unlockedFrames || {};
      this.activePowerUps = data.activePowerUps || [];
    }
    
    // ZAWSZE odblokuj domyślne awatary i ramki
    if (!this.unlockedAvatars['👤']) this.unlockedAvatars['👤'] = true;
    if (!this.unlockedFrames['⬜']) this.unlockedFrames['⬜'] = true;
    
    // Odblokuj domyślne przedmioty z shopItems
    Object.entries(this.shopItems.avatars).forEach(([emoji, item]) => {
      if (item.default && !this.unlockedAvatars[emoji]) {
        this.unlockedAvatars[emoji] = true;
      }
    });
    
    Object.entries(this.shopItems.frames).forEach(([emoji, item]) => {
      if (item.default && !this.unlockedFrames[emoji]) {
        this.unlockedFrames[emoji] = true;
      }
    });
    
    this.save();
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
    if (!item) {
      console.error("❌ Przedmiot nie znaleziony:", category, itemKey);
      return false;
    }
    
    // Sprawdź czy już posiadane
    if (category === 'avatars' && this.unlockedAvatars[itemKey]) {
      showNotification(`✅ Już posiadasz awatar: ${item.name}`);
      return true;
    }
    
    if (category === 'frames' && this.unlockedFrames[itemKey]) {
      showNotification(`✅ Już posiadasz ramkę: ${item.name}`);
      return true;
    }
    
    // Sprawdź czy wystarczająco monet
    if (this.coins < item.price) {
      showNotification(`❌ Potrzebujesz ${item.price} monet, masz ${this.coins}`);
      return false;
    }
    
    // Kup przedmiot
    this.coins -= item.price;
    
    if (category === 'avatars') {
      this.unlockedAvatars[itemKey] = true;
      this.currentAvatar = itemKey;
      showNotification(`✅ Kupiono awatar: ${item.name} za ${item.price} monet`);
    } else if (category === 'frames') {
      this.unlockedFrames[itemKey] = true;
      this.currentFrame = itemKey;
      showNotification(`✅ Kupiono ramkę: ${item.name} za ${item.price} monet`);
    } else if (category === 'powerups') {
      this.activatePowerUp(item);
      showNotification(`✅ Kupiono boost: ${item.name} za ${item.price} monet`);
    }
    
    soundSystem.play('collect');
    this.save();
    this.updateDisplay();
    this.updateShopDisplay();
    return true;
  },

  activatePowerUp(powerUp) {
    powerUp.activatedAt = Date.now();
    this.activePowerUps.push(powerUp);
    
    if (powerUp.type === 'xp_boost') {
      showNotification(`🚀 Aktywowano: ${powerUp.name}`);
    } else if (powerUp.type === 'extra_life') {
      showNotification(`❤️ Aktywowano: ${powerUp.name}`);
    }
    
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
    const coinsEl = document.getElementById('playerCoins');
    if (coinsEl) coinsEl.textContent = this.coins;

    const avatarEl = document.getElementById('playerAvatar');
    const frameEl = document.getElementById('playerFrame');
    if (avatarEl) avatarEl.textContent = this.currentAvatar;
    if (frameEl) frameEl.textContent = this.currentFrame;

    this.updateShopDisplay();
  },

  updateShopDisplay() {
    const shopContent = document.getElementById('shopContent');
    if (!shopContent) return;

    let html = `
      <div class="shop-section">
        <h3>💰 Twoje monety: <span style="color: #FFD700;">${this.coins}</span></h3>
      </div>
      
      <div class="shop-section">
        <h3>👤 Awatary</h3>
        <div class="shop-items">
    `;

    Object.entries(this.shopItems.avatars).forEach(([emoji, item]) => {
      const owned = this.unlockedAvatars[emoji];
      const equipped = this.currentAvatar === emoji;
      const canAfford = this.coins >= item.price;
      
      html += `
        <div class="shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}">
          <div class="shop-item-icon">${emoji}</div>
          <div class="shop-item-info">
            <h4>${item.name}</h4>
            <p>${owned ? 'POSIADANE' : `${item.price} monet`}</p>
          </div>
          <div>
      `;
      
      if (!owned) {
        html += `
          <button class="shop-btn" onclick="levelRewardsSystem.buyShopItem('avatars', '${emoji}')" 
            ${!canAfford ? 'disabled' : ''}>
            KUP
          </button>
        `;
      } else {
        html += `
          <button class="shop-btn" onclick="levelRewardsSystem.equipItem('avatars', '${emoji}')" 
            ${equipped ? 'disabled' : ''}>
            ${equipped ? '✅' : '🔲'}
          </button>
        `;
      }
      
      html += `</div></div>`;
    });

    html += `
        </div>
      </div>

      <div class="shop-section">
        <h3>🖼️ Ramki</h3>
        <div class="shop-items">
    `;

    Object.entries(this.shopItems.frames).forEach(([emoji, item]) => {
      const owned = this.unlockedFrames[emoji];
      const equipped = this.currentFrame === emoji;
      const canAfford = this.coins >= item.price;
      
      html += `
        <div class="shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}">
          <div class="shop-item-icon">${emoji}</div>
          <div class="shop-item-info">
            <h4>${item.name}</h4>
            <p>${owned ? 'POSIADANE' : `${item.price} monet`}</p>
          </div>
          <div>
      `;
      
      if (!owned) {
        html += `
          <button class="shop-btn" onclick="levelRewardsSystem.buyShopItem('frames', '${emoji}')" 
            ${!canAfford ? 'disabled' : ''}>
            KUP
          </button>
        `;
      } else {
        html += `
          <button class="shop-btn" onclick="levelRewardsSystem.equipItem('frames', '${emoji}')" 
            ${equipped ? 'disabled' : ''}>
            ${equipped ? '✅' : '🔲'}
          </button>
        `;
      }
      
      html += `</div></div>`;
    });

    html += `
        </div>
      </div>

      <div class="shop-section">
        <h3>⚡ Boosty</h3>
        <div class="shop-items">
    `;

    Object.entries(this.shopItems.powerups).forEach(([key, item]) => {
      const active = this.hasPowerUp(item.type);
      const canAfford = this.coins >= item.price;
      
      html += `
        <div class="shop-item ${active ? 'active' : ''}">
          <div class="shop-item-icon">⚡</div>
          <div class="shop-item-info">
            <h4>${item.name}</h4>
            <p>${item.price} monet</p>
          </div>
          <button class="shop-btn" onclick="levelRewardsSystem.buyShopItem('powerups', '${key}')" 
            ${!canAfford || active ? 'disabled' : ''}>
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
      showNotification(`✅ Założono awatar: ${this.shopItems.avatars[itemKey]?.name || itemKey}`);
      this.save();
      this.updateDisplay();
      return true;
    } else if (category === 'frames' && this.unlockedFrames[itemKey]) {
      this.currentFrame = itemKey;
      showNotification(`✅ Założono ramkę: ${this.shopItems.frames[itemKey]?.name || itemKey}`);
      this.save();
      this.updateDisplay();
      return true;
    }
    return false;
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
    
    const levelEl = document.getElementById('topBarLevel');
    const xpFill = document.getElementById('topBarXPFill');
    const xpText = document.getElementById('topBarXPText');
    
    if (levelEl) levelEl.textContent = this.level;
    if (xpFill) xpFill.style.width = percentage + '%';
    if (xpText) xpText.textContent = `${this.xp} / ${this.xpForNextLevel}`;
    
    const pauseLevel = document.getElementById('pausePlayerLevel');
    const pauseXP = document.getElementById('pausePlayerXP');
    
    if (pauseLevel) pauseLevel.textContent = this.level;
    if (pauseXP) pauseXP.textContent = `${this.xp} / ${this.xpForNextLevel}`;

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
      } else if (this.lastChallengeDate) {
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

// ===== TUTORIAL SYSTEM =====
const tutorialSystem = {
  tutorials: {
    snake: {
      name: "Snake",
      title: "Zbieraj i Rośnij!",
      desc: "Zjadaj jedzenie, aby wydłużyć węża. Uważaj, aby nie uderzyć w ściany ani we własny ogon! Im dłuższy wąż, tym jesteś szybszy.",
      controls: "Strzałki lub W, A, S, D",
      animationHTML: `
        <div class="tut-snake-scene">
          <div class="tut-snake-head">
            <div class="tut-snake-eye"></div>
            <div class="tut-snake-eye"></div>
          </div>
          <div class="tut-snake-body b1"></div>
          <div class="tut-snake-body b2"></div>
          <div class="tut-snake-apple"></div>
        </div>
      `
    },
    pong: {
      name: "Pong",
      title: "Odbijaj Piłkę!",
      desc: "Klasyczny ping-pong. Odbijaj piłkę paletką, aby nie stracić punktu. Przebij piłkę w stronę przeciwnika (AI), aby zdobyć punkt.",
      controls: "Strzałki Góra/Dół lub W, S",
      animationHTML: `
        <div class="tut-pong-scene">
          <div class="tut-pong-paddle left"></div>
          <div class="tut-pong-ball"></div>
          <div class="tut-pong-paddle right"></div>
          <div class="tut-pong-net"></div>
        </div>
      `
    },
    wordle: {
      name: "Wordle",
      title: "Odgadnij Słowo!",
      desc: "Znajdź ukryte słowo w 6 próbach.<br><strong style='color:var(--success)'>Zielony</strong>: Dobra litera, dobre miejsce.<br><strong style='color:var(--warning)'>Żółty</strong>: Dobra litera, złe miejsce.<br><strong style='color:#555'>Szary</strong>: Litery nie ma w słowie.",
      controls: "Klawiatura fizyczna lub ekranowa",
      animationHTML: `
        <div class="tut-wordle-scene">
          <div class="tut-wordle-row">
            <div class="tut-wordle-tile absent">K</div>
            <div class="tut-wordle-tile correct">O</div>
            <div class="tut-wordle-tile present">D</div>
            <div class="tut-wordle-tile correct">E</div>
            <div class="tut-wordle-tile correct">R</div>
          </div>
        </div>
      `
    },
    duck: {
      name: "Duck Hunt",
      title: "Manewruj między rurami!",
      desc: "Lataj swoją kaczką między przeszkodami. Im dalej polecisz bez zderzenia, tym lepiej! Grawitacja ciągnie cię w dół, musisz klikać by wzbić się wyżej.",
      controls: "Spacja lub kliknięcie myszką na ekranie",
      animationHTML: `
        <div class="tut-duck-scene">
          <div class="tut-duck-bird"></div>
          <div class="tut-duck-pipe top"></div>
          <div class="tut-duck-pipe bottom"></div>
        </div>
      `
    },
    mario: {
      name: "Mini Mario",
      title: "Biegnij po Monety!",
      desc: "Biegaj w lewo i prawo, przeskakuj przepaście i zbieraj monety. Dotrzyj do flagi na końcu każdego poziomu, by przejść dalej.",
      controls: "A, D - Poruszanie | W lub Spacja - Skok",
      animationHTML: `
        <div class="tut-mario-scene">
          <div class="tut-mario-player"></div>
          <div class="tut-mario-coin"></div>
          <div class="tut-mario-ground"></div>
          <div class="tut-mario-gap"></div>
          <div class="tut-mario-ground right"></div>
        </div>
      `
    },
    racing: {
      name: "Speed Racer",
      title: "Wciśnij Gaz do Dechy!",
      desc: "Omijaj inne samochody na autostradzie. Zbieraj zielone przyspieszenia, by zwiększyć mnożnik punktów. Wraz z dystansem gra przyspiesza!",
      controls: "Strzałki w lewo i w prawo lub A i D",
      animationHTML: `
        <div class="tut-racing-scene">
          <div class="tut-racing-road"></div>
          <div class="tut-racing-player"></div>
          <div class="tut-racing-enemy"></div>
        </div>
      `
    },
    tetris: {
      name: "Tetris",
      title: "Układaj Linie!",
      desc: "Obracaj i przesuwaj spadające klocki. Wypełnienie całej poziomej linii sprawia, że znika ona i daje punkty. Gra kończy się, gdy klocki dotkną samej góry.",
      controls: "Strzałki (Ruch/Prędkość) | Spacja (Obrót)",
      animationHTML: `
        <div class="tut-tetris-scene">
          <div class="tut-tetris-board">
            <div class="tut-tetris-piece">
              <div class="tut-tetris-block"></div>
              <div class="tut-tetris-block" style="grid-column: 1 / span 2; width: 40px;"></div>
            </div>
            <div class="tut-tetris-bottom"></div>
          </div>
        </div>
      `
    },
    breakout: {
      name: "Breakout",
      title: "Niszcz Bloczek po Bloczku!",
      desc: "Użyj paletki, aby odbijać piłkę w górę. Celem jest zniszczenie wszystkich kolorowych cegiełek na ekranie bez upuszczenia piłki w przepaść.",
      controls: "Myszka lub Strzałki Lewo/Prawo",
      animationHTML: `
        <div class="tut-breakout-scene">
          <div class="tut-breakout-bricks">
            <div class="tut-breakout-brick"></div>
            <div class="tut-breakout-brick"></div>
            <div class="tut-breakout-brick"></div>
          </div>
          <div class="tut-breakout-ball"></div>
          <div class="tut-breakout-paddle"></div>
        </div>
      `
    },
    simon: {
      name: "Simon Says",
      title: "Kopiuj Sekwencję!",
      desc: "Obserwój carefully jak gra podświetla kolory. Twoim zadaniem jest kliknąć te same kolory w dokładnie takiej samej kolejności. Każda runda dodaje jeden nowy kolor do sekwencji.",
      controls: "Kliknięcia myszką w bloki kolorów",
      animationHTML: `
        <div class="tut-simon-scene">
          <div class="tut-simon-btn g"></div>
          <div class="tut-simon-btn r"></div>
          <div class="tut-simon-btn y"></div>
          <div class="tut-simon-btn b"></div>
        </div>
      `
    }
  },

  gameToStart: null,

  show(gameId) {
    const tutData = this.tutorials[gameId];
    if (!tutData) return;

    this.gameToStart = gameId;

    document.getElementById('tutorialGameName').textContent = tutData.name;
    document.getElementById('tutorialTitle').textContent = tutData.title;
    document.getElementById('tutorialDescription').innerHTML = tutData.desc;
    document.getElementById('tutorialControlsText').textContent = tutData.controls;
    document.getElementById('tutorialAnimationContainer').innerHTML = tutData.animationHTML;

    const modal = document.getElementById('tutorialModal');
    if (modal) {
      modal.classList.remove('hidden');
      soundSystem.play('click');
    }
  }
};

function showTutorial(gameId) {
  tutorialSystem.show(gameId);
}

function closeTutorialAndPlay() {
  closeModal('tutorialModal');
  if (tutorialSystem.gameToStart) {
    const game = tutorialSystem.gameToStart;
    
    // Custom start logic based on game
    if (['snake', 'pong', 'racing'].includes(game)) {
      selectDifficulty(game);
    } else if (game === 'wordle') {
      selectWordleMode();
    } else {
      uiStart(game);
    }
    
    tutorialSystem.gameToStart = null;
  }
}

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
      
      if (gameStateManager.currentGameLoop) {
        clearInterval(gameStateManager.currentGameLoop);
        gameStateManager.currentGameLoop = null;
      }
      
      if (tetrisGame && tetrisGame.animationId) {
        cancelAnimationFrame(tetrisGame.animationId);
        tetrisGame.animationId = null;
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
          function tetrisLoop(timestamp) {
            if (!tetrisGame || tetrisGame.gameOver) return;
            
            const delta = timestamp - lastTetrisTime;
            if (delta > 1000 / 60) {
              lastTetrisTime = timestamp;
              
              const now = Date.now();
              if (now - tetrisGame.lastDrop > tetrisGame.speed) {
                if (!tetrisGame.gameOver) {
                  moveDown();
                  tetrisGame.lastDrop = now;
                }
              }
              
              drawTetris();
            }
            
            tetrisGame.animationId = requestAnimationFrame(tetrisLoop);
          }
          
          tetrisGame.animationId = requestAnimationFrame(tetrisLoop);
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

function resetSimon() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initSimon();
}

function pauseBackToMenu() {
  pauseSystem.isPaused = false;
  const pauseMenu = document.getElementById('pauseMenu');
  if (pauseMenu) pauseMenu.classList.add('hidden');
  backToMenu();
}

// ===== IMPROVED RESTART FUNCTIONS =====
function resetSnake() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initSnake();
}

function resetDuck() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initDuck();
}

function resetRacing() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initRacing();
}

// USUNIĘTO DUPLIKAT - funkcja resetMario() jest teraz tylko w mario.js
function resetMarioPosition() {
  if (!marioGame) return;
  
  const mario = marioGame.mario;
  mario.x = 50;
  mario.y = 300;
  mario.velocityX = 0;
  mario.velocityY = 0;
  mario.onGround = false;
  mario.canJump = true;
  mario.isCrouching = false;
  mario.height = 40;
  
  if (marioGame.camera) {
    marioGame.camera.x = 0;
  }
  
  if (marioGame.startTime) {
    marioGame.startTime = Date.now();
  }
  
  // USUNIĘTO efekty cząsteczkowe przy resetowaniu pozycji
}

// function resetMario() {
//   gameStateManager.cleanupCurrentGame();
//   inputHandler.clearAll();
//   initMario();
// }

function resetTetris() {
  if (tetrisGame && tetrisGame.animationId) {
    cancelAnimationFrame(tetrisGame.animationId);
    tetrisGame.animationId = null;
  }
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initTetris();
}

function resetBreakout() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initBreakout();
}

function resetPong() {
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initPong();
}

function resetWordle() {
  wordleGame.reset();
}

// Dodajemy uniwersalną funkcję do restartu z ekranu Game Over
function restartFromGameOver(game) {
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  if (tetrisGame && tetrisGame.animationId) {
    cancelAnimationFrame(tetrisGame.animationId);
    tetrisGame.animationId = null;
  }
  
  inputHandler.clearAll();
  gameStateManager.currentGame = null;
  
  setTimeout(() => {
    switch(game) {
      case 'snake': initSnake(); break;
      case 'pong': initPong(); break;
      case 'duck': initDuck(); break;
      case 'mario': initMario(); break;
      case 'racing': initRacing(); break;
      case 'tetris': initTetris(); break;
      case 'breakout': initBreakout(); break;
    }
    gameStateManager.currentGame = game;
  }, 100);
}

function resetCurrentGame() {
  pauseSystem.isPaused = false;
  const pauseMenu = document.getElementById('pauseMenu');
  if (pauseMenu) pauseMenu.classList.add('hidden');
  
  const game = gameStateManager.currentGame;
  
  // Zatrzymaj wszelkie animacje/interwały PRZED resetem
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  if (tetrisGame && tetrisGame.animationId) {
    cancelAnimationFrame(tetrisGame.animationId);
    tetrisGame.animationId = null;
  }
  
  // Wyczyść input
  inputHandler.clearAll();
  
  // Resetuj grę po krótkim opóźnieniu
  setTimeout(() => {
    switch(game) {
      case 'snake': 
        initSnake(); 
        gameStateManager.currentGame = 'snake';
        break;
      case 'pong': 
        initPong(); 
        gameStateManager.currentGame = 'pong';
        break;
      case 'wordle': 
        wordleGame.reset(); 
        gameStateManager.currentGame = 'wordle';
        break;
      case 'duck': 
        initDuck(); 
        gameStateManager.currentGame = 'duck';
        break;
      case 'mario': 
        initMario(); 
        gameStateManager.currentGame = 'mario';
        break;
      case 'racing': 
        initRacing(); 
        gameStateManager.currentGame = 'racing';
        break;
      case 'tetris': 
        initTetris(); 
        gameStateManager.currentGame = 'tetris';
        break;
      case 'breakout': 
        initBreakout(); 
        gameStateManager.currentGame = 'breakout';
        break;
    }
  }, 50);
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
  },
  racing: {
    easy: { name: "Łatwy", description: "Wolne samochody, mały mnożnik", multiplier: 1 },
    medium: { name: "Średni", description: "Normalna prędkość, średni mnożnik", multiplier: 1.5 },
    hard: { name: "Trudny", description: "Szybkie samochody, duży mnożnik", multiplier: 2 },
    expert: { name: "Ekspert", description: "Ekstremalna prędkość, maksymalny mnożnik", multiplier: 3 }
  }
};

// ===== MARIO LEVEL SELECT SYSTEM =====
const marioLevelSelectSystem = {
  showLevelSelect() {
    // Stwórz modal wyboru poziomu Mario
    const modal = document.createElement('div');
    modal.id = 'marioLevelModal';
    modal.className = 'level-modal';
    modal.style.display = 'flex';
    
    const levelInfo = marioLevels.map((level, index) => ({
      number: index + 1,
      coins: level.coins.length,
      platforms: level.platforms.length,
      unlocked: index === 0 || (achievementsManager.progress.marioBest || 0) >= index
    }));
    
    modal.innerHTML = `
      <div class="level-modal-content">
        <div class="level-select-header">
          <h2>🍄 Wybierz Poziom Mario</h2>
          <p>Poziomy odblokowane: ${achievementsManager.progress.marioBest || 0 + 1}/3</p>
        </div>
        <div class="level-grid">
          ${levelInfo.map(level => `
            <div class="level-card ${level.unlocked ? 'unlocked' : 'locked'}">
              <div class="level-number">${level.number}</div>
              <div class="level-info">
                <h3>Poziom ${level.number}</h3>
                <p>💰 ${level.coins} monet</p>
                <p>🟫 ${level.platforms} platform</p>
                <p>${level.unlocked ? '✅ Odblokowany' : '🔒 Zablokowany'}</p>
              </div>
              <div class="level-status">
                ${level.unlocked ? 
                  `<button class="level-select-btn" onclick="startMarioLevel(${level.number - 1})">
                    Wybierz
                  </button>` : 
                  `<div class="locked-icon">🔒</div>`
                }
              </div>
            </div>
          `).join('')}
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="closeMarioLevelModal()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Zamknij
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  },
  
  closeLevelSelect() {
    const modal = document.getElementById('marioLevelModal');
    if (modal) {
      document.body.removeChild(modal);
    }
  }
};

// ===== WYBIÓR POZIOMU MARIO =====
function selectMarioLevel() {
  // Zatrzymaj aktualną grę jeśli istnieje
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  if (marioGame && marioGame.animationId) {
    cancelAnimationFrame(marioGame.animationId);
    marioGame.animationId = null;
  }
  
  // Pokaż menu wyboru poziomu
  showMarioLevelSelect();
}

function startMarioLevel(levelIndex) {
  marioLevelSelectSystem.closeLevelSelect();
  
  // Zaktualizuj initMario aby przyjmował poziom
  const originalInitMario = window.initMario;
  window.initMario = function() {
    // Wywołaj oryginalną funkcję
    originalInitMario();
    
    // Ustaw wybrany poziom
    if (marioGame) {
      marioGame.currentLevel = levelIndex;
      // Zresetuj pozycję Mario na nowym poziomie
      marioGame.mario.x = 50;
      marioGame.mario.y = 300;
      marioGame.camera = 0;
      marioGame.coinsCollected = [];
      marioGame.score = levelIndex * 100; // Bonus za wyższy poziom
      
      // Zaktualizuj wynik
      const scoreEl = document.getElementById('marioScore');
      if (scoreEl) {
        scoreEl.textContent = `Poziom: ${marioGame.currentLevel + 1} | Monety: ${marioGame.coinsCollected.length} | Wynik: ${marioGame.score}`;
      }
    }
  };
  
  // Uruchom grę
  uiStart('mario');
  
  // Przywróć oryginalną funkcję po chwili
  setTimeout(() => {
    window.initMario = originalInitMario;
  }, 100);
}

function closeMarioLevelModal() {
  marioLevelSelectSystem.closeLevelSelect();
}

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
  },
  
  resetGame() {
    this.cleanupCurrentGame();
    inputHandler.clearAll();
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
      ${game === 'racing' ? `<p>Mnożnik: x${config.multiplier}</p>` : ''}
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

function startMarioGame() {
  console.log("🎮 Rozpoczynam grę Mario...");
  
  // Przejdź do ekranu gry
  uiStart('mario');
  
  // Pokaż wybór poziomu po chwili
  setTimeout(() => {
    if (gameStateManager.currentGame === 'mario') {
      showMarioLevelSelect();
    }
  }, 300);
}

function backToMenu() {
  gameStateManager.resetGame();
  inputHandler.clearAll();
  
  const gameMenu = document.getElementById('gameMenu');
  if (gameMenu) gameMenu.style.display = 'grid';
  
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Dodaj efekt wizualny powrotu
  showNotification('🏠 Wrócono do menu głównego');
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
  // Odśwież stan monet przed otwarciem sklepu
  const saved = localStorage.getItem('levelRewards');
  if (saved) {
    const data = JSON.parse(saved);
    if (data.coins !== undefined) {
      levelRewardsSystem.coins = data.coins;
    }
  }
  
  levelRewardsSystem.updateDisplay();
  levelRewardsSystem.updateShopDisplay();
  const shopModal = document.getElementById('shopModal');
  if (shopModal) shopModal.classList.remove('hidden');
}

function openProfile() {
  levelSystem.updateDisplay();
  levelRewardsSystem.updateDisplay();
  
  const stats = achievementsManager.progress;
  document.getElementById('profileSnakeBest').textContent = stats.snakeBest || 0;
  document.getElementById('profilePongBest').textContent = stats.pongBest || 0;
  document.getElementById('profileWordleSolved').textContent = stats.wordleSolved || 0;
  document.getElementById('profileSimonBest').textContent = stats.simonBest || 0;
  document.getElementById('profileDuckBest').textContent = stats.duckBest || 0;
  document.getElementById('profileMarioBest').textContent = stats.marioBest || 0;
  document.getElementById('profileRacingBest').textContent = stats.racingBest || 0;
  document.getElementById('profileTetrisBest').textContent = stats.tetrisBest || 0;
  document.getElementById('profileBreakoutBest').textContent = stats.breakoutBest || 0;
  
  const profileModal = document.getElementById('profileModal');
  if (profileModal) profileModal.classList.remove('hidden');
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
  } else if (gameStateManager.currentGame === 'duck' && duckGame && !duckGame.gameOver && !duckGame.levelComplete && !duckGame.isStarting) {
    if (key === 'space' && duckGame.canJump) {
      duckGame.duck.velocity = duckGame.jump;
      duckGame.canJump = false; // Zapobiegaj ciągłym skokom
      if (soundSystem.enabled) soundSystem.play('jump');
      
      // Odblokuj skok po krótkim czasie
      setTimeout(() => {
        if (duckGame) duckGame.canJump = true;
      }, 200);
    }
  } else if (gameStateManager.currentGame === 'tetris' && tetrisGame && !tetrisGame.gameOver) {
    if (key === 'left') moveLeft();
    else if (key === 'right') moveRight();
    else if (key === 'down') moveDown();
    else if (key === 'space') rotatePiece();
    else if (key === 'up') hardDrop();
  } else if (gameStateManager.currentGame === 'racing' && racingGame && !racingGame.gameOver) {
    if (key === 'left' || key === 'a') {
      racingGame.car.x = Math.max(75, racingGame.car.x - racingGame.car.speed);
    } else if (key === 'right' || key === 'd') {
      racingGame.car.x = Math.min(275, racingGame.car.x + racingGame.car.speed);
    }
  } else if (gameStateManager.currentGame === 'mario' && marioGame && !marioGame.gameOver && !marioGame.levelComplete) {
    // STEROWANIE MARIO - klawisze są już obsługiwane w updateMario() w mario.js
    console.log(`Mario key pressed: ${key}`);
  }
  
  if (key === 'escape') {
    pauseSystem.toggle();
  }
});

document.addEventListener('keyup', (e) => {
  const key = inputHandler.handleKeyUp(e);
  
  // DUCK HUNT - odblokuj skok po puszczeniu spacji
  if (gameStateManager.currentGame === 'duck' && duckGame && key === 'space') {
    if (duckGame) duckGame.canJump = true;
  }
});

// Usuwamy obsługę kliknięcia na ekranie Game Over (bo nie ma już przycisków)
document.addEventListener('click', (e) => {
  // Kaczka - kliknięcie na canvas skacze (tylko gdy gra trwa)
  if (gameStateManager.currentGame === 'duck' && duckGame && !duckGame.gameOver && !duckGame.isStarting) {
    const canvas = document.getElementById('duckCanvas');
    if (canvas && e.target === canvas) {
      duckGame.duck.velocity = duckGame.jump;
      soundSystem.play('jump');
    }
  }
});

// ===== INITIALIZATION =====
function initializeMissingElements() {
  const shopNavBtn = document.getElementById('shopNavBtn');
  if (shopNavBtn) {
    shopNavBtn.onclick = (e) => {
      e.preventDefault();
      openShop();
    };
  }

  const profileNavBtn = document.getElementById('profileNavBtn');
  if (profileNavBtn) {
    profileNavBtn.onclick = (e) => {
      e.preventDefault();
      openProfile();
    };
  }

  const gamesNavBtn = document.getElementById('gamesNavBtn');
  if (gamesNavBtn) {
    gamesNavBtn.onclick = (e) => {
      e.preventDefault();
      backToMenu();
    };
  }

  // Mario Play Button Handler
  const marioPlayButton = document.querySelector('.game-tile:nth-child(6) .play-button');
  if (marioPlayButton) {
    marioPlayButton.onclick = startMarioGame;
  }

  // Mario Level Select Button Handler
  const marioLevelSelectBtn = document.getElementById('marioLevelSelectBtn');
  if (marioLevelSelectBtn) {
    marioLevelSelectBtn.onclick = showMarioLevelSelect;
  }

  // Naprawa błędu sklepu
  setTimeout(() => {
    if (window.levelRewardsSystem) {
      // Wymuś aktualizację monet
      const coins = levelRewardsSystem.coins;
      const saved = localStorage.getItem('levelRewards');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.coins !== undefined) {
          levelRewardsSystem.coins = data.coins;
        }
      }
      levelRewardsSystem.updateDisplay();
      
      console.log("✅ Sklep naprawiony. Monety:", levelRewardsSystem.coins);
    }
  }, 1000);

  updateProfileStats();
}

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

// ===== STYLE FOR LEVEL SYSTEM =====
function addLevelStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Modal wyboru poziomu */
    .level-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .level-modal-content {
      background: var(--bg-secondary);
      padding: 30px;
      border-radius: 15px;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
      width: 90%;
      border: 3px solid var(--accent-primary);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .level-select-header {
      text-align: center;
      margin-bottom: 30px;
      color: var(--text-primary);
    }
    
    .level-select-header h2 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    
    .level-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .level-card {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 20px;
      border: 2px solid #444;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    
    .level-card.unlocked {
      border-color: var(--accent-primary);
      box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.2);
    }
    
    .level-card.locked {
      opacity: 0.6;
      filter: grayscale(0.7);
    }
    
    .level-card.current {
      border-color: #00ff00;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    }
    
    .level-number {
      font-size: 32px;
      font-weight: bold;
      color: var(--accent-primary);
      margin-bottom: 15px;
      text-align: center;
    }
    
    .level-info h3 {
      margin: 0 0 10px 0;
      color: var(--text-primary);
      font-size: 20px;
    }
    
    .level-info p {
      margin: 5px 0;
      color: var(--text-secondary);
      font-size: 14px;
    }
    
    .level-status {
      margin-top: auto;
      padding-top: 15px;
      display: flex;
      justify-content: center;
    }
    
    .level-select-btn {
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
      font-size: 16px;
    }
    
    .level-select-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(var(--accent-rgb), 0.4);
    }
    
    .locked-icon {
      font-size: 40px;
      opacity: 0.5;
    }
    
    /* Przycisk w grze */
    .level-select-button {
      background: linear-gradient(45deg, #FF8C00, #FFD700);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: bold;
      font-size: 16px;
      margin: 10px;
      transition: all 0.3s;
    }
    
    .level-select-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 140, 0, 0.4);
    }
    
    /* Progress bar w grze */
    .level-progress {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      background: rgba(0, 0, 0, 0.5);
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .level-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff00, #00cc00);
      transition: width 0.3s;
    }
    
    .level-progress-text {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
}

// Dodaj modal wyboru poziomu do HTML
function addDuckLevelModal() {
  if (!document.getElementById('duckLevelModal')) {
    const modal = document.createElement('div');
    modal.id = 'duckLevelModal';
    modal.className = 'level-modal hidden';
    modal.innerHTML = `
      <div class="level-modal-content">
        <div id="duckLevelContent"></div>
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="closeModal('duckLevelModal')" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Zamknij
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// Dodaj modal wyboru poziomu Mario do HTML
function addMarioLevelModal() {
  if (!document.getElementById('marioLevelModal')) {
    const modal = document.createElement('div');
    modal.id = 'marioLevelModal';
    modal.className = 'level-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="level-modal-content">
        <div id="marioLevelContent"></div>
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="closeMarioLevelModal()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Zamknij
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// Obsługa zamykania modalów
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("🎮 Gaming Hub - Ultimate Edition - Loading...");
  
  achievementsManager.init();
  themeManager.init();
  settings.load();
  
  soundSystem.init();
  levelSystem.init();
  levelRewardsSystem.init();
  dailyChallengeSystem.init();
  
  // Dodaj style i modalne dla systemu poziomów
  addLevelStyles();
  addDuckLevelModal();
  addMarioLevelModal();
  
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
  
  const soundBtn = document.getElementById('soundBtn');
  if (soundBtn) {
    soundBtn.onclick = () => {
      soundSystem.toggle();
    };
  }
  
  const dailyChallengeBtn = document.getElementById('dailyChallengeBtn');
  if (dailyChallengeBtn) {
    dailyChallengeBtn.onclick = () => {
      dailyChallengeSystem.updateDisplay();
      const modal = document.getElementById('dailyChallengeModal');
      if (modal) modal.classList.remove('hidden');
    };
  }
  
  const shopBtn = document.getElementById('shopBtn');
  if (shopBtn) {
    shopBtn.onclick = () => {
      openShop();
    };
  }
  
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
  
  // Mario Tile Setup
  const marioTile = document.querySelector('.game-tile:nth-child(6)');
  if (marioTile) {
    const marioButton = marioTile.querySelector('.play-button');
    if (marioButton) {
      marioButton.onclick = function() {
        selectMarioLevel();
      };
    }
  }
  
  // Inicjalizuj wszystkie gry
  initSimon(); // Simon musi być zainicjalizowany od razu
  wordleGame.init(); // Wordle też
  
  // Aktualizuj statystyki
  achievementsManager.updateDisplay();
  
  // Sprawdź czy wszystko działa
  console.log("✅ Wszystkie systemy zainicjalizowane");
  console.log("🎮 Dostępne funkcje gry:");
  console.log("- Snake: ", typeof initSnake);
  console.log("- Mario: ", typeof initMario);
  console.log("- Racing: ", typeof initRacing);
  console.log("- Tetris: ", typeof initTetris);
  console.log("- Pong: ", typeof initPong);
  console.log("- Duck Hunt: ", typeof initDuck);
  console.log("- Breakout: ", typeof initBreakout);
  console.log("- Simon: ", typeof initSimon);
  console.log("- Wordle: ", typeof wordleGame.init);
  
  showNotification('🎮 Gaming Hub - Ultimate Edition!');
});