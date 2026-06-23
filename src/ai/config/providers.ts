/**
 * providers — resolves which LLM provider/model/key to use at runtime.
 *
 * Model info lives OUTSIDE the code in `src/ai/models.json` (per the
 * AIAgentFactory spec). Jenkins (or any caller) selects a provider/model via
 * env vars; this module merges those env choices with the registry defaults
 * and reads the matching API key from `process.env`.
 *
 * Resolution order (provider): override -> LLM_PROVIDER -> registry default.
 * Resolution order (model):    override -> LLM_MODEL    -> provider default.
 *
 * `dotenv` is already loaded once in `playwright.config.ts`, so we only read
 * `process.env` here — no `dotenv.config()` call.
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
    ModelsRegistry,
    ProviderConfig,
    ProviderId,
    ResolvedProvider,
} from '../types';

/** Overrides accepted by `resolveProvider()` / `hasApiKey()`. */
export interface ProviderOverrides {
    provider?: ProviderId;
    model?: string;
}

let cachedRegistry: ModelsRegistry | undefined;

/** Load and cache `models.json`. Read via `fs` to stay CommonJS-safe. */
export function loadRegistry(): ModelsRegistry {
    if (!cachedRegistry) {
        const file = path.join(__dirname, '..', 'models.json');
        cachedRegistry = JSON.parse(fs.readFileSync(file, 'utf-8')) as ModelsRegistry;
    }
    return cachedRegistry;
}

/** Pick the active provider id from override -> env -> registry default. */
function pickProviderId(overrides: ProviderOverrides = {}): ProviderId {
    const registry = loadRegistry();
    const id = (overrides.provider ??
        (process.env.LLM_PROVIDER as ProviderId | undefined) ??
        registry.default.provider);
    if (!registry.providers[id]) {
        const known = Object.keys(registry.providers).join(', ');
        throw new Error(`LLMGateway: unknown provider "${id}". Known providers: ${known}.`);
    }
    return id;
}

/** Optional OpenRouter attribution headers, included only when set. */
function buildExtraHeaders(provider: ProviderId): Record<string, string> {
    const headers: Record<string, string> = {};
    if (provider === 'openrouter') {
        if (process.env.OPENROUTER_HTTP_REFERER) {
            headers['HTTP-Referer'] = process.env.OPENROUTER_HTTP_REFERER;
        }
        if (process.env.OPENROUTER_X_TITLE) {
            headers['X-Title'] = process.env.OPENROUTER_X_TITLE;
        }
    }
    return headers;
}

/**
 * Resolve provider + model + key into a ready-to-use config. Throws a clear
 * error (naming the exact env var) when the API key is missing.
 */
export function resolveProvider(overrides: ProviderOverrides = {}): ResolvedProvider {
    const registry = loadRegistry();
    const provider = pickProviderId(overrides);
    const cfg: ProviderConfig = registry.providers[provider];

    const model = overrides.model ?? process.env.LLM_MODEL ?? cfg.defaultModel;
    const apiKey = process.env[cfg.apiKeyEnv];
    if (!apiKey) {
        throw new Error(
            `LLMGateway: missing API key. Set ${cfg.apiKeyEnv} for provider "${provider}".`,
        );
    }

    return {
        provider,
        baseUrl: cfg.baseUrl,
        apiKey,
        model,
        extraHeaders: buildExtraHeaders(provider),
    };
}

/**
 * Non-throwing key check — used by specs to `test.skip()` when no key is set,
 * keeping CI green without credentials.
 */
export function hasApiKey(overrides: ProviderOverrides = {}): boolean {
    try {
        const registry = loadRegistry();
        const provider = pickProviderId(overrides);
        const cfg = registry.providers[provider];
        return Boolean(process.env[cfg.apiKeyEnv]);
    } catch {
        return false;
    }
}
