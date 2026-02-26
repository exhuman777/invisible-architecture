# MCP Directory

> Last verified: February 2026. Model Context Protocol ecosystem guide.

---

## What MCP Does

Standard protocol for connecting AI assistants to external tools and data sources. Think USB-C for AI: one standard interface, any tool plugs in.

**Created by:** Anthropic (November 2024)
**Governance:** Transferred to Linux Foundation under AAIF (AI Alliance for Interoperability Foundation), early 2025
**Spec:** Open, versioned, community-driven
**Server count:** 17,000+ across registries (Feb 2026)

### Core Architecture

```
AI Client (Claude, Cursor, etc.)
    ↕ MCP Protocol (JSON-RPC 2.0)
MCP Server (tool/data provider)
    ↕
External System (DB, API, filesystem, etc.)
```

**Three primitives:**
| Primitive | Direction | What |
|-----------|-----------|------|
| Tools | Client → Server | Functions the AI can call (e.g., create_issue, query_db) |
| Resources | Client → Server | Data the AI can read (e.g., file contents, DB schemas) |
| Prompts | Server → Client | Pre-built prompt templates for common tasks |

---

## Registries

| Registry | URL | Count | Focus |
|----------|-----|-------|-------|
| mcp.so | [mcp.so](https://mcp.so) | 7,500+ | Largest community registry. Searchable, categorized |
| Glama | [glama.ai/mcp](https://glama.ai/mcp) | 1,000+ | Curated, reviewed. Quality focus |
| Smithery | [smithery.ai](https://smithery.ai) | 2,000+ | Hosted server option. Instant deploy |
| Official | [modelcontextprotocol.io](https://modelcontextprotocol.io) | ~30 | Reference servers. Spec documentation |
| OpenTools (Composio) | [composio.dev](https://composio.dev) | 10,000+ | Tool aggregator. Pre-built integrations |
| PulseMCP | [pulsemcp.com](https://pulsemcp.com) | Growing | Newsletter + directory |

---

## Official Reference Servers

Maintained by the MCP team. Stable, well-documented.

| Server | Package | What | Category |
|--------|---------|------|----------|
| filesystem | `@modelcontextprotocol/server-filesystem` | Read, write, search local files | Files |
| github | `@modelcontextprotocol/server-github` | Issues, PRs, repos, branches, code search | Dev Tools |
| postgres | `@modelcontextprotocol/server-postgres` | Query PostgreSQL databases | Database |
| sqlite | `@modelcontextprotocol/server-sqlite` | SQLite operations, schema inspection | Database |
| brave-search | `@modelcontextprotocol/server-brave-search` | Web search via Brave Search API | Search |
| puppeteer | `@modelcontextprotocol/server-puppeteer` | Browser automation, screenshots, scraping | Browser |
| memory | `@modelcontextprotocol/server-memory` | Persistent knowledge graph (entities + relations) | Knowledge |
| fetch | `@modelcontextprotocol/server-fetch` | HTTP requests, URL content extraction | Network |
| sequential-thinking | `@modelcontextprotocol/server-sequential-thinking` | Structured chain-of-thought reasoning | Reasoning |
| slack | `@modelcontextprotocol/server-slack` | Channels, messages, users | Communication |
| google-maps | `@modelcontextprotocol/server-google-maps` | Places, directions, geocoding | Location |
| everything | `@modelcontextprotocol/server-everything` | Test server with all MCP features | Testing |

---

## Popular Community Servers

| Server | Package / Repo | What | Stars/Usage |
|--------|---------------|------|-------------|
| context7 | `upstash/context7-mcp` | Library docs lookup. Up-to-date docs for any package | Very high |
| supabase | `supabase/mcp` | Official Supabase MCP. DB, auth, storage operations | High |
| google-drive | Community maintained | Google Drive file access | High |
| notion | Community maintained | Notion pages, databases | High |
| linear | Community maintained | Linear issues, projects | High |
| sentry | `getsentry/sentry-mcp` | Error tracking, issue lookup | High |
| browserbase | `browserbase/mcp-server-browserbase` | Cloud browser sessions | Medium |
| firecrawl | `mendableai/firecrawl-mcp` | Web scraping, crawling | Medium |
| neon | `neondatabase/mcp-server-neon` | Neon Postgres management | Medium |
| cloudflare | `cloudflare/mcp-server-cloudflare` | Workers, R2, D1, KV management | Medium |
| stripe | Community maintained | Payments, customers, subscriptions | Medium |
| docker | Community maintained | Container management | Medium |
| playwright | Community maintained | Browser testing automation | Medium |
| obsidian | Community maintained | Obsidian vault access | Medium |

---

## MCP Clients

| Client | Type | MCP Support | Notes |
|--------|------|-------------|-------|
| Claude Desktop | Desktop app | Full (stdio + SSE) | Native MCP support. Config in `claude_desktop_config.json` |
| Claude Code | CLI agent | Full (stdio) | Config in `.mcp.json` project file or global settings |
| Cursor | IDE | Full (stdio) | `.cursor/mcp.json` config. Popular for dev servers |
| Windsurf (Codeium) | IDE | Full | Growing MCP support |
| Continue | IDE extension | Full | Open source. VS Code + JetBrains |
| Zed | Editor | Full | Built-in MCP support |
| VS Code (Copilot) | IDE | Agent mode | MCP in Copilot agent mode |
| Cline | VS Code ext | Full | Autonomous coding agent with MCP |
| Sourcegraph Cody | AI assistant | Partial | Growing support |

### Client Configuration

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    }
  }
}
```

**Claude Code** (`.mcp.json` in project root):
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://..."]
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

---

## SDKs

| Language | Package | Install | Maturity |
|----------|---------|---------|----------|
| TypeScript | `@modelcontextprotocol/sdk` | `npm install @modelcontextprotocol/sdk` | Stable (official) |
| Python | `mcp` | `pip install mcp` | Stable (official) |
| Kotlin | `io.modelcontextprotocol:kotlin-sdk` | Maven/Gradle | Stable (official) |
| C# | `ModelContextProtocol` | NuGet | Stable |
| Java | `io.modelcontextprotocol:java-sdk` | Maven | Stable |
| Go | `github.com/mark3labs/mcp-go` | `go get` | Community, mature |
| Rust | `mcp-rust-sdk` | Cargo | Community |
| Swift | Community | Various | Early |

### TypeScript Server Example

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.tool("greet", { name: z.string() }, async ({ name }) => ({
  content: [{ type: "text", text: `Hello, ${name}!` }]
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Python Server Example

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()
def greet(name: str) -> str:
    """Greet someone."""
    return f"Hello, {name}!"

mcp.run()
```

---

## Transport Protocols

| Transport | When | How | Status |
|-----------|------|-----|--------|
| stdio | Local servers | Spawn process, communicate via stdin/stdout | Stable, primary |
| Streamable HTTP | Remote servers | HTTP POST + SSE responses | New standard (2025) |
| SSE (Server-Sent Events) | Remote servers (legacy) | HTTP + SSE stream | Legacy, being replaced by Streamable HTTP |

**stdio** works for local tools (filesystem, local DBs). Client spawns the server process.
**Streamable HTTP** works for remote/hosted servers. Replaces the older SSE transport. Supports stateless and stateful sessions.

---

## Building an MCP Server (Checklist)

1. Pick SDK (TypeScript or Python most mature)
2. Define tools with clear names, descriptions, and input schemas
3. Use Zod (TS) or type hints (Python) for input validation
4. Return structured content (text, images, embedded resources)
5. Handle errors gracefully (return error content, don't crash)
6. Test with MCP Inspector: `npx @modelcontextprotocol/inspector`
7. Publish to npm/PyPI + register on mcp.so or smithery.ai

### MCP Inspector

Debug and test servers locally:
```bash
npx @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-filesystem /tmp
```
Opens a web UI to explore tools, resources, and prompts.

---

## Common Patterns

### Multi-Server Setup
Run multiple servers simultaneously. Each handles a domain:
- `github` for code operations
- `postgres` for database queries
- `filesystem` for local file access
- `context7` for library documentation

### Auth Patterns
- **Local servers:** No auth needed (stdio, same machine)
- **Remote servers:** OAuth 2.0 flow supported in spec
- **API keys:** Passed via `env` in config

### Error Handling
- Servers should return errors as content, not throw
- Clients handle tool call failures gracefully
- Retry logic lives in the client

---

## Governance & Roadmap

| Date | Event |
|------|-------|
| Nov 2024 | Anthropic releases MCP spec + reference servers |
| Dec 2024 | Cursor, Continue, Zed add MCP support |
| Jan 2025 | Community growth: 1000+ servers on mcp.so |
| Mar 2025 | Streamable HTTP transport added to spec |
| Q2 2025 | Linux Foundation (AAIF) governance transfer |
| 2025-2026 | 17K+ servers. VS Code Copilot, Windsurf join ecosystem |

**Spec evolution:** Open process via GitHub (modelcontextprotocol/specification). Breaking changes follow semver. Community RFCs for major features.

---

## Quick Reference URLs

| Resource | URL |
|----------|-----|
| Official spec | [spec.modelcontextprotocol.io](https://spec.modelcontextprotocol.io) |
| Official docs | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| GitHub org | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |
| TypeScript SDK | [github.com/modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) |
| Python SDK | [github.com/modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) |
| MCP Inspector | `npx @modelcontextprotocol/inspector` |
| Community registry | [mcp.so](https://mcp.so) |
| Server list (awesome) | [github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) |

---

*Last updated: February 2026. MCP ecosystem evolves rapidly. Check registries for latest servers.*
