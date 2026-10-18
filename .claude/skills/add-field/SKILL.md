---
name: add-field
description: Add a field to an existing resource consistently across contracts, entity, DTOs, mapper, service, admin form, table and tests. Use when the user asks to store or show a new attribute on an existing record.
argument-hint: '<resource> <field name and type>'
---

# Add a field to an existing resource

The request is in the arguments or in the user's message: $ARGUMENTS

Use the participants resource and page as the reference for every step. Work
top-down: each layer fails to compile until the previous one is done, and
those errors are your checklist.

## Steps

1. **Contract** (`libs/contracts/src/lib/<resource>.ts`): add the field to
   `<Resource>Response` and to `Create<Resource>Request`. `Update` is a
   `Partial` of create and updates itself. Optional fields are
   `field?: T | null` in requests and `T | null` in responses. Dates are ISO
   strings.
2. **Entity** (`entities/<resource>.entity.ts`): add a camelCase property with
   an explicit snake_case column, for example
   `@Column({ name: 'due_date', type: 'timestamptz', nullable: true })`.
   Money is whole units: use `int`. Use `numericTransformer` for other
   decimals. Existing rows need either `nullable: true` or a `default`, otherwise the migration fails on tables
   that have rows.
   Then write the migration: run `npx nx run @junta/api:migration-run`, then
   `npx nx run @junta/api:migration-generate --name=Add<Resource><Field>`.
   The SQL must be a single `ADD COLUMN`. Apply it with `migration-run`.
3. **DTO** (`dto/create-<resource>.dto.ts`): add the validators. Required
   text gets `@IsString() @IsNotEmpty()`; optional fields start with
   `@IsOptional()`; dates use `@IsISO8601()`.
4. **Mapper**: add the field to the response. Dates use `.toISOString()`.
5. **Service**: set it in `create` and add an
   `if (dto.field !== undefined) entity.field = ...` line in `update`.
6. **Tests**: extend the service spec fixtures and the e2e create request.
7. **Admin**: add a form control in the page's form dialog with a matching
   `mat-form-field`, send it in the request, and add a list column if it
   should be visible. Extend the dialog spec fixtures.
8. If the field carries a business rule, use the `domain-rule` skill.
9. Run `npm run verify` and `npm run verify:e2e`.
10. Report the new column name, the migration and whether existing rows got a
    default.
