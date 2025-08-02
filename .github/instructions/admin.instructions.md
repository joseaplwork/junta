---
applyTo: '/apps/admin/**/*'
---

## GitHub Copilot Instructions for Admin App

This document provides guidelines for using GitHub Copilot effectively in the Admin application of the Junta project. It covers code style, best practices, and functional requirements to ensure consistency and maintainability across the codebase.

## Code Style Guidelines

### General Formatting

- Use 2 spaces for indentation (no tabs)
- Maximum line length of 80 characters
- Use single quotes for strings
- Use trailing commas in multiline constructs
- Omit semicolons
- Use arrow functions with implicit return when possible
- Arrow functions should omit parentheses for single parameters

### Import Structure

- Group imports in this specific order:
  1. Third-party modules
  2. @junta modules
  3. @/admin or @/api modules
  4. Relative parent imports (../)
  5. Local imports (./)
- Separate import groups with blank lines
- Sort import specifiers alphabetically

### Angular Component Guidelines

- Component selectors should use kebab-case
- Component selectors should have prefix "app" or "ja"
- Class suffixes (Component, Service, etc.) are optional
- Use Angular Material components where applicable

### Code Structure

- Always add blank lines between class fields and methods
- Always add blank lines between different methods
- Add blank lines after variable declarations, unless followed by another variable

### TypeScript Rules

- Use TypeScript strict mode
- Prefer readonly properties when appropriate
- Use explicit return types on functions
- Prefer interfaces over types when possible

### Angular Best Practices

- Use Angular's dependency injection pattern
- Follow Angular's component lifecycle practices
- Use signals for state management where applicable
- Separate component logic from templates
- Keep components focused on a single responsibility

### Testing

- Write tests with Jest
- Follow the zoneless testing setup
- Test components in isolation using mocks for dependencies

### Project Structure

- Follow the NX workspace structure
- Place components, services and other artifacts in appropriate directories
- Use the established project module organization

### Functional Requirements

- When implementing Junta-related features, ensure they follow the business requirements defined in the design document
- Support for creating juntas, managing groups, and tracking financial transactions
