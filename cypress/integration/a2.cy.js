const aModule = require('./a');
const wait = require('./wait');

describe('a1', () => {
  it("a test", () => {
    expect(2 + 2).to.equal(4);
  });
  
  it("add test", () => {
    expect(aModule.add(2, 2)).to.equal(4);
  });
  
  it("sleep", async () => {
    await wait(5000);
  });
})