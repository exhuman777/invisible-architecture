# The MCP Ecosystem

Model Context Protocol explained for vibecoders. What MCP does, why you need it, how to set it up.

---

## 1. What MCP Is

Model Context Protocol (MCP) gives AI assistants a standard way to connect to external tools and data sources. Think USB-C for AI: one protocol, any tool.

Anthropic created MCP in late 2024, then transferred governance to the Linux Foundation under AAIF (AI Alliance for Interoperability Foundation). The protocol defines how AI clients (Claude Code, Cursor, etc.) talk to servers that expose tools, resources, and prompts.

Before MCP, every AI tool built custom integrations. Claude had its own tool format. ChatGPT had plugins (RIP). Cursor had its own system. MCP standardizes this so one server works with every compatible client.

**The simple version:** MCP lets your AI assistant read your database, manage your GitHub repos, search the web, and interact with any API, all through a single protocol.

---

## 2. Why It Matters for Vibecoding

Without MCP, your AI conversation looks like:
1. You ask AI to fix a bug
2. AI asks you to paste the file
3. You paste it
4. AI asks for related files
5. You paste those too
6. AI suggests a fix
7. You manually apply it

With MCP:
1. You ask AI to fix a bug
2. AI reads the files directly, checks the database schema, looks at recent git history, generates and applies the fix

The difference: AI becomes an active participant in your development environment instead of a text-in-text-out chatbot. AI can *do things* in your project, not just suggest things.

**Real workflow examples:**
- "Check what's in the users table and create a migration to add an email_verified column" (AI reads DB schema, writes migration)
- "Look at the open issues on GitHub and fix the one about the login bug" (AI reads issues, reads code, writes fix)
- "Search for how Stripe handles webhooks in Next.js and implement it" (AI searches web, reads docs, writes code)

---

## 3. How It Works

Three components:

### Client
The AI tool you use. Claude Code, Cursor, Windsurf, or any MCP-compatible application. The client sends requests to servers and uses the tools they expose.

### Server
A program that exposes capabilities to the client. A filesystem server lets AI read/write files. A GitHub server lets AI manage repos. A Postgres server lets AI query databases.

Servers expose three primitives:
- **Tools:** Functions the AI can call (read_file, query_database, create_issue)
- **Resources:** Data the AI can access (file contents, database schemas)
- **Prompts:** Pre-built prompt templates for common tasks

### Transport
How client and server communicate:
- **stdio:** For local servers. Client spawns the server process, communicates via stdin/stdout. Most common for development tools.
- **Streamable HTTP (SSE):** For remote servers. Client connects over HTTP with server-sent events. Used for hosted/shared servers.

The flow:
```
You → Client (Claude Code) → Transport (stdio) → Server (postgres) → Your Database
```

Client discovers available tools from the server at startup. When AI decides to use a tool, the client calls the server, gets the result, and feeds it back to the model.

---

## 4. Setting Up MCP Servers

### Claude Code

**Project-level** (recommended): create `.mcp.json` in your project root.
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

**Global**: create `~/.claude/mcp.json` with the same format. These servers load for every project.

**Quick add via CLI:**
```bash
claude mcp add github npx -y @modelcontextprotocol/server-github
claude mcp add postgres npx -y @modelcontextprotocol/server-postgres "postgresql://localhost/mydb"
```

### Cursor

Create `.cursor/mcp.json` in your project:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

Same format as Claude Code. Most servers work with both.

### Environment Variables

Servers often need API keys. Pass them via `env`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Security note:** Don't commit tokens to git. Use environment variable references or keep MCP config in gitignored files for secrets.

---

## 5. Essential Servers for Vibecoders

### filesystem
Read and write files in your project. The most basic and most useful server.

```json
"filesystem": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
}
```

**When to use:** Always. Lets AI navigate and modify your codebase directly.

### github
Manage repos, issues, PRs, and code search without leaving your AI conversation.

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_TOKEN": "ghp_..." }
}
```

**When to use:** Any GitHub-based workflow. "Create an issue for this bug," "Review the latest PR," "Search for how we handle auth."

### postgres / sqlite
Query your database directly from AI context. AI can inspect schemas, run queries, understand your data model.

```json
"postgres": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost:5432/mydb"]
}
```

**When to use:** When AI needs to understand your data model, write migrations, debug data issues.

### brave-search
Web search from your AI assistant. AI can look up docs, find solutions, research libraries.

```json
"brave-search": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-brave-search"],
  "env": { "BRAVE_API_KEY": "..." }
}
```

**When to use:** Looking up library docs, finding solutions, researching unfamiliar APIs.

### context7
Fetches up-to-date library documentation on demand. AI pulls official docs instead of relying on training data that may be outdated.

```json
"context7": {
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```

**When to use:** Working with libraries that update frequently. Prevents AI from using outdated API patterns.

### memory
Persistent knowledge graph across sessions. AI remembers context between conversations.

```json
"memory": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-memory"]
}
```

**When to use:** Long-running projects where you want AI to remember decisions, preferences, and project state.

### fetch
Make HTTP requests from AI context. Hit APIs, check endpoints, download data.

```json
"fetch": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-fetch"]
}
```

**When to use:** Testing APIs, fetching remote configs, verifying endpoints work.

---

## 6. Building Custom MCP Servers

When existing servers don't cover your use case, build your own. The TypeScript SDK makes this straightforward.

```bash
npm install @modelcontextprotocol/sdk
```

Minimal server:
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0"
});

server.tool("greet", { name: "string" }, async ({ name }) => ({
  content: [{ type: "text", text: `Hello, ${name}!` }]
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

SDKs exist for TypeScript, Python, Java, Kotlin, C#, Go, Rust, Swift, and more. Pick whatever fits your stack.

**Common reasons to build custom servers:**
- Internal API access (your company's services)
- Custom database queries (domain-specific operations)
- Workflow automation (deploy, monitor, alert)
- Data pipelines (transform, validate, load)

Full docs: https://modelcontextprotocol.io/docs

---

## 7. The Ecosystem

The MCP ecosystem has exploded since launch. As of early 2026:

**17,000+ servers** published across various registries.

### Registries
- **mcp.so** - Community directory, browsable by category
- **glama.ai/mcp** - Curated directory with quality ratings
- **smithery.ai** - Registry with one-click install
- **GitHub** - Search `topic:mcp-server` for open source servers

### Official Servers
Anthropic and community maintainers provide reference implementations:
- filesystem, github, postgres, sqlite, brave-search, fetch, memory, puppeteer, slack, google-drive, and more
- All at: https://github.com/modelcontextprotocol/servers

### Finding Servers
1. Check if an official server exists first (most reliable)
2. Search registries for community servers
3. Build custom if nothing fits

### Quality Considerations
Not all community servers are equal. Before using one:
- Check the GitHub repo for recent activity
- Read the source code (these servers access your data)
- Verify permissions scope (does a "file reader" also write?)
- Prefer servers with TypeScript/Python SDK over custom implementations

See `reference/mcp-directory.md` for a curated list of recommended servers by category.

---

## Quick Setup Checklist

```
1. Create .mcp.json in your project root
2. Add filesystem server (baseline)
3. Add github server if using GitHub
4. Add database server if your project has a DB
5. Add brave-search or context7 for doc lookup
6. Test: ask your AI to "list available MCP tools"
7. Verify servers connect on startup
```

MCP turns your AI assistant from a text generator into a development partner that can actually interact with your tools, data, and infrastructure. The setup takes 5 minutes and changes how you work.
