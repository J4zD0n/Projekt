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

## v0.70 - Kompletna Rewolucja Systemu Leveli i Sklepu

### Proces Rozwoju i Debugowania
- Analiza potrzeb – identyfikacja braku systemu progresji w grach Duck Hunt i Mario
- Projektowanie systemu poziomów – stworzenie architektury odblokowywania kolejnych etapów
- Implementacja Duck Hunt – dodanie 3 poziomów z progresywnie rosnącą trudnością
- Rozbudowa Mario – rozszerzenie z 3 do 5 unikalnych poziomów z własnymi parametrami
- Debugowanie sklepu – identyfikacja problemu z zakupami (monety znikały, ale przedmioty nie były odblokowywane)
- Identyfikacja przyczyny – brak inicjalizacji domyślnych przedmiotów i nieprawidłowa walidacja zakupów
- Usunięcie defektu – dodanie automatycznego odblokowywania domyślnych awatarów i ramek, poprawa logiki buyShopItem
- Weryfikacja naprawy – testowanie zakupów wszystkich przedmiotów – monety prawidłowo odejmowane, przedmioty odblokowywane
- Optymalizacja sterowania – dodanie mechanizmu `canJump` w Duck Hunt zapobiegającego podwójnym skokom
- Usprawnienie fizyki – implementacja `deltaTime` w Mario dla płynnych animacji niezależnie od klatek

### System Leveli w Grach
- Duck Hunt – dodanie 3 poziomów: "Pierwszy Lot" (5 rur), "Wyższy Lot" (8 rur), "Niebezpieczny Przelot" (12 rur)
- Mario – rozszerzenie do 5 poziomów: "Pierwsze kroki", "Skalna ścieżka", "Górska wspinaczka", "Nocna przygoda", "Ostatnie wyzwanie"
- System odblokowywania – postęp zapisywany w localStorage, odblokowywanie kolejnych poziomów po ukończeniu poprzednich
- Zróżnicowane parametry – każdy poziom posiada unikalne ustawienia (grawitacja, prędkość, liczba wrogów, limit czasu)

### Nowe Mechaniki w Mario
- System żyć – 3 życia z możliwością utraty i resetu pozycji
- Wrogowie – Goomby i Koopa Troopa z inteligentnym AI reagującym na krawędzie platform
- Timer – limit czasu dla każdego poziomu (90-180 sekund)
- Premie – dodatkowe punkty za pozostały czas i zebrane monety przy ukończeniu poziomu
- Skakanie po wrogach – implementacja mechaniki znanej z oryginalnego Mario

### System Ekonomii – Naprawa Sklepu
- Problem – zakupy nie działały poprawnie (monety znikały, przedmioty nie były odblokowywane)
- Przyczyna – brak inicjalizacji domyślnych przedmiotów i nieprawidłowa walidacja
- Rozwiązanie – dodanie automatycznego odblokowywania domyślnych awatarów ('👤') i ramek ('⬜')
- Poprawa logiki – walidacja istnienia przedmiotu i stanu posiadania przed zakupem
- Komunikaty zwrotne – dodanie powiadomień o sukcesie/porażce transakcji
- Odświeżanie widoku – automatyczne aktualizowanie sklepu po każdej transakcji

### Nowe Przedmioty w Sklepie
- Awatary – domyślny '👤', Smok (🐉), Rakieta (🚀), Czarodziej (🧙), Robot (🤖), Gwiazda (💫)
- Ramki – domyślna '⬜', Lśniąca (✨), Ognista (🔥), Diamentowa (💎), Celownicza (🎯)

### Interfejs Użytkownika
- Wybór poziomów – jednolity system dla Duck Hunt i Mario z wizualnym oznaczeniem odblokowanych/zablokowanych poziomów
- Ekrany ukończenia – Duck Hunt: zielony ekran z opcjami "Następny Poziom" i "Wybór Poziomu"; Mario: szczegółowe podsumowanie z przyciskami nawigacji
- HUD w grach – Duck Hunt: pasek postępu; Mario: panel z monetami, życiami, wynikiem, timerem

### Naprawione Błędy
- Sklep – zakupy działają poprawnie (monety odejmowane, przedmioty odblokowywane)
- Duck Hunt – eliminacja podwójnych skoków (mechanizm `canJump` z timeoutem 200ms)
- Mario – poprawa kolizji z wrogami (prawidłowe rozpoznawanie skoku na wroga)
- Mario – zapisywanie odblokowanych poziomów w localStorage
- Duck Hunt – kolory rur dostosowane do poziomu
- Mario – animowane monety i wrogowie
- Mario – nocne tło dla poziomu 4 z gwiazdami
- Inicjalizacja domyślnych przedmiotów w sklepie
- Walidacja stanu gry przed wykonaniem akcji
- Czyszczenie interwałów i animacji przy przejściach między poziomami

