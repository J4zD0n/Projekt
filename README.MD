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
- **Modularyzacja kodu:** Gigantyczny plik javascript.js został podzielony tematycznie. Każda z 9 gier posiada teraz swój dedykowany, wyizolowany moduł (np. snake.js, duck.js, mario.js), co drastycznie poprawia czytelność kodu, ułatwia jego rozwój i ładowanie.
- **Skalowalność:** Nowa architektura w naturalny sposób przygotowuje grunt pod dodawanie kolejnych gier bez obciążania głównego wątku aplikacji.
### 🎨 Zmiany w Interfejsie (UI/UX)
- **Modern HUD (Heads-Up Display):** Zaimplementowano całkowicie nowy, kinowy HUD w trakcie rozgrywki (szczególnie widoczny w grze _Duck Hunt_). Postępy, celność i zdobyte punkty są teraz płynnie animowane nad elementem Canvas.
- **Przyciski "Poradnik" (Tutorials):** Do każdej gry w bibliotece wprowadzono interaktywny przycisk pomocy ("Poradnik"), który przed uruchomieniem Canvasa tłumaczy nowym graczom zasady i sterowanie w danej grze.
- **Zaawansowane arkusze stylów:** Plik style.css został zaktualizowany (jego rozmiar wzrósł o blisko 40%), wprowadzając nowe przejścia (transitions), palety kolorów i wsparcie dla nowych modali oraz podglądów poziomów trudności.
### 📜 Licencja i Środowisko Produkcyjne
Zgodnie z wymogami środowiska produkcyjnego dla projektów open-source, aplikacja docelowo operuje w oparciu o popularną, otwartą licencję **MIT**, w pełni pozwalając na jej komercyjne użycie, modyfikowanie kodu oraz swobodną dystrybucję w celach edukacyjnych.

## Wersja v0.85 - Etap 7: Testowanie aplikacji
Wersja v0.85 skupia się na zapewnieniu najwyższej jakości kodu poprzez wdrożenie kompleksowego systemu testowego oraz dokumentacji technicznej procesu weryfikacji.

### 🧪 System Testów Automatycznych
- **Dashboard Testowy:** Stworzono dedykowane narzędzie testy.html, które pozwala na błyskawiczne uruchomienie testów jednostkowych w przeglądarce.
- **Testy Jednostkowe (Unit Tests):** Implementacja skryptu testy.js weryfikującego krytyczne moduły gry (fizyka Pong, mechanika Snake, system XP).
- **Izolacja Środowiska:** Zastosowano system "mockowania" globalnych obiektów gry, co pozwala na stabilne testowanie logiki bez konieczności ładowania całego interfejsu UI.

### 📋 Dokumentacja i Metodyka
- **Dokumentacja Testów:** Przygotowano szczegółowy raport Dokumentacja_Testow.md zawierający plan testów, wybrane metodyki oraz wyniki weryfikacji.
- **Testy Funkcjonalne:** Przeprowadzono manualną weryfikację wszystkich ścieżek krytycznych użytkownika (User Flows).

### 🛠️ Weryfikacja i Poprawki (Bugfixes)
- **Anti-Tunnelling w Pong:** Na podstawie wyników testów usprawniono detekcję kolizji w pong.js. Dodano mechanizm "wypychania" piłki, co eliminuje błąd przenikania przez paletki przy bardzo dużych prędkościach.
- **Stabilność Inputu:** Zoptymalizowano obsługę klawiatury, zapewniając płynniejsze przejścia między różnymi trybami gry.

## Wersja v1.00 - Etap 8: Finałowa Odsłona
Wersja v1.00 przynosi mnóstwo ulepszeń wizualnych, mechanicznych oraz naprawia najpoważniejsze zgłoszone luki w mechanikach gier, finalizując w ten sposób pełny produkt "Gaming Hub".

### 🚀 Space Invaders - Visual Overhaul & Tutorial
- **Grafika gracza (Statku):** Statek to nie tylko prosty trójkąt, lecz szczegółowo wyrenderowany pojazd posiadający kadłub ze skrzydłami i podświetlony na cyjanowo kokpit. Posiada on również animowany, pulsujący system silnikowy.
- **Pixelo-za wrogach:** Każdy z kosmitów doczekał się liftingu, zyskując unikalny wygląd bazujący na stylu retro "pixel-art". Bossy mają teraz rogi i świecące oczy, podczas gdy słabsi kosmici posiadają machające macki i mrugające obiekty.
- **System Poradnika:** Znacząco rozszerzono zawartość w menu pomocy. Zamiast dwóch linijek gracze mogą teraz obejrzeć szczegółowy animowany poradnik tłumaczący punktację za każdego rodzaju kosmitę (10/20/40 pkt) oraz udzielający praktycznych porad.

### 🏓 Pong - Extreme Difficulty Bugfix
- **Naprawa nieskończonego przyspieszenia:** Na najwyższym poziomie trudności "Ekspert" (a także "Hard"), piłka przy każdym odbiciu od paletki mogła nieskończenie nabierać prędkości, przebijając barierę dźwięku. Zostało to załatane: wprowadzono twardy limit (`maxBallSpeed`), a zdobycie (lub strata) punktu całkowicie resetuje piłkę z powrotem do jej początkowych wartości konfiguracji z delikatnie losowym odchyleniem kąta. 

