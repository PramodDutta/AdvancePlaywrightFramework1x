# Advance Playwright Framework (1.x)

> Production-grade Playwright + TypeScript automation framework built by [Pramod Dutta](https://thetestingacademy.com) for **The Testing Academy**.

[![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/Node-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)]()

A complete, opinionated, batteries-included Playwright framework with **Page Object Model**, **fixtures**, **data-driven testing**, **multi-env config**, **Winston logging**, a **custom HTML reporter**, **Allure**, **CI-ready scripts**, and a built-in **AI Agent Factory** (plan → generate → heal, plus LLM test-data / RCA / flaky agents).

> 🤖 **In a hurry?** Jump straight to the [AI Agent Factory & Showcase](#-showcase--ai-agent-factory) — videos, diagrams, and the agent loop that make this framework different.

---

## How to read this README

The guide is split into three parts, beginner → builder, followed by the showcase:

| Part | You'll learn to… |
|------|------------------|
| **[1. Installation](#part-1--installation-)** | clone, install, configure env, run, and view reports |
| **[2. Setting up the framework](#part-2--setting-up-the-framework-)** | structure, aliases, scripts, reporting, AI rules, CI/CD |
| **[3. Creating the framework](#part-3--creating-the-framework-)** | build Page Objects, fixtures, data factories, tests, API layers |
| **[🤖 Showcase](#-showcase--ai-agent-factory)** | the AI Agent Factory, the agent loop, videos & diagrams |

### Table of Contents

**Part 1 — Installation**
- [Prerequisites](#prerequisites) · [Install](#install) · [Run tests](#run-tests) · [View report](#view-report) · [Environment Configuration](#environment-configuration)

**Part 2 — Setting up the framework**
- [Folder Structure](#folder-structure) · [Path Aliases](#path-aliases) · [NPM Scripts](#npm-scripts) · [Module System](#module-system-commonjs) · [Reporting](#reporting) · [AI Agent Rules](#ai-agent-rules) · [Project Rules](#project-rules) · [CI/CD](#cicd)

**Part 3 — Creating the framework**
- [Element Utilities](#element-utilities-utilelementlocator) · [Page Objects](#page-objects-basepage) · [Fixtures](#fixtures-page-object-injection) · [Test Data Factory](#test-data-factory-faker) · [Writing Tests](#writing-tests--steps--logging) · [Per-Step Screenshots](#per-step-screenshots-visualstep) · [End-to-End Checkout](#end-to-end-checkout-flow) · [API Testing](#api-testing) · [JSONPath](#jsonpath-queries-jsonpath-plus) · [JSON Schema](#json-schema-validation-ajv) · [Tags](#test-tags--filtering) · [Logging](#logging-winston) · [Custom TTA Report](#custom-tta-report--visual-flow)

**Showcase**
- [AI Agent Factory & Showcase](#-showcase--ai-agent-factory) · [Phase 1 Walkthrough](#phase-1-walkthrough) · [Contributing](#contributing) · [Author](#author)

### Features at a glance

- **Playwright Test runner** — parallel, retries, projects, trace viewer
- **TypeScript strict mode** with path aliases (`@pages`, `@utils`, `@api`, …)
- **Page Object Model** under `src/pages/` · **Custom Fixtures** under `src/fixtures/`
- **API client layer** under `src/api/` (REST + GraphQL ready) + a **dedicated API project**
- **Multi-env config** via `dotenv` — qa, stg, prod, dev
- **Data-driven testing** — CSV (`csv-parse`), JSON, XLSX (`xlsx`) · **Faker** test-data factories
- **Winston logger** with file + console + rotation
- **Custom HTML Reporter** (`CustomReporter.ts`) — TTA-branded, real-time · **Allure** integration
- **Tag-based execution** — `@p0`, `@p1`, `@e2e`, `@smoke`, `@lor`
- **Cross-browser** — Chromium, Firefox, WebKit, Mobile Chrome (Pixel 5)
- **CI-aware config** — auto-tunes retries, workers, `forbidOnly`
- **AI Agent Factory** (`src/ai/`) — LLM gateway + DataGenerator / RCA / Flaky agents
- **IDE test agents** (`.github/agents/`) — plan → generate → heal (MCP + CLI)
- **AI-agent rule files** for Claude Code, Copilot, Cursor, Windsurf, Augment, Antigravity, Aider, Codex, Jules
- **ESLint + Prettier + tsc** quality gates enforced on every test change

---

# Part 1 — Installation 🛠️

Everything you need to clone, configure, and run the suite.

[![Install & run the framework in 60 seconds](docs/images/install-demo.gif)](docs/images/install-demo.mp4)

*▶️ Click for the full-quality MP4.*

## Prerequisites

- Node.js **18+**
- npm 9+
- (Optional) Allure CLI: `brew install allure` / `scoop install allure`

## Install

```bash
git clone https://github.com/PramodDutta/AdvancePlaywrightFramework1x.git
cd AdvancePlaywrightFramework1x
npm install
npx playwright install --with-deps
```

## Run tests

```bash
npm test                  # all tests, all projects
npx playwright test src/tests/apiTests/01_restfulbooker_raw/crud.spec.ts --project=api
npm run test:chromium     # chromium only
npm run test:ui           # UI mode (debug-friendly)
npm run test:p0           # smoke / critical only
```

## View report

```bash
npm run test:report       # Playwright HTML
npm run test:allure       # Allure HTML
# TTA custom report auto-generated at tta-report/index.html
```

## Environment Configuration

`.env` (root) — loaded by `dotenv` in `playwright.config.ts`.

Supported keys:

```dotenv
TTA_ENV=qa                # qa | stg | prod | dev
BASE_URL=                 # override everything if set
QA_BASE_URL=https://app.thetestingacademy.com
STG_BASE_URL=https://stage.thetestingacademy.com
PROD_BASE_URL=https://app.thetestingacademy.com
DEV_BASE_URL=http://localhost:3000
API_BASE_URL=https://restful-booker.herokuapp.com
LOG_LEVEL=info            # winston log level
TEST_ENV=UAT              # shown in TTA report
TEST_AUTHOR=Pramod

# --- AI Agent Factory (src/ai) ---
LLM_PROVIDER=openrouter   # openrouter | groq | openai
LLM_MODEL=                # optional; overrides provider default
OPENROUTER_API_KEY=
GROQ_API_KEY=
OPENAI_API_KEY=
```

Switch env any time:
```bash
TTA_ENV=stg npm test
```

---

# Part 2 — Setting up the framework ⚙️

How the project is wired — structure, aliases, scripts, reporting, AI rules, and CI/CD.

[![How the framework is built — layered & scalable](docs/images/structure-demo.gif)](docs/images/structure-demo.mp4)

## Folder Structure

```
AdvancePlaywrightFramework1x/
├── src/
│   ├── ai/                    # AI Agent Factory (LLM gateway + agents)
│   │   ├── gateway/llmGateway.ts   # OpenRouter / Groq / OpenAI (one adapter)
│   │   ├── agents/                 # customDataGenerator, rcaAgent, flakyAnalyzer
│   │   ├── models.json             # provider/model registry (outside code)
│   │   └── index.ts                # `@ai/*` barrel
│   ├── api/                   # API clients (REST / GraphQL) — BookingApi
│   ├── config/                # Env loaders + credentials accessor
│   │   └── credentials.ts     # Login creds sourced from .env
│   ├── fixtures/              # Playwright custom fixtures
│   │   ├── test-base.ts       # `test` extended with a fixture per Page Object
│   │   └── booker.fixture.ts  # bookingApi + bookerToken fixtures
│   ├── pages/                 # Page Object Model classes
│   │   ├── BasePage.ts        # Abstract parent (page, el, log, goto)
│   │   ├── LoginPage.ts ... CheckoutCompletePage.ts
│   │   └── index.ts           # Barrel re-exports
│   ├── testdata/              # CSV / JSON / XLSX test data
│   │   ├── booking.data.ts    # Booking payload factory
│   │   ├── structures/        # JSON structures for AI data generation
│   │   └── schemas/           # JSON Schema (Draft-07) for Ajv validation
│   ├── tests/                 # Spec files (*.spec.ts)
│   │   ├── apiTests/          # API specs, run with the `api` Playwright project
│   │   │   ├── 01_restfulbooker_raw/        # raw request fixture
│   │   │   ├── 02_restfulbooker_apiHelper/  # ApiHelper wrapper
│   │   │   ├── 03_restfulbooker_fixture_e2e/# BookingApi client + fixtures
│   │   │   ├── 04_jsonpath_plus/            # JSONPath queries + cheat sheet
│   │   │   ├── 05_ajv_schema/               # Ajv schema validation
│   │   │   └── 06_ai_datagen/               # AI-generated, schema-valid test data
│   │   └── e2e/               # Full login→checkout→complete flow
│   └── utils/                 # Helpers
│       ├── logger.ts          # Winston logger (+ createLogger scope)
│       ├── UtilElementLocator.ts  # Locator action wrapper (Flex type)
│       ├── DataGenerator.ts   # Faker test-data factory
│       ├── ApiHelper.ts       # HTTP wrapper (GET/POST/PUT/PATCH/DELETE + retry)
│       ├── schemaValidator.ts # Ajv + ajv-formats schema validation
│       ├── visualStep.ts      # test.step + per-step screenshot
│       └── CustomReporter.ts  # TTA HTML reporter (+ AI Verdict tab)
│
├── .github/agents/            # IDE test agents (planner / generator / healer, MCP + CLI)
├── remotion/                  # Remotion project that renders the README videos
├── docs/                      # README images, skills, phase logs
├── rules/                     # Canonical project rules
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json              # TypeScript config + path aliases
└── README.md
```

The hand-drawn layer view (built bottom-up: utils → pages/api → fixtures → tests → reports):

![Framework layers](docs/images/framework-layers-excalidraw.png)

## Path Aliases

Defined in `tsconfig.json`:

| Alias | Resolves to |
|-------|------------|
| `@ai/*` | `src/ai/*` |
| `@api/*` | `src/api/*` |
| `@config/*` | `src/config/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@pages/*` | `src/pages/*` |
| `@testdata/*` | `src/testdata/*` |
| `@tests/*` | `src/tests/*` |
| `@utils/*` | `src/utils/*` |

Example:
```ts
import logger from '@utils/logger';
import { LoginPage } from '@pages/LoginPage';
import { llmGateway } from '@ai/index';
```

## NPM Scripts

| Script | Purpose |
|--------|---------|
| `test` | Run all tests, all projects |
| `test:headed` | Run with browser visible |
| `test:ui` | Playwright UI mode |
| `test:chromium` / `test:firefox` / `test:webkit` | Per-browser run |
| `test:debug` | Playwright Inspector |
| `test:e2e` | Tag `@e2e` |
| `test:p0` / `test:p1` | Priority-tagged runs |
| `test:lor` | Tag `@lor` |
| `test:report` | Open Playwright HTML report |
| `test:report:ci` | Serve report on `0.0.0.0:9323` for CI |
| `test:allure` | Generate + open Allure HTML |
| `lint` / `lint:fix` | ESLint check / fix |
| `typecheck` | `tsc --noEmit` |
| `format` / `format:check` | Prettier |
| `build` | `tsc` compile |
| `clean` | Wipe reports, results, cache |

## Module System (CommonJS)

**Concept:** The project is plain **CommonJS** — no `"type": "module"`, with tsconfig `module: Node16` / `moduleResolution: Node16`. Relative and path-alias imports are **extensionless**, the way most TS projects read.

**Why:** Faker is pinned to v8 (which has a CommonJS build), so nothing forces the project to ESM. CommonJS keeps imports clean — no `.js` suffix gymnastics.

**Q&A — why this setup?**
- **Q: Do I add `.js` to imports?** A: No. `import { BasePage } from './BasePage'` — extensionless. (Under CommonJS, Node16 resolution adds the extension for you.)
- **Q: Why keep `moduleResolution: Node16` instead of classic `node`?** A: Node16 reads package `exports` maps (needed for modern deps) and isn't deprecated in TypeScript 6+; classic `node` is.
- **Q: What made this CommonJS rather than ESM?** A: Faker version. v8 = dual CJS/ESM → CommonJS works. v9/v10 are ESM-only and would force `"type": "module"` + `.js` extensions everywhere.

```ts
import { BasePage } from './BasePage';            // ✅ relative, no extension
import { LoginPage } from '@pages/LoginPage';      // ✅ alias, no extension
import { test } from '@playwright/test';           // ✅ package
```

## Reporting

| Reporter | Output | Trigger |
|----------|--------|---------|
| Custom TTA | `tta-report/index.html` | auto every run |
| Playwright HTML | `playwright-report/` | auto; `npm run test:report` |
| JSON | `test-results/results.json` | auto |
| Allure | `allure-results/` → `allure-report/` | `npm run test:allure` |
| List (console) | stdout | auto |

The Custom TTA reporter captures test stdout/stderr from `logger.info(...)` and
renders it in each expanded test under **Test Logs**. When a spec uses
`test.step(...)`, the same logs are also distributed into the matching step
details, so API and UI flows show both the action title and the relevant log
line in the report.

**Artifacts captured** (configured in `playwright.config.ts`):

| Artifact | Setting | When |
|----------|---------|------|
| Screenshot (failure) | `screenshot: 'only-on-failure'` | on any failure |
| Per-step screenshots | `visualStep()` helper | every step (see [visualStep](#per-step-screenshots-visualstep)) |
| Video | `video: 'on'` | **always** recorded |
| Trace | `trace: 'on-first-retry'` | on retry |

Allure is enriched with `environmentInfo` (env, baseURL, Node, OS, CI) and failure `categories`.

## AI Agent Rules

This repo ships rules for every major AI coding assistant:

| Tool | File |
|------|------|
| Claude Code | [`CLAUDE.md`](./CLAUDE.md) |
| GitHub Copilot | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) |
| Cursor | [`.cursorrules`](./.cursorrules), [`.cursor/rules/`](./.cursor/rules/) |
| Windsurf | [`.windsurfrules`](./.windsurfrules), [`.windsurf/rules/`](./.windsurf/rules/) |
| Augment Code | [`.augment-guidelines`](./.augment-guidelines), [`.augment/rules/`](./.augment/rules/) |
| Antigravity / Codex / Aider / Jules | [`AGENTS.md`](./AGENTS.md) |

All enforce the same rule: **`npm run typecheck && npm run lint`** after every test change.

## Project Rules

Canonical source: [`rules/`](./rules/).

| Rule | When it applies |
|------|-----------------|
| [test-quality-checks.md](./rules/test-quality-checks.md) | Any change under `src/tests/**` |

## CI/CD

Provider keys and models are **env-driven**, so the same suite runs locally or on CI
(Jenkins / GitHub Actions) with nothing but environment variables — the LLM provider for the
AI Agent Factory is picked by `LLM_PROVIDER` set by the pipeline, and Playwright auto-tunes
retries / workers / `forbidOnly` when `CI` is set.

```mermaid
flowchart LR
    PR[Push / PR] --> CI{CI}
    CI -->|npm ci| Inst[Install + browsers]
    Inst -->|typecheck + lint| Q[Quality gate]
    Q --> T["playwright test<br/>chromium + api"]
    T --> RPT[TTA · Playwright · Allure reports]
    T -->|on failure| RCA[RCA Agent → AI Verdict]
```

| Stage | Command |
|-------|---------|
| Install | `npm ci && npx playwright install --with-deps` |
| Quality gate | `npm run typecheck && npm run lint` |
| Test | `npm test` (or `--project=api` / `--project=chromium`) |
| Report | `test:report:ci` serves on `0.0.0.0:9323`; Allure artifacts uploaded |

---

# Part 3 — Creating the framework 🏗️

Build the framework piece by piece — from the locator wrapper up to full e2e and API flows.
Every section follows the same **Concept → Why → Q&A → diagram → code** rhythm.

## Element Utilities (UtilElementLocator)

**Concept:** `UtilElementLocator` is a thin wrapper around Playwright's `Locator` that exposes intent-revealing action helpers (`click`, `fill`, `getText`, `waitForVisible`, …) and accepts either a CSS string **or** a built `Locator` via the `Flex` type.

**Why:** Page Objects shouldn't repeat `await page.locator(sel).click({ timeout })` everywhere. One wrapper centralises timeouts, logging, and the string-or-Locator ambiguity.

**Q&A — why use this?**
- **Q: Why the `Flex = string | Locator` type?** A: Call sites pass `'[data-test="username"]'` *or* `page.getByTestId('username')` — the wrapper normalises both via `toLocator()`.
- **Q: Where do the debug logs come from?** A: Each instance owns a scoped Winston logger (`createLogger(scope)`); actions like `click`/`fill` emit a `debug` line.
- **Q: Why keep a `type()` method when Playwright deprecated `.type()`?** A: It maps to `pressSequentially()` under the hood but keeps a name students recognise.

```mermaid
flowchart TD
    A["target: Flex (string | Locator)"] --> B{typeof string?}
    B -->|Yes| C["page.locator&#40;target&#41;"]
    B -->|No| D[use Locator as-is]
    C --> E[action: click / fill / getText ...]
    D --> E
    E --> F[log.debug + Playwright call]
```

```ts
import { UtilElementLocator } from '@utils/UtilElementLocator';

const el = new UtilElementLocator(page, 'LoginPage');
await el.fill('[data-test="username"]', 'standard_user');
await el.click(page.getByTestId('login-button'));
await el.waitForVisible('[data-test="inventory-container"]');
```

## Page Objects (BasePage)

**Concept:** `BasePage` is the abstract parent for every Page Object. It wires up the three things each page needs — the `page` handle, an `el` (`UtilElementLocator`), and a scoped `log` — plus a `goto()` navigation helper.

**Why:** Removes boilerplate from every page and guarantees consistent logging scope (the subclass name) and a single navigation pattern.

**Q&A — why use this?**
- **Q: What does the constructor's `scope` argument do?** A: It names the logger and the element-util instance, so logs read `[LoginPage] …`.
- **Q: Does BasePage pre-build any locators?** A: No — subclasses declare their own `private readonly` Locator fields. Base stays intentionally thin.
- **Q: Why is `goto()` protected?** A: Navigation is an internal detail; pages expose intent methods like `open()` instead.

```mermaid
classDiagram
    class BasePage {
        #page: Page
        #el: UtilElementLocator
        #log: Logger
        #goto(path) Promise
    }
    class LoginPage {
        +open() Promise
        +loginAs(user, pass) Promise
    }
    BasePage <|-- LoginPage
```

```ts
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    static readonly PATH = '/playwright/ttacart/index.html';
    private readonly usernameInput = this.page.locator('[data-test="username"]');

    constructor(page: Page) {
        super(page, 'LoginPage');
    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
    }
}
```

## Fixtures (Page Object injection)

**Concept:** `src/fixtures/test-base.ts` extends Playwright's `test` so every Page Object is available as a fixture. Ask for `cartPage` in the test args and it's handed over already constructed against the test's `page`.

**Why:** Removes `new XPage(page)` boilerplate from every spec and gives each test a fresh, isolated instance.

**Q&A — why use this?**
- **Q: Why not just `new LoginPage(page)`?** A: You can — but the fixture centralises construction so a constructor change touches one file, not every spec.
- **Q: Are pages opened for me?** A: No — fixtures hand over *constructed* (not *opened*) objects. Flows reach pages in different orders, so each spec calls `.open()` itself.
- **Q: What about credentials?** A: They come from `@config/credentials`, which reads `.env` (see [Environment Configuration](#environment-configuration)).

```ts
import { test, expect } from '@fixtures/test-base';

test('add to cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.open();
    await inventoryPage.addToCart('tta-bike-light');
    await cartPage.open();
    expect(await cartPage.rowCount()).toBe(1);
});
```

## Test Data Factory (Faker)

**Concept:** `DataGenerator` is a static factory over `@faker-js/faker` producing the data TTACart needs — login credentials, checkout customer info, and full user profiles.

**Why:** Hard-coded fixtures rot and collide. Random-but-typed data keeps tests independent and surfaces validation bugs.

**Q&A — why use this?**
- **Q: Why static methods?** A: No state to hold — call `DataGenerator.credentials()` without `new`.
- **Q: What's `checkoutCustomer()` for?** A: The TTACart checkout step-one form needs `firstName`, `lastName`, `postalCode` — one call returns all three.
- **Q: Which Faker version?** A: Pinned to **v8** (`@faker-js/faker@^8.4.1`) because it ships a CommonJS build — v9/v10 are ESM-only. v8 API: `faker.internet.userName()` (lowercase `username()` is v9+) and `faker.location.zipCode()` (v8 renamed `address` → `location`).

```mermaid
mindmap
  root((DataGenerator))
    credentials
      username
      password
    checkoutCustomer
      firstName
      lastName
      postalCode
    userProfile
      email
      fullName
      phone
```

```ts
import { DataGenerator } from '@utils/DataGenerator';

const { username, password } = DataGenerator.credentials();
const customer = DataGenerator.checkoutCustomer();
// { firstName: 'Jaylen', lastName: 'Hahn', postalCode: '90210' }
```

## Writing Tests — Steps + Logging

**Concept:** Wrap each logical action in `test.step('label', async () => {…})` and emit a scoped logger line inside it. The custom TTA reporter surfaces both — step titles **and** their console output.

**Why:** Plain Page-Object calls don't appear as steps in the report. `CustomReporter` records `step.category === 'test.step'`, keeps test-level logs in the expanded test panel, and pipes test stdout into each step's console block when steps are present.

**Q&A — why use this?**
- **Q: Why does the report show no step breakdown without this?** A: Without `test.step()`, logs still appear under **Test Logs**, but there are no `test.step` categories for the reporter to render as individual steps.
- **Q: Where do per-step logs come from?** A: `associateLogsWithSteps` matches test stdout (your `log.info(...)`) to steps by title and order.
- **Q: Do I still get the assertion?** A: Yes — `expect()` lives inside its own step, so a failure pins to that step.

```mermaid
sequenceDiagram
    participant T as test.step
    participant R as CustomReporter
    T->>R: onStepBegin (category=test.step)
    T->>T: log.info(...) → stdout
    T->>R: onStepEnd (title, duration, status)
    R->>R: associateLogsWithSteps(stdout)
    R-->>R: render step + console block in HTML
```

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { createLogger } from '@utils/logger';

const log = createLogger('login.spec');

test('logs in with valid credentials @p0', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await test.step('Open the TTACart login page', async () => {
        log.info('Opening the TTACart login page');
        await loginPage.open();
    });
    await test.step('Login as standard_user', async () => {
        log.info('Logging in as standard_user');
        await loginPage.loginAs('standard_user', 'tta_secret');
    });
    await test.step('Verify login form is hidden', async () => {
        await expect(page.locator('[data-test="login-button"]')).toBeHidden();
    });
});
```

## Per-Step Screenshots (visualStep)

**Concept:** `visualStep(page, title, fn)` wraps `test.step`, runs the step, then grabs a screenshot and attaches it as `step-<index>-<slug>` — the exact name the `CustomReporter` maps back to that step. Result: one image per step in the HTML report.

**Why:** Playwright's built-in `screenshot: 'only-on-failure'` captures a single frame at the failure point. `visualStep` gives a visual trail of *every* step, pass or fail — great for demos and debugging.

**Q&A — why use this?**
- **Q: How does the reporter know which screenshot belongs to which step?** A: By the attachment name `step-N-...`; the steps run sequentially so `N` matches the reporter's own step index.
- **Q: Does it slow tests down?** A: A little — one screenshot per step. Use it on showcase/e2e specs, not every micro-test.
- **Q: When is the shot taken?** A: At the *end* of the step, so it shows the resulting state.

```ts
import { visualStep } from '@utils/visualStep';

await visualStep(page, 'Open the cart', async () => {
    await cartPage.open();
    expect(await cartPage.rowCount()).toBe(1);
});
```

## End-to-End Checkout Flow

**Concept:** `src/tests/e2e/e2e-checkout.spec.ts` is the flagship test — log in → inventory → add item → cart → checkout step one → step two → order complete, each as a logged, screenshotted step driven entirely through Page Objects.

**Why:** Proves the whole stack (fixtures + Page Objects + DataGenerator + logger + reporter) works together against the live TTACart app.

**Q&A — why use this?**
- **Q: Where do the customer details come from?** A: `DataGenerator.checkoutCustomer()` — random first/last name + postal code per run.
- **Q: How is "order complete" verified?** A: `CheckoutCompletePage.assertOrderComplete()` checks the URL and the "Thank you for your order!" header.
- **Q: Why tags in the describe title?** A: Tags drive filtered runs (`npm run test:p0`) and show up as labels in the Allure report.

```mermaid
flowchart LR
    L[Login] --> I[Inventory] --> A[Add item] --> C[Cart]
    C --> S1["Checkout step 1<br/>guest details"]
    S1 --> S2["Checkout step 2<br/>overview"]
    S2 --> D[Order complete ✅]
```

```ts
test('should complete checkout successfully', async ({
    inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage, checkoutCompletePage, page,
}) => {
    const customer = DataGenerator.checkoutCustomer();
    await visualStep(page, 'Go to the inventory page', async () => inventoryPage.open());
    await visualStep(page, 'Add one item to the cart', async () => inventoryPage.addToCart(FIRST_ITEM_ID));
    await visualStep(page, 'Open the cart', async () => {
        await cartPage.open();
        expect(await cartPage.rowCount()).toBe(1);
    });
    await visualStep(page, 'Fill guest details (checkout step one)', async () => {
        await cartPage.checkout();
        await checkoutStepOnePage.fillGuest(customer);
        await checkoutStepOnePage.continue();
    });
    await visualStep(page, 'Finish the order (checkout step two)', async () => checkoutStepTwoPage.finish());
    await visualStep(page, 'Order is complete', async () => checkoutCompletePage.assertOrderComplete());
});
```

## API Testing

API coverage targets Restful Booker by default and runs through Playwright's
`APIRequestContext`, not a browser page. Set `TTA_ENV=api` to resolve
`baseURL` from `API_BASE_URL`:

```bash
TTA_ENV=api npm test -- --project=api
npx playwright test src/tests/apiTests/02_restfulbooker_apiHelper/create-booking.spec.ts --project=api
```

![TTA custom report overview for API and UI runs](docs/images/tta-report-overview.png)

### Dedicated API Project

API specs live under `src/tests/apiTests/` and run through the dedicated
Playwright `api` project:

```ts
{
  name: 'api',
  testMatch: /src\/tests\/apiTests\/.*\.spec\.ts/,
}
```

Browser projects ignore API specs, so request-only tests are not duplicated
across Chromium, Firefox, WebKit, or mobile browser projects.

### API Learning Layers

The API examples are split into layers so the same Restful Booker workflow can
grow from direct Playwright calls into reusable framework code:

| Layer | Location | Purpose |
|-------|----------|---------|
| Raw Playwright requests | `src/tests/apiTests/01_restfulbooker_raw/` | Uses the built-in `request` fixture directly for `GET`, `POST`, `PUT`, auth token, and CRUD examples. |
| Shared API helper | `src/tests/apiTests/02_restfulbooker_apiHelper/` + `src/utils/ApiHelper.ts` | Wraps `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, query params, retry polling, typed JSON parsing, and status helpers. |
| Typed API client layer | `src/api/` + `src/tests/apiTests/03_restfulbooker_fixture_e2e/` | Home for endpoint-specific clients such as `BookingApi`, plus payload/response models and reusable flow verification as the API framework grows. |
| JSONPath response queries | `src/tests/apiTests/04_jsonpath_plus/` | Query JSON responses with `jsonpath-plus` — root, child, recursive descent, wildcard, index, slice, and filtration. Ships a [cheat sheet](src/tests/apiTests/04_jsonpath_plus/jsonpath-cheatsheet.md). |
| JSON Schema validation | `src/tests/apiTests/05_ajv_schema/` + `src/utils/schemaValidator.ts` + `src/testdata/schemas/` | Contract-test responses against Draft-07 JSON Schema with `ajv` + `ajv-formats`. |
| AI-generated test data | `src/tests/apiTests/06_ai_datagen/` + `src/ai/` | Prompt the LLM gateway for schema-valid test data, then validate + use it (see the [Showcase](#-showcase--ai-agent-factory)). |

Helper-based tests should prefer aliases and framework utilities:

```ts
import { expect, test } from '@playwright/test';
import { ApiHelper } from '@utils/ApiHelper';

test('POST /booking creates a booking @p0', async ({ request }) => {
    const api = new ApiHelper(request);
    const response = await api.post('/booking', {
        firstname: 'Pramod',
        lastname: 'Dutta',
        totalprice: 111,
        depositpaid: true,
        bookingdates: { checkin: '2026-04-01', checkout: '2026-04-10' },
        additionalneeds: 'Breakfast',
    });

    expect(api.isSuccess(response)).toBe(true);
});
```

For multi-step API flows, use `test.describe.serial` and a typed state object to
pass values like auth tokens and booking IDs between tests:

```ts
interface BookingFlowState {
    token?: string;
    bookingId?: number;
}

test.describe.serial('Restful Booker CRUD API', () => {
    const bookingFlowState: BookingFlowState = {};

    test('TC#1 @p0 - Create token', async ({ request }) => { /* set token */ });
    test('TC#2 @p0 - Create booking', async ({ request }) => { /* set bookingId */ });
    test('TC#3 @p0 - Update booking', async ({ request }) => { /* use token + bookingId */ });
});
```

## JSONPath Queries (jsonpath-plus)

**Concept:** [`jsonpath-plus`](https://github.com/JSONPath-Plus/JSONPath) lets you pull values out of a JSON document with a single path expression instead of manual `obj.a.b[0].c` chaining. Every query returns an **array of matches**.

**Why:** API responses are nested and array-heavy. One expression like `$.store.book[?(@.price < 10)]` replaces a loop-and-filter block and reads like a question.

**Q&A — why use this?**
- **Q: What's the difference between `.` and `..`?** A: `.child` is a direct child; `..child` (recursive descent) finds the key at **any** depth.
- **Q: How do I filter?** A: `[?(@.field <op> value)]` where `@` is the current element, e.g. `[?(@.category === 'fiction')]`.
- **Q: Does it ever return a single value?** A: By default no — always an array (take `[0]`), unless you pass `{ wrap: false }`.

```mermaid
flowchart TD
    R["$ root"] --> C["$.store.book child"]
    C --> RD["$..price recursive descent"]
    C --> W["$.store.book[*] wildcard"]
    C --> IDX["$.store.book[0] index"]
    C --> SL["$.store.book[0:2] slice"]
    C --> F["$.store.book[?(@.price < 10)] filter"]
```

```ts
import { JSONPath } from 'jsonpath-plus';

const cheap = JSONPath({ path: '$.store.book[?(@.price < 10)]', json: data });
const authors = JSONPath({ path: '$.store.book[*].author', json: data });
const allPrices = JSONPath({ path: '$..price', json: data }); // any depth
const lastBook = JSONPath({ path: '$.store.book[-1:]', json: data })[0];
```

Full operator reference: [`jsonpath-cheatsheet.md`](src/tests/apiTests/04_jsonpath_plus/jsonpath-cheatsheet.md). Runnable demo: [`jsonpath-queries.e2e.spec.ts`](src/tests/apiTests/04_jsonpath_plus/jsonpath-queries.e2e.spec.ts).

## JSON Schema Validation (Ajv)

**Concept:** Validate an API response against a **Draft-07 JSON Schema** with [`ajv`](https://ajv.js.org) + `ajv-formats`. `validateSchema(schema, data)` returns `{ valid, errors, errorText }` so a single `expect` covers the entire response shape.

**Why:** Field-by-field `expect` assertions miss added/removed/retyped fields. A schema is one contract check that catches structural drift — and `additionalProperties: false` flags unexpected keys.

**Q&A — why use this?**
- **Q: Why `ajv-formats`?** A: It enforces `format` keywords like `"date"`, `"email"`, `"uri"` — without it those formats are ignored.
- **Q: Where do schemas live?** A: `src/testdata/schemas/*.schema.json`, loaded in specs via `fs.readFileSync`.
- **Q: Why is the project on `ajv@8`?** A: `ajv-formats@3` requires Ajv v8; the repo pins `ajv@^8` directly.

```mermaid
flowchart LR
    S[*.schema.json] --> V["validateSchema&#40;schema, body&#41;"]
    B[API response] --> V
    V -->|valid| P[expect valid toBe true]
    V -->|invalid| E[errorText → failing assertion]
```

```ts
import { validateSchema } from '@utils/schemaValidator';
import * as fs from 'fs';
import * as path from 'path';

const schema = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../testdata/schemas/create-booking.schema.json'), 'utf-8'),
);

const body = await bookingApi.createBooking(buildBooking({ firstname: 'Schema' }));
const { valid, errorText } = validateSchema(schema, body);
expect(valid, errorText).toBe(true);
```

Runnable demo: [`create-booking-schema.spec.ts`](src/tests/apiTests/05_ajv_schema/create-booking-schema.spec.ts).

## Test Tags & Filtering

Tag your tests:

```ts
test('login with valid creds @p0 @smoke @e2e', async ({ page }) => { /* ... */ });
```

Filter:

```bash
npm run test:p0           # @p0 only
npm run test:e2e          # @e2e only
npx playwright test --grep "@smoke"
npx playwright test --grep-invert "@flaky"
```

## Logging (Winston)

```ts
import logger from '@utils/logger';

logger.info('login start', { user: 'pramod' });
logger.warn('slow API response', { ms: 3200 });
logger.error('test failed', new Error('boom'));
logger.debug('payload %o', { id: 1 });
```

Output:
- Console — colorized, timestamped
- `logs/error.log` — errors only (JSON, 5MB rotation × 5)
- `logs/combined.log` — everything (JSON, 5MB rotation × 5)

Scoped child loggers tag every line with their origin:

```ts
import { createLogger } from '@utils/logger';

const log = createLogger('LoginPage');
log.info('loginAs standard_user');
// 2026-06-02 08:10:23 [info] [LoginPage] loginAs standard_user
```

## Custom TTA Report — Visual Flow

The custom `CustomReporter.ts` produces a branded, real-time HTML report at
`tta-report/report_<timestamp>.html`. For the end-to-end checkout test it shows
the **whole journey** — every step with its console log, its own screenshot, and
the run video.

**Overview** — stats dashboard, environment bar, and the filterable test table:

![TTA report overview](docs/images/tta-report-overview.png)

**End-to-end flow** — expand the test row: each of the 6 steps shows its log
line and a screenshot, followed by the screenshots gallery and the run video:

![TTA report — e2e checkout flow](docs/images/tta-report-e2e-flow.png)

---

# 🤖 Showcase — AI Agent Factory

> **The headline feature.** This framework doesn't just *run* tests — it lets agents **plan, generate, heal,
> and explain** them. Two agent layers ship in the box: **IDE agents** that drive your editor
> (`.github/agents/`) and a runtime **AI Agent Factory** (`src/ai/`) that adds LLM-powered test-data
> generation, root-cause analysis and flaky detection straight into the report.

### 🎬 The 3 demo videos (rendered with Remotion)

| Install & run | How it's built | AI Agent Factory |
|:---:|:---:|:---:|
| [![Install](docs/images/install-demo.gif)](docs/images/install-demo.mp4) | [![Structure](docs/images/structure-demo.gif)](docs/images/structure-demo.mp4) | [![Agent Factory](docs/images/agent-factory-demo.gif)](docs/images/agent-factory-demo.mp4) |

*Click any GIF for the full-quality MP4.* All three are generated programmatically from the real
framework with [Remotion](https://www.remotion.dev/) — source in [`remotion/`](./remotion/):

```bash
cd remotion && npm install
npx remotion render src/index.ts InstallFlow     ../docs/images/install-demo.mp4
npx remotion render src/index.ts FrameworkLayers ../docs/images/structure-demo.mp4
npx remotion render src/index.ts AgentFactory    ../docs/images/agent-factory-demo.mp4
```

### 🗺️ Architecture at a glance

![TTA agent architecture — hand-drawn in Excalidraw](docs/images/agent-architecture-excalidraw.png)

> ✏️ **Edit it live** on [Excalidraw](https://excalidraw.com/#json=jM9uCcpUVNCV8ABkwmbAC,Hk5UeqlV5N8J-cJvViydwg) · clean SVG variant: [`agent-architecture.svg`](docs/images/agent-architecture.svg).

```mermaid
flowchart TB
    subgraph IDE["IDE agents — .github/agents (MCP + CLI)"]
        P[1. Planner] -->|specs/| G[2. Generator] -->|spec| H[3. Healer]
        H -. "fix in POM / @testdata, re-run" .-> G
    end
    subgraph AI["src/ai — AI Agent Factory (@ai/index)"]
        GW[LLM Gateway<br/>OpenRouter · Groq · OpenAI]
        GW --> DG[DataGenerator] --> R[(Custom Report<br/>AI Verdict)]
        GW --> RCA[RCA Agent] --> R
        GW --> FL[Flaky Analyzer] --> R
    end
```

### 1️⃣ IDE agents — plan → generate → heal

Three framework-aware agents (Copilot / Claude / opencode), each in an **MCP** and a token-cheap **CLI**
flavour. Each one knows *this* repo's Page Objects, fixtures, tags and the `typecheck + lint` gate, so the
output obeys the rules instead of inventing its own.

| Agent | Input | Output |
|-------|-------|--------|
| **Planner** | a URL / feature | a framework-aware plan in `specs/` (names the exact POMs, fixtures, tags) |
| **Generator** | the plan | a POM-based spec in `src/tests/**` — no raw selectors, then `npm run typecheck && npm run lint` |
| **Healer** | a failing test | a fix *in the right layer* — selector → Page Object, payload → `@testdata` |

| Folder | Driver | When to use |
|--------|--------|-------------|
| [`.github/agents/`](./.github/agents/) | Playwright **MCP** server (`run-test-mcp-server`) | Richest tool surface; higher token cost. |
| [`.github/agents/cli/`](./.github/agents/cli/) (`*-cli`) | Playwright **CLI** (`playwright-cli`) | Same rules, far cheaper — each command returns a compact snapshot file with `eN` refs instead of a full DOM dump. |

### 2️⃣ AI Agent Factory (`src/ai/`) — agents from a prompt

A light, additive layer (imports via `@ai/*`, zero new runtime deps — native `fetch`). One OpenAI-compatible
gateway fronts **OpenRouter / Groq / OpenAI**, with the model list externalised in
[`src/ai/models.json`](./src/ai/models.json) and the provider chosen by env (`LLM_PROVIDER` / `LLM_MODEL`).

```ts
import { llmGateway, generateTestData, analyzeFailure } from '@ai/index';

// (a) raw gateway — provider/model from env + models.json
const gw = llmGateway();
const res = await gw.chat({ messages: [{ role: 'user', content: 'Return JSON {"ok":true}' }] });

// (b) CustomDataGenerator agent — prompt -> schema-valid testdata.json on disk
const { filePath } = await generateTestData({
  structurePath: 'src/testdata/structures/user-profile.structure.json',
  prompt: 'Generate one realistic adult user profile from Germany.',
  name: 'user-profile',
});

// (c) RCA agent — a failure -> { severity, priority, rootCause, fixes } in the "AI Verdict" tab
const verdict = await analyzeFailure({ title, file, error, stack });
```

| Agent | What it does |
|-------|--------------|
| **`llmGateway()`** | one entry point to every LLM provider (OpenRouter/Groq/OpenAI), JSON mode, native `fetch` |
| **`generateTestData()`** | prompt + JSON structure → LLM → Ajv-validated data → unique `testdata.json` |
| **`analyzeFailure()`** (RCA) | failed test → severity / priority / root cause / fixes → **AI Verdict** in the report |
| **`analyzeFlaky()`** | compares build 1 vs build 2 results to surface flaky tests |

The `@ai`-tagged specs live in [`src/tests/apiTests/06_ai_datagen/`](./src/tests/apiTests/06_ai_datagen/).

### 3️⃣ Reports — step by step

The agents' work lands in three reports. Run `npm test`, then:

**Step 1 — Custom TTA report** (`tta-report/`, our `CustomReporter`) — branded dashboard with per-step
screenshots and the **AI Data · AI Verdict · AI Flaky** tabs fed by the factory:

![Custom TTA report](docs/images/agent-report-tta.png)

**Step 2 — Playwright HTML report** (`npm run test:report`) — note the `@ai`-tagged agent tests:

![Playwright HTML report](docs/images/agent-report-playwright.png)

**Step 3 — Allure report** (`npm run test:allure`) — trends, suites and environment:

![Allure report](docs/images/agent-report-allure.png)

### 🎓 Want the full build?

This agent factory is taught end-to-end in **[The Testing Academy](https://www.thetestingacademy.com/)**
Advance Playwright course — building the LLM gateway, the RCA/flaky agents, the custom reporter and the
plan→generate→heal agent loop from scratch.

> 🎥 *Course walkthrough video:* [![Watch the build](docs/images/agent-report-tta.png)](https://www.youtube.com/@TheTestingAcademy)
> <!-- Replace the link above with your CI/CD pipeline walkthrough video. -->

---

## Phase 1 Walkthrough

Full prompt-by-prompt build log for Phase 1 lives at [`docs/phase1/prompts.md`](./docs/phase1/prompts.md). Replay every step to recreate the framework from scratch.

---

## Contributing

1. Fork
2. Branch (`git checkout -b feat/my-thing`)
3. Add tests + `npm run typecheck && npm run lint`
4. Commit + push
5. Open PR

---

## Author

Built with 💚 by **[Pramod Dutta](https://thetestingacademy.com)** — [The Testing Academy](https://www.youtube.com/@TheTestingAcademy).

---

## License

ISC.
