const cModule = require("./c");
const wait = require('./wait');

it("c test", () => {
  expect(2 + 2).toBe(4);
});

it("to text", () => {
  expect(cModule.toText(123)).toBe("123");
});

it("sleep", async () => {
  await wait(8000);
});
