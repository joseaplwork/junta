# Mobile app (Ionic + Capacitor)

The app for participants on iOS and Android: Angular 20 with Ionic 9
components, packaged by Capacitor 8 ([ADR 0006](../../docs/decisions/0006-hybrid-mobile-app.md)).
What it should do is in [spec 003](../../docs/specs/003-participant-mobile-app.md).
The canonical example is `src/app/pages/home/`.

## Commands

| Goal                                               | Command                                                        |
| -------------------------------------------------- | -------------------------------------------------------------- |
| Run in the browser at http://localhost:4300        | `npm run start:mobile` (proxies `/api` to the local API)       |
| Add a native platform, once the app id is decided  | `npx nx run @junta/mobile:cap-add --platform=ios` or `android` |
| Copy the latest web build into the native projects | `npx nx run @junta/mobile:cap-sync`                            |
| Open the native project in Xcode or Android Studio | `npx nx run @junta/mobile:cap-open --platform=ios`             |
| Build, sync and run on a simulator or device       | `npx nx run @junta/mobile:cap-run --platform=android`          |

## Layout

```text
src/app/
  routes.ts                lazy routes; route params bind to page inputs
  app-config.ts            providers: zoneless, Ionic, Ionic route strategy, router, http
  shared/api/              one typed client per API resource, plus ApiClient
  pages/<page>/
    <page>-page.ts|html    ion-header plus ion-content, composes the features
    <page>-page-state.ts   signals shared by features, once two features need it
    <name>-feat/
      <name>-feat.ts|html  container: injects clients, holds its state in signals
      components/          UI used only by this feature
```

## Rules

- **Pages are independent.** Never import from another page; lint fails. Code
  two pages need moves to `shared/`.
- **HTTP only through `shared/api` clients.** Pages cannot import
  `@angular/common/http`. Clients return Promises of contract types.
- **Components** are standalone and OnPush, use `jm-` selectors
  (`jm-<page>-<name>-feat` for features), signal `input()` and `output()`, and
  `inject()`. Private members start with `_`.
- **Ionic components** are imported one by one from `@ionic/angular`, which is
  the Ionic 9 path. Never import `IonicModule` or `@ionic/angular/standalone`.
- **Every routed page** renders `ion-header` and `ion-content`, so Ionic
  transitions and safe areas work.
- **Zoneless:** state that changes after an `await`, including overlay
  results, goes through signals.
- **Icons** are registered with `addIcons()` from `ionicons` in the component
  that uses them.
- **Styling** uses Ionic's CSS variables and utility classes such as
  `ion-padding`. No Tailwind or Angular Material in this app.
- **API URL:** browser development uses the proxy. Native and production
  builds use `apiUrl` in `src/environments/environment.ts`. Never add native
  origins to the API's `CORS_ORIGIN`; spec 003 decides how native builds call
  the API.
- **Native code:** configure native behavior through `capacitor.config.ts` or
  plugins. Edit `ios/` or `android/` only for what Capacitor cannot express,
  and say so in your report. Ask before anything that ships to the stores.
- **Sign-in:** participants cannot sign in yet. Do not add auth before spec 003
  is `ready`.

## Tests

- **Components**: Testing Library with collaborators mocked through providers.
  See `status-feat.spec.ts`. Ionic components render in jsdom.
- **API clients**: `HttpTestingController`. See `health-api.spec.ts`.
- **Zoneless**: asynchronous updates need `findBy*` queries, not `getBy*`.
