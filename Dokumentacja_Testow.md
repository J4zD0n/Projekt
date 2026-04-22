# Dokumentacja Testów – PROJOP Stage 7
**Projekt:** Gaming Hub – Kolekcja Gier Retro
**Autor:** Janek (2ap)
**Data:** 22.04.2026
**Wersja:** v0.85 (Testing Phase)

---

## 1. Wybór metod testowania
W ramach Etapu 7 wybrano dwie uzupełniające się metody testowania:

| Metoda | Opis | Cel |
| :--- | :--- | :--- |
| **Testy Jednostkowe (Automatyczne)** | Skrypty JS weryfikujące logikę gier bez interakcji z UI. | Sprawdzenie poprawności algorytmów (np. kolizje, punkty). |
| **Testy Funkcjonalne (Manualne)** | Ręczna weryfikacja scenariuszy użytkowych w przeglądarce. | Sprawdzenie UX, interfejsu i stabilności aplikacji. |

---

## 2. Plan Testów Aplikacji

### Cele testów:
- Zweryfikowanie poprawności działania mechaniki gier (Pong, Snake).
- Sprawdzenie stabilności systemu XP i poziomów.
- Upewnienie się, że interfejs jest responsywny i czytelny.

### Wyposażenie testowe:
- Przeglądarka internetowa (Chrome/Edge).
- Dashboard testowy: `testy.html`.
- Narzędzia deweloperskie (Console log).

---

## 3. Implementacja i Wykonanie Testów

### A. Testy Automatyczne (Unit Tests)
Zaimplementowano dedykowany dashboard testowy `testy.html` wraz ze skryptem `testy.js`.

**Wykonane przypadki testowe:**
1. **Inicjalizacja Systemu**: Sprawdzenie czy `gameStateManager` i konfiguracja trudności ładują się poprawnie. (**PASS**)
2. **Mechanika Pong**: Weryfikacja startowej pozycji piłki i ruchu paletki gracza. (**PASS**)
3. **Fizyka Pong**: Test odbicia piłki od górnej krawędzi (zmiana kierunku wektora `dy`). (**PASS**)
4. **Mechanika Snake**: Sprawdzenie inicjalizacji węża i długości początkowej. (**PASS**)
5. **System XP**: Próba dodania punktów XP i weryfikacja braku błędów w konsoli. (**PASS**)

### B. Testy Manualne (Functional Tests)

| ID | Scenariusz Testowy | Oczekiwany Wynik | Status |
| :--- | :--- | :--- | :--- |
| TM-01 | Kliknięcie w kafel "Graj" w menu. | Otwiera się modal wyboru trudności lub gra. | ✅ OK |
| TM-02 | Zmiana motywu kolorystycznego. | Zmienia się kolor akcentu w całej aplikacji. | ✅ OK |
| TM-03 | Użycie klawisza ESC podczas gry. | Gra zostaje wstrzymana, pojawia się menu pauzy. | ✅ OK |
| TM-04 | Zdobycie punktu w grze Pong. | Wynik gracza zwiększa się o 1. | ✅ OK |
| TM-05 | Zakup przedmiotu w sklepie. | Monety zostają odjęte, przedmiot jest oznaczony jako "Posiadane". | ✅ OK |

---

## 4. Ukończenie testów i Podsumowanie
Testy zakończyły się wynikiem pozytywnym. Automatyczny dashboard wykazał 100% zgodności logiki z założeniami. Testy manualne potwierdziły wysoką jakość interfejsu (UX) oraz poprawność nawigacji między grami.

---

## 5. Weryfikacja (Dokonane Zmiany)
W wyniku testów i weryfikacji kodu wprowadzono następujące usprawnienia:
1. **Optymalizacja kolizji w Pong**: Poprawiono precyzję odbicia piłki od krawędzi paletki, aby uniknąć błędów przy wysokich prędkościach (tzw. "tunnelling").
2. **Poprawka responsywności**: Dostosowano szerokość Modali dla ekranów o niskiej rozdzielczości.
3. **Zabezpieczenie Inputu**: Dodano reset klawiszy przy powrocie do menu głównego, co zapobiega "samoczynnemu" poruszaniu się postaci w nowej sesji.

---

**Podpis:**
*System wygenerowany automatycznie na potrzeby Etapu 7.*
