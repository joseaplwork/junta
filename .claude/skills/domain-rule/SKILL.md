---
name: domain-rule
description: Add or change a business rule. Covers the BR id in docs/domain.md, a pure tested function in libs/domain and its use in the API and admin. Use for any logic about money, groups, schedules, raffles, roles or validation beyond simple field checks.
argument-hint: '<rule to add or change>'
---

# Add or change a business rule

The rule is in the arguments or in the user's message: $ARGUMENTS

## Steps

1. **Document first.** In `docs/domain.md`, add the rule with the next free
   `BR-xx` id, or edit the existing one. Set its status and add any scenario
   that illustrates it. If the rule involves money, rounding, currency, roles or
   deletion and the user has not decided it, ask first.
2. **Implement** a pure function in `libs/domain/src/lib/<topic>.ts`:
   - no framework imports; lint enforces it;
   - a JSDoc line that cites the rule id;
   - throw `DomainRuleViolation` with the rule id for invalid input, or return
     a value. Do not return error codes;
   - export it from `libs/domain/src/index.ts`.
3. **Test** it in `<topic>.spec.ts` next to the file. Name the `describe` after
   the rule (`'calculateGroupAmount (BR-03)'`) and cover the documented
   scenarios, the boundaries and each violation.
4. **Use it** from the API service, never from the controller. A
   `DomainRuleViolation` becomes HTTP 400 with the `rule` id automatically. When
   the admin needs the same logic for instant feedback, call the same function
   there instead of re-implementing it.
5. **Cover the endpoint** with an e2e test that expects the 400 and the rule
   id, like the BR-05 case in `apps/api/test/juntas.e2e-spec.ts`.
6. Update the rule's "Where" column in `docs/domain.md`.
7. Run `npm run verify` and, when the API changed, `npm run verify:e2e`.
