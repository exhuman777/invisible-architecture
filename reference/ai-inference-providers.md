# AI Inference Providers

> Last verified: February 2026. Pricing per 1M tokens (USD). Context windows in tokens.

---

## Tier 1: Frontier Model Providers

### Anthropic

| Model | Input $/1M | Output $/1M | Context | Key Features |
|-------|-----------|-------------|---------|--------------|
| Claude Opus 4.6 | $15 | $75 | 200K | Most capable. Extended thinking, deep analysis, coding |
| Claude Sonnet 4.6 | $3 | $15 | 200K | Best value for complex tasks. Fast, strong coding |
| Claude Haiku 4.5 | $0.80 | $4 | 200K | Speed-optimized. Good for classification, extraction |

**API:** `api.anthropic.com`
**SDK:** `@anthropic-ai/sdk` (npm), `anthropic` (PyPI)
**Key Features:**
- 200K context across all models
- Tool use / function calling
- Vision (image understanding)
- Extended thinking (chain of thought in Opus/Sonnet)
- Prompt caching: 90% cost reduction on cached prefixes
- Batch API: 50% cost reduction, 24hr turnaround
- PDF support (direct document processing)
- Citations (grounded references to source docs)

**Prompt Caching Pricing:**

| Model | Cache Write $/1M | Cache Read $/1M | Savings vs Input |
|-------|-----------------|-----------------|------------------|
| Opus 4.6 | $18.75 | $1.50 | 90% on reads |
| Sonnet 4.6 | $3.75 | $0.30 | 90% on reads |
| Haiku 4.5 | $1.00 | $0.08 | 90% on reads |

---

### OpenAI

| Model | Input $/1M | Output $/1M | Context | Key Features |
|-------|-----------|-------------|---------|--------------|
| GPT-4.5 | $75 | $150 | 128K | Largest model. Better at "soft" tasks, creativity |
| GPT-4o | $2.50 | $10 | 128K | Workhorse model. Fast, multimodal |
| GPT-4o-mini | $0.15 | $0.60 | 128K | Budget option. Good for simple tasks |
| o3 | $10 | $40 | 200K | Reasoning model. Chain of thought. Strong at math/code |
| o4-mini | $1.10 | $4.40 | 200K | Budget reasoning. Good reasoning/cost ratio |

**API:** `api.openai.com`
**SDK:** `openai` (npm + PyPI)
**Key Features:**
- Function calling / tool use
- JSON mode / structured outputs
- Vision + audio input
- Responses API (new, replacing Completions for agents)
- DALL-E 3, GPT-4o image generation
- Realtime API (voice)
- Cached input: 50% cheaper (automatic, 5-10min TTL)
- Batch API: 50% off, 24hr

---

### Google

| Model | Input $/1M | Output $/1M | Context | Key Features |
|-------|-----------|-------------|---------|--------------|
| Gemini 2.5 Pro | $1.25 | $10 | 1M (under 200K pricing) | Best price/performance at scale. Thinking model |
| Gemini 2.5 Pro (>200K) | $2.50 | $15 | 1M | Higher price above 200K tokens |
| Gemini 2.5 Flash | $0.15 | $0.60 | 1M (under 200K pricing) | Fast, cheap. Thinking mode optional |
| Gemini 2.5 Flash (>200K) | $0.30 | $1.20 | 1M | Higher price above 200K tokens |

**API:** `generativelanguage.googleapis.com` (AI Studio) / Vertex AI
**SDK:** `@google/genai` (npm), `google-genai` (PyPI)
**Key Features:**
- 1M token context window (largest in production)
- Grounding with Google Search
- Code execution (runs Python in sandbox)
- Thinking mode (both Pro and Flash)
- Multimodal: text, image, video, audio, PDF
- Context caching available
- Free tier via Google AI Studio (generous limits)

---

### xAI

| Model | Input $/1M | Output $/1M | Context | Key Features |
|-------|-----------|-------------|---------|--------------|
| Grok 3 | $3 | $15 | 131K | Competitive with Sonnet/GPT-4o |
| Grok 3 Mini | $0.30 | $0.50 | 131K | Fast reasoning model |

**API:** `api.x.ai`
**Key Features:**
- Real-time X (Twitter) data access
- Vision support
- Fast inference

---

## Tier 2: Open Source Models

| Model Family | Developer | Top Model | Parameters | License | Notes |
|-------------|-----------|-----------|------------|---------|-------|
| Llama 4 | Meta | Maverick | 400B MoE (17B active) | Llama License | Maverick: 128 experts, 1 active. Scout: 109B, 16 experts |
| DeepSeek | DeepSeek | V3, R1 | V3: 671B MoE | MIT | R1: reasoning model. Very cheap via API. China-based |
| Mistral | Mistral AI | Large, Medium, Small | Large ~123B | Apache 2.0 (Small) | EU-based. Good multilingual. Le Chat consumer app |
| Qwen 3 | Alibaba | Qwen 3 235B | 235B MoE | Apache 2.0 | Competitive with Llama 4. Strong coding + reasoning |
| Gemma 3 | Google | 27B | 27B | Gemma License | Fits on single GPU. Good for on-device |
| Phi-4 | Microsoft | 14B | 14B | MIT | Small but punches above weight. Good for edge |

