# Narzędzia AI do pisania kodu

> Agenci w terminalu, edytory z AI i kreatory w przeglądarce: co które robi najlepiej.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Przegląd

Narzędzia do pisania kodu z AI dzielą się na trzy grupy: agenci w terminalu i chmurze, edytory z AI oraz kreatory aplikacji w przeglądarce. Cen tu nie podaję, bo zmieniają się często. Przy każdym narzędziu jest link do strony, gdzie sprawdzisz aktualny plan.

| Narzędzie | Rodzaj | Najlepsze do | Pliki z instrukcjami |
|---|---|---|---|
| Claude Code | agent: terminal, IDE, aplikacja, przeglądarka | nowe projekty, zmiany w wielu plikach, automatyzacja | `CLAUDE.md`, też `AGENTS.md` |
| Codex (OpenAI) | agent: CLI, IDE, chmura, ChatGPT | zadania w repozytorium, praca w chmurze | `AGENTS.md` |
| GitHub Copilot | podpowiedzi, czat, agent, przegląd kodu | praca w ekosystemie GitHuba | `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md` |
| Cursor | edytor z AI | codzienna edycja istniejącego kodu | `.cursor/rules`, `AGENTS.md` |
| Devin Desktop (dawniej Windsurf) | edytor z AI i centrum agentów | edycja i agenci lokalnie lub w chmurze | `AGENTS.md` |
| Gemini CLI | agent w terminalu | praca z modelami Gemini | `GEMINI.md` |
| Aider | asystent w terminalu | dowolny model, automatyczne commity | `AGENTS.md` |
| v0, Bolt, Lovable, Replit Agent | kreatory w przeglądarce | prototyp w godzinę | według narzędzia |

## Claude Code

Agent do kodu od Anthropic. Czyta repozytorium, edytuje pliki, uruchamia polecenia i współpracuje z Gitem: tworzy gałęzie, commity i pull requesty. Działa w terminalu, w rozszerzeniach do VS Code i JetBrains, w aplikacji desktopowej i w przeglądarce na [claude.ai/code](https://claude.ai/code).

Mocne strony:

- `CLAUDE.md` i automatyczna pamięć projektu;
- MCP do łączenia z narzędziami i danymi;
- skille, czyli spakowane przepływy wywoływane poleceniem, np. `/review-pr`;
- hooki, które uruchamiają polecenia przed albo po działaniu agenta;
- subagenci do pracy równoległej;
- tryb bez interfejsu (`claude -p`) do skryptów, CI i GitHub Actions;
- zadania cykliczne w chmurze.

Instalacja na macOS, Linuksie i WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
cd moj-projekt
claude
```

Do pracy potrzebujesz subskrypcji Claude albo konta w Anthropic Console. Plany: [claude.com/pricing](https://claude.com/pricing). Dokumentacja: [code.claude.com](https://code.claude.com/docs/en/overview).

**Wybierz, gdy:** chcesz agenta, który robi, a nie tylko podpowiada.

## Codex

Agent do kodu od OpenAI. Działa w aplikacjach ChatGPT, w CLI, w rozszerzeniu do IDE i w chmurze (Codex Cloud). Czyta `AGENTS.md`, obsługuje MCP i skille. Dokumentacja: [learn.chatgpt.com/docs](https://learn.chatgpt.com/docs).

## GitHub Copilot

Podpowiedzi kodu w trakcie pisania, czat o plikach i repozytorium, tryb agenta do zadań w wielu krokach, agent w chmurze, który bierze zgłoszenie i oddaje pull request, oraz przegląd kodu. Instrukcje czyta z `.github/copilot-instructions.md`, plików `.github/instructions/*.instructions.md` i `AGENTS.md`, a zamiennie z `CLAUDE.md` albo `GEMINI.md` w katalogu głównym. Dokumentacja: [docs.github.com/copilot](https://docs.github.com/en/copilot/get-started/what-is-github-copilot).

## Cursor

Edytor z AI zbudowany na bazie VS Code. Reguły trzyma w `.cursor/rules` (w repozytorium), reguły użytkownika globalnie, reguły zespołu w panelu, a dla prostych przypadków czyta `AGENTS.md`. Claude Code ma też rozszerzenie do Cursora. Dokumentacja: [cursor.com/docs](https://cursor.com/docs/context/rules).

## Devin Desktop (dawniej Windsurf)

Edytor z AI. W lipcu 2025 roku Windsurf kupiła firma Cognition, twórca agenta Devin, a dziś edytor nazywa się Devin Desktop. Oprócz edytora ma centrum do uruchamiania i śledzenia agentów lokalnie i w chmurze. Wersja dla JetBrains działa dalej jako Windsurf. Czyta `AGENTS.md`. Strona: [devin.ai/desktop](https://devin.ai/desktop).

## Gemini CLI

Otwarty agent Google w terminalu, na licencji Apache 2.0. Obsługuje MCP i plik kontekstu `GEMINI.md`. Według repozytorium narzędzie celuje w organizacje z licencją Gemini Code Assist, a darmowy dostęp dla osób prywatnych przeszedł 18 czerwca 2026 roku do Antigravity CLI. Repozytorium: [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli).

## Aider

Programowanie w parze z modelem w terminalu. Łączy się z prawie każdym modelem, także lokalnym, i sam commituje zmiany z opisem. Strona: [aider.chat](https://aider.chat/).

## Kreatory w przeglądarce

- **[v0](https://v0.app/) od Vercela:** agent, który robi kod i aplikacje z opisu w języku naturalnym.
- **[Bolt](https://bolt.new/):** strony, aplikacje i prototypy z rozmowy z AI.
- **[Lovable](https://docs.lovable.dev/introduction/welcome):** platforma do budowania i wdrażania aplikacji webowych z opisu, z synchronizacją kodu do GitHuba, GitLaba albo Bitbucketa.
- **[Replit Agent](https://docs.replit.com/replitai/agent):** z opisu robi aplikację, sam sprawdza swoją pracę i prowadzi od planu do publikacji.

Dobre do prototypu, makiety i pokazu. Do produkcji zwykle przenosisz kod do repozytorium i dalej pracujesz agentem.

## Szybki wybór

- **Lubisz terminal:** Claude Code.
- **Wolisz edytor:** Cursor albo VS Code z Copilotem, w obu działa też rozszerzenie Claude Code.
- **Całe repozytorium na GitHubie:** Copilot albo Claude Code w GitHub Actions.
- **Prototyp na dziś:** v0, Bolt, Lovable albo Replit Agent.
- **Dowolny model, otwarty kod:** Aider.

## Łączenie narzędzi

Większość osób używa dwóch albo trzech narzędzi:

- Claude Code do nowych rzeczy i dużych zmian, edytor do drobnej codziennej edycji;
- v0 do szkicu interfejsu, Claude Code do podpięcia logiki;
- jeden plik `AGENTS.md` albo `CLAUDE.md` z zasadami, który czytają wszystkie narzędzia.

Nie wiesz, od czego zacząć? [Claude Start](https://start.cyfrowypomocnik.com/) przeprowadzi Cię przez instalację Claude krok po kroku.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: guides/ai-coding-tools.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/narzedzia-ai/
