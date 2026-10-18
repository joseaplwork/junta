---
name: new-mobile-screen
description: Add a mobile Expo Router screen with its feature, i18n stubs and RNTL test by running the repository generator. Use when the user wants a new participant app screen.
argument-hint: '<screen name, optional feature/route/protected>'
---

# New mobile screen

The request is in the arguments or in the user's message: $ARGUMENTS

## Steps

1. Choose a kebab-case screen name (`payout-history`). Ask whether the route
   is protected (under `/juntas`) and whether the feature or route name
   differs from the screen name.
2. Check that `apps/mobile/src/screens/<name>/` and the target route file do
   not already exist.
3. Generate:

   ```sh
   npx nx g @junta/nx-plugin:mobile-screen <name> \
     --feature=<feature> \
     --route=<route> \
     --protected \
     --no-interactive
   ```

   Omit `--feature` / `--route` when they match `<name>`. Omit `--protected`
   for public routes (sign-in style).

4. Replace the stub `load` in the feature with a typed client from
   `shared/api`. Do not import `api-client` or call `fetch` from the screen.
   Add a new client file beside `me-api.ts` when no client fits.
5. Expand `locales/es.ts` first, then `en.ts`, keeping the same keys
   (`Translations` enforces parity).
6. Adjust the generated RNTL spec for the real UI strings.
7. Run `npx nx run-many -t lint typecheck test -p @junta/mobile` (or
   `npm run verify`). Fix failures at their root.
8. Report the generated paths, whether the route is protected, and what is
   still stubbed.

## What the generator does

- Creates `apps/mobile/src/screens/<name>/<name>-screen.tsx` and one
  `<feature>-feature/` with StyleSheet UI and a spec.
- Creates `apps/mobile/src/app/<route>.tsx`, or under `juntas/` when
  `--protected`.
- Adds locale stubs and, for public routes, a `Stack.Screen` title in
  `_layout.tsx`.
- Never overwrites existing files.

## Never

- Copy an existing screen folder instead of running the generator.
- Put `expo-secure-store` or `api-client` imports in the screen or feature.
- Ship hard-coded user-visible strings; use `t('...')`.
