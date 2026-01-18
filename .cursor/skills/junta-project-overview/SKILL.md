---
name: Junta Project Overview
description: Core project principles, architecture guidelines, and tech stack for the Junta monorepo application.
---

# Junta Project Overview

This skill provides context about the Junta project structure, architecture principles, and shared code organization.

## When to Use

- When starting work on any part of the Junta project
- When deciding where to place new code or features
- When understanding project structure and organization
- When applying architectural principles to new code

## Project Context

The Junta project is an application for managing "La junta", including creating juntas, managing groups, and handling participant participation.

### Tech Stack

- **Backend**: NestJS API (`apps/api/`)
- **Frontend**: Angular Admin App (`apps/admin/`)
- **Shared Code**: Reusable libraries (`libs/`)
- **Monorepo**: Nx workspace with npm

### Project Structure

- The app is split into two apps:
  - **Admin app**: UI interface to create and manage juntas, participants
  - **API app**: Backend service for juntas, admin, and participants
- Shared code between apps lives in `libs/` folder
- Main functionality is documented in `resources/db/design.md`

## Architecture Principles

### Single Responsibility

- Each component, service, or module should have one clear purpose
- Separate business logic from presentation
- Abstract logic into services, keep components focused on UI

### KISS (Keep It Simple, Stupid)

- Prefer simple solutions over complex ones
- Avoid over-engineering
- Only add complexity when truly necessary

### DRY (Don't Repeat Yourself)

- Identify and extract reusable patterns
- Place shared code in `libs/` folder
- Reuse existing abstractions before creating new ones

### YAGNI (You Aren't Gonna Need It)

- Don't add features until they're actually needed
- Avoid speculative generalization
- Focus on current requirements

## Code Quality Standards

- Write readable, self-documenting code
- Avoid comments - let the code speak for itself
- Use descriptive names for variables, functions, and classes
- Variable and function declarations should be simple, reflect intention, and rely on context hierarchy

## Shared Code Organization

Place reusable code across apps in the `libs/` folder:

- `libs/shared/enums/` - Shared enumerations (e.g., Role, Permission)
- `libs/shared/services/` - Shared services and utilities

When creating shared code:

- Check if similar functionality already exists in `libs/`
- Extract common patterns from multiple apps into shared libraries
- Use `@junta/` import aliases for shared code

## Instructions

1. **Before creating new code**: Check if similar functionality exists in `libs/` or other apps
2. **When organizing code**: Follow the established structure (apps for app-specific code, libs for shared code)
3. **When designing features**: Apply KISS, DRY, and YAGNI principles
4. **When naming**: Use descriptive names that reflect purpose without unnecessary context repetition
5. **When writing code**: Focus on readability and self-documentation over comments
