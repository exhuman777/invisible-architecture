# The Invisible Architecture

> A poetic map of the services, protocols, and invisible layers that hold the modern internet together. For vibecoders, builders, and the curious.

**Live at:** https://o.zo.space/invisible-architecture
**Format:** Interactive scrolling essay with animated tech-word matrix, service cards, ASCII diagrams
**Original:** 102.9KB HTML file served as Zo Space asset at `/pages/invisible-architecture.html`

---

## Header

Every deploy is a pull of the lever.

You ship code. The internet gambles on DNS resolving, SSL handshaking, CDNs caching, databases responding, APIs not rate-limiting you. Every page load is a parlay across 30+ services. The house always runs.

### Floating service tags (animated matrix)
DNS, Firewall, Load Balancer, Rate Limit, gRPC, Edge Runtime, DDoS, Supabase, Kubernetes, REST, YAML, OAuth, Resend, Feature Flags, CDN, Cron Jobs, JWT, MCP, API Gateway, Cloudflare, Auth, PostHog, Vercel, Secrets Mgr, AI Inference, PostgreSQL, CORS, Railway, Serverless, Sentry, WebSockets, GraphQL, S3 Storage, GitHub Actions, Vector DB, Analytics, Docker, SSL/TLS, Stripe, Redis, Webhooks, PgBouncer, CI/CD, TCP/IP

> what's running under your app right now?
> DNS resolved. SSL handshook. CDN cached. You never saw a thing.

---

## The Complete Map: Every Layer of the Modern Internet

### Naming
Namecheap, Cloudflare, Porkbun, Google Domains

### DNS
Cloudflare DNS, Route 53, Vercel DNS, Google Cloud DNS

### SSL / TLS
Let's Encrypt, Cloudflare auto, Vercel auto, AWS ACM

### CDN / Edge
Cloudflare, Fastly, CloudFront, Bunny CDN

### DDoS / WAF
Cloudflare WAF, AWS Shield, CrowdSec, Akamai

### Version Control
GitHub, GitLab, Bitbucket, Codeberg

### Frontend Host
Vercel, Netlify, CF Pages, GitHub Pages

### Backend / PaaS
Railway, Render, Fly.io, Zo.computer

### VPS
DigitalOcean, Hetzner, Vultr, Linode

### Containers
Docker, Kubernetes, Docker Hub, GHCR

### BaaS
Supabase, Firebase, Appwrite, PocketBase

### CI / CD
GitHub Actions, CircleCI, Vercel auto, GitLab CI

### SQL Database
PostgreSQL, Neon, Turso (SQLite), PlanetScale

### NoSQL / KV
Redis, MongoDB, Cloudflare KV, Upstash

### Vector DB
pgvector, Pinecone, Qdrant, Weaviate

### Auth
Supabase Auth, Clerk, Auth0, Auth.js

### Storage
AWS S3, Cloudflare R2, Supabase Storage, UploadThing

### Queues / Cron
Upstash, Inngest, Trigger.dev, Quirrel

### Payments
Stripe, LemonSqueezy, Paddle

### Email
Resend, Postmark, SendGrid

### Analytics
PostHog, Plausible, Mixpanel

### Errors / Monitoring
Sentry, Grafana, Better Uptime

### Secrets
Doppler, Infisical, Env variables, AWS Secrets Mgr

### Feature Flags
LaunchDarkly, PostHog Flags, Flagsmith

### AI Inference
Anthropic, OpenAI, Google Gemini, Groq

### AI Tools / MCP
MCP Spec, MCP Registry, Glama Directory, Smithery

### Agent Frameworks
Claude Agents, Vercel AI SDK, LangChain, CrewAI

### Agent Skills
Skills.sh, Composio, E2B (sandboxes), Browserbase

### Open Models
Together AI, Replicate, Ollama (local), HuggingFace

### AI Coding
Claude Code, Cursor, Copilot, Bolt.new

---

## 01 / 13: The Act of Naming
### Domain Names & DNS

> Before there were names there were only numbers.
> Then someone said: let there be words.
> And the internet became a place you could find.

The Domain Name System is like a phone book for the internet. You type a name (exhuman.xyz), DNS finds the actual address computers use (76.76.21.21). Every URL triggers this lookup in under 100ms.

```
you type:   exhuman.xyz
    |
browser cache  --> already resolved?
    |  no
OS cache        --> machine resolved it?
    |  no
resolver       (1.1.1.1)
    |  root server  --> who handles .xyz?
    |  TLD server   --> who handles exhuman.xyz?
    |  authoritative --> what is the IP?
answer:        76.76.21.21
```

