# Cucumber + Playwright (BDD layer)

A **Behaviour-Driven Development** layer that sits **on top of** the existing TTACart
Playwright framework. The `.feature` files describe behaviour in plain English; the step
definitions delegate straight to the **existing Page Objects** in `src/pages/`. No
automation logic is duplicated here — Cucumber is purely a readable front end over the POMs.

> Teaching companion: open [`docs/cucumber-playwright-tutorial.html`](../../docs/cucumber-playwright-tutorial.html)
> for the full themed, 3-hour walkthrough.

---

## The three components of Cucumber

| # | Component | Here it is | What it does |
|---|-----------|-----------|--------------|
| 1 | **Feature file** (Gherkin) | `**/features/*.feature` | Plain-English `Feature` / `Scenario` / `Given`-`When`-`Then`. |
| 2 | **Step definitions** | `**/steps/*.steps.ts` | Map each Gherkin line to code that drives a Page Object. |
| 3 | **Support code** | `support/world.ts`, `support/hooks.ts` | Per-scenario context (the `World`) + browser lifecycle hooks. |

Given/When/Then are interchangeable aliases — they read differently but behave the same.
Use them to tell a story: **Given** a context, **When** an action, **Then** an outcome.

---

## Layout

```
src/cucumber/
├── tsconfig.json                 # CommonJS override so ts-node can run the TS
├── support/
│   ├── world.ts                  # CustomWorld: browser/context/page + all Page Objects
│   └── hooks.ts                  # BeforeAll/Before/After/AfterAll — Chromium + screenshots
│
├── level-00-installation/        # Level 0 — wiring smoke
│   ├── features/smoke.feature
│   └── steps/smoke.steps.ts
│
├── level-01-basic/               # Level 1 — basic scenarios
│   ├── features/login.feature
│   └── steps/login.steps.ts
│
└── level-02-data-driven/         # Level 2 — data-driven techniques
    ├── data/customers.json       # external data source
    ├── features/
    │   ├── login-outline.feature       # Scenario Outline + Examples
    │   ├── cart-datatable.feature      # Data Table
    │   └── checkout-external-data.feature  # external JSON
    └── steps/checkout.steps.ts
```

---

## How it was wired in (the 3 glue pieces)

1. **`cucumber.js`** (repo root) — one **profile per level**. It sets
   `process.env.TS_NODE_PROJECT` to the CommonJS tsconfig **before** the `requireModule`
   hooks load, registers `ts-node/register` + `tsconfig-paths/register`, and points each
   profile at its features + steps. Level 2 also loads Level 1's steps (login steps are
   reused by the outline feature).

2. **`src/cucumber/tsconfig.json`** — the root tsconfig is `module: Node16` (ESM-ish), which
   `ts-node` can't `require`. This override flips to `module: CommonJS` /
   `moduleResolution: Node`, re-declares the `@…/*` path aliases for
   `tsconfig-paths/register`, and uses `transpileOnly` for fast feedback (types are still
   checked separately by `npm run typecheck`, which uses the **root** tsconfig).

3. **`support/world.ts` + `support/hooks.ts`** — `setWorldConstructor(CustomWorld)` gives
   every scenario a fresh `World` holding the `page` and all Page Objects (built in the
   `Before` hook via `initPages()`). `BeforeAll` launches Chromium once; `After` screenshots
   any failure into the report and closes the context.

---

## The levels

### Level 0 — installation (1 scenario / 2 steps)

Proves the toolchain is wired correctly: open the TTACart login page and assert the title.
If this passes, Cucumber + ts-node + Playwright + the path aliases all work.

### Level 1 — basic scenarios (3 scenarios / 9 steps)

`Feature` + `Background` + `Given`/`When`/`Then`. Logs in as a valid user, then asserts the
two negative paths (locked-out user, wrong password) using the real TTACart error copy.

### Level 2 — data-driven (9 scenarios / 31 steps)

The three ways Cucumber feeds data into one scenario body:

| Technique | Feature | What it shows |
|-----------|---------|---------------|
| **Scenario Outline** | `login-outline.feature` | One scenario, many `Examples` rows (valid + rejected logins). |
| **Data Table** | `cart-datatable.feature` | A table passed *into a single step* — add N products in one `When`. |
| **External data** | `checkout-external-data.feature` | Personas read from `data/customers.json`, full checkout per persona. |

---

## Commands

```bash
npm run cucumber:level0    # Level 0 only
npm run cucumber:level1    # Level 1 only
npm run cucumber:level2    # Level 2 only (loads Level 1 steps too)
npm run cucumber           # every level (default profile)
npm run cucumber:headed    # HEADED=1 — watch the browser

# Tag filtering (any profile):
npx cucumber-js --profile level2 --tags "@datatable"
npx cucumber-js --tags "@negative"
```

Reports render to `reports/cucumber/report.html` (gitignored).
Override the target site with `BASE_URL=…`.

---

## Suggested 3-hour agenda

| Time | Topic |
|------|-------|
| 0:00–0:20 | What is BDD? The 3 components; Given/When/Then. |
| 0:20–0:45 | **Level 0** — install, `cucumber.js`, the CommonJS tsconfig, first green run. |
| 0:45–1:30 | **Level 1** — Feature/Background, step definitions, the `World`, reusing Page Objects. |
| 1:30–1:45 | Break. |
| 1:45–2:40 | **Level 2** — Scenario Outline, Data Table, external JSON; hooks + failure screenshots. |
| 2:40–3:00 | Tag filtering, the HTML report, wrap-up + Q&A. |

---

## Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| `Cannot use import statement outside a module` | `TS_NODE_PROJECT` not pointing at `src/cucumber/tsconfig.json` — run via the npm scripts (they're set in `cucumber.js`). |
| `Cannot find module '@pages/…'` | `tsconfig-paths/register` missing or aliases not mirrored in `src/cucumber/tsconfig.json`. |
| Undefined step (yellow) | The `Given/When/Then` text doesn't match any step definition; check the profile loads that steps file. |
| Negative-login assertion fails | TTACart error copy changed — adjust the `"locked out"` / `"do not match"` fragments in the feature. |
| Timeouts on a slow network | Bump `setDefaultTimeout(...)` in `support/hooks.ts`, or set `HEADED=1` to watch what stalls. |
| Type error only in `npm run typecheck` | Root tsconfig (`Node16`) checks the same files — fix the type; `transpileOnly` hides it at runtime. |
