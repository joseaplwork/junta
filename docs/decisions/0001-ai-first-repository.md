# 0001: AI-first repository

- **Status:** accepted
- **Date:** 2026-10-17

## Context

Most code in this repository is written by agents, mainly Claude Code and
Cursor, under human review. An earlier attempt relied on long prose rules that
were duplicated across Cursor, Copilot and Claude folders. The copies drifted
apart, several rules contradicted the code, and nothing checked them. A second
attempt generated context documents from the code. Those documents only
restated what an agent can read for itself in seconds.

## Decision

1. **Enforce, don't describe.** A convention exists only if a tool enforces it:
   a type, a lint rule, a generator, a test, a guard or a hook. `AGENTS.md`
   lists each rule with its enforcer.
2. **Generate recurring shapes.** Resources and CRUD pages come from
   `@junta/nx-plugin` generators. Snapshot tests guard the templates, and a CI
   job builds, tests and e2e-tests a freshly generated resource.
3. **One instruction source.** `AGENTS.md` at the root and in each app is
   canonical. `CLAUDE.md` files import them. Skills live once, in
   `.claude/skills/`, which both Claude Code and Cursor read.
4. **One definition of verified.** `tools/scripts/verify.mjs` backs
   `npm run verify`, the agent stop hooks and CI.
5. **Specs as hand-off.** Features start as files in `docs/specs/`, so planning
   and implementation can happen in different sessions or tools.
6. **Canonical examples.** The participants resource and the participant page
   are the reference implementations. The generator templates mirror them.

## Consequences

- Removed `.cursor/rules`, `.cursor/skills`, `.github/skills`,
  `.github/instructions`, `docs/ai` and the `nx sync` context generator.
- Agents get fast, mechanical feedback from lint, typecheck and tests instead
  of relying on remembered rules.
- Changing a convention means changing its enforcer and the templates. That
  cost is deliberate.
