# Rule: Test Quality Checks

**Scope:** every new test case added under `src/tests/**`.

## Mandatory pre-commit steps

After adding or modifying any test file:

1. **Type check**
   ```bash
   npm run typecheck
   ```
   Must exit with code 0. Zero TS errors.

2. **Lint check**
   ```bash
   npm run lint
   ```
   Must exit with code 0. Zero ESLint errors.

3. **Format check** (optional but recommended)
   ```bash
   npm run format:check
   ```

4. **Smoke run** of the new test
   ```bash
   npx playwright test path/to/new.spec.ts --project=chromium
   ```

## Enforcement

- CI fails build if typecheck or lint fails.
- Do NOT commit `.only`, `xit`, `test.skip` without ticket reference.
- Every test must have at least one tag: `@p0`, `@p1`, `@e2e`, `@smoke`, `@lor`.

## Quick combined command

```bash
npm run typecheck && npm run lint && npm test
```
