import glob from "glob";
import path from "path";
import {
  distribute,
  removeDeletedFiles,
  addNewFiles,
  findFilenameInJUnit,
  loadXML,
  TimeReport,
  detectEnv,
} from "@split-tests/core";

function isDefined<T>(val: T | null | undefined): val is T {
  return !!val;
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

  return reports
    .map(loadReport)
    .filter(isDefined)
    .map((t) => ({
      time: t.time,
      path: path.join(config.projectRoot, t.path),
    }));
}

function loadReport(file: string): null | { time: number; path: string } {
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
  let detected = detectEnv({
    indexName: "CYPRESS_JOBS_INDEX",
    totalName: "CYPRESS_JOBS_TOTAL",
  });

  if (!detected) {
    return config;
  }

  const tests = findFiles(config);
  const normalizedTests = tests.sort().map((t) => ({
    path: t,
  }));

  let reports = loadReports(config);
  reports = removeDeletedFiles(reports, normalizedTests);
  reports = addNewFiles(reports, normalizedTests);

  const groups = distribute(reports, detected.total);

  config.testFiles = groups[detected.index].files
    .map((testFile: any) => normalizedTests.find((t) => t.path === testFile)!)
    .map((t) => path.relative(config.integrationFolder, t.path));

  // return config
  return config;
};
