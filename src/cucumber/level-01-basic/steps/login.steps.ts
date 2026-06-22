import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Given('I am on the TTACart login page', async function (this: CustomWorld) {
    await this.loginPage.open();
});

When(
    'I log in as {string} with password {string}',
    async function (this: CustomWorld, username: string, password: string) {
        await this.loginPage.loginAs(username, password);
    },
);

Then('I should land on the products page', async function (this: CustomWorld) {
    await this.inventoryPage.assertLoaded();
});

Then(
    'I should see a login error containing {string}',
    async function (this: CustomWorld, fragment: string) {
        const error = this.page.locator('[data-test="error"]');
        await expect(error).toBeVisible();
        await expect(error).toContainText(fragment);
    },
);
