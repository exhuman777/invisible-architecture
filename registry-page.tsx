// Route: /agentic-registry (page, public)
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = "mcp-server" | "skill" | "agent" | "framework" | "tool";
type FilterCategory = Category | "all";

interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  github: string;
  category: Category;
  tags: string[];
  author: string;
  url?: string;
  status: "pending" | "approved" | "featured";
  submittedAt: string;
}

const CATEGORIES: { value: FilterCategory; label: string; emoji: string }[] = [
  { value: "all", label: "All", emoji: "" },
  { value: "mcp-server", label: "MCP Servers", emoji: ">" },
  { value: "skill", label: "Skills", emoji: "*" },
  { value: "agent", label: "Agents", emoji: "@" },
  { value: "framework", label: "Frameworks", emoji: "#" },
  { value: "tool", label: "Tools", emoji: "~" },
];

const CATEGORY_COLORS: Record<Category, string> = {
  "mcp-server": "#f0a860",
  "skill": "#60c0f0",
  "agent": "#a0f060",
  "framework": "#f060a0",
  "tool": "#c0a0f0",
};

// ─── Seed Data (shown before API loads / as fallback) ────────────────────────

const SEED_ENTRIES: RegistryEntry[] = [
  {
    id: "seed-1",
    name: "MCP Servers (Official)",
    description: "Reference implementations of MCP servers by the protocol team. File systems, GitHub, Git, Postgres, Slack, Google Maps, and more.",
    github: "https://github.com/modelcontextprotocol/servers",
    category: "mcp-server",
    tags: ["official", "reference", "multi-tool"],
    author: "Anthropic",
    status: "featured",
    submittedAt: "2024-11-25T00:00:00Z",
  },
  {
    id: "seed-2",
    name: "FastMCP",
    description: "The fast, Pythonic way to build MCP servers and clients. Powers 70% of MCP servers across all languages. Component versioning, auth, OpenTelemetry.",
    github: "https://github.com/jlowin/fastmcp",
    category: "framework",
    tags: ["python", "MCP", "server-framework"],
    author: "Jeremiah Lowin",
    url: "https://gofastmcp.com",
    status: "featured",
    submittedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "seed-3",
    name: "OpenAI Codex",
    description: "Lightweight coding agent that runs in your terminal. Supports MCP servers, AGENTS.md, and can run as an MCP server itself for orchestration.",
    github: "https://github.com/openai/codex",
    category: "agent",
    tags: ["coding", "terminal", "OpenAI"],
    author: "OpenAI",
    status: "featured",
    submittedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "seed-4",
    name: "Anthropic Skills",
    description: "The official Agent Skills repository. Open standard for packaging reusable agent capabilities via SKILL.md. Adopted by Claude, Codex, Copilot.",
    github: "https://github.com/anthropics/skills",
    category: "skill",
    tags: ["standard", "SKILL.md", "official"],
    author: "Anthropic",
    url: "https://agentskills.io",
    status: "featured",
    submittedAt: "2025-12-18T00:00:00Z",
  },
  {
    id: "seed-5",
    name: "Vercel AI SDK",
    description: "The AI Toolkit for TypeScript. Agent abstractions, MCP support, streaming, multi-model. From the creators of Next.js.",
    github: "https://github.com/vercel/ai",
    category: "framework",
    tags: ["typescript", "Next.js", "agents", "streaming"],
    author: "Vercel",
    url: "https://ai-sdk.dev",
    status: "featured",
    submittedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "seed-6",
    name: "A2A Protocol",
    description: "Agent-to-Agent protocol by Google. Enables multi-vendor agent collaboration over HTTP + SSE + JSON-RPC. Now under Linux Foundation.",
    github: "https://github.com/a2aproject/A2A",
    category: "framework",
    tags: ["protocol", "A2A", "Google", "interop"],
    author: "Google / Linux Foundation",
    url: "https://a2a-protocol.org",
    status: "featured",
    submittedAt: "2025-04-01T00:00:00Z",
  },
  {
    id: "seed-7",
    name: "OpenAI Agents SDK (Python)",
    description: "Python SDK for building multi-step agent workflows. Responses API, tool orchestration, guardrails, handoffs between agents.",
    github: "https://github.com/openai/openai-agents-python",
    category: "framework",
    tags: ["python", "OpenAI", "agents", "orchestration"],
    author: "OpenAI",
    status: "approved",
    submittedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "seed-8",
    name: "MCP TypeScript SDK",
    description: "Official TypeScript SDK for building MCP servers and clients. The foundation for most TS-based MCP servers.",
    github: "https://github.com/modelcontextprotocol/typescript-sdk",
    category: "framework",
    tags: ["typescript", "SDK", "official"],
    author: "Anthropic",
    status: "approved",
    submittedAt: "2024-11-25T00:00:00Z",
  },
  {
    id: "seed-9",
    name: "MCP Python SDK",
    description: "Official Python SDK for MCP. Includes FastMCP integration. Server and client support with full protocol coverage.",
    github: "https://github.com/modelcontextprotocol/python-sdk",
    category: "framework",
    tags: ["python", "SDK", "official"],
    author: "Anthropic",
    status: "approved",
    submittedAt: "2024-11-25T00:00:00Z",
  },
  {
    id: "seed-10",
    name: "Microsoft Skills",
    description: "126 modular skills for Copilot, Codex, and Claude. Cosmos DB, Azure, Foundry, and more. Plus Agents.md and MCP server configs.",
    github: "https://github.com/microsoft/skills",
    category: "skill",
    tags: ["Microsoft", "Copilot", "Azure", "enterprise"],
    author: "Microsoft",
    status: "approved",
    submittedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "seed-11",
    name: "Agent Skills Spec",
    description: "Community specification for Agent Skills. Standardizes SKILL.md format, capability discovery, and execution semantics across platforms.",
    github: "https://github.com/agentskills/agentskills",
    category: "tool",
    tags: ["spec", "standard", "SKILL.md"],
    author: "Agent Skills Community",
    url: "https://agentskills.io",
    status: "approved",
    submittedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "seed-12",
    name: "MCP Registry",
    description: "The official community-driven registry for MCP servers. API freeze v0.1. The canonical source of truth for server discovery.",
    github: "https://github.com/modelcontextprotocol/registry",
    category: "tool",
    tags: ["registry", "official", "discovery"],
    author: "Anthropic",
    url: "https://registry.modelcontextprotocol.io",
    status: "approved",
    submittedAt: "2025-09-08T00:00:00Z",
  },
];

