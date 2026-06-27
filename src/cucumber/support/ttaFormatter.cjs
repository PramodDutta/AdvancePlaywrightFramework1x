/**
 * CommonJS loader shim for the TTA Cucumber formatter.
 *
 * Cucumber resolves custom formatters with a native ESM `import()`, which can't
 * load a `.ts` module (nor its extensionless imports). This CJS shim is what
 * cucumber.js references; it requires the TypeScript implementation through the
 * already-registered ts-node hook and re-exports the formatter class.
 */
require("ts-node/register");
require("tsconfig-paths/register");

module.exports = require("./ttaFormatter.ts").default;
