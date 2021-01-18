# Split Tests in Jest

Splits test files in Jest and ensures all parallel jobs finish work at a similar time.

**Before**

|                             | Job |    Time    |
| --------------------------- | :-: | :--------: |
| =========================== |  1  | 46 minutes |
| ========                    |  2  | 13 minutes |
| ============                |  3  | 19 minutes |

**After**

|               | Job |    Time    |
| ------------- | :-: | :--------: |
| ============= |  1  | 26 minutes |
| ============= |  2  | 26 minutes |
| ============= |  3  | 26 minutes |

## Setup

Install `@split-tests/jest` package:

    npm install --save-dev @split-tests/jest
    yarn add -D @split-tests/jest

In `jest.config.js`:

```js
module.exports = {
  /* ... */

  // IMPORTANT: set the test sequencer
  testSequencer: require.resolve("@split-tests/jest"),

  // report the run times of the tests, use `jest-unit` reporter
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "unit",
        addFileAttribute: true,
      },
    ],
  ],

  globals: {
    "split-tests": {
      // collect the times
      junit: "<rootDir>/unit/junit.xml",
    },
  },
};
```

## Usage

Jobs are calculated at run time:

**Using environment variables**

    $ JEST_JOBS_TOTAL=3 JEST_JOBS_INDEX=0 jest

- `JEST_JOBS_TOTAL` - total number of jobs
- `JEST_JOBS_INDEX` - index number of the job (starts with 0)

**Using cli arguments**

    $ jest --jobsTotal=3 --jobsIndex=0

- `--jobsTotal` - total number of jobs
- `--jobsIndex` - index number of the job (starts with 0)

## Custom test reporter

It is possible to read reports not only from a junit file but from any source.

Imagine a this scenario, Jest + `jest-junit` but saved in CircleCI or in some database.

```js
module.exports = {
  /* your jest config */

  globals: {
    "split-tests": {
      async reader(tests) {
        const reports = await fetchReports(tests.map((t) => t.path));

        return reports;
      },
    },
  },
};
```

The `reader` is a function that has to return `Array<{path: string; time: number}>` (or as a Promise) and its first argument is a list of tests to be executed in Jest.