### System Postępu
- Duck Hunt – 3 poziomy: "Pierwszy Lot" (5 rur), "Wyższy Lot" (8 rur), "Niebezpieczny Przelot" (12 rur)
- Mario – 5 poziomów o rosnącej trudności:
  - Poziom 1: Łatwy – 180s, 2 wrogów
  - Poziom 2: Średni – 150s, 3 wrogów
  - Poziom 3: Trudny – 120s, 4 wrogów
  - Poziom 4: Bardzo trudny – 150s, 5 wrogów, nocny motyw
  - Poziom 5: Ekspert – 90s, 6 wrogów, ekstremalna platformówka

### Optymalizacje Techniczne
- Duck Hunt – dodanie flagi `canJump` zapobiegającej podwójnym skokom
- Mario – implementacja `deltaTime` dla płynnych animacji niezależnie od klatek
- Sklep – funkcja `fixShopBug()` do naprawy stanu sklepu przy starcie
- LocalStorage – spójny system zapisu/odczytu dla wszystkich gier
- Czyszczenie zasobów – zatrzymywanie wszystkich interwałów i animacji przy przejściach



## Wersja v0.80 - Etap 6: Implementacja projektu cz. 2
Wersja v0.70 przynosi ogromne zmiany optymalizacyjne w strukturze kodu oraz znaczące ulepszenia dla końcowego użytkownika (UI/UX).

### 🐛 Refaktoryzacja i Architektura (Backend/Skrypty)
- **Modularyzacja kodu:** Gigantyczny plik [javascript.js](cci:7://file:///c:/Users/user/OneDrive%20-%20Szko%C5%82a%20Podstawowa%20im.%20M.%20Konopnickiej%20w%20Dziekanowie%20Le%C5%9Bnym/Pulpit/Janek/2ap/PROJOP/v50/javascript.js:0:0-0:0) został podzielony tematycznie. Każda z 9 gier posiada teraz swój dedykowany, wyizolowany moduł (np. [snake.js](cci:7://file:///c:/Users/user/OneDrive%20-%20Szko%C5%82a%20Podstawowa%20im.%20M.%20Konopnickiej%20w%20Dziekanowie%20Le%C5%9Bnym/Pulpit/Janek/2ap/PROJOP/v0.70/snake.js:0:0-0:0), [duck.js](cci:7://file:///c:/Users/user/OneDrive%20-%20Szko%C5%82a%20Podstawowa%20im.%20M.%20Konopnickiej%20w%20Dziekanowie%20Le%C5%9Bnym/Pulpit/Janek/2ap/PROJOP/v0.70/duck.js:0:0-0:0), [mario.js](cci:7://file:///c:/Users/user/OneDrive%20-%20Szko%C5%82a%20Podstawowa%20im.%20M.%20Konopnickiej%20w%20Dziekanowie%20Le%C5%9Bnym/Pulpit/Janek/2ap/PROJOP/v0.70/mario.js:0:0-0:0)), co drastycznie poprawia czytelność kodu, ułatwia jego rozwój i ładowanie.
- **Skalowalność:** Nowa architektura w naturalny sposób przygotowuje grunt pod dodawanie kolejnych gier bez obciążania głównego wątku aplikacji.
### 🎨 Zmiany w Interfejsie (UI/UX)
- **Modern HUD (Heads-Up Display):** Zaimplementowano całkowicie nowy, kinowy HUD w trakcie rozgrywki (szczególnie widoczny w grze _Duck Hunt_). Postępy, celność i zdobyte punkty są teraz płynnie animowane nad elementem Canvas.
- **Przyciski "Poradnik" (Tutorials):** Do każdej gry w bibliotece wprowadzono interaktywny przycisk pomocy ("Poradnik"), który przed uruchomieniem Canvasa tłumaczy nowym graczom zasady i sterowanie w danej grze.
- **Zaawansowane arkusze stylów:** Plik [style.css](cci:7://file:///c:/Users/user/OneDrive%20-%20Szko%C5%82a%20Podstawowa%20im.%20M.%20Konopnickiej%20w%20Dziekanowie%20Le%C5%9Bnym/Pulpit/Janek/2ap/PROJOP/v50/style.css:0:0-0:0) został zaktualizowany (jego rozmiar wzrósł o blisko 40%), wprowadzając nowe przejścia (transitions), palety kolorów i wsparcie dla nowych modali oraz podglądów poziomów trudności.
### 📜 Licencja i Środowisko Produkcyjne
Zgodnie z wymogami środowiska produkcyjnego dla projektów open-source, aplikacja docelowo operuje w oparciu o popularną, otwartą licencję **MIT**, w pełni pozwalając na jej komercyjne użycie, modyfikowanie kodu oraz swobodną dystrybucję w celach edukacyjnych.