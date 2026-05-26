# AGENTS.md

Universal agent instructions — read by Google Antigravity, OpenAI Codex, Aider, Jules, Cursor, and other AGENTS.md-compatible tools.

Project: **AdvancePlaywrightFramework1x** — Playwright TypeScript framework.

## Hard rules

### Adding/modifying tests under `src/tests/**`

After ANY test file change, you MUST run:

```bash
npm run typecheck
npm run lint
```

Both must pass (exit 0) before reporting work complete.

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

Use aliases — no `../../../` imports.

## Test conventions

- Every test carries a tag: `@p0`, `@p1`, `@e2e`, `@smoke`, or `@lor`.
- No `test.only` / `test.skip` without ticket reference.
- Page Object Model — no raw selectors in spec files.
- Use `logger` from `@utils/logger` instead of `console.log`.

## NPM scripts

| Script | Purpose |
|--------|---------|
| `test` | run all |
| `test:ui` | Playwright UI mode |
| `test:chromium` / `test:firefox` / `test:webkit` | per-browser |
| `test:debug` | inspector |
| `test:p0` / `test:p1` / `test:e2e` / `test:lor` | tagged runs |
| `test:report` | open HTML report |
| `typecheck` | tsc --noEmit |
| `lint` / `lint:fix` | ESLint |
| `format` / `format:check` | Prettier |
| `build` | tsc compile |
| `clean` | wipe reports/cache |

## Verification before completion

Run before reporting any task done:

```bash
npm run typecheck && npm run lint
```

## Full rules

See [rules/](./rules/) for canonical rule source.
