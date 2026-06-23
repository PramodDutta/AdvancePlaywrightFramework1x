/**
 * Flaky Test Analyzer AI agent.
 *
 * Compares two builds (run 1 vs run 2) of the same suite. A test whose status
 * FLIPS between the builds (passed in one, failed in the other) is FLAKY. The
 * math is deterministic so the flaky/failing COUNTS are exact; the LLM gateway
 * then adds a short judgment/summary on top (per your "math diff + LLM summary").
 *
 *   import { analyzeFlaky } from '@ai/agents/flakyAnalyzer';
 *   const result = await analyzeFlaky(prevBuild, currBuild, useLlm);
 */

import { createLogger } from '@utils/logger';
import { llmGateway } from '../gateway/llmGateway';

const log = createLogger('FlakyAnalyzer');

/** One build's per-test status, keyed by full test title. */
export interface BuildSummary {
    runId: string;
    tests: Record<string, string>; // title -> 'passed' | 'failed' | 'timedOut' | 'skipped'
}

export interface FlakyResult {
    flaky: string[]; // status flipped between builds
    failingNow: string[]; // failed in the current build
    counts: { flaky: number; failing: number; total: number };
    summary?: string; // LLM narrative (optional)
}

const isFail = (s: string | undefined): boolean => s === 'failed' || s === 'timedOut';
const isPass = (s: string | undefined): boolean => s === 'passed';

/** Deterministic diff + optional LLM summary. */
export async function analyzeFlaky(
    prev: BuildSummary,
    curr: BuildSummary,
    useLlm: boolean,
): Promise<FlakyResult> {
    const titles = new Set([...Object.keys(prev.tests), ...Object.keys(curr.tests)]);

    const flaky: string[] = [];
    const failingNow: string[] = [];

    for (const title of titles) {
        const p = prev.tests[title];
        const c = curr.tests[title];
        // Flaky = present in both builds and the pass/fail verdict flipped.
        if (((isPass(p) && isFail(c)) || (isFail(p) && isPass(c)))) {
            flaky.push(title);
        }
        if (isFail(c)) failingNow.push(title);
    }

    const result: FlakyResult = {
        flaky,
        failingNow,
        counts: { flaky: flaky.length, failing: failingNow.length, total: titles.size },
    };

    if (useLlm && flaky.length > 0) {
        try {
            const gw = llmGateway();
            const user =
                `Two builds of the same Playwright suite were compared.\n` +
                `FLAKY tests (status flipped between builds):\n${flaky.map((t) => `- ${t}`).join('\n')}\n\n` +
                `Tests failing in the latest build:\n${failingNow.map((t) => `- ${t}`).join('\n') || '- none'}\n\n` +
                `In 3-4 short sentences: confirm which tests are flaky, why flakiness like this usually happens, and how to stabilize them. Plain text, no markdown.`;
            const res = await gw.chat({
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a senior test-automation engineer judging test flakiness across builds.',
                    },
                    { role: 'user', content: user },
                ],
                jsonMode: false,
            });
            result.summary = res.content.trim();
        } catch (e) {
            log.warn(`LLM summary failed: ${(e as Error).message}`);
        }
    }

    log.info(`Flaky: ${result.counts.flaky}, Failing: ${result.counts.failing}`);
    return result;
}
