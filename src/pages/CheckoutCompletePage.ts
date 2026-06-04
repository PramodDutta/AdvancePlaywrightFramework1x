import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * TTACart "Checkout: Complete!" page — the order confirmation screen.
 *
 *   const complete = new CheckoutCompletePage(page);
 *   await complete.assertOrderComplete();
 *   await complete.backHome();
 */
export class CheckoutCompletePage extends BasePage {
    static readonly PATH = '/playwright/ttacart/checkout-complete.html';

    private readonly title: Locator;
    private readonly completeHeader: Locator;
    private readonly completeText: Locator;
    private readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page, 'CheckoutCompletePage');
        this.title = page.locator('[data-test="title"]');
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeText = page.locator('[data-test="complete-text"]');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    async assertLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/checkout-complete(\.html)?$/);
        await expect(this.title).toContainText('Checkout: Complete!');
    }

    /** The order succeeded: confirmation header is shown. */
    async assertOrderComplete(): Promise<void> {
        await this.assertLoaded();
        await expect(this.completeHeader).toContainText('Thank you for your order!');
    }

    async confirmationText(): Promise<string> {
        return this.el.getText(this.completeText);
    }

    async backHome(): Promise<void> {
        await this.el.click(this.backHomeButton);
        await this.page.waitForLoadState('domcontentloaded');
    }
}
