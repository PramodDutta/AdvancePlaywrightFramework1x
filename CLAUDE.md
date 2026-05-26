# Project Rules for Claude

**ALWAYS read [rules/](./rules/) before changing code.**

## Hard rules

### Adding/modifying tests under `src/tests/**`

After ANY test file change, you MUST run:

```bash
npm run typecheck
npm run lint
```

Both must pass (exit 0) before reporting task complete. See [rules/test-quality-checks.md](./rules/test-quality-checks.md).

## Project structure

- `src/api/` — API clients
- `src/config/` — env/config loaders
- `src/fixtures/` — Playwright fixtures
- `src/pages/` — Page Objects
- `src/testdata/` — CSV/JSON/XLSX test data
- `src/tests/` — spec files
- `src/utils/` — helpers (logger, CustomReporter)

## Path aliases (tsconfig)

`@api/*`, `@config/*`, `@fixtures/*`, `@pages/*`, `@testdata/*`, `@tests/*`, `@utils/*`
