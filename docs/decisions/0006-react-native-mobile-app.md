# 0006: Participant app with React Native and Expo

- **Status:** accepted by the owner on 2026-10-18
- **Date:** 2026-10-18

## Context

The owner wants a multi-platform app for participants on the App Store and
Google Play, and keeps the admin app for running the business. A first
foundation used Ionic and Capacitor. After comparing the options, the owner
chose React Native.

## Decision

- `apps/mobile` is a React Native app built with Expo SDK 58: React Native
  0.88, React 19.3, Expo Router for navigation.
- It is an npm workspace, so Expo's own dependencies are declared in
  `apps/mobile/package.json` and installed at the root, as Expo's monorepo guide
  recommends. Metro is configured automatically.
- It shares only `@junta/contracts` and `@junta/domain` with the other apps
  (ADR 0002), through TypeScript path aliases.
- Native projects use Continuous Native Generation: `ios/` and `android/` are
  generated from `app.json` and never committed.
- Development runs in Expo Go; store builds and submissions go through EAS.
- Nx wraps the Expo CLI: `start`, `ios`, `android`, `build` (bundle export),
  `lint`, `test`, `typecheck` and `doctor`.

## Alternatives

- **Ionic with Capacitor.** One framework with the Angular admin and a web
  build for free, but a web view instead of native rendering. It was built
  first and replaced at the owner's request.
- **Flutter.** Smooth rendering, but Dart shares no code with the TypeScript
  libraries.

## Consequences

- Native rendering and the largest mobile ecosystem; Expo handles builds,
  signing and over-the-air updates.
- Agents now follow two UI frameworks. Each app's `AGENTS.md` holds its own
  conventions, and the shared lint rules (page independence, no direct HTTP in
  pages, strict TypeScript) apply to both.
- The mobile app uses TypeScript 6 from its own workspace, while the Angular
  apps stay on TypeScript 5.8.
- React Native's `fetch` does not apply browser CORS, so native builds need no
  `CORS_ORIGIN` entry. Tokens for participants will live in secure storage
  (spec 003).
