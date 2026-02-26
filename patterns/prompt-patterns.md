# Prompt Patterns for Code

Practical patterns for getting better code output from AI. Not theory, just what works.

## Core Principle: Behavior Over Implementation

Bad prompts describe *how*. Good prompts describe *what* and *why*.

```
# Bad
"Use a map to iterate over the array and filter items"

# Good
"Create a function that takes an array of users and returns
only those with active subscriptions, sorted by signup date"
```

The AI knows how to implement things. Your job: define the behavior clearly.

## Pattern 1: Context-First

Always point the AI at existing code before asking for changes.

```
Read src/lib/auth.ts and src/middleware/auth.ts first.
Then add a function that checks if a user has admin role.
Follow the same patterns used in the existing auth code.
```

Why: the AI matches the style, imports, and patterns already established. Without context, it invents its own conventions.

## Pattern 2: Scaffold-Then-Fill

For larger features, break into two steps.

**Step 1: Structure**
```
Create the file structure for a notifications system:
- Database schema (Drizzle)
- API routes (list, mark read, delete)
- Zod schemas for validation
- Type definitions

Create the files with function signatures and types,
but use TODO comments for implementation bodies.
```

**Step 2: Implement**
```
Now implement the notification creation logic in
src/routes/notifications.ts. The create handler should
validate input, store in DB, and return the new notification.
```

Smaller, focused prompts produce better code than "build me a full notification system."

## Pattern 3: Refactor

```
Refactor src/lib/database.ts to use the repository pattern.
Keep all existing behavior identical.
Each table gets its own repository file in src/repositories/.
Show me what changes before making them.
```

Key phrases:
- "Keep behavior identical" prevents the AI from changing functionality
- "Show me what changes" lets you review before applying

## Pattern 4: Test-First

```
Write tests for a UserService class with these behaviors:
- createUser: validates email uniqueness, hashes password, stores in DB
- getUser: returns user by ID, throws NotFoundError if missing
- updateUser: partial updates, validates email if changed
- deleteUser: soft delete (sets deletedAt), doesn't remove row

Use Vitest. Mock the database layer.
```

Then:
```
Now implement UserService to pass all the tests you just wrote.
```

Forces the AI to think about edge cases before writing implementation.

## Pattern 5: Review

```
Review src/routes/payments.ts for:
1. Security issues (injection, auth bypass, data exposure)
2. Error handling gaps (unhandled promises, missing try/catch)
3. Race conditions
4. Input validation holes

For each issue, explain the risk and show the fix.
```

Specific review criteria produce specific feedback. "Review this code" produces generic comments.

## Pattern 6: Explain-Then-Improve

```
Explain what src/lib/cache.ts does, function by function.
Then suggest three concrete improvements with code examples.
```

Useful for unfamiliar codebases. The explanation reveals whether the AI understands the code correctly before you trust its suggestions.

## Pattern 7: Migration

```
Migrate src/api/users.js from Express to Hono.
Keep the same route paths and response shapes.
Update middleware to use Hono's middleware pattern.
List any Express-specific features that need alternatives.
```

"Keep the same X" constrains the AI from reimagining your API.

## Pattern 8: Debugging

```
This test fails:
[paste test + error output]

The relevant code: src/services/billing.ts lines 45-80.
What's the most likely cause? Show the fix.
```

Error + location + specific ask = fast answers.

## Anti-patterns

### "Make it better"

Better how? Faster? More readable? More type-safe? Be specific:

```
# Vague
"Improve this code"

# Specific
"Reduce the number of database queries in this function
from 3 to 1 using a JOIN"
```

### "Fix all the bugs"

The AI doesn't know what's a bug vs. intended behavior without context:

```
# Vague
"Fix the bugs in this file"

# Specific
"Users report that password reset emails arrive with an
expired token. The token is generated in src/lib/tokens.ts
and validated in src/routes/auth.ts. Find where the
expiration time gets set incorrectly."
```

### One Giant Prompt

Asking for an entire feature in one prompt degrades quality. Break large tasks into steps:

1. Design the database schema
2. Create the API routes (signatures only)
3. Implement each route one at a time
4. Add validation
5. Write tests

Each step uses the output of the previous step as context.

### Trusting Blindly

Always read the generated code. Run the tests. Check the imports. AI makes confident mistakes. Common failure modes:

- Importing packages you haven't installed
- Using API methods that don't exist
- Generating plausible but wrong business logic
- Missing error handling

## Context Window Tips

**Reference files by path.** Instead of pasting 200 lines of code into a prompt:

```
Read src/lib/stripe.ts, then add a function to
create a subscription checkout session.
```

Claude Code reads the file itself. Cleaner, more accurate.

**One concern per prompt.** Trying to add auth + payments + email in one prompt leads to half-baked implementations of all three.

**Reset when confused.** If the AI starts generating nonsense or going in circles, start a fresh conversation. Stale context accumulates errors.

**Use follow-ups.** First prompt gets the structure right. Follow-up prompts refine details:

```
# Prompt 1
Create a webhook handler for Stripe events.

# Prompt 2
Add handling for invoice.payment_failed events.
When payment fails, update the user's subscription
status to 'past_due' in the database.

# Prompt 3
Add idempotency checking using the event ID to prevent
duplicate processing.
```

Each follow-up builds on solid ground instead of asking for everything at once.
