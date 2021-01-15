/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  globals: {
    "split-tests": {
      junit: "<rootDir>/junit.xml",
    },
  },
  reporters: process.env.JEST_JOBS_TOTAL
    ? ["default"]
    : [
        "default",
        [
          "jest-junit",
          {
            addFileAttribute: "true",
          },
        ],
      ],
  testSequencer: require.resolve("./src/sequencer"),
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testTimeout: 15000,
};
