import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import type { Browser, BrowserContext, Page } from "@playwright/test";

import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutStepOnePage } from "../../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../../pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "../../pages/CheckoutCompletePage";

export const BASE_URL =
  process.env.BASE_URL ?? "https://app.thetestingacademy.com";

export const CREDS = {
  standardUser: process.env.STANDARD_USER ?? "standard_user",
  password: process.env.TTA_SECRET ?? "tta_secret",
} as const;

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutStepOnePage!: CheckoutStepOnePage;
  checkoutStepTwoPage!: CheckoutStepTwoPage;
  checkoutCompletePage!: CheckoutCompletePage;

  scratch: Record<string, unknown> = {};

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(): void {
    this.loginPage = new LoginPage(this.page);
    this.inventoryPage = new InventoryPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutStepOnePage = new CheckoutStepOnePage(this.page);
    this.checkoutStepTwoPage = new CheckoutStepTwoPage(this.page);
    this.checkoutCompletePage = new CheckoutCompletePage(this.page);
  }
}

setWorldConstructor(CustomWorld);
