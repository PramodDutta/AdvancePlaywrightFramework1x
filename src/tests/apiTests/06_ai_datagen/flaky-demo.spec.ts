/**
 * @p1 @flaky — DUMMY suite with intermittent failures to demo the Flaky Analyzer.
 *
 * Several tests pass/fail at random, so their status flips between build 1 and
 * build 2. Run the suite twice; the custom reporter snapshots each build and the
 * Flaky Test Analyzer agent diffs them, highlighting the flaky tests in the
 * "Flaky" tab. Exclude from normal runs with: --grep-invert @flaky
 */

import { test, expect } from '@playwright/test';

test.describe('@p1 @flaky Flaky demo (intermittent failures)', () => {
    test('stable: always passes A', async () => {
        expect(1 + 1).toBe(2);
    });

    test('stable: always passes B', async () => {
        expect('tta').toBe('tta');
    });

    for (let i = 1; i <= 4; i++) {
        test(`intermittent check #${i}`, async () => {
            // Simulates a timing/network flake: ~50% pass each run.
            const ok = Math.random() > 0.5;
            expect(ok, 'intermittent flake — passes ~50% of runs').toBe(true);
        });
    }
});
