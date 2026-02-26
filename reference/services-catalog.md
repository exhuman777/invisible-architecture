# Infrastructure Services Catalog

> Last verified: February 2026. Pricing in USD. Free tiers noted where available.

**Status key:** Active | Changed (pricing/ownership shift) | Deprecated

---

## Hosting / Deployment

| Service | URL | What | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Vercel | [vercel.com](https://vercel.com) | Frontend + serverless deployment | Yes (hobby) | Pro $20/mo | Active | Market leader for Next.js. Edge Functions, ISR, analytics built in |
| Netlify | [netlify.com](https://netlify.com) | JAMstack hosting + serverless | Yes (100GB BW) | Pro $19/mo | Active | Good forms, identity, split testing. Slower iteration than Vercel |
| Cloudflare Pages | [pages.cloudflare.com](https://pages.cloudflare.com) | Static + full-stack via Workers | Yes (unlimited BW) | Workers Paid $5/mo | Active | Zero bandwidth fees. Workers for compute. D1 for SQL. Expanding fast |
| Railway | [railway.com](https://railway.com) | Full-stack deploy platform | Trial $5 credit | $5/mo + usage | Active | Excellent DX. Postgres, Redis, cron built in. Loved by indie devs |
| Fly.io | [fly.io](https://fly.io) | Edge containers (Firecracker VMs) | Limited (3 shared VMs) | Pay-as-you-go | Active | Global edge deployment. Good for latency-sensitive apps. Postgres on Fly |
| Render | [render.com](https://render.com) | Heroku alternative, full-stack | Yes (spins down after 15min) | Starter $7/mo | Active | Simple Heroku-like DX. Free tier cold starts hurt. Good for side projects |
| DigitalOcean App Platform | [digitalocean.com](https://digitalocean.com) | PaaS + droplets + k8s | Static sites free | $5/mo droplets, App Platform $5/mo | Active | Reliable, predictable pricing. Less fancy DX than Railway/Vercel |

### Hosting Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Next.js app | Vercel | Native platform, best integration |
| Static site | Cloudflare Pages | Free, unlimited bandwidth, fast |
| Full-stack with DB | Railway | Best DX, all-in-one |
| Budget containers | Fly.io | Pay only for what you use |
| Heroku migration | Render or Railway | Similar mental model |

---

## Databases

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Supabase | [supabase.com](https://supabase.com) | Postgres + auth + realtime + storage | 500MB, 2 projects | Pro $25/mo | Active | Firebase alternative built on Postgres. Auth, storage, edge functions included |
| Neon | [neon.tech](https://neon.tech) | Serverless Postgres | 0.5 GiB, 1 project | Launch $19/mo | Active | Branching (like git for DB). 80% price cut in 2025. Autoscaling to zero |
| PlanetScale | [planetscale.com](https://planetscale.com) | Serverless MySQL | KILLED FREE TIER (Apr 2024) | Hobby $39/mo | Changed | Was beloved for free tier. Pricing backlash pushed many to Neon/Turso |
| Turso | [turso.tech](https://turso.tech) | SQLite at edge (libSQL) | 9GB, 500 DBs | Scaler $29/mo | Active | Embedded replicas for zero-latency reads. Great for edge-first apps |
| Upstash | [upstash.com](https://upstash.com) | Serverless Redis + Kafka + QStash | 10K commands/day | Pay-per-request | Active | True serverless (per-request billing). Redis, Kafka, QStash, Vector |
| MongoDB Atlas | [mongodb.com/atlas](https://mongodb.com/atlas) | Document DB (MongoDB) | 512MB shared cluster | Flex from $0.10/hr | Active | Flexible schema. Good for prototyping. Atlas Search built in |
| CockroachDB | [cockroachlabs.com](https://cockroachlabs.com) | Distributed SQL (Postgres-compatible) | 10GB, 50M RUs | Dedicated from $295/mo | Active | Survives zone failures. Postgres wire protocol. Overkill for most apps |

### Database Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Full-stack starter | Supabase | Auth + DB + storage in one |
| Serverless Postgres | Neon | Branching, autoscale to zero |
| Edge-first | Turso | Embedded replicas, SQLite |
| Caching / queues | Upstash | True per-request serverless |
| Document store | MongoDB Atlas | Flexible schema, free tier |

---

## Auth

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Clerk | [clerk.com](https://clerk.com) | Managed auth + user management | 10K MAU | Pro $25/mo | Active | Best DX for Next.js. Drop-in components. Org support. Webhooks |
| Auth.js | [authjs.dev](https://authjs.dev) | Open source auth library | Free (self-hosted) | N/A | Active | NextAuth rebranded. Supports many frameworks now. You own the data |
| Supabase Auth | [supabase.com/auth](https://supabase.com/auth) | Built into Supabase | Included in free tier | Included in Pro | Active | GoTrue under the hood. Social + email + phone. Pairs with Supabase DB |
| Lucia Auth | [lucia-auth.com](https://lucia-auth.com) | Auth library | N/A | N/A | Deprecated | Deprecated 2024. Author recommends building custom with Oslo libs |
| WorkOS | [workos.com](https://workos.com) | Enterprise SSO + SCIM + directory sync | Free SSO (up to 1M MAU) | Enterprise from usage | Active | AuthKit launched 2024. Enterprise-grade. Good for B2B SaaS |

### Auth Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Next.js app, fast setup | Clerk | Best components, lowest effort |
| Full control, self-hosted | Auth.js | Own your data, no vendor lock |
| Already on Supabase | Supabase Auth | Comes free, tight integration |
| Enterprise / B2B | WorkOS | SSO, SCIM, directory sync |

---

## Payments

| Service | URL | Model | Fees | Status | Notes |
|---------|-----|-------|------|--------|-------|
| Stripe | [stripe.com](https://stripe.com) | Payment processor | 2.9% + 30c | Changed | Industry standard. Acquired LemonSqueezy in 2024. Best docs, best ecosystem |
| LemonSqueezy | [lemonsqueezy.com](https://lemonsqueezy.com) | Merchant of record | Was 5% + 50c | Changed | Now part of Stripe. Being integrated. Merchant-of-record features moving to Stripe |
| Paddle | [paddle.com](https://paddle.com) | Merchant of record | 5% + 50c | Active | Handles global tax compliance. Good for SaaS. Acquired ProfitWell |
| Polar | [polar.sh](https://polar.sh) | Open source monetization | 5% | Active | Simpler than Stripe for digital products. Subscriptions, one-time, pay-what-you-want |

### Payments Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| SaaS, full control | Stripe | Best APIs, biggest ecosystem |
| Don't want to handle tax | Paddle | Merchant of record, handles everything |
| Digital products, simple | Polar | Quick setup, developer-friendly |

---

## Email / Messaging

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Resend | [resend.com](https://resend.com) | Developer email API | 100 emails/day, 3K/mo | Pro $20/mo | Active | Built on React Email. Best DX. JSX email templates |
| Postmark | [postmarkapp.com](https://postmarkapp.com) | Transactional email | 100/mo | $15/mo (10K emails) | Active | Fast delivery, great deliverability. Focused on transactional only |
| SendGrid | [sendgrid.com](https://sendgrid.com) | Email API (transactional + marketing) | 100/day | Essentials $19.95/mo | Active | Twilio owned. Broad feature set. DX has declined |
| Twilio | [twilio.com](https://twilio.com) | SMS, voice, video APIs | Trial credit | Pay-per-use | Active | SMS from $0.0079/msg. Dominant in programmable communications |
| Knock | [knock.app](https://knock.app) | Notification infrastructure | 10K notifications/mo | Growth $250/mo | Active | Multi-channel (email, push, in-app, SMS). Preferences, workflows built in |

### Email Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Transactional email, modern DX | Resend | React Email templates, simple API |
| High-volume transactional | Postmark | Best deliverability |
| Multi-channel notifications | Knock | One API for all channels |
| SMS/voice | Twilio | Industry standard |

---

## Storage / CDN

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Cloudflare R2 | [developers.cloudflare.com/r2](https://developers.cloudflare.com/r2) | S3-compatible object storage | 10GB storage, zero egress | $0.015/GB stored | Active | Zero egress fees (game changer). S3 API compatible. Pairs with Workers |
| AWS S3 | [aws.amazon.com/s3](https://aws.amazon.com/s3) | Object storage | 5GB (12 months) | ~$0.023/GB | Active | Industry standard. Every tool integrates. Egress fees add up fast |
| Uploadthing | [uploadthing.com](https://uploadthing.com) | File uploads for Next.js/React | 2GB | Pro $30/mo (100GB) | Active | Purpose-built for JS apps. Simple API. Handles presigned URLs |
| Bunny.net | [bunny.net](https://bunny.net) | CDN + storage + streaming | 14-day trial | $0.01/GB CDN | Active | Incredibly cheap. Fast. Storage + CDN + video streaming. EU-based |

### Storage Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| General object storage | Cloudflare R2 | Zero egress, S3 compatible |
| File uploads in Next.js | Uploadthing | Purpose-built, simple |
| CDN on a budget | Bunny.net | Cheapest quality CDN |
| Enterprise / ecosystem | AWS S3 | Universal compatibility |

---

## Monitoring / Analytics

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Sentry | [sentry.io](https://sentry.io) | Error tracking + performance | 5K events/mo | Team $26/mo | Active | Error tracking standard. Session replay, profiling. Every framework supported |
| PostHog | [posthog.com](https://posthog.com) | Product analytics + feature flags | 1M events/mo | Pay-as-you-go | Active | Self-hostable. Analytics, feature flags, session recording, A/B testing, surveys |
| Plausible | [plausible.io](https://plausible.io) | Privacy-first web analytics | Self-host free | Cloud $9/mo | Active | GDPR compliant, no cookies. Lightweight script (~1KB). EU-hosted |
| BetterStack | [betterstack.com](https://betterstack.com) | Uptime monitoring + logs | Free (basic monitors) | Plus $25/mo | Active | Clean UI. Uptime, logs, on-call. Formerly Better Uptime + Logtail merged |

### Monitoring Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Error tracking | Sentry | Industry standard, best integrations |
| Product analytics | PostHog | All-in-one, self-hostable |
| Simple web analytics | Plausible | Privacy-first, lightweight |
| Uptime + logs | BetterStack | Clean, unified platform |

---

## Background Jobs / Queues

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Inngest | [inngest.com](https://inngest.com) | Event-driven serverless functions | 50K runs/mo | Pro $50/mo | Active | Durable execution. Step functions. Retries, concurrency, rate limiting built in |
| Trigger.dev | [trigger.dev](https://trigger.dev) | Background jobs for JS/TS | Free tier (v3) | Pro $50/mo | Active | v3 rewrite: long-running tasks, no timeouts. Great for AI pipelines, data processing |
| QStash | [upstash.com/qstash](https://upstash.com/qstash) | Serverless message queue | 500 msgs/day | Pay-per-message | Active | Part of Upstash. HTTP-based. Schedules, retries, callbacks. Works with any endpoint |

### Background Jobs Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Complex workflows | Inngest | Step functions, event-driven |
| Long-running tasks | Trigger.dev | No timeout limits in v3 |
| Simple queue / cron | QStash | Serverless, HTTP-based, cheap |

---

## CMS

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Sanity | [sanity.io](https://sanity.io) | Headless CMS (structured content) | Free (3 users, 200K API reqs) | Team $15/user/mo | Active | GROQ query language. Real-time collaboration. Customizable Studio |
| Contentful | [contentful.com](https://contentful.com) | Headless CMS (API-first) | Free (25K records, 2 locales) | Team $300/mo | Active | Enterprise-grade. GraphQL + REST. Expensive at scale |
| Payload | [payloadcms.com](https://payloadcms.com) | Open source headless CMS | Free (self-hosted) | Payload Cloud $15/mo | Active | TypeScript-native. Self-hosted on your DB. Admin panel auto-generated. v3 on Next.js |

### CMS Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| Custom content modeling | Sanity | Flexible, real-time, GROQ |
| Enterprise CMS | Contentful | Established, API-first |
| Full control, self-hosted | Payload | Open source, TypeScript, own your data |

---

## Domain / DNS

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Cloudflare DNS | [cloudflare.com](https://cloudflare.com) | DNS + proxy | Free DNS | Pro $20/mo (advanced) | Active | Fastest public DNS. DDoS protection included. Universal SSL |
| Namecheap | [namecheap.com](https://namecheap.com) | Domain registrar | N/A | ~$9/yr .com | Active | Competitive pricing. Free WhoisGuard |
| Porkbun | [porkbun.com](https://porkbun.com) | Domain registrar | N/A | ~$9/yr .com | Active | Cheapest for many TLDs. Free SSL, WHOIS privacy |
| Vercel Domains | Via Vercel dashboard | Domain management | N/A | Market rate | Active | Buy + manage domains directly in Vercel. Auto-configured |

---

## Search

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Algolia | [algolia.com](https://algolia.com) | Search-as-a-service | 10K searches/mo | Standard from $1/1K reqs | Active | Fast, typo-tolerant. InstantSearch UI components. AI Search features |
| Meilisearch | [meilisearch.com](https://meilisearch.com) | Open source search | Free (self-host) | Cloud from $30/mo | Active | Rust-based. Easy setup. Good for smaller datasets. AI search features |
| Typesense | [typesense.org](https://typesense.org) | Open source search | Free (self-host) | Cloud from $0.04/hr | Active | Fast, typo-tolerant. Simpler than Elasticsearch. Geo search |
| Orama | [orama.com](https://orama.com) | Edge search | Free tier | Pro from $49/mo | Active | Runs at edge. Full-text + vector + hybrid search. JS-native |

### Search Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| SaaS product search | Algolia | Best UI components, fastest |
| Self-hosted, simple | Meilisearch | Easy setup, great docs |
| Edge / client-side | Orama | Runs in browser or edge |

---

## Feature Flags / Config

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| LaunchDarkly | [launchdarkly.com](https://launchdarkly.com) | Feature management | Free (dev) | Pro $10/seat/mo | Active | Enterprise standard. Targeting, experiments, rollouts |
| PostHog Feature Flags | [posthog.com](https://posthog.com) | Part of PostHog | 1M API reqs/mo | Included in PostHog | Active | Bundled with analytics. Experiments, multivariate |
| Statsig | [statsig.com](https://statsig.com) | Feature gates + experiments | Free (generous) | Pro from $150/mo | Active | Strong experimentation. Auto-analysis of feature impact |
| Vercel Feature Flags | Via Vercel dashboard | Edge flags | Included in Vercel | N/A | Active | Edge Config for ultra-low latency flags. Simple |

---

## Scheduling / Cron

| Service | URL | Type | Free Tier | Paid From | Status | Notes |
|---------|-----|------|-----------|-----------|--------|-------|
| Vercel Cron | Via vercel.json | Serverless cron | 2 cron jobs (hobby) | Pro: more jobs | Active | Simple config. Triggers serverless functions |
| QStash Schedules | [upstash.com/qstash](https://upstash.com/qstash) | HTTP-based cron | 500 msgs/day | Pay-per-use | Active | Cron via HTTP. Works with any endpoint. Retries built in |
| Inngest Scheduled | [inngest.com](https://inngest.com) | Event-driven cron | Included in free | Included in Pro | Active | Cron as events. Pairs with step functions |
| EasyCron | [easycron.com](https://easycron.com) | Managed cron | Free (1 job) | From $12/mo | Active | Simple HTTP cron. Dashboard monitoring |

---

## Full Stack Combos (Common Pairings)

| Stack | Components | Cost (hobby) | Best For |
|-------|-----------|--------------|----------|
| Vercel + Supabase + Clerk | Hosting + DB/auth/storage + auth UI | $0 (free tiers) | Next.js SaaS MVP |
| Cloudflare Pages + D1 + R2 | Hosting + SQL + storage | $0 (free tiers) | Zero-cost full stack |
| Railway + Neon + Auth.js | Hosting + DB + auth | ~$5/mo | Self-managed full stack |
| Fly.io + Turso + Payload | Edge hosting + edge DB + CMS | ~$5-10/mo | Content site, global |
| Vercel + Neon + Stripe + Resend | Hosting + DB + payments + email | ~$0-20/mo | SaaS with billing |
| Cloudflare (all) | Pages + Workers + D1 + R2 + KV + Queues | $5/mo (Workers paid) | Single-vendor full stack |

---

## Monthly Cost Estimates by Project Type

| Project Type | Hosting | DB | Auth | Other | Total (hobby) |
|-------------|---------|-----|------|-------|---------------|
| Static portfolio | Cloudflare Pages | N/A | N/A | Plausible $9 | $0-9/mo |
| SaaS MVP | Vercel free | Supabase free | Clerk free | Resend free | $0/mo |
| SaaS growing (1K users) | Vercel Pro $20 | Supabase Pro $25 | Clerk free | Sentry $26, Resend $20 | ~$91/mo |
| SaaS scale (10K users) | Vercel Pro $20 | Neon Scale $69 | Clerk Pro $25 | Full monitoring stack | ~$200+/mo |
| Side project | Railway $5 | Railway Postgres | Auth.js free | N/A | ~$5/mo |

---

## Status Change Log (2024-2026)

| Date | Service | Change |
|------|---------|--------|
| Apr 2024 | PlanetScale | Killed free tier. Hobby plan $39/mo minimum |
| Jun 2024 | Stripe | Acquired LemonSqueezy. Merchant-of-record integration ongoing |
| 2024 | Lucia Auth | Deprecated. Author recommends Oslo libs for custom auth |
| 2024 | WorkOS | Launched AuthKit. Free SSO up to 1M MAU |
| 2025 | Neon | 80% price reduction across tiers |
| 2025 | Replicate | Acquired by Cloudflare |
| 2025 | BetterStack | Merged Better Uptime + Logtail into unified platform |
| 2025 | Payload CMS | v3 released, built on Next.js |

---

*Last updated: February 2026. Pricing changes frequently. Always verify on provider sites.*
