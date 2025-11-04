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
- Always create component's template in a separate HTML file

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

### Code guidelines

- Lint the edited file after making changes #file:../../apps/admin

## Architecture

- Keep this project structure as reference when building new features:
src/
├── pages/                           # Main entry points
│   ├── home/                        # Home page
│   │   ├── custom1-ft/         # Feature-1 in home page
│   │   │   ├── components/          # Presentational components for  for feature-1 in home page
│   │   │   ├── constants/           # Constants for feature-1 in home page
│   │   │   ├── interfaces/          # Interfaces for feature-1 in home page
│   │   │   ├── services/            # Business logic only for feature-1 in home page
│   │   │   ├── custom1-ft.html # Feature 1 entry point component template
│   │   │   └── custom1-ft.ts   # Feature 1 entry point controller component definition
│   │   ├── home-state.ts          # Signals state that serves to communicate features and decouple feature dependency (optional)
│   │   ├── home-page.html           # Home page entry point component template which layouts features
│   │   └── home-page.ts             # Home page entry point component definition
│   ├── page-1/                      # Page 1
│   │   ├── custom1-ft/         # Feature-1 in page-1
│   │   ├── custom2-ft/         # Feature-2 in page-1
│   │   │   ├── components/          # Presentational components for feature-2 in page-1
│   │   │   ├── constants/           # Constants for feature-2 in page-1
│   │   │   ├── interfaces/          # Interfaces for feature-2 in page-1
│   │   │   ├── services/            # Business logic only for feature-2 in page-1
│   │   │   ├── custom2-ft.html # Feature 2 entry point component template
│   │   │   └── custom2-ft.ts   # Feature 2 entry point controller component definition
│   │   ├── page-1-state.ts          # Signals state that serves to communicate features and decouple feature dependency (optional)
│   │   ├── page-1-page.html         # Page 1 entry point component template which layouts features
│   │   └── page-1-page.ts           # Page 1 entry point component definition
│   └── page-2/                      # Page 2
│       ├── custom1-ft/         # Feature-1 in page-2
│       ├── custom2-ft/         # Feature-2 in page-2
│       │   ├── components/          # Presentational components for feature-2 in page-2
│       │   ├── constants/           # Constants for feature-2 in page-2
│       │   ├── interfaces/          # Interfaces for feature-2 in page-2
│       │   ├── services/            # Business logic only for feature-2 in page-2
│       │   ├── custom2-ft.html # Feature 2 entry point component template
│       │   └── custom2-ft.ts   # Feature 2 entry point controller component definition
│   │   ├── page-2-state.ts          # Signals state that serves to communicate features and decouple feature dependency (optional)
│       ├── page-2-page.html         # Page 2 entry point component template which layouts features
│       └── page-2-page.ts           # Page 2 entry point component definition
└── shared/                          # Reusable functionality for the admin app
    ├── components/                  # Presentational components used across the admin app
    ├── constants/                   # Constants used across the admin app
    ├── interfaces/                  # Interfaces used across the admin app
    └── services/                    # Business logic services and utilities used across the admin app