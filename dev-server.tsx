import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();
const PORT = 3000;

// ─── Local paths ─────────────────────────────────────────────────────────────
const PROJECT_DIR = import.meta.dir;
const CONTENT_DIR = PROJECT_DIR; // markdown files are right here (guides/, reference/, etc.)

// ─── API: Article reader ─────────────────────────────────────────────────────
const ALLOWED_DIRS = /^(guides|reference|patterns|stacks)\/[a-z0-9-]+\.md$/;

app.get("/api/invisible-architecture", async (c) => {
  const file = c.req.query("file");
  if (!file || !ALLOWED_DIRS.test(file)) {
    return c.json({ error: "Invalid file path" }, 400);
  }
  const filePath = `${CONTENT_DIR}/${file}`;
  try {
    const f = Bun.file(filePath);
    if (!(await f.exists())) {
      return c.json({ error: "File not found" }, 404);
    }
    const content = await f.text();
    return c.json({ file, content });
  } catch {
    return c.json({ error: "Failed to read file" }, 500);
  }
});

// ─── API: Registry ───────────────────────────────────────────────────────────
const DB_PATH = `${PROJECT_DIR}/registry.json`;

interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  github: string;
  category: string;
  tags: string[];
  author: string;
  url?: string;
  status: string;
  submittedAt: string;
}

async function readDB(): Promise<RegistryEntry[]> {
  try {
    const file = Bun.file(DB_PATH);
    if (await file.exists()) return await file.json();
  } catch {}
  return [];
}

async function writeDB(entries: RegistryEntry[]) {
  await Bun.write(DB_PATH, JSON.stringify(entries, null, 2));
}

const GITHUB_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
const CATEGORIES = ["mcp-server", "skill", "agent", "framework", "tool"];

function sanitize(str: string, max: number): string {
  return str.trim().slice(0, max).replace(/[<>]/g, "");
}

app.get("/api/agentic-registry", async (c) => {
  const entries = await readDB();
  const category = c.req.query("category");
  const status = c.req.query("status") || "approved";
  let filtered = entries.filter((e) => e.status === status || status === "all");
  if (category && CATEGORIES.includes(category)) {
    filtered = filtered.filter((e) => e.category === category);
  }
  return c.json(filtered);
});

