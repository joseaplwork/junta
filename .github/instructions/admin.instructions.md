---
applyTo: '/apps/admin/**/*'
---

## Admin App Guidelines

When generating code, please follow these guidelines:

- Follow the ESLint rules and formatting rules defined in #file:../../apps/admin/.eslintrc.json and #file:../../.eslintrc.json
- Keep in mind the project structure defined in #file:../../apps/admin/tsconfig.json
- Make sure to solve the conflicts between eslint and prettier after generating code
- Admin app components should use standalone component architecture
- Keep in mind the test setup defined in #file:../../apps/admin/src/test-setup.ts
- Admin routes should be lazy loaded
- My project uses Jest, so ensure that all tests are compatible with Jest
- Use Material Design components for UI elements
- All forms should include proper validation messages
- Admin services should handle authentication via the AdminSession service
- Follow the latest Angular project structure conventions
- Generate angular components, services, and modules following the latest Angular API guidelines
- Services should use the inject() function for dependency injection
- Use signals for state management, following the latest Angular best practices
- Use input() and output() decorators for component communication
- Use zoneless change detection as configured in our app
- When creating new test files they must have the extension `.spec.*`