Registrars are where you buy a domain name (like buying a phone number). DNS providers handle the actual lookups (like running the phone book). They can be different companies.

**Links:** DNS record types, Cloudflare Registrar, Namecheap, Porkbun, Route 53

---

## 02 / 13: The Language of Strangers
### Application Programming Interfaces

> Two systems that have never met exchange value
> because they agreed on a shared grammar.
> This is civilization compressed into HTTP.

```
GET    /users/42       // retrieve
POST   /users          // create
PUT    /users/42       // update
DELETE /users/42       // remove

// GraphQL: one endpoint, exact fields
POST   /graphql
  { user(id: 42) { name, posts { title } } }
```

**Links:** REST vs. GraphQL, Postman, GraphQL, OpenAPI, Hoppscotch

---

## 03 / 13: The Town Square of Code
### Version Control & CI/CD

> Every line has a history. Every decision is reversible.
> Every collaboration preserved in commits and diffs.

GitHub is where developers store and share code. Think Google Docs history, but for software. Every change is tracked, every version is saved, and teams review each other's work. CI/CD means your code gets tested and deployed automatically every time you save. 100M+ developers. 420M+ repos.

```
VERSION CONTROL  Commits, branches, pull requests, code review
CI/CD            GitHub Actions: push --> test --> build --> deploy
COLLABORATION    Issues, PRs, Discussions, Projects (kanban)
ECOSYSTEM        Pages (free hosting), Packages, Copilot, Dependabot
```

```
Local Machine    git commit / git push
GitHub Repo      Actions run tests
Vercel           Auto-deploy on push
```

**Links:** GitHub, GitLab, Bitbucket, Actions

---

## 04 / 13: Identity is Portable
### Containers & Docker

> A container carries everything it needs to be itself,
> regardless of where it lands.
> You are not your environment. You are what you bring.

Docker packages your app and everything it needs into a container. Like a shipping container for software: works the same no matter what ship (server) carries it.

```
               Container    VM
Virtualizes    OS (shares kernel)    Hardware (full guest OS)
Startup        Milliseconds          Minutes
Size           Megabytes             Gigabytes
Density        Hundreds/host         Handful/host
```

```
Physical Server or VPS
  Docker Engine    Container runtime on Linux
    App            Your code + deps
    PostgreSQL     Database
    Redis          Cache
```

**Links:** Docker, Docker Hub, Kubernetes, Railway, Fly.io

---

## 05 / 13: Where Memory Lives
### Relational, Document, Key-Value, Vector

> Every app needs a place to remember.
> The database is the memory of the machine.
> Choose the wrong one and the machine forgets.

```
RELATIONAL (SQL)     tables, rows, joins, ACID
  PostgreSQL        Gold standard. pgvector, PostGIS, pg_cron.
  MySQL             Web workhorse. WordPress runs on this.
  SQLite            Embedded. File = database. Perfect for edge.

DOCUMENT (NoSQL)     JSON documents, flexible schema
  MongoDB           Most popular NoSQL.
  Firebase          Google's BaaS. Firestore = realtime docs.

KEY-VALUE            key --> value, extremely fast
  Redis             In-memory. Cache, sessions, pub/sub, queues.
  Valkey            Open-source Redis fork (post-license change).

VECTOR               similarity search for AI embeddings
  pgvector          Postgres extension. Vectors in your existing DB.
  Pinecone          Managed vector DB for AI/ML.

EDGE / SERVERLESS    designed for serverless architecture
  Turso             SQLite at the edge. LibSQL. Global replicas.
  Neon              Serverless PostgreSQL. Scales to zero.
  D1                Cloudflare's SQLite at the edge.
```

**Links:** SQL vs. NoSQL, Connection pooling, PostgreSQL, Redis, Turso, Neon, MongoDB, Pinecone

---

## 06 / 13: A Room of One's Own
### Virtual Private Servers & Personal Clouds

> Shared hosting is the dormitory.
> A VPS is your own apartment.
> The cost of sovereignty is responsibility.

A VPS is your own rented computer in the cloud. You get full control: install anything, run anything, 24/7.

```
             Shared       VPS           Cloud (AWS)     Zo.computer
Control      cPanel       Full root SSH Full + managed  Terminal + AI
Cost         $3-15/mo     $5-80/mo      $0-10k+/mo     Free / $15/mo
AI built-in  No           No            Separate        Yes (Claude)
Best for     Blogs        Apps, APIs    Enterprise      Personal AI apps
```

