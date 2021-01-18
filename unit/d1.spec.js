const wait = require("./wait");

describe("d1", () => {
  it("d test", () => {
    expect(2 + 2).toEqual(4);
  });

  it("sleep", async () => {
    await wait(10000);
  });
});
