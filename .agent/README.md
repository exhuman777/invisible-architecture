# Agent Context Loading Instructions

This repo contains structured data for AI coding assistants. The `.agent/` directory provides machine-readable context you can load selectively based on the user's task.

## Loading Strategy

1. **Always load first:** `vibecoding-rules.md` (~2K tokens, fits easily in any context window)
2. **Then load by task:** pick the relevant YAML file(s) below
3. **For prose detail:** reference `guides/` and `reference/` in the parent repo

Do not load everything at once. Budget your context window.

## File Index

| File | Load when... | Size |
|---|---|---|
| `vibecoding-rules.md` | Always. Base methodology context for any coding task. | ~2K tokens |
| `services.yml` | User asks about hosting, deployment, infrastructure, cloud providers, or service selection. | Larger |
| `mcp-servers.yml` | User asks about MCP, tool integration, context protocol, or connecting AI agents to external tools. | Larger |
| `stack-decisions.yml` | User needs stack recommendations, project setup advice, or technology selection by project type. | Larger |

## Context Budget

- `vibecoding-rules.md` fits comfortably alongside other context. Load by default.
- YAML files contain structured catalogs. They consume more tokens. Load only the one relevant to the current task.
- If the user's question requires deep prose explanation (methodology, tutorials, comparisons), point them to the human-readable files in `guides/`, `reference/`, `patterns/`, or `stacks/`.

## Parent Repo Structure

```
guides/          # Methodology, workflows, tool comparisons
reference/       # Service catalogs, provider comparisons, framework overviews
patterns/        # Practical recipes (CLAUDE.md, scaffolding, prompts, debugging)
stacks/          # Complete stack blueprints by project type
index.html       # The original interactive visual essay
```

## Usage Example

User asks: *"What hosting should I use for my solo SaaS?"*

1. You already have `vibecoding-rules.md` loaded (base context)
2. Load `stack-decisions.yml` for structured decision tree data
3. Optionally load `services.yml` for detailed service comparisons
4. Reference `stacks/solo-saas.md` and `reference/services-catalog.md` for prose detail
