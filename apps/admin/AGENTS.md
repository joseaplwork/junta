# Admin app (Angular 20)

The canonical example is `src/app/pages/participant/`. When unsure, copy its
shape. Create CRUD pages with the generator, after the API resource exists:

```sh
npx nx g @junta/nx-plugin:admin-crud-page <name> --fields="<spec>" --no-interactive
```

## Layout

```text
src/app/
  routes.ts                lazy routes; route params bind to page inputs
  app-config.ts            providers: zoneless, router, http + auth interceptor
  guards/                  authGuard, guestGuard, permissionGuard(permission)
  interceptors/            authInterceptor: bearer token, one refresh retry
  directives/              *jaHasPermission
  layouts/main-layout/     shell, sidebar, session-expired watcher
  shared/
    api/                   one typed client per API resource, plus ApiClient
    components/crud/       data table, dialog shell, delete dialog
    components/            confirm dialog
    services/              session, profile, tokens, navigation, dialog, snackbar
    pipes/                 money
    forms/                 date input helpers
  pages/<page>/
    <page>-page.ts|html    composes the features and provides <Page>PageState
    <page>-page-state.ts   signals the features use to talk to each other
    components/            UI shared by several features of this page
    constants/             constants shared by several features of this page
    <name>-feat/
      <name>-feat.ts|html  container: injects clients and state, handles events
      components/          UI used only by this feature
```

## Rules

- **Pages are independent.** Never import from another page; lint fails. Code
  two pages need moves to `shared/`.
- **HTTP only through `shared/api` clients.** Pages cannot import
  `@angular/common/http`. Clients return Promises of contract types, with no
  mapping layer.
- **Components** are standalone and OnPush, use `ja-` selectors
  (`ja-<page>-<name>-feat` for features), signal `input()` and `output()`,
  and `inject()`. Private members start with `_`. Templates live in `.html`
  files, except empty listener features.
- **State** is signals. Features talk only through the page state: one feature
  sets a request signal, the handling feature reads it and resets it to `null`.
- **Dialogs** export a `<Name>DialogData` interface. `handleSubmit` resolves
  `true` when saved, which closes the dialog, and `false` otherwise, which
  keeps the user's input. The feature handler catches errors and shows the
  snackbar.
- **Forms** use `inject(FormBuilder).nonNullable` typed reactive forms and
  submit `getRawValue()` mapped to the contract request.
- **Templates** use `@if` and `@for`, give every `<button>` a `type` and
  self-close empty elements. Lint enforces all three.
- **Navigation** goes through `shared/services/navigation.ts`.
- **Money** uses the `money` pipe or `formatMoney` with the junta's currency
  (`amount | money: junta.currency`). Amounts are whole units.
- **Dates** from the API are ISO strings. For `<input type="date">` use
  `shared/forms/date-input.ts`.
- **Routes** are lazy (`loadComponent`) and guarded with
  `permissionGuard(Permission.X_READ)`. The sidebar entry uses the same
  permission.

## Tests

- **Components**: Testing Library with collaborators mocked through
  providers. See `participant-form-dialog.spec.ts` and `list-feat.spec.ts`.
- **API clients**: `HttpTestingController`. See `participants-api.spec.ts`.
- **Zoneless**: asynchronous updates need `findBy*` queries, not `getBy*`.