// ─── CometCursor ─────────────────────────────────────────────────────────────

function CometCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const trail: { x: number; y: number; t: number }[] = [];
    const TL = 35;
    let mx = 0, my = 0, lastMoveT = 0, speed = 0;
    let starScale = 0, catchTime = 0, wasCaught = false;

    function resize() { canvas!.width = innerWidth; canvas!.height = innerHeight; }
    resize();

    function onPointerInput(x: number, y: number) {
      const now = Date.now(), dt = now - lastMoveT || 16;
      const dx = x - mx, dy = y - my;
      speed = Math.sqrt(dx * dx + dy * dy) / (dt / 16);
      mx = x; my = y; lastMoveT = now;
      trail.push({ x, y, t: now });
      if (trail.length > TL) trail.shift();
    }

    function onMouse(e: MouseEvent) { onPointerInput(e.clientX, e.clientY); }
    function onTouchStart(e: TouchEvent) { const t = e.touches[0]; if (t) { mx = t.clientX; my = t.clientY; lastMoveT = Date.now(); } }
    function onTouchMove(e: TouchEvent) { const t = e.touches[0]; if (t) onPointerInput(t.clientX, t.clientY); }
    function onTouchEnd() { lastMoveT = Date.now(); speed = 0; }

    function drawStar(cx: number, cy: number, spikes: number, outerR: number, innerR: number, rot: number) {
      ctx!.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = rot + (i * Math.PI / spikes) - Math.PI / 2;
        if (i === 0) ctx!.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        else ctx!.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx!.closePath();
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const n = Date.now();
      const timeSinceMove = n - lastMoveT;
      const caught = timeSinceMove > 120 || speed < 1.5;
      if (caught && !wasCaught) { catchTime = n; wasCaught = true; }
      if (!caught) wasCaught = false;

      let target = 0;
      if (caught) { target = (n - catchTime < 1000) ? 1 : 0.45; }
      const lerpSpeed = target > starScale ? 0.1 : 0.04;
      starScale += (target - starScale) * lerpSpeed;

      const alive = trail.filter(p => n - p.t < 700);
      if (alive.length > 1) {
        for (let i = 1; i < alive.length; i++) {
          const p = alive[i], prev = alive[i - 1];
          const progress = i / alive.length;
          const age = n - p.t;
          const fade = (1 - age / 700) * progress;
          const thickness = 0.4 + progress * 4;
          const r = 255, g = Math.round(130 + progress * 100), b = Math.round(40 + progress * 100);
          ctx!.beginPath(); ctx!.moveTo(prev.x, prev.y); ctx!.lineTo(p.x, p.y);
          ctx!.strokeStyle = `rgba(${r},${g},${b},${fade * 0.7})`;
          ctx!.lineWidth = thickness; ctx!.lineCap = "round"; ctx!.stroke();
          ctx!.beginPath(); ctx!.moveTo(prev.x, prev.y); ctx!.lineTo(p.x, p.y);
          ctx!.strokeStyle = `rgba(${r},${g},${b},${fade * 0.12})`;
          ctx!.lineWidth = thickness * 5; ctx!.stroke();
        }
      }

      const grd = ctx!.createRadialGradient(mx, my, 0, mx, my, 14);
      grd.addColorStop(0, "rgba(255,255,255,0.3)");
      grd.addColorStop(0.4, "rgba(255,200,140,0.1)");
      grd.addColorStop(1, "rgba(255,153,102,0)");
      ctx!.fillStyle = grd; ctx!.beginPath(); ctx!.arc(mx, my, 14, 0, Math.PI * 2); ctx!.fill();

      const rot = n * 0.0012;
      ctx!.save(); ctx!.shadowColor = "rgba(255,255,255,0.6)"; ctx!.shadowBlur = 6;
      drawStar(mx, my, 5, 5, 2, rot);
      ctx!.fillStyle = "rgba(255,255,255,0.85)"; ctx!.fill(); ctx!.restore();

      if (starScale > 0.02) {
        const s = starScale;
        const bigR = 4 + s * 15, bigIR = bigR * 0.42;
        const bigRot = n * 0.0005;
        const pulse = 1 + Math.sin(n * 0.004) * 0.06;
        ctx!.save(); ctx!.globalAlpha = s;
        const burstR = bigR * 2.2 * pulse;
        const bgrd = ctx!.createRadialGradient(mx, my, bigR * 0.3, mx, my, burstR);
        bgrd.addColorStop(0, "rgba(255,220,160,0.25)");
        bgrd.addColorStop(0.5, "rgba(255,180,100,0.06)");
        bgrd.addColorStop(1, "rgba(255,153,102,0)");
        ctx!.fillStyle = bgrd; ctx!.beginPath(); ctx!.arc(mx, my, burstR, 0, Math.PI * 2); ctx!.fill();
        ctx!.shadowColor = "rgba(255,200,120,0.9)"; ctx!.shadowBlur = 20 * s;
        drawStar(mx, my, 5, bigR * pulse, bigIR * pulse, bigRot);
        const sgrd = ctx!.createRadialGradient(mx, my, 0, mx, my, bigR);
        sgrd.addColorStop(0, "rgba(255,255,255,1)");
        sgrd.addColorStop(0.6, "rgba(255,240,220,0.95)");
        sgrd.addColorStop(1, "rgba(255,200,140,0.8)");
        ctx!.fillStyle = sgrd; ctx!.fill();
        ctx!.shadowBlur = 0;
        drawStar(mx, my, 5, bigR * 0.6 * pulse, bigIR * 0.5 * pulse, bigRot);
        ctx!.fillStyle = "rgba(255,255,255,1)"; ctx!.fill();
        ctx!.restore();
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    document.addEventListener("mousemove", onMouse);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[9999]" style={{ pointerEvents: "none" }} />;
}

// ─── ConstellationBackground ─────────────────────────────────────────────────

function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let w = window.innerWidth, h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    const A = { r: 240, g: 153, b: 66 };
    const KW = ["MCP", "agent", "skill", "tool", "A2A", "deploy", "registry", "build", "ship", "API", "SDK", "serve"];
    interface C { x: number; y: number; c: string; s: number; o: number; sz: number; }
    const chars: C[] = [];
    for (let i = 0; i < 50; i++) chars.push({ x: Math.random() * w, y: Math.random() * h, c: KW[Math.floor(Math.random() * KW.length)], s: 0.2 + Math.random() * 0.5, o: 0.02 + Math.random() * 0.05, sz: 10 + Math.random() * 3 });
    interface N { x: number; y: number; vx: number; vy: number; z: number; }
    const nodes: N[] = [];
    for (let i = 0; i < 35; i++) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, z: 0.3 + Math.random() * 0.7 });
    interface P { fi: number; ti: number; t: number; sp: number; }
    const packets: P[] = [];
    for (let i = 0; i < 8; i++) { const f = Math.floor(Math.random() * nodes.length); let t = Math.floor(Math.random() * nodes.length); if (t === f) t = (t + 1) % nodes.length; packets.push({ fi: f, ti: t, t: Math.random(), sp: 0.003 + Math.random() * 0.005 }); }
    interface R { x: number; y: number; r: number; mr: number; o: number; }
    const rings: R[] = [];
    let rt = 0, time = 0;
    function draw() {
      time += 0.016; rt += 0.016;
      ctx!.clearRect(0, 0, w, h); ctx!.fillStyle = "#0a0a0a"; ctx!.fillRect(0, 0, w, h);
      for (const c of chars) { c.y += c.s; if (c.y > h + 20) { c.y = -20; c.x = Math.random() * w; c.c = KW[Math.floor(Math.random() * KW.length)]; } ctx!.font = `${c.sz}px "JetBrains Mono", monospace`; ctx!.fillStyle = `rgba(${A.r},${A.g},${A.b},${c.o})`; ctx!.fillText(c.c, c.x, c.y); }
      for (const n of nodes) { n.x += n.vx * n.z; n.y += n.vy * n.z; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 200) { const az = (nodes[i].z + nodes[j].z) / 2; ctx!.strokeStyle = `rgba(${A.r},${A.g},${A.b},${(1 - d / 200) * 0.08 * az})`; ctx!.lineWidth = 0.5 * az; ctx!.beginPath(); ctx!.moveTo(nodes[i].x, nodes[i].y); ctx!.lineTo(nodes[j].x, nodes[j].y); ctx!.stroke(); } }
      for (const n of nodes) { ctx!.fillStyle = `rgba(${A.r},${A.g},${A.b},${0.1 + n.z * 0.08})`; ctx!.beginPath(); ctx!.arc(n.x, n.y, 1.5 + n.z * 1.5, 0, Math.PI * 2); ctx!.fill(); }
      for (const p of packets) { p.t += p.sp; if (p.t > 1) { p.t = 0; p.fi = p.ti; p.ti = Math.floor(Math.random() * nodes.length); if (p.ti === p.fi) p.ti = (p.ti + 1) % nodes.length; } const fn = nodes[p.fi], tn = nodes[p.ti]; ctx!.fillStyle = `rgba(${A.r},${A.g},${A.b},0.5)`; ctx!.beginPath(); ctx!.arc(fn.x + (tn.x - fn.x) * p.t, fn.y + (tn.y - fn.y) * p.t, 3, 0, Math.PI * 2); ctx!.fill(); }
      const b = 0.03 + Math.sin(time * 0.8) * 0.015; const g = ctx!.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.5); g.addColorStop(0, `rgba(${A.r},${A.g},${A.b},${b})`); g.addColorStop(1, "rgba(0,0,0,0)"); ctx!.fillStyle = g; ctx!.fillRect(0, 0, w, h);
      if (rt > 3) { rt = 0; rings.push({ x: w / 2 + (Math.random() - 0.5) * w * 0.3, y: h / 2 + (Math.random() - 0.5) * h * 0.3, r: 0, mr: 80 + Math.random() * 120, o: 0.12 }); }
      for (let i = rings.length - 1; i >= 0; i--) { const r = rings[i]; r.r += 0.5; r.o *= 0.995; if (r.o < 0.005 || r.r > r.mr) { rings.splice(i, 1); continue; } ctx!.strokeStyle = `rgba(${A.r},${A.g},${A.b},${r.o})`; ctx!.lineWidth = 1; ctx!.beginPath(); ctx!.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx!.stroke(); }
      ctx!.fillStyle = "rgba(0,0,0,0.03)"; for (let y = 0; y < h; y += 4) ctx!.fillRect(0, y, w, 1);
      const v = ctx!.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.4)"); ctx!.fillStyle = v; ctx!.fillRect(0, 0, w, h);
      animId = requestAnimationFrame(draw);
    }
    draw();
    function onR() { w = window.innerWidth; h = window.innerHeight; canvas!.width = w; canvas!.height = h; }
    window.addEventListener("resize", onR);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onR); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ pointerEvents: "none" }} />;
}

