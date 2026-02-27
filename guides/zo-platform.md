# Zo: The Modern Server for Vibecoders

Zo is a personal cloud server with AI built in. Not another chatbot. An actual Linux server you control through conversation. For vibecoders and solopreneurs who want to ship without managing infrastructure.

**What makes it different:** You describe what you want. Zo builds it, deploys it, and keeps it running. No YAML. No CI/CD pipeline. No DevOps.

---

## 1. What You Get

Every Zo account includes a full Linux server with root access, 100GB+ storage, and a public URL at `yourhandle.zo.space`.

| Feature | What It Does | Docs |
|---------|-------------|------|
| **Spaces** | Your personal domain. Pages, APIs, widgets. React + Tailwind + Hono. | [docs](https://docs.zocomputer.com/spaces) |
| **Sites** | Full web apps with backend, database, routing. TypeScript + Bun + Hono. | [docs](https://docs.zocomputer.com/sites) |
| **Services** | Any process with a public URL. Python, Node, anything. Auto-restart. | [docs](https://docs.zocomputer.com/servers) |
| **Agents** | Scheduled automations. Daily reports, monitoring, alerts via email/SMS. | [docs](https://docs.zocomputer.com/agents) |
| **Skills** | Reusable capability packages (SKILL.md). Share across agents and tools. | [docs](https://docs.zocomputer.com/skills) |
| **Selling** | Built-in Stripe Connect. Payment links, products, orders. 0% Zo fee. | [docs](https://docs.zocomputer.com/sell) |
| **MCP Server** | Expose your Zo as an MCP endpoint. Any AI tool can use your server. | [docs](https://docs.zocomputer.com/mcp-server) |
| **Custom Domains** | Point your own domain to any Zo service. SSL auto-provisioned. | [docs](https://docs.zocomputer.com/custom-domains) |
| **BYOK** | Bring your own API keys. OpenAI, Anthropic, Groq, OpenRouter. | [docs](https://docs.zocomputer.com/byok) |
| **Browser** | Built-in web browser. Zo can view, interact, and scrape pages. | [docs](https://docs.zocomputer.com/browser) |
| **File Sync** | Bidirectional sync between local machine and Zo workspace. | [docs](https://docs.zocomputer.com/sync-files) |
| **SSH Access** | Full SSH into your server. Use with Cursor, VS Code, any IDE. | [docs](https://docs.zocomputer.com/ssh-zo) |
| **GitHub** | Connect repos via gh CLI. Push, pull, deploy from Git. | [docs](https://docs.zocomputer.com/github) |
| **Personas** | Switch AI behavior modes. Tutor, writer, coder, researcher. | [docs](https://docs.zocomputer.com/personas) |
| **API** | Full REST API. Programmatic access to everything Zo can do. | [docs](https://docs.zocomputer.com/api) |
| **Integrations** | Gmail, Google Calendar, Notion, Linear, Airtable, Dropbox, Spotify. | [docs](https://docs.zocomputer.com/integrations) |
| **Claude Code** | Use Claude Code as an AI provider inside Zo. Pro/Max plans. | [docs](https://docs.zocomputer.com/claude-code) |

---

## 2. Pricing

| Plan | Price | AI Credits | Services | RAM | Custom Domains |
|------|-------|-----------|----------|-----|----------------|
| Free | $0 | Free models only | 1 | Limited | 0 |
| Basic | $18/mo | $10/mo included | 5 | 32GB | 3 |
| Pro | $64/mo | $40/mo included | 10 | 128GB | 5 |
| Ultra | $200/mo | $100/mo included | 50 | 512GB | 10 |

BYOK (Bring Your Own Key) lets you use your own API keys for any provider. You pay the provider directly, not Zo.

Full pricing: [docs](https://docs.zocomputer.com/billing)

---

## 3. The Stack Under the Hood

Zo Sites and Spaces run on a specific stack:

- **Runtime:** [Bun](https://bun.sh) (fast JS/TS runtime)
- **Framework:** [Hono](https://hono.dev) (minimal web framework)
- **Language:** TypeScript
- **Frontend:** React + Tailwind CSS + Lucide icons
- **Database:** SQLite (built-in) or external (Supabase, Convex)
- **Payments:** Stripe Connect (built-in)

Everything lives at `/home/workspace` on your server.

---

## 4. Space vs Hosting: How They Work Together

This confuses every new Zo user. Here's the deal.

Zo has two places to run things: **Space** and **Hosting**. They show up as two tabs in your Sites dashboard.

### Space (your `handle.zo.space` domain)

Your personal domain. Everything here shares one URL: `o.zo.space/whatever`.

Space holds two types of routes:
- **Pages** - React components (TSX). Your frontend. Rendered in the browser.
- **API routes** - Hono handlers (TypeScript). Backend logic. Return JSON.

Both are managed by Zo's built-in Bun + Hono runtime. You create them through conversation or the command palette. They deploy instantly.

```
o.zo.space
  /                    ← Home page (TSX)
  /about               ← About page (TSX)
  /vibe-check          ← Vibe Check frontend (TSX)
  /invisible-architecture  ← Knowledge base (TSX)
  /api/routes          ← Project list API (Hono/TS)
  /api/mindful         ← Mindful data API (Hono/TS)
```

**Limitation:** Space only runs TypeScript via Bun. No Python, no Go, no other runtimes.

Docs: [Space](https://docs.zocomputer.com/spaces)

### Hosting (standalone services)

Separate processes with their own URLs. Any language. Any runtime.

Each hosted service gets its own URL like `api-o.zocomputer.io` or `zite-50977-o.zo.computer`. You configure a port, entrypoint command, and environment variables.

```
Hosting
  api  (api-o.zocomputer.io)     ← Vibe Check Python backend (FastAPI)
  minimal  (zite-xxx.zo.computer)  ← Separate site project
```

Use Hosting when:
- Your backend is Python (like Vibe Check's FastAPI + Groq + Brave Search)
- You need a specific runtime (Go, Rust, Java, etc.)
- You're running a standalone service (Redis, database, etc.)
- You have a full Site project (not just a Space route)

Docs: [Services](https://docs.zocomputer.com/servers) | [Sites](https://docs.zocomputer.com/sites)

### When to Use Which

| Scenario | Where | Why |
|----------|-------|-----|
| React page | Space | TSX, managed by Zo |
| TypeScript API | Space (as `/api/...` route) | Hono/Bun, same domain |
| Python backend | Hosting | Different runtime |
| Full web app with its own DB | Hosting (Site) | Separate project |
| Static HTML page | Space (upload as asset) | Simple, fast |

### The Key Insight

**If you can write everything in TypeScript, keep it all in Space.** One domain, one stack, instant deploys. Your API routes at `/api/whatever` and your pages at `/whatever` all live together.

**If you need Python or another language for a specific backend**, that goes in Hosting. Your Space frontend calls it via its Hosting URL.

For the Invisible Architecture, all APIs (`/api/invisible-architecture`, `/api/agentic-registry`) are TypeScript/Hono, so they live in Space. The Vibe Check's Python backend is the only thing that needs Hosting.

---

## 5. Building a Paid Micro-Service on Zo

The full workflow, from zero to paid product:

### Step 1: Create the Service

Tell Zo what you want:

> "Build a service at /api/analyze that takes a URL, scrapes it with Brave Search, analyzes it with Llama 3.3, and returns a JSON report."

Zo writes the code, creates the route, deploys it.

### Step 2: Add Stripe Payment

Tell Zo:

> "Create a Stripe product called 'Website Analysis' for $2. Generate a payment link."

Zo creates the product in your connected Stripe account and gives you the payment link. 0% Zo fee. Standard Stripe processing only.

### Step 3: Gate the Service

Add payment verification to your API:

```typescript
// Check if user has paid before serving the analysis
const order = await verifyStripePayment(sessionId);
if (!order) return c.json({ error: "Payment required" }, 402);
```

### Step 4: Ship

Your service is live at `yourhandle.zo.space/api/analyze`. Payment link directs to Stripe. After payment, user gets the analysis. You get paid.

Stripe tools on Zo: [Create payment link](https://docs.zocomputer.com/tools/create-stripe-payment-link) | [List orders](https://docs.zocomputer.com/tools/list-stripe-orders) | [Update products](https://docs.zocomputer.com/tools/update-stripe-product)

---

## 6. Zo as an MCP Server

This is the killer feature for the agentic internet. Your Zo becomes an MCP endpoint that any AI tool can connect to.

**What it means:** Claude Code, Cursor, Gemini CLI, or any MCP client can use your Zo's 50+ tools. File operations, web browsing, integrations, image generation, bash commands. All accessible through a single MCP connection.

**Setup:**
1. Generate access token in Settings > Advanced
2. Configure your AI tool with the endpoint and token
3. Your AI tool now has a full cloud server at its disposal

Works with: Claude Code, Claude Desktop, Cursor, Zed, Gemini CLI, OpenCode, Codex, and any MCP-compatible client.

Full setup: [docs](https://docs.zocomputer.com/mcp-server)

---

## 7. Agents: 24/7 Automation

Zo Agents run on schedules. One-time or recurring. They have access to all your integrations and server capabilities.

**Examples:**
- Daily market research summary emailed at 8am
- Monitor a competitor's website for changes, alert via SMS
- Pull data from Google Calendar + Notion, generate a weekly review
- Scrape prices from 5 websites, compare, send Telegram alert

Agents use the same Skills and tools as your interactive Zo sessions.

Create: [docs](https://docs.zocomputer.com/tools/create-agent) | List: [docs](https://docs.zocomputer.com/tools/list-agents)

---

## 8. Skills: Portable Agent Capabilities

Zo implements the [Agent Skills specification](https://agentskills.io/). Skills are folders with a `SKILL.md` file that packages domain expertise into reusable capabilities.

```
Skills/market-analyzer/
  SKILL.md          # Instructions + metadata
  scripts/          # Supporting code
  references/       # Data files
  assets/           # Templates, examples
```

Skills work across Claude Code, OpenAI Codex, GitHub Copilot, and any agent supporting the standard. Build once on Zo, use everywhere.

Create: [docs](https://docs.zocomputer.com/skills)

---

## 9. Development Workflows

### SSH + IDE (for serious building)

Connect your IDE directly to Zo via SSH. Full remote development with Cursor, VS Code, or any editor.

```bash
# One-time setup
ssh-keygen -t ed25519 -C "you@email.com"
# Copy public key to Zo's ~/.ssh/authorized_keys
# Create SSH service on Zo (port 2222, tcp)
# Add to ~/.ssh/config for easy access
ssh zo
```

Then open `/home/workspace` in your IDE. Edit files directly on your server.

Full guide: [docs](https://docs.zocomputer.com/ssh-zo)

### File Sync (for local + remote)

Bidirectional sync between your local machine and Zo. Use the desktop app or SyncThing.

- Desktop app: built-in, one-click setup
- SyncThing: open-source, more control

Full guide: [docs](https://docs.zocomputer.com/sync-files)

### GitHub Integration

Connect your GitHub account via personal access token. Push, pull, manage repos from Zo.

```bash
gh auth login --with-token <your-token>
```

Full guide: [docs](https://docs.zocomputer.com/github)

---

## 10. The 50+ Built-in Tools

Zo has tools for everything. Here are the categories:

### Files & Code
[Create](https://docs.zocomputer.com/tools/create-or-rewrite-file) | [Edit](https://docs.zocomputer.com/tools/edit-file) | [Read](https://docs.zocomputer.com/tools/read-file) | [Search](https://docs.zocomputer.com/tools/grep-search) | [List](https://docs.zocomputer.com/tools/list-files) | [Run command](https://docs.zocomputer.com/tools/run-bash-command) | [Parallel commands](https://docs.zocomputer.com/tools/run-parallel-cmds)

### Web & Research
[Search web](https://docs.zocomputer.com/tools/web-search) | [Research](https://docs.zocomputer.com/tools/web-research) | [Read webpage](https://docs.zocomputer.com/tools/read-webpage) | [Open page](https://docs.zocomputer.com/tools/open-webpage) | [Search X](https://docs.zocomputer.com/tools/x-search) | [Search Maps](https://docs.zocomputer.com/tools/maps-search)

### Communication
[Email](https://docs.zocomputer.com/tools/send-email-to-user) | [SMS](https://docs.zocomputer.com/tools/send-sms-to-user) | [Telegram](https://docs.zocomputer.com/tools/send-telegram-message)

### Sites & Spaces
[Create site](https://docs.zocomputer.com/tools/create-website) | [Publish](https://docs.zocomputer.com/tools/publish-site) | [Edit space](https://docs.zocomputer.com/tools/update-space-route) | [Upload asset](https://docs.zocomputer.com/tools/update-space-asset)

### Services
[Create service](https://docs.zocomputer.com/tools/register-user-service) | [List services](https://docs.zocomputer.com/tools/list-user-services) | [Diagnose](https://docs.zocomputer.com/tools/service-doctor)

### Payments (Stripe)
[Create payment link](https://docs.zocomputer.com/tools/create-stripe-payment-link) | [List links](https://docs.zocomputer.com/tools/list-stripe-payment-links) | [List orders](https://docs.zocomputer.com/tools/list-stripe-orders)

### Media
[Generate image](https://docs.zocomputer.com/tools/generate-image) | [Edit image](https://docs.zocomputer.com/tools/edit-image) | [Video from image](https://docs.zocomputer.com/tools/generate-video) | [Transcribe audio](https://docs.zocomputer.com/tools/transcribe-audio) | [Diagram](https://docs.zocomputer.com/tools/generate-d2-diagram)

### Integrations
[Gmail](https://docs.zocomputer.com/tools/use-app-gmail) | [Google Calendar](https://docs.zocomputer.com/tools/use-app-google-calendar) | [Google Drive](https://docs.zocomputer.com/tools/use-app-google-drive) | [Notion](https://docs.zocomputer.com/tools/use-app-notion) | [Linear](https://docs.zocomputer.com/tools/use-app-linear) | [Airtable](https://docs.zocomputer.com/tools/use-app-airtable) | [Dropbox](https://docs.zocomputer.com/tools/use-app-dropbox) | [Spotify](https://docs.zocomputer.com/tools/use-app-spotify)

---

## 11. Why Zo for Vibecoders

The traditional path to running a web service:

```
Learn AWS/Vercel/Railway > Set up repo > Configure CI/CD >
Write Dockerfile > Manage env vars > Set up DNS > Debug deploy >
Configure monitoring > Handle scaling > Maintain updates
```

The Zo path:

```
Describe what you want > Zo builds it > It's live
```

For a solopreneur building 3-5 paid micro-services, Zo eliminates the entire infrastructure layer. You focus on what the service does. Zo handles everything else: hosting, deployment, payments, domains, SSL, agents, and the 50+ tools that make it all work.

The Basic plan at $18/mo includes enough compute for several services, built-in AI credits, and Stripe integration with 0% platform fee. For most solo builders, this replaces a $50-100/mo stack of Vercel + Railway + Supabase + separate payment integrations.

---

*All links verified February 2026. Docs: [docs.zocomputer.com](https://docs.zocomputer.com)*
