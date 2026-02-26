# Vibecoding Rules (Condensed for Agent Context)

> Load this file as base methodology context for any vibecoding-related task.

## Core Principle

Vibecoding = programming by describing intent to AI, reviewing output, iterating. You architect, AI builds. Understanding matters more than memorization.

## The Loop

1. **Prompt** — describe desired behavior (not implementation details)
2. **Generate** — let AI write code
3. **Review** — read every line, check for correctness + security
4. **Iterate** — refine with follow-up prompts
5. **Commit** — save working state before next change

## Environment Setup

- Write CLAUDE.md / .cursorrules with: stack, structure, conventions, commands, gotchas
- Configure MCP servers: filesystem, github, postgres (match your stack)
- Scaffold with framework CLI first, then vibecode features
- Keep CLAUDE.md under 200 lines (AI skims long files)

## Tool Selection

| Scenario | Tool |
|---|---|
| Greenfield / multi-file / refactoring | Claude Code |
| Editing existing code / tab completion | Cursor |
| Inline completion in VS Code | GitHub Copilot |
| Quick UI prototype | Bolt, v0, Lovable |
| Full-stack prototype + deploy | Replit Agent |

## When to Vibecode

**Do vibecode:** boilerplate, CRUD, standard patterns, UI components, tests, docs, config files, migrations, API routes

**Don't vibecode:** performance-critical paths, novel algorithms, security-sensitive code, core business logic requiring deep understanding

## Prompt Patterns

- Be specific about behavior: "function that returns active users with subscriptions" not "use map to filter"
- Provide context: "Read src/lib/auth.ts first, then add admin role check"
- One feature per prompt
- Reference files by path, let AI read them via MCP
- Ask for tests alongside implementation

## Stack Defaults (2026)

| Need | Default Pick |
|---|---|
| Frontend + deploy | Next.js on Vercel |
| Database | Supabase (Postgres + auth + realtime) |
| Serverless Postgres | Neon |
| Auth | Clerk or Supabase Auth |
| Payments | Stripe |
| Email | Resend |
| AI integration | Vercel AI SDK + Anthropic |
| Vector search | pgvector (in Supabase/Neon) |
| Background jobs | Inngest or Trigger.dev |
| Cache/queue | Upstash Redis |
| Object storage | Cloudflare R2 |
| API framework | Hono or Fastify |
| Analytics | PostHog |

## MCP Essentials

Protocol connecting AI assistants to external tools. Standard servers:
- `filesystem` — read/write local files
- `github` — issues, PRs, repos
- `postgres` / `sqlite` — query DB directly
- `brave-search` — web search
- `context7` — library docs lookup
- `memory` — persistent knowledge graph
- `fetch` — HTTP requests

Configure in `.mcp.json` (project-level) or `~/.claude/mcp.json` (global).

## Anti-patterns

- Trusting AI output without reading it
- Prompts too vague ("make it better")
- CLAUDE.md over 200 lines
- Adding packages without understanding them
- Skipping commits between changes
- Over-engineering: AI tends to add unnecessary abstractions
- Multi-agent orchestration when single agent suffices
