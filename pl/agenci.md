# Agenci AI w firmie

> Z czego składa się agent, kiedy jeden wystarczy i jak pracuje zespół agentów.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Agent to model z rękami, pamięcią i planem

Agent AI to program, który sam planuje kolejne kroki i wywołuje narzędzia: czyta pliki, uruchamia polecenia, pisze do systemów. Sam model tylko odpowiada tekstem. Agent działa.

Agent potrzebuje warstw:

| Warstwa | Co robi | Przykłady |
|---|---|---|
| Model | myśli i decyduje | Claude przez API Anthropic, modele OpenAI, Google, modele otwarte przez Ollama |
| Narzędzia | działa na świecie | serwery MCP, rejestr MCP, Composio |
| Pamięć | pamięta między rozmowami | pgvector, Pinecone, Mem0 |
| Piaskownica | bezpiecznie uruchamia kod | E2B, Browserbase, Modal |
| Orkiestracja | prowadzi wiele kroków i agentów | Claude Agent SDK, AI SDK, LangGraph, CrewAI |

## Agenci w firmie: zasady, które się sprawdzają

- **Agent pisze szkic, człowiek wysyła.** Maile, oferty, posty i zmiany w systemach przechodzą przez akceptację.
- **Jedno źródło prawdy.** Wiedza firmy leży w plikach w repozytorium (opis firmy, styl, decyzje, obietnice), a agent czyta je na starcie.
- **Uprawnienia minimalne.** Agent dostaje tylko te narzędzia, których potrzebuje do zadania. Dostęp do odczytu tam, gdzie zapis nie jest konieczny.
- **Ślad.** Każda zmiana agenta to commit albo wpis w historii, więc wiesz, kto i co zmienił, i możesz to cofnąć.

Chcesz to u siebie w firmie? [Wdrożenie AI w 4 godziny](https://tukamil.com/wdrozenie-ai/).

## 1. Jeden agent w pętli

Domyślny wzorzec. Jeden agent, jedna rozmowa: polecenie, działanie, wynik, przegląd, kolejne polecenie.

```text
Ty → polecenie → agent → działanie → wynik → przegląd → polecenie → ...
```

Tak domyślnie działa Claude Code. Sprawdza się w większości zadań: nowe funkcje, poprawki, refaktoryzacja, dokumentacja. Ograniczenie: jedno zadanie naraz, a okno kontekstu zapełnia się przy dużych zmianach.

## 2. Agenci równolegle

Kilku niezależnych agentów pracuje jednocześnie nad osobnymi zadaniami.

```text
          ┌→ agent A (testy)
Ty ───────┼→ agent B (research biblioteki)
          └→ agent C (poprawki lintera)
```

W Claude Code możesz uruchomić kilka sesji obok siebie albo użyć subagentów: główny agent przydziela podzadania i zbiera wyniki. Sesje w tle podejrzysz w jednym widoku.

Kiedy: zadania od siebie niezależne, research równolegle z kodem, kilka podejść do jednego problemu. Ryzyko: konflikty w tych samych plikach.

## 3. Potok

Wynik agenta A jest wejściem agenta B: plan, implementacja, testy, przegląd.

```bash
claude -p "Zaplanuj wdrożenie funkcji X" > plan.md
claude -p "Wdróż plan z pliku plan.md i opisz zmiany" > zmiany.md
claude "Napisz testy do zmian opisanych w zmiany.md"
```

Flaga `-p` uruchamia Claude Code bez interfejsu, więc nadaje się do skryptów i CI. Ryzyko: wolno, a błąd z pierwszego etapu przechodzi dalej.

## 4. Orkiestrator

Jeden agent dzieli zadanie i przydziela je specjalistom, jak lider zespołu.

```text
              orkiestrator
            /      |       \
     frontend   backend    testy
```

Orkiestrator rozbija zadanie, przydziela podzadania, zbiera wyniki, rozwiązuje konflikty i sprawdza całość. W Claude Code główny agent robi to przez subagentów. W LangGraph opisujesz to jako graf stanów z węzłami i krawędziami.

## 5. Pętla przeglądu

Jeden agent pisze, drugi recenzuje, aż wynik spełni próg jakości. Recenzent ma świeży kontekst, więc widzi to, czego autor nie widzi. Ustal z góry maksimum rund, np. trzy, a potem decyduje człowiek.

## Kiedy wielu agentów

Jeden agent wystarcza do: funkcji (nawet dużych), poprawek, refaktoryzacji, testów, dokumentacji i przeglądu kodu.

Wielu agentów pomaga przy: dużej refaktoryzacji podzielonej na moduły, researchu równolegle z kodem, automatycznych etapach w CI, generowaniu podobnego kodu dla wielu encji.

Reguła: jeśli jeden agent skończy zadanie w jednej sesji i zostanie mu kontekstu, wystarczy jeden. Dodawaj agentów, gdy zadanie samo dzieli się na niezależne części albo etapy.

## Antywzorce

- **Nadmiar orkiestracji:** pięciu agentów do zadania na dziesięć minut.
- **Niekończący się przegląd:** brak limitu rund, więc ustaw trzy i oddaj decyzję człowiekowi.
- **Zgubiony kontekst:** wyniki pośrednie zapisuj w plikach, zamiast liczyć na pamięć agenta.
- **Konflikty zmian:** przydziel pliki agentom albo daj każdemu osobną gałąź.
- **Echo:** agent recenzuje agenta z tymi samymi uprzedzeniami, więc na końcu i tak patrzy człowiek.
- **Przedwczesna automatyzacja:** przejdź przepływ ręcznie trzy razy, potem automatyzuj.

## Frameworki do budowania agentów

| Framework | Język | Do czego |
|---|---|---|
| [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) | Python, TypeScript | narzędzia, pętla agenta, subagenci, hooki i MCP z Claude Code jako biblioteka |
| [AI SDK](https://ai-sdk.dev/) | TypeScript | aplikacje i agenci w React, Next.js, Vue, Svelte i Node.js, wielu dostawców modeli |
| [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) | Python | długo działający agenci ze stanem, przepływ jako graf |
| [CrewAI](https://docs.crewai.com/) | Python | zespoły agentów (crews) i przepływy (flows) |
| [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) | Python | agenci, przekazywanie zadań między agentami, guardrails |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | Python, .NET | agenci i przepływy wieloagentowe, ścieżki migracji z AutoGen i Semantic Kernel |
| [Mastra](https://mastra.ai/docs) | TypeScript | agenci i aplikacje AI |
| [Pydantic AI](https://pydantic.dev/docs/ai/overview/) | Python | typowana pętla agenta, łatwa zmiana modelu |

Szybki wybór:

- aplikacja na Next.js z czatem: AI SDK;
- agent na narzędziach Claude Code we własnej aplikacji: Claude Agent SDK;
- złożony przepływ ze stanem i powrotami: LangGraph;
- prosty zespół ról w Pythonie: CrewAI;
- środowisko Microsoftu: Microsoft Agent Framework.

## Ściąga

| Wzorzec | Agentów | Kiedy |
|---|---|---|
| Jeden w pętli | 1 | codzienna praca |
| Równolegle | 2 do 5 | niezależne zadania |
| Potok | 2 do 4 | etapy: plan, kod, testy |
| Orkiestrator | 3 i więcej | duże funkcje w wielu obszarach |
| Pętla przeglądu | 2 | kod wrażliwy, bramka jakości |

Zacznij od jednego agenta. Dodawaj kolejnych, gdy poczujesz wąskie gardło.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: guides/agent-workflows.md, reference/agent-frameworks.md, rozdział „What Agents Need” z eseju z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/agenci/
