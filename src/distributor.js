/// @ts-check

/**
 * @param {import('./sequencer').TimeReport[]} tests
 * @param {number} jobs
 */
function distribute(tests, jobs) {
  const sortedFilesWithStats = tests.sort((a, b) => {
    return b.time - a.time;
  });

  function createBuckets(totalGroups) {
    const buckets = [];
    for (let i = 0; i < totalGroups; i++) {
      buckets.push({ time: 0, files: [] });
    }
    return buckets;
  }

  function nextBucketBy(buckets) {
    const mininumPropertyValue = Math.min(...buckets.map((b) => b.time));
    return buckets.find((bucket) => bucket.time === mininumPropertyValue);
  }

  const buckets = createBuckets(jobs);
  for (let i = 0; i < sortedFilesWithStats.length; i++) {
    const bucket = nextBucketBy(buckets);
    const { path, time } = sortedFilesWithStats[i];

    bucket.time += time;
    bucket.files.push(path);
  }
  return buckets;
}

module.exports = distribute;
