/**
 * test-base — the project's custom Playwright `test`, pre-wired with a fixture
 * for every TTACart Page Object.
 *
 * Instead of `new LoginPage(page)` in each spec, ask for the page you need and
 * it's handed over already constructed against the test's `page`:
 *
 *   import { test, expect } from '@fixtures/test-base';
 *
 *   test('add to cart', async ({ inventoryPage, cartPage }) => {
 *       await inventoryPage.open();
 *       await inventoryPage.addToCart('tta-bike-light');
 *       await cartPage.open();
 *       expect(await cartPage.rowCount()).toBe(1);
 *   });
 *
 * Fixtures hand over *constructed* page objects, not *opened* ones — different
 * flows reach pages in different orders (you might land on the cart via a UI
 * click, not goto). So each spec calls `.open()` (or navigates) itself.
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { ItemDetailPage } from '@pages/ItemDetailPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutStepOnePage } from '@pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '@pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '@pages/CheckoutCompletePage';


export type TestFixture = {

    // Page Objects
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    itemDetailPage: ItemDetailPage;
    cartPage: CartPage;
    checkoutStepOnePage: CheckoutStepOnePage;
    checkoutStepTwoPage: CheckoutStepTwoPage;
    checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<TestFixture>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
    itemDetailPage: async ({ page }, use) => {
        await use(new ItemDetailPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutStepOnePage: async ({ page }, use) => {
        await use(new CheckoutStepOnePage(page));
    },
    checkoutStepTwoPage: async ({ page }, use) => {
        await use(new CheckoutStepTwoPage(page));
    },
    checkoutCompletePage: async ({ page }, use) => {
        await use(new CheckoutCompletePage(page));
    },
});

export { expect } from '@playwright/test';