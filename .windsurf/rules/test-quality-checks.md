---
trigger: glob
globs: src/tests/**/*.ts
description: Enforce typecheck + lint after every test change
---

# Test Quality Checks

After ANY change in `src/tests/**`, you MUST run:

```bash
npm run typecheck
npm run lint
```

Both must pass (exit 0). Do not report work complete until verified.

## Test conventions

- Tag every test: `@p0`, `@p1`, `@e2e`, `@smoke`, or `@lor`.
- No `test.only` / `test.skip` without ticket reference.
- Page Object Model — no raw selectors in specs.
- Use `logger` from `@utils/logger` instead of `console.log`.
- Use path aliases (`@pages`, `@utils`, etc.) — no `../../../` imports.
