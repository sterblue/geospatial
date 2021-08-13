import { deepify } from "../deepify";

describe("deepify", () => {
  test("basic", () => {
    expect(deepify(x => x + x)(42)).toEqual(84);
  });
  test("array", () => {
    expect(deepify(x => x + x)([1, 2])).toEqual([2, 4]);
  });
  test("object", () => {
    expect(deepify(x => x + x)({ a: 1, b: 3 })).toEqual({ a: 2, b: 6 });
  });
});
