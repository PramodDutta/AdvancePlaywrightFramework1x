import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

/**
 * CustomWorld - the per-scenario context shared across step definitions.
 *
 * Each Cucumber scenario gets a fresh World instance. We launch a Chromium
 * browser in `open()` (called from a Before hook) and tear it down in
 * `close()` (After hook). Step defs reach the live page via `this.page`.
 *
 * `baseURL` mirrors the Playwright config default so relative paths such as
 * `LoginPage.PATH` resolve the same way they do in the Playwright runner.
 */

const BASE_URL =
    process.env.BASE_URL || process.env.QA_BASE_URL || 'https://app.thetestingacademy.com';

export class CustomWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async open(): Promise<void> {
        this.browser = await chromium.launch({ headless: !process.env.HEADED });
        this.context = await this.browser.newContext({ baseURL: BASE_URL });
        this.page = await this.context.newPage();
    }

    async close(): Promise<void> {
        await this.page?.close();
        await this.context?.close();
        await this.browser?.close();
    }
}

setWorldConstructor(CustomWorld);
