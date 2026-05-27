// ===== SPACE INVADERS GAME =====
let invadersGame;

function initInvaders() {
  invadersGame = {
    player: { x: 270, y: 460, width: 50, height: 20, speed: 6 },
    bullets: [],
    enemies: [],
    enemyBullets: [],
    particles: [],
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    enemyDirection: 1,
    enemySpeed: 0.5,
    enemyMoveTimer: 0,
    bulletCooldown: 0,
    shakeAmount: 0,
    starField: [],
    frameCount: 0
  };
  
  // Gwiazdy tła
  for (let i = 0; i < 50; i++) {
    invadersGame.starField.push({
      x: Math.random() * 600,
      y: Math.random() * 500,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1
    });
  }
  
  createEnemies();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!invadersGame.gameOver) {
      updateInvaders();
      drawInvaders();
    }
  }, 1000 / 60);
}

function createEnemies() {
  invadersGame.enemies = [];
  const rows = Math.min(4 + invadersGame.level - 1, 7); // Max 7 rzędów
  const cols = 8;
  const paddingX = 50;
  const paddingY = 40;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let type = 2; // Basic
      if (row === 0) type = 0; // Boss
      else if (row === 1 || row === 2) type = 1; // Medium
      
      invadersGame.enemies.push({
        x: col * paddingX + 50,
        y: row * paddingY + 50,
        width: 35,
        height: 25,
        alive: true,
        type: type,
        animFrame: 0
      });
    }
  }
}

