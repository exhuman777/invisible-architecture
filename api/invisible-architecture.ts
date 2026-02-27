// Route: /api/invisible-architecture (api, public)
import type { Context } from "hono";

const BASE_PATH = "/home/workspace/invisible-architecture";
const ALLOWED_DIRS = /^(guides|reference|patterns|stacks)\/[a-z0-9-]+\.md$/;

export default async (c: Context) => {
  const url = new URL(c.req.url);
  const file = url.searchParams.get("file");

  if (!file || !ALLOWED_DIRS.test(file)) {
    return c.json({ error: "Invalid file path" }, 400);
  }

  const filePath = `${BASE_PATH}/${file}`;

  try {
    const f = Bun.file(filePath);
    if (!(await f.exists())) {
      return c.json({ error: "File not found" }, 404);
    }
    const content = await f.text();
    return c.json(
      { file, content },
      200,
      { "Cache-Control": "public, max-age=3600" }
    );
  } catch {
    return c.json({ error: "Failed to read file" }, 500);
  }
};
