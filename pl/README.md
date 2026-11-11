# Niewidzialna Architektura po polsku

Polska wersja bazy wiedzy The Invisible Architecture, przetłumaczona i zaktualizowana 7.11.2026. Każdy fakt o narzędziach, modelach, limitach i cenach sprawdzony na oficjalnych stronach; ceny zastąpione linkami do cenników.

Na stronie, z interakcjami i kursorem kometa: https://tukamil.com/niewidzialna-architektura/

## Pliki

- [esej.md](esej.md): esej w 13 rozdziałach o tym, jak działa internet
- [vibecoding.md](vibecoding.md): Vibecoding: poradnik. Pętla pracy z AI: opisujesz zachowanie, AI pisze kod, Ty czytasz, testujesz i commitujesz. (na podstawie: guides/vibecoding-playbook.md, .agent/vibecoding-rules.md)
- [mcp.md](mcp.md): MCP po polsku. Jeden protokół, przez który AI sięga do plików, baz, repozytoriów i API. (na podstawie: guides/mcp-ecosystem.md, reference/mcp-directory.md, .agent/mcp-servers.yml)
- [wybor-stosu.md](wybor-stosu.md): Wybór stosu. Domyślny wybór dla siedmiu typów projektów i pięć rad, jak nie przekombinować. (na podstawie: guides/stack-selection.md, .agent/stack-decisions.yml)
- [agenci.md](agenci.md): Agenci AI w firmie. Z czego składa się agent, kiedy jeden wystarczy i jak pracuje zespół agentów. (na podstawie: guides/agent-workflows.md, reference/agent-frameworks.md, rozdział „What Agents Need” z eseju)
- [narzedzia-ai.md](narzedzia-ai.md): Narzędzia AI do kodu. Agenci w terminalu, edytory z AI i kreatory w przeglądarce: co które robi najlepiej. (na podstawie: guides/ai-coding-tools.md)
- [internet-agentow.md](internet-agentow.md): Internet agentów. Protokoły i formaty, przez które agenci AI łączą się z narzędziami i ze sobą. (na podstawie: guides/agentic-internet.md, agentic-internet.html)
- [modele-ai.md](modele-ai.md): Modele AI i dostawcy. Aktualne modele Claude, inni dostawcy i platformy do uruchamiania modeli. (na podstawie: reference/ai-inference-providers.md)
- [uslugi.md](uslugi.md): Katalog usług. Usługi w dwunastu kategoriach, każda z jednym zdaniem i linkiem do źródła. (na podstawie: reference/services-catalog.md, .agent/services.yml)
- [bazy-wektorowe.md](bazy-wektorowe.md): Bazy wektorowe i RAG. Wyszukiwanie po znaczeniu: od pgvector w Postgresie do usług zarządzanych. (na podstawie: reference/vector-databases.md)
- [claude-md.md](claude-md.md): CLAUDE.md i AGENTS.md. Najważniejszy plik w projekcie z AI: co w nim pisać, a czego nie. (na podstawie: patterns/claude-md.md)
- [prompty.md](prompty.md): Prompty do kodu. Osiem wzorców poleceń i cztery błędy, które psują kod z AI. (na podstawie: patterns/prompt-patterns.md)
- [debugowanie.md](debugowanie.md): Debugowanie z AI. Jak szukać błędów z AI szybciej, nie tracąc rozumienia kodu. (na podstawie: patterns/debugging-with-ai.md)
- [nowy-projekt.md](nowy-projekt.md): Nowy projekt z AI. Dziesięć minut przygotowania, które oszczędzają godziny poprawek. (na podstawie: patterns/project-scaffolding.md)
- [stosy.md](stosy.md): Gotowe stosy. Cztery przepisy z poleceniami, kluczowym kodem i szablonem CLAUDE.md. (na podstawie: stacks/static-site.md, stacks/solo-saas.md, stacks/ai-app.md, stacks/api-service.md)
- [jak-to-robie.md](jak-to-robie.md): Jak to robię u siebie. Claude Code, statyczne strony na Vercel, ścisłe CSP i testy Playwright. (na podstawie: nowy rozdział, fakty z repozytoriów Kamila (AGENTS.md, README, testy))

## Co się zmieniło względem wersji angielskiej

