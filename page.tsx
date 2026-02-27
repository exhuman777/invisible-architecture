// Route: /invisible-architecture (page, public)
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

const TABS = ["essay", "guides", "reference", "patterns", "stacks"] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  essay: "Essay",
  guides: "Guides",
  reference: "Reference",
  patterns: "Patterns",
  stacks: "Stacks",
};

interface Article {
  slug: string;
  title: string;
  summary: string;
  category: Tab;
  tags: string[];
  wordCount: number;
  poem: string;
}

// ─── Article Data ────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  // Guides
  {
    slug: "guides/vibecoding-playbook.md",
    title: "The Vibecoding Playbook",
    summary: "The core methodology for programming with AI. Everything you need to start vibecoding effectively. You are the architect, AI is the builder.",
    category: "guides",
    tags: ["methodology", "AI coding", "fundamentals"],
    wordCount: 2051,
    poem: "You describe behavior, AI handles implementation.",
  },
  {
    slug: "guides/mcp-ecosystem.md",
    title: "The MCP Ecosystem",
    summary: "Model Context Protocol explained for vibecoders. What MCP does, why you need it, how to set it up with Claude, Cursor, and other tools.",
    category: "guides",
    tags: ["MCP", "protocols", "Claude", "tooling"],
    wordCount: 1384,
    poem: "The protocol that turns AI from assistant to operator.",
  },
  {
    slug: "guides/stack-selection.md",
    title: "Stack Selection Guide",
    summary: "Decision trees for picking the right stack by project type. Opinionated recommendations with costs, tradeoffs, and alternatives for every scenario.",
    category: "guides",
    tags: ["architecture", "decisions", "stacks"],
    wordCount: 1406,
    poem: "The best stack is the one you ship with.",
  },
  {
    slug: "guides/agent-workflows.md",
    title: "Agent Workflows",
    summary: "Multi-agent coordination patterns for AI-assisted development. When one agent isn't enough. Parallel research, sequential builds, review loops.",
    category: "guides",
    tags: ["agents", "workflows", "coordination"],
    wordCount: 1463,
    poem: "One agent writes. Another reviews. A third deploys.",
  },
  {
    slug: "guides/ai-coding-tools.md",
    title: "AI Coding Tools Comparison",
    summary: "Every major AI coding tool evaluated for vibecoders. What each does best, what each does worst, which one to pick for your workflow.",
    category: "guides",
    tags: ["tools", "comparison", "Claude", "Cursor", "Copilot"],
    wordCount: 1966,
    poem: "The tool doesn't matter. The operator does.",
  },
  {
    slug: "guides/agentic-internet.md",
    title: "The Agentic Internet",
    summary: "The complete map of MCP registries, skills marketplaces, A2A protocol, and agent frameworks. Verified GitHub repos with star counts. Two starter app tutorials included.",
    category: "guides",
    tags: ["MCP", "skills", "A2A", "registries", "agents"],
    wordCount: 4200,
    poem: "MCP + Skills + A2A. The protocol stack of the agent web.",
  },
  {
    slug: "guides/zo-platform.md",
    title: "Zo: The Modern Server for Vibecoders",
    summary: "Complete guide to Zo as infrastructure. Spaces, Sites, Services, Agents, Skills, Stripe, MCP server mode, SSH, file sync, 50+ tools. All doc links included.",
    category: "guides",
    tags: ["Zo", "infrastructure", "server", "Stripe", "MCP"],
    wordCount: 3800,
    poem: "Describe what you want. Zo builds it. It's live.",
  },

  // Reference
  {
    slug: "reference/services-catalog.md",
    title: "Infrastructure Services Catalog",
    summary: "Every service a vibecoder needs, compared. Hosting, databases, auth, payments, email, DNS, monitoring. Pricing, free tiers, quick picks by use case.",
    category: "reference",
    tags: ["infrastructure", "pricing", "services", "comparison"],
    wordCount: 2926,
    poem: "Last verified: February 2026.",
  },
  {
    slug: "reference/ai-inference-providers.md",
    title: "AI Inference Providers",
    summary: "Complete comparison of AI inference providers. Pricing per 1M tokens, context windows, model availability, latency benchmarks, and best-use recommendations.",
    category: "reference",
    tags: ["AI", "inference", "pricing", "models"],
    wordCount: 2131,
    poem: "The cost of intelligence, measured in tokens.",
  },
  {
    slug: "reference/mcp-directory.md",
    title: "MCP Directory",
    summary: "The Model Context Protocol ecosystem mapped. Official servers, community servers, how to find and install them, what each one does.",
    category: "reference",
    tags: ["MCP", "directory", "servers", "ecosystem"],
    wordCount: 1464,
    poem: "Every MCP server worth installing.",
  },
  {
    slug: "reference/agent-frameworks.md",
    title: "Agent Frameworks",
    summary: "Comparison of major agent and AI frameworks for building LLM-powered applications. LangChain, CrewAI, AutoGen, Mastra, and more. With honest assessments.",
    category: "reference",
    tags: ["agents", "frameworks", "LangChain", "comparison"],
    wordCount: 1849,
    poem: "Frameworks come and go. The patterns endure.",
  },
  {
    slug: "reference/vector-databases.md",
    title: "Vector Databases",
    summary: "Vector database comparison for RAG, semantic search, and embedding use cases. Pinecone, Weaviate, Qdrant, ChromaDB, pgvector. Performance and pricing.",
    category: "reference",
    tags: ["vectors", "RAG", "databases", "embeddings"],
    wordCount: 2434,
    poem: "Similarity is a spectrum, not a boolean.",
  },

  // Patterns
  {
    slug: "patterns/claude-md.md",
    title: "CLAUDE.md Patterns",
    summary: "How to write effective project-level AI instructions. The single highest-leverage file in any AI-assisted codebase. Templates and anti-patterns included.",
    category: "patterns",
    tags: ["CLAUDE.md", "instructions", "best practices"],
    wordCount: 1184,
    poem: "One file to rule the context.",
  },
  {
    slug: "patterns/project-scaffolding.md",
    title: "Project Scaffolding with AI",
    summary: "How to start projects so AI can help effectively from minute one. The empty repo problem and how to solve it with structure over code.",
    category: "patterns",
    tags: ["scaffolding", "project setup", "architecture"],
    wordCount: 677,
    poem: "The first commit sets the trajectory.",
  },
  {
    slug: "patterns/prompt-patterns.md",
    title: "Prompt Patterns for Code",
    summary: "Practical patterns for getting better code output from AI. Not theory, just what works. Behavior over implementation, constraint stacking, iterative refinement.",
    category: "patterns",
    tags: ["prompts", "patterns", "techniques"],
    wordCount: 915,
    poem: "Describe the behavior. Let AI choose the implementation.",
  },
  {
    slug: "patterns/debugging-with-ai.md",
    title: "Debugging with AI",
    summary: "How to use AI tools to find and fix bugs faster. The debugging loop, error message interpretation, systematic bisection with AI assistance.",
    category: "patterns",
    tags: ["debugging", "troubleshooting", "workflow"],
    wordCount: 940,
    poem: "The bug is never where you think it is.",
  },

  // Stacks
  {
    slug: "stacks/solo-saas.md",
    title: "Solo Founder SaaS Stack",
    summary: "The complete stack for one person building a SaaS product. Optimized for speed, low cost, and minimal ops. Every layer chosen and justified.",
    category: "stacks",
    tags: ["SaaS", "solo founder", "full stack"],
    wordCount: 880,
    poem: "One founder. One stack. Ship it.",
  },
  {
    slug: "stacks/ai-app.md",
    title: "AI-Powered App Stack",
    summary: "The stack for building apps with AI features: chatbots, RAG, agents, content generation. Optimized for streaming, cost control, and good UX.",
    category: "stacks",
    tags: ["AI", "LLM", "RAG", "streaming"],
    wordCount: 1140,
    poem: "Intelligence as a feature, not the whole product.",
  },
  {
    slug: "stacks/static-site.md",
    title: "Static Site Stack",
    summary: "For portfolios, landing pages, documentation, blogs. Zero ongoing cost, maximum performance. The simplest path from idea to live URL.",
    category: "stacks",
    tags: ["static", "portfolio", "landing page"],
    wordCount: 737,
    poem: "No server. No database. No excuses.",
  },
  {
    slug: "stacks/api-service.md",
    title: "API Service Stack",
    summary: "For API-first backends, microservices, webhook processors, internal tools. Lightweight, fast, cheap to run. Bun, Hono, and friends.",
    category: "stacks",
    tags: ["API", "backend", "microservices", "Bun"],
    wordCount: 1324,
    poem: "One endpoint. One handler. Deploy.",
  },
  {
    slug: "stacks/paid-micro-services.md",
    title: "Paid Micro-Services on Zo",
    summary: "Blueprint for 3-5 paid micro-services on Zo. Vibe Check, Market Oracle, Copy Doctor, Stack Picker, Domain Namer. Stripe + x402 patterns. Revenue math included.",
    category: "stacks",
    tags: ["Stripe", "monetization", "micro-services", "Zo", "x402"],
    wordCount: 2800,
    poem: "One problem. One API. Stripe payment link. Revenue.",
  },
];

