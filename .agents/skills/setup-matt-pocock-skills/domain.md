# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`docs/domain.md`**: what a junta is, the glossary, the business rules (`BR-xx`), and the open product questions (`Q-xx`). This is the domain vocabulary. There is no root `GLOSSARY.md`.
- **`docs/decisions/`**: architecture decision records. Read the records that touch the area you are about to work in. There is no `docs/adr/` directory. The index is `docs/decisions/README.md`.

This is a single-context repo. Do not look for `GLOSSARY-MAP.md` or per-app glossaries.

If a term or decision you need is not written down yet, proceed. The domain-modeling skill writes glossary rows and ADRs when terms or decisions actually get resolved. New ADRs go in `docs/decisions/`, numbered in order, copying the format of an existing record, with a row in the index. New domain terms go in the Glossary table in `docs/domain.md`.

## File structure

```
/
├── docs/
│   ├── domain.md
│   └── decisions/
│       ├── README.md
│       └── 0001-ai-first-repository.md
├── apps/
└── libs/
```

## Use the domain vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `docs/domain.md`. Don't drift to synonyms that file explicitly avoids.

If the concept you need isn't in `docs/domain.md` yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for domain modeling).

## Flag ADR conflicts

If your output contradicts an existing ADR in `docs/decisions/`, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0005 (migrations), but worth reopening because…_
