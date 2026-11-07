# Prompty do kodu

> Osiem wzorców poleceń i cztery błędy, które psują kod z AI.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Zasada: zachowanie zamiast implementacji

Słabe polecenia mówią „jak”. Dobre mówią „co” i „po co”.

```text
Słabo:  „Użyj map, żeby przejść po tablicy i odfiltrować elementy”.
Dobrze: „Zrób funkcję, która z listy użytkowników zwraca tylko tych
         z aktywną subskrypcją, posortowanych po dacie rejestracji”.
```

Model wie, jak to zaimplementować. Twoje zadanie: jasno opisać zachowanie.

## 1. Najpierw kontekst

Zanim poprosisz o zmianę, wskaż istniejący kod.

```text
Przeczytaj najpierw src/lib/auth.ts i src/middleware/auth.ts.
Potem dodaj funkcję, która sprawdza, czy użytkownik ma rolę admina.
Trzymaj się wzorców z istniejącego kodu logowania.
```

Model przejmie styl, importy i wzorce. Bez kontekstu wymyśli własne.

## 2. Najpierw szkielet, potem treść

Duże funkcje rób w dwóch krokach.

```text
Krok 1: Utwórz strukturę systemu powiadomień: schemat bazy, trasy API
(lista, oznacz jako przeczytane, usuń), schematy Zod i typy.
Same sygnatury i typy, w treści funkcji komentarze TODO.

Krok 2: Teraz zaimplementuj tworzenie powiadomienia w
src/routes/powiadomienia.ts: walidacja, zapis w bazie, zwrot nowego obiektu.
```

Małe, skupione polecenia dają lepszy kod niż „zbuduj mi cały system powiadomień”.

## 3. Refaktoryzacja

```text
Przebuduj src/lib/baza.ts na wzorzec repozytorium.
Zachowanie ma zostać identyczne.
Każda tabela dostaje własny plik w src/repozytoria/.
Najpierw pokaż plan zmian, potem je wprowadź.
```

Dwa zwroty robią robotę: „zachowanie identyczne” chroni działanie, „najpierw pokaż plan” daje Ci chwilę na przegląd.

## 4. Najpierw testy

```text
Napisz testy klasy UslugaUzytkownika:
- utworz: sprawdza unikalność e-maila, hashuje hasło, zapisuje w bazie;
- pobierz: zwraca po ID, rzuca BrakUzytkownika, gdy nie ma;
- aktualizuj: częściowe zmiany, waliduje e-mail, jeśli się zmienił;
- usun: miękkie usunięcie (ustawia usunietoO), nie kasuje wiersza.
Vitest, warstwa bazy zamockowana.
```

A potem: „Zaimplementuj UslugaUzytkownika tak, żeby przeszły wszystkie testy”. Model musi przemyśleć przypadki brzegowe, zanim napisze kod.

## 5. Przegląd kodu

```text
Przejrzyj src/routes/platnosci.ts pod kątem:
1. bezpieczeństwa (wstrzyknięcia, obejście logowania, wyciek danych);
2. obsługi błędów (nieobsłużone obietnice, brak try/catch);
3. wyścigów;
4. dziur w walidacji.
Przy każdym problemie wyjaśnij ryzyko i pokaż poprawkę.
```

Konkretne kryteria dają konkretne uwagi. „Przejrzyj ten kod” daje ogólniki.

## 6. Najpierw wyjaśnij, potem popraw

```text
Wyjaśnij, co robi src/lib/cache.ts, funkcja po funkcji.
Potem zaproponuj trzy konkretne usprawnienia z kodem.
```

Dobre w obcym kodzie. Z wyjaśnienia widzisz, czy model dobrze zrozumiał kod, zanim zaufasz jego propozycjom.

## 7. Migracja

```text
Przenieś src/api/uzytkownicy.js z Express na Hono.
Zostaw te same ścieżki i kształt odpowiedzi.
Middleware przepisz na wzorzec Hono.
Wypisz funkcje Expressa, które wymagają zamienników.
```

„Zostaw to samo” powstrzymuje model przed wymyślaniem API od nowa.

## 8. Debugowanie

```text
Ten test nie przechodzi: [test i komunikat błędu]
Kod: src/services/rozliczenia.ts, linie 45-80.
Jaka jest najbardziej prawdopodobna przyczyna? Pokaż poprawkę.
```

Błąd, miejsce i konkretne pytanie dają szybką odpowiedź. Więcej: [debugowanie z AI](https://tukamil.com/niewidzialna-architektura/debugowanie/).

## Antywzorce

**„Zrób to lepiej”.** Lepiej, czyli jak? Szybciej, czytelniej, bezpieczniej? Napisz: „Zmniejsz liczbę zapytań do bazy w tej funkcji z trzech do jednego przez JOIN”.

**„Popraw wszystkie błędy”.** Model nie odróżni błędu od zamierzonego działania. Napisz: „Klienci zgłaszają, że link do resetu hasła przychodzi przeterminowany. Token powstaje w src/lib/tokeny.ts, a sprawdza go src/routes/logowanie.ts. Znajdź, gdzie źle ustawia się czas ważności”.

**Jedno gigantyczne polecenie.** Cała funkcja w jednym poleceniu obniża jakość. Rozbij to: schemat bazy, sygnatury tras, każda trasa osobno, walidacja, testy.

**Ślepe zaufanie.** Czytaj kod, uruchamiaj testy, sprawdzaj importy. AI myli się pewnym głosem: importuje niezainstalowane paczki, wywołuje nieistniejące metody, pisze wiarygodną, ale błędną logikę.

## Kontekst w praktyce

- **Wskazuj pliki ścieżką** zamiast wklejać 200 linii. Agent przeczyta je sam.
- **Jedna sprawa w poleceniu.** Logowanie, płatności i maile naraz kończą się trzema połowicznymi rozwiązaniami.
- **Zacznij od nowa, gdy model się kręci.** Stary kontekst kumuluje błędy.
- **Doprecyzowuj kolejnymi poleceniami.** Pierwsze ustawia strukturę, następne dopracowują szczegóły.

```text
1. Zrób obsługę webhooków Stripe.
2. Dodaj zdarzenie invoice.payment_failed: ustaw status subskrypcji na past_due.
3. Dodaj idempotencję po ID zdarzenia, żeby nic nie przetworzyć dwa razy.
```

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: patterns/prompt-patterns.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/prompty/
