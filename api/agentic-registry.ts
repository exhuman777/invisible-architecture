// Route: /api/agentic-registry (api, public)
import type { Context } from "hono";

const DB_PATH = "/home/workspace/invisible-architecture/registry.json";

interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  github: string;
  category: "mcp-server" | "skill" | "agent" | "framework" | "tool";
  tags: string[];
  author: string;
  url?: string;
  status: "pending" | "approved" | "featured";
  submittedAt: string;
}

async function readDB(): Promise<RegistryEntry[]> {
  try {
    const file = Bun.file(DB_PATH);
    if (await file.exists()) {
      return await file.json();
    }
  } catch {}
  return [];
}

async function writeDB(entries: RegistryEntry[]) {
  await Bun.write(DB_PATH, JSON.stringify(entries, null, 2));
}

// Validation
const GITHUB_RE = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
const CATEGORIES = ["mcp-server", "skill", "agent", "framework", "tool"];
const MAX_NAME = 80;
const MAX_DESC = 500;
const MAX_AUTHOR = 60;
const MAX_TAGS = 5;
const MAX_TAG_LEN = 30;

function sanitize(str: string, max: number): string {
  return str.trim().slice(0, max).replace(/[<>]/g, "");
}

export default async (c: Context) => {
  const method = c.req.method;
  const url = new URL(c.req.url);
  const action = url.searchParams.get("action");

  // GET: List entries (optionally filter by category or status)
  if (method === "GET") {
    const entries = await readDB();
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status") || "approved";

    let filtered = entries.filter(e => e.status === status || status === "all");
    if (category && CATEGORIES.includes(category)) {
      filtered = filtered.filter(e => e.category === category);
    }

    return c.json(filtered, 200, { "Cache-Control": "public, max-age=300" });
  }

  // POST: Submit new entry
  if (method === "POST") {
    const body = await c.req.json() as Partial<RegistryEntry>;

    // Validate required fields
    if (!body.name || !body.description || !body.github || !body.category || !body.author) {
      return c.json({ error: "Missing required fields: name, description, github, category, author" }, 400);
    }

    // Validate GitHub URL
    if (!GITHUB_RE.test(body.github)) {
      return c.json({ error: "Invalid GitHub URL. Must be https://github.com/owner/repo" }, 400);
    }

    // Validate category
    if (!CATEGORIES.includes(body.category)) {
      return c.json({ error: `Invalid category. Must be one of: ${CATEGORIES.join(", ")}` }, 400);
    }

    // Validate tags
    const tags = (body.tags || [])
      .slice(0, MAX_TAGS)
      .map(t => sanitize(String(t), MAX_TAG_LEN))
      .filter(t => t.length > 0);

    // Check for duplicate GitHub URL
    const entries = await readDB();
    if (entries.some(e => e.github.toLowerCase() === body.github.toLowerCase())) {
      return c.json({ error: "This GitHub repo has already been submitted" }, 409);
    }

    const entry: RegistryEntry = {
      id: crypto.randomUUID(),
      name: sanitize(body.name, MAX_NAME),
      description: sanitize(body.description, MAX_DESC),
      github: body.github.trim(),
      category: body.category,
      tags,
      author: sanitize(body.author, MAX_AUTHOR),
      url: body.url?.trim().slice(0, 200) || undefined,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    entries.push(entry);
    await writeDB(entries);

    return c.json({ ok: true, entry, message: "Submitted for review. Approved entries appear on the registry." });
  }

  return c.json({ error: "Method not allowed" }, 405);
};
