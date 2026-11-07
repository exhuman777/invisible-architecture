# Internet agentów

> Protokoły i formaty, przez które agenci AI łączą się z narzędziami i ze sobą.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Internet uczy się mówić do maszyn

Agenci AI coraz rzadziej udają człowieka przed przeglądarką. Dostają własne protokoły, rejestry i formaty. Ta strona mapuje to, co działa na 7 listopada 2026 roku.

```text
A2A          agenci rozmawiają z agentami
Skills       przenośne umiejętności agentów (SKILL.md)
MCP          agenci łączą się z narzędziami
AGENTS.md    instrukcje projektu dla agentów do kodu
infrastruktura: serwery, API, bazy, pliki
```

## Wspólny dom: Agentic AI Foundation

W grudniu 2025 roku Linux Foundation założyła Agentic AI Foundation (AAIF). Projekty założycielskie to MCP (od Anthropic), AGENTS.md (od OpenAI) i goose (od Block). Później do fundacji dołączył też protokół A2A. Standardy agentów mają więc neutralnego opiekuna.

## MCP: agent łączy się z narzędziami

Otwarty protokół od Anthropic (listopad 2024). Jeden serwer MCP działa z każdym zgodnym klientem. Komunikaty w JSON-RPC 2.0, transporty stdio i Streamable HTTP, aktualna specyfikacja z 28 lipca 2026 roku. Rozszerzenia opcjonalne obejmują m.in. Tasks (długie operacje asynchroniczne), MCP Apps (interaktywne elementy w rozmowie) i Skills over MCP.

Szczegóły i konfiguracja: [MCP po polsku](https://tukamil.com/niewidzialna-architektura/mcp/).

- [Specyfikacja](https://modelcontextprotocol.io/specification/latest)
- [Oficjalny rejestr](https://registry.modelcontextprotocol.io/)
- [Serwery referencyjne](https://github.com/modelcontextprotocol/servers)

## Agent Skills: przenośne umiejętności

Otwarty format, który pierwotnie opracował Anthropic. Skill to folder z plikiem `SKILL.md`: na górze metadane (co najmniej `name` i `description`), niżej instrukcje. Obok mogą leżeć skrypty, materiały i szablony.

```text
moj-skill/
├── SKILL.md       wymagany: metadane i instrukcje
├── scripts/       opcjonalnie: kod do uruchomienia
├── references/    opcjonalnie: dokumentacja
└── assets/        opcjonalnie: szablony
```

Agent ładuje skille stopniowo:

1. **odkrycie:** na starcie czyta tylko nazwę i opis każdego skilla;
2. **aktywacja:** gdy zadanie pasuje do opisu, czyta cały `SKILL.md`;
3. **wykonanie:** postępuje według instrukcji, w razie potrzeby uruchamia skrypty.

Dzięki temu agent trzyma pod ręką wiele skilli, a w kontekście ma tylko te potrzebne. Skille obsługują m.in. Claude Code i Codex.

- [agentskills.io](https://agentskills.io/): specyfikacja i lista klientów
- [skills.sh](https://skills.sh/): katalog skilli do instalacji

## AGENTS.md: README dla agentów

Prosty, otwarty format pliku Markdown z instrukcjami projektu dla agentów do kodu: jak zbudować, jak testować, jakie konwencje. Dziś prowadzi go AAIF. Czytają go m.in. Codex, Cursor, GitHub Copilot, Gemini CLI, Aider, Zed, Windsurf (dziś Devin Desktop), Devin, Junie i VS Code, a Claude Code potrafi czytać go zamiast `CLAUDE.md`.

- [agents.md](https://agents.md/)
- Więcej o plikach z instrukcjami: [CLAUDE.md i AGENTS.md](https://tukamil.com/niewidzialna-architektura/claude-md/)

## A2A: agent rozmawia z agentem

Protokół Agent2Agent opracował Google i przekazał go Linux Foundation, a potem projekt dołączył do AAIF. MCP łączy agenta z narzędziami, A2A łączy agentów różnych firm ze sobą, bez wspólnej pamięci i narzędzi. Aktualna jest wersja 1.0. Projektem kieruje komitet techniczny z przedstawicielami m.in. AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP i ServiceNow.

- [a2a-protocol.org](https://a2a-protocol.org/latest/)

## x402: płatności między maszynami

x402 to otwarty standard płatności wbudowanych w zwykłe żądania HTTP. Gdy żądanie przychodzi bez płatności, serwer odpowiada kodem 402, a klient płaci i ponawia żądanie. Główny przypadek użycia to płatności stablecoinami, standard nie jest przywiązany do jednej sieci.

- [x402.org](https://www.x402.org/)

## llms.txt: strona czytelna dla modeli

Propozycja Jeremy’ego Howarda z 2024 roku: plik `/llms.txt` w Markdown z krótkim opisem strony i listą linków do treści przyjaznych modelom. Format: tytuł H1, streszczenie w cytacie, sekcje H2 z linkami i sekcja „Optional” z linkami do pominięcia. Ta strona też ma [llms.txt](https://tukamil.com/llms.txt) i wersję Markdown każdej podstrony.

- [llmstxt.org](https://llmstxt.org/)

## Zbuduj pierwszą aplikację dla agentów

Wzorzec:

1. Weź własny drobny problem: zakładki, lista projektów, notatki.
2. Owiń go w serwer MCP: narzędzia do działań, zasoby do danych.
3. Przetestuj w MCP Inspector: `npx @modelcontextprotocol/inspector`.
4. Podłącz do klienta, np. `claude mcp add --transport stdio zakladki -- python serwer.py`.
5. Opcjonalnie opublikuj w oficjalnym rejestrze MCP.

Przykład serwera zakładek w Pythonie:

```python
import json, pathlib
from mcp.server.fastmcp import FastMCP

PLIK = pathlib.Path("zakladki.json")
mcp = FastMCP("zakladki")

def wczytaj() -> list:
    return json.loads(PLIK.read_text()) if PLIK.exists() else []

@mcp.tool()
def dodaj(adres: str, opis: str) -> str:
    """Zapisuje zakładkę z krótkim opisem."""
    lista = wczytaj()
    lista.append({"adres": adres, "opis": opis})
    PLIK.write_text(json.dumps(lista, ensure_ascii=False, indent=2))
    return f"Zapisane. Zakładek: {len(lista)}"

@mcp.tool()
def szukaj(fraza: str) -> list:
    """Zwraca zakładki, których opis zawiera frazę."""
    return [z for z in wczytaj() if fraza.lower() in z["opis"].lower()]

mcp.run()
```

Potem mówisz do Claude: „zapisz ten artykuł o DNS w zakładkach”, a agent sam woła `dodaj`.

## Dokąd to zmierza

MCP daje agentom narzędzia. Skille dają im umiejętności. A2A pozwala im rozmawiać. AGENTS.md mówi im, jak pracować w projekcie. Tak jak HTTP, DNS i TLS złożyły się na sieć dla ludzi, te standardy składają się na sieć dla agentów.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: guides/agentic-internet.md, agentic-internet.html z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/internet-agentow/
