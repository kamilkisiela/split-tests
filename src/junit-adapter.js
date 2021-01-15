/// @ts-check

const xmlParser = require("fast-xml-parser");
const fs = require("fs");
const path = require("path");
const { findFilename } = require("./utils");

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

module.exports = junitAdapter;
