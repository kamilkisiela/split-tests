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
