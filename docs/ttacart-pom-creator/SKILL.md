---
name: ttacart-pom-creator
description: >-
  Generate a Playwright Page Object (POM) class for the TTACart demo app
  (app.thetestingacademy.com/playwright/ttacart) by driving the live page and
  reading its real selectors. Use this whenever the user gives a TTACart page
  URL plus a flow to reach it and asks to "create a page object", "build the
  POM", "scaffold a page class", "POM this page", "generate the page object for
  the checkout/inventory/cart page", or pastes a TTACart URL and wants a typed
  page class — even if they don't say the word "POM". The generated class
  extends BasePage and matches the existing LoginPage / CartPage / InventoryPage
  conventions exactly (data-test locators, .js ESM imports, the `el` wrapper,
  `open()` + `assertLoaded()`), then is wired into the pages barrel and verified
  with typecheck + lint.
---

# TTACart Page Object Creator

Turn a live TTACart page into a Page Object class that looks like it was
hand-written by the same author as the rest of `src/pages/`. The whole point is
**consistency** — a new page class should be indistinguishable in style from
`LoginPage.ts`, `CartPage.ts`, `InventoryPage.ts`, and `ItemDetailPage.ts`.

## Why drive the live page instead of guessing selectors

TTACart marks every meaningful element with a `data-test` attribute (e.g.
`[data-test="checkout"]`). Those are the stable selectors the framework uses.
You cannot reliably invent them — you must read them off the rendered DOM. The
accessibility snapshot alone is **not enough**: it shows roles and text but
*hides* `data-test` attributes. So the key move is a `browser_evaluate` call
that dumps every `[data-test]` element. That is the source of truth.

## Inputs you need from the user

1. **Target URL** — the page to model, e.g.
   `https://app.thetestingacademy.com/playwright/ttacart/checkout-step-one.html`
2. **The flow to reach it** — most TTACart pages require login (and often items
   in the cart) first. Typical flow: login (`standard_user` / `tta_secret`) →
   inventory → add an item → navigate to the target. If the user doesn't spell
   it out, assume that standard flow and tell them what you assumed.
3. **Class name** (optional) — defaults to the page, e.g. checkout-step-one →
   `CheckoutStepOnePage`.

If the URL or flow is missing, ask — don't guess a URL.

## Workflow

### 1. Drive the browser to the target page (Playwright MCP)

Use the `mcp__playwright__browser_*` tools. Standard path:

- `browser_navigate` to the login page
  (`.../playwright/ttacart/index.html`).
- `browser_snapshot` to get element refs, then `browser_fill_form` /
  `browser_type` + `browser_click` to log in as `standard_user` / `tta_secret`.
- Walk the rest of the flow (open inventory, add an item, etc.). Prefer
  `browser_navigate` to a known `.html` URL when you just need to land on a
  page; use clicks when the flow's state matters (e.g. adding to cart).
- Land on the **target URL**.

### 2. Capture the real selectors

On the target page, run BOTH:

- `browser_snapshot` — gives you the structure, headings, and link targets.
- `browser_evaluate` with this function to dump the `data-test` map (this is the
  part that actually drives the locator fields):

```js
() => {
  const out = [];
  document.querySelectorAll('[data-test]').forEach(el => {
    out.push({
      tag: el.tagName.toLowerCase(),
      dataTest: el.getAttribute('data-test'),
      href: el.getAttribute('href') || null,
      text: (el.textContent || '').trim().slice(0, 50),
    });
  });
  return out;
}
```

### 3. Map selectors → locator fields

- One `private readonly` Locator field per meaningful element. Name fields by
  *intent* (`checkoutButton`, `itemRows`, `firstNameInput`), not by selector.
- **Lists** (repeated rows) → a single Locator that matches all of them
  (`page.locator('[data-test="inventory-item"]')`), exposed via a `count()` or
  `getAllTexts()` method.
- **Per-id elements** (e.g. `remove-tta-bike-light`, `add-to-cart-<id>`) → a
  private builder method, not a field:
  ```ts
  private removeBtn(id: string): Locator {
      return this.page.locator(`[data-test="remove-${id}"]`);
  }
  ```
- Ignore boilerplate shared chrome (sidebar/menu/footer/social links) unless the
  flow actually needs it — the existing pages don't model it.

### 4. Generate `<Name>Page.ts`

Write to `src/pages/<Name>Page.ts` using the template below. Match indentation
(4 spaces) and the JSDoc-usage-example header style of the existing files.

### 5. Wire it into the barrel

