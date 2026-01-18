---
name: TypeScript Standards
description: TypeScript coding standards, strict mode practices, and type safety guidelines.
---

# TypeScript Standards

This skill ensures TypeScript code follows strict typing, proper error handling, and best practices.

## When to Use

- When writing TypeScript code in any part of the project
- When defining interfaces, types, or classes
- When handling async operations and errors
- When working with nullable/optional values

## TypeScript Configuration

- Use TypeScript strict mode as configured in tsconfig
- Enable all strict type checking options
- Avoid `any` type - use proper typing or `unknown`

## Type Safety Best Practices

### Properties and Functions

- Prefer `readonly` properties when values shouldn't change
- Use explicit return types on functions
- Prefer interfaces over types when possible

### Examples

```typescript
// Good: Explicit return type
async function fetchParticipants(): Promise<Participant[]> {
  return await api.get('/participants')
}

// Good: Readonly property
private readonly _http = inject(HttpClient)

// Good: Interface over type
interface ParticipantPayload {
  name: string
  email: string
}

// Avoid: any type
// Bad: const data: any = {}
// Good: const data: Record<string, unknown> = {}
```

## Error Handling

Always use try-catch-finally for async operations:

- Always reset state in finally blocks (e.g., loading indicators)
- Use specific error handling, avoid empty catch blocks
- Show user-friendly error messages

### Example

```typescript
async onSubmit(): Promise<void> {
  this.submitting.set(true)

  try {
    await this._service.submit(payload)
    this._snackbar.success('Operation completed')
  } catch {
    this._snackbar.error('Operation failed')
  } finally {
    this.submitting.set(false)
  }
}
```

## Null Safety

- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer non-null assertions (`!`) only when type is guaranteed
- Use strict null checks

### Examples

```typescript
// Good: Optional chaining
const participantName = participant?.profile?.name ?? 'Unknown'

// Good: Nullish coalescing
const count = items?.length ?? 0

// Avoid: Non-null assertion unless guaranteed
// Bad: const name = participant!.name
// Good: if (participant) { const name = participant.name }
```

## Instructions

1. **Enable strict mode**: Ensure tsconfig strict options are enabled
2. **Type everything**: Avoid `any`, use proper types or `unknown`
3. **Handle errors**: Always use try-finally for async operations with state management
4. **Use readonly**: Mark properties as readonly when they shouldn't change
5. **Explicit returns**: Always specify return types on functions
6. **Null safety**: Use optional chaining and nullish coalescing appropriately