// ─── CometCursor ─────────────────────────────────────────────────────────────
// Comet trail + spinning star at cursor. Big American star appears when cursor stops.
// Works on desktop (mousemove) and mobile (touchstart/touchmove/touchend).

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

      // Comet tail
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

      // Head glow
      const grd = ctx!.createRadialGradient(mx, my, 0, mx, my, 14);
      grd.addColorStop(0, "rgba(255,255,255,0.3)");
      grd.addColorStop(0.4, "rgba(255,200,140,0.1)");
      grd.addColorStop(1, "rgba(255,153,102,0)");
      ctx!.fillStyle = grd; ctx!.beginPath(); ctx!.arc(mx, my, 14, 0, Math.PI * 2); ctx!.fill();

      // Small spinning star at tip
      const rot = n * 0.0012;
      ctx!.save(); ctx!.shadowColor = "rgba(255,255,255,0.6)"; ctx!.shadowBlur = 6;
      drawStar(mx, my, 5, 5, 2, rot);
      ctx!.fillStyle = "rgba(255,255,255,0.85)"; ctx!.fill(); ctx!.restore();

      // Big American star on catch-up
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
    const KW = ["DNS", "MCP", "API", "auth", "edge", "deploy", "vector", "agent", "stack", "infra", "SSL", "CDN"];
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

