# Invisible Architecture Design System

The complete aesthetic reference for all Exhuman / Invisible Architecture pages.

---

## Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#0a0a0a` | Page background, code block background |
| `--text` | `#e0e0e0` | Body text |
| `--text-muted` | `#888888` | Secondary text, descriptions |
| `--text-dim` | `#555555` | Tertiary text, footer |
| `--accent` | `#f0a860` | Primary accent. Headings, links, tags, active tabs, borders |
| `--accent-warm` | `#FFB380` | Poems, quotes, warm highlights |
| `--accent-glow` | `rgba(240,168,96,0.15)` | Border glow on hover |
| `--card-bg` | `#1e1e1e` | Card background (at 70% opacity with backdrop-blur) |
| `--card-border` | `rgba(240,168,96,0.15)` | Card border default |
| `--card-border-hover` | `rgba(240,168,96,0.30)` | Card border on hover |

### Orange Scale (accent variations)

```
#f0a860      100%  — primary accent
#f0a860/60   60%   — code block language labels
#f0a860/20   20%   — borders, separators
#f0a860/15   15%   — subtle borders, card outlines
#f0a860/10   10%   — tag backgrounds, hover fills
#f0a860/8    8%    — table row borders
#f0a860/5    5%    — table row hover
```

### Constellation Background RGB

```
R: 240, G: 153, B: 66  (#f09942 equivalent)
```

Used in canvas rendering for nodes, keywords, connections, packets, rings.

---

## Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Body | JetBrains Mono | 400 | 14px (base) |
| Headings | JetBrains Mono | 700 | varies |
| Code | JetBrains Mono | 400 | 12px (xs) |
| Essay body | Instrument Serif | 400 | 1rem |
| Essay headings | JetBrains Mono | 700 | varies |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

