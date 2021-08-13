import { convertStringToNumber, convertStringToArrayXYZ } from "../string";

describe("Test Convertor Degree Mission Second format To Degree Decimal format", () => {
  test("Test already in Decimal", () => {
    expect(convertStringToNumber("1.55232")).toEqual(1.55232);
    expect(convertStringToNumber("-1.55232")).toEqual(-1.55232);
    expect(convertStringToNumber("+1.55232")).toEqual(1.55232);
  });
  test("Test 1", () => {
    expect(convertStringToNumber("1°0'0\"")).toEqual(1);
    expect(convertStringToNumber("1°2'0\"")).toEqual(1.0333333333333334);
    expect(convertStringToNumber("1°2'3\"")).toEqual(1.0341666666666667);
  });
  test("Test 2", () => {
    expect(convertStringToNumber("1 ° 2 ' 3.253 \" ")).toEqual(
      1.0342369444444444
    );
  });
  test("Test 3", () => {
    expect(convertStringToNumber("1 deg 2 min 3.253 sec ")).toEqual(
      1.0342369444444444
    );
  });
  test("Test 4", () => {
    expect(convertStringToNumber("1deg2 min 3.253 sec ")).toEqual(
      1.0342369444444444
    );
    expect(convertStringToNumber("-1deg2 min 3.253 sec ")).toEqual(
      -1.0342369444444444
    );
  });
  test("Test 5", () => {
    expect(convertStringToNumber("1deg2 min 3.253 sec ")).toEqual(
      1.0342369444444444
    );
  });
  test("Test 6", () => {
    expect(convertStringToNumber("1d 2 m 3.253 s ")).toEqual(
      1.0342369444444444
    );
  });
  test("Test 7", () => {
    expect(convertStringToNumber("1° 2′ 3.253″ ")).toEqual(1.0342369444444444);
  });
  test("Test 8", () => {
    expect(convertStringToNumber("1° 2′ 3.253″ ")).toEqual(1.0342369444444444);
  });
  test("Test 9", () => {
    expect(convertStringToNumber("1° 2′ 3.253″ N")).toEqual(1.0342369444444444);
  });
  test("Test 10", () => {
    expect(convertStringToNumber("1° 2′ 3.253″ S")).toEqual(
      -1.0342369444444444
    );
  });
  test("Test 11", () => {
    expect(convertStringToNumber("1° 2′ 3.253″ E")).toEqual(1.0342369444444444);
  });
  test("Test 12", () => {
    expect(convertStringToNumber("1° 2′ 3.253″ W")).toEqual(
      -1.0342369444444444
    );
  });
  test("Test 13", () => {
    expect(convertStringToNumber("1d 2min 3.253″ W")).toEqual(
      -1.0342369444444444
    );
  });
  test("Test 14", () => {
    expect(convertStringToNumber(`46 deg 37' 4.31" N`)).toEqual(
      46.61786388888889
    );
  });
  test("Test 15", () => {
    expect(convertStringToNumber(`2 deg 52' 15.60" E`)).toEqual(2.871);
  });
  test("Test 16 broke ConvertDMSToDD", () => {
    expect(convertStringToNumber(`+46.6178652`)).toEqual(46.6178652);
  });
});

describe("Test Convertor Degree Mission Second format To Degree Decimal format", () => {
  test("Test already in Decimal", () => {
    expect(convertStringToArrayXYZ("1.55232,2.355553")).toEqual([
      1.55232,
      2.355553,
      NaN
    ]);
  });
  test("Test all features", () => {
    expect(
      convertStringToArrayXYZ(
        "   +  132.55232    d   -76.3223 m +6353.3s North ,    + 6D+4M-5S West"
      )
    ).toEqual([129.51547611111113, -6.065277777777778, NaN]);
  });
  test("Test 1", () => {
    expect(convertStringToArrayXYZ("0.123+6.789")).toEqual([0.123, 6.789, NaN]);
  });
  test("Test 2", () => {
    expect(convertStringToArrayXYZ("1+2m+3s,4+5'+6''")).toEqual([
      1.0341666666666667,
      4.085,
      NaN
    ]);
  });
  test("Test 3", () => {
    expect(convertStringToArrayXYZ("1,2")).toEqual([1, 2, NaN]);
  });
  test("Test 4", () => {
    expect(convertStringToArrayXYZ("1     +   2.m ,2")).toEqual([
      1.0333333333333334,
      2,
      NaN
    ]);
  });
  test("Test 5", () => {
    expect(convertStringToArrayXYZ("1     +   2.m      3´´ ,2")).toEqual([
      1.0341666666666667,
      2,
      NaN
    ]);
  });
  test("Test 6", () => {
    expect(convertStringToArrayXYZ("+1.02D4.31M23SN-1.05DW")).toEqual([
      1.0982222222222222,
      1.05,
      NaN
    ]);
  });
  test("Test 7", () => {
    expect(convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S W")).toEqual([
      29.5,
      30.5,
      NaN
    ]);
  });
  test("Test 8", () => {
    expect(convertStringToArrayXYZ("30D-30M0S N , 30D 30M 0S W")).toEqual([
      29.5,
      -30.5,
      NaN
    ]);
  });
  test("Test 9", () => {
    expect(convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E")).toEqual([
      29.5,
      -30.5,
      NaN
    ]);
  });
  test("Test 10", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, 10m")
    ).toEqual([29.5, -30.5, 10]);
  });
  test("Test 11", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, -35.78m")
    ).toEqual([29.5, -30.5, -35.78]);
  });
  test("Test 12", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, -35.78ft")
    ).toEqual([29.5, -30.5, -10.90574398342327]);
  });
  test("Test 13", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, -35.78", {
        defaultAltitudeUnits: "ft"
      })
    ).toEqual([29.5, -30.5, -10.90574398342327]);
  });
  test("Test 14", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, -35.78m", {
        defaultAltitudeUnits: "ft"
      })
    ).toEqual([29.5, -30.5, -35.78]);
  });
  test("Test 15", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, -35.78m", {
        defaultAltitudeUnits: "ft",
        outputAltitudeUnits: "ft"
      })
    ).toEqual([29.5, -30.5, -117.388451622]);
  });
  test("Test 16", () => {
    expect(
      convertStringToArrayXYZ("30D-30M0S N , -30D 30M 0S E, -35.78ft", {
        defaultAltitudeUnits: "m",
        outputAltitudeUnits: "ft"
      })
    ).toEqual([29.5, -30.5, -35.78]);
  });
});
