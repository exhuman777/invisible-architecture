# API Service Stack

For API-first backends, microservices, webhook processors, internal tools. Lightweight, fast, cheap to run.

## The Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Hono | Lightweight, runs everywhere (Workers, Node, Bun, Deno) |
| Hosting | Railway ($5/mo) or Fly.io | Railway: simplest DX. Fly: edge regions |
| Database | Neon Postgres (free tier) | Serverless Postgres, branching, generous free tier |
| ORM | Drizzle | Type-safe, SQL-like, lightweight |
| Validation | Zod | Schema validation + TypeScript inference |
| Cache | Upstash Redis (free tier) | Serverless Redis, HTTP-based |
| Queue | Inngest or Upstash QStash | Background jobs, retries, scheduling |
| Auth | JWT (jose) or API keys | jose: standard JWT. API keys: simplest |
| Docs | Scalar (OpenAPI) | Modern, auto-generated from schemas |
| Monitoring | BetterStack | Uptime + logs in one place |

### Alternative: Fastify

If you need Node.js specifically (npm packages that need Node APIs), use Fastify instead of Hono. Fastify benchmarks faster than Express by 2-3x, has a solid plugin system, and good TypeScript support.

```bash
npx fastify-cli generate my-api --lang=ts
```

Hono wins on portability (deploy to Workers, Bun, Deno, or Node). Fastify wins on Node.js ecosystem depth.

## Monthly Cost

| Stage | Cost |
|-------|------|
| Development | $0 |
| Launch | $5-10/mo (Railway hobby) |
| Growing | $20-50/mo |
| Scale | $50-200/mo |

## Setup

### 1. Create Project

```bash
# For Cloudflare Workers
npm create hono@latest my-api  # select cloudflare-workers

# For Node.js / Railway
npm create hono@latest my-api  # select nodejs
```

### 2. Install Dependencies

```bash
cd my-api
npm i drizzle-orm @neondatabase/serverless zod
npm i -D drizzle-kit
```

### 3. Project Structure

```
src/
  index.ts         - App entry, mount routes
  routes/          - One file per resource
    users.ts
    invoices.ts
    health.ts
  middleware/
    auth.ts        - JWT/API key verification
    ratelimit.ts   - Rate limiting
    error.ts       - Global error handler
  schemas/         - Zod validation schemas
    user.ts
    invoice.ts
  db/
    schema.ts      - Drizzle schema
    index.ts       - DB client
    migrations/    - SQL migrations
  lib/
    errors.ts      - Custom error classes
    utils.ts       - Shared helpers
  types/           - TypeScript types
drizzle.config.ts  - Drizzle Kit config
```

### 4. App Entry

```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/error'
import { users } from './routes/users'
import { invoices } from './routes/invoices'
import { health } from './routes/health'

const app = new Hono()

// Global middleware
app.use('*', logger())
app.use('*', cors())
app.onError(errorHandler)

// Routes
app.route('/api/health', health)
app.route('/api/users', users)
app.route('/api/invoices', invoices)

export default app
```

### 5. Route Example

```typescript
// src/routes/users.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth'
import { createUserSchema, updateUserSchema } from '../schemas/user'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

const app = new Hono()

// Public
app.post('/', zValidator('json', createUserSchema), async (c) => {
  const data = c.req.valid('json')
  const [user] = await db.insert(users).values(data).returning()
  return c.json({ data: user }, 201)
})

// Protected
app.use('/*', authMiddleware)

app.get('/', async (c) => {
  const allUsers = await db.select().from(users)
  return c.json({ data: allUsers })
})

app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const [user] = await db.select().from(users).where(eq(users.id, id))
  if (!user) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: user })
})

app.patch('/:id', zValidator('json', updateUserSchema), async (c) => {
  const id = c.req.param('id')
  const data = c.req.valid('json')
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()
  if (!user) return c.json({ error: 'Not found' }, 404)
  return c.json({ data: user })
})

export { app as users }
```

### 6. Database Schema

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

```typescript
// src/db/index.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

### 7. Validation Schemas

```typescript
// src/schemas/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin']).default('user'),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
```

### 8. Error Handler

```typescript
// src/middleware/error.ts
import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }
  if (err instanceof ZodError) {
    return c.json({ error: 'Validation failed', details: err.issues }, 400)
  }
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal server error' }, 500)
}
```

### 9. Auth Middleware

```typescript
// src/middleware/auth.ts
import type { MiddlewareHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'

// JWT auth
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing token' })
  }
  const token = header.slice(7)
  try {
    const payload = await verify(token, c.env.JWT_SECRET)
    c.set('userId', payload.sub)
    await next()
  } catch {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
}

// API key auth (simpler alternative)
export const apiKeyMiddleware: MiddlewareHandler = async (c, next) => {
  const key = c.req.header('X-API-Key')
  if (!key) throw new HTTPException(401, { message: 'Missing API key' })
  // Validate key against database or env
  const valid = key === c.env.API_KEY // simple version
  if (!valid) throw new HTTPException(401, { message: 'Invalid API key' })
  await next()
}
```

## Deploy

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login + deploy
railway login
railway init
railway up

# Set env vars
railway variables set DATABASE_URL=...
railway variables set JWT_SECRET=...
```

### Cloudflare Workers

```bash
# Already configured if you chose cloudflare-workers template
npx wrangler deploy
```

### Fly.io

```bash
fly launch
fly secrets set DATABASE_URL=...
fly deploy
```

## CLAUDE.md Template

```markdown
# Project: [Name]
REST API. Hono + Neon Postgres + Drizzle ORM.

## Structure
src/index.ts       - App entry, mount routes
src/routes/        - One file per resource
src/middleware/     - Auth, rate limit, error handling
src/schemas/       - Zod validation schemas
src/db/schema.ts   - Drizzle schema
src/db/index.ts    - Database client
src/lib/           - Shared utilities
src/types/         - TypeScript types

## Commands
- dev: `npm run dev`
- test: `vitest run`
- db:generate: `drizzle-kit generate`
- db:push: `drizzle-kit push`
- deploy: `railway up` or `wrangler deploy`

## Conventions
- Named exports, one resource per route file
- All inputs validated with Zod via zValidator middleware
- Errors: throw HTTPException, global handler catches
- Response shape: `{ data }` for success, `{ error, details? }` for errors
- Auth: JWT Bearer token, verified in middleware
- IDs: UUIDs, generated by database

## Don't
- Don't skip Zod validation on any endpoint
- Don't return raw database errors to clients
- Don't use `any` type
- Don't hardcode secrets (use env vars)
```

## Key Patterns

**Middleware chain:** auth, then rate limit, then validate, then handle. Each layer rejects bad requests early.

**Structured errors:** every error response follows `{ error: string, details?: any }`. Clients parse errors reliably.

**Database migrations:** generate with Drizzle Kit, apply before deploy. Never modify production schema manually.

**Health check endpoint:** `GET /api/health` returns 200 with DB connectivity status. Use for uptime monitoring and deploy checks.

```typescript
// src/routes/health.ts
import { Hono } from 'hono'
import { db } from '../db'
import { sql } from 'drizzle-orm'

const app = new Hono()

app.get('/', async (c) => {
  try {
    await db.execute(sql`SELECT 1`)
    return c.json({ status: 'ok', db: 'connected' })
  } catch {
    return c.json({ status: 'degraded', db: 'disconnected' }, 503)
  }
})

export { app as health }
```
