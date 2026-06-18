/**
 * JSON Schema validation with Ajv against the Restful Booker POST /booking
 * response. Schema lives in src/testdata/schemas/create-booking.schema.json.
 *
 * Two checks:
 *   1. A static sample payload validates (schema sanity).
 *   2. A LIVE POST /booking response validates (contract test).
 * A deliberately broken object is also asserted to FAIL, proving the schema bites.
 */

import { test, expect } from '@fixtures/booker.fixture';
import { buildBooking } from '@testdata/booking.data';
import { validateSchema } from '@utils/schemaValidator';
import { createLogger } from '@utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const log = createLogger('schema-validation');

const schema = JSON.parse(
    fs.readFileSync(
        path.join(__dirname, '../../../testdata/schemas/create-booking.schema.json'),
        'utf-8',
    ),
);

test.describe('@P0 @regression Ajv schema validation - POST /booking', () => {
    test('validates the create-booking contract', async ({ bookingApi }, testInfo) => {
        // 1 — static sample (the exact shape the API documents).
        await test.step('Static sample matches the schema', async () => {
            const sample = {
                bookingid: 3177,
                booking: {
                    firstname: 'Jim',
                    lastname: 'Brown',
                    totalprice: 111,
                    depositpaid: true,
                    bookingdates: { checkin: '2018-01-01', checkout: '2019-01-01' },
                    additionalneeds: 'Breakfast',
                },
            };
            const { valid, errorText } = validateSchema(schema, sample);
            log.info(`Step 1: static sample valid=${valid}`);
            expect(valid, errorText).toBe(true);
        });

        // 2 — live response from the real API.
        await test.step('Live POST /booking response matches the schema', async () => {
            const body = await bookingApi.createBooking(buildBooking({ firstname: 'Schema' }));
            const { valid, errorText } = validateSchema(schema, body);
            log.info(`Step 2: live booking ${body.bookingid} valid=${valid}`);

            await testInfo.attach('validated-response', {
                body: JSON.stringify(body, null, 2),
                contentType: 'application/json',
            });

            expect(valid, errorText).toBe(true);
        });

        // 3 — negative: a bad object must be rejected.
        await test.step('Invalid object is rejected by the schema', async () => {
            const broken = {
                bookingid: 'not-a-number', // wrong type
                booking: {
                    firstname: 'Jim',
                    // lastname missing
                    totalprice: 111,
                    depositpaid: true,
                    bookingdates: { checkin: 'nope', checkout: '2019-01-01' }, // bad date
                },
            };
            const { valid, errors } = validateSchema(schema, broken);
            log.info(`Step 3: broken object valid=${valid}, ${errors.length} errors`);
            expect(valid).toBe(false);
            expect(errors.length).toBeGreaterThan(0);
        });
    });
});
