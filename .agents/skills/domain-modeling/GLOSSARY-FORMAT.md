# Domain glossary format

The glossary is the table under `## Glossary` in `docs/domain.md`. Do not create a root `GLOSSARY.md`.

## Row shape

| Term  | Meaning                                                      | In code                         |
| ----- | ------------------------------------------------------------ | ------------------------------- |
| Junta | One savings cycle with a start date, an end date and a pool. | `Junta` entity, `JuntaResponse` |

- **Term** is the canonical word. One concept, one term.
- **Meaning** is one or two sentences: what it is, not a design essay. When another word is tempting, name it in the meaning ("not the login"). Do not add a new column.
- **In code** names the type, function, or column that already exists. Leave it empty only when the term has no code yet, and say so.

## Rules

- **Be opinionated.** When multiple words exist for the same concept, keep the term already in the table.
- **Keep definitions tight.** Match the length of the existing rows.
- **Only include terms specific to this project.** General programming concepts do not belong.
- **Business rules are not glossary rows.** A rule that can be violated gets a `BR-xx` id in the business-rules table, a test named after that id, and a citation in the code.
- **This repo is single-context.** One `docs/domain.md`. No `GLOSSARY-MAP.md`.
