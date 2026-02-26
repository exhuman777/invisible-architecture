# Solo Founder SaaS Stack

The complete stack for one person building a SaaS product. Optimized for speed, low cost, and minimal ops.

## The Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Full-stack, huge ecosystem, Vercel deploys |
| Hosting | Vercel Pro ($20/mo) | Zero config, edge functions, preview deploys |
| Database | Supabase ($25/mo) or Neon (free) | Postgres, real-time, auth built in |
| Auth | Clerk (free < 10K MAU) or Supabase Auth | Clerk: best DX. Supabase Auth: free forever |
| Payments | Stripe (2.9% + 30c) | Industry standard, great docs |
| Email | Resend (free 100/day) | Simple API, React email templates |
| Analytics | PostHog (free 1M events) | Product analytics, session replay, feature flags |
| Errors | Sentry (free 5K events) | Error tracking with source maps |
| Background Jobs | Inngest (free 50K runs) | Event-driven, retries, cron |
| File Storage | Cloudflare R2 (free 10GB) | S3-compatible, no egress fees |

## Monthly Cost

| Stage | Cost |
|-------|------|
| Building (pre-launch) | $0 |
| Launch (first users) | $0-25/mo |
| Growing (1K users) | $50-100/mo |
| Scaling (10K users) | $200-500/mo |

API costs dominate at scale. Free tiers cover you until revenue exists.

## Setup (30 minutes)

### 1. Scaffold

```bash
npx create-next-app@latest my-saas \
  --typescript --tailwind --app --src-dir --import-alias "@/*"
cd my-saas
```

### 2. Install Core Dependencies

```bash
# Database
npm i @supabase/ssr @supabase/supabase-js

# Auth (pick one)
npm i @clerk/nextjs
# OR use Supabase Auth (already installed)

# Payments
npm i stripe @stripe/stripe-js

# Email
npm i resend

# UI
npx shadcn@latest init
npx shadcn@latest add button card input label
```

### 3. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

RESEND_API_KEY=
```

### 4. Supabase Client

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### 5. Stripe Webhook

```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'checkout.session.completed':
      // Provision access
      break
    case 'customer.subscription.deleted':
      // Revoke access
      break
    case 'invoice.payment_failed':
      // Notify user
      break
  }

  return Response.json({ received: true })
}
```

### 6. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard
# Connect custom domain
```

## CLAUDE.md Template

```markdown
# Project: [Name]
SaaS app. Next.js 15 + Supabase + Clerk + Stripe.

## Structure
src/app/           - Pages (App Router)
src/app/api/       - API routes (webhooks only)
src/actions/       - Server actions (all mutations)
src/components/    - React components (shadcn/ui based)
src/lib/           - Supabase client, Stripe helpers, utils
src/hooks/         - Custom React hooks
src/types/         - TypeScript types

## Commands
- dev: `npm run dev`
- build: `npm run build`
- test: `vitest run`
- lint: `npm run lint`

## Conventions
- Server actions for all data mutations
- Server components by default, 'use client' only when needed
- Supabase client: `createClient()` from `@/lib/supabase/server`
- Tailwind + shadcn/ui for styling, no CSS modules
- Named exports only (except page.tsx, layout.tsx)

## Auth
- Clerk middleware in src/middleware.ts
- Server: `auth()` from `@clerk/nextjs/server`
- Client: `useUser()` from `@clerk/nextjs`
- Clerk user ID maps to Supabase `user_id` column

## Payments
- Stripe Checkout for subscription creation
- Webhooks handle provisioning (src/app/api/webhooks/stripe/)
- Plans defined in src/lib/stripe/plans.ts
- Never trust client-side plan data, always verify server-side

## Don't
- Don't use pages/ router
- Don't fetch data in client components
- Don't expose service_role key
- Don't install packages without asking
```

## Key Decisions

**Server Components vs Client Components.** Default to server components. Only add `'use client'` when you need hooks, event handlers, or browser APIs. Most pages can be server components that fetch data directly.

**Server Actions vs API Routes.** Use server actions for mutations (create, update, delete). Use API routes only for webhooks and external integrations. Server actions give you type safety end-to-end and work with React's form handling.

**Clerk vs Supabase Auth.** Clerk: better DX, prebuilt components, user management dashboard, but costs money at scale. Supabase Auth: free forever, tighter DB integration, more DIY. Pick Clerk if you want to move fast. Pick Supabase Auth if you want fewer dependencies.

**When to add caching.** Not on day one. Supabase handles most query loads fine. Add caching (Redis via Upstash, or Next.js `unstable_cache`) when you see slow responses in production. Premature caching creates bugs.

## What to Build First

1. Landing page with pricing
2. Auth (sign up, sign in, sign out)
3. Stripe checkout + webhook handling
4. The core feature (whatever your SaaS does)
5. Dashboard/settings page
6. Transactional emails (welcome, receipt, cancellation)

Ship the landing page and waitlist before building the product. Validate demand first, code second.
