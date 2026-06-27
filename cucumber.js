const path = require("path");

// Compile step defs / hooks / formatter with the Cucumber-specific tsconfig
// (CommonJS + path-alias support) regardless of where cucumber-js is invoked.
process.env.TS_NODE_PROJECT =
  process.env.TS_NODE_PROJECT ||
  path.resolve(__dirname, "src/cucumber/tsconfig.json");

// Shared profile body. The custom TTA formatter is given a file sink (not
// stdout) so it never collides with the progress-bar formatter; it writes the
// real HTML report to tta-report/ via CustomTTAReporter.renderExternalRun.
const base = {
  requireModule: ["ts-node/register", "tsconfig-paths/register"],
  require: ["src/cucumber/**/*.ts"],
  paths: ["src/cucumber/**/*.feature"],
  format: [
    "progress-bar",
    "html:reports/cucumber/report.html",
    "./src/cucumber/support/ttaFormatter.cjs:tta-report/.cucumber-tta.log",
  ],
  formatOptions: { snippetInterface: "async-await" },
  publishQuiet: true,
};

module.exports = {
  default: base,
  level0: { ...base, tags: "@level0" },
  level1: { ...base, tags: "@level1" },
  level2: { ...base, tags: "@level2" },
};
