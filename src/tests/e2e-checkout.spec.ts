/**
 * End-to-end checkout flow:
 *   1. Log in as a standard user (standard_user / tta_secret).
 *   2. Navigate to the inventory page.
 *   3. Add the first item to the cart.
 *   4. Navigate to the cart page.
 *   5. From the cart, proceed through checkout step one and checkout step two.
 *   6. Enter the customer details and complete the order.
 */

import { test, expect } from '@fixtures/test-base';
import { DataGenerator } from '@utils/DataGenerator';
import { credentials } from '@config/credentials';
import { createLogger } from '@utils/logger';
import { visualStep } from '@utils/visualStep';

const log = createLogger('e2e-checkout');

// First product card on the TTACart inventory page.
const FIRST_ITEM_ID = 'test-allthethings-tshirt-red';

test.describe('@P0 @Regression E2E @Checkout Checkout Feature', () => {
    // Step 1 — every test in this suite starts already logged in.
    test.beforeEach(async ({ loginPage }) => {
        log.info(`Step 1: logging in as ${credentials.standardUser}`);
        await loginPage.open();
        await loginPage.loginAs(credentials.standardUser, credentials.password);
    });

    test('should complete checkout successfully', async ({
        page,
        inventoryPage,
        cartPage,
        checkoutStepOnePage,
        checkoutStepTwoPage,
        checkoutCompletePage,
    }) => {
        const customer = DataGenerator.checkoutCustomer();

        // Step 2 — inventory
        await visualStep(page, 'Go to the inventory page', async () => {
            log.info('Step 2: navigating to the inventory page');
            await inventoryPage.open();
        });

        // Step 3 — add one item
        await visualStep(page, 'Add one item to the cart', async () => {
            log.info(`Step 3: adding item "${FIRST_ITEM_ID}" to the cart`);
            await inventoryPage.addToCart(FIRST_ITEM_ID);
        });

        // Step 4 — cart, then checkout step one + step two
        await visualStep(page, 'Open the cart', async () => {
            log.info('Step 4: opening the cart and verifying one row');
            await cartPage.open();
            expect(await cartPage.rowCount()).toBe(1);
        });

        await visualStep(page, 'Fill guest details (checkout step one)', async () => {
            log.info(`Step 5a: filling guest details for ${customer.firstName} ${customer.lastName}`);
            await cartPage.checkout();
            await checkoutStepOnePage.assertLoaded();
            await checkoutStepOnePage.fillGuest(customer);
            await checkoutStepOnePage.continue();
        });

        await visualStep(page, 'Finish the order (checkout step two)', async () => {
            log.info('Step 5b: reviewing the overview and finishing the order');
            await checkoutStepTwoPage.assertLoaded();
            await checkoutStepTwoPage.finish();
        });

        // Step 5 — order complete
        await visualStep(page, 'Order is complete', async () => {
            log.info('Step 6: asserting the order is complete');
            await checkoutCompletePage.assertOrderComplete();
        });
    });






});
