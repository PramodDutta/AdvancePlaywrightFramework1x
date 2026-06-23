/**
 * @smoke @ai — generate customer + vehicle test data via an LLM, verify it exists.
 *
 * Uses the customer-vehicle structure template. Simple yes/no check: did the LLM
 * produce a file with the expected top-level shape? Skips with no API key.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { generateTestData, hasApiKey } from '@ai/index';
import { createLogger } from '@utils/logger';

const log = createLogger('AiCustomerVehicle');

const structurePath = path.join(
    __dirname,
    '../../../testdata/structures/customer-vehicle.structure.json',
);

test.describe('@smoke @ai Generate customer + vehicle data via an LLM', () => {
    test.skip(!hasApiKey(), 'No LLM API key set — skipping AI customer-vehicle test.');

    test('LLM generates a customer-vehicle record and writes it to disk', async () => {
        const { filePath, data, provider, model } = await generateTestData<{
            customer?: { email?: string };
            vehicle?: { make?: string };
        }>({
            structurePath,
            prompt: 'Generate one realistic used-car customer and the vehicle they are buying.',
            name: 'customer-vehicle',
        });

        log.info(`Generated via ${provider}/${model}: ${filePath}`);
        log.info(`Data: ${JSON.stringify(data)}`);

        // Surface the generated JSON in the custom report's "AI Data" tab.
        await test.info().attach('ai-data', {
            body: JSON.stringify(data, null, 2),
            contentType: 'application/json',
        });

        // Data generated? yes/no.
        expect(fs.existsSync(filePath), 'file should be written').toBe(true);
        expect(data.customer?.email, 'customer.email should be present').toBeTruthy();
        expect(data.vehicle?.make, 'vehicle.make should be present').toBeTruthy();
    });
});