Add `export { <Name>Page } from './<Name>Page';` to `src/pages/index.ts`. If a
commented-out placeholder for it exists, uncomment that.

### 6. Verify (required — project rule)

Run both and confirm exit 0:

```bash
npm run typecheck
npm run lint
```

Fix anything they flag (a common one: a declared locator you never use → either
use it in `assertLoaded()` or drop it). Report the results honestly.

## The class template

This is the exact shape every TTACart page follows. Keep it.

```ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TTACart <human name> page.
 *
 *   const page = new <Name>Page(page);
 *   await page.open();
 *   await page.<primaryAction>();
 */
export class <Name>Page extends BasePage {
    static readonly PATH = '/playwright/ttacart/<file>.html';

    private readonly title: Locator;
    // ...one private readonly Locator per meaningful element

    constructor(page: Page) {
        super(page, '<Name>Page');
        this.title = page.locator('[data-test="title"]');
        // ...assign each locator with a [data-test="..."] selector
    }

    async open(): Promise<void> {
        await this.goto(<Name>Page.PATH);
        await this.assertLoaded();
    }

    async assertLoaded(): Promise<void> {
        // Pin the page: assert URL and/or a stable heading.
        await expect(this.title).toContainText('<expected heading>');
    }

    // ...intent-named action + read methods, all going through `this.el`
}
```

### Non-negotiable conventions (why each matters)

- **`import { BasePage } from './BasePage';`** — the project is CommonJS (no
  `"type": "module"`, tsconfig `module: Node16`). Relative/alias imports are
  **extensionless** — do NOT add `.js`. Package imports (`@playwright/test`) are
  bare too.
- **`extends BasePage` + `super(page, '<Name>Page')`** — gives you `this.page`,
  `this.el`, and a scoped `this.log` for free. The scope string is the class
  name so logs read `[<Name>Page] …`.
- **Actions go through `this.el`** (the `UtilElementLocator` wrapper), not raw
  `locator.click()`. This centralises timeouts + per-action debug logging.
  Available helpers: `click`, `doubleClick`, `rightClick`, `hover`, `fill`,
  `type`, `clear`, `pressSequentially`, `getText`, `getInnerText`,
  `getAllTexts`, `getAttr`, `getValue`, `count`, `isVisible`, `isEnabled`,
  `isChecked`, `waitForVisible`, `waitForHidden`, `waitForPageLoad`,
  `selectByText`, `selectByValue`, `selectByIndex`.
- **`static readonly PATH`** — the page's relative URL. `open()` always
  `goto(PATH)` then `assertLoaded()`.
- **`assertLoaded()`** — a cheap guard so a misnavigation fails fast with a clear
  message instead of a confusing downstream error. Assert a heading and/or URL.
- **Navigation methods** that leave the page (`checkout()`, `continueShopping()`)
  end with `await this.page.waitForLoadState('domcontentloaded')`.
- **`private readonly`** locator fields — assigned once in the constructor, never
  reassigned.

## Worked example — CartPage

Flow: login → inventory → add an item → open `cart.html`. The `data-test` dump
yielded `title`, `inventory-item` (rows), `inventory-item-name`,
`continue-shopping`, `checkout`, and per-id `remove-<id>`. That produced:

```ts
import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    static readonly PATH = '/playwright/ttacart/cart.html';

    private readonly title: Locator;
    private readonly itemRows: Locator;
    private readonly itemNames: Locator;
    private readonly continueShoppingLink: Locator;
    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page, 'CartPage');
        this.title = page.locator('[data-test="title"]');
        this.itemRows = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.continueShoppingLink = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async open(): Promise<void> {
        await this.goto(CartPage.PATH);
        await this.assertLoaded();
    }

    async assertLoaded(): Promise<void> {
        await expect(this.title).toContainText('Your Cart');
    }

    async itemNamesList(): Promise<string[]> {
        return this.el.getAllTexts(this.itemNames);
    }

    async rowCount(): Promise<number> {
        return this.itemRows.count();
    }

    async remove(id: string): Promise<void> {
        await this.el.click(this.page.locator(`[data-test="remove-${id}"]`));
    }

    async continueShopping(): Promise<void> {
        await this.el.click(this.continueShoppingLink);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async checkout(): Promise<void> {
        await this.el.click(this.checkoutButton);
        await this.page.waitForLoadState('domcontentloaded');
    }
}
```

## Final report to the user

State: the page modelled, the file path, which selectors were captured, the
barrel update, and the typecheck/lint results (exit codes). If you assumed a
flow or skipped any chrome elements, say so.