**Links:** Zo.computer, DigitalOcean, Hetzner, Vultr, Linode, Lightsail

---

## 07 / 13: The Disappearing Server
### Serverless Deployment

> Infrastructure should be invisible.
> Think about what your code does, not where it runs.

Serverless means you write code and the platform handles all the servers.

```
SERVERLESS  Node/Python/Go. Cold start 100-1000ms. Full Node API.
EDGE        V8 isolates. <1ms cold start. 300+ locations. No fs.
```

**Links:** Vercel, Netlify, CF Pages, Railway, Render, Fly.io

---

## 08 / 13: The Old Database, Reborn
### Backend as a Service

> The thirty-year-old relational database is still the best foundation.
> You just need a better experience around it.

```
DATABASE        PostgreSQL + pgvector + PostGIS + pg_cron
AUTH            GoTrue -- JWT, OAuth, magic links, phone
REST API        PostgREST -- auto-generated from schema
REALTIME        WAL --> WebSocket -- push DB changes to clients
STORAGE         S3-compatible -- files with Postgres permissions
EDGE FUNCTIONS  Deno-based -- serverless, globally deployed
VECTOR SEARCH   pgvector -- AI/ML similarity search
```

**Links:** Row Level Security, Supabase, Firebase, Appwrite, PocketBase

---

## 09 / 13: The Invisible Guardian
### CDN, DDoS, Edge Computing

> Most people have never heard of it,
> but a significant percentage of the internet flows through its hands.

```
CDN             Cache assets globally. Latency: hundreds ms --> single digits.
DDOS            L3/L4/L7 protection. Absorbs attacks across the network.
WORKERS         V8 isolates. <1ms cold start. Code on every datacenter.
KV              Global key-value store.
D1              SQLite at the edge (up to 10GB).
R2              S3-compatible storage, zero egress fees.
ZERO TRUST      Replaces VPN. Identity-based access.
```

**Links:** Cloudflare, Fastly, CloudFront, Bunny CDN

---

## 10 / 13: Giving Intelligence Hands
### Model Context Protocol

> A mind without the ability to act is just a voice in a room.
> MCP lets AI reach through the screen and touch the systems where real work happens.

MCP is how AI connects to the real world. Like USB-C is one plug for all devices, MCP is one standard for AI to use any tool. Created by Anthropic, now governed by the Agentic AI Foundation under the Linux Foundation.

```
Host App        Claude Code / VS Code
MCP Client      JSON-RPC 2.0
MCP Server      Tools + Resources
```

**Links:** MCP Spec, MCP Servers, Directory

---

## 11 / 13: A Brain in a Jar No More
### How AI Connects to the Internet

> An AI without tools is a brain in a jar.
> Tool use bridges intelligence and agency.
> Every tool we give it is a vote of trust.

```
// The tool-use loop
1. DEFINE     Developer lists tools with schemas
2. DECIDE     Model outputs structured call:
               { "tool": "read_file", "path": "/src/app.ts" }
3. EXECUTE    Host runs function, sends result back
4. SYNTHESIZE  Model incorporates data into response
```

```
INFERENCE PROVIDERS
  Anthropic  Claude. Opus, Sonnet, Haiku.
  OpenAI     GPT. o-series reasoning.
  Google     Gemini. Multimodal native.
  Groq       Custom LPU. Ultra-low latency.
  Together   Open-source models hosted.
```

**Links:** Anthropic, OpenAI, Google, Groq, Together AI

---

## 12 / 13: A Cathedral Built by Strangers
### The Modern Web Stack

> No single company designed it.
> Each layer trusts the layer below.
> The infrastructure became invisible so the ideas could become visible.

```
USER        Browser / app. Types URL. HTTPS request.
DNS         Domain to IP. Cloudflare / Route 53.
CDN         Cloudflare / Fastly. Cache + DDoS + SSL.
HOSTING     Vercel / Netlify / CF Pages. Edge + serverless.
BACKEND     Supabase / Firebase. DB + Auth + Realtime.
DATABASE    PostgreSQL / Redis / SQLite.
STORAGE     S3 / R2 / Supabase Storage.
APIs        Stripe / Resend / Claude / Algolia.
COMPUTE     VPS / Railway / Zo. Bots, cron, workers.
AI + MCP    Model APIs. MCP servers. Agents.
GITHUB      Source of truth. CI/CD. Everything starts here.
```

