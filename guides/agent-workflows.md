# Agent Workflows

Multi-agent coordination patterns for AI-assisted development. When one agent isn't enough.

---

## 1. Single Agent Loop

The default. One AI agent, iterative conversation. You prompt, AI executes, you review, repeat.

```
You → prompt → Agent → action → result → review → prompt → ...
```

Claude Code runs this way by default. The agent reads files, writes code, runs tests, all in a single conversation thread. Context accumulates across the session.

**When to use:** 90% of coding tasks. Feature implementation, bug fixes, refactoring, documentation.

**Strengths:** Simple mental model, full context in one thread, easy to course-correct.

**Limits:** One thing at a time. Long-running tasks block the conversation. Context window fills up on large changes.

---

## 2. Parallel Agents

Multiple independent agents working simultaneously on separate tasks. No shared context between them.

```
          ┌→ Agent A (write tests)
You ──────┼→ Agent B (research library)
          └→ Agent C (fix linting)
```

**How to run in Claude Code:**
```bash
# Terminal 1
claude "write unit tests for the auth module"

# Terminal 2
claude "research the best rate limiting library for Hono and summarize options"

# Terminal 3
claude "fix all ESLint warnings in src/"
```

Or use Claude Code's built-in subagent capability with the Task tool, which spawns background agents that report back to the main conversation.

**When to use:**
- Independent tasks that don't depend on each other
- Research alongside implementation
- Running tests while writing new features
- Exploring multiple approaches to the same problem

**Strengths:** Faster throughput, parallel progress, explore multiple directions.

**Limits:** No shared context. Agents may produce conflicting changes. You need to merge/reconcile manually.

---

## 3. Sequential Pipeline

Output of Agent A becomes input for Agent B. Each agent handles one stage.

```
Agent A (plan) → Agent B (implement) → Agent C (test) → Agent D (review)
```

**Example: Feature implementation pipeline**
1. **Planner agent:** Takes a feature description, outputs a technical spec with file changes needed
2. **Implementer agent:** Takes the spec, writes the code
3. **Test agent:** Takes the implementation, writes and runs tests
4. **Review agent:** Takes all outputs, checks for issues, suggests fixes

**How to implement:**
- Manual: Copy output from one Claude Code session into the next
- Scripted: Chain CLI calls with output piping
- Framework: Use LangGraph or similar to define the pipeline

```bash
# Simple scripted pipeline
claude --print "Plan the implementation for feature X" > plan.md
claude --print "Implement this plan: $(cat plan.md)" > implementation.md
claude "Write tests for the changes described in implementation.md"
```

**When to use:** Complex features that benefit from structured phases. When you want each stage reviewed before proceeding.

**Limits:** Slow. Context gets lost between stages. Earlier mistakes compound.

---

## 4. Orchestrator Pattern

One central agent delegates tasks to specialized sub-agents. Like a tech lead assigning work to the team.

```
              Orchestrator
            /      |       \
     Agent A   Agent B   Agent C
    (frontend) (backend)  (tests)
```

The orchestrator:
1. Breaks down the task
2. Assigns subtasks to specialists
3. Collects results
4. Integrates and resolves conflicts
5. Verifies the combined output

**In Claude Code:** The main agent can use the Task tool to spawn subagents for specific subtasks, then synthesize their results.

**In LangGraph:**
```python
# Pseudocode
orchestrator = Agent("Break this feature into subtasks")
frontend = Agent("Implement React components", tools=[file_write])
backend = Agent("Implement API routes", tools=[file_write, db_query])
tester = Agent("Write and run tests", tools=[file_write, shell])

graph = StateGraph()
graph.add_node("plan", orchestrator)
graph.add_node("frontend", frontend)
graph.add_node("backend", backend)
graph.add_node("test", tester)
graph.add_edge("plan", ["frontend", "backend"])  # parallel
graph.add_edge(["frontend", "backend"], "test")   # wait for both
```

**When to use:** Large features touching multiple areas. When different parts need different context or expertise.

**Limits:** Complex to set up. Orchestrator can become a bottleneck. Sub-agents may make conflicting assumptions.

---

## 5. Review Loop

Generate + review cycle. One agent writes, another reviews. Iterate until quality bar is met.

```
Writer → code → Reviewer → feedback → Writer → revised code → Reviewer → approved
```

**Simple implementation:**
```bash
# Writer generates
claude --print "Implement user authentication with JWT" > auth.ts

# Reviewer checks
claude --print "Review this code for security issues, edge cases, and best practices: $(cat auth.ts)" > review.md

# Writer fixes
claude "Apply these review comments to auth.ts: $(cat review.md)"
```

