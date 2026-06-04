import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ItemDetailPage extends BasePage {
    static readonly PATH = '/playwright/ttacart/inventory-item.html';

    private readonly itemName: Locator;
    private readonly itemPrice: Locator;
    private readonly addButton: Locator;
    private readonly removeButton: Locator;
    private readonly backButton: Locator;

    constructor(page: Page) {
        super(page, 'ItemDetailPage');
        this.itemName = page.locator('[data-test="inventory-item-name"]');
        this.itemPrice = page.locator('[data-test="inventory-item-price"]');
        this.addButton = page.locator('[data-test="add-to-cart"]');
        this.removeButton = page.locator('[data-test="remove"]');
        this.backButton = page.locator('[data-test="back-to-products"]');
    }

    async back(): Promise<void> {
        await this.el.click(this.backButton);
        await this.page.waitForLoadState('domcontentloaded');
    }
    async addToCart(): Promise<void> {
        await this.el.click(this.addButton);
    }
    async removeFromCart(): Promise<void> {
        await this.el.click(this.removeButton);
    }
    async price(): Promise<string> {
        return this.el.getText(this.itemPrice);
    }
    async name(): Promise<string> {
        return this.el.getText(this.itemName);
    }
    async assertLoaded(id: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(`inventory-item\\.html\\?id=${id}`));
        await expect(this.itemName).toBeVisible();
    }

    async openById(id: string): Promise<void> {
        await this.goto(`${ItemDetailPage.PATH}?id=${id}`);
        await this.assertLoaded(id);
    }



}