app.post("/api/agentic-registry", async (c) => {
  const body = (await c.req.json()) as Partial<RegistryEntry>;
  if (!body.name || !body.description || !body.github || !body.category || !body.author) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  if (!GITHUB_RE.test(body.github)) {
    return c.json({ error: "Invalid GitHub URL" }, 400);
  }
  if (!CATEGORIES.includes(body.category)) {
    return c.json({ error: "Invalid category" }, 400);
  }
  const tags = (body.tags || []).slice(0, 5).map((t) => sanitize(String(t), 30)).filter((t) => t.length > 0);
  const entries = await readDB();
  if (entries.some((e) => e.github.toLowerCase() === body.github!.toLowerCase())) {
    return c.json({ error: "Already submitted" }, 409);
  }
  const entry: RegistryEntry = {
    id: crypto.randomUUID(),
    name: sanitize(body.name, 80),
    description: sanitize(body.description, 500),
    github: body.github.trim(),
    category: body.category,
    tags,
    author: sanitize(body.author, 60),
    url: body.url?.trim().slice(0, 200) || undefined,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  entries.push(entry);
  await writeDB(entries);
  return c.json({ ok: true, entry });
});

// ─── API: Routes (project list) ─────────────────────────────────────────────
app.get("/api/routes", (c) => {
  return c.json([
    {
      path: "/vibe-check",
      title: "Vibe Check",
      description: "Website analysis for founders who want the truth.",
      tech: "FastAPI + Groq + Brave Search",
      cta: "Try It",
      url: "https://o.zo.space/vibe-check",
    },
    {
      path: "/invisible-architecture",
      title: "The Invisible Architecture",
      description: "A poetic map of the modern internet, expanded into a complete vibecoding knowledge base. 13-chapter interactive essay, plus 21 guides on stack selection, MCP, agent workflows, AI coding tools, and full stack blueprints.",
      tech: "Interactive essay + 21 guides, references, patterns, and stack blueprints. Built on Zo.",
      cta: "Explore",
      url: "http://localhost:3000/invisible-architecture",
    },
  ]);
});

// ─── TSX Page Bundler (on-the-fly) ──────────────────────────────────────────

async function bundlePage(tsxPath: string): Promise<string> {
  const result = await Bun.build({
    entrypoints: [`${PROJECT_DIR}/${tsxPath}`],
    target: "browser",
    format: "esm",
    minify: false,
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    external: [],
  });

  if (!result.success) {
    const errors = result.logs.map((l) => l.message).join("\n");
    throw new Error(`Build failed:\n${errors}`);
  }

  return await result.outputs[0].text();
}

function htmlShell(title: string, bundlePath: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Exhuman</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { mono: ['JetBrains Mono', 'monospace'] }
        }
      }
    }
  <\/script>
  <style>
    body { font-family: 'JetBrains Mono', monospace; background: #0a0a0a; color: #e0e0e0; margin: 0; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${bundlePath}"><\/script>
</body>
</html>`;
}

// Cache bundled pages in dev
const bundleCache = new Map<string, { js: string; time: number }>();
const CACHE_TTL = 5000; // 5s in dev - fast enough to iterate

async function getBundledPage(entry: string): Promise<string> {
  const cached = bundleCache.get(entry);
  const now = Date.now();
  if (cached && now - cached.time < CACHE_TTL) {
    return cached.js;
  }
  const js = await bundlePage(entry);
  bundleCache.set(entry, { js, time: now });
  return js;
}

// ─── Page: Invisible Architecture ────────────────────────────────────────────

// We need a client entry wrapper that imports the component and renders it
const CLIENT_ENTRY_IA = `
import React from "react";
import { createRoot } from "react-dom/client";
import InvisibleArchitecture from "./page.tsx";
createRoot(document.getElementById("root")!).render(React.createElement(InvisibleArchitecture));
`;

const CLIENT_ENTRY_REGISTRY = `
import React from "react";
import { createRoot } from "react-dom/client";
import AgenticRegistry from "./registry-page.tsx";
createRoot(document.getElementById("root")!).render(React.createElement(AgenticRegistry));
`;

// Write temp client entries on startup
await Bun.write(`${PROJECT_DIR}/.tmp-entry-ia.tsx`, CLIENT_ENTRY_IA);
await Bun.write(`${PROJECT_DIR}/.tmp-entry-registry.tsx`, CLIENT_ENTRY_REGISTRY);

// Serve bundled JS
app.get("/bundle/ia.js", async (c) => {
  try {
    const js = await getBundledPage(".tmp-entry-ia.tsx");
    return new Response(js, { headers: { "Content-Type": "application/javascript" } });
  } catch (e: any) {
    console.error("Bundle error (IA):", e.message);
    return new Response(`console.error(${JSON.stringify(e.message)})`, {
      headers: { "Content-Type": "application/javascript" },
      status: 500,
    });
  }
});

app.get("/bundle/registry.js", async (c) => {
  try {
    const js = await getBundledPage(".tmp-entry-registry.tsx");
    return new Response(js, { headers: { "Content-Type": "application/javascript" } });
  } catch (e: any) {
    console.error("Bundle error (Registry):", e.message);
    return new Response(`console.error(${JSON.stringify(e.message)})`, {
      headers: { "Content-Type": "application/javascript" },
      status: 500,
    });
  }
});

// Serve page HTML shells
app.get("/invisible-architecture", (c) => {
  return c.html(htmlShell("The Invisible Architecture", "/bundle/ia.js"));
});

app.get("/agentic-registry", (c) => {
  return c.html(htmlShell("Agentic Registry", "/bundle/registry.js"));
});

// ─── Static files ────────────────────────────────────────────────────────────

// Serve the original essay HTML
app.get("/pages/invisible-architecture.html", async (c) => {
  const file = Bun.file(`${PROJECT_DIR}/index.html`);
  if (await file.exists()) {
    return new Response(await file.text(), { headers: { "Content-Type": "text/html" } });
  }
  return c.text("Not found", 404);
});

// Serve the agentic internet HTML
app.get("/pages/agentic-internet.html", async (c) => {
  const file = Bun.file(`${PROJECT_DIR}/agentic-internet.html`);
  if (await file.exists()) {
    return new Response(await file.text(), { headers: { "Content-Type": "text/html" } });
  }
  return c.text("Not found", 404);
});

// ─── Home redirect ───────────────────────────────────────────────────────────
app.get("/", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invisible Architecture — Local Dev</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>body { font-family: 'JetBrains Mono', monospace; background: #0a0a0a; color: #e0e0e0; }</style>
</head>
<body class="flex items-center justify-center min-h-screen">
  <div class="text-center space-y-8 max-w-xl">
    <h1 class="text-2xl font-bold text-[#f0a860]">Invisible Architecture — Local Dev</h1>
    <div class="space-y-4 text-left">
      <a href="/invisible-architecture" class="block p-4 border border-[#f0a860]/20 rounded-lg hover:border-[#f0a860]/50 transition-colors">
        <div class="text-[#f0a860] font-bold">The Invisible Architecture</div>
        <div class="text-sm text-[#888] mt-1">Knowledge base hub — 5 tabs, 21 articles</div>
      </a>
      <a href="/agentic-registry" class="block p-4 border border-[#f0a860]/20 rounded-lg hover:border-[#f0a860]/50 transition-colors">
        <div class="text-[#f0a860] font-bold">Agentic Registry</div>
        <div class="text-sm text-[#888] mt-1">MCP/agent app registry — submit and browse</div>
      </a>
      <a href="/pages/invisible-architecture.html" class="block p-4 border border-[#f0a860]/20 rounded-lg hover:border-[#f0a860]/50 transition-colors">
        <div class="text-[#f0a860] font-bold">The Essay (original HTML)</div>
        <div class="text-sm text-[#888] mt-1">105KB interactive essay — 13 chapters</div>
      </a>
      <a href="/pages/agentic-internet.html" class="block p-4 border border-[#f0a860]/20 rounded-lg hover:border-[#f0a860]/50 transition-colors">
        <div class="text-[#f0a860] font-bold">Agentic Internet (visual page)</div>
        <div class="text-sm text-[#888] mt-1">Protocol map with verified repos and registries</div>
      </a>
    </div>
    <div class="text-xs text-[#555]">
      APIs: <a href="/api/routes" class="text-[#f0a860]">/api/routes</a> ·
      <a href="/api/invisible-architecture?file=guides/vibecoding-playbook.md" class="text-[#f0a860]">/api/invisible-architecture</a> ·
      <a href="/api/agentic-registry?status=all" class="text-[#f0a860]">/api/agentic-registry</a>
    </div>
  </div>
</body>
</html>`);
});

// ─── Start ───────────────────────────────────────────────────────────────────
console.log(`
  ┌─────────────────────────────────────────────┐
  │  Invisible Architecture — Local Dev Server  │
  │                                             │
  │  http://localhost:${PORT}                      │
  │                                             │
  │  Pages:                                     │
  │    /invisible-architecture  (knowledge hub) │
  │    /agentic-registry        (registry)      │
  │    /pages/invisible-architecture.html        │
  │    /pages/agentic-internet.html              │
  │                                             │
  │  APIs:                                      │
  │    /api/invisible-architecture               │
  │    /api/agentic-registry                     │
  │    /api/routes                               │
  └─────────────────────────────────────────────┘
`);

export default {
  port: PORT,
  fetch: app.fetch,
};
