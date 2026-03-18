// ===== WORDLE WORDS =====
const wordleWords = {
  4: [
    'MAMA', 'TATA', 'DOMU', 'KOTA', 'PSA', 'LASU', 'WODY', 'NOCY', 'DNIA',
    'RĘKA', 'GŁOW', 'STÓŁ', 'KRZES', 'ŁÓŻK', 'OKNO', 'DRZWI', 'ŚCIAN', 'PODŁ',
    'KOCI', 'PSIE', 'MYSZ', 'PTAK', 'RYBA', 'KWIA', 'DRZEW', 'TRAW', 'KAMI',
    'SŁOŃ', 'CHMU', 'DESZ', 'ŚNIE', 'WIAT', 'OGIE', 'ZIEM', 'NIEB', 'GWIA',
    'KSIĘ', 'SŁOŃ', 'ZIEM', 'WODA', 'OGIE', 'POWI', 'CIEP', 'ZIMN', 'GORĄ',
    'SUCH', 'MOKR', 'CZYS', 'BRUD', 'DUŻY', 'MAŁY', 'WYSZ', 'NISK', 'SZYB',
    'WOLN', 'MOCN', 'SŁAB', 'CIĘŻ', 'LEKK', 'STAR', 'NOWY', 'DOBR', 'ZŁY',
    'PIĘK', 'BRZY', 'MĄDR', 'GŁUP', 'WCZE', 'PÓŹN', 'BLIS', 'DALE', 'PRAW',
    'LEWY', 'GÓRN', 'DOLN', 'PRZE', 'ZA', 'POD', 'NAD', 'PRZY', 'BEZ', 'DLA'
  ],
  5: [
    'DOMOW', 'KOTOW', 'PSÓW', 'LASÓW', 'WÓD', 'NOCY', 'DNIÓW', 'RĄK', 'GŁÓW',
    'STOŁÓW', 'KOTKA', 'PSIEC', 'MYSZY', 'PTAKI', 'RYBY', 'KWIAT', 'DRZEW',
    'TRAWY', 'KAMIE', 'SŁOŃC', 'CHMUR', 'DESZC', 'ŚNIEG', 'WIATR', 'OGNIA',
    'ZIEMI', 'NIEBA', 'GWIAZ', 'KSIĘŻ', 'WODA', 'POWIE', 'CIEPŁ', 'ZIMNO',
    'GORĄC', 'SUCHO', 'MOKRO', 'CZYST', 'BRUDN', 'DUŻE', 'MAŁE', 'WYSOK',
    'NISKI', 'SZYBK', 'WOLNY', 'MOCNY', 'SŁABY', 'CIĘŻK', 'LEKKI', 'STARY',
    'NOWE', 'DOBRE', 'ZŁE', 'PIĘKN', 'BRZYD', 'MĄDRE', 'GŁUPE', 'WCZES',
    'PÓŹNE', 'BLISK', 'DALKI', 'PRAWE', 'LEWE', 'GÓRNE', 'DOLNE', 'PRZEZ',
    'ABY', 'ALE', 'BO', 'BY', 'CO', 'CZY', 'DO', 'I', 'JAK', 'KTO', 'LUB',
    'MI', 'NA', 'NIE', 'NIŻ', 'OD', 'ORAZ', 'PO', 'POD', 'PRZED', 'PRZY',
    'TAK', 'TEŻ', 'TO', 'W', 'Z', 'ZA', 'ZE', 'AŻ', 'BARD', 'BARDZ', 'BO',
    'BOWI', 'CHOC', 'CHOĆ', 'CI', 'CIE', 'CIĘ', 'COŚ', 'CZAS', 'CZEMU',
    'CZĘS', 'DLA', 'DLAC', 'DLACZ', 'DLAT', 'DLATE', 'DOBR', 'DOBRE'
  ],
  6: [
    'DOMOWY', 'KOTOWY', 'PSIECZ', 'LASOWY', 'WODNY', 'NOCNY', 'DZIENN',
    'RĘCZNY', 'GŁOWNY', 'STOŁOW', 'KOCIEC', 'PSIECZ', 'MYSZYJ', 'PTASI',
    'RYBIE', 'KWIATN', 'DRZEWN', 'TRAWNY', 'KAMIEN', 'SŁONEC', 'CHMURN',
    'DESZCZ', 'ŚNIEGO', 'WIATRO', 'OGNIST', 'ZIEMNY', 'NIEBNY', 'GWIAZD',
    'KSIĘŻY', 'WODNY', 'POWIET', 'CIEPŁY', 'ZIMNY', 'GORĄCY', 'SUCHY',
    'MOKRY', 'CZYSTY', 'BRUDNY', 'DUŻY', 'MAŁY', 'WYSOKI', 'NISKI',
    'SZYBKI', 'WOLNY', 'MOCNY', 'SŁABY', 'CIĘŻKI', 'LEKKI', 'STARY',
    'NOWY', 'DOBRY', 'ZŁY', 'PIĘKNY', 'BRZYDK', 'MĄDRY', 'GŁUPI',
    'WCZESN', 'PÓŹNY', 'BLISKI', 'DALEKI', 'PRAWY', 'LEWY', 'GÓRNY',
    'DOLNY', 'PRZEZ', 'ABY', 'ALE', 'BO', 'BY', 'CO', 'CZY', 'DO', 'I',
    'JAK', 'KTO', 'LUB', 'MI', 'NA', 'NIE', 'NIŻ', 'OD', 'ORAZ', 'PO',
    'POD', 'PRZED', 'PRZY', 'TAK', 'TEŻ', 'TO', 'W', 'Z', 'ZA', 'ZE',
    'AŻ', 'BARDZ', 'BOWIEM', 'CHOĆ', 'CI', 'CIE', 'CIĘ', 'COŚ', 'CZAS',
    'CZEMU', 'CZĘSTO', 'DLA', 'DLACZE', 'DOBRZE', 'DOKŁAD', 'DOM', 'DOPI'
  ]
};

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
        button.setAttribute('data-key', key);
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
        // Animacja dodania literki
        tile.classList.remove('pop');
        void tile.offsetWidth; // trigger reflow
        tile.classList.add('pop');
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
  
  submitGuess() {
    if (this.currentTile !== this.currentWordLength) {
      showNotification(`Wpisz ${this.currentWordLength} liter!`);
      const row = document.getElementById(`wordleBoard`).children[this.currentRow];
      if (row) {
        row.classList.remove('shake');
        void row.offsetWidth; // triger reflow
        row.classList.add('shake');
      }
      return;
    }
    
    const guess = this.gameBoard[this.currentRow].join('').toUpperCase();
    const target = this.currentWord.toUpperCase();
    
    // SPRAWDZANIE PO LITERKACH (jak w prawdziwym Wordle)
    const result = this.checkWordle(guess, target);
    
    // Wyświetlanie wyników
    for (let i = 0; i < this.currentWordLength; i++) {
      const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
      if (tile) {
        setTimeout(() => {
          tile.classList.add(result[i]);
          
          // Aktualizacja klawiatury
          const key = document.querySelector(`[data-key="${guess[i]}"]`);
          if (key) {
            // Zachowaj najlepszy stan dla klawisza
            const currentClasses = key.className;
            if (result[i] === 'correct') {
              key.classList.remove('present', 'absent');
              key.classList.add('correct');
            } else if (result[i] === 'present' && !currentClasses.includes('correct')) {
              key.classList.remove('absent');
              key.classList.add('present');
            } else if (result[i] === 'absent' && 
                      !currentClasses.includes('correct') && 
                      !currentClasses.includes('present')) {
              key.classList.add('absent');
            }
          }
        }, i * 200);
      }
    }
    
    setTimeout(() => {
      if (guess === target) {
        this.gameActive = false;
        achievementsManager.checkAchievements('wordle', 1);
        levelSystem.addXP(50);
        dailyChallengeSystem.updateProgress('wordle', 1);
        soundSystem.play('achievement');
        showNotification('🎉 Brawo! Odgadłeś słowo!');
      } else if (this.currentRow === this.attempts - 1) {
        this.gameActive = false;
        showNotification(`Przegrana! Słowo: ${this.currentWord}`);
      } else {
        this.currentRow++;
        this.currentTile = 0;
      }
    }, this.currentWordLength * 200 + 300);
  },
  
  checkWordle(guess, target) {
    const result = new Array(this.currentWordLength).fill('absent');
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    
    // 1. Najpierw zaznaczamy poprawne (zielone)
    for (let i = 0; i < this.currentWordLength; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = 'correct';
        targetLetters[i] = null; // Usuwamy zużytą literę
        guessLetters[i] = null;
      }
    }
    
    // 2. Teraz zaznaczamy żółte (w złym miejscu)
    for (let i = 0; i < this.currentWordLength; i++) {
      if (guessLetters[i] === null) continue; // Już sprawdzone (zielone)
      
      const targetIndex = targetLetters.indexOf(guessLetters[i]);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetLetters[targetIndex] = null; // Usuwamy zużytą literę
      }
    }
    
    return result;
  },
  
  resetKeyboard() {
    document.querySelectorAll('.keyboard-key').forEach(key => {
      key.classList.remove('correct', 'present', 'absent');
    });
  },
  
  reset() {
    this.currentRow = 0;
    this.currentTile = 0;
    this.gameActive = true;
    
    document.querySelectorAll('.wordle-tile').forEach(tile => {
      tile.textContent = '';
      tile.className = 'wordle-tile';
    });
    
    this.resetKeyboard();
    this.selectNewWord();
    this.gameBoard = Array(this.attempts).fill().map(() => 
      Array(this.currentWordLength).fill(''));
  }
};

function resetWordle() {
  wordleGame.reset();
}