# Paid Micro-Services on Zo

A blueprint for building and selling 3-5 small, focused services on Zo. Each solves one problem, charges $1-5 per use via Stripe, and runs on your personal server. No infrastructure to manage. No platform fees from Zo.

---

## The Model

```
One problem + One API + Stripe payment link = Revenue

User pays via Stripe > Gets a session token > Calls your API > Gets the result
```

Every service follows this pattern:
1. **Landing page** on your Space (React, Tailwind)
2. **Payment link** via Zo's Stripe integration ($1-5 per use)
3. **API endpoint** that does the work (Hono + Bun)
4. **AI analysis** via BYOK or Zo's built-in models

Stripe tools: [Create payment link](https://docs.zocomputer.com/tools/create-stripe-payment-link) | [List orders](https://docs.zocomputer.com/tools/list-stripe-orders) | [Update product](https://docs.zocomputer.com/tools/update-stripe-product)

---

## Service 1: Vibe Check ($2 per analysis)

**Already built.** Website analysis for founders.

**What it does:** User drops a URL. Service scrapes the page, runs Brave Search for competitors and reviews, feeds everything to Llama 3.3 70B on Groq. Returns scores across 6 business dimensions, a roast, and 3 prioritized fixes.

**Stack:** FastAPI (Python) + Groq + Brave Search API
**Payment:** $2 per check via Stripe
**Live at:** o.zo.space/vibe-check

**Revenue math:** 50 checks/day = $100/day = $3,000/month. Groq inference cost per check: ~$0.002. Brave API: ~$0.004/check. Margin: 99.7%.

---

## Service 2: Market Oracle ($1 per analysis)

**Prediction market analyzer with Monte Carlo modeling.**

**What it does:** User submits a Polymarket market URL or question. Service pulls current odds, news, order book depth. Runs Monte Carlo simulation (10,000 iterations) with Kelly criterion sizing. Returns: AI confidence score, contrarian case, edge assessment, optimal position size, timeline analysis.

**Stack:** Hono API + Groq (Llama 3.3 70B) + Polymarket API + Monte Carlo engine
**Payment:** $1 per analysis via Stripe, or x402 for agent-to-agent payment

**API pattern:**
```typescript
// Route: /api/market-oracle (api, public)
app.post("/api/market-oracle", async (c) => {
  const { marketUrl, sessionId } = await c.req.json();

  // Verify Stripe payment
  const paid = await verifyPayment(sessionId);
  if (!paid) return c.json({ error: "Payment required" }, 402);

  // Fetch market data from Polymarket
  const market = await fetchMarketData(marketUrl);

  // Run Monte Carlo simulation
  const simulation = monteCarlo(market, 10000);

  // AI analysis via Groq
  const analysis = await analyzeWithAI(market, simulation);

  return c.json({
    market: market.question,
    currentOdds: market.probability,
    aiConfidence: analysis.confidence,
    edge: analysis.edge,
    kellySize: simulation.kellyCriterion,
    monteCarlo: simulation.distribution,
    contrarian: analysis.contrarianCase,
    timeline: analysis.timeline,
  });
});
```

**x402 pattern for agent payments:**
Agents can pay per-request using the x402 protocol. The API returns a 402 status with payment instructions. The agent's wallet handles the micropayment automatically.

---

## Service 3: Copy Doctor ($2 per review)

**Landing page copy analysis.**

**What it does:** User pastes their landing page headline + subheadline + CTA. Service analyzes clarity, emotional impact, conversion potential. Returns a rewrite suggestion, A/B test variants, and a "would you click?" score.

**Stack:** Hono API + Anthropic Claude Haiku (via BYOK) + web scraping
**Payment:** $2 per review via Stripe

**Why it works:** Every solopreneur struggles with copy. This is faster and cheaper than hiring a copywriter for a quick gut check. Claude Haiku keeps inference costs under $0.001 per review.

---

## Service 4: Stack Picker ($1 per recommendation)

**Personalized stack recommendation based on project type.**

**What it does:** User answers 5 questions: What are you building? Solo or team? Budget? Technical level? Timeline? Service returns a complete stack recommendation with specific tools, estimated costs, deploy commands, and a starter template.

**Stack:** Hono API + Groq + curated stack database (from Invisible Architecture knowledge base)
**Payment:** $1 per recommendation via Stripe

**Data source:** The stack blueprints from this knowledge base (solo-saas.md, ai-app.md, static-site.md, api-service.md) serve as the ground truth. AI personalizes based on answers.

---

## Service 5: Domain Namer ($1 per batch)

**AI-powered domain name generator with instant availability check.**

**What it does:** User describes their project in one sentence. Service generates 20 domain name suggestions across .com, .io, .dev, .app. Checks availability via WHOIS. Returns only available names, ranked by memorability and brandability.

**Stack:** Hono API + Groq + WHOIS lookup
**Payment:** $1 per batch via Stripe

---

## The Economics

All 5 services on a single Zo Basic plan ($18/month):

| Service | Price | Daily Volume | Monthly Revenue | Cost/Use |
|---------|-------|-------------|----------------|----------|
| Vibe Check | $2 | 30 | $1,800 | $0.006 |
| Market Oracle | $1 | 50 | $1,500 | $0.003 |
| Copy Doctor | $2 | 20 | $1,200 | $0.001 |
| Stack Picker | $1 | 40 | $1,200 | $0.002 |
| Domain Namer | $1 | 60 | $1,800 | $0.001 |

**Conservative total:** $7,500/month revenue on $18/month hosting.

Stripe takes 2.9% + $0.30 per transaction. On a $1 sale, that's $0.33 (33%). On a $2 sale, that's $0.36 (18%). AI inference costs are negligible with Groq or BYOK.

The margin improves with higher prices. $5 per Vibe Check instead of $2 drops Stripe's effective cut to 9%.

---

## Implementation on Zo

### Setting up Stripe

```
Tell Zo: "Connect my Stripe account"
→ Zo walks you through Stripe Connect onboarding
→ 0% Zo platform fee

Tell Zo: "Create a product called 'Market Oracle' for $1"
→ Zo creates the product and payment link
→ Payment link ready to embed
```

### Building the API

```
Tell Zo: "Create an API at /api/market-oracle that..."
→ Zo writes the Hono endpoint
→ Deploys to your Space
→ Live at yourhandle.zo.space/api/market-oracle
```

### Adding the landing page

```
Tell Zo: "Create a page at /market-oracle with..."
→ Zo builds React + Tailwind page
→ Embeds the Stripe payment link
→ Connects to the API
```

### Monitoring

```
Tell Zo: "Show me today's orders"
→ Zo queries Stripe via built-in tools
→ Returns order list with revenue totals

Set up a Zo Agent: "Every morning at 8am, email me yesterday's revenue summary"
→ Agent runs daily, queries Stripe, sends email
```

---

## x402: Agent-to-Agent Payments

x402 is an emerging protocol for AI agents to pay for API access using HTTP 402 status codes. When an agent hits your API without payment, your service returns a 402 with payment instructions. The agent's wallet handles the micropayment. No Stripe checkout page needed.

This enables machine customers. An agent analyzing 1,000 markets per day can auto-pay $0.10 per analysis. $100/day in pure API revenue with zero human interaction.

x402 is early but the pattern works today for agents with crypto wallets. Stripe remains the primary path for human customers.

---

*All Zo doc links verified February 2026. Pricing from [docs.zocomputer.com/billing](https://docs.zocomputer.com/billing).*
