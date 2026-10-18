# Mobile app (React Native + Expo)

The app for participants on iOS and Android, built with React Native and Expo
SDK 58 ([ADR 0006](../../docs/decisions/0006-react-native-mobile-app.md),
[ADR 0008](../../docs/decisions/0008-mobile-screens-and-features.md)). What it
should do is in [spec 003](../../docs/specs/003-participant-mobile-app.md).
The canonical example is `src/screens/my-juntas/`.

Create screens with the generator. Never copy a screen folder by hand:

```sh
npx nx g @junta/nx-plugin:mobile-screen <name> \
  --feature=<feature> \
  --route=<expo-route> \
  --protected \
  --no-interactive
```

`--feature` and `--route` default to `<name>`. `--protected` places the route
under `app/juntas/` behind the session layout.

Expo changes between SDK releases, so do not code Expo or React Native APIs
from memory. Check the `expo` major version in `package.json` and read the
matching docs at `https://docs.expo.dev/versions/v<major>.0.0/` or the index at
https://docs.expo.dev/llms.txt.

## Commands

| Goal                                          | Command                                        |
| --------------------------------------------- | ---------------------------------------------- |
| Start the dev server, then scan the QR code   | `npm run start:mobile`                         |
| Open in the iOS simulator or Android emulator | `npx nx run @junta/mobile:ios` or `:android`   |
| Check the bundle builds for both platforms    | `npx nx build @junta/mobile`                   |
| Diagnose dependency and config problems       | `npx nx run @junta/mobile:doctor`              |
| Add a library at the SDK-compatible version   | `cd apps/mobile && npx expo install <package>` |
| New screen (route + feature + i18n + test)    | `npx nx g @junta/nx-plugin:mobile-screen …`    |

On a phone, install Expo Go and scan the QR code the dev server prints. The
phone must be on the same Wi-Fi as the API.

## Layout

```text
apps/mobile/
  app.json                  name, bundle ids, plugins (native config lives here)
  src/
    app/                    Expo Router routes: every file is a route; keep them thin
      _layout.tsx           root navigator
      juntas/               protected routes; layout redirects when signed out
    screens/<screen>/
      <screen>-screen.tsx   composes the features of one screen
      <name>-feature/       one feature: state, effects and its UI
    shared/
      api/                  one typed client per API resource, plus apiRequest
      auth/                 session provider, keychain token store
      components/           shared UI (ui.tsx) and connection status
      config/               API URL resolution
      format/               money and dates in the user's language
      i18n/                 translations: locales/es.ts is the source
```

## Rules

Each rule names what enforces it. Never weaken an enforcer to get green.

- **Generate screens.** New screens come from `mobile-screen`. [generator,
  convention-reviewer]
- **Routes are thin.** A file in `src/app/` sets navigation options and renders
  a screen. Logic goes in screens and features. [generator templates]
- **Screens are independent.** A screen never imports another screen. Code two
  screens need moves to `shared/`. [lint: @nx/workspace-no-cross-page-imports]
- **HTTP only through `shared/api` clients.** Routes and screens cannot call
  `fetch` or import `api-client`. Clients return Promises of contract types.
  [lint: no-restricted-globals, no-restricted-imports]
- **Keychain only in `shared/auth`.** `expo-secure-store` stays out of screens.
  [lint: no-restricted-imports]
- **Components** are function components with explicit return types, named
  exports, kebab-case file names and `StyleSheet.create` styles. Hooks follow
  the rules of hooks. [lint: react-hooks/exhaustive-deps, typecheck; templates]
- **Libraries** are added with `npx expo install`, which picks versions that
  match the SDK. Prefer Expo modules over third-party ones.
- **Native projects** (`ios/`, `android/`) are generated and git-ignored. Never
  edit them; configure native behavior in `app.json` and config plugins. A
  library with native code needs a development build instead of Expo Go.
- **API URL:** `EXPO_PUBLIC_API_URL` when set; in development, port 3000 on
  the machine running the dev server; otherwise the production URL in
  `src/shared/config/api-url.ts`.
- **Store releases** go through EAS (`npx eas-cli@latest build`, `submit`).
  Ask the owner before anything that ships to the stores.
- **Text** always comes from `t('...')`. Add keys to `locales/es.ts` first;
  other locales must have the same keys, which the `Translations` type checks.
  [typecheck; generator stubs keys]
- **Session:** screens read it with `useSession()`. Tokens live only in
  `tokenStore`, backed by `expo-secure-store`. Calls that need a signed-in
  participant pass `auth: true`; the client refreshes once on a 401.
- **Protected routes** live under `src/app/juntas/`, whose layout redirects to
  sign-in when there is no session. Wait for `status === 'loading'` before
  mounting protected content.

## Tests

- Jest with the `jest-expo` preset and React Native Testing Library. See
  `junta-list-feature.spec.tsx` and `api-client.spec.ts`.
- `render` and `fireEvent` are async: always `await` them. Use `findBy*` or
  `waitFor` for results of asynchronous work.