**Why separate agents?** Fresh context. The reviewer hasn't seen the implementation process, so it evaluates the output without bias toward the approach taken. Similar to why code reviews work: fresh eyes catch what the author misses.

**When to use:** Security-sensitive code. When you want a second opinion but don't have a human reviewer available.

**Limits:** Can loop forever if quality bar is unclear. Reviewer may suggest changes that break things the writer handled intentionally.

---

## 6. Practical Patterns

### Claude Code Patterns

**Background test runner:**
Run tests in a separate agent while you keep working in the main session.
```bash
# Main session: keep coding
claude "implement the payment webhook handler"

# Background: run tests continuously (separate terminal)
claude "run the test suite, fix any failures, run again until all pass"
```

**Explore agent:**
Spawn a research agent to investigate while you implement.
```bash
# Research (background)
claude "explore how Stripe handles idempotency keys in webhook retries, summarize in explore-results.md"

# Implement (foreground, use results when ready)
claude "implement webhook handler using the approach in explore-results.md"
```

**Plan agent:**
Get an architecture plan before implementing.
```bash
claude --print "plan the database schema and API routes for a blog with comments, tags, and draft support" > plan.md
# Review plan.md yourself, then:
claude "implement the plan in plan.md"
```

### LangGraph Patterns

Define agent workflows as state machines. Good for repeatable, complex pipelines.

```python
from langgraph.graph import StateGraph, END

def should_continue(state):
    if state["tests_pass"]:
        return END
    if state["iterations"] > 3:
        return END
    return "fix"

graph = StateGraph()
graph.add_node("implement", implement_agent)
graph.add_node("test", test_agent)
graph.add_node("fix", fix_agent)
graph.add_edge("implement", "test")
graph.add_conditional_edges("test", should_continue)
graph.add_edge("fix", "test")
```

### CrewAI Patterns

Define crews with roles. Good for content and research workflows.

```python
from crewai import Agent, Task, Crew

researcher = Agent(role="Researcher", goal="Find best practices")
writer = Agent(role="Writer", goal="Write clean code")
reviewer = Agent(role="Reviewer", goal="Catch bugs and issues")

crew = Crew(
    agents=[researcher, writer, reviewer],
    tasks=[research_task, write_task, review_task],
    process=Process.sequential
)
```

---

## 7. When to Use Multi-Agent

### Single agent handles:
- Feature implementation (even large ones)
- Bug fixes
- Refactoring
- Writing tests
- Documentation
- Code review
- Most daily development work

### Multi-agent helps with:
- **Large refactors:** Split by module, agents work in parallel
- **Research + implementation:** One agent researches while another codes
- **CI/CD pipelines:** Automated test, lint, review stages
- **Exploration:** Try multiple approaches simultaneously, pick the best
- **Code generation at scale:** Generate similar code for many entities (API endpoints, DB models)
- **Cross-cutting changes:** Update tests while updating implementation

### The decision rule:
If a single agent can finish the task in one session with context to spare, use one agent. Add agents only when the task naturally splits into independent pieces or distinct phases.

---

## 8. Anti-Patterns

### Over-orchestration
Using 5 agents for a task one agent handles in 10 minutes. The coordination overhead exceeds the time saved. Start simple, add agents only when you hit a real limit.

### Infinite review loops
Agent A writes code. Agent B reviews and requests changes. Agent A revises. Agent B finds new issues. Repeat forever. **Fix:** Set a maximum iteration count. After 3 rounds, a human decides.

### Context loss between agents
Each agent starts fresh. Information from Agent A's investigation doesn't transfer to Agent B automatically unless you explicitly pass it. **Fix:** Write intermediate results to files. Use structured handoff documents.

### Conflicting changes
Two parallel agents edit the same file. Merge conflicts, or worse, one overwrites the other. **Fix:** Assign clear file ownership. Use git branches per agent. Or serialize changes to shared files.

### Agent echo chamber
Agents reviewing agents, all trained on similar data, reinforcing the same biases. The review agent won't catch systematic errors the writer agent makes. **Fix:** Use different models for writer vs reviewer. Or better, have a human review the final output.

### Premature automation
Building a complex multi-agent pipeline before validating the task works with manual orchestration. **Fix:** Run the workflow manually 3 times first. Automate only after the pattern stabilizes.

---

## Quick Reference

| Pattern | Agents | Best For |
|---------|--------|----------|
| Single Loop | 1 | Daily development (90% of tasks) |
| Parallel | 2-5 | Independent tasks, research + code |
| Sequential | 2-4 | Phased workflows, plan → implement → test |
| Orchestrator | 3-5+ | Large features, multiple areas |
| Review Loop | 2 | Security-critical, quality gates |

Start with one agent. Add more only when you feel the bottleneck.
