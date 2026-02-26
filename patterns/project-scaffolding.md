# Project Scaffolding with AI

How to start projects so AI can help effectively from minute one.

## The Empty Repo Problem

AI coding tools produce worse output when working with empty repos. No file structure to reference. No conventions to follow. No existing patterns to match. The AI just guesses.

The fix: spend 10 minutes scaffolding before you start vibing.

## Scaffolding Strategy

### Step 1: Framework Boilerplate

Use official CLI tools. They set up TypeScript, linting, directory structure correctly.

```bash
# Next.js (SaaS, full-stack apps)
npx create-next-app@latest my-app --typescript --tailwind --app --src-dir

# Astro (content sites, landing pages)
npm create astro@latest my-site

# Hono (APIs, Workers)
npm create hono@latest my-api

# Fastify (Node.js APIs)
npx fastify-cli generate my-api --lang=ts
```

### Step 2: Write CLAUDE.md Immediately

Before writing any app code. The AI needs to know your stack and conventions.

```bash
touch CLAUDE.md
```

Minimum viable CLAUDE.md:

```markdown
# Project: my-app
[One line description]. [Framework] + [DB] + [key deps].

## Commands
- dev: `npm run dev`
- test: `npm test`
- build: `npm run build`

## Structure
[List key directories and what goes in them]

## Conventions
[3-5 rules you care about]
```

Takes 2 minutes. Saves hours of correcting AI output.

### Step 3: Set Up MCP Servers

Create `.mcp.json` in project root for tools the AI can use:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem", "/path/to/docs"]
    }
  }
}
```

MCP servers give Claude direct access to your database, APIs, docs. The AI reads schemas, runs queries, checks documentation without you copying and pasting.

### Step 4: Create Directory Structure

Even empty files help. The AI sees the structure and places new code correctly.

```bash
# Example for a Next.js project
mkdir -p src/{components,lib,actions,hooks,types}
mkdir -p src/app/api
touch src/lib/supabase.ts
touch src/lib/stripe.ts
touch src/types/index.ts
```

### Step 5: First Prompt

Now the AI has context. Your first prompt can be specific:

```
Read the project structure and CLAUDE.md. Then create a user
authentication flow using Clerk. Add sign-in and sign-up pages
at /sign-in and /sign-up, protect the /dashboard route.
```

Compare to prompting an empty repo: "Build me a SaaS app with auth." Night and day difference in output quality.

## Template Starters

### Next.js SaaS

```bash
npx create-next-app@latest my-saas --typescript --tailwind --app --src-dir
cd my-saas
npm i @supabase/ssr @clerk/nextjs stripe
mkdir -p src/{actions,hooks,types}
mkdir -p src/lib/{supabase,stripe}
```

### API Service

```bash
npm create hono@latest my-api  # select cloudflare-workers
cd my-api
npm i drizzle-orm zod
npm i -D drizzle-kit
mkdir -p src/{routes,middleware,schemas,db,lib,types}
```

### Astro Content Site

```bash
npm create astro@latest my-site  # select blog template
cd my-site
npx astro add tailwind
mkdir -p src/content/{posts,projects}
```

## First 10 Minutes Checklist

```
[ ] Init repo + framework CLI
[ ] Write CLAUDE.md (stack, commands, conventions)
[ ] Set up .mcp.json (if using MCP-compatible tool)
[ ] Configure formatter: biome init or eslint + prettier
[ ] Create directory structure
[ ] First working route or page
[ ] git init + first commit
```

## Why This Works

AI code generation depends on context quality. A scaffolded project provides:

- **File paths** the AI references when creating imports
- **Conventions** the AI follows for naming and structure
- **Existing code** the AI pattern-matches against
- **Type definitions** the AI uses for autocomplete and generation

10 minutes of scaffolding gives the AI what 100 lines of prompting can't: structural context.

## Common Mistakes

**Skipping the formatter.** AI-generated code has inconsistent formatting. Set up Biome or Prettier with format-on-save. Run the formatter before every commit.

```bash
# Biome (fast, recommended)
npx @biomejs/biome init
```

**Not committing early.** First commit after scaffolding means you can always `git diff` to see what the AI changed. You can revert specific AI changes without losing your scaffold.

**Over-scaffolding.** Don't create 50 empty files "just in case." Scaffold what you know you need. Let the structure grow organically as you build features.

**Forgetting .gitignore.** Framework CLIs usually handle this, but double-check. `node_modules/`, `.env`, `.env.local` must be ignored.
