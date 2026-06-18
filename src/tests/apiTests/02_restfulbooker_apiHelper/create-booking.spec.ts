/**
 * Level 2 (ApiHelper) — POST create booking against Restful Booker.
 *
 * Mirrors the e2e logging/step style so the custom TTA reporter shows one
 * named step per phase plus the scoped logger output. No browser here, so
 * instead of `visualStep` (which screenshots a page) we use plain `test.step`
 * and attach the JSON response body as a text artifact for visibility.
 */

import { test, expect } from '@playwright/test';
import { ApiHelper } from '@utils/ApiHelper';
import { createLogger } from '@utils/logger';

const log = createLogger('create-booking');

interface CreateBookingResponse {
    bookingid: number;
    booking: {
        firstname: string;
        lastname: string;
        totalprice: number;
        depositpaid: boolean;
    };
}

test.describe('@P0 @regression Level 2 (ApiHelper) - POST create booking', () => {
    test('POST /booking creates a booking and echoes it back', async ({ request }, testInfo) => {
        const api = new ApiHelper(request);

        const payload = {
            firstname: 'Helper',
            lastname: 'Creator',
            totalprice: 640,
            depositpaid: false,
            bookingdates: { checkin: '2026-04-01', checkout: '2026-04-10' },
            additionalneeds: 'Breakfast',
        };

        let body: CreateBookingResponse;

        // Step 1 — send the create request
        await test.step('POST /booking with a new booking payload', async () => {
            log.info(`Step 1: POST /booking for ${payload.firstname} ${payload.lastname} (price ${payload.totalprice})`);
            const response = await api.post('/booking', payload);

            log.info(`Step 1: server responded with status ${response.status()}`);
            expect(api.isSuccess(response)).toBe(true);

            body = await api.parseJsonResponse<CreateBookingResponse>(response);

            // Attach the raw response so it shows up in the report.
            await testInfo.attach('create-booking-response', {
                body: JSON.stringify(body, null, 2),
                contentType: 'application/json',
            });
        });

        // Step 2 — verify the server echoed the booking back
        await test.step('Verify the created booking is echoed back', async () => {
            log.info(`Step 2: verifying booking id ${body.bookingid} echoes the payload`);
            expect(body.bookingid).toBeGreaterThan(0);
            expect(body.booking.firstname).toBe(payload.firstname);
            expect(body.booking.totalprice).toBe(payload.totalprice);
            log.info(`Step 2: booking ${body.bookingid} verified OK`);
        });
    });
});