function updateInvaders() {
  invadersGame.frameCount++;
  
  // Ruch gracza
  if (inputHandler.isPressed('left')) {
    invadersGame.player.x = Math.max(0, invadersGame.player.x - invadersGame.player.speed);
  }
  if (inputHandler.isPressed('right')) {
    invadersGame.player.x = Math.min(600 - invadersGame.player.width, invadersGame.player.x + invadersGame.player.speed);
  }
  
  // Strzał gracza
  if (invadersGame.bulletCooldown > 0) invadersGame.bulletCooldown--;
  if (inputHandler.isPressed('space') && invadersGame.bulletCooldown <= 0) {
    invadersGame.bullets.push({
      x: invadersGame.player.x + invadersGame.player.width / 2 - 1.5,
      y: invadersGame.player.y,
      speed: -8,
      width: 3,
      height: 12
    });
    invadersGame.bulletCooldown = 15;
    soundSystem.play('jump');
  }
  
  // Aktualizacja pocisków gracza
  for (let i = invadersGame.bullets.length - 1; i >= 0; i--) {
    let bullet = invadersGame.bullets[i];
    bullet.y += bullet.speed;
    if (bullet.y < 0) {
      invadersGame.bullets.splice(i, 1);
      continue;
    }
    
    // Kolizja z wrogami
    let hit = false;
    for (let j = 0; j < invadersGame.enemies.length; j++) {
      let enemy = invadersGame.enemies[j];
      if (enemy.alive &&
          bullet.x > enemy.x && bullet.x < enemy.x + enemy.width &&
          bullet.y > enemy.y && bullet.y < enemy.y + enemy.height) {
        
        enemy.alive = false;
        hit = true;
        invadersGame.shakeAmount = 2;
        soundSystem.play('collect');
        
        // Punkty
        if (enemy.type === 0) invadersGame.score += 40;
        else if (enemy.type === 1) invadersGame.score += 20;
        else invadersGame.score += 10;
        
        // Cząsteczki
        for (let k = 0; k < 6; k++) {
          invadersGame.particles.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1.0,
            color: enemy.type === 0 ? '#ff0000' : (enemy.type === 1 ? '#ffff00' : '#00ff00'),
            size: Math.random() * 3 + 2
          });
        }
        break;
      }
    }
    if (hit) invadersGame.bullets.splice(i, 1);
  }
  
  // Ruch wrogów
  let hitWall = false;
  let allDead = true;
  invadersGame.enemies.forEach(enemy => {
    if (enemy.alive) {
      allDead = false;
      enemy.x += invadersGame.enemySpeed * invadersGame.enemyDirection;
      if (enemy.x <= 10 || enemy.x + enemy.width >= 590) {
        hitWall = true;
      }
      
      // Animacja wrogów (pulsowanie rozmiarem)
      if (invadersGame.frameCount % 20 === 0) enemy.animFrame = (enemy.animFrame + 1) % 2;
      
      // Game Over jeśli dotrą do gracza
      if (enemy.y + enemy.height >= invadersGame.player.y) {
        gameOver();
      }
    }
  });
  
  if (hitWall) {
    invadersGame.enemyDirection *= -1;
    invadersGame.enemies.forEach(enemy => {
      enemy.y += 20;
    });
    // Zwiększ prędkość z każdym obniżeniem
    invadersGame.enemySpeed += 0.05;
  }
  
  if (allDead) {
    invadersGame.level++;
    invadersGame.enemySpeed = 0.5 + (invadersGame.level * 0.1);
    createEnemies();
    soundSystem.play('levelUp');
    showNotification(`Poziom ${invadersGame.level}!`);
    levelSystem.addXP(20);
  }
  
  // Strzelanie wrogów
  if (invadersGame.frameCount % Math.max(30, 120 - invadersGame.level * 10) === 0) {
    let aliveEnemies = invadersGame.enemies.filter(e => e.alive);
    if (aliveEnemies.length > 0) {
      let shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
      invadersGame.enemyBullets.push({
        x: shooter.x + shooter.width / 2,
        y: shooter.y + shooter.height,
        speed: 4 + (invadersGame.level * 0.2),
        width: 4,
        height: 12
      });
    }
  }
  
  // Aktualizacja pocisków wrogów
  for (let i = invadersGame.enemyBullets.length - 1; i >= 0; i--) {
    let bullet = invadersGame.enemyBullets[i];
    bullet.y += bullet.speed;
    if (bullet.y > 500) {
      invadersGame.enemyBullets.splice(i, 1);
      continue;
    }
    
    // Kolizja z graczem
    if (bullet.x > invadersGame.player.x && bullet.x < invadersGame.player.x + invadersGame.player.width &&
        bullet.y + bullet.height > invadersGame.player.y && bullet.y < invadersGame.player.y + invadersGame.player.height) {
      
      invadersGame.lives--;
      invadersGame.enemyBullets.splice(i, 1);
      invadersGame.shakeAmount = 5;
      soundSystem.play('gameOver');
      
      if (invadersGame.lives <= 0) {
        gameOver();
      } else {
        // Chwilowa niewrażliwość lub po prostu reset pozycji nie jest tu konieczny
      }
    }
  }
  
  // Aktualizacja cząsteczek
  for (let i = invadersGame.particles.length - 1; i >= 0; i--) {
     let p = invadersGame.particles[i];
     p.x += p.vx;
     p.y += p.vy;
     p.life -= 0.05;
     if (p.life <= 0) invadersGame.particles.splice(i, 1);
  }
  
  // Aktualizacja gwiazd
  invadersGame.starField.forEach(star => {
    star.y += star.speed;
    if (star.y > 500) {
      star.y = 0;
      star.x = Math.random() * 600;
    }
  });
  
  if (invadersGame.shakeAmount > 0) invadersGame.shakeAmount *= 0.9;
  
  updateInvadersScore();
}

function gameOver() {
  invadersGame.gameOver = true;
  invadersGame.shakeAmount = 8;
  soundSystem.play('gameOver');
  achievementsManager.checkAchievements('invaders', invadersGame.score);
  levelSystem.addXP(Math.floor(invadersGame.score / 10));
  dailyChallengeSystem.updateProgress('invaders', invadersGame.score);
}

function updateInvadersScore() {
  const scoreEl = document.getElementById('invadersScore');
  if (scoreEl) {
    scoreEl.textContent = `Wynik: ${invadersGame.score} | Życia: ${invadersGame.lives} | Poziom: ${invadersGame.level}`;
  }
}