// ─── MarkdownRenderer ────────────────────────────────────────────────────────
// Lightweight regex-based md→JSX. Handles headers, code blocks, tables, lists,
// bold, italic, links, blockquotes. No external library.

function MarkdownRenderer({ content }: { content: string }) {
  const renderMarkdown = useCallback((md: string) => {
    const elements: React.ReactNode[] = [];
    const lines = md.split("\n");
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks (fenced)
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        elements.push(
          <div key={key++} className="my-4 rounded-lg overflow-hidden">
            {lang && <div className="bg-[#0a0a0a] px-4 py-1.5 text-xs text-[#f0a860]/60 border-b border-[#f0a860]/10">{lang}</div>}
            <pre className="bg-[#0a0a0a] p-4 overflow-x-auto text-xs leading-relaxed">
              <code className="text-[#e0e0e0]">{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Tables
      if (line.includes("|") && line.trim().startsWith("|")) {
        const tableRows: string[] = [];
        while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
          tableRows.push(lines[i]);
          i++;
        }
        if (tableRows.length >= 2) {
          const parseRow = (row: string) =>
            row.split("|").slice(1, -1).map(c => c.trim());
          const headers = parseRow(tableRows[0]);
          // Skip separator row (index 1)
          const dataRows = tableRows.slice(2).map(parseRow);
          elements.push(
            <div key={key++} className="my-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#f0a860]/20">
                    {headers.map((h, j) => (
                      <th key={j} className="text-left text-[#f0a860] font-bold py-2 px-3 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, ri) => (
                    <tr key={ri} className="border-b border-[#f0a860]/8 hover:bg-[#f0a860]/5 transition">
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-2 px-3 text-xs text-[#ccc]">{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Blockquotes
      if (line.startsWith(">")) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith(">")) {
          quoteLines.push(lines[i].replace(/^>\s*/, ""));
          i++;
        }
        elements.push(
          <blockquote key={key++} className="my-4 pl-4 border-l-2 border-[#f0a860]/30 text-[#FFB380] italic text-sm leading-relaxed">
            {quoteLines.map((q, j) => <p key={j} className="mb-1 last:mb-0">{renderInline(q)}</p>)}
          </blockquote>
        );
        continue;
      }

      // Headers
      const hMatch = line.match(/^(#{1,4})\s+(.+)/);
      if (hMatch) {
        const level = hMatch[1].length;
        const text = hMatch[2];
        const hClasses: Record<number, string> = {
          1: "text-2xl font-black text-white mt-8 mb-4",
          2: "text-xl font-bold text-[#f0a860] mt-6 mb-3 pb-2 border-b border-[#f0a860]/15",
          3: "text-base font-bold text-[#f0a860] mt-4 mb-2",
          4: "text-sm font-bold text-white mt-3 mb-1",
        };
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        elements.push(<Tag key={key++} className={hClasses[level]}>{renderInline(text)}</Tag>);
        i++;
        continue;
      }

      // Unordered lists
      if (line.match(/^[-*]\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
          listItems.push(lines[i].replace(/^[-*]\s+/, ""));
          i++;
        }
        elements.push(
          <ul key={key++} className="list-disc pl-6 my-3 space-y-1.5 text-sm text-[#ccc]">
            {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ul>
        );
        continue;
      }

      // Ordered lists
      if (line.match(/^\d+\.\s+/)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
          listItems.push(lines[i].replace(/^\d+\.\s+/, ""));
          i++;
        }
        elements.push(
          <ol key={key++} className="list-decimal pl-6 my-3 space-y-1.5 text-sm text-[#ccc]">
            {listItems.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
          </ol>
        );
        continue;
      }

      // Horizontal rule
      if (line.match(/^---+$/)) {
        elements.push(<hr key={key++} className="my-6 border-[#f0a860]/15" />);
        i++;
        continue;
      }

      // Empty lines
      if (line.trim() === "") {
        i++;
        continue;
      }

      // Paragraph
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("#") && !lines[i].startsWith("```") && !lines[i].startsWith(">") && !lines[i].match(/^[-*]\s+/) && !lines[i].match(/^\d+\.\s+/) && !lines[i].match(/^---+$/) && !(lines[i].includes("|") && lines[i].trim().startsWith("|"))) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        elements.push(
          <p key={key++} className="text-sm text-[#ccc] leading-relaxed my-3">
            {renderInline(paraLines.join(" "))}
          </p>
        );
      }
    }

    return elements;
  }, []);

  return <div>{renderMarkdown(content)}</div>;
}

// Inline rendering: bold, italic, code, links
function renderInline(text: string): React.ReactNode {
  if (!text) return text;

  const parts: React.ReactNode[] = [];
  // Process inline patterns with a single regex pass
  const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`([^`]+?)`)|(\[([^\]]+?)\]\(([^)]+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(<strong key={k++} className="text-white font-bold">{match[2]}</strong>);
    } else if (match[3]) {
      // Italic
      parts.push(<em key={k++} className="italic text-[#FFB380]">{match[4]}</em>);
    } else if (match[5]) {
      // Inline code
      parts.push(<code key={k++} className="bg-[#0a0a0a] px-1.5 py-0.5 rounded text-[#f0a860] text-xs">{match[6]}</code>);
    } else if (match[7]) {
      // Link
      parts.push(
        <a key={k++} href={match[9]} className="text-[#f0a860] no-underline border-b border-[#f0a860]/20 hover:border-[#f0a860] transition" target="_blank" rel="noopener noreferrer">
          {match[8]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

// ─── ArticleCard ─────────────────────────────────────────────────────────────

function ArticleCard({ article, onRead }: { article: Article; onRead: (slug: string) => void }) {
  return (
    <GlassCard className="p-5 cursor-pointer group" >
      <div onClick={() => onRead(article.slug)}>
        <p className="text-[#FFB380] italic text-xs mb-3 leading-relaxed">"{article.poem}"</p>
        <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#f0a860] transition">{article.title}</h3>
        <p className="text-sm text-[#888] leading-relaxed mb-3">{article.summary}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-[#f0a860]/10 text-[#f0a860] border border-[#f0a860]/20 rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#666]">{article.wordCount.toLocaleString()} words</span>
          <span className="text-xs text-[#f0a860] group-hover:translate-x-1 transition-transform">Read &rarr;</span>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── ArticleReader ───────────────────────────────────────────────────────────

function ArticleReader({ slug, onBack }: { slug: string; onBack: () => void }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const article = ARTICLES.find(a => a.slug === slug);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/invisible-architecture?file=${encodeURIComponent(slug)}`)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load article (${r.status})`);
        return r.json();
      })
      .then((data: { content: string }) => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#888] hover:text-[#f0a860] transition mb-6 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
        Back to {article?.category ? TAB_LABELS[article.category] : "articles"}
      </button>

      {loading && (
        <GlassCard className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-[#f0a860]/30 border-t-[#f0a860] rounded-full animate-spin" />
            <span className="text-sm text-[#888]">Loading article...</span>
          </div>
        </GlassCard>
      )}

      {error && (
        <GlassCard className="p-8">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={onBack} className="text-sm text-[#f0a860] mt-2 hover:underline">Go back</button>
        </GlassCard>
      )}

      {content && (
        <GlassCard className="p-6 sm:p-8">
          {article && (
            <div className="mb-6 pb-4 border-b border-[#f0a860]/15">
              <p className="text-[#FFB380] italic text-sm mb-2">"{article.poem}"</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-[#f0a860]/10 text-[#f0a860] border border-[#f0a860]/20 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <MarkdownRenderer content={content} />
        </GlassCard>
      )}
    </div>
  );
}

// ─── EssaySection ────────────────────────────────────────────────────────────

function EssaySection() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <p className="text-[#FFB380] italic text-sm mb-2">"You use the internet every day. But do you know what holds it together?"</p>
        <p className="text-sm text-[#888] leading-relaxed">
          A 13-chapter interactive essay mapping the modern internet. From DNS resolution to edge computing,
          from API design to the protocols that make it all work. Written for vibecoders and anyone curious
          about the invisible infrastructure beneath every click.
        </p>
      </GlassCard>
      <GlassCard className="p-0 overflow-hidden">
        {!loaded && (
          <div className="flex items-center gap-3 p-8">
            <div className="w-4 h-4 border-2 border-[#f0a860]/30 border-t-[#f0a860] rounded-full animate-spin" />
            <span className="text-sm text-[#888]">Loading the essay...</span>
          </div>
        )}
        <iframe
          src="/pages/invisible-architecture.html"
          style={{ width: "100%", height: "85vh", border: "none", display: loaded ? "block" : "none" }}
          title="The Invisible Architecture"
          onLoad={() => setLoaded(true)}
        />
      </GlassCard>
    </div>
  );
}

// ─── ArticleGrid ─────────────────────────────────────────────────────────────

function ArticleGrid({ category }: { category: Tab }) {
  const [reading, setReading] = useState<string | null>(null);
  const articles = ARTICLES.filter(a => a.category === category);

  if (reading) {
    return <ArticleReader slug={reading} onBack={() => setReading(null)} />;
  }

  const categoryDescriptions: Record<string, string> = {
    guides: "Deep-dive guides on vibecoding methodology, tools, and workflows. Start with the Playbook, branch out from there.",
    reference: "Comparison tables and catalogs. Services, providers, frameworks, databases. Kept current, opinionated, with quick-pick recommendations.",
    patterns: "Reusable patterns for AI-assisted development. How to structure projects, write prompts, debug effectively, and set up CLAUDE.md.",
    stacks: "Complete stack blueprints for common project types. Every layer chosen, justified, and costed. Copy, adapt, ship.",
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-5">
        <p className="text-sm text-[#888] leading-relaxed">{categoryDescriptions[category]}</p>
        <p className="text-xs text-[#666] mt-2">{articles.length} articles &middot; {articles.reduce((s, a) => s + a.wordCount, 0).toLocaleString()} words total</p>
      </GlassCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} onRead={setReading} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function InvisibleArchitecture() {
  const [active, setActive] = useState<Tab>("essay");

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <div className="min-h-screen relative" style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace', color: "#e0e0e0", cursor: "crosshair" }}>
        <ConstellationBackground />
        <CometCursor />
        <div className="relative z-10 max-w-[960px] mx-auto px-4 sm:px-6 py-8">

          {/* Navigation bar */}
          <nav className="flex items-center justify-between border-b border-[#f0a860]/15 pb-4 mb-8 flex-wrap gap-4">
            <a href="/" className="text-[#f0a860] font-bold text-sm tracking-wider no-underline">EXHUMAN</a>
            <div className="flex gap-6 text-sm">
              <a href="/" className="text-[#888] no-underline hover:text-[#f0a860] transition">Home</a>
              <a href="/about" className="text-[#888] no-underline hover:text-[#f0a860] transition">About</a>
              <span className="text-[#f0a860]">Invisible Architecture</span>
            </div>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">The Invisible Architecture</h1>
            <p className="text-sm text-[#888] leading-relaxed max-w-2xl">
              A poetic map of the modern internet, expanded into a complete vibecoding knowledge base.
              13-chapter interactive essay, plus 21 guides on stack selection, MCP, agent workflows,
              AI coding tools, and full stack blueprints.
            </p>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-8 border-b border-[#f0a860]/10 pb-4">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded transition-colors ${
                  active === tab
                    ? "bg-[#f0a860] text-[#0a0a0a] font-bold"
                    : "text-[#888] hover:text-[#e0e0e0] hover:bg-[#1e1e1e]/50"
                }`}
              >
                {TAB_LABELS[tab]}
                {tab !== "essay" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {ARTICLES.filter(a => a.category === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[60vh]">
            {active === "essay" && <EssaySection />}
            {active !== "essay" && <ArticleGrid category={active} />}
          </div>

          {/* Footer */}
          <footer className="border-t border-[#f0a860]/15 mt-16 pt-8 text-center text-[#888] text-xs pb-8">
            Built by <a href="https://github.com/exhuman777" className="text-[#f0a860] no-underline">Exhuman</a> on <a href="https://www.zo.computer/" className="text-[#f0a860] no-underline">Zo</a>
          </footer>
        </div>
      </div>
    </>
  );
}
