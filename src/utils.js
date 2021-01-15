/**
 * @param {TimeReport[]} reports
 * @param {Test[]} tests
 */
function addNewFiles(reports, tests) {
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

/**
 * @param {TimeReport[]} reports
 * @param {Test[]} tests
 */
function removeDeletedFiles(reports, tests) {
  return reports.filter((r) => tests.some((t) => t.path === r.path));
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

module.exports = {
  addNewFiles,
  removeDeletedFiles,
  findFilename,
};
