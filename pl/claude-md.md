# CLAUDE.md i AGENTS.md

> Najważniejszy plik w projekcie z AI: co w nim pisać, a czego nie.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Najważniejszy plik w projekcie z AI

Każde narzędzie AI do kodu czyta plik z instrukcjami projektu na starcie sesji. Bez niego AI zgaduje. Z nim wie, jak pracujesz.

| Narzędzie | Plik |
|---|---|
| Claude Code | `CLAUDE.md` albo `.claude/CLAUDE.md`, reguły w `.claude/rules/`; sam `AGENTS.md`, gdy w projekcie nie ma `CLAUDE.md` |
| Codex, Cursor, Gemini CLI, Aider i inne | `AGENTS.md` (Gemini CLI ma też `GEMINI.md`) |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `AGENTS.md` |
| Cursor | `.cursor/rules` albo `AGENTS.md` |

Traktuj ten plik jak instrukcję dla nowej osoby w zespole: to samo, co powiedziałbyś jej pierwszego dnia.

W Claude Code polecenie `/init` analizuje kod i tworzy pierwszą wersję `CLAUDE.md`. Gdy plik już istnieje, proponuje poprawki.

## Sześć sekcji

### 1. Opis projektu (dwie linie)

```markdown
# Projekt: Faktury
API do obsługi faktur. Hono, Cloudflare Workers i D1.
```

### 2. Stos

```markdown
## Stos
- Hono na Cloudflare Workers
- D1 (SQLite) z Drizzle ORM
- Zod do walidacji
- Vitest do testów
```

### 3. Struktura

```markdown
## Struktura
- src/routes/  trasy API, jeden plik na zasób
- src/db/      schemat i migracje
- src/lib/     pomocnicze funkcje
```

### 4. Konwencje

```markdown
## Konwencje
- eksporty nazwane, bez default
- każda trasa waliduje wejście schematem Zod
- błędy zwracamy jako { error, kod }
```

### 5. Polecenia i testy

```markdown
## Polecenia
- `npm run dev`: serwer lokalny
- `npm test`: testy
- `npm run deploy`: wdrożenie
Przed commitem zawsze `npm test`.
```

### 6. Pułapki i zakazy

```markdown
## Nie rób
- nie instaluj nowych zależności bez pytania
- nie używaj typu any

## Pułapki
- migracje D1 tylko przez wrangler CLI
```

Ta sekcja rośnie najszybciej. Za każdym razem, gdy AI popełni ten sam błąd drugi raz, dopisz go tutaj.

## Przykład minimalny

```markdown
# Portfolio
Astro i Tailwind, wdrożenie na Cloudflare Pages.

Dev: `npm run dev`. Build: `npm run build`.
Treści w src/content/ jako MDX.
Komponenty Astro, nie React (zero JS w przeglądarce).
```

Nawet dziesięć linii działa lepiej niż nic.

## Warstwy w Claude Code

| Poziom | Plik | Dla kogo |
|---|---|---|
| Organizacja | plik zarządzany przez IT, np. `/etc/claude-code/CLAUDE.md` na Linuksie | cała firma |
| Użytkownik | `~/.claude/CLAUDE.md` | Ty, we wszystkich projektach |
| Projekt | `./CLAUDE.md` albo `./.claude/CLAUDE.md` | zespół, przez Git |
| Lokalny | `./CLAUDE.local.md` (dopisz do `.gitignore`) | Ty, w tym projekcie |

Pliki się nie nadpisują, tylko łączą. Claude czyta je od katalogu głównego w dół, więc instrukcje bliżej miejsca pracy czyta na końcu. Pliki `CLAUDE.md` z podkatalogów ładuje dopiero wtedy, gdy zaczyna pracować w danym katalogu.

Dodatkowo:

- `@sciezka/do/pliku` importuje inny plik do `CLAUDE.md`;
- `.claude/rules/*.md` dzieli instrukcje na tematy, a reguły z polem `paths` ładują się tylko przy pracy z pasującymi plikami;
- automatyczna pamięć zapisuje to, czego Claude nauczył się z Twoich poprawek.

## Antywzorce

- **Za długi.** Dokumentacja Claude Code radzi trzymać się poniżej 200 linii na plik. Dłuższy plik zjada kontekst i obniża posłuszeństwo. Szczegóły przenieś do reguł z `paths`.
- **Za ogólny.** „Pisz czysty kod” nic nie mówi. „Używaj wczesnych returnów” mówi.
- **Sprzeczny.** Dwie sprzeczne zasady sprawią, że model wybierze jedną losowo.
- **Z sekretami.** Plik trafia do repozytorium. Klucze trzymaj w `.env`, w pliku wpisz tylko nazwy zmiennych.
- **Nieaktualny.** Zmieniła się konwencja albo struktura? Popraw plik od razu.

Instrukcje w `CLAUDE.md` to kontekst, nie twarda blokada. Jeśli coś ma być zablokowane bez wyjątków, użyj hooka albo ustawień uprawnień.

## AGENTS.md: jeden plik dla wszystkich agentów

[AGENTS.md](https://agents.md/) to otwarty standard: README dla agentów. Od grudnia 2025 prowadzi go Agentic AI Foundation w Linux Foundation, razem z MCP. Czytają go Codex, Cursor, Copilot, Gemini CLI, Jules, Aider, Zed, Warp i wiele innych narzędzi.

Zasady standardu:

- zwykły Markdown, bez wymaganych pól i nagłówków;
- plik leży w katalogu głównym, a podprojekt może mieć własny `AGENTS.md`: działa najbliższy plik, a polecenie w rozmowie wygrywa ze wszystkim;
- komendy testów wpisane w plik agent uruchamia sam i poprawia błędy, zanim skończy zadanie;
- to żywa dokumentacja: poprawiasz ją razem z kodem.

Jak go połączyć z Claude Code:

```text
AGENTS.md     wszystkie instrukcje projektu (jedyne źródło)
CLAUDE.md     jedna linia: @AGENTS.md
```

Claude Code od wersji 2.1.277 czyta `AGENTS.md` sam, ale tylko wtedy, gdy w projekcie nie ma `CLAUDE.md` ani `CLAUDE.local.md`. Jeden `CLAUDE.local.md` z prywatnymi notatkami wyłącza więc `AGENTS.md`. Import `@AGENTS.md` w `CLAUDE.md` działa w każdej wersji i w każdej sesji, a dokumentacja Claude Code poleca go tam, gdzie samo czytanie `AGENTS.md` nie działa. Dlatego go używam.

Strona agents.md przy przenoszeniu starego pliku proponuje dowiązanie (symlink). Import jest pewniejszy, bo dowiązania psują się na Windowsie i przy kopiowaniu folderu.

Tak pracuję we wszystkich repozytoriach i w folderach firm moich klientów: [Jak to robię u siebie](https://tukamil.com/niewidzialna-architektura/jak-to-robie/).

## Pielęgnacja

Popraw plik, gdy:

- dochodzi duża zależność;
- zmienia się konwencja;
- AI drugi raz trafia na tę samą pułapkę;
- zmienia się struktura katalogów.

Najlepszy `CLAUDE.md` czyta się jak notatkę, którą zostawiłbyś sobie przed tygodniowym urlopem. Krótko, praktycznie, bez waty.

Dokumentacja: [pamięć w Claude Code](https://code.claude.com/docs/en/memory) (rozdział o AGENTS.md), [AGENTS.md](https://agents.md/).

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: patterns/claude-md.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/claude-md/
