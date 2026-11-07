# Nowy projekt z AI

> Dziesięć minut przygotowania, które oszczędzają godziny poprawek.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Problem pustego repozytorium

W pustym repozytorium AI pisze gorzej: nie ma struktury, konwencji ani wzorców do naśladowania, więc zgaduje. Dziesięć minut przygotowania na starcie oszczędza godziny poprawek.

## Pięć kroków

### 1. Szkielet z oficjalnego narzędzia

Narzędzia frameworków ustawiają TypeScript, lintery i katalogi poprawnie.

```bash
# Next.js: SaaS i aplikacje pełne
npx create-next-app@latest moja-aplikacja

# Astro: strony z treścią
npm create astro@latest moja-strona

# Hono: API i Workers
npm create hono@latest moje-api
```

Strona statyczna bez frameworka też jest dobrym wyborem: `index.html`, arkusz CSS i jeden plik JS.

### 2. CLAUDE.md od razu

Zanim powstanie pierwsza linia aplikacji. W Claude Code `/init` zrobi wersję startową z analizy repozytorium. Minimum:

```markdown
# Projekt: moja-aplikacja
[Jedno zdanie o projekcie]. [Framework], [baza], [ważne biblioteki].

## Polecenia
- `npm run dev`, `npm test`, `npm run build`

## Struktura
[Najważniejsze katalogi i co w nich jest]

## Konwencje
[Trzy do pięciu zasad, na których Ci zależy]
```

Więcej: [CLAUDE.md i AGENTS.md](https://tukamil.com/niewidzialna-architektura/claude-md/).

### 3. Serwery MCP

Wspólne dla zespołu serwery zapisz w `.mcp.json`:

```bash
claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/
claude mcp add --scope project --transport stdio context7 -- npx -y @upstash/context7-mcp
```

Więcej: [MCP po polsku](https://tukamil.com/niewidzialna-architektura/mcp/).

### 4. Katalogi

Nawet puste pliki pomagają, bo AI widzi strukturę i odkłada nowy kod we właściwe miejsce.

```bash
mkdir -p src/{components,lib,types}
touch src/lib/baza.ts src/types/index.ts
```

### 5. Pierwsze polecenie

Teraz AI ma kontekst, więc polecenie może być konkretne:

```text
Przeczytaj strukturę projektu i CLAUDE.md. Potem dodaj logowanie:
strony /logowanie i /rejestracja, a /pulpit tylko dla zalogowanych.
```

Porównaj z „zbuduj mi aplikację SaaS z logowaniem” w pustym katalogu. Różnica jest ogromna.

## Pierwsze dziesięć minut

- repozytorium i szkielet z narzędzia frameworka;
- `CLAUDE.md`: stos, polecenia, konwencje;
- `.mcp.json`, jeśli używasz MCP;
- formatowanie kodu: Biome albo ESLint z Prettierem;
- struktura katalogów;
- pierwsza działająca strona albo trasa;
- `.gitignore` z `node_modules/`, `.env` i `.env.local`;
- pierwszy commit.

## Dlaczego to działa

Jakość kodu z AI zależy od jakości kontekstu. Przygotowany projekt daje:

- **ścieżki**, do których model pisze importy;
- **konwencje**, których się trzyma;
- **istniejący kod**, który naśladuje;
- **typy**, z których korzysta.

Dziesięć minut przygotowania daje to, czego nie da sto linii polecenia: kontekst struktury.

## Częste błędy

- **Brak formatowania.** Kod z AI bywa niespójny. Ustaw formatowanie przy zapisie i przed commitem.
- **Brak wczesnego commita.** Pierwszy commit po szkielecie pozwala `git diff` pokazać, co dokładnie zmieniło AI.
- **Nadmiar szkieletu.** Nie twórz pięćdziesięciu pustych plików na zapas. Rób to, co wiesz, że potrzebne.
- **Zapomniany `.gitignore`.** Sekrety z `.env` nigdy nie mogą trafić do repozytorium.

Gotowe przepisy dla czterech typów projektów: [gotowe stosy](https://tukamil.com/niewidzialna-architektura/stosy/).

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: patterns/project-scaffolding.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/nowy-projekt/
