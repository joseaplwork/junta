---
name: Code Style and Formatting
description: Code formatting guidelines following Prettier and project conventions for consistent code style.
---

# Code Style and Formatting

This skill enforces consistent code formatting and style across the Junta project.

## When to Use

- When writing or editing any TypeScript/JavaScript code
- When organizing imports in files
- When naming variables, functions, or interfaces
- When structuring code blocks and methods

## Formatting Rules

### General Formatting

- Use 2 spaces for indentation (no tabs)
- Maximum line length of 80 characters
- Use single quotes for strings
- Use trailing commas in multiline constructs
- Omit semicolons
- Use arrow functions with implicit return when possible
- Arrow functions should omit parentheses for single parameters

### Code Structure

- Always add blank lines between class fields and methods
- Always add blank lines between different methods
- Add blank lines after variable declarations (unless followed by another variable)

## Import Organization

Group imports in this specific order with blank lines between groups:

1. **Third-party modules** (Angular, NestJS, RxJS, etc.)
2. **@junta modules** (shared libraries from `libs/`)
3. **@/admin or @/api modules** (app-level path aliases)
4. **Relative parent imports** (`../`)
5. **Local imports** (`./`)

Sort import specifiers alphabetically within each import statement.

### Example

```typescript
// 1. Third-party modules
import { Component, inject } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { firstValueFrom } from 'rxjs'

// 2. @junta modules (shared libs)
import { Role } from '@junta/enums'

// 3. @/admin or @/api modules (app-level aliases)
import { Config } from '@/admin/shared/services/config'

// 4. Relative parent imports
import { ParticipantState } from '../participant-page-state'

// 5. Local imports
import { ParticipantUpdate } from './services/participant-update'
```

## Naming Conventions

- Use descriptive, self-documenting names
- Prefer `payload` over `data` for API request bodies
- Use consistent naming across similar patterns:
  - `CreatePayload` for creation payloads
  - `UpdatePayload` for update payloads
  - Avoid repeating context in names (e.g., prefer `UpdatePayload` over `ParticipantListUpdatePayload` when context is clear from file location)

## Instructions

1. **Format code**: Follow Prettier configuration at project root (`.prettierrc`)
2. **Organize imports**: Always group and order imports as specified above
3. **Name consistently**: Use the established naming patterns for payloads and interfaces
4. **Structure code**: Add blank lines between logical sections (fields, methods, etc.)
5. **Line length**: Break long lines at 80 characters, respecting readability
