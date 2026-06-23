/**
 * RCA AI agent — root-cause analysis for a failed Playwright test.
 *
 * Give it a failure (title, file, error, stack); it asks the LLM (via the
 * gateway) for a verdict: severity, priority, one-line root cause, and a few
 * bullet-point fixes. Used by the custom reporter to fill the "AI Verdict" tab.
 *
 *   import { analyzeFailure } from '@ai/agents/rcaAgent';
 *   const verdict = await analyzeFailure({ title, file, error, stack });
 */

import { createLogger } from '@utils/logger';
import { llmGateway } from '../gateway/llmGateway';
import { extractJson } from '../utils/jsonExtract';

const log = createLogger('RcaAgent');

export interface RcaVerdict {
    severity: string; // Critical | High | Medium | Low
    priority: string; // P0 | P1 | P2 | P3
    rootCause: string; // one sentence
    fixes: string[]; // actionable bullet points
}

export interface FailureInput {
    title: string;
    file: string;
    error: string;
    stack?: string;
}

const SYSTEM =
    'You are a senior test-automation RCA engineer. Given a failed Playwright ' +
    'test, return ONLY a JSON object with keys: "severity" (one of ' +
    'Critical/High/Medium/Low), "priority" (one of P0/P1/P2/P3), "rootCause" ' +
    '(one concise sentence), and "fixes" (an array of short actionable bullet ' +
    'strings). No prose, no markdown, no code fences.';

/** Ask the LLM for a root-cause verdict on a single failure. */
export async function analyzeFailure(failure: FailureInput): Promise<RcaVerdict> {
    const gw = llmGateway();
    log.info(`Analyzing failure: ${failure.title}`);

    const user =
        `FAILED TEST: ${failure.title}\n` +
        `FILE: ${failure.file}\n` +
        `ERROR:\n${failure.error}\n\n` +
        `STACK:\n${(failure.stack ?? '').slice(0, 1500)}\n\n` +
        'Return only the JSON verdict.';

    const res = await gw.chat({
        messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: user },
        ],
        jsonMode: true,
    });

    const v = extractJson<Partial<RcaVerdict>>(res.content);
    return {
        severity: v.severity ?? 'Unknown',
        priority: v.priority ?? 'Unknown',
        rootCause: v.rootCause ?? 'Unknown',
        fixes: Array.isArray(v.fixes) ? v.fixes : [],
    };
}
