/**
 * @p1 @ai — basic round-trip for the CustomDataGenerator AI agent.
 *
 * Lives under apiTests/ so it runs in the no-browser `api` Playwright project.
 * Skips automatically when no LLM API key is set, keeping CI green without
 * credentials. With a key (default provider OpenRouter), it generates a user
 * profile and asserts the file was written, parses, and matches the schema.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { generateTestData, hasApiKey } from '@ai/index';
import { validateSchema } from '@utils/schemaValidator';

const structurePath = path.join(
    __dirname,
    '../../../testdata/structures/user-profile.structure.json',
);
const schema = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

test.describe('@p1 @ai CustomDataGenerator AI agent', () => {
    test.skip(!hasApiKey(), 'No LLM API key set — skipping AI data-gen test to keep CI green.');

    test('generates schema-valid test data and writes it to a unique path', async () => {
        const result = await generateTestData({
            structurePath,
            prompt: 'Generate one realistic adult user profile from Germany.',
            name: 'user-profile',
        });

        // Surface the generated JSON in the custom report's "AI Data" tab.
        await test.info().attach('ai-data', {
            body: JSON.stringify(result.data, null, 2),
            contentType: 'application/json',
        });

        // 1) The returned path exists on disk.
        expect(fs.existsSync(result.filePath)).toBe(true);

        // 2) The file is valid JSON and round-trips the returned data.
        const onDisk = JSON.parse(fs.readFileSync(result.filePath, 'utf-8'));
        expect(onDisk).toEqual(result.data);

        // 3) The generated shape matches the structure spec.
        const { valid, errorText } = validateSchema(schema, onDisk);
        expect(valid, errorText).toBe(true);
    });
});
