# MCP po polsku

> Jeden protokół, przez który AI sięga do plików, baz, repozytoriów i API.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Czym jest MCP

Model Context Protocol (MCP) to otwarty protokół, przez który aplikacje z AI łączą się z narzędziami i danymi. Porównanie z USB-C dobrze oddaje sens: jedno złącze, dowolne urządzenie.

MCP stworzył Anthropic w listopadzie 2024 roku. W grudniu 2025 roku Linux Foundation założyła Agentic AI Foundation (AAIF) i MCP stał się jednym z trzech projektów założycielskich, obok AGENTS.md od OpenAI i goose od Block. Protokołem opiekuje się więc neutralna fundacja, a nie jedna firma.

Przed MCP każde narzędzie AI miało własny sposób podłączania integracji. Dziś jeden serwer MCP działa z każdym zgodnym klientem: Claude Code, Claude Desktop, Cursor, VS Code, Codex i wieloma innymi.

## Po co to vibecoderowi

Bez MCP rozmowa wygląda tak: prosisz o poprawkę, AI prosi o plik, wklejasz, AI prosi o kolejne pliki, wklejasz, dostajesz propozycję i nanosisz ją ręcznie.

Z MCP AI samo czyta pliki, sprawdza schemat bazy, zagląda do historii w Git i nanosi poprawkę. Przestaje być czatem z tekstem na wejściu i wyjściu, a zaczyna działać w Twoim środowisku.

Przykłady poleceń:

- „Sprawdź tabelę users i przygotuj migrację z kolumną email_verified”;
- „Przejrzyj otwarte zgłoszenia na GitHubie i popraw to o logowaniu”;
- „Znajdź w aktualnej dokumentacji, jak Stripe obsługuje webhooki w Next.js, i wdróż to”.

## Jak to działa

Specyfikacja z 28 lipca 2026 roku opisuje trzy role:

- **host:** aplikacja z modelem, np. Claude Code albo edytor;
- **klient:** łącznik wewnątrz hosta, jeden na serwer;
- **serwer:** program, który udostępnia możliwości.

Komunikaty mają format JSON-RPC 2.0. Serwer udostępnia trzy rodzaje rzeczy:

| Element | Co daje |
|---|---|
| Narzędzia (tools) | funkcje, które model może wywołać, np. utworzenie zgłoszenia |
| Zasoby (resources) | dane do odczytu, np. treść pliku albo schemat bazy |
| Prompty (prompts) | gotowe szablony poleceń i przepływów |

Klient może zaoferować serwerowi elicitation, czyli dopytanie użytkownika o brakującą informację. Specyfikacja kładzie nacisk na zgodę: użytkownik musi rozumieć i zatwierdzać dostęp do danych i wywołania narzędzi, a opisy narzędzi z niezaufanego serwera traktuje się jako niezaufane.

### Transporty

Specyfikacja definiuje dwa standardowe transporty:

- **stdio:** klient uruchamia serwer jako proces i rozmawia z nim przez standardowe wejście i wyjście; typowe dla narzędzi lokalnych;
- **Streamable HTTP:** każdy komunikat to żądanie POST do jednego adresu, a odpowiedź przychodzi jako JSON albo strumień SSE; typowe dla serwerów zdalnych.

Starszy transport SSE ma w Claude Code status przestarzałego. Gdzie się da, wybieraj HTTP.

W wersji z lipca 2026 roku każde żądanie niesie wersję protokołu i możliwości klienta, więc żądania są samodzielne. Wcześniejsze wersje zaczynały od uścisku dłoni `initialize`, a specyfikacja opisuje, jak obie wersje się dogadują.

```text
Ty → host (Claude Code) → klient → transport (stdio albo HTTP) → serwer → Twoja baza, pliki, API
```

## Podłączanie serwerów w Claude Code

Serwer zdalny (zalecane):

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

Serwer lokalny przez stdio. Wszystko po `--` trafia do serwera bez zmian:

```bash
claude mcp add --transport stdio context7 -- npx -y @upstash/context7-mcp
```

