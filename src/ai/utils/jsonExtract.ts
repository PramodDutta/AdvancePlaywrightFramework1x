/**
 * jsonExtract — pull a JSON value out of an LLM reply, even a chatty one.
 *
 * Models sometimes wrap JSON in prose or ```json fences despite being asked
 * not to. `extractJson` tries, in order:
 *   1. parse the whole trimmed string,
 *   2. strip a single ```json ... ``` (or ``` ... ```) fence and parse that,
 *   3. parse the span from the first `{`/`[` to the last `}`/`]`.
 * If all fail it throws with a truncated snippet for debugging.
 */

/** Strip one leading/trailing markdown code fence, if present. */
function stripFence(text: string): string {
    const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/m.exec(text.trim());
    return fence ? fence[1] : text;
}

/** Return the widest `{...}` or `[...]` span found in the text. */
function braceSpan(text: string): string | undefined {
    const firstObj = text.indexOf('{');
    const firstArr = text.indexOf('[');
    const start =
        firstObj === -1 ? firstArr : firstArr === -1 ? firstObj : Math.min(firstObj, firstArr);
    if (start === -1) return undefined;
    const open = text[start];
    const close = open === '{' ? '}' : ']';
    const end = text.lastIndexOf(close);
    if (end <= start) return undefined;
    return text.slice(start, end + 1);
}

/** Parse JSON from a raw LLM string, tolerating fences and surrounding prose. */
export function extractJson<T = unknown>(raw: string): T {
    const trimmed = raw.trim();

    try {
        return JSON.parse(trimmed) as T;
    } catch {
        /* fall through */
    }

    const unfenced = stripFence(trimmed);
    if (unfenced !== trimmed) {
        try {
            return JSON.parse(unfenced.trim()) as T;
        } catch {
            /* fall through */
        }
    }

    const span = braceSpan(unfenced);
    if (span) {
        try {
            return JSON.parse(span) as T;
        } catch {
            /* fall through */
        }
    }

    throw new Error(`extractJson: response was not valid JSON: ${raw.slice(0, 300)}`);
}
