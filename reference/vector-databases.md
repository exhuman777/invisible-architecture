# Vector Databases

> Last verified: February 2026. Comparison for RAG, semantic search, and embedding use cases.

---

## Overview

Vector databases store and query high-dimensional embeddings for similarity search. Essential for RAG (retrieval-augmented generation), recommendation systems, and semantic search.

**How vector search works:**
1. Convert text/images to embeddings (fixed-size number arrays) using an embedding model
2. Store embeddings in a vector database with metadata
3. Query: convert question to embedding, find nearest neighbors
4. Return most similar results by distance metric

---

## Database Comparison

| Database | URL | Type | Language | Hosting | License |
|----------|-----|------|----------|---------|---------|
| pgvector | [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector) | Postgres extension | C | Self-host, Supabase, Neon | PostgreSQL License |
| Pinecone | [pinecone.io](https://pinecone.io) | Managed cloud | Proprietary | Cloud only | Proprietary |
| Qdrant | [qdrant.tech](https://qdrant.tech) | Dedicated vector DB | Rust | Cloud or self-host | Apache 2.0 |
| Weaviate | [weaviate.io](https://weaviate.io) | Dedicated vector DB | Go | Cloud or self-host | BSD-3 |
| Chroma | [trychroma.com](https://trychroma.com) | Embedded / server | Python | Embedded, self-host, cloud | Apache 2.0 |
| Turbopuffer | [turbopuffer.com](https://turbopuffer.com) | Serverless | Proprietary | Cloud only | Proprietary |
| LanceDB | [lancedb.com](https://lancedb.com) | Embedded, serverless | Rust + Python | Embedded, cloud | Apache 2.0 |

---

## Detailed Breakdown

### pgvector

**URL:** [github.com/pgvector/pgvector](https://github.com/pgvector/pgvector)
**Install:** `CREATE EXTENSION vector;` (in Postgres)

| Feature | Details |
|---------|---------|
| Max dimensions | 2,000 |
| Distance metrics | L2 (Euclidean), inner product, cosine, L1, Hamming, Jaccard |
| Indexing | IVFFlat, HNSW |
| Filtering | Full SQL WHERE clauses (exact, pre-filter) |
| Transactions | Full ACID (inherits from Postgres) |
| Hybrid search | Combine with `tsvector` full-text search |
| Hosting | Supabase (built-in), Neon (built-in), any Postgres host |
| Cost | Free (use existing Postgres) |

**Strengths:**
- Zero additional infrastructure if already using Postgres
- Full SQL power for filtering, joins, aggregations
- ACID transactions, backups, replication come free
- Supabase and Neon include pgvector by default

**Limitations:**
- Performance ceiling at very large scale (100M+ vectors)
- 2,000 dimension limit (sufficient for most models)
- Not optimized purely for vector ops like dedicated DBs

```sql
-- Create table with vector column
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536)
);

-- Create HNSW index
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- Query nearest neighbors
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]') AS similarity
FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 10;
```

---

### Pinecone

**URL:** [pinecone.io](https://pinecone.io)
**Install:** `pip install pinecone` / `npm install @pinecone-database/pinecone`

| Feature | Details |
|---------|---------|
| Max dimensions | 20,000 |
| Distance metrics | Cosine, Euclidean, dot product |
| Indexing | Proprietary (optimized ANN) |
| Filtering | Metadata filtering (JSON) |
| Namespaces | Partition data within an index |
| Serverless | Auto-scaling, pay per query |
| Hybrid search | Sparse-dense vectors for keyword + semantic |

**Pricing:**

| Tier | Cost | Includes |
|------|------|----------|
| Free (Starter) | $0 | 1 index, 2GB storage |
| Standard | $0.08/1M reads, $2/GB storage | Serverless, auto-scale |
| Enterprise | Custom | Dedicated, SLA |

**Strengths:**
- Zero ops. Fully managed, auto-scales
- Large ecosystem, many integrations (LangChain, LlamaIndex, AI SDK)
- Serverless tier scales to zero cost when idle
- Inference API: embed + search in one call

**Limitations:**
- Cloud-only (no self-host option)
- Vendor lock-in
- Can get expensive at scale with high query volume

---

### Qdrant

**URL:** [qdrant.tech](https://qdrant.tech)
**Install:** `pip install qdrant-client` / `npm install @qdrant/js-client-rest`

| Feature | Details |
|---------|---------|
| Max dimensions | 65,535 |
| Distance metrics | Cosine, Euclidean, dot product, Manhattan |
| Indexing | HNSW (custom implementation) |
| Filtering | Rich payload filtering (nested, geo, range, full-text) |
| Quantization | Scalar, product, binary quantization |
| Multi-vector | Store multiple vectors per point |
| Sparse vectors | Hybrid search with sparse + dense |
| Snapshots | Point-in-time backups |

**Pricing (Cloud):**

| Tier | Cost | Includes |
|------|------|----------|
| Free | $0 | 1GB RAM, 1 cluster |
| Hybrid Cloud | From $0.078/hr | Self-managed on your infra |
| Managed Cloud | From $0.078/hr | Fully managed by Qdrant |

**Strengths:**
- Written in Rust, fast and memory-efficient
- Best filtering capabilities of any vector DB
- Quantization reduces memory 4-32x with minimal quality loss
- Open source, self-hostable (Docker one-liner)
- Payload (metadata) indexing for fast pre-filtering

**Limitations:**
- Cloud UI less polished than Pinecone
- Smaller ecosystem than Pinecone (growing fast)

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(":memory:")  # or url="http://localhost:6333"

client.create_collection(
    collection_name="docs",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

client.upsert(
    collection_name="docs",
    points=[
        PointStruct(id=1, vector=[0.1, 0.2, ...], payload={"text": "hello"}),
    ],
)

results = client.query_points(
    collection_name="docs",
    query=[0.1, 0.2, ...],
    limit=10,
)
```

---

### Weaviate

**URL:** [weaviate.io](https://weaviate.io)
**Install:** `pip install weaviate-client` / `npm install weaviate-client`

| Feature | Details |
|---------|---------|
| Max dimensions | 65,535 |
| Distance metrics | Cosine, L2, dot product, Manhattan, Hamming |
| Indexing | HNSW (custom) |
| Filtering | Structured + keyword + vector (hybrid) |
| GraphQL API | Query via GraphQL |
| Modules | Vectorizer modules (auto-embed text, images) |
| Multi-tenancy | Built-in tenant isolation |
| Generative search | RAG built into query pipeline |

**Pricing (Cloud):**

| Tier | Cost | Includes |
|------|------|----------|
| Sandbox | Free | 14-day expiring clusters |
| Serverless | From $25/mo | Pay per data stored |
| Enterprise | Custom | Dedicated, SLA |

**Strengths:**
- Best hybrid search (keyword + vector in one query)
- Vectorizer modules auto-embed on insert (no separate embedding step)
- GraphQL API familiar to frontend devs
- Generative search pipes results through LLM in one call
- Multi-tenancy for SaaS apps

**Limitations:**
- GraphQL API has learning curve
- Heavier resource usage than Qdrant
- Module system adds complexity

---

### Chroma

**URL:** [trychroma.com](https://trychroma.com)
**Install:** `pip install chromadb` / `npm install chromadb`

| Feature | Details |
|---------|---------|
| Max dimensions | No hard limit |
| Distance metrics | Cosine, L2, inner product |
| Indexing | HNSW |
| Filtering | Metadata filtering (WHERE clauses) |
| Embedding | Built-in embedding functions |
| Modes | In-memory, persistent (local), client-server |
| Multi-modal | Text + image embeddings |

**Pricing:**

| Tier | Cost | Notes |
|------|------|-------|
| Open source | Free | Self-hosted, embedded |
| Cloud (alpha) | TBD | Managed hosting coming |

**Strengths:**
- Simplest API. 4 lines to start
- Runs embedded in your Python process (no server needed)
- Built-in embedding functions (skip embedding step)
- Perfect for prototyping, notebooks, local dev
- Open source, active community

**Limitations:**
- Not designed for production scale (millions of vectors)
- Cloud offering still maturing
- Limited filtering compared to Qdrant/Weaviate

```python
import chromadb

client = chromadb.Client()
collection = client.create_collection("docs")

collection.add(
    documents=["hello world", "vector databases rock"],
    ids=["1", "2"],
)

results = collection.query(query_texts=["greeting"], n_results=1)
```

---

### Turbopuffer

**URL:** [turbopuffer.com](https://turbopuffer.com)
**Install:** `pip install turbopuffer` / `npm install @turbopuffer/turbopuffer`

| Feature | Details |
|---------|---------|
| Max dimensions | 8,192 |
| Distance metrics | Cosine, Euclidean |
| Indexing | Custom (tiered storage) |
| Filtering | Attribute filtering |
| Storage | Object storage backed (S3/R2) |
| Pricing | Pay per query + storage |
| Multi-tenancy | Namespace-based |

**Pricing:**

| Component | Cost |
|-----------|------|
| Storage | $0.30/GB/month |
| Writes | $0.04 per 1K upserted vectors |
| Full-cache queries | $0.04 per 1K results |
| Warm queries | $0.08 per 1K results |

**Strengths:**
- Cost-efficient at scale (object storage backing)
- Scales to billions of vectors
- No fixed cluster costs (true pay-per-query)
- Good for high-volume, cost-sensitive workloads

**Limitations:**
- Newer, smaller community
- Fewer integrations than Pinecone/Qdrant
- Cloud-only

---

### LanceDB

**URL:** [lancedb.com](https://lancedb.com)
**Install:** `pip install lancedb` / `npm install @lancedb/lancedb`

| Feature | Details |
|---------|---------|
| Max dimensions | No hard limit |
| Distance metrics | L2, cosine, dot product |
| Indexing | IVF-PQ, DiskANN |
| Filtering | SQL-like filtering |
| Storage | Lance format (columnar, versioned) |
| Multi-modal | Native image, text, video storage |
| Embedded | Runs in-process, no server |
| Versioning | Git-like data versioning |

**Pricing:**

| Tier | Cost | Notes |
|------|------|-------|
| Open source | Free | Embedded, self-hosted |
| LanceDB Cloud | Preview | Serverless managed |

**Strengths:**
- Embedded (no server, runs in your process)
- Lance columnar format: fast scan + vector search
- Built-in data versioning
- Multi-modal: store embeddings alongside raw data
- Good for edge deployments, offline apps

**Limitations:**
- Newer, ecosystem still growing
- Cloud offering in preview
- Less battle-tested at scale

---

## Feature Comparison Matrix

| Feature | pgvector | Pinecone | Qdrant | Weaviate | Chroma | Turbopuffer | LanceDB |
|---------|----------|----------|--------|----------|--------|-------------|---------|
| Max dims | 2,000 | 20,000 | 65,535 | 65,535 | No limit | 8,192 | No limit |
| Self-host | Via PG | No | Yes | Yes | Yes | No | Yes |
| Managed cloud | Supabase/Neon | Yes | Yes | Yes | Coming | Yes | Preview |
| Embedded mode | No | No | Yes (memory) | No | Yes | No | Yes |
| HNSW index | Yes | Custom | Yes | Yes | Yes | Custom | IVF-PQ |
| Hybrid search | tsvector | Sparse vectors | Sparse vectors | Built-in | No | No | Full-text |
| Filtering | Full SQL | Metadata | Rich payload | GraphQL | Metadata | Attributes | SQL-like |
| Multi-vector | No | No | Yes | No | No | No | Yes |
| Quantization | No | Auto | Yes (3 types) | Yes | No | Auto | PQ |
| Multi-tenancy | Schemas | Namespaces | Collections | Built-in | Collections | Namespaces | Tables |
| ACID | Yes | No | No | No | No | No | Versioned |
| Free tier | Free (ext) | 1 index | 1GB cloud | Sandbox | Free (OSS) | Pay-per-use | Free (OSS) |

---

## Distance Metrics Explained

| Metric | Use When | Formula | Notes |
|--------|----------|---------|-------|
| Cosine similarity | Comparing text embeddings | 1 - cos(θ) | Normalized, direction-based. Most common for NLP |
| Euclidean (L2) | Absolute distance matters | √Σ(a-b)² | Sensitive to magnitude |
| Dot product | Embeddings pre-normalized | Σ(a×b) | Fastest computation |
| Manhattan (L1) | Sparse data | Σ|a-b| | Robust to outliers |

**Default recommendation:** Use cosine similarity for text embeddings. Most embedding models normalize outputs, making cosine and dot product equivalent.

---

## Embedding Model Pairing

| Embedding Model | Dimensions | Recommended DB | Notes |
|----------------|-----------|----------------|-------|
| OpenAI text-embedding-3-small | 1536 | Any | Most popular. pgvector handles fine |
| OpenAI text-embedding-3-large | 3072 | Any (watch pgvector 2K limit) | Matryoshka: can truncate to 256-1536 |
| Voyage voyage-3-large | 1024 | Any | Top quality |
| Cohere embed-v4 | 1024 | Any | Best multilingual |
| Gemini embedding | 768 | Any | Free via AI Studio |

**Matryoshka embeddings** (text-embedding-3-small/large): Can truncate dimensions. Use 512 dims for cost savings with ~2% quality drop.

---

## Performance Benchmarks (Approximate)

Query latency for 1M vectors, 1536 dimensions, top-10 recall >95%:

| Database | p50 Latency | p99 Latency | QPS (single node) |
|----------|-------------|-------------|-------------------|
| pgvector (HNSW) | ~5ms | ~20ms | ~500 |
| Pinecone (serverless) | ~10ms | ~50ms | auto-scales |
| Qdrant | ~2ms | ~10ms | ~1,500 |
| Weaviate | ~5ms | ~25ms | ~800 |
| Chroma | ~10ms | ~50ms | ~300 |

*Benchmarks vary by hardware, configuration, and data distribution. Use as rough guide only.*

---

## Quick Picks

### By Use Case

| Scenario | Pick | Why |
|----------|------|-----|
| Prototyping / local dev | Chroma | 4 lines of code, runs in-process |
| Already using Postgres | pgvector | No new infrastructure, SQL filtering |
| Production, managed, zero-ops | Pinecone | Serverless, auto-scales, largest ecosystem |
| Production, best performance | Qdrant Cloud | Rust speed, best filtering, quantization |
| Hybrid search (keyword + vector) | Weaviate | Built-in BM25 + vector fusion |
| Cost-sensitive at scale | Turbopuffer | Object storage backed, pay per query |
| Edge / embedded / offline | LanceDB | Runs in-process, no server needed |
| Supabase stack | pgvector (via Supabase) | Built into Supabase, AI toolkit included |

### By Scale

| Scale | Pick | Notes |
|-------|------|-------|
| <100K vectors | Chroma or pgvector | Keep simple |
| 100K-10M vectors | pgvector, Pinecone, or Qdrant | All handle well |
| 10M-100M vectors | Pinecone, Qdrant, Turbopuffer | Need optimized indexing |
| 100M+ vectors | Turbopuffer or Qdrant (sharded) | Cost and performance critical |

### Decision Tree

```
Already using Postgres?
  ├─ Yes → pgvector (add extension, done)
  └─ No
      ├─ Prototyping? → Chroma (embedded, simple)
      ├─ Production, want managed? → Pinecone or Qdrant Cloud
      ├─ Need hybrid search? → Weaviate
      ├─ Cost-sensitive, high volume? → Turbopuffer
      └─ Edge / embedded? → LanceDB
```

---

## Common RAG Architecture

```
User Query
    │
    ▼
Embedding Model (OpenAI, Voyage, etc.)
    │
    ▼
Vector Database ──search──► Top K similar chunks
    │
    ▼
LLM (Claude, GPT-4o, etc.)
    │  receives: system prompt + retrieved chunks + user query
    ▼
Generated Answer (grounded in retrieved context)
```

**Chunking strategies:**
- Fixed size (512-1024 tokens) with overlap (50-100 tokens)
- Semantic chunking (split on topic boundaries)
- Document-aware (respect headers, paragraphs, code blocks)

**Reranking:** After vector search, use a reranker (Cohere rerank, cross-encoder) to improve precision. Retrieve 50, rerank to top 10.

---

## Integration with Frameworks

| Framework | Built-in Support |
|-----------|-----------------|
| LangChain | All vector DBs (pgvector, Pinecone, Qdrant, Weaviate, Chroma, etc.) |
| LlamaIndex | All major vector DBs |
| Vercel AI SDK | Via plugins, or direct SDK calls |
| Mastra | Built-in vector search (Pinecone, pgvector) |
| Supabase | pgvector + edge functions + AI toolkit |

---

*Last updated: February 2026. Benchmarks and pricing change. Verify on provider sites.*