- Było: Modele Claude Opus 4.6, Sonnet 4.6, Haiku 4.5, kontekst 200 tys. tokenów. Jest: Rodzina Claude 5: Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5, kontekst 1 mln tokenów. Źródło: https://platform.claude.com/docs/en/about-claude/models/overview
- Było: MCP pod „AI Alliance for Interoperability Foundation” od 2025. Jest: MCP w Agentic AI Foundation (Linux Foundation) od grudnia 2025, razem z AGENTS.md i goose. Źródło: https://www.infoq.com/news/2025/12/agentic-ai-foundation
- Było: Specyfikacja MCP z listopada 2025, transporty stdio, SSE, Streamable HTTP. Jest: Specyfikacja z 28.07.2026: stdio i Streamable HTTP, żądania samodzielne; SSE przestarzałe w Claude Code. Źródło: https://modelcontextprotocol.io/specification/latest
- Było: Serwery referencyjne github, postgres, sqlite, brave-search, puppeteer, slack. Jest: W repozytorium referencyjnym zostało 7 serwerów, reszta w archiwum; GitHub ma własny serwer github/github-mcp-server. Źródło: https://github.com/modelcontextprotocol/servers
- Było: Globalna konfiguracja MCP w ~/.claude/mcp.json. Jest: claude mcp add z zasięgiem local, project (.mcp.json) albo user (~/.claude.json). Źródło: https://code.claude.com/docs/en/mcp
- Było: Karpathy ukuł „vibecoding” na początku 2024. Jest: Wpis Karpathy’ego na X z lutego 2025; słowo roku 2025 słownika Collinsa. Źródło: https://www.questera.ai/blogs/history-of-vibe-coding-karpathy-tweet
- Było: .cursorrules i .windsurfrules jako pliki instrukcji. Jest: Cursor: .cursor/rules i AGENTS.md; Copilot: .github/copilot-instructions.md, AGENTS.md, CLAUDE.md; Claude Code czyta AGENTS.md, gdy w projekcie nie ma CLAUDE.md. Źródło: https://cursor.com/docs/context/rules
- Było: CLAUDE.md jako główny plik instrukcji w każdym projekcie. Jest: AGENTS.md jako jedno źródło instrukcji dla wszystkich agentów, CLAUDE.md z importem @AGENTS.md (działa w każdej wersji Claude Code). Źródło: https://code.claude.com/docs/en/memory
- Było: Agent Skills v1.0 „w drugiej połowie 2026”, liczby gwiazdek na GitHubie. Jest: Agent Skills jako otwarty format na agentskills.io; liczby gwiazdek usunięte (zmieniają się codziennie). Źródło: https://agentskills.io/
- Było: A2A w wersji 0.3. Jest: A2A w wersji 1.0, dołączył do Agentic AI Foundation. Źródło: https://a2a-protocol.org/latest/
- Było: GitHub: 100 mln programistów, 420 mln repozytoriów. Jest: Ponad 225 mln programistów i ponad 800 mln repozytoriów. Źródło: https://github.com/about
- Było: Cloudflare: 330+ centrów danych w 120+ krajach. Jest: Sieć w 348 miastach, ponad 13 tys. połączeń z innymi sieciami. Źródło: https://www.cloudflare.com/network/
- Było: Neon jako niezależny serverless Postgres. Jest: Neon jako oferta Databricks, z gałęziami i skalowaniem do zera. Źródło: https://neon.com/docs/introduction
- Było: PlanetScale jako serverless MySQL. Jest: PlanetScale hostuje Vitess i Postgres. Źródło: https://www.planetscale.com/
- Było: Smithery jako niezależny rynek MCP. Jest: Smithery jest częścią Arcade. Źródło: https://smithery.ai/
- Było: Gemini CLI jako darmowe narzędzie dla każdego. Jest: Gemini CLI dla organizacji z Gemini Code Assist; darmowy dostęp indywidualny w Antigravity CLI od 18.06.2026. Źródło: https://github.com/google-gemini/gemini-cli
- Było: Windsurf jako edytor Codeium. Jest: Windsurf kupiony przez Cognition w lipcu 2025, dziś nazywa się Devin Desktop. Źródło: https://devin.ai/desktop

## Co usunięte

- Wszystkie ceny i limity darmowych planów (hosting, bazy, narzędzia AI, modele, wektory): zmieniają się co kilka miesięcy, przy usługach są linki do cenników.
- Liczby gwiazdek repozytoriów i liczby serwerów w katalogach MCP i skilli: zmieniają się codziennie i nie mają jednego źródła.
- Porównania szybkości baz wektorowych i tabela kosztów modeli na 1000 wywołań: liczby z różnych testów, bez potwierdzenia u producentów.
- Nazwy i parametry modeli innych dostawców niż Anthropic (Llama, Qwen, Gemma, Phi i inne): bez jednego oficjalnego źródła na 7.11.2026, zostały linki.
- Platforma Zo (rozdział o personal cloud, poradnik zo-platform.md, mikrousługi na Zo, strony React pod Zo): poza zakresem działu.
- Google Domains (sprzedane), Quirrel, Glama, LanceDB, Turbopuffer, Augment Code, Vultr, Namecheap i licznik odwiedzin: oficjalna strona nie dała się sprawdzić albo pozycja nie wnosi treści.
- Opis Lucia Auth, WorkOS, BetterStack, Payload i Replicate ze starego dziennika zmian: bez potwierdzenia na stronach producentów.

Źródło prawdy dla tych plików: dział Niewidzialna Architektura na tukamil.com. Angielskie pliki w katalogach guides/, reference/, patterns/, stacks/ i .agent/ zostają bez zmian, poza patterns/claude-md.md (rozdział o AGENTS.md, 10.11.2026).
