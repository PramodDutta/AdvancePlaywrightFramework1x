# AI Agent Factory + Playwright

Agent Factory basically allows any user to create the agents which can interact with Playwright anytime with the simple prompt. You give the prompt, you give the output, you will give the inputs, and you will get a proper output from the LLMGateway automatically. It can be open source by using Open Router, Groq, Groq or OpenAI, Claude AI, anything 

### Parent Lib - LIGHT Framework -> Allow you to create a AI Agents with simple prompts. 

1. LLMGateway Access - llmGateway() -> API key - Groq.com, openrouter, OpenAI, Claude AI. ( keep the model info outside in json file)
2. CustomDataGenerator_AIAgent : Agent. -> custom structure data.
3. RCA_AIAgent - Failure in the Playwright - results.json -> Serverity, Priority, Root Cuase, Fix Informarion attached to the Custom Report(AI Verdict)
4. FlakyTestAnalyser_AIAgent -( build 1, build 2) - Playwright ( Playwiright + AI)
    -> Vibe Code your own
5. ...Other you can create.(Prompt)

---

## How to use (this `src/ai` layer)

Purely additive layer — it does not touch the existing framework. Imports via the `@ai/*` alias.

### Env (set by Jenkins / `.env`)

| Var | Purpose |
|-----|---------|
| `LLM_PROVIDER` | `openrouter` (default) \| `groq` \| `openai` |
| `LLM_MODEL` | optional; overrides the provider's `defaultModel` |
| `OPENROUTER_API_KEY` / `GROQ_API_KEY` / `OPENAI_API_KEY` | set the one matching the provider |
| `OPENROUTER_HTTP_REFERER` / `OPENROUTER_X_TITLE` | optional OpenRouter attribution |

Model list lives outside the code in [`models.json`](./models.json).

### 1. LLM Gateway

```ts
import { llmGateway } from '@ai/index';

const gw = llmGateway();                       // provider/model from env + models.json
const res = await gw.chat({
    messages: [{ role: 'user', content: 'Return JSON {"ok":true}' }],
});
console.log(res.content);                       // model reply, res.provider, res.model
```

One OpenAI-compatible adapter serves OpenRouter, Groq and OpenAI. Native `fetch`, no SDK.

### 2. CustomDataGenerator agent

```ts
import { generateTestData } from '@ai/index';

const { filePath, data } = await generateTestData({
    structurePath: 'src/testdata/structures/user-profile.structure.json',
    prompt: 'Generate one realistic adult user profile from Germany.',
    name: 'user-profile',
});
// filePath -> src/testdata/generated/user-profile-<id>/testdata.json
```

Takes a JSON structure/schema file + a prompt, asks the LLM for matching data, validates it
against the structure (`@utils/schemaValidator`), writes a unique `testdata.json`, and returns
its absolute path for a test to consume. See `src/tests/apiTests/06_ai_datagen/ai-datagen.spec.ts`.
