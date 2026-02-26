# Agent Frameworks

> Last verified: February 2026. Comparison of major agent/AI frameworks for building LLM-powered applications and autonomous agents.

---

## Framework Overview

| Framework | Language | Install | URL | Maturity |
|-----------|----------|---------|-----|----------|
| Vercel AI SDK 6.0 | TypeScript | `npm install ai` | [sdk.vercel.ai](https://sdk.vercel.ai) | Production |
| LangChain / LangGraph | Python, JS | `pip install langchain langgraph` | [langchain.com](https://langchain.com) | Production |
| CrewAI | Python | `pip install crewai` | [crewai.com](https://crewai.com) | Production |
| Claude Agent SDK | Python | `pip install claude-agent-sdk` | [github.com/anthropics/claude-agent-sdk](https://github.com/anthropics/claude-agent-sdk) | Production |
| Microsoft Agent Framework | Python, C# | `pip install autogen-agentchat` | [github.com/microsoft/autogen](https://github.com/microsoft/autogen) | Production |
| Mastra | TypeScript | `npm install mastra` | [mastra.ai](https://mastra.ai) | Growing |
| Smolagents | Python | `pip install smolagents` | [github.com/huggingface/smolagents](https://github.com/huggingface/smolagents) | Growing |
| Pydantic AI | Python | `pip install pydantic-ai` | [ai.pydantic.dev](https://ai.pydantic.dev) | Growing |

---

## Detailed Breakdown

### Vercel AI SDK 6.0

**URL:** [sdk.vercel.ai](https://sdk.vercel.ai)
**Install:** `npm install ai @ai-sdk/anthropic @ai-sdk/openai`
**Language:** TypeScript
**License:** Apache 2.0

| Feature | Details |
|---------|---------|
| Core abstraction | Unified API across all providers (Anthropic, OpenAI, Google, etc.) |
| Streaming | First-class. `streamText()`, `streamObject()` with React hooks |
| Tool calling | `tool()` with Zod schemas. Multi-step tool loops |
| Structured output | `generateObject()` with Zod. Validated JSON from any model |
| UI integration | React hooks: `useChat()`, `useCompletion()`, `useAssistant()` |
| Agent support | `agent()` function in v6. Autonomous tool-use loops |
| MCP support | Built-in MCP client |
| Provider count | 20+ providers via `@ai-sdk/*` packages |

**Key differentiator:** Best framework for Next.js/React apps. Unified provider interface means switching models requires changing one import. Streaming + UI hooks solve the hard parts of building chat interfaces.

**v6 additions:** Agent loop primitive, MCP integration, improved multi-step tool calling.

```typescript
import { generateText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const result = await generateText({
  model: anthropic("claude-sonnet-4-6-20250214"),
  tools: {
    weather: tool({
      description: "Get weather for a city",
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => `72°F in ${city}`,
    }),
  },
  maxSteps: 5,
  prompt: "What's the weather in Tokyo?",
});
```

---

### LangChain / LangGraph

**URL:** [langchain.com](https://langchain.com) / [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)
**Install:** `pip install langchain langgraph langchain-anthropic`
**Language:** Python (primary), JavaScript
**License:** MIT

| Feature | Details |
|---------|---------|
| Core abstraction | Chain composition. Runnable interface for all components |
| LangGraph | Graph-based agent orchestration. State machines for agents |
| RAG | Best-in-class RAG tooling. Document loaders, splitters, retrievers |
| Integrations | 700+ integrations (LLMs, vector stores, tools, APIs) |
| LangSmith | Observability platform. Tracing, evaluation, monitoring |
| LangGraph Platform | Managed deployment for LangGraph agents |
| Memory | Multiple memory types. Conversation, entity, summary |

**Key differentiator:** Most mature ecosystem. Largest community. Best for complex pipelines involving RAG, multi-step reasoning, and diverse tool integration. LangGraph adds proper state management for agent workflows.

**When to use:** Complex RAG pipelines, multi-agent workflows, need lots of integrations.
**When to avoid:** Simple tasks (too much abstraction overhead).

```python
from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic

model = ChatAnthropic(model="claude-sonnet-4-6-20250214")
agent = create_react_agent(model, tools=[...])
result = agent.invoke({"messages": [("human", "Analyze this data")]})
```

---

### CrewAI

**URL:** [crewai.com](https://crewai.com)
**Install:** `pip install crewai`
**Language:** Python
**License:** MIT

| Feature | Details |
|---------|---------|
| Core abstraction | Crews of agents with roles, goals, backstories |
| Agent definition | Role-based: researcher, writer, analyst, etc. |
| Task system | Sequential or parallel task execution |
| Delegation | Agents can delegate to other agents |
| Tools | Built-in tools + custom tools. LangChain tool compatible |
| Memory | Short-term, long-term, entity memory |
| CrewAI+ | Enterprise platform with monitoring, deployment |

**Key differentiator:** Simplest multi-agent framework. Define agents with personas, give them tasks, let them collaborate. Lower learning curve than LangGraph for multi-agent scenarios.

```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Researcher",
    goal="Find accurate information",
    llm="claude-sonnet-4-6-20250214"
)
task = Task(description="Research quantum computing trends", agent=researcher)
crew = Crew(agents=[researcher], tasks=[task])
result = crew.kickoff()
```

---

### Claude Agent SDK

**URL:** [github.com/anthropics/claude-agent-sdk](https://github.com/anthropics/claude-agent-sdk)
**Install:** `pip install claude-agent-sdk`
**Language:** Python
**License:** MIT

| Feature | Details |
|---------|---------|
| Core abstraction | Agent with tools, guardrails, handoffs |
| Guardrails | Input/output validation. Content filtering |
| Handoffs | Agent-to-agent delegation with context transfer |
| Tracing | Built-in observability. Trace every step |
| Tool use | Native Claude tool calling integration |
| Model | Anthropic models only (optimized) |

**Key differentiator:** Anthropic's official framework. Tightly integrated with Claude's tool use, extended thinking, and safety features. Guardrails and handoffs designed for production agent deployment.

```python
from claude_agent_sdk import Agent, tool

@tool
def search_docs(query: str) -> str:
    """Search documentation."""
    return "relevant docs..."

agent = Agent(
    model="claude-sonnet-4-6-20250214",
    tools=[search_docs],
    instructions="Help users find documentation."
)
response = agent.run("How do I set up auth?")
```

---

### Microsoft Agent Framework (AutoGen)

**URL:** [github.com/microsoft/autogen](https://github.com/microsoft/autogen)
**Install:** `pip install autogen-agentchat autogen-ext`
**Language:** Python (primary), C#
**License:** MIT (Creative Commons for docs)

| Feature | Details |
|---------|---------|
| Core abstraction | Multi-agent conversations with defined protocols |
| Agent types | AssistantAgent, UserProxy, GroupChat |
| Code execution | Built-in sandboxed code execution |
| Human-in-loop | Native support for human approval steps |
| Azure integration | Deep Azure AI Services integration |
| AG2 fork | Community fork (ag2.ai) exists, maintains compatibility |

**Key differentiator:** Enterprise-grade multi-agent framework. Strong Azure/Microsoft ecosystem integration. Code execution sandbox makes safe for autonomous coding tasks.

---

### Mastra

**URL:** [mastra.ai](https://mastra.ai)
**Install:** `npm install mastra`
**Language:** TypeScript
**License:** Elastic License 2.0

| Feature | Details |
|---------|---------|
| Core abstraction | Agents with workflows, tools, RAG |
| Workflows | Durable, step-based execution (like Inngest/Temporal) |
| RAG | Built-in vector search, document processing |
| Integrations | Pre-built integrations for common APIs |
| Evals | Built-in evaluation framework |
| MCP | MCP client support |
| Syncs | Data synchronization from external sources |

**Key differentiator:** TypeScript-native agent framework that bundles workflows, RAG, and integrations. Fills the gap between AI SDK (too low-level for agents) and LangChain (Python-first). Good for TS teams wanting an all-in-one solution.

```typescript
import { Mastra } from "mastra";

const mastra = new Mastra({
  agents: {
    assistant: {
      model: anthropic("claude-sonnet-4-6-20250214"),
      instructions: "You help with code review.",
      tools: { /* ... */ },
    },
  },
});

const agent = mastra.getAgent("assistant");
const result = await agent.generate("Review this PR");
```

---

### Smolagents (HuggingFace)

**URL:** [github.com/huggingface/smolagents](https://github.com/huggingface/smolagents)
**Install:** `pip install smolagents`
**Language:** Python
**License:** Apache 2.0

| Feature | Details |
|---------|---------|
| Core abstraction | Code-based agents (write Python, not JSON tool calls) |
| Code agents | LLM writes Python code to use tools directly |
| Tool hub | Share tools via HuggingFace Hub |
| Multi-agent | Manager agent delegates to worker agents |
| Model agnostic | Any LLM (HF Inference, OpenAI, Anthropic, local) |
| MCP | MCP tool integration |

**Key differentiator:** Lightweight, code-first approach. Instead of JSON tool calling, the LLM writes Python code that directly calls tool functions. Simpler mental model, fewer abstractions.

---

### Pydantic AI

**URL:** [ai.pydantic.dev](https://ai.pydantic.dev)
**Install:** `pip install pydantic-ai`
**Language:** Python
**License:** MIT

| Feature | Details |
|---------|---------|
| Core abstraction | Type-safe agents with Pydantic models |
| Structured output | Native Pydantic model validation |
| Dependency injection | System for providing runtime context to tools |
| Multi-model | OpenAI, Anthropic, Google, Groq, Ollama |
| Testing | Built-in test utilities, mock models |
| Logfire integration | Observability via Pydantic Logfire |

**Key differentiator:** Type safety first. If you already use Pydantic heavily, fits naturally. Dependency injection pattern makes testing easy. Clean, Pythonic API without heavy abstractions.

```python
from pydantic_ai import Agent
from pydantic import BaseModel

class CityInfo(BaseModel):
    name: str
    population: int
    country: str

agent = Agent("anthropic:claude-sonnet-4-6-20250214", result_type=CityInfo)
result = agent.run_sync("Tell me about Tokyo")
print(result.data)  # CityInfo(name='Tokyo', population=13960000, country='Japan')
```

---

## Comparison Matrix

| Feature | AI SDK 6.0 | LangChain | CrewAI | Claude Agent SDK | Mastra | Pydantic AI |
|---------|-----------|-----------|--------|-----------------|--------|-------------|
| Language | TS | Py/JS | Py | Py | TS | Py |
| Streaming | Native | Yes | Limited | Yes | Yes | Yes |
| Multi-agent | Basic | LangGraph | Core | Handoffs | Workflows | No |
| RAG built-in | No | Yes | Via tools | No | Yes | No |
| MCP support | Yes | Partial | No | No | Yes | No |
| Structured output | Zod | Pydantic | Limited | Limited | Zod | Pydantic |
| UI components | React hooks | No | No | No | No | No |
| Observability | Vercel AI | LangSmith | CrewAI+ | Built-in tracing | Evals | Logfire |
| Learning curve | Low | High | Low | Low | Medium | Low |
| Community size | Large | Largest | Medium | Growing | Small | Medium |

---

## Quick Picks

| Scenario | Framework | Why |
|----------|-----------|-----|
| Next.js chat app | Vercel AI SDK | React hooks, streaming, provider abstraction |
| Complex RAG pipeline | LangChain + LangGraph | Most integrations, best RAG tooling |
| Multi-agent team | CrewAI | Simplest multi-agent API |
| Production Claude agents | Claude Agent SDK | Guardrails, handoffs, native integration |
| TypeScript agent backend | Mastra | All-in-one: agents + workflows + RAG |
| Type-safe Python agents | Pydantic AI | Clean API, great testing |
| Quick prototype | Smolagents | Minimal code, code-first agents |
| Enterprise / Azure | Microsoft Agent Framework | Azure integration, compliance |

---

## Observability & Evaluation

Frameworks often pair with observability tools:

| Tool | URL | What | Works With |
|------|-----|------|------------|
| LangSmith | [smith.langchain.com](https://smith.langchain.com) | Tracing, evals, datasets | LangChain, LangGraph, any LLM |
| Braintrust | [braintrust.dev](https://braintrust.dev) | Evals, logging, playground | Any framework |
| Helicone | [helicone.ai](https://helicone.ai) | LLM proxy with logging | Any (proxy-based) |
| Pydantic Logfire | [logfire.pydantic.dev](https://logfire.pydantic.dev) | Observability for Python | Pydantic AI, any Python |
| Arize Phoenix | [phoenix.arize.com](https://phoenix.arize.com) | Tracing, evals (OSS) | Any framework |
| Weights & Biases Weave | [wandb.ai/weave](https://wandb.ai/site/weave) | Tracing, evals | Any framework |

---

## Key Trends (Feb 2026)

1. **Convergence on tool calling.** Every framework wraps the same LLM tool-use APIs. Differentiation moves to orchestration, memory, evaluation
2. **MCP adoption.** Frameworks adding MCP client support. Standardizes tool integration
3. **TypeScript gaining.** AI SDK, Mastra proving TS viable for agent development, not just Python
4. **Evaluation matters more.** Braintrust, LangSmith, Arize becoming essential. You can't ship agents without evals
5. **Multi-agent cooling off.** Initial hype settling. Single agent + good tools often beats multi-agent complexity
6. **Durable execution.** Inngest, Temporal patterns entering agent frameworks for reliable long-running tasks

---

*Last updated: February 2026. Framework landscape evolves fast. Check docs for latest features.*
