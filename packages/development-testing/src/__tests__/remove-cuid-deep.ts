import { removeCuidDeep } from "../remove-cuid-deep";

describe("deepify", () => {
  test("basic", () => {
    expect(removeCuidDeep("ck76a60qr0006fuy12rzt38yv")).toEqual("<<< CUID >>>");
  });
  test("array", () => {
    expect(
      removeCuidDeep([
        1,
        2,
        "ck76a60qr0006fuy12rzt38yv",
        "ck76a60qr0005fuy193p614sb"
      ])
    ).toEqual([1, 2, "<<< CUID >>>", "<<< CUID >>>"]);
  });
  test("object", () => {
    expect(
      removeCuidDeep({
        c: [1, "ck76a60qr0006fuy12rzt38yv"],
        a: "ck76a60qr0005fuy193p614sb",
        b: "ck76a60qr0004fuy13pfdh29h"
      })
    ).toEqual({ c: [1, "<<< CUID >>>"], a: "<<< CUID >>>", b: "<<< CUID >>>" });
  });
});
