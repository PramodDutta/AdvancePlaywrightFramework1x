import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { LoginPage } from '../../../pages/LoginPage';

Given('I open the TTACart login page', async function (this: CustomWorld) {
    await this.page.goto(LoginPage.PATH);
});

Then('the page title should contain {string}', async function (this: CustomWorld, expected: string) {
    await expect(this.page).toHaveTitle(new RegExp(expected, 'i'));
});