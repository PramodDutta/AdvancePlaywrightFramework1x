import { test, expect } from '@playwright/test';
import { ApiHelper } from '@utils/ApiHelper';

test.describe('@P0 @regression Level 2 (ApiHelper) - PUT update booking', () => {
    test('PUT /booking/{id} replaces the booking with a Cookie token', async ({ request }) => {
        const api = new ApiHelper(request);

        // 1. Token.
        const authRes = await api.post('/auth', { username: 'admin', password: 'password123' });
        const { token } = await api.parseJsonResponse<{ token: string }>(authRes);
        expect(token).toBeTruthy();

        // 2. Create something to update.
        const created = await api.post('/booking', {
            firstname: 'Before',
            lastname: 'Helper',
            totalprice: 100,
            depositpaid: false,
            bookingdates: { checkin: '2026-05-01', checkout: '2026-05-05' },
        });
        const { bookingid } = await api.parseJsonResponse<{ bookingid: number }>(created);

        // 3. PUT with the Cookie header.
        const response = await api.put(
            `/booking/${bookingid}`,
            {
                firstname: 'After',
                lastname: 'Helper',
                totalprice: 880,
                depositpaid: true,
                bookingdates: { checkin: '2026-05-02', checkout: '2026-05-09' },
                additionalneeds: 'Extra bed',
            },
            { headers: { Cookie: `token=${token}` } },
        );

        expect(api.isSuccess(response)).toBe(true);
        const updated = await api.parseJsonResponse<{ firstname: string; totalprice: number }>(
            response,
        );
        expect(updated.firstname).toBe('After');
        expect(updated.totalprice).toBe(880);
    });
});