---

## 13 / 13: What Most People Never See
### The Services Behind the Services

> You click a button. Fourteen services wake up.
> You see a page. You have no idea what just happened.

```
DOMAIN          Namecheap  Cloudflare  Porkbun
DNS             Cloudflare DNS  Route 53  Vercel DNS
SSL             Let's Encrypt  Cloudflare auto  Vercel auto
CDN             Cloudflare  Fastly  Bunny
HOSTING         Vercel  Netlify  Railway  Zo
DATABASE        Supabase  Neon  Turso  PlanetScale
AUTH            Supabase Auth  Clerk  Auth0
STORAGE         S3  R2  Supabase Storage
EMAIL           Resend  Postmark  SendGrid
PAYMENTS        Stripe  LemonSqueezy  Paddle
ANALYTICS       PostHog  Plausible  Mixpanel
ERRORS          Sentry  LogRocket
CI/CD           GitHub Actions  Vercel auto  CircleCI
AI              Anthropic  OpenAI  Groq
AI TOOLS        MCP  function calling  agent frameworks
CONTAINERS      Docker Hub  GHCR
SECRETS         Env vars  Doppler  Infisical
MONITORING      Grafana  Datadog  Better Uptime
QUEUES          Upstash  Inngest  Trigger.dev
```

A "simple" web app touches 12+ of these. The modern internet is a distributed system held together by APIs, trust, and YAML.

---

## Bonus: What Agents Need
### The AI Agent Stack

> An agent is not just a model.
> It is a model with memory, tools, and a plan.

```
INFERENCE        The brain. Where the model runs.
  Anthropic API  Claude Opus / Sonnet / Haiku
  OpenAI API     GPT-4o / o3 / o4-mini
  Groq           Custom LPU. Sub-100ms latency.
  Together AI    Open models: Llama, Mistral, Qwen.
  Ollama         Run models locally on your machine.

TOOLS (MCP)      The hands. How the agent acts on the world.
  MCP Registry   registry.modelcontextprotocol.io
  Glama          glama.ai/mcp/servers
  Smithery       smithery.ai
  Composio       composio.dev — 250+ tool integrations
  Skills.sh      skills.sh — portable agent skills

MEMORY           Context that persists across conversations.
  pgvector       Vector embeddings in PostgreSQL
  Pinecone       Managed vector DB for RAG
  Mem0           mem0.ai — memory layer for agents
  Qdrant         Open-source vector search

SANDBOXES        Safe execution environments for agent code.
  E2B            e2b.dev — cloud sandboxes for AI agents
  Browserbase    browserbase.com — headless browsers for agents
  Modal          modal.com — serverless GPU/CPU for agents

ORCHESTRATION    Managing multi-step, multi-agent workflows.
  Claude Code    CLI agent with full tool use (built this page)
  Vercel AI SDK  TypeScript framework for AI apps
  LangChain      Python/JS chain-based orchestration
  CrewAI         Multi-agent collaboration framework
  AutoGen        Microsoft's multi-agent conversations

CODING AGENTS    AI that writes and deploys code.
  Claude Code    Anthropic's CLI. Opus/Sonnet. MCP native.
  Cursor         AI-first IDE. Tab completion + chat.
  GitHub Copilot In-editor AI. Workspace agent.
  Bolt.new       Browser IDE. Prompt to full-stack app.
  Lovable        AI frontend builder. Natural language.
```

```
AI Agent         Claude Code / Cursor / Custom
  Inference      Anthropic / OpenAI
  MCP Tools      File, DB, Web, API
  Memory         Vectors / Context
  Sandbox        E2B / Browser
```

**Links:** MCP Registry, Glama, Smithery, Skills.sh, Composio, E2B, Mem0

---

## Architecture Diagram

```
Developer's Machine     code --> git commit --> git push
GitHub                  Source of truth / CI / CD / Actions
Vercel / Netlify        Frontend + API
Railway / VPS / Zo      Backend + Docker
Supabase / Neon         PostgreSQL + Auth + Realtime + Storage
Stripe                  Payments
Resend                  Email
Claude / MCP            AI + Tools
PostHog                 Analytics
Sentry                  Errors

ALL TRAFFIC FLOWS THROUGH CLOUDFLARE (CDN + DNS + WAF)
```

---

## Footer

> THE INFRASTRUCTURE BECAME INVISIBLE SO THE IDEAS COULD BECOME VISIBLE

Visitors: 7846+

</> assembled by a penguin and a human, 2026
