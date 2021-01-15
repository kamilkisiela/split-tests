const cModule = require("./c");
const wait = require("./wait");

describe("c2", () => {
  it("c test", () => {
    expect(2 + 2).to.equal(4);
  });

  it("to text", () => {
    expect(cModule.toText(123)).to.equal("123");
  });

  it("sleep", async () => {
    await wait(6000);
  });
});
