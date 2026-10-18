# 0006: Hybrid mobile app with Ionic and Capacitor

- **Status:** proposed, waiting for the owner to confirm the framework
- **Date:** 2026-10-18

## Context

The owner wants a client app for participants on the App Store and Google
Play, built as a hybrid app, and keeps the admin app for running the
business. The repository is Angular and NestJS around two framework-free
libraries, and AI agents write most of the code. Every additional framework
adds a second set of conventions that agents must follow without drifting.

## Decision

- `apps/mobile` is an Angular 20 app built with Ionic Framework 9 components
  and packaged for iOS and Android by Capacitor 8. Like the admin, it is
  zoneless and signal-based.
- It follows the admin's conventions: lazy pages made of features, typed
  clients in `shared/api`, the same lint rules with the `jm-` prefix, and Jest
  with Testing Library.
- It shares only `@junta/contracts` and `@junta/domain` with the other apps
  (ADR 0002). HTTP, auth and layout code stay per app, because the native app
  will store tokens differently from the browser admin.
- Versions are pinned exactly, to the newest releases that were at least two
  weeks old on 2026-10-18: `@ionic/angular` 9.0.6, `ionicons` 8.1.0 and
  Capacitor 8.5.2.
- The native `ios/` and `android/` projects are added once the app id is
  decided, and committed from then on.

## Alternatives

- **React Native with Expo.** Native widgets and a large ecosystem. It could
  still share the TypeScript libraries, but it adds React beside Angular, so
  agents and reviewers juggle two UI frameworks.
- **Flutter.** Its own rendering engine and very smooth UI, but Dart shares no
  code with the TypeScript libraries.
- **Progressive web app only.** No store presence, and iOS limits push
  notifications.
- **Native Swift and Kotlin.** The best platform fit, at the cost of two more
  codebases.

## Consequences

- One language and one UI framework across both front ends. Agents reuse the
  same patterns, lint rules and test style.
- A web view is fast enough for lists, forms and schedules. Heavy animation
  would favor a native renderer.
- Native features come from Capacitor plugins, each with settings in the
  committed native projects.
- Releasing needs store accounts, signing, icons and a privacy policy. Spec 003
  tracks them.
