---
name: Angular Development
description: Angular component patterns, dependency injection, reactive forms, and template best practices for the admin app.
---

# Angular Development

This skill provides Angular-specific patterns and best practices for the admin application.

## When to Use

- When creating or modifying Angular components in `apps/admin/`
- When working with reactive forms
- When making HTTP requests
- When implementing dialogs or modals
- When managing component state

## Component Guidelines

### Component Structure

- Component selectors should use kebab-case
- Component selectors should have prefix `app` or `ja`
- Class suffixes (`Component`, `Service`) are optional
- Use Angular Material components where applicable
- Always create component templates in separate HTML files

### Example

```typescript
@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.html',
  imports: [CommonModule, MatTableModule],
})
export class ParticipantList {
  // Component code
}
```

## Dependency Injection

Use `inject()` function instead of constructor injection. Prefix private injected services with underscore.

### Example

```typescript
export class ParticipantService {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)
  private readonly _snackbar = inject(Snackbar)
}
```

## State Management

Use Angular signals for reactive state:

- Use `signal()` for local component state
- Emit state changes through dedicated state services
- Use `computed()` for derived state

### Example

```typescript
export class ParticipantState {
  private readonly _participants = signal<Participant[]>([])
  readonly participants = this._participants.asReadonly()

  emitParticipantCreated(participant: Participant): void {
    this._participants.update(participants => [...participants, participant])
  }
}
```

## Reactive Forms

### FormBuilder Usage

- Use `FormBuilder` for creating forms
- Wrap FormArray items in FormControl instances
- Use `nonNullable` forms when appropriate

### Correct FormArray Initialization

```typescript
// Good: FormArray with FormControl instances
form = this._fb.group({
  roles: this._fb.array(
    this.data.admin.roles.map(role => this._fb.control(role)),
    [Validators.required],
  ),
})

// Bad: Raw values in FormArray
form = this._fb.group({
  roles: this._fb.array(['admin'], [Validators.required]),
})
```

## HTTP Requests

### Best Practices

- Use `firstValueFrom()` to convert observables to promises
- Match HTTP verbs to backend endpoints (GET, POST, PATCH, DELETE)
- Map frontend field names to API field names in services

### Example

```typescript
update(id: string, payload: UpdatePayload): Promise<Participant> {
  const apiPayload = {
    name: payload.name,
    phone: payload.phoneNumber, // Map frontend to API field
  }
  return firstValueFrom(
    this._http.patch<Participant>(`${this._config.api.url}/participant/${id}`, apiPayload),
  )
}
```

## Dialog Patterns

### Dialog Data Injection

- Inject `MAT_DIALOG_DATA` to receive dialog data
- Pass `handleSubmit` callbacks through dialog data
- Use try-finally to handle submitting state

### Example

```typescript
interface DialogData {
  handleSubmit: (payload: Payload) => Promise<void>
}

export class CreateDialog {
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  private readonly _dialogRef = inject(MatDialogRef<CreateDialog>)
  submitting = signal(false)

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)
    try {
      const payload = this.form.value
      await this.data.handleSubmit(payload)
      this._dialogRef.close()
    } finally {
      this.submitting.set(false)
    }
  }
}
```

## Template Best Practices

- Avoid duplicate event handlers (e.g., both `ngSubmit` and button `click`)
- Match `formControlName` to form control definitions exactly
- Use `track` with unique values in `@for` loops

### Example

```html
<!-- Good: Single event handler -->
<form [formGroup]="form">
  <button type="button" (click)="handleSubmit()">Submit</button>
</form>

<!-- Bad: Duplicate handlers -->
<form [formGroup]="form" (ngSubmit)="handleSubmit()">
  <button type="submit" (click)="handleSubmit()">Submit</button>
</form>
```

## Instructions

1. **Components**: Use separate template files, kebab-case selectors with `app` or `ja` prefix
2. **Dependency injection**: Use `inject()` function, prefix private services with underscore
3. **Forms**: Always wrap FormArray items in FormControl instances
4. **HTTP**: Use `firstValueFrom()`, match HTTP verbs to backend, map field names
5. **Dialogs**: Inject `MAT_DIALOG_DATA`, use try-finally for state management
6. **Templates**: Avoid duplicate event handlers, match form control names exactly
