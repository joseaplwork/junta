---
applyTo: '**'
---

## Functionality

You can find the main functionality of the project in the #file:../../resources/db/design.md file.
The app contains a set of features to manage "La junta", including creating juntas, managing groups, and handling user participation.
This project contains a backend API built with NestJS and a frontend application using Angular.

## Code Style

When generating code, please follow these guidelines:

- Use Prettier formatting as defined in #file:../../.prettierrc at the project root
- Use TypeScript strict mode following our tsconfig settings

## Testing

- Unit tests should be created using Jest following the patterns in our existing spec files
- Ensure tests work with our zoneless test setup

## Project structure

- The app is split into two apps, the admin app which is the UI interface to create and manage juntas, users, and the API app which is the backend service for juntas, admin, and users.
- When generating code bare in mind that there is #file:../../libs folder which contains shared code between the two apps.

## Architecture

- The project focuses on single responsibility and separation of concerns.
- KISS (Keep It Simple, Stupid) principle is applied throughout the codebase.
- DRY (Don't Repeat Yourself) principle is also followed to reduce code duplication.
- YAGNI (You Aren't Gonna Need It) principle is applied to avoid adding unnecessary features.
- When creating code, abstract logic from presentation
- Write readable code with no comments
- Add reusable code across apps in the #file:../../libs folder
