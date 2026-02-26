# The Vibecoding Playbook

The core methodology for programming with AI. Everything you need to start vibecoding effectively.

---

## 1. What Vibecoding Is

Andrej Karpathy coined the term in early 2024. The idea: you describe what you want in natural language, AI writes the code, you review and iterate.

This does NOT mean "no-code." You still need to understand what the code does. You still read every line. You still make architectural decisions. The difference: you spend time thinking about *what* to build instead of remembering syntax.

**You are the architect. AI is the builder.**

The skill shift looks like this:
- Old: "How do I write a recursive function to traverse this tree?"
- New: "I need a function that traverses this tree depth-first, collecting all leaf nodes that match a predicate."

Same outcome, different input. You describe behavior, AI handles implementation.

**Who vibecoding works for:**
- Developers who want to move faster
- Technical founders building MVPs
- Designers who understand logic but not syntax
- Anyone who can describe what software should do clearly

**Who it doesn't work for (yet):**
- People who can't tell if code is correct
- Projects requiring novel algorithms nobody has written before
- Safety-critical systems where every line needs formal verification

---

## 2. Philosophy

**"Describe the what, let AI handle the how."**

Core principles:

**Taste over typing.** Your value as a developer shifts from writing code to evaluating code. Can you look at a function and know if the approach is right? Can you spot when AI chose a naive O(n^2) solution where O(n) exists? That judgment matters more than typing speed.

**Understanding over memorization.** You don't need to memorize API signatures. You need to understand HTTP status codes, database indexing, auth flows, race conditions. Concepts stay, syntax gets generated.

**Iteration over perfection.** First prompt rarely produces perfect code. The skill lies in knowing *how to refine*. "This works but the error handling is too broad, catch specific exceptions" beats "rewrite this better."

**Context is everything.** AI writes better code when it knows your project structure, conventions, and constraints. Investing time in context files (CLAUDE.md, .cursorrules) pays off on every prompt.

**Trust but verify.** AI generates plausible code. Plausible does not mean correct. Read the output. Run the tests. Check edge cases. The moment you stop reading, bugs slip in.

**Ownership stays with you.** AI-generated code is your code. You ship it, you maintain it, you debug it at 3am. Review it like you wrote it, because your name is on the commit.

---

## 3. Setting Up Your Environment

### CLAUDE.md / .cursorrules

Every project needs a context file that tells AI how you work. This file captures your conventions, preferred patterns, and project-specific rules.

For Claude Code: create `CLAUDE.md` in your project root.
For Cursor: create `.cursorrules` in your project root.

What to include:
```markdown
# Project: MyApp

## Tech Stack
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Supabase (auth + database)
- Tailwind CSS + shadcn/ui

## Conventions
- Use server components by default, client only when needed
- All API routes in app/api/ with route.ts files
- Database queries through Supabase client, never raw SQL in components
- Error handling: always return typed responses, never throw in API routes

## File Structure
- app/ - Next.js pages and layouts
- components/ - React components (ui/ for shadcn, features/ for domain)
- lib/ - Utilities, database client, shared helpers
- types/ - TypeScript type definitions

## Testing
- Vitest for unit tests
- Playwright for E2E
- Test files colocated: thing.ts → thing.test.ts
```

See `patterns/claude-md.md` for detailed patterns and examples.

### MCP Servers

