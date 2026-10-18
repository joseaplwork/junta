# Mobile app (React Native + Expo)

The app for participants on iOS and Android, built with React Native and Expo
SDK 58 ([ADR 0006](../../docs/decisions/0006-react-native-mobile-app.md)). What
it should do is in [spec 003](../../docs/specs/003-participant-mobile-app.md).
The canonical example is `src/screens/home/`.

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

On a phone, install Expo Go and scan the QR code the dev server prints. The
phone must be on the same Wi-Fi as the API.

## Layout

```text
apps/mobile/
  app.json                  name, bundle ids, plugins (native config lives here)
  src/
    app/                    Expo Router routes: every file is a route; keep them thin
      _layout.tsx           root navigator
      index.tsx             sets the header and renders a screen
    screens/<screen>/
      <screen>-screen.tsx   composes the features of one screen
      <name>-feature/       one feature: state, effects and its UI
    shared/
      api/                  one typed client per API resource, plus apiGet
      config/               API URL resolution
```

## Rules

- **Routes are thin.** A file in `src/app/` sets navigation options and renders
  a screen. Logic goes in screens and features.
- **Screens are independent.** A screen never imports another screen; lint
  fails. Code two screens need moves to `shared/`.
- **HTTP only through `shared/api` clients.** Routes and screens cannot call
  `fetch`; lint fails. Clients return Promises of contract types.
- **Components** are function components with explicit return types, named
  exports, kebab-case file names and `StyleSheet.create` styles. Hooks follow
  the rules of hooks; `react-hooks/exhaustive-deps` is an error.
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
- **Sign-in:** participants cannot sign in yet. Do not add auth before spec 003
  is `ready`.

## Tests

- Jest with the `jest-expo` preset and React Native Testing Library. See
  `status-feature.spec.tsx` and `health-api.spec.ts`.
- `render` and `fireEvent` are async: always `await` them. Use `findBy*` for
  results of asynchronous work.
