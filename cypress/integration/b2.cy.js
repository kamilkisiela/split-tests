const bModule = require("./b");
const wait = require('./wait');

describe("b spec described", () => {
  it("b spec", () => {
    expect(2 + 2).to.equal(4);
  });

  it("yet another b spec", () => {
    expect(2 + 2).to.equal(4);
  });

  describe("multiple", () => {
    it("multiple test", () => {
      expect(bModule.multiple(2, 3)).to.equal(6);
    });
  });

  it("sleep", async () => {
    await wait(2000);
  });
});
