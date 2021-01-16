import Sequencer from "@jest/test-sequencer";
import type { Test } from "jest-runner";
import {
  distribute,
  removeDeletedFiles,
  addNewFiles,
  TimeReport,
} from "@split-tests/core";

import junit from "./junit-adapter";

export interface Options {
  junit: string;
  reader(tests: Test[]): Promise<TimeReport[]>;
  jobs: { total(): number; index(): number };
}

function getArg(name: string) {
  const arg = process.argv.find((val) => val.startsWith(`--${name}`));

  if (arg) {
    return arg.replace(`--${name}=`, "");
  }
}

export default class JobSequencer extends Sequencer {
  // @ts-ignore
  async sort(tests: Test[]) {
    if (process.env.JEST_JOBS_TOTAL || getArg("jobsTotal")) {
      let total = parseInt(
        process.env.JEST_JOBS_TOTAL || getArg("jobsTotal")!,
        10
      );
      let index = parseInt(
        process.env.JEST_JOBS_INDEX || getArg("jobsIndex")!,
        10
      );

      if (process.env.JEST_NORMAL) {
        return tests
          .sort((a, b) => (a.path < b.path ? -1 : 1))
          .filter((_, i) => i % total === index);
      }

      const config = tests[0].context.config;

      let reports: TimeReport[] = [];
      const normalizedTests = tests.sort((a, b) => (a.path < b.path ? -1 : 1));

      if (config.globals && config.globals["split-tests"]) {
        const options = config.globals["split-tests"] as Options;
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

      reports = removeDeletedFiles(reports, normalizedTests);
      reports = addNewFiles(reports, normalizedTests);

      const groups = distribute(reports, total);

      return groups[index].files.map((testFile) =>
        normalizedTests.find((t) => t.path === testFile)
      );
    }

    return tests;
  }
}
