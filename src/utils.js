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

module.exports = {
  addNewFiles,
  removeDeletedFiles,
};