### Open Model Quick Picks

| Need | Pick | Why |
|------|------|-----|
| Best open model overall | Llama 4 Maverick | MoE efficiency, Meta ecosystem |
| Best reasoning (open) | DeepSeek R1 | Competitive with o3, MIT license |
| Best for EU compliance | Mistral Large | EU-based company |
| Best small model | Phi-4 or Gemma 3 | Fit on consumer hardware |

---

## Tier 3: Inference Platforms (Run Open Models)

| Platform | URL | Pricing Model | Speed | Key Feature |
|----------|-----|--------------|-------|-------------|
| Together.ai | [together.ai](https://together.ai) | Per token | Fast | Wide model selection, fine-tuning, dedicated endpoints |
| Fireworks.ai | [fireworks.ai](https://fireworks.ai) | Per token | Very fast | Optimized inference, function calling on open models |
| Groq | [groq.com](https://groq.com) | Per token | Extremely fast | Custom LPU hardware. Fastest inference available |
| Replicate | [replicate.com](https://replicate.com) | Per second | Variable | Acquired by Cloudflare. Run any model. Image/video models too |
| Modal | [modal.com](https://modal.com) | Per GPU-second | Fast | Serverless GPU. Run custom code + models. Great for batches |
| AWS Bedrock | [aws.amazon.com/bedrock](https://aws.amazon.com/bedrock) | Per token | Variable | Claude, Llama, Mistral via AWS. Enterprise compliance |
| Google Vertex AI | [cloud.google.com/vertex-ai](https://cloud.google.com/vertex-ai) | Per token | Variable | Gemini + Claude + open models. GCP integration |
| Azure AI | [azure.microsoft.com/ai](https://azure.microsoft.com/en-us/solutions/ai) | Per token | Variable | OpenAI models + open models. Enterprise Azure ecosystem |

### Inference Platform Pricing (Llama 4 Maverick, approximate)

| Platform | Input $/1M | Output $/1M | Notes |
|----------|-----------|-------------|-------|
| Together.ai | ~$0.40 | ~$0.40 | Shared endpoints |
| Fireworks.ai | ~$0.40 | ~$0.40 | Optimized serving |
| Groq | ~$0.50 | ~$0.50 | Fastest latency |
| AWS Bedrock | ~$0.50 | ~$0.65 | On-demand |

---

## Comparison: Cost per 1M Output Tokens

Sorted cheapest to most expensive (output tokens, standard pricing):

| Model | Output $/1M | Provider | Intelligence Tier |
|-------|-------------|----------|------------------|
| Gemini 2.5 Flash | $0.60 | Google | Mid |
| GPT-4o-mini | $0.60 | OpenAI | Entry |
| Haiku 4.5 | $4 | Anthropic | Entry |
| o4-mini | $4.40 | OpenAI | Reasoning |
| GPT-4o | $10 | OpenAI | Mid |
| Gemini 2.5 Pro | $10 | Google | High |
| Sonnet 4.6 | $15 | Anthropic | High |
| Grok 3 | $15 | xAI | High |
| o3 | $40 | OpenAI | Reasoning |
| Opus 4.6 | $75 | Anthropic | Frontier |
| GPT-4.5 | $150 | OpenAI | Frontier |

---

## Embedding Models

| Model | Provider | Dimensions | Price $/1M tokens | Notes |
|-------|----------|-----------|-------------------|-------|
| text-embedding-3-small | OpenAI | 1536 | $0.02 | Best value. Good for most use cases |
| text-embedding-3-large | OpenAI | 3072 | $0.13 | Higher quality, Matryoshka dims |
| voyage-3-large | Voyage AI | 1024 | $0.18 | Top benchmark scores. Code-optimized variant available |
| embed-v4 | Cohere | 1024 | $0.10 | Multilingual. Compression support |
| Gemini embedding | Google | 768 | Free (AI Studio) | Good for prototyping |

### Embedding Quick Picks

| Use Case | Pick | Why |
|----------|------|-----|
| General purpose | text-embedding-3-small | Cheapest, good enough |
| Best quality | voyage-3-large | Top benchmarks |
| Multilingual | Cohere embed-v4 | 100+ languages |
| Free / prototyping | Gemini embedding | Free via AI Studio |

---

## Image / Video / Audio Generation

| Model | Provider | Type | Pricing | Notes |
|-------|----------|------|---------|-------|
| GPT-4o image gen | OpenAI | Image generation | Included in GPT-4o pricing | Native in chat. Good quality |
| DALL-E 3 | OpenAI | Image generation | $0.04-$0.12/image | Via API. Multiple resolutions |
| Imagen 3 | Google | Image generation | Via Vertex AI pricing | High quality, Gemini integration |
| Stable Diffusion 3.5 | Stability AI | Image generation (open) | Self-host free, API varies | Open weights. Run on own GPU |
| Flux | Black Forest Labs | Image generation (open) | Self-host free, API via Replicate | High quality open model. Pro/Dev/Schnell variants |
| Sora | OpenAI | Video generation | ChatGPT Plus/Pro | Text-to-video. Limited API access |
| Veo 2 | Google | Video generation | Via Vertex AI | High quality video generation |
| Whisper | OpenAI | Speech-to-text | $0.006/min | Open source. Run locally or via API |
| ElevenLabs | ElevenLabs | Text-to-speech | Free tier, Pro $22/mo | Best voice cloning quality |
| TTS-1 / TTS-1-HD | OpenAI | Text-to-speech | $15/$30 per 1M chars | 6 voices. Simple API |

---

## Rate Limits & Quotas (Default Tiers)

| Provider | Free/Low Tier | Standard | Notes |
|----------|--------------|----------|-------|
| Anthropic | Tier 1: $100/mo spend limit | Tier 4: $4,000/mo | Auto-upgrades based on spend history |
| OpenAI | Tier 1: $100/mo | Tier 5: $50,000/mo | Based on successful payments + time |
| Google AI Studio | 15 RPM (free) | 1,000 RPM (paid) | Generous free tier for prototyping |
| Groq | 30 RPM, 6K tokens/min | Higher with paid tier | Very restrictive free limits |

---

## Cost Optimization Strategies

| Strategy | Savings | Works With | How |
|----------|---------|------------|-----|
| Prompt caching | Up to 90% | Anthropic, OpenAI, Google | Cache system prompts and repeated context |
| Batch API | 50% | Anthropic, OpenAI | Non-real-time workloads. 24hr turnaround |
| Smaller models first | 80-95% | All providers | Route simple tasks to Haiku/mini, complex to Sonnet/4o |
| Output length control | Variable | All | Set `max_tokens` to limit verbose responses |
| Structured output | ~20% | OpenAI, Anthropic | JSON mode reduces token waste |
| Semantic caching | 50-80% | Self-implemented | Cache similar queries. Use embeddings for similarity |
| Open models | 90%+ vs frontier | Together, Fireworks, Groq | Use Llama/Mistral for non-critical tasks |

### Model Routing Example

| Task Type | Model | Cost (1K calls, ~500 in / 500 out tokens) |
|-----------|-------|------------------------------------------|
| Classification | Haiku 4.5 | $0.0024 |
| Summarization | Gemini 2.5 Flash | $0.0004 |
| Code generation | Sonnet 4.6 | $0.009 |
| Complex analysis | Opus 4.6 | $0.045 |
| Reasoning / math | o3 | $0.025 |

---

## API Compatibility

| Feature | Anthropic | OpenAI | Google | Notes |
|---------|-----------|--------|--------|-------|
| REST API | Messages API | Chat Completions / Responses | GenerateContent | All use JSON over HTTPS |
| Streaming | SSE | SSE | SSE | Similar patterns |
| Tool use | Native | Function calling | Function declarations | Slightly different schemas |
| Structured output | Tool use trick | JSON mode / response_format | responseSchema | OpenAI most mature |
| Vision | Base64 or URL | Base64 or URL | Base64 or URL + video | Google handles video too |
| SDK (Node) | `@anthropic-ai/sdk` | `openai` | `@google/genai` | All TypeScript-first |
| SDK (Python) | `anthropic` | `openai` | `google-genai` | All have async support |
| OpenAI-compatible | No | N/A (is the standard) | No | Many platforms offer OpenAI-compatible endpoints |

---

## Key Trends (Feb 2026)

1. **Price compression continues.** Gemini 2.5 Flash at $0.15/$0.60 makes basic LLM calls nearly free
2. **Reasoning models maturing.** o3, o4-mini, Gemini thinking, DeepSeek R1 all production-ready
3. **MoE dominance.** Llama 4, DeepSeek V3, Qwen 3 all use mixture-of-experts for efficiency
4. **Context windows stabilizing.** 128K-200K standard, Google at 1M. Longer context reduces RAG need
5. **Prompt caching standard.** Anthropic (90% savings), OpenAI (50% auto), Google (context caching) all support it
6. **Agent APIs emerging.** OpenAI Responses API, Anthropic tool use improvements, Google agent features
7. **Image generation converging.** GPT-4o native image gen, Flux open source both strong options
8. **Multi-modal inputs standard.** Every frontier model accepts images. Video and audio support growing

---

*Last updated: February 2026. Pricing changes frequently. Always verify on provider sites.*
