/**
 * @smoke @ai — simplest possible AI scenario.
 *
 * Generate test data from a structure + prompt via a real LLM call, then verify
 * the data actually came back: file written, object non-empty, key fields present.
 *
 * Skips when no LLM API key is set, so CI stays green without credentials.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { generateTestData, hasApiKey } from '@ai/index';
import { createLogger } from '@utils/logger';

const log = createLogger('AiSmoke');

const structurePath = path.join(
    __dirname,
    '../../../testdata/structures/user-profile.structure.json',
);

test.describe('@smoke @ai Generate test data via an LLM', () => {
    test.skip(!hasApiKey(), 'No LLM API key set — skipping AI smoke test.');

    test('LLM generates a user profile and writes it to disk', async () => {
        const { filePath, data, provider, model } = await generateTestData<{
            username?: string;
            email?: string;
        }>({
            structurePath,
            prompt: 'Generate one realistic adult user profile from India.',
            name: 'user-profile-smoke',
        });

        log.info(`Generated via ${provider}/${model}: ${filePath}`);
        log.info(`Data: ${JSON.stringify(data)}`);

        // Surface the generated JSON in the custom report's "AI Data" tab.
        await test.info().attach('ai-data', {
            body: JSON.stringify(data, null, 2),
            contentType: 'application/json',
        });

        // The LLM call produced a file on disk...
        expect(fs.existsSync(filePath)).toBe(true);
        // ...with real, non-empty content...
        expect(data).toBeTruthy();
        // ...and the key fields the prompt asked for.
        expect(data.username, 'LLM should return a username').toBeTruthy();
        expect(data.email, 'LLM should return an email').toBeTruthy();
    });
});
