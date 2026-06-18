import { test as base, expect } from '@playwright/test';
import { BookingApi } from '../api/BookingApi';

export type BookerFixtures = {
    bookingApi: BookingApi;
    bookerToken: string;
};

export const test = base.extend<BookerFixtures>({
    // Build the service object once and hand it to the test.
    bookingApi: async ({ request }, use) => {
        await use(new BookingApi(request));
    },

    // Generate a token via POST /auth and expose it to the test. This is the
    // "token generation lives in a fixture" requirement.
    bookerToken: async ({ bookingApi }, use) => {
        const token = await bookingApi.auth();
        await use(token);
    },
});

export { expect };
