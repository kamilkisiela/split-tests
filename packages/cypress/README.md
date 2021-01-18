# Split Tests in Cypress

Splits test files in Cypress and ensures all parallel jobs finish work at a similar time.

**Before**

:=========================== - Job 1 (46 minutes)
:======== - Job 2 (13 minutes)
:============ - Job 3 (19 minutes)

**Before**

:============= - Job 1 (26 minutes)
:============= - Job 2 (26 minutes)
:============= - Job 3 (26 minutes)

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


