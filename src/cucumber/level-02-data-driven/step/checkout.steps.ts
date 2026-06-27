import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld, CREDS } from '../../support/world';
import type { CheckoutCustomer } from '../../../utils/DataGenerator';

type CustomerBook = Record<string, CheckoutCustomer>;

const customers: CustomerBook = JSON.parse(
    readFileSync(join(__dirname, '../data/customers.json'), 'utf-8'),
);

// ---------- shared Given steps ----------
Given('I am logged in as a standard user', async function (this: CustomWorld) {
    await this.loginPage.open();
    await this.loginPage.loginAs(CREDS.standardUser, CREDS.password);
    await this.inventoryPage.assertLoaded();
});

Given('I am on the products page', async function (this: CustomWorld) {
    await this.inventoryPage.open();
});

// ---------- Scenario Outline outcome ----------
Then('I should see the {string}', async function (this: CustomWorld, outcome: string) {
    if (outcome === 'products') {
        await this.inventoryPage.assertLoaded();
    } else {
        await expect(this.page.locator('[data-test="error"]')).toBeVisible();
    }
});

// ---------- Data Table ----------
When(
    'I add the following products to the cart:',
    async function (this: CustomWorld, table: DataTable) {
        for (const { productId } of table.hashes()) {
            await this.inventoryPage.addToCart(productId);
        }
    },
);

Then('the cart should contain {int} products', async function (this: CustomWorld, count: number) {
    await this.cartPage.open();
    expect(await this.cartPage.rowCount()).toBe(count);
});

// ---------- single product + external-data checkout ----------
When('I add product {string} to the cart', async function (this: CustomWorld, productId: string) {
    await this.inventoryPage.addToCart(productId);
});



When('I check out as the {string} customer', async function (this: CustomWorld, persona: string) {
    const customer = customers[persona];
    if (!customer) throw new Error(`No customer "${persona}" in customers.json`);

    await this.cartPage.open();
    await this.cartPage.checkout();
    await this.checkoutStepOnePage.assertLoaded();
    await this.checkoutStepOnePage.fillGuest(customer);
    await this.checkoutStepOnePage.continue();
    await this.checkoutStepTwoPage.assertLoaded();
    await this.checkoutStepTwoPage.finish();
});

Then('the order should be confirmed', async function (this: CustomWorld) {
    await this.checkoutCompletePage.assertOrderComplete();
});