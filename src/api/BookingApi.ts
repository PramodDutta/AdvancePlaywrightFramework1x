// How you can serialize or deserialize your responses 
// You can perform a JSON schema validation. 
// How you can basically perform the json path plus 
// Now you can similarly use auth or even JWT token, whatever 

import { APIResponse } from '@playwright/test';
import { ApiHelper, ApiContext } from '../utils/ApiHelper';

export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

export interface CreateBookingResponse {
    bookingid: number;
    booking: Booking;
}

export interface BookingId {
    bookingid: number;
}

export interface BookingFilters {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

export class BookingApi {
    private apiHelper: ApiHelper;
    private baseUrl: string;


    constructor(context: ApiContext, baseUrl = 'https://restful-booker.herokuapp.com') {
        this.apiHelper = new ApiHelper(context);
        this.baseUrl = baseUrl;
    }

    private authHeaders(token: string): Record<string, string> {
        return { ...JSON_HEADERS, Cookie: `token=${token}` };
    }

    async getAllBookings(filters?: BookingFilters): Promise<BookingId[]> {
        const response = await this.apiHelper.get(`${this.baseUrl}/booking`, {
            params: filters as Record<string, string> | undefined,
        });
        if (!this.apiHelper.isSuccess(response)) {
            throw new Error(`[BookingApi] GET /booking failed: ${response.status()}`);
        }
        return this.apiHelper.parseJsonResponse<BookingId[]>(response);
    }

    async getBooking(id: number): Promise<Booking> {
        const response = await this.getBookingResponse(id);
        if (!this.apiHelper.isSuccess(response)) {
            throw new Error(`[BookingApi] GET /booking/${id} failed: ${response.status()}`);
        }
        return this.apiHelper.parseJsonResponse<Booking>(response);
    }

    /** GET /booking/{id} -> raw response, so callers can assert status (e.g. 404). */
    async getBookingResponse(id: number): Promise<APIResponse> {
        return this.apiHelper.get(`${this.baseUrl}/booking/${id}`);
    }

    // atuh, and token

    async auth(username = 'admin', password = 'password123'): Promise<string> {
        const response = await this.apiHelper.post(`${this.baseUrl}/auth`, { username, password }, {
            headers: JSON_HEADERS,
        });
        if (!this.apiHelper.isSuccess(response)) {
            throw new Error(`[BookingApi] POST /auth failed: ${response.status()}`);
        }
        const body = await this.apiHelper.parseJsonResponse<{ token?: string; reason?: string }>(response);
        if (!body.token) {
            throw new Error(`[BookingApi] /auth returned no token. Reason: ${body.reason ?? 'unknown'}`);
        }
        return body.token;
    }


    /** POST /booking -> { bookingid, booking }. No auth required. */
    async createBooking(payload: Booking): Promise<CreateBookingResponse> {
        const response = await this.apiHelper.post(`${this.baseUrl}/booking`, payload, {
            headers: JSON_HEADERS,
        });
        if (!this.apiHelper.isSuccess(response)) {
            throw new Error(`[BookingApi] POST /booking failed: ${response.status()}`);
        }
        return this.apiHelper.parseJsonResponse<CreateBookingResponse>(response);
    }


    async updateBooking(id: number, payload: Booking, token: string): Promise<Booking> {
        const response = await this.apiHelper.put(`${this.baseUrl}/booking/${id}`, payload, {
            headers: this.authHeaders(token),
        });
        if (!this.apiHelper.isSuccess(response)) {
            throw new Error(`[BookingApi] PUT /booking/${id} failed: ${response.status()}`);
        }
        return this.apiHelper.parseJsonResponse<Booking>(response);
    }

    async patchBooking(id: number, partial: Partial<Booking>, token: string): Promise<Booking> {
        const response = await this.apiHelper.patch(`${this.baseUrl}/booking/${id}`, partial, {
            headers: this.authHeaders(token),
        });
        if (!this.apiHelper.isSuccess(response)) {
            throw new Error(`[BookingApi] PATCH /booking/${id} failed: ${response.status()}`);
        }
        return this.apiHelper.parseJsonResponse<Booking>(response);
    }


    async deleteBooking(id: number, token: string): Promise<number> {
        const response = await this.apiHelper.delete(`${this.baseUrl}/booking/${id}`, {
            headers: this.authHeaders(token),
        });
        return response.status();
    }




}