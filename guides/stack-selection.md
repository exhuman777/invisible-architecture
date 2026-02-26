# Stack Selection Guide

Decision trees for picking the right stack by project type. Opinionated recommendations with costs and alternatives.

---

## How to Use This Guide

Find your project type below. Each entry gives you:
- **Recommended stack** (the default pick, works for most cases)
- **Why** (the reasoning)
- **Alternatives** (when the default doesn't fit)
- **Estimated cost** (monthly, after free tiers expire)

All recommendations optimize for: vibecoding speed, deployment simplicity, and cost at small scale. Enterprise needs differ.

---

## 1. Landing Page / Portfolio

**Stack:** Astro + Tailwind CSS on Vercel or Cloudflare Pages
**Cost:** $0/mo

**Why:** Static sites deploy free everywhere. Astro outputs zero JS by default, fastest possible page loads. Tailwind means AI generates styling inline, no separate CSS files to manage.

**When to pick Astro:** Content-focused site, blog, docs, marketing pages. Islands architecture lets you add interactivity where needed.

**When to pick Next.js instead:** You'll add dynamic features soon (auth, API routes). Starting with Next.js avoids a migration later.

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| Next.js on Vercel | Planning dynamic features later | $0/mo (hobby) |
| Hugo / 11ty | Maximum build speed, Markdown-heavy | $0/mo |
| Plain HTML + CSS | Single page, no build step needed | $0/mo |

---

## 2. SaaS MVP

**Stack:** Next.js 15 (App Router) + Supabase + Stripe + Resend on Vercel
**Cost:** ~$25/mo after free tiers

**Why:** Fastest path from idea to paying customers. Supabase handles auth, database, and file storage in one service. Stripe for payments. Resend for transactional email. Vercel deploys on git push. AI tools know this stack extremely well, every prompt generates working code.

**Breakdown:**
- Vercel Pro: $20/mo
- Supabase Free: $0 (up to 500MB DB, 50K auth users)
- Stripe: 2.9% + $0.30 per transaction
- Resend Free: 3K emails/mo

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| Next.js + Clerk + PlanetScale | Need better auth UX, MySQL preference | ~$25/mo |
| Remix + Fly.io + Neon | Want more server control, edge deployment | ~$15/mo |
| Laravel + Forge | PHP team, batteries-included framework | ~$12/mo |
| Rails + Render | Ruby team, convention over configuration | ~$15/mo |

---

## 3. AI-Powered App

**Stack:** Next.js + Vercel AI SDK + Anthropic/OpenAI + Supabase (pgvector) + Inngest
**Cost:** ~$50/mo + API costs

**Why:** Vercel AI SDK handles streaming responses, tool calling, and multi-model support out of the box. Supabase with pgvector gives you RAG (retrieval-augmented generation) without a separate vector database. Inngest manages background jobs for long-running AI tasks.

**Breakdown:**
- Vercel Pro: $20/mo
- Supabase Pro: $25/mo (for pgvector at scale)
- Anthropic API: usage-based (~$10-100/mo depending on traffic)
- Inngest Free: 25K events/mo

**Key decisions:**
- **Anthropic vs OpenAI:** Claude for complex reasoning, longer context. GPT-4o for speed, multimodal. Most apps use both.
- **pgvector vs Pinecone:** pgvector keeps everything in Postgres (simpler). Pinecone for 1M+ vectors at high QPS.
- **Streaming:** Always stream AI responses. Users abandon after 3 seconds of blank screen.

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| Python (FastAPI) + LangChain | Python ML team, heavy data processing | ~$30/mo + API |
| Next.js + LlamaIndex + Weaviate | Complex RAG pipelines, semantic search focus | ~$70/mo + API |
| Streamlit + OpenAI | Internal tools, data dashboards | ~$0 + API |

---

## 4. API Service

**Stack:** Hono + Neon Postgres + Upstash Redis on Railway
**Cost:** ~$10/mo

**Why:** Hono runs anywhere (Node, Bun, Deno, Cloudflare Workers). Lightweight, fast, Web Standards API. Neon gives you serverless Postgres with branching. Upstash Redis for caching and rate limiting. Railway deploys from git with zero config.

**Breakdown:**
- Railway: $5/mo base + usage
- Neon Free: 0.5GB storage, autoscaling
- Upstash Free: 10K commands/day

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| Fastify on Fly.io | Need Node ecosystem, global edge | ~$5/mo |
| Express on Railway | Team knows Express already | ~$5/mo |
| Go (Chi/Gin) on Fly.io | High throughput, low latency needs | ~$5/mo |
| Cloudflare Workers + D1 | Edge-first, minimal cold starts | $5/mo |

---

## 5. Mobile App

**Stack:** React Native (Expo) + Supabase backend
**Cost:** ~$0-25/mo (backend only, app store fees separate)

**Why:** Expo handles the build/deploy nightmare of mobile. One codebase for iOS and Android. Supabase provides auth, database, and push notifications. AI tools generate React Native code well because the component model matches React.

**Key decisions:**
- **Expo vs bare React Native:** Always start with Expo. Eject only if you need a native module Expo doesn't support.
- **Supabase vs Firebase:** Supabase for Postgres and open source. Firebase for real-time sync and Google ecosystem.

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| Flutter + Firebase | Dart team, pixel-perfect custom UI | ~$0-25/mo |
| SwiftUI + CloudKit | iOS only, deep Apple integration | $0/mo (Apple ecosystem) |
| Kotlin Multiplatform | Kotlin team, shared business logic | ~$10/mo |

---

## 6. E-commerce

**Stack (Hosted):** Shopify
**Cost:** $39/mo (Basic)

**Stack (Headless):** Next.js + Medusa.js + Stripe
**Cost:** ~$25/mo

**Why two options:**
- **Shopify:** Choose when you want inventory, shipping, taxes, and payments handled for you. Less developer control, more merchant features.
- **Medusa (headless):** Choose when you need full control over the frontend and checkout flow. Open source, self-hostable.

**Decision:**
- Selling physical products with standard checkout? → Shopify
- Need custom checkout, subscriptions, or marketplace? → Headless
- Just a few digital products? → Stripe Checkout + Next.js (skip the e-commerce platform)

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| WooCommerce | WordPress ecosystem, low budget | ~$10/mo hosting |
| Saleor | GraphQL-first headless | ~$25/mo self-hosted |
| Stripe Checkout only | Simple products, no inventory | 2.9% per tx |

---

## 7. Real-time App

**Stack:** Next.js + Supabase Realtime + Postgres
**Cost:** ~$25/mo

**Why:** Supabase Realtime provides WebSocket connections backed by Postgres changes. When a row updates, connected clients get notified. No separate WebSocket server to manage. Works for chat, live dashboards, collaborative editing.

**What Supabase Realtime handles:**
- Postgres Changes (listen to DB writes)
- Broadcast (send messages between clients)
- Presence (track who's online)

**Alternatives:**
| Option | When | Cost |
|--------|------|------|
| Next.js + Ably | High message volume, guaranteed delivery | ~$25/mo |
| Next.js + Pusher | Simple pub/sub, wide language support | ~$0-49/mo |
| Next.js + PartyKit | Collaborative/multiplayer, edge compute | ~$0-20/mo |
| Elixir Phoenix | Massive concurrent connections, LiveView | ~$15/mo |
| Socket.io on Railway | Full WebSocket control, custom protocol | ~$10/mo |

---

## Decision Matrix

When the project type doesn't fit neatly into a category, use this:

| Factor | Optimize For |
|--------|-------------|
| **Budget: $0** | Vercel/CF Pages (static) or Supabase free tier |
| **Budget: <$25** | Vercel + Supabase + free tiers of everything |
| **Budget: <$100** | Add pro tiers, managed services, monitoring |
| **Ship in 1 week** | Next.js + Supabase. Full stop. |
| **Ship in 1 day** | Bolt or Replit Agent for prototype |
| **Scale to 100K users** | Vercel + Supabase Pro + CDN + caching layer |
| **Scale to 1M users** | Custom infra, consider Kubernetes, dedicated DB |
| **Solo developer** | Managed everything, minimize ops surface |
| **Small team (2-5)** | Monorepo, shared Vercel/Supabase project |
| **AI-first** | Vercel AI SDK, streaming, tool calling |

---

## The Meta-Advice

1. **Pick boring technology.** The best stack for vibecoding uses tools that AI has seen millions of times in training data. Next.js + Postgres beats any novel framework.

2. **Minimize services.** Every service you add requires context for AI, configuration, and a potential failure point. Supabase replacing 3-4 separate services (auth, DB, storage, realtime) reduces surface area.

3. **Free tiers first.** Launch on free tiers. Upgrade only when you hit limits. Most MVPs never need to leave the free tier.

4. **Don't over-architect.** A monolithic Next.js app handles more scale than you think. Microservices add complexity that slows vibecoding down. Split only when you have a clear reason.

5. **Match the AI's knowledge.** If AI generates bad code for your stack, the stack might be too niche. Popular frameworks get better AI support. This matters when you're vibecoding 80% of your code.