Zasięg wybierasz flagą `--scope`:

| Zasięg | Gdzie działa | Gdzie zapisany |
|---|---|---|
| local (domyślny) | tylko ten projekt, tylko Ty | `~/.claude.json` |
| project | ten projekt, cały zespół przez Git | `.mcp.json` w katalogu projektu |
| user | wszystkie Twoje projekty | `~/.claude.json` |

Plik `.mcp.json` wygląda tak:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

Claude Code pyta o zgodę, zanim użyje serwerów z `.mcp.json` dodanych przez innych. Stan sprawdzisz poleceniem `claude mcp list` w terminalu albo `/mcp` w sesji.

Klucze API nie trafiają do repozytorium. Trzymaj je w zmiennych środowiskowych albo w zasięgu local.

## Serwery na start

Repozytorium referencyjne `modelcontextprotocol/servers` utrzymuje dziś siedem serwerów: Everything (testowy), Fetch, Filesystem, Git, Memory, Sequential Thinking i Time. Starsze serwery, m.in. GitHub, PostgreSQL, SQLite, Brave Search, Puppeteer i Slack, trafiły do archiwum. Do GitHuba używaj oficjalnego serwera GitHuba.

| Serwer | Do czego | Skąd |
|---|---|---|
| GitHub | repozytoria, zgłoszenia, pull requesty, Actions | [github/github-mcp-server](https://github.com/github/github-mcp-server), zdalnie `https://api.githubcopilot.com/mcp/` |
| Context7 | aktualna dokumentacja bibliotek w wersji, której używasz | [upstash/context7](https://github.com/upstash/context7), zdalnie `https://mcp.context7.com/mcp` |
| Filesystem | pliki w wybranym katalogu | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) |
| Git | historia i zmiany w repozytorium lokalnym | jak wyżej |
| Fetch | pobieranie stron i zamiana na tekst | jak wyżej |
| Memory | trwała pamięć w postaci grafu | jak wyżej |

Przed instalacją serwera społeczności przeczytaj jego kod, sprawdź datę ostatnich zmian i zakres uprawnień. Serwer MCP widzi Twoje dane.

## Własny serwer

Oficjalne SDK są m.in. dla TypeScriptu i Pythona. Minimalny serwer w Pythonie:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("moj-serwer")

@mcp.tool()
def powitanie(imie: str) -> str:
    """Wita osobę po imieniu."""
    return f"Cześć, {imie}!"

mcp.run()
```

Serwer przetestujesz w MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
```

Lista kontrolna:

1. Wybierz SDK.
2. Nazwij narzędzia jasno i opisz je jednym zdaniem.
3. Waliduj dane wejściowe (Zod w TypeScripcie, typy w Pythonie).
4. Błędy zwracaj jako treść, nie wywracaj procesu.
5. Przetestuj w Inspectorze.
6. Opublikuj w oficjalnym rejestrze.

## Gdzie szukać serwerów

- [Oficjalny rejestr MCP](https://registry.modelcontextprotocol.io/): katalog prowadzony przez społeczność MCP;
- [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers): serwery referencyjne i odnośnik do rejestru;
- [Smithery](https://smithery.ai/): katalog serwerów, dziś część Arcade;
- [Composio](https://composio.dev/): gotowe połączenia z ponad 1500 aplikacjami.

## Ściąga

1. Dodaj serwer GitHuba i Context7.
2. Dodaj serwer swojej bazy, jeśli projekt ją ma.
3. Wspólne serwery zapisz w `.mcp.json` (`--scope project`).
4. Sprawdź `/mcp`, czy wszystko jest połączone.
5. Sekrety trzymaj poza repozytorium.

Specyfikacja: [modelcontextprotocol.io](https://modelcontextprotocol.io/specification/latest). Dokumentacja Claude Code: [MCP w Claude Code](https://code.claude.com/docs/en/mcp).

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: guides/mcp-ecosystem.md, reference/mcp-directory.md, .agent/mcp-servers.yml z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/mcp/
