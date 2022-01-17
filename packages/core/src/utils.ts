import fs from "fs";
import xmlParser from "fast-xml-parser";
import { TimeReport, Test } from "./types";

export function loadXML(file: string) {
  const junitRaw = fs.readFileSync(file, "utf-8");
  return xmlParser.parse(
    junitRaw,
    {
      ignoreAttributes: false,
      attributeNamePrefix: "",
    },
    true
  );
}

export function addNewFiles(reports: TimeReport[], tests: Test[]) {
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

export function removeDeletedFiles(reports: TimeReport[], tests: Test[]) {
  return reports.filter((r) => tests.some((t) => t.path === r.path));
}

export function findFilenameInJUnit(testsuite: any, prop = "file"): string {
  if (!testsuite) {
    throw new Error(`Can't find file`);
  }

  if (Array.isArray(testsuite)) {
    for (const t of testsuite) {
      const file = findFilenameInJUnit(t, prop);

      if (file) {
        return file;
      }
    }
  } else if (typeof testsuite === "object") {
    if (testsuite[prop]) {
      return testsuite[prop];
    }

    if (testsuite.testsuite) {
      return findFilenameInJUnit(testsuite.testsuite, prop);
    }

    if (testsuite.testcase) {
      return findFilenameInJUnit(testsuite.testcase, prop);
    }
  }

  throw new Error(`Can't find file`);
}

export function detectEnv(config?: {
  /**
   * The name of the environment variable that indicates the index of the current job.
   *
   * @default: https://www.npmjs.com/package/ci-parallel-vars#supports
   */
  indexName: string;
  /**
   * The name of the environment variable that indicates the number of jobs to run in parallel.
   *
   * @default: https://www.npmjs.com/package/ci-parallel-vars#supports
   */
  totalName: string;
}): {
  index: number;
  total: number;
} {
  const envs = [
    // Knapsack / TravisCI / GitLab
    {
      index: 'CI_NODE_INDEX',
      total: 'CI_NODE_TOTAL',
    },
    // CircleCI
    {
      index: 'CIRCLE_NODE_INDEX',
      total: 'CIRCLE_NODE_TOTAL',
    },
    // Bitbucket Pipelines
    {
      index: 'BITBUCKET_PARALLEL_STEP',
      total: 'BITBUCKET_PARALLEL_STEP_COUNT',
    },
    // Buildkite
    {
      index: 'BUILDKITE_PARALLEL_JOB',
      total: 'BUILDKITE_PARALLEL_JOB_COUNT',
    },
    // Semaphore
    {
      index: 'SEMAPHORE_CURRENT_JOB',
      total: 'SEMAPHORE_JOB_COUNT',
    },
  ];

  if (config?.indexName && config?.totalName) {
    envs.unshift({
      index: config.indexName,
      total: config.totalName,
    })
  }
  
  function maybeNum(val: string | undefined) {
    if (val === 'undefined') {
      return null;
    }

    const num = parseInt(val!, 10);
    return Number.isNaN(num) ? null : num;
  }
  
  let match: {
    index: number;
    total: number;
  } | null = null;
  
  for (let env of envs) {
    let index = maybeNum(process.env[env.index]);
    let total = maybeNum(process.env[env.total]);
  
    if (index !== null && total !== null) {
      if (process.env.GITLAB_CI) {
        index = index - 1;
      }
      match = { index, total };
      break;
    }
  }

  if (!match) {
    throw new Error(`Failed to detect any relevant environment variables`);
  }

  return match;
}
