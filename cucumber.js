process.env.TS_NODE_PROJECT = process.env.TS_NODE_PROJECT || 'src/cucumber/tsconfig.json';

const support = ['src/cucumber/support/**/*.ts'];

const common = {
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    format: ['progress-bar', 'html:reports/cucumber/report.html', 'summary'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true,
};

module.exports = {
    default: {
        ...common,
        require: [...support, 'src/cucumber/**/steps/**/*.ts'],
        paths: ['src/cucumber/**/features/**/*.feature'],
    },
    level0: {
        ...common,
        require: [...support, 'src/cucumber/level-00-installation/steps/**/*.ts'],
        paths: ['src/cucumber/level-00-installation/features/**/*.feature'],
    },
    level1: {
        ...common,
        require: [...support, 'src/cucumber/level-01-basic/steps/**/*.ts'],
        paths: ['src/cucumber/level-01-basic/features/**/*.feature'],
    },
    level2: {
        ...common,
        require: [
            ...support,
            'src/cucumber/level-01-basic/steps/**/*.ts',
            'src/cucumber/level-02-data-driven/steps/**/*.ts',
        ],
        paths: ['src/cucumber/level-02-data-driven/features/**/*.feature'],
    },
};
