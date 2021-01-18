import { TimeReport } from "./types";

export function distribute(
  reports: TimeReport[],
  jobs: number
): { time: number; files: string[] }[] {
  const sortedFilesWithStats = reports.sort((a, b) => {
    return b.time - a.time;
  });

  function createBuckets(totalGroups: number) {
    const buckets = [];
    for (let i = 0; i < totalGroups; i++) {
      buckets.push({ time: 0, files: [] });
    }
    return buckets;
  }

  function nextBucketBy(buckets: any[]) {
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
