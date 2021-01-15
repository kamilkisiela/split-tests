/// @ts-check

const glob = require("glob");
const path = require("path");
const fs = require("fs");
const xmlParser = require("fast-xml-parser");
const { removeDeletedFiles, addNewFiles, findFilename } = require("./utils");
const createGroups = require("./distributor");

function findFiles(config) {
  const rootDir = config.integrationFolder;
  const pattern = config.testFiles;
  // const options = require(config.configFile)['split-tests'];

  return glob.sync(pattern, { cwd: rootDir, absolute: true });
}

function loadReports(config) {
  const pattern = config.reporterOptions.mochaFile.replace("[hash]", "*");
  const rootDir = config.projectRoot;
  const reports = glob.sync(pattern, { cwd: rootDir, absolute: true });

  return reports.map(loadReport).map((t) => ({
    time: t.time,
    path: path.join(config.projectRoot, t.path),
  }));
}

function loadReport(file) {
  const junitRaw = fs.readFileSync(file, "utf-8");
  const junit = xmlParser.parse(
    junitRaw,
    {
      ignoreAttributes: false,
      attributeNamePrefix: "",
    },
    true
  );

  const time = parseFloat(junit.testsuites.time);
  const testfile = findFilename(junit.testsuites);

  return {
    time,
    path: testfile,
  };
}

module.exports = (on, config) => {
  if (!process.env.CYPRESS_JOBS_TOTAL) {
    return config;
  }

  const tests = findFiles(config);
  const normalizedTests = tests.sort().map((t) => ({
    path: t,
  }));

  let total = parseInt(process.env.CYPRESS_JOBS_TOTAL, 10);
  let index = parseInt(process.env.CYPRESS_JOBS_INDEX, 10);

  /**
   * @type {import('./sequencer').TimeReport[]}
   */
  let reports = [];
  reports = removeDeletedFiles(reports, normalizedTests);
  reports = addNewFiles(reports, normalizedTests);

  const groups = createGroups(reports, total);

  config.testFiles = groups[index].files
    .map((testFile) => normalizedTests.find((t) => t.path === testFile))
    .map((t) => path.relative(config.integrationFolder, t.path));

  // return config
  return config;
};
