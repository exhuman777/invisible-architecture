# Debugowanie z AI

> Jak szukać błędów z AI szybciej, nie tracąc rozumienia kodu.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Pętla debugowania

Ta sama pętla, której używa człowiek, tylko z AI na każdym kroku. AI nie zastępuje rozumienia kodu, ale mocno je przyspiesza.

### 1. Odtwórz błąd

Opisz go dokładnie. Ogólny opis daje ogólną odpowiedź.

```text
Słabo:  „Aplikacja czasem się wywala”.
Dobrze: „POST /api/faktury zwraca 500, gdy tablica pozycje ma ponad 50
         elementów. Przy mniejszej liczbie działa.
         Błąd: PayloadTooLargeError: request entity too large”.
```

### 2. Daj kontekst

Wklej cały błąd ze stosem wywołań, nie samą wiadomość.

```text
Error: Cannot read properties of undefined (reading 'id')
    at pobierzUzytkownika (src/lib/auth.ts:42:18)
    at handler (src/routes/uzytkownicy.ts:15:24)
```

Dołącz: czego się spodziewałeś, co się stało, co wywołało błąd i jakie jest środowisko (wersja Node, system, przeglądarka). Agent z dostępem do terminala może sam uruchomić polecenie i przeczytać wynik.

### 3. Hipotezy przed poprawką

Najpierw pytaj o przyczyny, nie o poprawkę.

```text
Na podstawie tego błędu i stosu wywołań podaj trzy najbardziej
prawdopodobne przyczyny. Jeszcze nic nie poprawiaj.
```

Skok prosto do poprawki często leczy objaw zamiast przyczyny.

### 4. Poprawka

Gdy zgadzacie się co do przyczyny, poproś o poprawkę.

```text
pobierzUzytkownika() dostaje null, gdy ciasteczko sesji wygasło.
Obsłuż ten przypadek i zwróć 401 zamiast wywracać proces.
```

### 5. Sprawdzenie

```text
Uruchom testy i sprawdź, czy coś się zepsuło.
Dopisz test na wygasłą sesję.
```

## Szablony zgłoszeń dla AI

Błąd w działaniu:

```text
Dostaję ten błąd, gdy [działanie]:
[pełny błąd i stos]
Pliki: src/routes/faktury.ts (handler), src/lib/baza.ts (zapytanie)
Oczekiwane: [co ma się stać]
Jest: [co się dzieje]
```

Test, który nie przechodzi:

```text
Ten test nie przechodzi: [nazwa i ścieżka]
Wynik: [pełny wynik z asercją]
Kod: src/services/rozliczenia.ts
Test przechodził przed [commit albo zmiana].
```

Błąd tylko w CI:

```text
Lokalnie testy przechodzą, w CI nie.
Log CI: [fragment]
Lokalnie: Node 22, macOS. CI: Node 22, Ubuntu.
Zmiany od ostatniego zielonego przebiegu: [diff albo link]
```

## Częste pytania do AI

- **Konkretny błąd:** „W src/lib/api.ts:23 dostaję »TypeError: fetch failed«. W przeglądarce działa, w komponencie serwerowym nie. Co się dzieje?”
- **Regresja:** „Działało przed commitem abc123. Oto diff. Która zmiana zepsuła liczenie faktury?”
- **Niestabilny test:** „Ten test przechodzi w 80% przypadków. Co tu jest niedeterministyczne?”
- **Wydajność:** „Endpoint trwa 3 sekundy, zapytanie do bazy 50 ms. Co jeszcze tu zwalnia?”

## W czym AI jest dobre

- **Rozpoznaje wzorce.** Widziało ogromne ilości komunikatów błędów i od razu kojarzy typowe przyczyny.
- **Czyta dużo kodu naraz.** Przejdzie łańcuch wywołań przez dziesięć plików bez zgubienia wątku.
- **Daje kilka hipotez.** Człowiek przywiązuje się do pierwszej. AI poda pięć i uszereguje je.
- **Zna kaprysy frameworków.** Różnice między komponentami serwerowymi i klienckimi, konfiguracje, wersje.

## Gdzie AI się myli

- **Nie widzi stanu w działaniu,** jeśli mu go nie pokażesz: wartości zmiennych, danych w bazie, czasu.
- **Zmyśla przyczyny** przy nietypowych błędach. Sprawdzaj każdą hipotezę.
- **Rzadko mówi „nie wiem”.** Uważaj na pewne siebie wyjaśnienia, które nie pasują do dowodów.

## Triki

### Logi przed pytaniem

```typescript
console.log('uzytkownik:', JSON.stringify(uzytkownik));
console.log('wejscie:', JSON.stringify(req.body));
```

Wartości z działania plus kod dają szybszą diagnozę.

### Metoda diffu

```text
Błąd pojawił się po scaleniu tego pull requesta: [git diff main..galaz]
Która zmiana najpewniej go wprowadziła?
```

### Najpierw obserwowalność

Zanim poprawisz błąd, poproś o porządne logowanie w tym miejscu. Następny podobny błąd złapiesz szybciej.

### Wyszukiwanie binarne w Git

```bash
git bisect start
git bisect bad          # bieżący commit ma błąd
git bisect good abc123  # ten działał
# git podaje kolejne commity do sprawdzenia
```

Wynik pokaż AI: „Błąd wszedł w commicie xyz789, oto jego zmiany”.

### Gumowa kaczka

Samo ułożenie problemu w jasne polecenie często podsuwa odpowiedź, zanim AI zdąży odpisać. Pisz pełne polecenie mimo to. Jeśli nie rozwiążesz sam, AI dostanie dobrze postawione pytanie.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: patterns/debugging-with-ai.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/debugowanie/
