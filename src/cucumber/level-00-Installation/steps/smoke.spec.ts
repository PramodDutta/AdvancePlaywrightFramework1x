import { Given, When, Then } from "@cucumber/cucumber";
import { CustomWorld, CREDS } from "../../support/world";

Given("I am on the TTACart login page", async function (this: CustomWorld) {
  await this.loginPage.open();
});

When("I log in as the standard user", async function (this: CustomWorld) {
  await this.loginPage.loginAs(CREDS.standardUser, CREDS.password);
});

Then("the inventory page is displayed", async function (this: CustomWorld) {
  await this.inventoryPage.assertLoaded();
});