Essay additionally loads:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```

---

## Components

### GlassCard

```
bg-[#1e1e1e]/70 backdrop-blur-xl border border-[#f0a860]/15 rounded-lg
hover: border-[#f0a860]/30
transition-colors
```

### Tab Navigation

Active tab:
```
bg-[#f0a860] text-[#0a0a0a] font-bold
```

Inactive tab:
```
text-[#888] hover:text-[#e0e0e0] hover:bg-[#1e1e1e]/50
```

All tabs:
```
px-3 py-1.5 text-xs sm:text-sm rounded transition-colors
```

### Tags

```
bg-[#f0a860]/10 text-[#f0a860] border border-[#f0a860]/20
px-2 py-0.5 rounded text-[10px]
```

### Code Blocks

```
bg-[#0a0a0a] p-4 overflow-x-auto text-xs leading-relaxed rounded-lg
```

Language label:
```
bg-[#0a0a0a] px-4 py-1.5 text-xs text-[#f0a860]/60 border-b border-[#f0a860]/10
```

### Poems / Quotes

```
italic text-[#FFB380] text-sm mb-4
```

---

## Cursor

### Crosshair Base

All pages use `cursor: crosshair` on the body/root element.

### Comet Cursor Effect

Canvas overlay at `z-index: 9999`, `pointer-events: none`.

**Behavior:**
1. Mouse/touch movement creates a comet trail (35-point buffer, 700ms fade)
2. Small spinning 5-point star always at cursor tip (white, 5px outer radius)
3. When cursor stops (>120ms idle or speed < 1.5), a big American star appears
4. Star burst animation: scale 0 -> 1 (1 second burst) -> 0.45 (idle resting)
5. Smooth lerp: fast expand (0.1), slower shrink (0.04)

**Comet tail colors (gradient along trail):**
```
Head:   rgba(255, 230, 140, 0.7)  — warm white-orange
Tail:   rgba(255, 130, 40, 0.7)   — deep orange
Glow:   same colors at 0.12 opacity, 5x line width
```

**Star colors:**
```
Tip star:    rgba(255,255,255,0.85) with rgba(255,255,255,0.6) shadow blur 6
Big star:    white center -> warm edge gradient
  Center:    rgba(255,255,255,1)
  Mid:       rgba(255,240,220,0.95)
  Edge:      rgba(255,200,140,0.8)
Burst glow:  rgba(255,220,160,0.25) -> rgba(255,180,100,0.06) -> transparent
```

**Touch support:**
- `touchstart`: set initial position
- `touchmove`: feed into same pointer input as mousemove
- `touchend`: reset speed to 0 (triggers star catch-up)
- All listeners use `{ passive: true }`

---

## Backgrounds

### ConstellationBackground (Canvas)

Fixed position, z-index 0, `pointer-events: none`.

**Elements:**
1. **Floating keywords** (50 items): DNS, MCP, API, auth, edge, deploy, vector, agent, stack, infra, SSL, CDN. Fall downward at 0.2-0.7 speed. JetBrains Mono 10-13px. Opacity 0.02-0.05.
2. **Network nodes** (35 items): Small dots (1.5-3px radius) drifting at 0.35 speed. Parallax via z-depth (0.3-1.0).
3. **Connections**: Lines between nodes within 200px. Opacity scales with distance and z-depth. 0.5px width.
4. **Data packets** (8 items): Larger dots (3px) traveling along node connections. Speed 0.003-0.008.
5. **Center pulse**: Radial gradient breathing at 0.8Hz. Orange at 3% + sine wave.
6. **Expanding rings**: Spawn every 3 seconds near center. Expand to 80-200px. Fade at 0.995 rate.
7. **Scanlines**: Horizontal lines every 4px at 3% opacity. CRT effect.
8. **Vignette**: Radial gradient darkening edges by 40%.

### Page Background

```css
background: #0a0a0a;
```

### Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
```

---

## Layout

- Max content width: `960px` (max-w-[960px])
- Horizontal padding: `16px` mobile, `24px` desktop (px-4 sm:px-6)
- Vertical padding: `32px` (py-8)
- Card grid: `grid-cols-1 md:grid-cols-2 gap-4`
- Footer: `border-t border-[#f0a860]/15 mt-16 pt-8`

---

## Animation Patterns

### Transitions

```
transition-colors  — most interactive elements
transition-all duration-300  — cards with transform
```

### Loading States

```
animate-pulse  — skeleton loaders
animate-spin   — spinner icons
```

### Hover Effects

Cards: border opacity 0.15 -> 0.30
Tags: no additional hover
Tabs: text color #888 -> #e0e0e0, background transparent -> #1e1e1e/50

---

## Essay-Specific (index.html)

### CSS Custom Properties

```css
--bg:          #0a0a0f
--surface:     #111117
--surface-2:   #1a1a22
--border:      #2a2a35
--text:        #e0e0e6
--text-dim:    #888892
--orange-50 to --orange-950: full orange scale
--font-mono:   'JetBrains Mono', monospace
--font-serif:  'Instrument Serif', serif
```

### Token System (essay visual elements)

```css
.token { font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 3px;
         text-transform: uppercase; padding: 0.15rem 0.7rem;
         border: 1px solid var(--orange-800);
         background: color-mix(in oklch, var(--orange-900) 15%, transparent);
         color: var(--orange-400); display: inline-block; }
```

### Flow Diagrams (essay)

```css
.flow { display: flex; gap: 0.3rem; flex-wrap: wrap; align-items: center;
        padding: 1rem; background: var(--surface);
        border: 1px solid var(--border); }
.flow-step { font-size: 0.65rem; padding: 0.2rem 0.6rem;
             border: 1px solid var(--orange-800);
             background: color-mix(in oklch, var(--orange-900) 10%, transparent);
             color: var(--orange-300); }
.flow-arrow { color: var(--orange-700); font-size: 0.7rem; }
```

---

## File Inventory

| File | Purpose | Size |
|------|---------|------|
| `page.tsx` | Knowledge base hub (5 tabs, 21 articles) | ~870 lines |
| `registry-page.tsx` | Agentic registry (submit + browse) | ~750 lines |
| `index.html` | Original 13-chapter essay | 105KB |
| `agentic-internet.html` | Agentic internet visual page | 28KB |

All share the same design system. Essay uses CSS custom properties. TSX pages use Tailwind utility classes mapping to the same values.
