# Split Tests

Ensures all parallel jobs finish work at a similar time!

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

- [Jest documentation](packages/jest/README.md)
- [Cypress documentation](packages/cypress/README.md)
