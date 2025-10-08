# 🌟 GAMING HUB 🌟
## Wersyfikacja
**v0.00** : 
- stworzenie podstawy strony + dodatkowe gry

**v0.10** : 
- Core/UX
  - Dodany licznik startowy 3–2–1 (overlay “GO!”) przed rozpoczęciem każdej gry
  - Przełącznik dźwięku w nagłówku (🔊/🔇)
  - Subtelne wibracje na urządzeniach mobilnych przy punktach/trafieniach
  - Lepsze zarządzanie pętlami gier (czyszczenie setInterval przy zmianie/wyjściu z gry)
  - Usprawnione i stabilne cząsteczki tła (czyszczenie kontenera, stała liczba, losowe opóźnienia) 
- Audio
  - Wbudowany silnik SFX (WebAudio) – bez plików audio: click, pickup, hit, bounce, score, lose, shoot, explode, win
  - Odblokowanie AudioContext po pierwszej interakcji użytkownika (wymóg przeglądarek)
- Poprawki błędów i stabilność
  - Usunięto przypadkowe mieszanie JS w CSS; rozdzielenie na index.html, style.css, javascript.js
  - generateFood nie wywołuje się już przy starcie strony (tylko po init Snake) – koniec losowych crashy
  - Zapobieganie domyślnej akcji spacji (scroll) w Asteroids
  - Ujednolicone nasłuchiwanie klawiatury (normalizacja klawiszy, toLowerCase)
- Snake (Quantum Snake)
  - Blokada zawracania o 180° (nie można wejść głową w drugi segment)
  - Jedzenie generowane na siatce, z pominięciem pozycji węża
  - Czytelny licznik “Energia” i reset gry
- Pong (Cyber Pong)
  - Kolizje liczone z promieniem piłki (dokładniejsze odbicia od ścian i paletek)
  - Odbicie zależne od miejsca trafienia w paletkę (kontrola kąta lotu)
  - Reset piłki na środek z losowym kierunkiem po zdobyciu punktu
  - Linia przerywana na środku, stabilizacja ruchu AI i ograniczenia ruchu paletek
- Breakout (Neo Breakout)
  - Siatka klocków z odstępami; dynamiczne kolory (HSL)
  - Kolizje z uwzględnieniem promienia piłki + “spin” po trafieniu paletki
  - 3 życia, komunikaty wygranej/przegranej, aktualizacja wyniku “Hack Points”
- Asteroids (Deep Space)
  - Tarcza bezwładności (tarcie 0.99), pełny wrap-around statku i pocisków
  - Kolizje pocisk–asteroida, przyrost punktów, dźwięki trafień/eksplozji
  - Reset statku po zderzeniu, 3 życia, automatyczne dorzucanie asteroid gdy zostanie ich zbyt mało
- Dodatkowo
  - Wariant “all-in-one” (jeden plik index.html) jako fallback do szybkiego uruchomienia lokalnie
  - Uporządkowane funkcje globalne dla onclick (reset/return to menu), spójne nazewnictwo zmiennych i funkcji
  
**v0.15** :
- Clean Code Implementation
  - **Metoda 1: Single Responsibility Principle (gameStateManager)**
    - Obiekt zarządzający stanem gry z jasno określonymi odpowiedzialnościami
    - Metody: changeState(), handleStateTransition(), cleanupCurrentGame(), showMainMenu(), hideMenus()
    - Każda funkcja ma jedną, konkretną odpowiedzialność
    - Guard clauses dla wczesnego wyjścia z funkcji
  - **Metoda 2: DRY - Don't Repeat Yourself (soundManager)**
    - Centralna obsługa wszystkich dźwięków w aplikacji
    - Eliminacja duplikacji kodu audio poprzez wspólną konfigurację soundConfigs
    - Lazy loading AudioContext - inicjalizacja tylko gdy potrzebna
    - Uniwersalna metoda play() obsługująca wszystkie dźwięki
    - Metoda toggleMute() z automatyczną aktualizacją UI
  - **Metoda 3: Input Validation & Sanitization (inputHandler)**
    - Bezpieczna obsługa wejścia użytkownika z walidacją
    - Sanityzacja klawiszy - usuwanie niebezpiecznych znaków
    - Normalizacja klawiszy do akcji (keyMap)
    - Zarządzanie stanem aktywnych klawiszy (activeKeys Set)
    - Metoda shouldPreventDefault() zapobiegająca domyślnym akcjom przeglądarki
- Refaktoryzacja kodu
  - Zastosowanie wzorca modułowego dla lepszej organizacji kodu
  - Meaningful names - opisowe nazwy zmiennych i funkcji
  - Small functions - krótkie, skoncentrowane funkcje
  - Early returns (guard clauses) dla lepszej czytelności
  - Separation of concerns - oddzielenie logiki walidacji, dźwięku i stanu gry
- Usunięte elementy
  - **Całkowite usunięcie gry Deep Space (Asteroids)**
    - Usunięta karta gry z menu głównego
    - Usunięty obszar gry asteroidsGame z HTML
    - Usunięte wszystkie funkcje: initAsteroids(), updateAsteroids(), drawAsteroids(), resetAsteroids(), shoot()
    - Usunięte kontrolki dla Asteroids z event listenerów
    - Zmniejszenie rozmiaru kodu o ~25%
- Optymalizacja
  - Zmniejszenie liczby gier z 4 do 3 dla lepszej wydajności
  - Uproszczenie struktury HTML - mniej elementów DOM
  - Czystszy grid layout dla 3 gier (lepsze responsywne skalowanie)
  - Redukcja złożoności event listenerów