Model Context Protocol servers let your AI assistant interact with external tools. Common setup:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}
```

This lets AI read your files, manage GitHub issues, query databases, all without copy-pasting context.

### Project Structure

AI works best with predictable structure. Conventions that help:

- **Flat over nested.** `components/Button.tsx` beats `components/atoms/ui/buttons/primary/Button.tsx`
- **Colocate related files.** Keep tests, types, and styles near the code they relate to
- **Descriptive naming.** `createUser.ts` beats `utils.ts`. AI (and you) can find things faster
- **Index files for exports.** Help AI understand your public API surface

### Git Workflow

Commit often when vibecoding. Each working state is a checkpoint you can revert to.

```
prompt → generate → review → test → commit → next prompt
```

Small commits let you:
- Revert a bad generation without losing other work
- Track which prompts produced which code
- Use `git diff` to review what AI changed

---

## 4. The Vibecoding Loop

### Step 1: Prompt

Be specific about behavior, not implementation.

**Bad prompt:**
> "Create a React component with useState and useEffect that fetches data"

**Good prompt:**
> "Create a user profile page that loads user data on mount, shows a skeleton while loading, displays name/email/avatar when loaded, and shows an error message with retry button if the fetch fails"

The good prompt describes *what the user sees*, not *what React hooks to use*. AI knows the hooks. You know the product.

**Prompting tips:**
- Start with the user story: "As a user, I want to..."
- Specify edge cases: "If the API returns 404, show 'User not found'"
- Mention constraints: "Must work without JavaScript for initial render"
- Reference existing code: "Follow the same pattern as components/Dashboard.tsx"

### Step 2: Generate

Let AI write. Don't interrupt mid-generation unless you spot a fundamental misunderstanding.

If using Claude Code, the agent will often:
- Read existing files for context
- Generate code matching your project style
- Create or update multiple files
- Run tests to verify

If using Cursor, you'll get inline suggestions or chat-generated code blocks to accept.

### Step 3: Review

**Read every line.** This matters.

Check for:
- **Correctness:** Does the logic actually do what you asked?
- **Security:** SQL injection? XSS? Exposed secrets? Auth bypasses?
- **Performance:** Unnecessary re-renders? N+1 queries? Missing indexes?
- **Edge cases:** Empty state? Error state? Loading state? Null values?
- **Style:** Does it match your project conventions?

Common AI mistakes to watch for:
- Hallucinated imports (packages that don't exist)
- Outdated API usage (old library versions)
- Over-engineering simple problems
- Missing error handling on async operations
- Hardcoded values that should be configurable

### Step 4: Iterate

Refine with follow-up prompts. Be specific about what to change.

**Bad iteration:**
> "This doesn't work, fix it"

**Good iteration:**
> "The loading state works but the error retry button doesn't clear the previous error message. Also, add a 3-second timeout to the fetch."

Each iteration should address a specific issue. Multiple small refinements beat one vague "make it better."

### Step 5: Commit

Save the working state before making the next change.

```bash
git add -A && git commit -m "add user profile page with loading/error states"
```

Now you can safely move to the next feature knowing you can revert.

---

## 5. Working With Different Tools

### Claude Code
Terminal-native AI agent. Best for greenfield projects, large refactors, multi-file changes. Runs commands, reads files, creates entire project structures. Agent mode means it plans and executes multi-step tasks autonomously.

**Strengths:** Deep context understanding, multi-file edits, can run tests, MCP support, subagents for parallel work.
**Best when:** Starting new projects, refactoring across many files, terminal-first workflow.

### Cursor
VS Code fork with AI built in. Tab completion (fast, inline), chat sidebar (deeper), and Composer (multi-file). The IDE integration means AI sees your open files, errors, terminal output.

**Strengths:** Fast tab completion, visual diff review, IDE integration, familiar VS Code experience.
**Best when:** Working on existing codebases, editing specific files, visual workflow.

### GitHub Copilot
The original AI coding assistant. Inline completion in your editor. Agent mode (VS Code) handles multi-step tasks. Workspace agent understands your repo structure.

**Strengths:** Broad IDE support, workspace understanding, integrated with GitHub ecosystem.
**Best when:** Already in VS Code, want lightweight inline help, GitHub-heavy workflow.

### Bolt / Lovable / v0
Browser-based tools for rapid prototyping. You describe a UI, they generate it with live preview. Less control over implementation details, more speed for visual output.

**Strengths:** Instant visual feedback, no local setup, great for mockups and MVPs.
**Best when:** Prototyping UI quickly, showing stakeholders, non-technical users building simple apps.

### Replit Agent
Full-stack development in the browser with instant deployment. Agent v3 handles entire project setup, coding, and shipping. Built-in hosting means zero DevOps.

**Strengths:** Zero setup, instant deploy, full-stack in browser, good for learning.
**Best when:** Quick prototypes that need to be live immediately, hackathons.

### Windsurf
Cursor alternative with Cascade, a flow-based system for multi-file edits. Maintains context across a chain of related changes.

**Strengths:** Cascade multi-file flow, competitive pricing, strong context retention.
**Best when:** Multi-file edits, Cursor alternative at lower price.

---

## 6. When to Vibecode vs Hand-Code

### Vibecode These
- **Boilerplate:** CRUD endpoints, form components, database migrations
- **Standard patterns:** Auth flows, API routes, data fetching hooks
- **UI components:** Buttons, modals, tables, forms, layouts
- **Tests:** Unit tests, integration tests, E2E test scaffolds
- **Documentation:** README files, API docs, inline comments
- **Config files:** ESLint, Tailwind, TypeScript configs
- **Type definitions:** Interfaces, schemas, validation
- **Styling:** CSS/Tailwind implementations from designs

### Hand-Code These
- **Performance-critical paths:** Hot loops, real-time processing, custom data structures
- **Novel algorithms:** Anything you can't find on Stack Overflow
- **Security-sensitive code:** Auth logic, encryption, access control, payment processing
- **Core business logic:** The unique thing that makes your product valuable
- **Complex state machines:** Where correctness matters more than speed of writing
- **Integration edge cases:** Where you need deep understanding of third-party behavior

### The Gray Zone
Some tasks benefit from AI-assisted writing with heavy manual review:
- Database schema design (AI drafts, you verify relationships and indexes)
- API design (AI generates OpenAPI spec, you review contracts)
- Architecture decisions (AI suggests patterns, you evaluate tradeoffs)

---

## 7. Scaling: Solo to Team

### Solo Developer + AI
The simplest setup. Your CLAUDE.md captures your conventions. You talk to AI, AI writes code, you review and ship.

Key practices:
- Keep CLAUDE.md updated as conventions evolve
- Commit frequently so you can revert AI mistakes
- Write tests, AI-generated code needs validation just like yours
- Maintain a RESUME.md or session notes so AI context persists

### Team with AI
Multiple developers, each using AI tools. New challenges emerge.

**Shared conventions file.** The CLAUDE.md / .cursorrules file goes in the repo. Everyone's AI follows the same rules. PR reviews catch deviations.

**PR reviews still matter.** AI-generated code needs the same review rigor as human code. Maybe more, because AI produces plausible-looking bugs that pass a casual glance. Reviewers should verify logic, not just style.

**Knowledge distribution.** When AI writes most of your code, make sure team members actually understand the codebase. Rotate who reviews what. Pair on complex features. Don't let "AI wrote it" become an excuse for not understanding it.

### Pitfalls at Scale

**AI-generated code debt.** AI often generates "good enough" code that works but isn't maintainable. Over time, this accumulates. Schedule refactoring sessions. Use AI to help refactor what AI originally wrote.

**Over-reliance.** If you can't write a basic function without AI, you've gone too far. AI tools go down. APIs change. Models get worse at specific tasks. Keep your fundamental skills sharp.

**Context window limits.** Large codebases exceed what AI can hold in context. Structure your project so AI can work on isolated modules. Good architecture means good AI-assisted development.

**Losing understanding.** The biggest risk. You accept AI output without fully understanding it. Weeks later, something breaks, and nobody knows how it works. Fight this actively. Read the code. Add comments explaining *why*, not *what*. Maintain architecture docs.

---

## Quick Reference

```
1. Write good context files (CLAUDE.md, .cursorrules)
2. Describe behavior, not implementation
3. Review every line of generated code
4. Commit after each working change
5. Hand-code what matters most
6. Keep your fundamentals sharp
```

The best vibecoders aren't the ones who prompt fastest. They're the ones who know exactly what to ask for, and can tell if they got it.
