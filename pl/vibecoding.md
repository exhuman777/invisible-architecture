# Vibecoding: poradnik

> Pętla pracy z AI: opisujesz zachowanie, AI pisze kod, Ty czytasz, testujesz i commitujesz.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Czym jest vibecoding

Słowo wymyślił Andrej Karpathy w lutym 2025 roku, we wpisie na X. Opisał tam pisanie programów przez rozmowę z AI: mówisz, co ma powstać, model pisze kod, a Ty prawie nie zaglądasz do środka. Słownik Collinsa wybrał „vibe coding” słowem roku 2025.

Ten poradnik opisuje wersję odpowiedzialną. Opisujesz zachowanie programu, AI pisze kod, a Ty czytasz wynik, uruchamiasz testy i decydujesz. Jesteś architektem, AI jest wykonawcą.

Zmiana wygląda tak:

- dawniej: „Jak napisać funkcję rekurencyjną, która przejdzie po drzewie?”
- dziś: „Potrzebuję funkcji, która przejdzie drzewo w głąb i zbierze liście spełniające warunek”.

Wynik ten sam, inne wejście. Ty opisujesz zachowanie, AI dobiera składnię.

Dla kogo to działa:

- programiści, którzy chcą szybciej dowozić;
- założyciele firm, którzy budują pierwszą wersję produktu;
- projektanci, którzy rozumieją logikę, ale nie składnię;
- każdy, kto potrafi jasno opisać, co program ma robić.

Dla kogo jeszcze nie:

- dla osób, które nie umieją ocenić, czy kod działa poprawnie;
- dla nowych algorytmów, których nikt wcześniej nie napisał;
- dla systemów krytycznych, gdzie każda linia wymaga formalnej weryfikacji.

## Sześć zasad

**Smak ponad pisanie.** Twoja wartość przesuwa się z pisania kodu na ocenianie kodu. Widzisz, że AI wybrało rozwiązanie kwadratowe tam, gdzie wystarczy liniowe? Ta ocena znaczy więcej niż szybkość pisania.

**Rozumienie ponad pamięć.** Nie musisz pamiętać sygnatur bibliotek. Musisz rozumieć kody HTTP, indeksy w bazie, logowanie i wyścigi wątków. Pojęcia zostają, składnię generuje model.

**Iteracja ponad perfekcję.** Pierwsza odpowiedź rzadko jest idealna. Umiejętność polega na precyzyjnej poprawce: „obsługa błędów łapie za dużo, łap konkretne wyjątki” działa lepiej niż „napisz to lepiej”.

