# Claude Code and agent standards: state as of 13 Nov 2026

A dated snapshot of how Claude Code packages skills, subagents, hooks, plugins, memory, permissions, scheduling, headless runs and MCP, plus where the open standards (AGENTS.md, Agent Skills) stand and which other agent platforms read the same files.

Every statement below was read on the vendor's own page on 13 Nov 2026. `[UNCONFIRMED]` means the page did not state it or did not load. No prices here: see https://claude.com/pricing.

Claude Code version on that day: 2.1.323, released 12 Nov 2026 ([changelog](https://code.claude.com/docs/en/changelog)).

## Skills

Source: https://code.claude.com/docs/en/skills

- A skill is a folder with a `SKILL.md`. All frontmatter fields are optional; `description` is the recommended one.
- Fields include `name`, `description`, `when_to_use`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `model`, `effort`, `context` (`fork`), `paths`, `shell`.
- `description` plus `when_to_use` is truncated at 1,536 characters in the skill listing. Keep `SKILL.md` under 500 lines (a recommendation).
- Locations: `~/.claude/skills/<name>/`, `.claude/skills/<name>/`, and `skills/<name>/` inside a plugin. A skill takes precedence over a `.claude/commands/` file with the same name. The older `commands/` format still works.
- Substitutions: `$ARGUMENTS`, `$N`, `${CLAUDE_SKILL_DIR}`, `${CLAUDE_SESSION_ID}`; in plugins also `${CLAUDE_PLUGIN_ROOT}` and `${CLAUDE_PLUGIN_DATA}`.

## Subagents

Source: https://code.claude.com/docs/en/sub-agents

- Required frontmatter: `name`, `description`. Optional: `tools`, `disallowedTools`, `model` (`sonnet`, `opus`, `haiku`, `fable`, a full ID, or `inherit`), `permissionMode`, `maxTurns`, `skills`, `memory`, `isolation` (`worktree`), `effort`.
- Locations by priority: managed settings, the `--agents` flag, `.claude/agents/`, `~/.claude/agents/`, a plugin's `agents/`.
- Subagents shipped in a plugin ignore `hooks`, `mcpServers` and `permissionMode`. Put hooks in the plugin's `hooks/hooks.json` instead.

## Hooks

Sources: https://code.claude.com/docs/en/hooks, https://code.claude.com/docs/en/hooks-guide

- The format is the same in `settings.json` and in a plugin's `hooks/hooks.json`. Hooks from settings, managed policy and plugins are merged.
- Command hooks: exit code 0 passes; exit code 2 blocks and sends stderr to the model (on events that can block); other non-zero codes do not block unless `onFailure: "block"` is set.
- `onFailure` (`"continue"` or `"block"`) needs Claude Code 2.1.295 or later. Without it, a guard hook that crashes or times out lets the operation through.
- Input arrives as JSON on stdin: `session_id`, `cwd`, `hook_event_name`, and for tool events `tool_name` and `tool_input`.
- Hook types: `command`, `http`, `mcp_tool`, `prompt`, `agent` (experimental).

Practical consequence: an instruction in a memory file is context, not a block. A hard rule ("never force-push", "never send mail") belongs in a permission `deny` rule or a `PreToolUse` hook, with a negative test.

## Plugins and marketplaces

Sources: https://code.claude.com/docs/en/plugins/manifest-reference, https://code.claude.com/docs/en/plugins/create-marketplace, https://code.claude.com/docs/en/plugins/cli-reference

- Layout: manifest at `.claude-plugin/plugin.json`; everything else at the plugin root: `skills/`, `agents/`, `commands/`, `hooks/hooks.json`, `.mcp.json`.
- The only required manifest field is `name`. `version` pins the installed version, so bump it or updates will not be picked up.
- A `CLAUDE.md` at the plugin root is not loaded as context. Use a skill.
- Marketplace: `.claude-plugin/marketplace.json` with `name`, `owner.name` and `plugins[]` (`name`, `source`).
- Commands: `claude plugin marketplace add <owner>/<repo>` (or a local path), `claude plugin install <plugin>@<marketplace> --scope user|project|local`, `claude plugin validate <path>`.
- Plugin skills and commands are namespaced: `/plugin-name:skill`.
- Authentication for a marketplace in a private repository: `[UNCONFIRMED]` (the hosting page returned 404 on the day).

## Memory

Source: https://code.claude.com/docs/en/memory

- `CLAUDE.md` is loaded from the working directory and its ancestors; `~/.claude/CLAUDE.md` applies to all projects. Imports use `@path`, up to four hops. Under 200 lines per file is recommended.
- `.claude/rules/*.md` can be scoped to file globs with `paths:`.
- Auto memory lives in `~/.claude/projects/<project>/memory/`; the first 200 lines or 25 KB of `MEMORY.md` are loaded. It is local to one machine. Disable with `autoMemoryEnabled: false`.
- When Claude Code reads `AGENTS.md` on its own: `[UNCONFIRMED]` in this reading. A one-line `CLAUDE.md` containing `@AGENTS.md` works regardless; see [`patterns/claude-md.md`](../patterns/claude-md.md).

## Permissions and sandboxing

Sources: https://code.claude.com/docs/en/permissions, https://code.claude.com/docs/en/sandboxing

- Rule order is deny, then ask, then allow. An allow rule cannot carve an exception out of a deny rule.
- Modes: `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`.
- The sandbox exists on macOS, Linux and WSL2, is off by default, and is not available on native Windows.

## Scheduling and headless runs

Sources: https://code.claude.com/docs/en/scheduled-tasks, https://code.claude.com/docs/en/routines, https://code.claude.com/docs/en/headless

- `/loop` runs inside an open session and expires after seven days.
- Desktop scheduled tasks run locally and need the computer on. Cloud routines run on a fresh clone of the repository without local files.
- `claude -p "<prompt>"` with `--output-format text|json|stream-json`. `--bare` skips hooks, skills, plugins, MCP and `CLAUDE.md`, and requires `ANTHROPIC_API_KEY`. In `--bare` runs, file-based rules and guard hooks do not apply.

## Installation

Source: https://code.claude.com/docs/en/setup

- macOS 13.0+, Windows 10 1809+, Ubuntu 20.04+, Debian 10+.
- macOS, Linux, WSL: `curl -fsSL https://claude.ai/install.sh | bash`. Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`.
- The native installer does not need Node.js. Git for Windows is recommended on Windows.
- `claude doctor` diagnoses an installation; `claude update` updates it.

## MCP

Sources: https://code.claude.com/docs/en/mcp, https://modelcontextprotocol.io/specification/latest

- `claude mcp add --transport http <name> <url>`; stdio servers via `claude mcp add <name> -- <command>`. Scopes: `local`, `project` (`.mcp.json`, committed), `user`.
- The specification's "latest" page points to schema `2026-07-28`. Publication date: `[UNCONFIRMED]`.

## Open standards and who reads them

### AGENTS.md

Source: https://agents.md/

- Plain Markdown, no required fields. The closest `AGENTS.md` to the edited file wins; an explicit user prompt overrides everything.
- Stewarded by the Agentic AI Foundation under the Linux Foundation.
- Listed as supporting it: Codex, Jules, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin, UiPath (Autopilot and Coded Agents), Junie, Amp, Cursor, RooCode, Gemini CLI, Kilo Code, Phoenix, Semgrep, GitHub Copilot coding agent, Ona, Windsurf, Augment Code.
- Two tools need pointing at the file: Aider (`read: AGENTS.md` in `.aider.conf.yml`) and Gemini CLI (`{"context": {"fileName": "AGENTS.md"}}` in `.gemini/settings.json`).

### Agent Skills

Source: https://agentskills.io/

- A folder with `SKILL.md` (`name`, `description`, instructions) and optional `scripts/`, `references/`, `assets/`. Loaded progressively.

### Other platforms reading the same files

| Platform | AGENTS.md | SKILL.md folders | Tool-call hooks | Source |
|---|---|---|---|---|
| Hermes Agent | project instructions file (per the superpowers reference mapping) | `~/.hermes/skills/`, `skills.external_dirs`, `<project>/.hermes/skills/`, `<project>/.agents/skills/` after `hermes skills trust`; docs state compatibility with agentskills.io | `[UNCONFIRMED]` | https://hermes-agent.nousresearch.com/docs/user-guide/features/skills, https://github.com/obra/superpowers |
| Abacus AI Desktop (CLI, VS Code, app) | loads `~/.abacusai/AGENTS.md`, the git root `AGENTS.md` and the open folder's `AGENTS.md`; shared 40,000-character budget | `<project>/.abacusai/skills/`, `<project>/.agents/skills/`, `~/.abacusai/skills/`, `~/.agents/skills/`; `.claude/skills` is not searched | `PreToolUse` and others; exit code 2 blocks | https://abacus.ai/help/abacusai-desktop/agents-md, https://abacus.ai/help/abacusai-desktop/skills, https://abacus.ai/help/abacusai-desktop/hooks |

A `<project>/.agents/skills/` directory is therefore read by at least two platforms besides the ones that follow Claude Code's own layout. The rows above are a reading of documentation, not a test.

## What this means for a builder

1. Keep instructions in `AGENTS.md` and make `CLAUDE.md` a one-line import. The rules then travel to any tool that reads the standard.
2. Keep logic in plain scripts and let hooks only call them. A guard that reads JSON on stdin and exits 2 can be tested from a terminal and re-wired on another platform.
3. Treat memory as files that go stale. Anything that must survive a machine or be shared belongs in the repository, not in tool-local memory.
4. Pin a minimum tool version where behaviour depends on it (`onFailure` needs 2.1.295).

## Not confirmed on the day

- Authentication for private-repository marketplaces.
- The exact rule for when Claude Code reads `AGENTS.md` without a `CLAUDE.md`.
- Full settings-file precedence (the settings page did not load).
- MCP specification publication date.
- The full list of Agent Skills clients.
