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
  testSequencer: require.resolve("./package/jest/dist/index.cjs"),
  testEnvironment: "node",
  testMatch: ["**/?(*.)?(spec).js"],
  testTimeout: 15000,
};
