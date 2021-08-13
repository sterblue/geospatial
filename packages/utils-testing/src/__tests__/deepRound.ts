import { deepRound } from "../deepRound";

describe("deepRound", () => {
  it("numbers", () => {
    expect(deepRound(42)).toEqual(42);
    expect(deepRound(42.0003)).toEqual(42.0003);
    expect(deepRound(42.000000003)).toEqual(42);
  });

  it("array", () => {
    expect(deepRound([42])).toEqual([42]);
    expect(deepRound([42.0003])).toEqual([42.0003]);
    expect(deepRound([42.0003], 1)).toEqual([42.0]);
  });

  it("array of arrays", () => {
    expect(deepRound([[42]])).toEqual([[42]]);
    expect(deepRound([[42.0003]])).toEqual([[42.0003]]);
    expect(deepRound([[42.0003, "aaa", "42.000003"]], 0)).toEqual([
      [42, "aaa", "42.000003"]
    ]);
  });

  it("object of arrays", () => {
    expect(deepRound({ a: [42] })).toEqual({ a: [42] });
    expect(deepRound({ a: [42.0003], b: 23 })).toEqual({ a: [42.0003], b: 23 });
    expect(deepRound({ a: [42.0003], b: 23 }, 1)).toEqual({ a: [42], b: 23 });
  });

  it("deep object of arrays", () => {
    expect(
      deepRound({
        a: [42],
        b: { c: 1, d: "dodd", e: [{ a: 1.0000000003, c: 5 }, "deded", [4, 5]] }
      })
    ).toEqual({
      a: [42],
      b: { c: 1, d: "dodd", e: [{ a: 1, c: 5 }, "deded", [4, 5]] }
    });
  });
});
