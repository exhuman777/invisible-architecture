# The Invisible Architecture

> **Po polsku:** Niewidzialna Architektura to baza wiedzy dla vibecoderów: esej w 13 rozdziałach o tym, jak działa internet (DNS, API, GitHub, kontenery, bazy, serwery, serverless, CDN, MCP i AI), i 15 poradników o vibecodingu, MCP, agentach AI i wyborze stosu. Polska wersja, przetłumaczona i sprawdzona na oficjalnych stronach 7.11.2026, leży w katalogu [`pl/`](pl/README.md), a na stronie z interakcjami czytasz ją na **[tukamil.com/niewidzialna-architektura](https://tukamil.com/niewidzialna-architektura/)**. Zacznij od [eseju](pl/esej.md) albo [MCP po polsku](pl/mcp.md).

**A vibecoding knowledge base for the modern web**

What started as a poetic visual essay about web infrastructure (`index.html`, 13 interactive chapters) expanded into a complete knowledge base for vibecoders. Tools, services, patterns, complete stack recipes. Both human-readable guides and machine-readable agent context.

---

## Quick Links

[![Live Essay](https://img.shields.io/badge/Live-Essay-blue)](index.html)
[![Guides](https://img.shields.io/badge/Docs-Guides-green)](guides/)
[![Reference](https://img.shields.io/badge/Docs-Reference-orange)](reference/)
[![Patterns](https://img.shields.io/badge/Docs-Patterns-purple)](patterns/)
[![Stacks](https://img.shields.io/badge/Docs-Stacks-red)](stacks/)
[![Agent Context](https://img.shields.io/badge/AI-.agent-black)](.agent/)

---

## File Map

```
invisible-architecture/
├── index.html                    # Interactive visual essay (13 chapters)
├── README.md                     # You are here
├── AGENTS.md                     # Instructions for coding agents (agents.md); CLAUDE.md = @AGENTS.md
│
├── guides/
│   ├── vibecoding-playbook.md    # Core vibecoding methodology
│   ├── mcp-ecosystem.md          # MCP protocol guide
│   ├── stack-selection.md        # Decision trees by project type
│   ├── agent-workflows.md        # Agent patterns + orchestration
│   └── ai-coding-tools.md       # Tool comparison (Cursor, Claude Code, Copilot, etc.)
│
├── reference/
│   ├── services-catalog.md       # Infrastructure services catalog
│   ├── ai-inference-providers.md # AI providers + models + pricing
│   ├── mcp-directory.md          # MCP registries, servers, clients
│   ├── agent-frameworks.md       # Framework comparison (LangChain, CrewAI, etc.)
│   └── vector-databases.md       # Vector DB comparison
│
├── patterns/
│   ├── claude-md.md              # CLAUDE.md patterns + examples
│   ├── project-scaffolding.md    # Scaffolding projects with AI
│   ├── prompt-patterns.md        # Prompt engineering for code
│   └── debugging-with-ai.md     # AI debugging workflow
│
├── stacks/
│   ├── solo-saas.md              # Solo founder SaaS stack
│   ├── ai-app.md                 # AI-powered app stack
│   ├── static-site.md            # Static/portfolio stack
│   └── api-service.md            # API backend stack
│
├── pl/                           # Polska wersja (esej + 15 poradników), tukamil.com/niewidzialna-architektura
│
└── .agent/
    ├── README.md                 # Agent loading instructions
    ├── services.yml              # Structured service data
    ├── mcp-servers.yml           # Structured MCP data
    ├── stack-decisions.yml       # Decision tree data
    └── vibecoding-rules.md       # Condensed methodology
```

---

## For Humans

Four directories, each with a distinct purpose:

### `guides/`
Methodology and workflow. Start with `vibecoding-playbook.md` for the core loop, then branch into MCP, stack selection, agent workflows, or tool comparisons based on what you need.

### `reference/`
Catalog-style docs. Services, AI providers, MCP servers, agent frameworks, vector databases. Each file covers one domain with comparison tables, pricing notes, and recommendations.

### `patterns/`
Practical recipes. How to structure `CLAUDE.md` files, scaffold projects with AI, write effective prompts for code generation, and debug using AI assistants.

### `stacks/`
Complete stack blueprints by project type. Each file walks through a specific archetype (solo SaaS, AI app, static site, API service) with concrete tool choices, deployment setup, and cost estimates.

---

## For AI Agents

This repo follows the [AGENTS.md](https://agents.md/) standard: instructions for coding agents working on it live in [`AGENTS.md`](AGENTS.md), and `CLAUDE.md` is one line, `@AGENTS.md`. How and why: [`patterns/claude-md.md`](patterns/claude-md.md#agentsmd-one-file-for-every-agent).

The `.agent/` directory contains structured, machine-readable context designed for AI coding assistants.

See [`.agent/README.md`](.agent/README.md) for loading instructions.

Key idea: agents should load `vibecoding-rules.md` as base context, then selectively load YAML files based on the user's task. The YAML files provide structured data that agents can reason over without parsing prose.

---

## In practice: Agencja Agentów

The same method runs my agent agency, [Agencja Agentów](https://www.cyfrowypomocnik.com/#agenci): ready-made Claude agents for small businesses, installed into a private company folder on GitHub. Each folder uses open standards only:

| File | What | Standard |
|---|---|---|
| `AGENTS.md` | agent role, rules, file map | [AGENTS.md](https://agents.md/) |
| `CLAUDE.md` | one line `@AGENTS.md` | [Claude Code memory](https://code.claude.com/docs/en/memory) |
| `FIRMA.md`, `DECYZJE.md`, `STYL.md`, `WIEDZA/` | company facts, dated decisions, writing style, owner's knowledge | plain Markdown |
| `skills/<name>/SKILL.md` | agent skills (commands) | [Agent Skills](https://agentskills.io/) |
| `.claude-plugin/plugin.json` | an agent package to "hire" | [Claude Code plugins](https://code.claude.com/docs/en/plugins) |
| `.claude/settings.json` | hard blocks and hooks: no sending, no deleting | [settings](https://code.claude.com/docs/en/settings), [hooks](https://code.claude.com/docs/en/hooks) |
| connectors | mail, calendar, drive | [MCP](https://modelcontextprotocol.io/) |

Agents only write drafts; a human sends. Full walkthrough in Polish: [Jak to robię u siebie](https://tukamil.com/niewidzialna-architektura/jak-to-robie/#agencja-agentow-ta-sama-metoda-u-klientow).

---

## Contributing

PRs welcome. Keep the style: concise, technical, no fluff. Prose guides go in `guides/` or `patterns/`. Structured data goes in `.agent/`. Every new file needs a line in the file map above.

---

<sub>Built by [exhuman](https://github.com/exhuman777) | [github.com/exhuman777/invisible-architecture](https://github.com/exhuman777/invisible-architecture)</sub>