- Stabilność i bezpieczeństwo
  - Walidacja wszystkich inputów przed przetworzeniem
  - Bezpieczne czyszczenie game loop przy zmianie gry
  - Ochrona przed XSS poprzez sanityzację klawiszy
  - Kontrolowane zarządzanie pamięcią (clearAll() dla inputHandler)
- Dodatkowo
  - Lepsza integracja trzech pozostałych gier z nowymi systemami
  - Wszystkie gry korzystają teraz z centralnego soundManager
  - Ujednolicona obsługa klawiszy przez inputHandler
  - Spójne zarządzanie stanami przez gameStateManager

**v0.20**
- Composition over Inheritance:
  - Klasa GameComponent jako bazowy komponent
  - gameObjectFactory do tworzenia różnych typów obiektów (piłka, paletka, cegła, segment węża)
  - Kompozycja zachowań zamiast dziedziczenia
- Open/Closed Principle:
  - gamePluginSystem - system pluginów rozszerzający funkcjonalność
  - System hooków pozwalający na modyfikację zachowania bez zmiany kodu
  - Przykładowe pluginy: scoreMultiplierPlugin (combo system) i particleEffectsPlugin (efekty cząsteczkowe)
  
## Opis aplikacji

**Gaming Universe** to interaktywna aplikacja webowa zawierająca kolekcję czterech klasycznych gier arkadowych w nowoczesnej, cyberpunkowej oprawie wizualnej. Aplikacja została stworzona jako rozrywkowa platforma do gier retro z futurystycznym designem.

## Cel aplikacji

Głównym celem aplikacji jest:
- Dostarczenie rozrywki poprzez klasyczne gry arkadowe
- Przedstawienie retro-gamingu w nowoczesnej, atrakcyjnej wizualnie formie
- Umożliwienie użytkownikom zabawy z dobrze znanymi mechanikami gier w jednym miejscu
- Demonstracja możliwości technologii webowych (HTML5 Canvas, CSS3, JavaScript)

## Jak działa aplikacja

### Architektura
Aplikacja składa się z trzech głównych plików:
- **index.html** - struktura i interfejs użytkownika
- **style.css** - stylizacja i animacje wizualne
- **javascript.js** - logika gier i interakcje

### Zasada działania
1. **Menu główne** - użytkownik widzi grid z kartami gier do wyboru
2. **Wybór gry** - kliknięcie przycisku uruchamia wybraną grę
3. **Rozgrywka** - gra działa w czasie rzeczywistym z pętlą aktualizacji
4. **Powrót** - użytkownik może wrócić do menu głównego w dowolnym momencie

### Dostępne gry
- **🐍 Quantum Snake** - klasyczny wąż z elementami energii
- **🏓 Cyber Pong** - retro tenis w holograficznej wersji  
- **🧱 Neo Breakout** - rozbijanie bloków cyber-paletką
- **🚀 Deep Space** - strzelanka w kosmosie z asteroidami

## Mechanizm interakcji z użytkownikiem

### Nawigacja w menu
- **Wybór gry**: Kliknięcie przycisku "Rozpocznij Misję" na karcie gry
- **Efekty wizualne**: Karty reagują na hover z animacjami shimmer i podświetleniem
- **Floating particles**: Animowane cząsteczki w tle dla atmosfery

### Sterowanie w grach

#### 🐍 Quantum Snake
- **Klawisze**: Strzałki lub WASD
- **Cel**: Zbieranie jedzenia i unikanie kolizji
- **Punktacja**: +10 punktów za każde jedzenie

#### 🏓 Cyber Pong  
- **Klawisze**: Strzałki góra/dół lub W/S
- **Cel**: Odbijanie piłki i zdobywanie punktów
- **Przeciwnik**: AI steruje prawą paletką

#### 🧱 Neo Breakout
- **Klawisze**: Strzałki lewo/prawo lub A/D  
- **Cel**: Zniszczenie wszystkich bloków
- **Życia**: 3 próby, punkty za każdy zniszczony blok

#### 🚀 Deep Space
- **Sterowanie**: 
  - Strzałki lewo/prawo - obrót statku
  - Strzałka góra - przyspieszenie
  - Spacja - strzał
- **Cel**: Zniszczenie asteroid i przetrwanie
- **Życia**: 3 statki

### Interfejs gry
- **Wyświetlacz punktów**: Pokazuje aktualny wynik i pozostałe życia
- **Przyciski kontrolne**: Reset gry i powrót do menu
- **Canvas**: Obszar gry z renderowaniem w czasie rzeczywistym
- **Instrukcje**: Opis sterowania dla każdej gry

### Responsywność
- **Grid layout**: Automatyczne dopasowanie kart do szerokości ekranu
- **Hover effects**: Interaktywne animacje przy najechaniu myszą
- **Keyboard controls**: Pełna obsługa klawiatury dla wszystkich gier

### Cykl użytkowania
1. **Start** → Ładowanie menu głównego z efektami wizualnymi
2. **Wybór** → Kliknięcie karty gry i przejście do rozgrywki  
3. **Gra** → Sterowanie postacią/obiektem za pomocą klawiatury
4. **Koniec** → Game Over lub wygrana z możliwością restartu
5. **Powrót** → Wyjście do menu głównego i wybór innej gry

Aplikacja zapewnia płynne przejścia między stanami, intuicyjną obsługę i atrakcyjną prezentację wizualną inspirowaną estetyką cyberpunk i retro-futuryzmu.