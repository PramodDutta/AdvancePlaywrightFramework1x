const path = require("path");

// Compile step defs / hooks with the Cucumber-specific tsconfig (CommonJS +
// path-alias support) regardless of where cucumber-js is invoked from.
process.env.TS_NODE_PROJECT =
  process.env.TS_NODE_PROJECT ||
  path.resolve(__dirname, "src/cucumber/tsconfig.json");

module.exports = {
  default: {
    requireModule: ["ts-node/register", "tsconfig-paths/register"],
    require: ["src/cucumber/**/*.ts"],
    paths: ["src/cucumber/**/*.feature"],
    format: ["progress-bar", "html:reports/cucumber/report.html"],
    formatOptions: { snippetInterface: "async-await" },
    publishQuiet: true,
  },
};
