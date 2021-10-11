import glob from "glob";
import path from "path";
import {
  distribute,
  removeDeletedFiles,
  addNewFiles,
  findFilenameInJUnit,
  loadXML,
  TimeReport,
} from "@split-tests/core";

function isDefined<T>(val: T | null | undefined): value is T {
  return !!t;
}

function findFiles(config: any): string[] {
  const rootDir = config.integrationFolder;
  const pattern = config.testFiles;
  // const options = require(config.configFile)['split-tests'];

  return glob.sync(pattern, { cwd: rootDir, absolute: true });
}

function loadReports(config: any): TimeReport[] {
  const pattern = config.reporterOptions.mochaFile.replace("[hash]", "*");
  const rootDir = config.projectRoot;
  const reports = glob.sync(pattern, { cwd: rootDir, absolute: true });

  return reports.map(loadReport).filter(isDefined).map((t) => ({
    time: t.time,
    path: path.join(config.projectRoot, t.path),
  }));
}

function loadReport(file: string): null | {time: number, path: string} {
  const junit = loadXML(file);

  if (!junit.testsuites.testsuite || !junit.testsuites.testsuite.length) {
    return null;
  }

  const time = parseFloat(junit.testsuites.time);
  const testfile = findFilenameInJUnit(junit.testsuites);

  return {
    time,
    path: testfile,
  };
}

module.exports = (_on: any, config: any) => {
  if (!process.env.CYPRESS_JOBS_TOTAL) {
    return config;
  }

  const tests = findFiles(config);
  const normalizedTests = tests.sort().map((t) => ({
    path: t,
  }));

  let total = parseInt(process.env.CYPRESS_JOBS_TOTAL!, 10);
  let index = parseInt(process.env.CYPRESS_JOBS_INDEX!, 10);

  let reports = loadReports(config);
  reports = removeDeletedFiles(reports, normalizedTests);
  reports = addNewFiles(reports, normalizedTests);

  const groups = distribute(reports, total);

  config.testFiles = groups[index].files
    .map((testFile: any) => normalizedTests.find((t) => t.path === testFile)!)
    .map((t) => path.relative(config.integrationFolder, t.path));

  // return config
  return config;
};
