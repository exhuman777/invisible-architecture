# Debugging with AI

How to use AI tools to find and fix bugs faster. Not a replacement for understanding your code, but a powerful multiplier.

## The Debugging Loop

Same loop humans use, augmented with AI at each step.

### 1. Reproduce

Describe the bug precisely. Vague descriptions get vague answers.

```
# Bad
"The app crashes sometimes"

# Good
"POST /api/invoices returns 500 when the line_items array
contains more than 50 items. Works fine with fewer items.
Error: 'PayloadTooLargeError: request entity too large'"
```

### 2. Share Context

Copy the full error, not just the message.

```
Error: Cannot read properties of undefined (reading 'id')
    at getUser (src/lib/auth.ts:42:18)
    at handler (src/routes/users.ts:15:24)
    at async dispatch (node_modules/hono/dist/compose.js:29:23)
```

Include:
- Full error message + stack trace
- What you expected to happen
- What actually happened
- The command or action that triggered it
- Relevant environment (Node version, OS, browser)

### 3. Hypothesize

Ask the AI for causes, not fixes. This matters.

```
Given this error and stack trace, what are the 3 most likely
causes? Don't suggest fixes yet, just explain what could
be happening.
```

Why: jumping to fixes skips understanding. The AI might fix a symptom, not the root cause.

### 4. Fix

Once you agree on the cause, ask for the fix.

```
The issue is that getUser() receives null when the session
cookie is expired. Fix getUser() to handle this case and
return a 401 response instead of crashing.
```

### 5. Verify

Run the test suite. Check manually. Confirm the fix works *and* didn't break anything else.

```
Run the test suite and check if any tests fail after this change.
Also write a new test that covers the expired session case.
```

## Sharing Error Context: Templates

### Runtime Error

```
I'm getting this error when [action]:

[full error + stack trace]

Relevant files:
- src/routes/invoices.ts (the handler)
- src/lib/db.ts (the query)

Expected: [what should happen]
Actual: [what happens instead]
```

### Test Failure

```
This test fails:

[test name + file path]

Test output:
[full test output including assertion error]

The implementation: src/services/billing.ts

The test passed before [commit/change description].
```

### CI/CD Failure

```
Tests pass locally but fail in CI.

CI log:
[relevant portion of CI log]

My local env: Node 22, macOS
CI env: Node 22, Ubuntu

git diff between last passing CI run and this one:
[diff or PR link]
```

## Common Debugging Prompts

**The Specific Error:**
```
I'm getting "TypeError: fetch failed" in src/lib/api.ts:23.
The request works in the browser but fails in the server
component. What's happening?
```

**The Regression:**
```
This feature worked before commit abc123. Here's the diff
that commit introduced: [diff]. Which change broke the
invoice calculation?
```

**The Flaky Test:**
```
This test passes 80% of the time and fails 20%.
[test code]
What non-deterministic behavior could cause this?
```

**The Performance Bug:**
```
This API endpoint takes 3 seconds. The DB query takes 50ms
(checked). What else in this handler could be slow?
[handler code]
```

## AI Debugging Strengths

**Pattern matching.** The AI has seen millions of error messages. "Cannot read properties of undefined" triggers immediate recognition of null reference patterns, optional chaining fixes, guard clauses.

**Reading large codebases.** Point the AI at 10 files and ask "where does the data flow break?" Humans lose track. The AI traces call chains methodically.

**Suggesting multiple hypotheses.** Humans anchor on the first plausible cause. The AI can list five possible causes ranked by likelihood.

**Knowing framework quirks.** "This works in Pages Router but not App Router" gets an instant answer about server vs. client component differences.

## AI Debugging Weaknesses

**No runtime access.** The AI can't run your code, inspect variables, or check the actual state of your database. You need to provide that information.

**Hallucinated causes.** For unfamiliar or novel bugs, the AI generates plausible but wrong explanations. Verify every hypothesis before acting on it.

**Missing runtime state.** The AI sees code, not execution. Race conditions, environment-specific bugs, and state-dependent issues require you to share runtime information (logs, variable values, timing).

**Overconfidence.** The AI rarely says "I don't know." Watch for confident explanations that don't match the evidence.

## Pro Tips

### Strategic console.log

Before asking the AI, add targeted logging:

```typescript
console.log('user:', JSON.stringify(user));
console.log('input:', JSON.stringify(req.body));
console.log('query result:', JSON.stringify(result));
```

Share the output with the AI. Runtime values + code = faster diagnosis.

### Git Diff Method

```
The bug appeared after this PR was merged.
Here's the diff: [git diff main..feature-branch]
Which change most likely introduced the issue?
```

The AI scans diffs fast and spots risky changes humans overlook.

### Add Logging Before Fixing

```
Before fixing this bug, add structured error logging to
src/routes/payments.ts so we can catch similar issues
in production. Use our existing logger from src/lib/logger.ts.
```

Fix the observability gap first. Then fix the bug. You'll catch the next one faster.

### Binary Search with Git

```bash
# Find the commit that introduced the bug
git bisect start
git bisect bad          # current commit is broken
git bisect good abc123  # this commit was working
# git bisect will checkout commits for you to test
```

Share the bisect result with the AI: "The bug was introduced in commit xyz789. Here's what that commit changed: [diff]."

### Rubber Duck with AI

Sometimes explaining the bug to the AI surfaces the answer in your own head. The act of structuring the problem for a clear prompt often reveals the solution before the AI even responds.

Worth the effort. Write the full prompt anyway. If you don't solve it yourself, the AI gets a well-structured question.
