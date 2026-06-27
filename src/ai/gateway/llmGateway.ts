/**
 * llmGateway — one entry point to every LLM provider.
 *
 *   import { llmGateway } from '@ai/gateway/llmGateway';
 *
 *   const gw = llmGateway();                 // provider/model from env + models.json
 *   const res = await gw.chat({
 *       messages: [{ role: 'user', content: 'Say hi as JSON {"hi":true}' }],
 *   });
 *   console.log(res.content);                // the model's text reply
 *
 * OpenRouter (default), Groq and OpenAI all expose the SAME OpenAI-compatible
 * `POST {baseUrl}/chat/completions` API, so a single adapter — parameterised by
 * baseUrl + key + model — serves all three. Provider is selected by env vars
 * set by Jenkins (LLM_PROVIDER / LLM_MODEL / *_API_KEY).
 *
 * Uses native Node 22 `fetch` — no SDK, no extra deps.
 */

import { createLogger } from '@utils/logger';
import { resolveProvider, type ProviderOverrides } from '../config/providers';
import type { ChatOptions, ChatResult, LLMGateway } from '../types';

const log = createLogger('LLMGateway');

const DEFAULT_TIMEOUT_MS = 60_000;

/** Minimal shape of an OpenAI-compatible chat-completions response. */
interface ChatCompletionResponse {
    choices?: Array<{ message?: { content?: string } }>;
}

/**
 * Build a gateway bound to a resolved provider/model. The binding happens once
 * (env is read here); each `chat()` call may still override the model.
 */
export function llmGateway(overrides: ProviderOverrides = {}): LLMGateway {
    const resolved = resolveProvider(overrides);
    const endpoint = `${resolved.baseUrl}/chat/completions`;

    async function chat(opts: ChatOptions): Promise<ChatResult> {
        const model = opts.model ?? resolved.model;
        const temperature = opts.temperature ?? 0;
        const jsonMode = opts.jsonMode !== false;
        const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

        const body: Record<string, unknown> = {
            model,
            messages: opts.messages,
            temperature,
        };
        if (jsonMode) {
            body.response_format = { type: 'json_object' };
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resolved.apiKey}`,
            ...resolved.extraHeaders,
        };

        const startedAt = Date.now();
        log.info(`-> ${resolved.provider}/${model} (jsonMode=${jsonMode})`);

        let res: Response;
        try {
            res = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(timeoutMs),
            });
        } catch (err) {
            log.error(`${resolved.provider} request failed: ${(err as Error).message}`);
            throw new Error(
                `LLMGateway: ${resolved.provider} request failed: ${(err as Error).message}`,
            );
        }

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            log.error(`${resolved.provider} HTTP ${res.status}: ${text.slice(0, 300)}`);
            throw new Error(
                `LLMGateway: ${resolved.provider} HTTP ${res.status}: ${text.slice(0, 500)}`,
            );
        }

        const json = (await res.json()) as ChatCompletionResponse;
        const content = json.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || content.length === 0) {
            throw new Error(
                `LLMGateway: ${resolved.provider} returned no message content.`,
            );
        }

        log.info(
            `<- ${resolved.provider}/${model} ${Date.now() - startedAt}ms, ${content.length} chars`,
        );
        return { content, model, provider: resolved.provider, raw: json };
    }

    return {
        chat,
        provider: resolved.provider,
        model: resolved.model,
    };
}
