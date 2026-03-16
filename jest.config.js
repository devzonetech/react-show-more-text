// jest.config.js
const {defaults} = require('jest-config');
module.exports = {

    moduleFileExtensions: [...defaults.moduleFileExtensions, 'js', 'tsx'],
    collectCoverageFrom: [
        '**/src/*test.{js,jsx}'
    ],
    modulePathIgnorePatterns: ['.example/'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        "node_modules/(?!(cheerio)/)"
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
