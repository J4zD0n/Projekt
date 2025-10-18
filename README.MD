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
- Clean Code Implementation
  - Composition over Inheritance:
    - Klasa GameComponent jako bazowy komponent
    - gameObjectFactory do tworzenia różnych typów obiektów (piłka, paletka, cegła, segment węża)
    - Kompozycja zachowań zamiast dziedziczenia
  - Open/Closed Principle:
    - gamePluginSystem - system pluginów rozszerzający funkcjonalność
    - System hooków pozwalający na modyfikację zachowania bez zmiany kodu
    - Przykładowe pluginy: scoreMultiplierPlugin (combo system) i particleEffectsPlugin (efekty cząsteczkowe)

  **v0.30** 
- **Nowa Gra: Quantum Wordle**
  - Klasyczna gra w odgadywanie słów w cyberpunkowym stylu
  - 5-literowe słowa z polskiej listy słów technologicznych
  - System kolorowych podpowiedzi (zielony - poprawna litera w dobrym miejscu, żółty - poprawna litera w złym miejscu, szary - brak litery)
  - Wirtualna klawiatura z wizualną informacją o użytych literach
  - 6 prób na odgadnięcie słowa
  - System zapamiętywania użytych słów (localStorage)

- **System Poziomów Trudności**
  - **Snake**: 4 poziomy trudności (Łatwy, Średni, Trudny, Ekspert)
    - Różne prędkości węża i mnożniki punktów
  - **Pong**: 4 poziomy trudności (Łatwy, Średni, Trudny, Ekspert)
    - Różne prędkości piłki, AI i gracza
  - Modal wyboru trudności przed rozpoczęciem gry

- **System Statystyk i Postępu**
  - **statsManager** - kompleksowy system śledzenia postępów
  - Zapisywanie najlepszych wyników w localStorage
  - Statystyki dla każdej gry:
    - Snake: najlepszy wynik, liczba rozegranych gier
    - Pong: najlepszy wynik, liczba rozegranych gier  
    - Breakout: najwyższy poziom, najlepszy wynik, liczba rozegranych gier
    - Wordle: liczba rozwiązanych gier, aktualna seria wygranych
  - Modal statystyk dostępny z paska narzędzi

- **System Poziomów w Breakout**
  - 10 predefiniowanych poziomów z unikalnymi układami cegieł
  - Różne typy cegieł (1-3 trafienia do zniszczenia)
  - Progresywnie zwiększająca się trudność
  - System ukończenia poziomów z animacjami
  - Automatyczne przejście do następnego poziomu

- **Ulepszenia Kontroli**
  - **Płynny ruch paletek** w Pong i Breakout (przytrzymanie klawiszy)
  - Ulepszona obsługa klawiatury dla Wordle
  - Lepsza responsywność kontroli

- **System Powiadomień**
  - Wyświetlanie powiadomień o rekordach, ukończonych poziomach
  - Animowane powiadomienia w prawym górnym rogu
  - Automatyczne chowanie po 3 sekundach

- **System Motywów**
  - **themeManager** - przełączanie między motywem ciemnym i jasnym
  - Zapisywanie preferencji w localStorage
  - Pełna stylizacja jasnego motywu

- **Ulepszenia Wizualne**
  - Animacja pulsowania tytułu
  - Badge poziomu trudności w grze
  - Badge aktualnego poziomu w Breakout
  - Ulepszone karty gier z wyświetlaczem statystyk
  - Animacje ukończenia poziomów w Breakout

- **Usunięte Elementy**
  - **Całkowite usunięcie systemu dźwięków** (soundManager) - tymczasowo wyłączone
  - **Usunięcie systemu pluginów** - zastąpione bezpośrednią implementacją funkcjonalności
  - **Usunięcie fabryki obiektów** - uproszczenie kodu gier

- **Optymalizacje**
  - Uproszczona architektura gier
  - Lepsze zarządzanie pamięcią
  - Zmniejszenie złożoności kodu
  - Szybsze ładowanie gier

