# Phase 1 — Prompts & Conversation Log

This file captures the full Claude Code conversation used to bootstrap **Phase 1** of the Advance Playwright Framework. Students can replay these prompts step by step to reproduce the framework themselves.

Author: Pramod Dutta — The Testing Academy
Repo: https://github.com/PramodDutta/AdvancePlaywrightFramework1x

---

## Prompt 1 — Install runtime dev dependencies

> install the node dev dependencies csv-parse, dotenv, xlsx

```bash
npm install --save-dev csv-parse dotenv xlsx
```

**Why:** `csv-parse` for CSV-driven data tests, `dotenv` for env config (`.env`), `xlsx` for spreadsheet test data.

Note: `xlsx` (0.18.5 from npm) has a known high-severity vuln. For prod-grade work, install from SheetJS CDN:
```bash
npm i --save-dev https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz
```

---

## Prompt 2 — Add all npm script configurations

> in the package.json, can you please add all the different types of configuration?
> - test with UI
> - test with chromium
> - test with firefox
> - test with debug
> - test with E2E
> - test with P0
> - test with report
> - test with LOR
> - test with report CI
> - linting type check format build clean

Final `scripts` block in `package.json`:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "test:debug": "playwright test --debug",
    "test:e2e": "playwright test --grep @e2e",
    "test:p0": "playwright test --grep @p0",
    "test:p1": "playwright test --grep @p1",
    "test:lor": "playwright test --grep @lor",
    "test:report": "playwright show-report",
    "test:report:ci": "playwright show-report --host 0.0.0.0 --port 9323",
    "test:allure": "allure generate ./allure-results --clean -o ./allure-report && allure open ./allure-report",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,js,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,json,md}\"",
    "build": "tsc",
    "clean": "rm -rf dist playwright-report test-results allure-results allure-report node_modules/.cache"
  }
}
```

---

## Prompt 3 — Add Winston logger

> please add a Winston Logger also.

```bash
npm install winston
```

Created `src/utils/logger.ts` with:
- Console transport (colored, timestamped)
- File transport (`logs/error.log` for errors, `logs/combined.log` for all)
- 5 MB rotation, 5 file retention
- JSON format for file, pretty for console
- Reads `LOG_LEVEL` env var

Usage:
```ts
import logger from '@utils/logger';
logger.info('test started', { test: 'login' });
logger.error('failed', new Error('boom'));
```

---

## Prompt 4 — Difference between `dependencies` vs `devDependencies`

| Aspect | `dependencies` | `devDependencies` |
|--------|----------------|-------------------|
| Purpose | Runtime code prod needs | Tooling for dev/test |
| Install flag | `npm install <pkg>` | `npm install -D <pkg>` |
| Shipped to prod | Yes | No |
| `npm install --production` | Installed | Skipped |
| Bundled into Docker prod image | Yes | No |
| Affects bundle size | Yes | No |
| Examples | `winston`, `express`, `react` | `@playwright/test`, `eslint`, `typescript` |
| Imported in `src/` runtime | Yes | No (only tests/configs) |

**Rule:** Test framework code → `devDependencies` (no prod runtime).

---

## Prompt 5 — Timeout units in `playwright.config.ts`

> timeout: 60_000 — is the time in second or min?

**Milliseconds.**
- `timeout: 60_000` = 60 sec per test
- `expect: { timeout: 10_000 }` = 10 sec per assertion
- `60_000` is JS numeric separator (same as `60000`) for readability

---

## Prompt 6 — Verify Playwright config syntax

> can you please verify the configuration if it is fine from a syntax point of view and everything?

Issues found and fixed:

| # | Problem | Fix |
|---|---------|-----|
| 1 | Stray `}` after `defineConfig()` → TS1128 | Delete extra brace |
| 2 | `testDir: './src/tests'` did not exist | Moved tests into `src/tests/` |
| 3 | Reporter path wrong | Use `./src/utils/CustomReporter.ts` |
| 4 | `workers: 6` local — too high | Use `undefined` (Playwright defaults to CPU/2) |
| 5 | `tsconfig.json` empty (0 bytes) | Wrote valid Node16 config with path aliases |

Verification:
```bash
npx tsc --noEmit
npx playwright test --list
```

---

## Prompt 7 — What is `forbidOnly`?

> forbidOnly — what is this?

`forbidOnly: true` = build fails if any test uses `.only`. Prevents `test.only(...)` leftover from local debugging silently skipping rest of the suite in CI.

Pattern: `forbidOnly: isCI` → enforced only in CI, free locally.

---

## Prompt 8 — Fix broken paths after moving folders into `src/`

> can you please fix the broker link because I have moved all the folders into source?

- `testDir` → `./src/tests`
- Reporter path → `./src/utils/CustomReporter.ts`
- Created valid `tsconfig.json` with Node16 module resolution

---

## Prompt 9 — Add `api/` and `config/` aliases

> I have added API as well as config also in the source folder. Can we add this to tsconfig.json?

Final `tsconfig.json` paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@api/*": ["./src/api/*"],
      "@config/*": ["./src/config/*"],
      "@fixtures/*": ["./src/fixtures/*"],
      "@pages/*": ["./src/pages/*"],
      "@testdata/*": ["./src/testdata/*"],
      "@tests/*": ["./src/tests/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

Usage:
```ts
import logger from '@utils/logger';
import { LoginPage } from '@pages/LoginPage';
```

---

## Prompt 10 — Create `rules/` folder enforcing typecheck + lint on test changes

> please create a folder with the name of the rule, where you will mention every time. Whenever we add a new test case, you need to run the type check. You need to run the lint check.

Created:
- `rules/README.md` — index of rules
- `rules/test-quality-checks.md` — mandates `npm run typecheck && npm run lint` after every test change
- `CLAUDE.md` at root — auto-loaded by Claude Code, points to `rules/`

---

## Prompt 11 — Mirror rule for GitHub Copilot

> please add this rule to the copilot guys, also in the GitHub folder also.

Created `.github/copilot-instructions.md` with the same rule + project structure + npm scripts table.

---

## Prompt 12 — Mirror rule for Cursor and Windsurf

> please add this for cursor windsurf

Created:
- `.cursorrules` (legacy) + `.cursor/rules/test-quality-checks.mdc` (new format with frontmatter)
- `.windsurfrules` (legacy) + `.windsurf/rules/test-quality-checks.md` (new format with `trigger: glob`)

---

## Prompt 13 — Mirror for Google Antigravity

> For anti-cravity Google also

Created `AGENTS.md` — open standard read by Google Antigravity, OpenAI Codex, Aider, Jules, and any AGENTS.md-compatible tool.

---

## Prompt 14 — Mirror for Augment Code

> please add an argument rule also.

Created:
- `.augment-guidelines` (legacy)
- `.augment/rules/test-quality-checks.md` (new frontmatter format with `type: always`)

---

## Final agent rule matrix

| Tool | File | Format |
|------|------|--------|
| Claude Code | `CLAUDE.md` | markdown |
| GitHub Copilot | `.github/copilot-instructions.md` | markdown |
| Cursor | `.cursorrules` + `.cursor/rules/*.mdc` | MDC frontmatter |
| Windsurf | `.windsurfrules` + `.windsurf/rules/*.md` | md + frontmatter |
| Augment Code | `.augment-guidelines` + `.augment/rules/*.md` | md + frontmatter |
| Antigravity / Codex / Aider / Jules | `AGENTS.md` | open standard |
| Canonical source | `rules/` | markdown |

All enforce the same rule: `npm run typecheck && npm run lint` after every test change.

---

## How to replay Phase 1

```bash
git clone https://github.com/PramodDutta/AdvancePlaywrightFramework1x.git
cd AdvancePlaywrightFramework1x
npm install
npx playwright install
npm run typecheck
npm test
```

Open report:
```bash
npm run test:report
```
