# 0004: Admin pages and features

- **Status:** accepted
- **Date:** 2026-10-17

## Context

The admin app already organized each page into feature folders (`list-feat`,
`create-feat`, ...) that talk through a page-level signal state. HTTP code was
spread over sixteen feature services, some duplicated, each with its own
mapping. One page imported another page's service. Inputs mixed decorators and
signals, and some state was plain fields that zoneless change detection never
re-rendered.

## Decision

- Keep the page and feature structure. Features never import each other or
  other pages; they communicate through `<Page>PageState`.
- Replace the per-feature HTTP services with one typed client per API resource
  in `shared/api`. Clients return contract types, so no mapping layer remains.
- Standardize components: standalone, OnPush, signal inputs and outputs,
  `inject()`, `ja-` selectors. Lint enforces all of it.
- Lazy-load every page and the layout. The initial bundle dropped from about
  1 MB to about 330 kB.
- Dialogs keep the user's input when saving fails: `handleSubmit` resolves a
  boolean and the dialog closes only on `true`.

## Consequences

- Cross-page imports and direct `HttpClient` use fail lint. The cross-page
  rule is a custom rule in `tools/eslint-rules`.
- The CRUD page generator produces this exact structure, so new pages match.
