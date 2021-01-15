/// @ts-check

const xmlParser = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");

/**
 * @param {import('@jest/types').Config.ProjectConfig} globalConfig 
 * @param {import('./sequencer').Options} options 
 */
function junitAdapter(globalConfig, options) {
  const rootDir = globalConfig.rootDir;
  const junitPath = options.junit;
  const junitFile = path.resolve(junitPath.replace("<rootDir>", rootDir));
  const junitRaw = fs.readFileSync(junitFile, "utf-8");
  const junit = xmlParser.parse(
    junitRaw,
    {
      ignoreAttributes: false,
      attributeNamePrefix: "",
    },
    true
  );

  const summary = junit.testsuites;

  return summary.testsuite.map((t) => {
    const file = findFilename(t);

    return {
      path: path.resolve(path.dirname(junitFile), file),
      time: parseFloat(t.time),
    };
  });
}

function findFilename(testsuite) {
  if (!testsuite) {
    throw new Error(`Can't find file`);
  }

  if (Array.isArray(testsuite)) {
    for (const t of testsuite) {
      const file = findFilename(t);

      if (file) {
        return file;
      }
    }
  } else if (typeof testsuite === "object") {
    if (testsuite.file) {
      return testsuite.file;
    }

    if (testsuite.testsuite) {
      return findFilename(testsuite.testsuite);
    }

    if (testsuite.testcase) {
      return findFilename(testsuite.testcase);
    }
  }
}

module.exports = junitAdapter;