**Kontekst decyduje.** AI pisze lepiej, gdy zna strukturę projektu, konwencje i ograniczenia. Czas włożony w plik z instrukcjami (`CLAUDE.md`, `AGENTS.md`) wraca przy każdym poleceniu. Szczegóły: [CLAUDE.md i AGENTS.md](https://tukamil.com/niewidzialna-architektura/claude-md/).

**Ufaj, ale sprawdzaj.** Model pisze kod, który wygląda wiarygodnie. Wiarygodny nie znaczy poprawny. Czytaj wynik, uruchamiaj testy, sprawdzaj przypadki brzegowe.

**Odpowiedzialność zostaje przy Tobie.** Kod z AI to Twój kod. Ty go wdrażasz i Ty go naprawiasz w nocy. Przeglądaj go tak, jakbyś napisał go sam.

## Przygotowanie stanowiska

### Plik z instrukcjami

Każdy projekt potrzebuje pliku, który mówi AI, jak pracujesz: stos, struktura katalogów, polecenia, konwencje, pułapki. Claude Code czyta `CLAUDE.md` w katalogu projektu, a polecenie `/init` tworzy pierwszą wersję z analizy kodu. Cursor, GitHub Copilot, Codex i wiele innych narzędzi czyta `AGENTS.md`.

```markdown
# Projekt: MojaAplikacja

## Stos
- Next.js (App Router), TypeScript w trybie strict
- Supabase (logowanie i baza)

## Polecenia
- `npm run dev`: serwer lokalny
- `npm test`: testy jednostkowe

## Konwencje
- komponenty serwerowe domyślnie, klienckie tylko gdy trzeba
- zapytania do bazy tylko przez klienta Supabase
```

### Serwery MCP

Serwery MCP pozwalają asystentowi sięgać do narzędzi: plików, repozytorium, bazy, dokumentacji. W Claude Code dodajesz je poleceniem:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp add --transport stdio context7 -- npx -y @upstash/context7-mcp
```

Więcej: [MCP po polsku](https://tukamil.com/niewidzialna-architektura/mcp/).

### Struktura projektu

AI pracuje najlepiej na przewidywalnej strukturze:

- **płasko zamiast głęboko:** `components/Przycisk.tsx` zamiast pięciu poziomów folderów;
- **powiązane pliki razem:** test obok kodu, który sprawdza;
- **opisowe nazwy:** `utworzUzytkownika.ts` zamiast `utils.ts`.

### Git

Commituj często. Każdy działający stan to punkt, do którego wrócisz jednym poleceniem.

```text
polecenie → generowanie → przegląd → test → commit → następne polecenie
```

Małe commity pozwalają cofnąć złą generację bez utraty reszty pracy, a `git diff` pokazuje dokładnie, co zmieniło AI.

## Pętla vibecodingu

### 1. Polecenie

Opisuj zachowanie, nie implementację.

Słabo:

> Zrób komponent React z useState i useEffect, który pobiera dane.

Dobrze:

> Zrób stronę profilu: przy wejściu pobiera dane, w trakcie pokazuje szkielet, potem imię, e-mail i zdjęcie, a przy błędzie komunikat i przycisk „Spróbuj ponownie”.

Dobre polecenie opisuje, co widzi użytkownik. Hooki model zna sam. Pomaga też:

- historyjka użytkownika: „Jako klient chcę…”;
- przypadki brzegowe: „Gdy API zwróci 404, pokaż »Nie ma takiego konta«”;
- ograniczenia: „Strona ma działać bez JavaScriptu przy pierwszym wczytaniu”;
- wzór w kodzie: „Zrób tak samo jak w `components/Pulpit.tsx`”.

### 2. Generowanie

Pozwól modelowi pisać. Przerywaj tylko przy zasadniczym nieporozumieniu. Agent w Claude Code zwykle czyta istniejące pliki, pisze kod w stylu projektu, zmienia kilka plików naraz i uruchamia testy.

### 3. Przegląd

Czytaj każdą linię. Sprawdzaj:

- **poprawność:** czy logika robi to, o co prosiłeś;
- **bezpieczeństwo:** wstrzyknięcia SQL, XSS, sekrety w kodzie, obejście logowania;
- **wydajność:** zbędne renderowanie, zapytania w pętli, brak indeksów;
- **przypadki brzegowe:** pusto, błąd, ładowanie, wartości puste;
- **styl:** zgodność z konwencjami projektu.

Typowe błędy AI: import paczki, która nie istnieje, stare API biblioteki, przekombinowane rozwiązanie prostej sprawy, brak obsługi błędów w kodzie asynchronicznym, wartości wpisane na sztywno.

### 4. Iteracja

Poprawiaj jedną konkretną rzecz naraz.

Słabo:

> Nie działa, napraw.

Dobrze:

> Stan ładowania działa, ale przycisk „Spróbuj ponownie” nie czyści starego komunikatu. Dodaj też limit 3 sekund na pobranie.

### 5. Commit

Zapisz działający stan, zanim zaczniesz kolejną zmianę.

```bash
git add -A && git commit -m "strona profilu ze stanem ładowania i błędu"
```

## Kiedy vibecoding, a kiedy ręcznie

Oddaj AI:

- szablonowy kod: formularze, CRUD, migracje;
- standardowe wzorce: logowanie, trasy API, pobieranie danych;
- komponenty interfejsu, testy, dokumentację, pliki konfiguracyjne, typy, style.

Pisz sam albo z bardzo dokładnym przeglądem:

- miejsca krytyczne dla wydajności;
- nowe algorytmy;
- kod bezpieczeństwa: logowanie, szyfrowanie, uprawnienia, płatności;
- serce biznesu, czyli to, co wyróżnia produkt;
- złożone maszyny stanów.

Szara strefa, gdzie AI szkicuje, a Ty weryfikujesz: schemat bazy, projekt API, decyzje architektoniczne.

## Od jednej osoby do zespołu

**Sam z AI.** `CLAUDE.md` trzyma Twoje konwencje. Aktualizuj go, gdy się zmieniają, commituj często, pisz testy i prowadź krótkie notatki z sesji, żeby kontekst nie ginął.

**Zespół z AI.** Plik z instrukcjami leży w repozytorium, więc AI każdej osoby trzyma się tych samych zasad. Przegląd kodu w pull requestach zostaje, a nawet zyskuje na znaczeniu, bo AI pisze błędy, które wyglądają dobrze. Pilnuj, żeby ludzie rozumieli kod: rotuj przeglądających, pracujcie w parach nad trudnymi rzeczami.

Pułapki przy skali:

- **dług z AI:** kod „wystarczająco dobry” kumuluje się, więc planuj sprzątanie;
- **zależność:** jeśli nie umiesz napisać prostej funkcji bez AI, odpuść na chwilę narzędzie;
- **granice kontekstu:** duży projekt nie mieści się w głowie modelu, więc dziel go na moduły;
- **utrata rozumienia:** największe ryzyko. Komentuj „dlaczego”, nie „co”, i prowadź dokumentację architektury.

## Ściąga

1. Napisz dobry plik z instrukcjami.
2. Opisuj zachowanie, nie implementację.
3. Czytaj każdą linię kodu z AI.
4. Commituj po każdej działającej zmianie.
5. Najważniejsze rzeczy pisz z pełną uwagą.
6. Trzymaj podstawy w formie.

Najlepsi vibecoderzy nie piszą poleceń najszybciej. Wiedzą, o co poprosić, i umieją ocenić, co dostali.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: guides/vibecoding-playbook.md, .agent/vibecoding-rules.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/vibecoding/
