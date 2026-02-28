# Gaming Hub - Historia Wersji

## v0.00
- Stworzenie podstawy strony + dodatkowe gry

## v0.10
### Core/UX
- Dodany licznik startowy 3-2-1 (overlay "GO!") przed rozpoczęciem każdej gry
- Przełącznik dźwięku w nagłówku (🔊/🔇)
- Subtelne wibracje na urządzeniach mobilnych przy punktach/trafieniach
- Lepsze zarządzanie pętlami gier (czyszczenie setInterval przy zmianie/wyjściu z gry)
- Usprawnione i stabilne cząsteczki tła

### Audio
- Wbudowany silnik SFX (WebAudio) – bez plików audio
- Odblokowanie AudioContext po pierwszej interakcji użytkownika

### Poprawki błędów i stabilność
- Rozdzielenie kodu na index.html, style.css, javascript.js
- Naprawione losowe crashy przy generowaniu jedzenia
- Zapobieganie domyślnej akcji spacji
- Ujednolicone nasłuchiwanie klawiatury

### Gry
**Snake (Quantum Snake)**
- Blokada zawracania o 180°
- Jedzenie generowane na siatce
- Czytelny licznik "Energia" i reset gry

**Pong (Cyber Pong)**
- Kolizje liczone z promieniem piłki
- Odbicie zależne od miejsca trafienia w paletkę
- Reset piłki na środek z losowym kierunkiem

**Breakout (Neo Breakout)**
- Siatka klocków z odstępami
- Kolizje z uwzględnieniem promienia piłki
- 3 życia, komunikaty wygranej/przegranej

**Asteroids (Deep Space)**
- Tarcza bezwładności, pełny wrap-around
- Kolizje pocisk–asteroida
- Reset statku po zderzeniu, 3 życia

## v0.15
### Clean Code Implementation
- **Single Responsibility Principle** - gameStateManager
- **DRY Principle** - centralny soundManager
- **Input Validation** - bezpieczna obsługa wejścia

### Refaktoryzacja kodu
- Wzorzec modułowy
- Opisowe nazwy zmiennych i funkcji
- Krótkie, skoncentrowane funkcje
- Separation of concerns

### Usunięte elementy
- Całkowite usunięcie gry Deep Space (Asteroids)
- Zmniejszenie rozmiaru kodu o ~25%

### Optymalizacja
- Zmniejszenie liczby gier z 4 do 3
- Uproszczenie struktury HTML
- Czystszy grid layout dla 3 gier

## v0.20
### Clean Code Implementation
- **Composition over Inheritance** - GameComponent
- **Open/Closed Principle** - system pluginów
- gameObjectFactory do tworzenia obiektów gry

## v0.30
### Nowa Gra: Quantum Wordle
- Gra w odgadywanie słów w cyberpunkowym stylu
- 5-literowe słowa technologiczne
- System kolorowych podpowiedzi
- Wirtualna klawiatura
- 6 prób na odgadnięcie słowa

### System Poziomów Trudności
- **Snake**: 4 poziomy trudności
- **Pong**: 4 poziomy trudności
- Modal wyboru trudności

### System Statystyk i Postępu
- **statsManager** - kompleksowy system śledzenia postępów
- Zapisywanie w localStorage
- Statystyki dla każdej gry
- Modal statystyk

### System Poziomów w Breakout
- 10 predefiniowanych poziomów
- Różne typy cegieł (1-3 trafienia)
- Progresywnie zwiększająca się trudność

### Ulepszenia Kontroli
- Płynny ruch paletek w Pong i Breakout
- Ulepszona obsługa klawiatury dla Wordle

### System Powiadomień
- Powiadomienia o rekordach
- Animowane powiadomienia
- Automatyczne chowanie

### System Motywów
- **themeManager** - przełączanie motywów
- Zapisywanie preferencji

## v0.35 - Major Graphics & Gameplay Improvements

### Quantum Snake - Remaster Grafiki
- Realistyczna grafika węża z oczami
- Gradientowe kolory ciała
- Animowane oczy zmieniające się z kierunkiem
- Ulepszone jedzenie - jabłko z blaskiem

