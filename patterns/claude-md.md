# CLAUDE.md Patterns

How to write effective project-level AI instructions. The single highest-leverage file in any AI-assisted codebase.

## What CLAUDE.md Does

Every AI coding tool reads a project instruction file automatically:

| Tool | File |
|------|------|
| Claude Code | `CLAUDE.md` (reads `AGENTS.md` itself when there is no `CLAUDE.md`) |
| Codex, Cursor, Gemini CLI, Jules, Aider, Zed and many more | `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md`, `AGENTS.md` |

Updated 10.11.2026: `.cursorrules` and `.windsurfrules` are legacy. The shared open standard is [`AGENTS.md`](https://agents.md/) (see below).

The AI reads this file before every interaction. Your conventions, preferences, stack details, gotchas, all loaded into context automatically. Without one, the AI guesses. With one, the AI knows.

Think of CLAUDE.md as onboarding docs for your AI pair programmer. Same stuff you'd tell a new hire on day one.

## Anatomy of a Good CLAUDE.md

Six sections cover 90% of needs:

### 1. Project Description (2 lines max)

```markdown
# Project: InvoiceBot
Automated invoice processing API. Hono + Cloudflare Workers + D1.
```

The AI now knows the domain, framework, and runtime. Every suggestion accounts for this.

### 2. Tech Stack Declaration

```markdown
## Stack
- Runtime: Cloudflare Workers
- Framework: Hono v4
- Database: D1 (SQLite) via Drizzle ORM
- Auth: JWT (jose library)
- Validation: Zod
- Testing: Vitest
```

Explicit beats implicit. The AI won't suggest Express middleware or Prisma when it knows you use Hono and Drizzle.

### 3. File Structure Overview

```markdown
## Structure
src/
  routes/       - One file per resource (users.ts, invoices.ts)
  middleware/    - Auth, rate limiting, error handling
  schemas/      - Zod validation schemas
  db/
    schema.ts   - Drizzle schema
    migrations/ - Generated migrations
  lib/          - Shared utilities
  types/        - TypeScript types
```

The AI places new code in the right directory. No more random file creation.

### 4. Coding Conventions

```markdown
## Conventions
- Named exports only (no default exports except route files)
- Errors: throw HTTPException, global handler catches
- Naming: camelCase for functions/vars, PascalCase for types
- Imports: use @/ path alias for src/
- Async: always use async/await, never .then()
- Prefer early returns over nested conditionals
```

### 5. Commands + Testing

```markdown
## Commands
- dev: `wrangler dev`
- test: `vitest run`
- test:watch: `vitest`
- lint: `biome check .`
- deploy: `wrangler deploy`
- db:generate: `drizzle-kit generate`
- db:migrate: `wrangler d1 migrations apply prod-db`

## Testing
- Unit tests next to source: `foo.ts` → `foo.test.ts`
- Integration tests in `tests/`
- Use `createTestApp()` helper from `tests/utils.ts`
- Always test error cases, not just happy path
```

### 6. Gotchas + Don'ts

```markdown
## Don't
- Don't use node:crypto (use Web Crypto API, Workers runtime)
- Don't install new dependencies without asking
- Don't use `any` type
- Don't create API routes without Zod validation

## Gotchas
- D1 doesn't support JSON columns, use TEXT + JSON.parse
- Workers have 128MB memory limit
- Drizzle migrations must be applied via wrangler CLI, not programmatic
```

This section prevents repeat mistakes. Every time the AI makes an error, add it here.

## Real Examples

### Example 1: Next.js SaaS

```markdown
# Project: SaaSKit
Next.js 15 + Supabase + Stripe. TypeScript strict mode.

## Structure
src/app/          - App router pages
src/components/   - React components (shadcn/ui)
src/lib/          - Utilities, Supabase client, Stripe helpers
src/actions/      - Server actions (mutations)
src/hooks/        - Custom React hooks

## Conventions
- Server actions for mutations, not API routes
- 'use client' only when component needs interactivity
- Supabase client: `createClient()` from `@/lib/supabase/server`
- Styling: Tailwind only, no CSS modules
- Tests: Vitest + Testing Library. Run: `pnpm test`
- Components: named exports, one component per file

## Don't
- Don't use pages/ router (app/ only)
- Don't install new packages without asking
- Don't use default exports except for page.tsx/layout.tsx
- Don't fetch data in client components (use server components)
- Don't use useEffect for data fetching

## Auth
- Clerk handles auth. Middleware in src/middleware.ts
- Protected routes: use auth() from @clerk/nextjs/server
- Client side: use useUser() hook

## Database
- Supabase with Row Level Security enabled
- All tables have RLS policies
- Use supabase.from('table').select() pattern
- Never expose service_role key client-side
```

### Example 2: API Service

```markdown
# ChainLog API
Hono on Cloudflare Workers + D1 (SQLite) + Drizzle ORM.

## Commands
- dev: `wrangler dev`
- deploy: `wrangler deploy`
- db:generate: `drizzle-kit generate`
- db:migrate: `wrangler d1 migrations apply chainlog-db`
- test: `vitest run`

## Patterns
- Routes in src/routes/, one file per resource
- Validation: Zod schemas in src/schemas/
- Auth: Bearer token middleware in src/middleware/auth.ts
- Errors: throw HTTPException, global handler catches
- Response format: always `{ data, error, meta }` shape

## Endpoints
- GET /api/logs - List logs (paginated)
- POST /api/logs - Create log entry
- GET /api/logs/:id - Get single log
- POST /api/verify - Verify log against chain

## Types
- All request/response types in src/types/api.ts
- Database types generated from Drizzle schema
- Zod schemas infer TypeScript types: `type Log = z.infer<typeof logSchema>`
```

### Example 3: Minimal (still useful)

```markdown
# Portfolio Site
Astro 5 + Tailwind. Deploy to Cloudflare Pages.

Dev: `npm run dev`
Build: `npm run build`

Content in src/content/ as MDX.
Components in src/components/ as .astro files.
Use Astro components, not React (zero JS shipped).
```

Even 10 lines beats nothing. The AI knows the framework, build tool, and component preference.

## Anti-patterns

**Too long (>200 lines).** The AI context window handles long files, but signal-to-noise ratio drops. Keep CLAUDE.md tight. Move detailed docs to separate files and reference them.

**Too vague.** "Write clean code" and "follow best practices" communicate nothing. Be specific: "Use early returns" and "Max function length: 50 lines."

**Contradictory rules.** "Use server actions for everything" plus "All mutations go through API routes" confuses the AI. Pick one approach.

**Including secrets.** CLAUDE.md gets committed. Put secrets in `.env` and reference the variable names only.

**Never updating.** CLAUDE.md should evolve. Found a bug the AI keeps making? Add it to gotchas. Changed a convention? Update the file.

## AGENTS.md: one file for every agent

[AGENTS.md](https://agents.md/) is an open standard: a README for agents. Since December 2025 it is stewarded by the Agentic AI Foundation (Linux Foundation), alongside MCP.

- Plain Markdown, no required fields.
- Root file plus optional nested `AGENTS.md` per sub-project: the closest file wins, an explicit chat prompt overrides everything.
- Test and lint commands listed in it get run by the agent, which fixes failures before finishing.
- Living documentation: update it with the code.

Recommended setup with Claude Code:

```text
AGENTS.md     all project instructions (single source of truth)
CLAUDE.md     one line: @AGENTS.md
```

Claude Code (v2.1.277+) reads `AGENTS.md` on its own only when the project has no `CLAUDE.md` or `CLAUDE.local.md`, so one private `CLAUDE.local.md` silently switches it off. The `@AGENTS.md` import works in every version and every session, and the [Claude Code docs](https://code.claude.com/docs/en/memory) recommend it where native `AGENTS.md` reading is unavailable. agents.md suggests a symlink when migrating; the import is safer because symlinks break on Windows and when folders are copied.

How this looks in practice, including a whole agency of client agents built on it: [Jak to robię u siebie](https://tukamil.com/niewidzialna-architektura/jak-to-robie/) (Polish).

## Layered CLAUDE.md

Claude Code supports multiple levels:

```
~/.claude/CLAUDE.md              # Global (your personal preferences)
~/project/CLAUDE.md              # Project root (shared with team)
~/project/packages/api/CLAUDE.md # Package-level (specific to sub-project)
```

Rules merge. More specific files override general ones.

Global file: your formatting preferences, communication style, universal conventions.
Project file: stack, structure, commands, conventions for this codebase.
Package file: specifics for a monorepo sub-package.

## Maintenance

Update CLAUDE.md when:
- Adding a new major dependency
- Changing a convention (named vs default exports, for example)
- Discovering a gotcha the AI keeps hitting
- Changing the file structure

Review quarterly. Delete stale sections. Keep it honest.

The best CLAUDE.md reads like notes you'd write for yourself after a week away from the project. Quick, practical, no fluff.
