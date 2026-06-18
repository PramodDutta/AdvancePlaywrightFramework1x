// APIs Helper is a simple type of a class which can help you to make a different type of HTTP 

import { Page, APIRequestContext, APIResponse } from '@playwright/test';

export type ApiContext = Page | APIRequestContext;
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request Modifiction
export interface ApiRequestOptions {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    data?: unknown; // payload, body
    params?: Record<string, string>;
    timeout?: number;
}

// ? - Optional Parameters 

export interface RetryOptions {
    condition: (response: APIResponse) => Promise<boolean> | boolean
    pollingInterval?: number;
    retryCount?: number;
}

export class ApiHelper {

    private context: ApiContext;

    constructor(context: ApiContext) {
        this.context = context;
    }

    /**
    * Get the request object from the context
    */

    private getRequest(): APIRequestContext {
        if ('request' in this.context) {
            return this.context.request;
        }
        return this.context as APIRequestContext;
    }

    /**
        * Build full URL with query parameters
        */

    // example1 -  https://example.com
    // example2 -  https://example.com/ param :  param1=abc&param2=xyz return-.  https://example.com/param1=abc&param2=xyz
    // exmaple3 - https://example.com/, params :  /student/1 -> https://example.com/student/1
    // builturl(example1)

    private buildUrl(url: string, params?: Record<string, string>): string {
        if (!params) return url;
        const searchParams = new URLSearchParams(params);
        return `${url}?${searchParams.toString()}`;
    }

    /**
    * Perform an HTTP API request
    */
    async callApi(options: ApiRequestOptions): Promise<APIResponse> {
        const { url, method, headers, data, params, timeout } = options;
        const request = this.getRequest();
        const fullUrl = this.buildUrl(url, params);

        switch (method) {
            case 'GET':
                return await request.get(fullUrl, { headers, timeout });
            case 'POST':
                return await request.post(fullUrl, { headers, data, timeout });
            case 'PUT':
                return await request.put(fullUrl, { headers, data, timeout });
            case 'DELETE':
                return await request.delete(fullUrl, { headers, timeout });
            case 'PATCH':
                return await request.patch(fullUrl, { headers, data, timeout });
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }
    }

    /**
     * Call API with retry logic
     */

    async callApiWithRetry(
        options: ApiRequestOptions,
        retryOptions: RetryOptions,
    ): Promise<APIResponse> {
        const { condition, pollingInterval = 5000, retryCount = 3 } = retryOptions;
        let lastResponse: APIResponse | null = null;

        for (let attempt = 1; attempt <= retryCount; attempt++) {
            lastResponse = await this.callApi(options);

            if (await condition(lastResponse)) {
                return lastResponse;
            }

            if (attempt < retryCount) {
                await new Promise(resolve => setTimeout(resolve, pollingInterval));
            }
        }

        return lastResponse!;
    }


    /**
     * Convenience method for GET requests
     */
    async get(url: string, options?: Omit<ApiRequestOptions, 'url' | 'method'>): Promise<APIResponse> {
        return this.callApi({ url, method: 'GET', ...options });
    }
    /**
     * Convenience method for POST requests
     */
    async post(url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'url' | 'method' | 'data'>): Promise<APIResponse> {
        return this.callApi({ url, method: 'POST', data, ...options });
    }

    /**
     * Convenience method for PUT requests
     */
    async put(url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'url' | 'method' | 'data'>): Promise<APIResponse> {
        return this.callApi({ url, method: 'PUT', data, ...options });
    }

    /**
     * Convenience method for DELETE requests
     */
    async delete(url: string, options?: Omit<ApiRequestOptions, 'url' | 'method'>): Promise<APIResponse> {
        return this.callApi({ url, method: 'DELETE', ...options });
    }

    /**
     * Convenience method for PATCH requests
     */
    async patch(url: string, data?: unknown, options?: Omit<ApiRequestOptions, 'url' | 'method' | 'data'>): Promise<APIResponse> {
        return this.callApi({ url, method: 'PATCH', data, ...options });
    }

    /**
     * Parse JSON response with type safety
     */
    async parseJsonResponse<T>(response: APIResponse): Promise<T> {
        return await response.json() as T;
    }

    /**
     * Check if response is successful (2xx status)
     */
    isSuccess(response: APIResponse): boolean {
        const status = response.status();
        return status >= 200 && status < 300;
    }
    /**
     * Check if response is successful (2xx status)
     */
    isFailureClient(response: APIResponse): boolean {
        const status = response.status();
        return status >= 400 && status < 500;
    }





}