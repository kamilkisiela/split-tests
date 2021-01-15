/// @ts-check

const Sequencer = require("@jest/test-sequencer").default;
const createGroups = require("./distributor");
const junit = require("./junit-adapter");

/**
 * @typedef {{path: string; time: number;}} TimeReport
 * @typedef {import('jest-runner').Test} Test
 * @typedef {{junit: string; reader(tests: Test[]): Promise<TimeReport[]>; jobs: { total(): number; index(): number; }}} Options
 */

function getArg(name) {
  const arg = process.argv.find((val) => val.startsWith(`--${name}`));

  if (arg) {
    return arg.replace(`--${name}=`, "");
  }
}

/**
 * :)
 */
class JobSequencer extends Sequencer {
  /**
   *
   * @param {Test[]} tests
   */
  async sort(tests) {
    if (process.env.JEST_JOBS_TOTAL || getArg("jobsTotal")) {
      let total = parseInt(
        process.env.JEST_JOBS_TOTAL || getArg("jobsTotal"),
        10
      );
      let index = parseInt(
        process.env.JEST_JOBS_INDEX || getArg("jobsIndex"),
        10
      );

      if (process.env.JEST_NORMAL) {
        return tests
          .sort((a, b) => (a.path < b.path ? -1 : 1))
          .filter((_, i) => i % total === index);
      }

      const config = tests[0].context.config;

      /**
       * @type TimeReport[]
       */
      let reports = [];
      const normalizedTests = tests.sort((a, b) => (a.path < b.path ? -1 : 1));

      if (config.globals && config.globals["split-tests"]) {
        /**
         * @type Options
         */
        const options = config.globals["split-tests"];
        if (options.junit) {
          reports = junit(config, options);
        } else if (typeof options.reader === "function") {
          // we might need to use absolute paths here
          reports = await options.reader(normalizedTests);
        }

        if (options.jobs) {
          if (options.jobs.total) {
            total = options.jobs.total();
          }

          if (options.jobs.index) {
            index = options.jobs.index();
          }
        }
      }

      reports = this.removeDeletedFiles(reports, normalizedTests);
      reports = this.addNewFiles(reports, normalizedTests);

      const groups = createGroups(reports, total);

      return groups[index].files.map((testFile) =>
        normalizedTests.find((t) => t.path === testFile)
      );
    }

    return tests;
  }

  /**
   * @param {TimeReport[]} reports
   * @param {Test[]} tests
   */
  removeDeletedFiles(reports, tests) {
    return reports.filter((r) => tests.some((t) => t.path === r.path));
  }

  /**
   * @param {TimeReport[]} reports
   * @param {Test[]} tests
   */
  addNewFiles(reports, tests) {
    let averageFileTime = 0;

    if (reports.length) {
      for (const report of reports) {
        averageFileTime += report.time;
      }

      averageFileTime /= reports.length;
    } else {
      averageFileTime = 1;
    }

    return tests.map((t) => {
      const existing = reports.find((r) => r.path === t.path);

      return existing || { path: t.path, time: averageFileTime };
    });
  }
}

module.exports = JobSequencer;
