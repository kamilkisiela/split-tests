import { findFilenameInJUnit, loadXML } from "@split-tests/core";
import path from "path";
import type { Config } from "@jest/types";
import type { Options } from "./sequencer";

export default function junitAdapter(
  globalConfig: Config.ProjectConfig,
  options: Options
) {
  const rootDir = globalConfig.rootDir;
  const junitPath = options.junit;
  const junitFile = path.resolve(junitPath.replace("<rootDir>", rootDir));
  const junit = loadXML(junitFile);

  const summary = junit.testsuites;

  return summary.testsuite.map((t: any) => {
    const file = findFilenameInJUnit(t);

    return {
      path: path.resolve(path.dirname(junitFile), file),
      time: parseFloat(t.time),
    };
  });
}
