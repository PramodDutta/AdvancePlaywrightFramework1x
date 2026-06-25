import { Before, After, setDefaultTimeout, Status, ITestCaseHookParameter } from '@cucumber/cucumber';
import { CustomWorld } from './world';

/**
 * Scenario lifecycle hooks.
 *
 *  - Before  -> launch a browser + page (CustomWorld.open)
 *  - After   -> on failure, attach a screenshot, then close the browser
 */

setDefaultTimeout(30 * 1000);

Before(async function (this: CustomWorld) {
    await this.open();
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
    if (scenario.result?.status === Status.FAILED && this.page) {
        const screenshot = await this.page.screenshot();
        this.attach(screenshot, 'image/png');
    }
    await this.close();
});
