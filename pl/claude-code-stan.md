# Claude Code: stan na 13.11.2026

> Skille, subagenci, hooki, wtyczki, pamięć i uprawnienia w Claude Code, sprawdzone w dokumentacji jednego dnia.

Stan na: 13.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Co tu jest

Zestawienie, jak Claude Code pakuje skille, subagentów, hooki, wtyczki, pamięć, uprawnienia, harmonogram, tryb bez okna i MCP. Do tego stan otwartych standardów (AGENTS.md, Agent Skills) i dwie inne platformy, które czytają te same pliki.

Każde zdanie sprawdziłem 13.11.2026 na stronie producenta. Adres źródła stoi przy każdym rozdziale. Cen tu nie ma: aktualne plany pokazuje [cennik Claude](https://claude.com/pricing).

Najnowsza wersja Claude Code tego dnia: 2.1.325 z 13.11.2026 ([dziennik zmian](https://code.claude.com/docs/en/changelog)).

## Skille

Źródło: [dokumentacja skilli](https://code.claude.com/docs/en/skills)

- Skill to folder z plikiem `SKILL.md`. Wszystkie pola nagłówka są opcjonalne, zalecane jest tylko `description`.
- Pola nagłówka: `name`, `description`, `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context`, `agent`, `background`, `hooks`, `paths`, `shell`, `metadata`, `license`, `compatibility`.
- `context` przyjmuje `fork` (skill działa w osobnym subagencie). `shell` przyjmuje `bash` (domyślnie) albo `powershell`.
- `description` razem z `when_to_use` jest ucinane na liście skilli po 1536 znakach. `SKILL.md` warto trzymać poniżej 500 linii (zalecenie).
- Miejsca: `~/.claude/skills/<nazwa>/` (Twoje), `.claude/skills/<nazwa>/` (projekt), `skills/<nazwa>/` we wtyczce i katalog zarządzany przez organizację.
- Gdy skill i plik w `.claude/commands/` mają tę samą nazwę, wygrywa skill. Starszy format `commands/` dalej działa.
- Podstawienia w treści: `$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`, `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PROJECT_DIR}`, a we wtyczkach także `${CLAUDE_PLUGIN_ROOT}` i `${CLAUDE_PLUGIN_DATA}`.

## Subagenci

Źródło: [dokumentacja subagentów](https://code.claude.com/docs/en/sub-agents)

- Pola wymagane: `name` i `description`. Nieznane pole jest pomijane bez komunikatu o błędzie, więc literówka w nazwie pola nie da ostrzeżenia.
- Pola opcjonalne, m.in.: `tools`, `disallowedTools`, `model`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `color`.
- `model`: alias `sonnet`, `opus`, `haiku` albo `fable`, pełny identyfikator modelu albo `inherit`.
- `memory`: `user`, `project` albo `local`. `isolation`: `worktree` (subagent pracuje w tymczasowym drzewie roboczym Gita).

| Priorytet | Miejsce | Zasięg |
|---|---|---|
| 1 (najwyższy) | ustawienia zarządzane | cała organizacja |
| 2 | flaga `--agents` | bieżąca sesja |
| 3 | `.claude/agents/` | bieżący projekt |
| 4 | `~/.claude/agents/` | wszystkie Twoje projekty |
| 5 (najniższy) | katalog `agents/` wtyczki | tam, gdzie wtyczka jest włączona |

Subagent dostarczony we wtyczce nie obsługuje pól `hooks`, `mcpServers` i `permissionMode`: Claude Code je pomija. Autor wtyczki wkłada hooki do `hooks/hooks.json`, a serwery MCP do `.mcp.json` wtyczki.

## Hooki

Źródło: [dokumentacja hooków](https://code.claude.com/docs/en/hooks)

- Ten sam układ obowiązuje w `settings.json` i w `hooks/hooks.json` wtyczki. Hooki z ustawień użytkownika, projektu, organizacji i z włączonych wtyczek łączą się, a nie zastępują.
- Typy: `command`, `http`, `mcp_tool`, `prompt` i `agent` (eksperymentalny).
- Wejście przychodzi jako JSON na stdin, m.in. `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name`, a przy zdarzeniach narzędzi także `tool_name`, `tool_input` i `tool_use_id`.

| Kod wyjścia polecenia | Skutek |
|---|---|
| 0 | akcja idzie dalej, Claude Code stosuje JSON wypisany przez hook |
| 2 | blokada na zdarzeniach, które da się zablokować; stderr trafia do modelu jako powód |
| inny niż 0 i 2 | błąd bez blokady: akcja idzie dalej, chyba że hook ma `onFailure: "block"` |

Pole `onFailure` (`"continue"` albo `"block"`) działa w hookach typu `command` i `http` i wymaga Claude Code 2.1.295 lub nowszego. Bez niego hook, który się wywrócił albo przekroczył czas, przepuszcza akcję. Dokumentacja mówi wprost: nie licz na to, że zawieszony hook zadziała jak bramka.

Wniosek praktyczny: zdanie w pliku pamięci to kontekst, a nie blokada. Twarda reguła („nigdy force-push”, „nigdy nie wysyłaj poczty”) należy do reguły `deny` w uprawnieniach albo do hooka `PreToolUse` z kodem 2, razem z testem, który sprawdza, że blokada działa.

## Wtyczki i marketplace

Źródła: [manifest wtyczki](https://code.claude.com/docs/en/plugins/manifest-reference), [tworzenie marketplace](https://code.claude.com/docs/en/plugins/create-marketplace), [hosting marketplace](https://code.claude.com/docs/en/plugins/host-marketplace), [polecenia wtyczek](https://code.claude.com/docs/en/plugins/cli-reference)

- Manifest leży w `.claude-plugin/plugin.json` i jest opcjonalny. Jeśli go piszesz, jedynym wymaganym polem jest `name`.
- Cała reszta leży w głównym katalogu wtyczki, a nie w `.claude-plugin/`: `skills/`, `agents/`, `commands/`, `hooks/hooks.json`, `.mcp.json`.
- Pole `version` przypina wersję. Jeśli je ustawisz i wypchniesz nowe commity bez zmiany numeru, użytkownicy ich nie dostaną. Bez `version` użytkownicy idą za commitami.
- `CLAUDE.md` w głównym katalogu wtyczki nie jest ładowany jako kontekst. Instrukcje wkłada się do skilla.
- Marketplace to plik `.claude-plugin/marketplace.json` z polami `name`, `owner` i `plugins`. Każdy wpis w `plugins` ma `name` i `source`.
- Składniki wtyczki dostają jej nazwę jako przedrostek, np. `/moja-wtyczka:skill`.
- Prywatne repozytorium (folder z plikami, który pamięta każdą zmianę) z marketplace: Claude Code uruchamia `git` na komputerze użytkownika bez pytań o hasło i korzysta z poświadczeń, które ten komputer już ma (klucz SSH w `ssh-agent` albo zapisane poświadczenie HTTPS, na GitHubie po `gh auth login` i `gh auth setup-git`). Plik `marketplace.json` nie ma pola na token.

```bash
claude plugin marketplace add <właściciel>/<repozytorium>
claude plugin install <wtyczka>@<marketplace> --scope user
claude plugin validate ./moja-wtyczka
```

`marketplace add` przyjmuje też adres repozytorium i ścieżkę lokalną. `--scope` przyjmuje `user` (domyślnie), `project` albo `local`.

## Pamięć

Źródło: [dokumentacja pamięci](https://code.claude.com/docs/en/memory)

- `CLAUDE.md` i `CLAUDE.local.md` z katalogu roboczego i katalogów nad nim ładują się na starcie. `~/.claude/CLAUDE.md` obowiązuje we wszystkich projektach.
- Import ma składnię `@ścieżka` i sięga najwyżej cztery poziomy w głąb. Zalecany rozmiar: poniżej 200 linii na plik.
- Pliki w `.claude/rules/` można ograniczyć do wzorców ścieżek polem `paths` w nagłówku.
- Pamięć automatyczna leży w `~/.claude/projects/<projekt>/memory/`. Na starcie ładuje się pierwsze 200 linii albo 25 KB pliku `MEMORY.md`. Wyłączysz ją ustawieniem `autoMemoryEnabled` albo zmienną `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`.
- `AGENTS.md`: Claude Code od wersji 2.1.277 czyta go sam, gdy w katalogu roboczym i nad nim nie ma `CLAUDE.md` ani `CLAUDE.local.md`. Gdy któryś z nich jest, domyślnie czyta tylko pliki `CLAUDE.md`. Jednolinijkowy `CLAUDE.md` z importem `@AGENTS.md` działa w obu przypadkach. Więcej w poradniku [CLAUDE.md i AGENTS.md](https://tukamil.com/niewidzialna-architektura/claude-md/).

Oba mechanizmy to kontekst, a nie wymuszona konfiguracja. Żeby zablokować akcję bez względu na decyzję modelu, dokumentacja odsyła do hooka `PreToolUse`.

## Uprawnienia i piaskownica

Źródła: [uprawnienia](https://code.claude.com/docs/en/permissions), [piaskownica](https://code.claude.com/docs/en/sandboxing)

- Kolejność reguł: najpierw `deny`, potem `ask`, potem `allow`. Reguła `allow` nie wytnie wyjątku z reguły `deny`.
- Blokujący hook (kod 2) zatrzymuje wywołanie narzędzia, zanim Claude Code sprawdzi reguły uprawnień.
- Tryby: `default` (w interfejsie „Manual”), `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`.
- Piaskownica działa na macOS, Linuksie i WSL2 i jest domyślnie wyłączona. Włącza ją `/sandbox` albo `sandbox.enabled` w ustawieniach. Na Windowsie bez WSL2 polecenia działają bez piaskownicy.

## Harmonogram i tryb bez okna

Źródła: [zadania w sesji](https://code.claude.com/docs/en/scheduled-tasks), [zadania w chmurze](https://code.claude.com/docs/en/routines), [tryb bez okna](https://code.claude.com/docs/en/headless)

| | Chmura | Aplikacja Desktop | `/loop` |
|---|---|---|---|
| Gdzie działa | chmura Anthropic | Twój komputer | Twój komputer |
| Komputer musi być włączony | nie | tak | tak |
| Potrzebna otwarta sesja | nie | nie | tak |
| Dostęp do plików lokalnych | nie (świeży klon repozytorium) | tak | tak |

- Zadania cykliczne z `/loop` wygasają po 7 dniach od utworzenia.
- Zadania w chmurze nazywały się wcześniej „routines”. Dokumentacja oznacza je jako podgląd badawczy.
- Tryb bez okna: `claude -p "<polecenie>"` z `--output-format text`, `json` albo `stream-json`.
- `--bare` pomija wykrywanie hooków, skilli, własnych poleceń, subagentów, wtyczek, serwerów MCP, pamięci automatycznej i `CLAUDE.md`. Nie używa logowania z subskrypcji: potrzebny jest `ANTHROPIC_API_KEY` albo `apiKeyHelper`. Hooki nie działają w tym trybie nawet wtedy, gdy podasz je przez `--settings`, więc reguły z plików i hooki ochronne tam nie obowiązują.

## Instalacja

Źródło: [instalacja](https://code.claude.com/docs/en/setup)

- Systemy: macOS 13.0 lub nowszy, Windows 10 1809 lub nowszy, Ubuntu 20.04 lub nowszy, Debian 10 lub nowszy, Alpine Linux 3.19 lub nowszy. Sprzęt: co najmniej 4 GB RAM.
- Instalator natywny nie wymaga Node.js. Na Windowsie zalecany jest Git for Windows (daje narzędzie Bash); bez niego Claude Code używa PowerShella.
- `claude doctor` pokazuje diagnostykę instalacji i ustawień. `claude update` aktualizuje od ręki.

macOS, Linux i WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

## MCP

Źródła: [MCP w Claude Code](https://code.claude.com/docs/en/mcp), [specyfikacja MCP](https://modelcontextprotocol.io/specification/latest)

```bash
claude mcp add --transport http <nazwa> <adres>
claude mcp add <nazwa> -- <polecenie>
```

- Zasięgi: `local` (domyślny, zapis w `~/.claude.json`), `project` (plik `.mcp.json` w repozytorium, wspólny dla zespołu) i `user` (wszystkie Twoje projekty).
- Transport SSE jest oznaczony jako przestarzały. Dokumentacja zaleca serwery HTTP.
- Strona „latest” specyfikacji wskazuje schemat `2026-07-28`.

Więcej w poradniku [MCP po polsku](https://tukamil.com/niewidzialna-architektura/mcp/).

## Otwarte standardy

### AGENTS.md

Źródło: [agents.md](https://agents.md/)

- Zwykły Markdown bez wymaganych pól. Wygrywa plik `AGENTS.md` najbliższy edytowanemu plikowi, a wyraźne polecenie użytkownika w czacie ma pierwszeństwo przed wszystkim.
- Opiekunem jest Agentic AI Foundation w Linux Foundation.
- Na stronie jako obsługujące wymienione są: Codex, Jules, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin, UiPath (Autopilot i Coded Agents), Junie, Amp, Cursor, RooCode, Gemini CLI, Kilo Code, Phoenix, Semgrep, agent kodujący GitHub Copilot, Ona, Windsurf i Augment Code.
- Dwa narzędzia trzeba skierować na plik ręcznie: Aider (`read: AGENTS.md` w `.aider.conf.yml`) i Gemini CLI (`"context": { "fileName": "AGENTS.md" }` w `.gemini/settings.json`).

### Agent Skills

Źródło: [agentskills.io](https://agentskills.io/)

- Folder z plikiem `SKILL.md` (co najmniej `name` i `description` oraz instrukcje) i opcjonalnymi katalogami `scripts/`, `references/` i `assets/`.
- Ładowanie stopniowe: na starcie agent czyta tylko nazwę i opis, pełną treść dopiero wtedy, gdy zadanie pasuje do opisu.
- Format opracował Anthropic i wydał jako otwarty standard.

### Inne platformy, które czytają te same pliki

Dwa wiersze poniżej pochodzą z dokumentacji, bez testu: nie uruchamiałem tych platform.

| Platforma | AGENTS.md | Foldery SKILL.md | Hooki wywołań narzędzi |
|---|---|---|---|
| Hermes Agent | główny plik kontekstu projektu; pierwszeństwo przed nim mają `.hermes.md` i `AGENTS.override.md` | `~/.hermes/skills/`, katalogi z `skills.external_dirs`, a po `hermes skills trust` także `.hermes/skills/` i `.agents/skills/` w projekcie; zgodność z agentskills.io | `pre_tool_call` i `post_tool_call`; hook może zablokować wywołanie |
| Abacus AI Desktop (CLI, VS Code, aplikacja) | `~/.abacusai/AGENTS.md`, `AGENTS.md` w głównym katalogu repozytorium i w otwartym folderze; wspólny limit 40 000 znaków | `.abacusai/skills/` i `.agents/skills/` w projekcie, `~/.abacusai/skills/` i `~/.agents/skills/`; `.claude/skills` nie jest przeszukiwany | m.in. `PreToolUse` i `PostToolUse`; kod wyjścia 2 blokuje |

Źródła, Hermes Agent: [skille](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [pliki kontekstu](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files), [hooki](https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks). Abacus AI Desktop: [AGENTS.md](https://abacus.ai/help/abacusai-desktop/agents-md), [skille](https://abacus.ai/help/abacusai-desktop/skills), [hooki](https://abacus.ai/help/abacusai-desktop/hooks).

Katalog `.agents/skills/` w projekcie czytają więc według dokumentacji co najmniej dwie platformy poza tymi, które trzymają się układu Claude Code.

## Co z tego wynika

1. Instrukcje trzymaj w `AGENTS.md`, a `CLAUDE.md` zrób jednolinijkowym importem. Reguły idą wtedy za projektem do każdego narzędzia, które czyta standard.
2. Logikę trzymaj w zwykłych skryptach, a hook niech je tylko woła. Strażnik, który czyta JSON ze stdin i kończy kodem 2, da się sprawdzić z terminala i przepiąć na inną platformę.
3. Pamięć to pliki, które się starzeją. Wszystko, co ma przetrwać zmianę komputera albo trafić do zespołu, należy do repozytorium, a nie do pamięci lokalnej narzędzia.
4. Tam, gdzie zachowanie zależy od wersji, przypnij minimalną wersję narzędzia (`onFailure` wymaga 2.1.295, samodzielne czytanie `AGENTS.md` wymaga 2.1.277).

## Czego nie udało się potwierdzić 13.11.2026

- Pełna kolejność pierwszeństwa plików ustawień: tej strony dokumentacji nie sprawdziłem.
- Data publikacji specyfikacji MCP: strona podaje tylko oznaczenie schematu `2026-07-28`.
- Pełna lista klientów Agent Skills: strona odsyła do osobnego katalogu, którego tu nie przenoszę.
- Działanie Hermes Agent i Abacus AI Desktop w praktyce: wiersze tabeli pochodzą z dokumentacji, bez testu.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: reference/claude-code-state-2026-11.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/claude-code-stan/
