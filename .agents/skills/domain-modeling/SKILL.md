---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing docs/domain.md, or recording or editing an ADR in docs/decisions/.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the _active_ discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely _reading_ `docs/domain.md` for vocabulary is not this skill: that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

Read `docs/agents/domain.md` first. This repo is single-context.

## File structure

```
/
├── docs/
│   ├── domain.md                      ← glossary, business rules, scenarios
│   └── decisions/
│       ├── README.md
│       ├── 0001-ai-first-repository.md
│       └── ...
├── apps/
└── libs/
```

Do not create `GLOSSARY.md`, `GLOSSARY-MAP.md`, or `docs/adr/`. Terms go in the Glossary table of `docs/domain.md`. Decisions go in `docs/decisions/`.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `docs/domain.md`, call it out immediately. "The glossary defines 'account' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Account or the Participant? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts. Prefer extending the Scenarios section of `docs/domain.md` when a scenario becomes a standing example.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "The code does X, but you just said Y. Which is right?"

### Update the glossary inline

When a term is resolved, update the Glossary table in `docs/domain.md` right there. Don't batch these up: capture them as they happen. Use the format in [GLOSSARY-FORMAT.md](./GLOSSARY-FORMAT.md).

The glossary table is vocabulary plus the code name that already exists for the term. Business rules stay in the rules table (`BR-xx`). Do not treat `docs/domain.md` as a scratch pad for implementation decisions that belong in an ADR.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful
2. **Surprising without context**: a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md). A new convention still needs its enforcer, as `AGENTS.md` requires.
