// Will be very modular, which means
// We will use `ApiHelper` also.
// We will use `Booking` classes. Payload and response will be separate classes.
// Verification also will be separate.


// Why are we going from raw to API helper to classes?
// What is the reason for it?

// First, we want a framework, and frameworks are
// scalable, maintainable, and reusable in nature.

import { test, expect } from '@fixtures/booker.fixture';
import { buildBooking } from '@testdata/booking.data';
import { createLogger } from '@utils/logger';

const log = createLogger('booking-crud');

test.describe.serial('@e2e @P0 Level 3 - Booking lifecycle (token from fixture)', () => {
    let bookingId: number;

    test('create a booking', async ({ bookingApi }, testInfo) => {
        const payload = buildBooking({ firstname: 'E2E', lastname: 'Journey' });

        await test.step('POST /booking with a generated payload', async () => {
            log.info(`Step 1: creating booking for ${payload.firstname} ${payload.lastname}`);
            const { bookingid, booking } = await bookingApi.createBooking(payload);

            log.info(`Step 1: created booking id ${bookingid}`);
            expect(bookingid).toBeGreaterThan(0);
            expect(booking.firstname).toBe('E2E');
            bookingId = bookingid;

            await testInfo.attach('created-booking', {
                body: JSON.stringify({ bookingid, booking }, null, 2),
                contentType: 'application/json',
            });
        });
    });

    test('update the booking (token comes from the fixture)', async ({
        bookingApi,
        bookerToken,
    }, testInfo) => {
        await test.step('PUT /booking/{id} with the fixture token', async () => {
            log.info(`Step 1: updating booking ${bookingId} using fixture token`);
            const updated = await bookingApi.updateBooking(
                bookingId,
                buildBooking({ firstname: 'E2E', lastname: 'Updated', totalprice: 950 }),
                bookerToken,
            );

            expect(updated.lastname).toBe('Updated');
            expect(updated.totalprice).toBe(950);

            await testInfo.attach('updated-booking', {
                body: JSON.stringify(updated, null, 2),
                contentType: 'application/json',
            });
        });

        await test.step('GET /booking/{id} to confirm the change persisted', async () => {
            log.info(`Step 2: reading booking ${bookingId} back to verify persistence`);
            const fetched = await bookingApi.getBooking(bookingId);

            expect(fetched.lastname).toBe('Updated');
            log.info(`Step 2: booking ${bookingId} confirmed as "Updated"`);
        });
    });

    test('delete the booking and confirm it is gone', async ({ bookingApi, bookerToken }) => {
        await test.step('DELETE /booking/{id} with the fixture token', async () => {
            log.info(`Step 1: deleting booking ${bookingId}`);
            // Booker returns 201 Created on a successful DELETE.
            const status = await bookingApi.deleteBooking(bookingId, bookerToken);
            log.info(`Step 1: DELETE responded with status ${status}`);
            expect(status).toBe(201);
        });

        await test.step('GET /booking/{id} should now 404', async () => {
            log.info(`Step 2: confirming booking ${bookingId} is gone (expect 404)`);
            const ghost = await bookingApi.getBookingResponse(bookingId);
            expect(ghost.status()).toBe(404);
            log.info(`Step 2: booking ${bookingId} returns 404 as expected`);
        });
    });

});
