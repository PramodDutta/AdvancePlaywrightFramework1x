/**
 * TTA Cucumber Formatter
 *
 * Bridges a Cucumber run into the existing Playwright TTA HTML reporter.
 *
 * Cucumber drives Formatters (not Playwright's Reporter interface), so this
 * formatter listens to the message stream, rebuilds the same TestData[] /
 * SuiteStats model the reporter renders from, and hands it to
 * `CustomTTAReporter.renderExternalRun(...)` — reusing the entire HTML + RCA +
 * Flaky pipeline. Output lands in `tta-report/` exactly like a Playwright run.
 *
 * Wire it up via `format` in cucumber.js. The report opens with
 * `npm run test:bdd:tta`.
 */

import { Formatter, IFormatterOptions, Status } from '@cucumber/cucumber';
import type * as messages from '@cucumber/messages';
import * as fs from 'fs';
import * as path from 'path';
import CustomTTAReporter, {
    type StepData,
    type TestData,
    type SuiteStats,
} from '../../utils/CustomReporter';

const SCREENSHOT_DIR = path.join('tta-report', 'screenshots');

function tsToMs(t: messages.Timestamp): number {
    return t.seconds * 1000 + Math.floor(t.nanos / 1_000_000);
}

function durationToMs(d?: messages.Duration): number {
    if (!d) return 0;
    return d.seconds * 1000 + Math.floor(d.nanos / 1_000_000);
}

function mapStatus(s: messages.TestStepResultStatus): StepData['status'] {
    if (s === Status.PASSED) return 'passed';
    if (s === Status.FAILED || s === Status.AMBIGUOUS || s === Status.UNDEFINED) return 'failed';
    return 'skipped';
}

function runIdFrom(date: Date): string {
    const p = (n: number): string => String(n).padStart(2, '0');
    return (
        `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}` +
        `_${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
    );
}

export default class TtaCucumberFormatter extends Formatter {
    private startTime = new Date();
    private endTime = new Date();
    private renderPromise: Promise<void> = Promise.resolve();

    constructor(options: IFormatterOptions) {
        super(options);
        options.eventBroadcaster.on('envelope', (envelope: messages.Envelope) => {
            if (envelope.testRunStarted?.timestamp) {
                this.startTime = new Date(tsToMs(envelope.testRunStarted.timestamp));
            }
            if (envelope.testRunFinished?.timestamp) {
                this.endTime = new Date(tsToMs(envelope.testRunFinished.timestamp));
                this.renderPromise = this.render();
            }
        });
    }

    // Block Cucumber's shutdown until the (async) report has been written.
    async finished(): Promise<void> {
        await this.renderPromise;
        await super.finished();
    }

    private writeScreenshot(att: messages.Attachment, testIndex: number, shotIndex: number): string {
        if (!fs.existsSync(SCREENSHOT_DIR)) {
            fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
        }
        const fileName = `bdd_${testIndex}_${shotIndex}.png`;
        const buffer = Buffer.from(att.body, att.contentEncoding === 'BASE64' ? 'base64' : 'utf-8');
        fs.writeFileSync(path.join(SCREENSHOT_DIR, fileName), buffer);
        return `screenshots/${fileName}`;
    }

    private buildTests(): { tests: TestData[]; stats: SuiteStats } {
        const stats: SuiteStats = { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 };
        const tests: TestData[] = [];

        const attempts = this.eventDataCollector.getTestCaseAttempts();
        let testIndex = 0;

        for (const attempt of attempts) {
            testIndex++;
            const pickle = attempt.pickle;
            const featureName = attempt.gherkinDocument.feature?.name ?? 'Feature';
            const pickleStepById = new Map(pickle.steps.map((s) => [s.id, s]));

            const steps: StepData[] = [];
            const screenshots: { name: string; path: string }[] = [];
            let durationMs = 0;
            let error: string | undefined;

            for (const testStep of attempt.testCase.testSteps) {
                const result = attempt.stepResults[testStep.id];
                if (!result) continue;
                durationMs += durationToMs(result.duration);

                // Skip Before/After hooks — only Gherkin steps map to a pickle step.
                if (!testStep.pickleStepId) continue;
                const pickleStep = pickleStepById.get(testStep.pickleStepId);
                const status = mapStatus(result.status);

                const stepData: StepData = {
                    title: pickleStep?.text ?? '(step)',
                    category: 'test.step',
                    duration: durationToMs(result.duration),
                    status,
                    startTime: '',
                    error: result.message,
                    stackTrace: result.message,
                    consoleLogs: [],
                    stepIndex: steps.length,
                };

                for (const att of attempt.stepAttachments[testStep.id] ?? []) {
                    if (att.mediaType === 'image/png') {
                        const rel = this.writeScreenshot(att, testIndex, screenshots.length + 1);
                        stepData.screenshot = rel;
                        screenshots.push({ name: pickleStep?.text ?? `Step ${steps.length + 1}`, path: rel });
                    }
                }

                if (status === 'failed' && !error) error = result.message;
                steps.push(stepData);
            }

            const status = mapStatus(attempt.worstTestStepResult.status);
            stats.total++;
            if (status === 'passed') stats.passed++;
            else if (status === 'failed') stats.failed++;
            else stats.skipped++;

            tests.push({
                id: `test-bdd-${testIndex}`,
                title: pickle.name,
                fullTitle: `${featureName} › ${pickle.name}`,
                file: pickle.uri,
                describePath: [featureName],
                location: pickle.uri.split('/').pop() ?? pickle.uri,
                duration: durationMs,
                status,
                retry: attempt.attempt,
                screenshots,
                steps,
                logs: [],
                error,
                errorStack: error,
                tags: pickle.tags.map((t) => t.name),
            });
        }

        return { tests, stats };
    }

    private async render(): Promise<void> {
        const { tests, stats } = this.buildTests();
        const reporter = new CustomTTAReporter();
        const file = await reporter.renderExternalRun({
            runId: runIdFrom(this.endTime),
            startTime: this.startTime,
            endTime: this.endTime,
            tests,
            stats,
            meta: { browser: 'chromium (cucumber)', workers: 1 },
        });
        this.log(`\n📊 TTA report written: ${file} (open tta-report/index.html)\n`);
    }
}