// ─── GlassCard ───────────────────────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-[#1e1e1e]/70 backdrop-blur-xl border border-[#f0a860]/15 rounded-lg transition-colors hover:border-[#f0a860]/30 ${className}`}>{children}</div>;
}

// ─── Entry Card ──────────────────────────────────────────────────────────────

function EntryCard({ entry }: { entry: RegistryEntry }) {
  const catColor = CATEGORY_COLORS[entry.category];
  const catLabel = CATEGORIES.find(c => c.value === entry.category)?.label || entry.category;

  return (
    <GlassCard className="p-5 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-white font-bold text-base">{entry.name}</h3>
            {entry.status === "featured" && (
              <span className="px-1.5 py-0.5 text-[10px] bg-[#f0a860]/20 text-[#f0a860] rounded font-bold">FEATURED</span>
            )}
          </div>
          <p className="text-xs text-[#888]">by {entry.author}</p>
        </div>
        <span
          className="px-2 py-0.5 text-xs rounded border shrink-0"
          style={{ color: catColor, borderColor: `${catColor}33`, backgroundColor: `${catColor}15` }}
        >
          {catLabel}
        </span>
      </div>

      <p className="text-sm text-[#aaa] leading-relaxed mb-3">{entry.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {entry.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-xs bg-[#f0a860]/10 text-[#f0a860] border border-[#f0a860]/20 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs">
        <a
          href={entry.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f0a860] no-underline hover:underline flex items-center gap-1"
        >
          GitHub &rarr;
        </a>
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888] no-underline hover:text-[#f0a860] transition"
          >
            Website
          </a>
        )}
        <span className="text-[#555] ml-auto">
          {new Date(entry.submittedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </GlassCard>
  );
}

// ─── Submit Form ─────────────────────────────────────────────────────────────

function SubmitForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    github: "",
    category: "mcp-server" as Category,
    tags: "",
    author: "",
    url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/agentic-registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: "Submitted! Your entry will appear after review." });
        setForm({ name: "", description: "", github: "", category: "mcp-server", tags: "", author: "", url: "" });
        onSubmitted();
      } else {
        setResult({ ok: false, message: data.error || "Submission failed" });
      }
    } catch {
      setResult({ ok: false, message: "Network error. Try again." });
    }
    setSubmitting(false);
  };

  const inputClass = "w-full bg-[#0a0a0a] border border-[#f0a860]/20 rounded px-3 py-2 text-sm text-[#e0e0e0] focus:outline-none focus:border-[#f0a860]/50 transition placeholder-[#555]";

  return (
    <GlassCard className="p-6">
      <h2 className="text-[#f0a860] font-bold text-lg mb-2">Submit Your Project</h2>
      <p className="text-sm text-[#888] mb-4">
        Share your MCP server, skill, agent, framework, or tool. All submissions are reviewed before appearing.
        Include a GitHub link so the community can star, fork, and contribute.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Project name *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            required
            maxLength={80}
          />
          <input
            type="text"
            placeholder="Your name / org *"
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })}
            className={inputClass}
            required
            maxLength={60}
          />
        </div>

        <textarea
          placeholder="Description (what it does, why it matters) *"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} min-h-[80px] resize-y`}
          required
          maxLength={500}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="url"
            placeholder="GitHub URL (https://github.com/...) *"
            value={form.github}
            onChange={e => setForm({ ...form, github: e.target.value })}
            className={inputClass}
            required
            pattern="https://github\.com/.+/.+"
          />
          <input
            type="url"
            placeholder="Website URL (optional)"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value as Category })}
            className={inputClass}
          >
            {CATEGORIES.filter(c => c.value !== "all").map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tags (comma-separated, max 5)"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
            className={inputClass}
            maxLength={150}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[#f0a860] text-[#0a0a0a] font-bold text-sm rounded hover:opacity-85 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          {result && (
            <span className={`text-sm ${result.ok ? "text-green-400" : "text-red-400"}`}>
              {result.message}
            </span>
          )}
        </div>
      </form>

      <div className="mt-4 pt-3 border-t border-[#f0a860]/10">
        <p className="text-xs text-[#666]">
          Curation happens on GitHub. Once approved, entries can be discussed, improved, and starred by the community.
          Think of this as Product Hunt meets GitHub for the agentic internet.
        </p>
      </div>
    </GlassCard>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgenticRegistry() {
  const [entries, setEntries] = useState<RegistryEntry[]>(SEED_ENTRIES);
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [search, setSearch] = useState("");
  const [showSubmit, setShowSubmit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/agentic-registry?status=all")
      .then(r => r.json())
      .then((data: RegistryEntry[]) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API entries with seed, dedup by github URL
          const seen = new Set(data.map(e => e.github.toLowerCase()));
          const merged = [...data, ...SEED_ENTRIES.filter(s => !seen.has(s.github.toLowerCase()))];
          setEntries(merged);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const refreshEntries = () => {
    fetch("/api/agentic-registry?status=all")
      .then(r => r.json())
      .then((data: RegistryEntry[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const seen = new Set(data.map(e => e.github.toLowerCase()));
          const merged = [...data, ...SEED_ENTRIES.filter(s => !seen.has(s.github.toLowerCase()))];
          setEntries(merged);
        }
      })
      .catch(() => {});
  };

  const filtered = entries.filter(e => {
    if (filter !== "all" && e.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Featured first, then approved, then pending
  const sorted = [...filtered].sort((a, b) => {
    const statusOrder = { featured: 0, approved: 1, pending: 2 };
    return (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
  });

  const counts: Record<string, number> = { all: entries.length };
  for (const e of entries) counts[e.category] = (counts[e.category] || 0) + 1;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div className="min-h-screen relative" style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace', color: "#e0e0e0", cursor: "crosshair" }}>
        <ConstellationBackground />
        <CometCursor />
        <div className="relative z-10 max-w-[960px] mx-auto px-4 sm:px-6 py-8">

          {/* Nav */}
          <nav className="flex items-center justify-between border-b border-[#f0a860]/15 pb-4 mb-8 flex-wrap gap-4">
            <a href="/" className="text-[#f0a860] font-bold text-sm tracking-wider no-underline">EXHUMAN</a>
            <div className="flex gap-6 text-sm">
              <a href="/" className="text-[#888] no-underline hover:text-[#f0a860] transition">Home</a>
              <a href="/invisible-architecture" className="text-[#888] no-underline hover:text-[#f0a860] transition">Knowledge Base</a>
              <span className="text-[#f0a860]">Registry</span>
            </div>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">Agentic Registry</h1>
            <p className="text-sm text-[#888] leading-relaxed max-w-2xl">
              A community-curated directory of MCP servers, agent skills, frameworks, and tools building the agentic internet.
              Submit your project. Star on GitHub. Build together.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Category filter */}
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  onClick={() => setFilter(c.value)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${
                    filter === c.value
                      ? "bg-[#f0a860] text-[#0a0a0a] font-bold"
                      : "text-[#888] hover:text-[#e0e0e0] hover:bg-[#1e1e1e]/50"
                  }`}
                >
                  {c.label}
                  <span className="ml-1 opacity-60">{counts[c.value] || 0}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#0a0a0a] border border-[#f0a860]/20 rounded px-3 py-1.5 text-xs text-[#e0e0e0] focus:outline-none focus:border-[#f0a860]/50 transition placeholder-[#555] w-40 sm:w-48"
            />

            {/* Submit toggle */}
            <button
              onClick={() => setShowSubmit(!showSubmit)}
              className={`ml-auto px-4 py-1.5 text-xs rounded transition-colors ${
                showSubmit
                  ? "bg-[#f0a860]/20 text-[#f0a860] border border-[#f0a860]/30"
                  : "bg-[#f0a860] text-[#0a0a0a] font-bold"
              }`}
            >
              {showSubmit ? "Close" : "+ Submit Project"}
            </button>
          </div>

          {/* Submit form */}
          {showSubmit && (
            <div className="mb-8">
              <SubmitForm onSubmitted={refreshEntries} />
            </div>
          )}

          {/* Entries grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sorted.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>

          {sorted.length === 0 && (
            <GlassCard className="p-8 text-center">
              <p className="text-sm text-[#888]">No entries match your filter.</p>
            </GlassCard>
          )}

          {/* Stats */}
          <GlassCard className="p-4 mb-8">
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <p className="text-2xl font-black text-[#f0a860]">{entries.length}</p>
                <p className="text-xs text-[#888]">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f0a860]">{entries.filter(e => e.status === "featured").length}</p>
                <p className="text-xs text-[#888]">Featured</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f0a860]">{new Set(entries.map(e => e.category)).size}</p>
                <p className="text-xs text-[#888]">Categories</p>
              </div>
            </div>
          </GlassCard>

          {/* How it works */}
          <GlassCard className="p-6 mb-8">
            <h2 className="text-[#f0a860] font-bold text-lg mb-4">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white font-bold mb-1">1. Submit</p>
                <p className="text-[#888]">Share your MCP server, skill, agent, or tool. Include a GitHub link. That's it.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-1">2. Review</p>
                <p className="text-[#888]">Submissions are reviewed by Exhuman and the community. Quality over quantity.</p>
              </div>
              <div>
                <p className="text-white font-bold mb-1">3. Build Together</p>
                <p className="text-[#888]">Star repos. Open issues. Submit PRs. The registry lives on GitHub, not behind a login wall.</p>
              </div>
            </div>
          </GlassCard>

          {/* Footer */}
          <footer className="border-t border-[#f0a860]/15 mt-16 pt-8 text-center text-[#888] text-xs pb-8">
            Built by <a href="https://github.com/exhuman777" className="text-[#f0a860] no-underline">Exhuman</a> on <a href="https://www.zo.computer/" className="text-[#f0a860] no-underline">Zo</a>
            <span className="mx-2">&middot;</span>
            <a href="/invisible-architecture" className="text-[#f0a860] no-underline">Knowledge Base</a>
          </footer>
        </div>
      </div>
    </>
  );
}
