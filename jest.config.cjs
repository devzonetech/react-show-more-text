// jest.config.cjs
const {defaults} = require('jest-config');
module.exports = {

    moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'jsx', 'tsx'],
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    collectCoverageFrom: [
        '**/src/*test.{js,jsx}'
    ],
    modulePathIgnorePatterns: ['.example/', 'dist/', '.storybook/'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        "node_modules/(?!(cheerio|htmlparser2)/)",
        "dist/"
    ],
    setupFiles: [
        "<rootDir>/jest-config/text-encoder-polyfill.js",
        "<rootDir>/jest-config/canvas-mock.js"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/jest-config/scheduler-cleanup.js"
    ],
    "moduleNameMapper": {
        "\\.(css|less|sass|scss)$": "<rootDir>/jest-config/style-mock.js",
   },
    forceExit: true,
    detectOpenHandles: false,
};
