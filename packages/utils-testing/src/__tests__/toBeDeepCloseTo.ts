import { toBeDeepCloseTo } from "../toBeDeepCloseTo";
expect.extend({ toBeDeepCloseTo });

describe("toBeDeepCloseTo", () => {
  it("numbers", () => {
    expect(42).toBeDeepCloseTo(42, 3);
    expect(42.0003).toBeDeepCloseTo(42.0004, 3);
  });

  it("array", () => {
    expect([42]).toBeDeepCloseTo([42], 3);
    expect([42.0003]).toBeDeepCloseTo([42.0004], 3);
  });

  it("array of arrays", () => {
    expect([[42]]).toBeDeepCloseTo([[42]], 3);
    expect([[42.0003]]).toBeDeepCloseTo([[42.0004]], 3);
  });

  it("object of arrays", () => {
    expect({ a: [42] }).toBeDeepCloseTo({ a: [42] }, 3);
    expect({ a: [42.0003], b: 23 }).toBeDeepCloseTo({ a: [42.0004], b: 23 }, 3);
  });
});

describe("fails", () => {
  it("numbers", () => {
    expect(43).not.toBeDeepCloseTo(42, 3);
    expect(42.03).not.toBeDeepCloseTo(42.0004, 3);
  });

  it("array", () => {
    expect([43]).not.toBeDeepCloseTo([42], 3);
    expect([42.03]).not.toBeDeepCloseTo([42.0004], 3);
  });

  it("array of arrays", () => {
    expect([[43]]).not.toBeDeepCloseTo([[42]], 3);
    expect([[42.03]]).not.toBeDeepCloseTo([[42.0004]], 3);
  });

  it("object of arrays", () => {
    expect({ a: [42] }).not.toBeDeepCloseTo({ a: [43] }, 3);
    expect({ a: [42.0003], b: 24 }).not.toBeDeepCloseTo(
      { a: [42.0004], b: 23 },
      3
    );
  });

  it("array length", () => {
    expect([[43]]).not.toBeDeepCloseTo([[43, 43]], 3);
  });

  it("data type", () => {
    expect([[43]]).not.toBeDeepCloseTo([["43"]], 3);
  });
});