- **Stabilność**
  - Lepsza obsługa błędów
  - Zabezpieczenie przed duplikacją event listenerów
  - Poprawione czyszczenie interwałów
  - Lepsze zarządzanie stanem gier

**v0.35** - **Major Graphics & Gameplay Improvements**

### 🐍 Quantum Snake - Kompletny Remaster Grafiki
- **Realistyczna grafika węża:**
  - Głowa węża z oczami i źrenicami
  - Gradientowe kolory ciała węża (ciemniejące ku ogonowi)
  - Płynne, okrągłe segmenty zamiast kwadratowych
  - Animowane oczy zmieniające się z kierunkiem ruchu
- **Ulepszone jedzenie:**
  - Realistyczne jabłko z blaskiem i liściem
  - Efekty świetlne i gradienty
- **Poprawiony Game Over screen:**
  - Półprzezroczyste tło
  - Wyświetlanie końcowego wyniku

### 🏓 Cyber Pong - Zaawansowane AI i Efekty Wizualne
- **Inteligentne AI:**
  - Przewidywanie trajektorii piłki z uwzględnieniem odbić od ścian
  - Płynny ruch do przewidywanej pozycji
  - Różne zachowania w zależności od kierunku piłki
- **Efekty wizualne:**
  - Gradientowe paletki (zielony dla gracza, czerwony dla AI)
  - Piłka z efektem świecenia i podwójnym promieniem
  - Poprawione kolizje i fizyka odbić
- **Optymalizacja ruchu:**
  - Płynniejsze sterowanie paletką
  - Poprawione ograniczenia ruchu

### 🔤 Quantum Wordle - Tryby Wielopoziomowe
- **3 Tryby gry:**
  - **3-literowy** (łatwy) - 4 próby, polskie słowa + podstawowe angielskie
  - **4-literowy** (średni) - 5 prób, mieszane słowa polsko-angielskie  
  - **5-literowy** (trudny) - 6 prób, zaawansowane słowa technologiczne
- **Rozszerzona lista słów:**
  - 200+ słów podzielonych na kategorie długości
  - Polskie znaki diakrytyczne w trybach łatwiejszych
  - Słownictwo technologiczne i codzienne
- **Ulepszenia interfejsu:**
  - Dynamiczna klawiatura z polskimi znakami
  - Automatyczne dostosowanie liczby prób
  - CSS variables dla responsywności
- **System walidacji:**
  - Sprawdzanie czy słowo istnieje w słowniku
  - Animacja trzęsienia dla nieprawidłowych słów
  - Komunikaty ostrzegawcze

### 🎮 Ogólne Ulepszenia Systemowe
- **Ulepszony system wyboru trybów:**
  - Modal wyboru długości słowa dla Wordle
  - Automatyczne przełączanie między trybami
- **Poprawiona fizyka gier:**
  - Dokładniejsze kolizje w Pong
  - Lepsze odbicia od ścian i paletek
  - Poprawione przewidywanie ruchu AI
- **Optymalizacja wydajności:**
  - Lepsze zarządzanie pamięcią
  - Zmniejszone zużycie CPU
  - Płynniejsze animacje

### 🐛 Poprawki Błędów
- **Snake:**
  - Poprawiona grafika głowy i oczu
  - Lepsze wykrywanie kolizji
- **Pong:**
  - Naprawione AI (teraz właściwie przewiduje ruch piłki)
  - Poprawione odbicia od krawędzi
  - Lepsze ograniczenia ruchu paletek
- **Wordle:**
  - Naprawiona walidacja słów
  - Poprawione animacje klawiatury
  - Lepsze zarządzanie stanem gry

### 📊 Statystyki i Postęp
- **Rozszerzony system statystyk:**
  - Oddzielne śledzenie dla każdego trybu Wordle
  - Lepsze powiadomienia o rekordach
  - Ulepszone zapisywanie w localStorage

### 🎨 Doświadczenie Użytkownika
- **Płynniejsze przejścia:**
  - Lepsze animacje między stanami gry
  - Poprawione timingi
- **Responsywność:**
  - Lepsze dostosowanie do różnych rozdzielczości
  - Optymalizacja mobilna



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