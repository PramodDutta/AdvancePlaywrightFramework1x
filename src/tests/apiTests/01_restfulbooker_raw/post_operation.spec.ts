import { test, expect } from '@playwright/test';
import { logger } from '@utils/logger';

test('TC#1 @p0 - POST : Verify that create booking is working fine.', async ({ request }) => {
    const baseUrl = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
    const payload = {
        firstname: 'Jim',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: '2018-01-01',
            checkout: '2019-01-01',
        },
        additionalneeds: 'Breakfast',
    };

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    const responseData = await request.post(`${baseUrl}/booking`, {
        headers,
        data: payload,
    });

    expect(responseData.status()).toBe(200);
    const data = await responseData.json();
    expect(data.bookingid).toBeTruthy();
    expect(data.booking.firstname).toBe(payload.firstname);
    expect(data.booking.lastname).toBe(payload.lastname);
    logger.info(`Created booking id: ${data.bookingid}`);
});





test('TC#1 @p0 - PUT : Verify that create booking is working fine.', async ({ request }) => {
    const baseUrl = process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com';
    const payload = {
        firstname: 'Jim',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
            checkin: '2018-01-01',
            checkout: '2019-01-01',
        },
        additionalneeds: 'Breakfast',
    };

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    const responseData = await request.post(`${baseUrl}/booking`, {
        headers,
        data: payload,
    });

    expect(responseData.status()).toBe(200);
    const data = await responseData.json();
    expect(data.bookingid).toBeTruthy();
    expect(data.booking.firstname).toBe(payload.firstname);
    expect(data.booking.lastname).toBe(payload.lastname);
    logger.info(`Created booking id: ${data.bookingid}`);
});



