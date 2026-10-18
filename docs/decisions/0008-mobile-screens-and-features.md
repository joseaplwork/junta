# 0008: Mobile screens and features

- **Status:** accepted
- **Date:** 2026-10-18

## Context

The participant app ([ADR 0006](0006-react-native-mobile-app.md)) already
uses thin Expo Router routes, independent screens and feature folders with
typed clients in `shared/api`. Agents still invent layout, skip i18n keys or
call `apiRequest` from a screen. Admin avoids that with a generator and lint
([ADR 0004](0004-admin-pages-and-features.md)); mobile had only prose and a
dead canonical example.

## Decision

- Keep the route / screen / feature layout. A route in `src/app/` only sets
  navigation options and renders a screen. Screens never import each other;
  code two screens need moves to `shared/`.
- HTTP goes only through typed clients in `shared/api`. Routes and screens
  cannot call `fetch` or import `api-client`; they use resource clients such
  as `meApi`.
- User-visible text comes from `t('...')`. Keys are added to `locales/es.ts`
  first; other locales share the `Translations` type.
- Features use function components with explicit return types, named exports,
  kebab-case files and `StyleSheet.create`.
- New screens come from `@junta/nx-plugin:mobile-screen`. Generators never
  overwrite existing code. The canonical example is `src/screens/my-juntas/`.
- Protected routes live under `src/app/juntas/`, whose layout requires a
  signed-in session. Tokens stay in `shared/auth` (`expo-secure-store`).

## Consequences

- Cross-screen imports, direct `fetch`, direct `api-client` imports and
  `expo-secure-store` outside `shared/auth` fail lint.
- The mobile-screen generator and its snapshot tests produce the structure.
- The Generators CI job scaffolds a sample mobile screen and runs mobile
  lint, typecheck, test and build.
- Skills (`implement-spec`, `new-mobile-screen`) require the generator instead
  of hand-copying a screen folder.
