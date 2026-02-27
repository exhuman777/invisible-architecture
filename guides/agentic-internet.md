# The Agentic Internet

The internet is becoming programmable by AI agents. Not through scraping or browser automation hacks, but through protocols, registries, and standards designed for machine-to-machine interaction. This guide maps the real infrastructure of the agentic internet as of February 2026: what exists, what works, what to build on.

---

## 1. The Three Protocols

Three open protocols define how agents interact with the world and each other.

### MCP (Model Context Protocol)

**What it is:** An open protocol by Anthropic that connects AI models to external tools and data sources. Think of it as USB-C for AI. One standard interface, any tool.

**Why it matters:** Before MCP, every AI integration was custom. Now a single MCP server can work with Claude, Cursor, VS Code Copilot, Windsurf, and any MCP-compatible client.

**Key repos:**

| Repository | Stars | What |
|-----------|-------|------|
| [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | 79.5K | Official reference MCP servers |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | 81.7K | Community curated list |
| [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | 11.7K | Official TypeScript SDK |
| [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) | 21.9K | Official Python SDK |
| [modelcontextprotocol/registry](https://github.com/modelcontextprotocol/registry) | 6.5K | Official MCP Registry |

**Spec:** [modelcontextprotocol.io](https://modelcontextprotocol.io/) | [Spec repo](https://github.com/modelcontextprotocol/modelcontextprotocol) (7.3K stars)

### Agent Skills (SKILL.md)

**What it is:** An open standard by Anthropic (December 2025) for packaging reusable agent capabilities. A skill is a folder with a `SKILL.md` file containing YAML frontmatter and instructions. Adopted by OpenAI Codex, Microsoft Copilot, and others.

**Why it matters:** Skills are portable across platforms. Write once, use in Claude Code, Codex CLI, GitHub Copilot, and any tool that supports the standard.

**Key repos:**

| Repository | Stars | What |
|-----------|-------|------|
| [anthropics/skills](https://github.com/anthropics/skills) | 77.7K | Official skills repo + spec |
| [microsoft/skills](https://github.com/microsoft/skills) | 1.5K | Microsoft's skills, MCP servers, Agents.md |
| [agentskills/agentskills](https://github.com/agentskills/agentskills) | 11.2K | Community spec + docs |

**Spec:** [agentskills.io](https://agentskills.io/) (v1.0 expected H2 2026)

**Docs:** [Claude Code skills](https://code.claude.com/docs/en/skills) | [OpenAI Codex skills](https://developers.openai.com/codex/skills/) | [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

### A2A (Agent-to-Agent Protocol)

**What it is:** Google's open protocol for agent-to-agent communication. MCP connects agents to tools. A2A connects agents to each other. Now under the Linux Foundation.

**Why it matters:** Enables multi-vendor agent collaboration. Your Claude agent can delegate to a Gemini agent can call a LangChain agent. No shared memory or tools required.

**Key repos:**

| Repository | Stars | What |
|-----------|-------|------|
| [a2aproject/A2A](https://github.com/a2aproject/A2A) | 22.1K | Official A2A protocol |

**Spec:** [a2a-protocol.org](https://a2a-protocol.org/latest/) (v0.3, built on HTTP + SSE + JSON-RPC)

**Backed by:** Google, Atlassian, Salesforce, SAP, PayPal, LangChain, MongoDB, and 50+ partners.

---

## 2. MCP Registries and Marketplaces

Where to find, publish, and install MCP servers.

### Tier 1: Official + High-Traffic

| Platform | URL | What | Scale |
|----------|-----|------|-------|
| **Official MCP Registry** | [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io/) | The canonical registry. API freeze v0.1. | ~2,000 entries |
| **Smithery** | [smithery.ai](https://smithery.ai/) | Largest open marketplace. Local + hosted servers. CLI for install/invoke. | 100K+ tools |
| **Glama** | [glama.ai/mcp](https://glama.ai/mcp) | Discovery + hosted MCP gateway. They run the servers for you. | Thousands |
| **mcp.so** | [mcp.so](https://mcp.so/) | Community-driven directory. | 17,900+ servers |

### Tier 2: Specialized Directories

| Platform | URL | Focus |
|----------|-----|-------|
| **PulseMCP** | [pulsemcp.com/servers](https://www.pulsemcp.com/servers) | Daily-updated, 8,600+ entries |
| **MCPMarket** | [mcpmarket.com](https://mcpmarket.com/) | Agent skills + MCP servers directory |
| **mcpservers.org** | [mcpservers.org](https://mcpservers.org/) | Curated collection |
| **LobeHub** | [lobehub.com/mcp](https://lobehub.com/mcp) | 33,200+ servers, integrated with LobeChat |
| **Composio** | [composio.dev](https://composio.dev/) | 500+ managed MCP servers with auth handled |

### Tier 3: Curated Lists

| Repository | Stars | Focus |
|-----------|-------|-------|
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | 81.7K | The definitive community list |
| [agenticdevops/awesome-devops-mcp](https://github.com/agenticdevops/awesome-devops-mcp) | - | DevOps-focused MCP servers |
| [punkpeye/awesome-mcp-clients](https://github.com/punkpeye/awesome-mcp-clients) | - | MCP clients list |

---

## 3. Skills Marketplaces

Where to find and publish agent skills (SKILL.md format).

| Platform | URL | Scale |
|----------|-----|-------|
| **SkillsMP** | [skillsmp.com](https://skillsmp.com) | 270,000+ skills aggregated from GitHub |
| **Skills.sh** | [skills.sh](https://skills.sh/) | Skills discovery and install |
| **SkillHub** | [skillhub.club](https://www.skillhub.club/) | Claude skills marketplace |
| **MCPMarket Skills** | [mcpmarket.com/tools/skills](https://mcpmarket.com/tools/skills) | Agent skills directory |

All use the open SKILL.md standard. Compatible with Claude Code, OpenAI Codex CLI, GitHub Copilot, and VS Code.

---

## 4. Agent Frameworks and SDKs

The building blocks for creating agents that use MCP + Skills.

| Framework | Stars | Language | Best For |
|-----------|-------|----------|----------|
| [vercel/ai](https://github.com/vercel/ai) (AI SDK 6) | 22.1K | TypeScript | Full-stack AI apps, Next.js, agents |
| [openai/openai-agents-python](https://github.com/openai/openai-agents-python) | 19.2K | Python | OpenAI agent pipelines |
| [openai/codex](https://github.com/openai/codex) | 62.1K | TypeScript | Terminal coding agent, MCP server mode |
| [FastMCP](https://github.com/jlowin/fastmcp) | 21.9K | Python | Fastest way to build MCP servers |
| [LangChain](https://github.com/langchain-ai/langchain) | 127.6K | Python | Agent orchestration, tool chains |
| [punkpeye/fastmcp](https://github.com/punkpeye/fastmcp) | - | TypeScript | TypeScript MCP server framework |

### Platform Marketplaces

| Platform | What |
|----------|------|
| [Vercel Marketplace](https://vercel.com/marketplace) | AI agents + services with unified billing |
| [VS Code Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) | Skills for GitHub Copilot in VS Code |

---

## 5. How to Start: Build Your First Agentic App

Two real apps you can build in under an hour. Both create MCP servers that any MCP-compatible AI client can use.

### App 1: Bookmark Brain (MCP Server in Python)

An MCP server that lets AI agents search and manage your bookmarks. Save URLs with tags, search by keyword, get recommendations.

**Stack:** Python + FastMCP
**Time:** 30 minutes
**What you learn:** MCP tools, resources, how clients discover your server

```bash
# Setup
mkdir bookmark-brain && cd bookmark-brain
python3 -m venv .venv && source .venv/bin/activate
pip install fastmcp
```

```python
# server.py
from fastmcp import FastMCP
import json
from pathlib import Path

mcp = FastMCP("Bookmark Brain", instructions="A bookmark manager. Save, search, and organize URLs.")

DB = Path("bookmarks.json")
if not DB.exists():
    DB.write_text("[]")

def load():
    return json.loads(DB.read_text())

def save(data):
    DB.write_text(json.dumps(data, indent=2))

@mcp.tool()
def add_bookmark(url: str, title: str, tags: list[str] | None = None) -> str:
    """Save a bookmark with optional tags."""
    bookmarks = load()
    entry = {"url": url, "title": title, "tags": tags or [], "id": len(bookmarks) + 1}
    bookmarks.append(entry)
    save(bookmarks)
    return f"Saved: {title} ({url})"

@mcp.tool()
def search_bookmarks(query: str) -> list[dict]:
    """Search bookmarks by title, URL, or tag."""
    q = query.lower()
    return [b for b in load() if q in b["title"].lower() or q in b["url"].lower() or q in [t.lower() for t in b["tags"]]]

@mcp.tool()
def list_tags() -> dict[str, int]:
    """List all tags with counts."""
    tags: dict[str, int] = {}
    for b in load():
        for t in b["tags"]:
            tags[t] = tags.get(t, 0) + 1
    return dict(sorted(tags.items(), key=lambda x: -x[1]))

@mcp.resource("bookmarks://all")
def all_bookmarks() -> str:
    """All bookmarks as JSON."""
    return json.dumps(load(), indent=2)

if __name__ == "__main__":
    mcp.run()
```

```bash
# Test with MCP Inspector
fastmcp dev server.py

# Install in Claude Code
claude mcp add bookmark-brain -- python3 server.py
```

**What you built:** An MCP server with 3 tools and 1 resource. Any MCP client (Claude, Cursor, Windsurf) can now save and search your bookmarks through natural language.

---

### App 2: Project Tracker (MCP Server in TypeScript)

An MCP server that tracks your side projects. Add projects, update status, get a dashboard. Useful for vibecoders juggling multiple builds.

**Stack:** TypeScript + @modelcontextprotocol/sdk
**Time:** 45 minutes
**What you learn:** TypeScript MCP SDK, tool schemas, prompts

```bash
# Setup
mkdir project-tracker && cd project-tracker
npm init -y
npm install @modelcontextprotocol/sdk zod
npx tsc --init
```

```typescript
// server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync, existsSync } from "fs";

const DB = "projects.json";

interface Project {
  id: number;
  name: string;
  status: "idea" | "building" | "live" | "paused" | "dead";
  stack: string;
  url?: string;
  notes: string;
  updated: string;
}

function load(): Project[] {
  if (!existsSync(DB)) writeFileSync(DB, "[]");
  return JSON.parse(readFileSync(DB, "utf-8"));
}

function save(projects: Project[]) {
  writeFileSync(DB, JSON.stringify(projects, null, 2));
}

const server = new McpServer({
  name: "Project Tracker",
  version: "1.0.0",
});

server.tool(
  "add_project",
  "Add a new project to track",
  { name: z.string(), stack: z.string(), status: z.enum(["idea", "building", "live", "paused", "dead"]).default("idea"), notes: z.string().default("") },
  async ({ name, stack, status, notes }) => {
    const projects = load();
    const project: Project = {
      id: projects.length + 1,
      name, stack, status, notes,
      updated: new Date().toISOString().slice(0, 10),
    };
    projects.push(project);
    save(projects);
    return { content: [{ type: "text", text: `Added: ${name} (${status}) - ${stack}` }] };
  }
);

server.tool(
  "update_status",
  "Update a project's status",
  { id: z.number(), status: z.enum(["idea", "building", "live", "paused", "dead"]), notes: z.string().optional() },
  async ({ id, status, notes }) => {
    const projects = load();
    const p = projects.find(p => p.id === id);
    if (!p) return { content: [{ type: "text", text: "Project not found" }] };
    p.status = status;
    if (notes) p.notes = notes;
    p.updated = new Date().toISOString().slice(0, 10);
    save(projects);
    return { content: [{ type: "text", text: `Updated: ${p.name} -> ${status}` }] };
  }
);

server.tool(
  "dashboard",
  "Get project dashboard grouped by status",
  {},
  async () => {
    const projects = load();
    const grouped: Record<string, Project[]> = {};
    for (const p of projects) {
      (grouped[p.status] ??= []).push(p);
    }
    let out = "# Project Dashboard\n\n";
    for (const [status, list] of Object.entries(grouped)) {
      out += `## ${status.toUpperCase()} (${list.length})\n`;
      for (const p of list) {
        out += `- **${p.name}** [${p.stack}] ${p.url ? p.url : ""} ${p.notes ? "- " + p.notes : ""}\n`;
      }
      out += "\n";
    }
    return { content: [{ type: "text", text: out }] };
  }
);

server.prompt(
  "weekly_review",
  "Generate a weekly project review prompt",
  {},
  async () => {
    const projects = load();
    const active = projects.filter(p => p.status === "building");
    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Review my ${active.length} active projects:\n${active.map(p => `- ${p.name} (${p.stack}): ${p.notes}`).join("\n")}\n\nFor each: what should I focus on this week? What should I cut?`,
        },
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
```

```bash
# Build and test
npx tsc
npx @modelcontextprotocol/inspector node server.js

# Install in Claude Code
claude mcp add project-tracker -- node server.js
```

**What you built:** An MCP server with 3 tools and 1 prompt. Ask Claude "add my new project called Nightwatch, it's a Next.js monitoring dashboard" and it calls `add_project` automatically. Ask "show me my dashboard" and it calls `dashboard`.

---

## 6. The Pattern

Both apps follow the same pattern:

```
1. Pick a personal problem (bookmarks, project tracking, notes, etc.)
2. Wrap it in an MCP server (tools for actions, resources for data)
3. Test with MCP Inspector
4. Install in your AI client of choice
5. Optionally: publish to the MCP Registry or Smithery
```

**To publish your MCP server:**
- [MCP Registry submission](https://registry.modelcontextprotocol.io/) (official, use the GitHub submission flow)
- [Smithery publishing](https://smithery.ai/docs) (largest marketplace, supports hosted servers)
- Add to [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) via PR

**To publish as a skill:**
- Create a `.github/skills/your-skill/SKILL.md` in your repo
- Follow the [Agent Skills spec](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
- Submit to [SkillsMP](https://skillsmp.com) (auto-discovers from GitHub)

---

## 7. What's Coming

**MCP Registry v1** (2026): General availability of the official registry API. Subregistries for domain-specific curation.

**Agent Skills v1.0** (H2 2026): Finalized spec with standardized discovery, versioning, and execution semantics across all platforms.

**A2A v1.0**: Enterprise-grade agent-to-agent communication with full auth parity to OpenAPI.

**Agent Marketplaces**: Vercel already has AI agents in their marketplace. Expect GitHub, Cloudflare, and every major platform to follow. The pattern: discover, install, bill through the platform.

**The convergence:** MCP gives agents tools. Skills give agents capabilities. A2A lets agents talk to each other. Together they form the protocol stack of the agentic internet. The same way HTTP + DNS + TLS created the web, MCP + Skills + A2A are creating the agent web.

---

*Sources verified February 2026. All GitHub star counts confirmed via API. All URLs tested.*
