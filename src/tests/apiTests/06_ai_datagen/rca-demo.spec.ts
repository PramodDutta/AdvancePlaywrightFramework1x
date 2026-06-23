/**
 * @p1 @rca — DUMMY failing test to demo the RCA AI agent / "AI Verdict" tab.
 *
 * This test fails on purpose. On failure the custom reporter runs the RCA agent
 * (via the LLM gateway) and shows severity/priority/root-cause/fixes in the
 * "AI Verdict" tab. Exclude from normal runs with: --grep-invert @rca
 */

import { test, expect } from '@playwright/test';

test.describe('@p1 @rca RCA demo (intentional failure)', () => {
    test('cart total should equal expected price', async () => {
        const unitPrice = 19.99;
        const qty = 3;
        const cartTotal = unitPrice * qty; // 59.97

        // Bug: expected value is wrong on purpose so the test fails.
        expect(cartTotal, 'cart total mismatch — expected 60.00').toBe(60.0);
    });
});
