import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { CustomWorld, BASE_URL } from "./world";

setDefaultTimeout(60_000);

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: !process.env.HEADED });
});

AfterAll(async function () {
  await browser?.close();
});

Before(async function (this: CustomWorld) {
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: BASE_URL });
  this.page = await this.context.newPage();
  this.initPages();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const png = await this.page.screenshot();
    this.attach(png, "image/png");
  }
  await this.page?.close();
  await this.context?.close();
});