### Cyber Pong - Zaawansowane AI
- Inteligentne AI przewidujące trajektorię
- Gradientowe paletki
- Piłka z efektem świecenia
- Poprawione kolizje i fizyka

### Quantum Wordle - Tryby Wielopoziomowe
- 3 Tryby gry: 3, 4, 5-literowe
- Rozszerzona lista słów (200+)
- Polskie znaki diakrytyczne
- Dynamiczna klawiatura

### Ogólne Ulepszenia
- Ulepszony system wyboru trybów
- Poprawiona fizyka gier
- Optymalizacja wydajności

## v0.50 - Kompletna Platforma Gamingowa

### Nowy Profesjonalny Interfejs
- Top Navigation Bar z XP widgetem
- Sidebar Menu z nawigacją
- Game Library Grid z okładkami gradientowymi
- System Modal Windows

### Zaawansowany System Profilu
- Player XP System - poziomowanie
- XP Bar z wizualnym postępem
- Level Rewards - nagrody co 5 poziomów
- Player Stats - szczegółowe statystyki

### Rozszerzona Biblioteka Gier (9 GIER)
**Nowe Gry:**
1. 🎵 Simon Says - gra pamięciowa
2. 🦆 Duck Hunt - zręcznościowa z kaczką
3. 🍄 Mini Mario - platformówka
4. 🏎️ Speed Racer - wyścigowa
5. 🟦 Tetris - logiczna z klockami
6. 🧱 Breakout - rozbijanie cegieł

### System Ekonomii i Nagród
**Sklep (Shop System)**
- Awatary do odblokowania
- Ramki profilu
- Power-upy (2x XP, dodatkowe życia)
- System monet

**System Osiągnięć**
- Achievements dla każdej gry
- Odblokowywanie osiągnięć
- System powiadomień

### System Wyzwań i Celów
**Daily Challenges**
- Codzienne wyzwania
- System streak
- Nagrody XP
- Automatyczna rotacja

**Level Rewards System**
- Nagrody co 5 poziomów
- Progresywny system nagród
- Automatyczne odblokowywanie

### Zaawansowany System Dźwięku
- SoundSystem z syntezą dźwięku
- Beep generator
- Melody system
- Volume control

### System Pauzy i Zarządzania
- Pause Menu z opcjami
- Pause Overlay ze statystykami
- Game State Management

### Ulepszenia Techniczne
- Responsywny Design
- Performance Optimization
- Memory Management
- Cross-browser Compatibility

### Integracja Systemów
- Wszystkie gry zintegrowane z systemem XP
- Spójny system kontroli
- Unified scoring system
- Cross-game progression


## v0.55 - Debugowanie i Optymalizacja Systemu

### Proces Debugowania
- Chrome DevTools – wybór debuggera z możliwością ustawiania breakpointów i śledzenia zmiennych
- Reprodukcja błędu – odblokowanie osiągnięcia w grze Snake – powiadomienie pojawia się, ale pasek XP pozostaje bez zmian
- Wyizolowanie źródła – zlokalizowanie funkcji checkAchievements odpowiedzialnej za przyznawanie nagród
- Identyfikacja przyczyny – brak wywołania levelSystem.addXP(50)  w momencie odblokowania osiągnięcia
- Usunięcie defektu – dodanie brakującej linii kodu z wartością 50 punktów XP
- Weryfikacja naprawy – ponowne odblokowanie osiągnięcia – pasek XP prawidłowo wzrasta
- Uzupełnienie dokumentacji – opisanie procesu w pliku README

### System Osiągnięć (Achievements)
- Naprawa błędu – gracz otrzymuje teraz 50 punktów XP za każde odblokowane osiągnięcie
- Poprawa responsywności – system nagród działa zgodnie z założeniami


## v0.60 - ROZDZIELENIE GIER

### Rozdzielenie gier
- rozdzieliłem wszystkie gry do osobnych plików, aby łatwiej mógłbym je edytować