/**
 * AI Agent Factory — public barrel.
 *
 *   import { llmGateway, generateTestData, hasApiKey } from '@ai/index';
 */

export { llmGateway } from './gateway/llmGateway';
export { extractJson } from './utils/jsonExtract';
export { resolveProvider, hasApiKey, loadRegistry } from './config/providers';
export {
    generateTestData,
    type GenerateTestDataOptions,
    type GeneratedTestData,
} from './agents/customDataGenerator';
export {
    analyzeFailure,
    type RcaVerdict,
    type FailureInput,
} from './agents/rcaAgent';
export {
    analyzeFlaky,
    type BuildSummary,
    type FlakyResult,
} from './agents/flakyAnalyzer';
export * from './types';