function drawInvaders() {
  const canvas = document.getElementById('invadersCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.save();
  if (invadersGame.shakeAmount > 0.5) {
    ctx.translate((Math.random() - 0.5) * invadersGame.shakeAmount * 2, (Math.random() - 0.5) * invadersGame.shakeAmount * 2);
  }
  
  // Tło kosmiczne z mgławicą
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 500);
  bgGrad.addColorStop(0, '#050510');
  bgGrad.addColorStop(0.5, '#0a0a2a');
  bgGrad.addColorStop(1, '#0d0520');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-10, -10, 620, 520);
  
  // Gwiazdy z migotaniem
  invadersGame.starField.forEach(star => {
    const twinkle = 0.3 + Math.sin(invadersGame.frameCount * 0.05 + star.x) * 0.3;
    ctx.globalAlpha = star.speed + twinkle;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
  ctx.globalAlpha = 1.0;
  
  // === GRACZ — szczegółowy statek kosmiczny ===
  const px = invadersGame.player.x;
  const py = invadersGame.player.y;
  const pw = invadersGame.player.width;
  const ph = invadersGame.player.height;
  const pcx = px + pw / 2; // środek X
  
  // Poświata silnika (pod statkiem)
  const engineGlow = ctx.createRadialGradient(pcx, py + ph + 5, 0, pcx, py + ph + 5, 18);
  engineGlow.addColorStop(0, 'rgba(0, 180, 255, 0.6)');
  engineGlow.addColorStop(1, 'rgba(0, 180, 255, 0)');
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(pcx, py + ph + 5, 18, 0, Math.PI * 2);
  ctx.fill();
  
  // Płomienie silnika (animowane)
  const flameLen = 8 + Math.sin(invadersGame.frameCount * 0.5) * 4;
  const flameFlicker = Math.sin(invadersGame.frameCount * 0.8) * 2;
  
  // Lewy silnik
  ctx.fillStyle = '#00ccff';
  ctx.beginPath();
  ctx.moveTo(pcx - 10, py + ph);
  ctx.lineTo(pcx - 14 + flameFlicker, py + ph + flameLen);
  ctx.lineTo(pcx - 6, py + ph);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(pcx - 10, py + ph);
  ctx.lineTo(pcx - 12 + flameFlicker * 0.5, py + ph + flameLen * 0.5);
  ctx.lineTo(pcx - 6, py + ph);
  ctx.fill();
  
  // Prawy silnik
  ctx.fillStyle = '#00ccff';
  ctx.beginPath();
  ctx.moveTo(pcx + 6, py + ph);
  ctx.lineTo(pcx + 14 - flameFlicker, py + ph + flameLen);
  ctx.lineTo(pcx + 10, py + ph);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(pcx + 6, py + ph);
  ctx.lineTo(pcx + 12 - flameFlicker * 0.5, py + ph + flameLen * 0.5);
  ctx.lineTo(pcx + 10, py + ph);
  ctx.fill();
  
  // Kadłub — główny kształt (wielokąt)
  const shipGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
  shipGrad.addColorStop(0, '#1a6bff');
  shipGrad.addColorStop(0.5, '#0055dd');
  shipGrad.addColorStop(1, '#003399');
  ctx.fillStyle = shipGrad;
  ctx.beginPath();
  ctx.moveTo(pcx, py - 5);            // Czubek
  ctx.lineTo(pcx + 8, py + 4);        // Prawy bok czubka
  ctx.lineTo(px + pw + 3, py + ph - 2); // Prawe skrzydło
  ctx.lineTo(px + pw - 2, py + ph);   // Prawy dół
  ctx.lineTo(pcx + 12, py + ph);      // Prawy wewnętrzny
  ctx.lineTo(pcx + 12, py + 8);
  ctx.lineTo(pcx - 12, py + 8);
  ctx.lineTo(pcx - 12, py + ph);      // Lewy wewnętrzny
  ctx.lineTo(px + 2, py + ph);        // Lewy dół
  ctx.lineTo(px - 3, py + ph - 2);    // Lewe skrzydło
  ctx.lineTo(pcx - 8, py + 4);        // Lewy bok czubka
  ctx.closePath();
  ctx.fill();
  
  // Kontur statku
  ctx.strokeStyle = '#4499ff';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Kokpit (świecąca kopuła)
  const cockpitGrad = ctx.createRadialGradient(pcx, py + 4, 1, pcx, py + 5, 7);
  cockpitGrad.addColorStop(0, '#ffffff');
  cockpitGrad.addColorStop(0.4, '#66ddff');
  cockpitGrad.addColorStop(1, '#0088cc');
  ctx.fillStyle = cockpitGrad;
  ctx.beginPath();
  ctx.ellipse(pcx, py + 5, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Detale na skrzydłach (linie energii)
  ctx.strokeStyle = '#00ddff';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6 + Math.sin(invadersGame.frameCount * 0.1) * 0.3;
  // Lewe skrzydło
  ctx.beginPath();
  ctx.moveTo(pcx - 14, py + 12);
  ctx.lineTo(px, py + ph - 4);
  ctx.stroke();
  // Prawe skrzydło
  ctx.beginPath();
  ctx.moveTo(pcx + 14, py + 12);
  ctx.lineTo(px + pw, py + ph - 4);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  
  // === WROGOWIE — pixel-art style ===
  invadersGame.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    const ex = enemy.x;
    const ey = enemy.y;
    const ew = enemy.width;
    const eh = enemy.height;
    const ecx = ex + ew / 2;
    const ecy = ey + eh / 2;
    const anim = enemy.animFrame;
    
    if (enemy.type === 0) {
      // === BOSS — czerwony kosmita z rogami ===
      // Poświata
      ctx.save();
      ctx.shadowColor = '#ff3300';
      ctx.shadowBlur = 8;
      
      // Ciało
      const bossGrad = ctx.createLinearGradient(ex, ey, ex, ey + eh);
      bossGrad.addColorStop(0, '#ff2200');
      bossGrad.addColorStop(1, '#aa0000');
      ctx.fillStyle = bossGrad;
      ctx.fillRect(ex + 4, ey + 6, ew - 8, eh - 8);
      
      // Rogi/anteny
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(ex + 2, ey - 2, 5, 8);
      ctx.fillRect(ex + ew - 7, ey - 2, 5, 8);
      // Kulki na końcach rogów
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(ex + 4, ey - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + ew - 4, ey - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Oczy (animowane — mruganie)
      ctx.fillStyle = '#ffffff';
      const eyeH = anim === 0 ? 6 : 3;
      ctx.fillRect(ex + 8, ey + 9, 6, eyeH);
      ctx.fillRect(ex + ew - 14, ey + 9, 6, eyeH);
      // Źrenice
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(ex + 10, ey + 10, 3, Math.min(eyeH - 1, 4));
      ctx.fillRect(ex + ew - 12, ey + 10, 3, Math.min(eyeH - 1, 4));
      
      // Usta
      ctx.fillStyle = '#880000';
      ctx.fillRect(ex + 10, ey + 18, ew - 20, 3);
      
      // Nóżki (animowane)
      ctx.fillStyle = '#cc0000';
      const legOff = anim === 0 ? 0 : 3;
      ctx.fillRect(ex + 6, ey + eh - 4, 4, 4 + legOff);
      ctx.fillRect(ex + ew - 10, ey + eh - 4, 4, 4 - legOff + 3);
      
      ctx.restore();
      
    } else if (enemy.type === 1) {
      // === MEDIUM — żółty kosmita ze skrzydłami ===
      ctx.save();
      ctx.shadowColor = '#ffff00';
      ctx.shadowBlur = 4;
      
      // Ciało
      const medGrad = ctx.createLinearGradient(ex, ey, ex, ey + eh);
      medGrad.addColorStop(0, '#ffee00');
      medGrad.addColorStop(1, '#ccaa00');
      ctx.fillStyle = medGrad;
      ctx.fillRect(ex + 5, ey + 3, ew - 10, eh - 6);
      
      // Skrzydła (animowane — otwieranie/zamykanie)
      const wingExt = anim === 0 ? 4 : 0;
      ctx.fillStyle = '#ffcc00';
      // Lewe skrzydło
      ctx.beginPath();
      ctx.moveTo(ex + 5, ey + 6);
      ctx.lineTo(ex - wingExt, ey + 3);
      ctx.lineTo(ex - wingExt, ey + eh - 8);
      ctx.lineTo(ex + 5, ey + eh - 6);
      ctx.fill();
      // Prawe skrzydło
      ctx.beginPath();
      ctx.moveTo(ex + ew - 5, ey + 6);
      ctx.lineTo(ex + ew + wingExt, ey + 3);
      ctx.lineTo(ex + ew + wingExt, ey + eh - 8);
      ctx.lineTo(ex + ew - 5, ey + eh - 6);
      ctx.fill();
      
      // Oczy
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(ecx - 6, ecy - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ecx + 6, ecy - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      // Białe odbicia
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ecx - 5, ecy - 3, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ecx + 7, ecy - 3, 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
    } else {
      // === BASIC — zielony kosmita z antenami ===
      ctx.save();
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 3;
      
      // Ciało (zaokrąglone)
      const basGrad = ctx.createLinearGradient(ex, ey, ex, ey + eh);
      basGrad.addColorStop(0, '#00ee44');
      basGrad.addColorStop(1, '#008822');
      ctx.fillStyle = basGrad;
      ctx.beginPath();
      ctx.ellipse(ecx, ecy + 2, ew / 2 - 2, eh / 2 - 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Anteny
      ctx.strokeStyle = '#00cc33';
      ctx.lineWidth = 2;
      const antWiggle = anim === 0 ? -2 : 2;
      ctx.beginPath();
      ctx.moveTo(ecx - 6, ey + 4);
      ctx.lineTo(ecx - 10 + antWiggle, ey - 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ecx + 6, ey + 4);
      ctx.lineTo(ecx + 10 - antWiggle, ey - 5);
      ctx.stroke();
      // Kulki na antenach
      ctx.fillStyle = '#88ff88';
      ctx.beginPath();
      ctx.arc(ecx - 10 + antWiggle, ey - 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ecx + 10 - antWiggle, ey - 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Oczy
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ecx - 5, ecy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ecx + 5, ecy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#003300';
      ctx.beginPath();
      ctx.arc(ecx - 4, ecy + 1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ecx + 6, ecy + 1, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Nóżki
      ctx.fillStyle = '#00aa33';
      const legAnim = anim === 0 ? 2 : -1;
      ctx.fillRect(ecx - 8, ey + eh - 3, 3, 4 + legAnim);
      ctx.fillRect(ecx + 5, ey + eh - 3, 3, 4 - legAnim + 1);
      
      ctx.restore();
    }
  });
  
  // Pociski gracza — laserowe z poświatą
  invadersGame.bullets.forEach(b => {
    ctx.save();
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    // Rdzeń lasera (biały)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.x + 0.5, b.y, b.width - 1, b.height);
    // Otoczka (cyan)
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(b.x - 1, b.y, 1, b.height);
    ctx.fillRect(b.x + b.width, b.y, 1, b.height);
    ctx.restore();
  });
  
  // Pociski wrogów — czerwone plazmy
  invadersGame.enemyBullets.forEach(b => {
    ctx.save();
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 8;
    // Plazma
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.ellipse(b.x + b.width / 2, b.y + b.height / 2, b.width / 2 + 1, b.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.ellipse(b.x + b.width / 2, b.y + b.height / 2, b.width / 4, b.height / 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  
  // Cząsteczki
  invadersGame.particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1.0;
  
  // Czerwony błysk ekranu po oberwaniu
  if (invadersGame.shakeAmount > 4 && !invadersGame.gameOver) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, 600, 500);
  }
  
  // Game Over
  if (invadersGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, 600, 500);
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 15;
    ctx.fillText('GAME OVER', 300, 220);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.font = '25px Arial';
    ctx.fillText(`Wynik: ${invadersGame.score}`, 300, 265);
    ctx.fillStyle = '#aaa';
    ctx.font = '16px Arial';
    ctx.fillText('Kliknij RESTART aby spróbować ponownie', 300, 300);
  }
  
  ctx.restore();
}

function resetInvaders() {
  gameStateManager.resetGame();
  initInvaders();
}
