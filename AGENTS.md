# AGENTS.md: The Invisible Architecture

Instructions for AI agents working on this repo (standard https://agents.md; `CLAUDE.md` = `@AGENTS.md`). Human docs: `README.md`.

## What this is
A knowledge base for vibecoders: the interactive essay (`index.html`, 13 chapters), guides, reference, patterns and stacks in English, machine-readable context in `.agent/`, and the Polish edition in `pl/`.

## Source of truth
- `pl/` is an export of the live Polish section https://tukamil.com/niewidzialna-architektura/. Its source is `marketing/strona-kamila/niewidzialna-architektura/` (`dane.cjs`, `tresci/*.md`, `zbuduj.cjs`) in the repo that hosts tukamil.com. Change the source there first, rebuild, then copy each `<slug>/index.md` here without its first comment line and with the closing `Wersja na stronie: <url>` line.
- English files are the original from 27.02.2026 and stay as they are, except `patterns/claude-md.md` (AGENTS.md section, 10.11.2026). Note such exceptions in `pl/README.md`.

## Rules
- Facts about tools, models, limits and prices only from official pages, with a link. No prices: link to the pricing page.
- Every new file needs a line in the file map in `README.md`.
- Concise, technical, no fluff. Polish texts: no long dashes, no slogans.
- No secrets, no personal data.
