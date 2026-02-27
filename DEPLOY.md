# Invisible Architecture - Zo Deployment Guide

## Files Created/Modified

### New Files (paste into Zo)
1. **`invisible-architecture/api/invisible-architecture.ts`** - API endpoint for markdown articles
2. **`invisible-architecture/page.tsx`** - Full knowledge base hub page (replaces iframe wrapper)

### Modified Files
3. **`api/routes.ts`** - Updated IA card description and CTA

### Unchanged
- `pages/invisible-architecture.html` - The 105KB essay stays as-is
- All other pages (home, about, methodology, vibe-check, mindful, symbients)

---

## Step 1: Upload the API endpoint

Paste `invisible-architecture/api/invisible-architecture.ts` into Zo as a new API route.

Route path: `/api/invisible-architecture`

---

## Step 2: Upload the 18 markdown files to workspace

The markdown files need to exist at `/home/workspace/invisible-architecture/` on Zo's filesystem.

```bash
# Directory structure needed on Zo workspace:
/home/workspace/invisible-architecture/
  guides/
    vibecoding-playbook.md
    mcp-ecosystem.md
    stack-selection.md
    agent-workflows.md
    ai-coding-tools.md
  reference/
    services-catalog.md
    ai-inference-providers.md
    mcp-directory.md
    agent-frameworks.md
    vector-databases.md
  patterns/
    claude-md.md
    project-scaffolding.md
    prompt-patterns.md
    debugging-with-ai.md
  stacks/
    solo-saas.md
    ai-app.md
    static-site.md
    api-service.md
```

Ask Zo to create these directories and paste each file content.

Or, if SSH/file upload is available:
```bash
scp -r guides/ reference/ patterns/ stacks/ zo-workspace:/home/workspace/invisible-architecture/
```

---

## Step 3: Replace the page

Paste `invisible-architecture/page.tsx` into Zo, replacing the old iframe-only page.

Route: `/invisible-architecture` (page, public)

---

## Step 4: Update api/routes.ts

Replace the Invisible Architecture entry in the PROJECTS array with the updated version (new description, tech line, and CTA).

---

## Verification Checklist

- [ ] Visit `/invisible-architecture` - page loads with constellation background
- [ ] Essay tab shows iframe with the 105KB HTML essay
- [ ] Guides tab shows 5 article cards
- [ ] Reference tab shows 5 article cards
- [ ] Patterns tab shows 4 article cards
- [ ] Stacks tab shows 4 article cards
- [ ] Click any article card - fetches and renders markdown inline
- [ ] Tables in reference docs render as HTML tables
- [ ] Code blocks render with dark background
- [ ] Back button returns from reader to card grid
- [ ] Mobile: card grid collapses to 1 column
- [ ] Home page (`/`) shows updated IA card with "Explore" CTA
- [ ] API endpoint: `GET /api/invisible-architecture?file=guides/vibecoding-playbook.md` returns JSON
- [ ] API rejects path traversal: `?file=../../etc/passwd` returns 400
