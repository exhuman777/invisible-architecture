# AI-Powered App Stack

The stack for building apps with AI features: chatbots, RAG, agents, content generation. Optimized for streaming, cost control, and good UX.

## The Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Streaming support, server components |
| AI SDK | Vercel AI SDK (`ai` package) | Framework-agnostic, streaming, tool use |
| LLM | Claude (Anthropic) or GPT-4o (OpenAI) | Claude: best reasoning. GPT-4o: fastest |
| Vector DB | pgvector (Supabase) or Pinecone | pgvector: free with Supabase. Pinecone: managed |
| Embeddings | OpenAI text-embedding-3-small | Cheap ($0.02/1M tokens), good quality |
| Hosting | Vercel | Streaming response support, edge runtime |
| Database | Supabase (with pgvector) | Postgres + vectors in one place |
| Background | Inngest | Long-running AI tasks, retries |
| Rate Limiting | Upstash Ratelimit | Redis-based, edge-compatible |

## Monthly Cost

AI API costs dominate everything else.

| Usage | LLM Cost | Infra Cost | Total |
|-------|----------|------------|-------|
| Building/testing | $5-20 | $0 | $5-20 |
| 100 users | $50-200 | $25 | $75-225 |
| 1K users | $200-1000 | $50 | $250-1050 |

Cost control matters. Cache responses, use cheaper models for simple tasks, set per-user limits.

## Setup

### 1. Scaffold

```bash
npx create-next-app@latest my-ai-app \
  --typescript --tailwind --app --src-dir
cd my-ai-app
```

### 2. Install Dependencies

```bash
# AI SDK
npm i ai @ai-sdk/anthropic @ai-sdk/openai

# Database + Vectors
npm i @supabase/ssr @supabase/supabase-js

# Rate limiting
npm i @upstash/ratelimit @upstash/redis

# UI
npx shadcn@latest init
```

### 3. Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Key Patterns

### Streaming Chat

```typescript
// src/app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `You are a helpful assistant for [your domain].
             Be concise and accurate.`,
    messages,
    maxTokens: 1024,
  })

  return result.toDataStreamResponse()
}
```

```typescript
// src/components/chat.tsx
'use client'
import { useChat } from '@ai-sdk/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: '/api/chat' })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

### RAG (Retrieval-Augmented Generation)

#### 1. Enable pgvector in Supabase

```sql
-- Run in Supabase SQL editor
create extension if not exists vector;

create table documents (
  id bigserial primary key,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index on documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
```

#### 2. Embed Documents

```typescript
// src/lib/embeddings.ts
import { openai } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'

export async function embedText(text: string) {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  })
  return embedding
}

export async function embedBatch(texts: string[]) {
  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: texts,
  })
  return embeddings
}
```

#### 3. Search + Generate

```typescript
// src/lib/rag.ts
import { createClient } from '@/lib/supabase/server'
import { embedText } from '@/lib/embeddings'

export async function searchDocuments(query: string, limit = 5) {
  const embedding = await embedText(query)
  const supabase = await createClient()

  const { data } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
  })

  return data
}
```

```sql
-- Supabase function for similarity search
create function match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
) returns table (id bigint, content text, similarity float)
language plpgsql as $$
begin
  return query
  select
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### Tool Use

```typescript
// src/app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic'
import { streamText, tool } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    tools: {
      getWeather: tool({
        description: 'Get current weather for a city',
        parameters: z.object({
          city: z.string().describe('City name'),
        }),
        execute: async ({ city }) => {
          const res = await fetch(
            `https://api.weather.com/v1?city=${city}`
          )
          return res.json()
        },
      }),
      searchDocs: tool({
        description: 'Search internal documentation',
        parameters: z.object({
          query: z.string().describe('Search query'),
        }),
        execute: async ({ query }) => {
          return searchDocuments(query)
        },
      }),
    },
    maxSteps: 5, // allow multiple tool calls
  })

  return result.toDataStreamResponse()
}
```

### Rate Limiting

```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 h'), // 20 requests per hour
})
```

```typescript
// In your API route
const { success } = await ratelimit.limit(userId)
if (!success) {
  return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### Chat History Storage

```typescript
// Store conversations in Supabase
// src/lib/chat-history.ts
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
) {
  const supabase = await createClient()
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    role,
    content,
  })
}

export async function loadHistory(conversationId: string, limit = 50) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit)
  return data
}
```

## CLAUDE.md Template

```markdown
# Project: [Name]
AI-powered [description]. Next.js 15 + Vercel AI SDK + Supabase + pgvector.

## Structure
src/app/           - Pages
src/app/api/chat/  - Chat streaming endpoint
src/components/    - React components
src/lib/           - AI helpers, Supabase client, embeddings
src/lib/rag.ts     - RAG search + document processing

## Commands
- dev: `npm run dev`
- test: `vitest run`

## AI Patterns
- Streaming via Vercel AI SDK `streamText()`
- RAG: embed → store in pgvector → retrieve → augment prompt
- Tool use: define tools in route handler, AI calls them
- Rate limiting: Upstash, 20 req/hr per user

## Conventions
- Server components by default
- All AI routes in src/app/api/
- Embeddings: OpenAI text-embedding-3-small
- LLM: Claude for complex tasks, GPT-4o-mini for simple ones
- Always set maxTokens to prevent runaway costs

## Don't
- Don't store API keys client-side
- Don't skip rate limiting
- Don't use embeddings without chunking large documents
- Don't send entire chat history (limit to last 50 messages)
```

## Cost Control Tips

1. **Use cheaper models for simple tasks.** Classify intent with GPT-4o-mini ($0.15/1M tokens), generate with Claude only when needed.
2. **Cache common queries.** Same question = same answer. Use Redis/Upstash to cache for 1 hour.
3. **Set maxTokens.** Always. A runaway response can cost dollars.
4. **Chunk documents.** Embed 500-token chunks, not entire documents. Better retrieval, lower costs.
5. **Set per-user limits.** Free tier: 20 messages/day. Paid: 200. Hard limits prevent surprise bills.
