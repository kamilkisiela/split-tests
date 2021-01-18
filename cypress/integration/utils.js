/**
 * @param {number} waitTimeInMs
 * @returns {Promise<void>}
 */
function wait(waitTimeInMs) {
  return new Promise((resolve) => setTimeout(resolve, waitTimeInMs));
}

module.exports = {
  /**
   * @param {number[]} times
   * @param {number} repeat
   * @param {string} label
   */
  createTests(times, repeat, label) {
    describe(label, () => {
      const phases = new Array(repeat).fill(null);

      phases.forEach((_, i) => {
        times.forEach((time, j) => {
          it(`${i} - ${j}`, async () => {
            await wait(time);
            expect(true).to.equal(true);
          });
        });
      });
    });
  },
};