### 🍄 Mini Mario - Realistyczna Fizyka ("Momentum Update")
- **Większe podobieństwo do klasyki:** Stary model przesuwania o stałą prędkość (linear lerp) został całkowicie napisany od nowa na system przyspieszenia (acceleration) oraz tarcia (friction).
- **Akceleracja:** Mario zaczyna biec wolno, aby następnie wejść w maksymalną prędkość (`maxSpeed`). Zaprzestanie chodzenia wytraca prędkość z odpowiednim tarciem (brak natychmiastowego zatrzymywania).
- **Variable Jump & Coyote Time:** Mario skacze wyżej gdy klawisz skoku jest przytrzymany dłużej (puszczenie klawisza szybciej obcina pęd wertykalny). Użytkownik ma również kilka klatek opóźnienia na skok tuż po zsunięciu się z platformy, na rzecz polepszenia UX.
- **Inne opory aerodynamiczne:** W locie kontrolowanie Mario różni się (ma inny promień tarcia) w przeciwieństwie do bycia na powierzchni płaskiej.

### 🧱 Breakout - Różnorodne Poziomy
- **Brak nudy proceduralnej:** Wcześniej, każdy poziom gry Breakout był tą samą wielką prostokątną ścianą, z dodawanym nowym rzędem do góry. Zostało to zastąpione przez dynamiczny system generacji 7 różnych wzorów map. 
- **Wzory Klocków:** Gracze mogą teraz uświadczyć w grze takich wzorów map jak Piramida, Diament (krzyż/gwiazda), Naprzemienne paski, Szachownica a nawet kształt fortecy z podwyższonymi "wieżami" obronnymi. Wzory map rotują wraz z poziomami w sposób cykliczny.
- **Kolory tematyczne:** Każdy poziom i wzór podsiada teraz pasujące ze sobą tematyczne schematy kolorów (Tęcza, Neonowy, Ognisty itd).
- **HP Klocków (Multi-hit blocks):** Zaprogramowano klocki mogące utrzymać do 3 trafień, ukazujące swój wskaźnik obrażeń ciemniejąc podczas rozbijania, wyświetlające liczby ("2", "3") i popękane zarysy. 

### 🐛 Inne poprawki do systemu
- **Poprawa UI (Gwiazdka):** Wyświetlanie numeru obecnego poziomu gracza zaraz obok gwiazdki w panelu głównym nagłówka, nie posiadało zdefiniowanego na biało koloru. Cyfra wtapiała się ze swym nadrzędnym tłem w CSS. Nadano nową klasę `.level-number` wymuszającą wysoką czytelność elementu.
- **Optymalizacja Snake'a:** Oczyszczenie przestarzałych przypisań i resztek zmiennych do obsługi widoku w `snake.js` po migracji architektonicznej.

### 🐍 Snake - Decoupling (Rozdzielenie Renderowania)
- **Problem z klatkowaniem:** Do tej pory ekran renderował się z tą samą częstotliwością, co tyknięcia zegara logiki węża (np. 6 razy na sekundę na łatwym poziomie), co powodowało ostre cięcia animacji, skakanie trzęsącego się ekranu i niepłynne pulsowanie.
- **Rozwiązanie (60 FPS):** Główna pętla gry została napisana od nowa. Od teraz logika kratkowa i poruszanie się węża zachodzi asynchronicznie, zachowując swój własny timer, podczas gdy odrysowanie grafiki na Canvas, wraz z przesuwaniem napisów Combo oraz cieniami i wibracjami ekranu, aktualizuje się sztywno 60 razy na sekundę (`1000/60`). Gra jest teraz niesamowicie płynna i lekka.
- **Optymalizacja wydajności:** Usunięto zasobożerne na procesor operacje `shadowBlur` z API 2D Canvas zastępując poświatę i "glow" specjalnych jabłek poprzez półprzezroczyste okręgi rysowane za pomocą kanału alfa (`rgba()`).

### 🍄 Mini Mario - Lifting i Płynność
- **Aktualizacja Grafiki Postaci:** Kwadratowy model przypominający postać z Minecrafta został odrzucony. Mario zyskał zupełnie nowy, dopracowany wygląd zbudowany na bazie krzywych (`arc`, `roundRect`): Posiada łuki i zaokrągloną czapkę, wyraźne ręce, dłonie, okrągły nosek i mieniące się guziki u ogrodniczek.
- **Animacje:** Dodano animację przebierania nóżkami (chód oparty na sinusoidzie), kiedy postać się porusza.
- **Szlif Fizyki:** Skorygowano wcześniej zaimplementowaną grawitację zmniejszając przyśpieszenie, obniżając maksymalną prędkość i wygładzając tarcie z ziemią (`groundFriction`). Dzięki temu postać porusza się jak w prawdziwym starym Mario – o wiele łagodniej, bez rażących przyśpieszeń z denerwującym, bezwładnym oporem zjazdowym.

### 🎨 Ogólne poprawki UI
- **Menu Gier:** Dodano poprawną siatkę Flexbox do kafelków kart gier (Klasy CSS `.game-tile` i `.game-info`). Przyciski "Graj" i "Poradnik" w różniących się długościami opisów kafelków są już sztywno wyrównane do dołu – kafelki stały się równe i estetyczne.
- **Przyciski w Canvas:** Zaktualizowano wygląd topornych przycisków w samej grze Mini Mario (Takich jak *Wybierz Poziom*, czy przycisków w menu *Level Complete*). Otrzymały one zaokrąglenia rogów oraz ładne cieniowane gradienty koloru.