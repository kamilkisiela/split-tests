# Split Tests in Cypress

Splits test files in Cypress and ensures all parallel jobs finish work at a similar time.

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

Install `@split-tests/cypress` package:

    npm install --save-dev @split-tests/cypress
    yarn add -D @split-tests/cypress
  
In `cypress/plugins/index.js`:

```js
const plugin = require("@split-tests/cypress");

module.exports = plugin;
```

Use JUnit to report run times of the tests (in `cypress.json`):

```json
{
  "reporter": "junit",
  "reporterOptions": {
    "mochaFile": "reports/junit-[hash].xml"
  }
};
```

## Usage

Jobs are calculated at run time:

    $ CYPRESS_JOBS_TOTAL=3 CYPRESS_JOBS_INDEX=0 jest

- `CYPRESS_JOBS_TOTAL` - total number of jobs
- `CYPRESS_JOBS_INDEX` - index number of the job (starts with 0)

Or 

- Knapsack / TravisCI / GitLab - `CI_NODE_INDEX` / `CI_NODE_TOTAL`
- CircleCI - `CIRCLE_NODE_INDEX` / `CIRCLE_NODE_TOTAL`
- Bitbucket Pipelines - `BITBUCKET_PARALLEL_STEP` / `BITBUCKET_PARALLEL_STEP_COUNT`
- Buildkite - `BUILDKITE_PARALLEL_JOB` / `BUILDKITE_PARALLEL_JOB_COUNT`
- Semaphore - `SEMAPHORE_CURRENT_JOB` / `SEMAPHORE_JOB_COUNT`


