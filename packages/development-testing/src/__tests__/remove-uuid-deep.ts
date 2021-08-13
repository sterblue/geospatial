import { removeUuidDeep } from "../remove-uuid-deep";

describe("deepify", () => {
  test("basic", () => {
    expect(removeUuidDeep("78352b9c-3141-11e9-b210-d663bd873d93")).toEqual(
      "<<< UUID >>>"
    );
  });
  test("array", () => {
    expect(
      removeUuidDeep([
        1,
        2,
        "65e39778-0338-4070-9d4d-71b02fa1ed7f",
        "4847d951-7283-485c-89f3-ca6175015f01"
      ])
    ).toEqual([1, 2, "<<< UUID >>>", "<<< UUID >>>"]);
  });
  test("object", () => {
    expect(
      removeUuidDeep({
        c: [1, "b81da0f4-3141-11e9-b210-d663bd873d93"],
        a: "aa89c17a-3141-11e9-b210-d663bd873d93",
        b: "94b29d58-e507-41a1-9f16-0b11affd9b99"
      })
    ).toEqual({ c: [1, "<<< UUID >>>"], a: "<<< UUID >>>", b: "<<< UUID >>>" });
  });
});
