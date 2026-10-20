# ADR Format

ADRs live in `docs/decisions/` and use sequential numbering: `0001-slug.md`, `0002-slug.md`, and so on. The index is `docs/decisions/README.md`.

Do not create `docs/adr/`. Copy the shape of an existing record, including a row in the index.

## Template

```md
# 0009: Short title of the decision

- **Status:** accepted
- **Date:** YYYY-MM-DD

## Context

What was true, and why a decision was needed.

## Decision

What was chosen.

## Consequences

What the choice costs or removes.
```

Add `**Supersedes:**` under the date when a later record replaces part of an earlier one, and update the earlier record's status so it points forward. Leave the original context in place.

## Numbering

Scan `docs/decisions/` for the highest existing number and increment by one. Add a row to the table in `docs/decisions/README.md`.

## When to offer an ADR

All three of these must be true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful
2. **Surprising without context**: a future reader will look at the code and wonder "why on earth did they do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you picked one for specific reasons

If a decision is easy to reverse, skip it. If it's not surprising, nobody will wonder why. If there was no real alternative, there's nothing to record beyond "we did the obvious thing."

`AGENTS.md` also requires an ADR when you introduce a convention, a dependency, or a structural change, and the convention needs an enforcer in the same change.

### What qualifies

- **Architectural shape.** "Two shared libraries instead of a layered stack."
- **Technology choices that carry lock-in.** Database, auth, the mobile stack. Not every library: just the ones that would take a quarter to swap out.
- **Deliberate deviations from the obvious path.** Anything a reasonable reader would assume the opposite of.
- **Constraints not visible in the code.**
- **Rejected alternatives when the rejection is non-obvious.**
