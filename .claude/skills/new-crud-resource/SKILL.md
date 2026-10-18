---
name: new-crud-resource
description: Add a new resource with its NestJS API, contract types, permissions, admin CRUD page and tests by running the repository generators. Use when the user wants to manage a new kind of record.
argument-hint: '<resource name and its fields>'
---

# New CRUD resource

The request is in the arguments or in the user's message: $ARGUMENTS

## Steps

1. Choose a singular, kebab-case name (`payment-reminder`) and the fields. Each
   field is `name:type`, or `name?:type` when optional, with a camelCase name.
   Types: `string`, `int`, `decimal`, `boolean`, `date`. Do not declare `id`;
   it is added for you. Ask the user if a field's type or optionality is
   unclear.
2. Check that no resource with that name exists in
   `apps/api/src/app/` or `apps/admin/src/app/pages/`.
3. Generate everything in one run:

   ```sh
   npx nx g @junta/nx-plugin:crud <name> --fields="<spec>" --icon=<material-icon> --no-interactive
   ```

   To generate only the API, use `@junta/nx-plugin:api-resource`, and add the
   page later with `@junta/nx-plugin:admin-crud-page` and the same `--fields`.

4. Write the migration for the new table. Bring your database up to date,
   generate, read the SQL, then apply it:

   ```sh
   npx nx run @junta/api:migration-run
   npx nx run @junta/api:migration-generate --name=Add<PluralClass>
   npx nx run @junta/api:migration-run
   ```

   The SQL must only create the new table and its constraints.

5. The generator grants the four new `<NAME>_*` permissions in
   `libs/domain/src/lib/permissions.ts` for organizers. Admins hold every
   permission. The records are shared by every organizer: if each organizer
   must see only their own, add an organizer column and scope the service
   (BR-16) in the spec. Grant other roles only when the user asks.
6. Add any business rules with the `domain-rule` skill. The generated service
   is plain CRUD until you do.
7. Adjust the list columns and form labels if the defaults do not fit.
8. Run `npm run verify`, then `npm run verify:e2e`. The generated unit, client
   and e2e tests must pass unchanged unless you changed behavior on purpose.
9. Report the generated paths, the migration, the commands and their results.

## What the generator does

- Creates `apps/api/src/app/<plural>/` (module, controller, service, mapper,
  entity, DTOs, service spec) and `apps/api/test/<plural>.e2e-spec.ts`.
- Creates `libs/contracts/src/lib/<name>.ts` and exports it.
- Registers the entity, the module, the `ApiResource` route name and the four
  permissions, and grants those permissions to organizers.
- Creates `apps/admin/src/app/pages/<name>/`, the `shared/api` client with its
  spec, a lazy route guarded by the read permission, and a sidebar entry.
- Never overwrites existing files.
