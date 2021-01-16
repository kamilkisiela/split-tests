/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  globals: {
    "split-tests": {
      junit: "<rootDir>/unit/junit.xml",
    },
  },
  reporters: process.env.JEST_JOBS_TOTAL
    ? ["default"]
    : [
        "default",
        [
          "jest-junit",
          {
            outputDirectory: 'unit',
            addFileAttribute: "true",
          },
        ],
      ],
  testSequencer: require.resolve("./packages/jest/dist/index.cjs"),
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testTimeout: 15000,
};
