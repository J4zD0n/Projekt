/**
 * SYSTEM TESTOWY DLA PROJEKTU PROJOP
 * v1.1 - Poprawiona stabilność
 */

const resultsList = document.getElementById('resultsList');
const totalTestsEl = document.getElementById('totalTests');
const passedTestsEl = document.getElementById('passedTests');
const failedTestsEl = document.getElementById('failedTests');

let total = 0;
let passed = 0;
let failed = 0;

function addResult(name, desc, isPass, error = null) {
    total++;
    if (isPass) passed++; else failed++;

    const li = document.createElement('li');
    li.className = 'test-item';
    li.innerHTML = `
        <div class="status-badge ${isPass ? 'status-pass' : 'status-fail'}">${isPass ? '✓' : '✗'}</div>
        <div class="test-info">
            <span class="test-name">${name}</span>
            <span class="test-desc">${desc}</span>
            ${error ? `<div style="color: var(--error); font-size: 0.8rem; margin-top: 5px;">Szczegóły: ${error}</div>` : ''}
        </div>
        <div class="test-meta">${performance.now().toFixed(1)}ms</div>
    `;
    resultsList.appendChild(li);
    updateStats();
}

function updateStats() {
    if (totalTestsEl) totalTestsEl.textContent = total;
    if (passedTestsEl) passedTestsEl.textContent = passed;
    if (failedTestsEl) failedTestsEl.textContent = failed;
}

const assert = {
    equal: (actual, expected, name, desc) => {
        if (actual === expected) {
            addResult(name, desc, true);
        } else {
            addResult(name, desc, false, `Oczekiwano ${expected}, otrzymano ${actual}`);
        }
    },
    isTrue: (value, name, desc) => {
        if (value) {
            addResult(name, desc, true);
        } else {
            addResult(name, desc, false, `Warunek nie został spełniony`);
        }
    },
    exists: (val, name, desc) => {
        if (val !== undefined && val !== null) {
            addResult(name, desc, true);
        } else {
            addResult(name, desc, false, `Obiekt nie istnieje`);
        }
    }
};

async function runTests() {
    resultsList.innerHTML = '';
    total = 0; passed = 0; failed = 0;
    updateStats();

    // 1. Testy środowiska
    assert.exists(window.gameStateManager, "System: State Manager", "Sprawdzenie czy manager stanu jest dostępny");
    assert.exists(window.difficultyConfig, "System: Konfiguracja", "Sprawdzenie dostępności poziomów trudności");

    // 2. Testy PONG
    try {
        if (typeof initPong === 'function') {
            initPong();
            assert.exists(pongGame, "Pong: Inicjalizacja", "Obiekt pongGame powinien zostać stworzony");
            assert.equal(pongGame.ball.x, 300, "Pong: Pozycja piłki", "Piłka powinna zacząć na X=300");
            
            // Test ruchu paletki
            const oldY = pongGame.player.y;
            window.inputHandler.keys['down'] = true;
            updatePong();
            window.inputHandler.keys['down'] = false;
            assert.isTrue(pongGame.player.y > oldY, "Pong: Mechanika ruchu", "Paletka gracza powinna przesunąć się w dół");

            // TEST CELOWO ZAWODZĄCY (pokazujący brak poprawki)
            pongGame.ball.x = 25;
            pongGame.ball.dx = -4;
            updatePong();
            assert.equal(pongGame.ball.x, 26, "Pong: Precyzja kolizji", "Piłka powinna zostać wypchnięta poza paletkę (Anti-Tunnelling)");
        } else {
            addResult("Pong", "Funkcja initPong nie została znaleziona", false);
        }
    } catch (e) {
        addResult("Pong: Błąd", "Błąd wykonania testu Pong", false, e.message);
    }

    // 3. Testy SNAKE
    try {
        if (typeof initSnake === 'function') {
            initSnake();
            assert.exists(snakeGame, "Snake: Inicjalizacja", "Obiekt snakeGame powinien zostać stworzony");
            assert.isTrue(snakeGame.snake.length > 0, "Snake: Struktura", "Wąż powinien posiadać segmenty na starcie");
            
            // Test kierunku
            assert.exists(snakeGame.direction, "Snake: Kierunek", "Wąż powinien mieć określony kierunek ruchu");
        } else {
            addResult("Snake", "Funkcja initSnake nie została znaleziona", false);
        }
    } catch (e) {
        addResult("Snake: Błąd", "Błąd wykonania testu Snake", false, e.message);
    }

    // 4. Testy Systemu XP (Integracja)
    try {
        const startXP = window.levelSystem.xp;
        window.levelSystem.addXP(50);
        assert.equal(window.levelSystem.xp, startXP + 50, "System XP: Dodawanie", "Punkty XP powinny zostać poprawnie dodane");
    } catch (e) {
        addResult("System XP: Błąd", "Błąd testu integracji XP", false, e.message);
    }
}

window.addEventListener('load', () => {
    setTimeout(runTests, 200);
});
