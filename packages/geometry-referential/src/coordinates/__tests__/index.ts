import { toBeDeepCloseTo } from "@geospatial/development-testing";
expect.extend({ toBeDeepCloseTo });
import { transformCoordinates } from "..";

describe("Coordinate transformations", () => {
  test("NaN's should pass untouched", () => {
    expect(
      transformCoordinates(
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        }
      )([1, 1, NaN])
    ).toEqual([1, 1, NaN]);
  });
  test("Same coordinate reference system should work", () => {
    expect(
      transformCoordinates(
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        }
      )([1, 1, 1])
    ).toEqual([1, 1, 1]);
  });
  test("Test 4978 to 4326", () => {
    expect(
      transformCoordinates(
        {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs ",
          altitudeReference: "default"
        },
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        }
      )([4922501.3, -653509.07, 3989400.39])
    ).toEqual([-7.56233996602137, 38.96618001296369, 2.9946155063807964]);
  });
  test("Test 4978 to 4326 test 2", () => {
    expect(
      transformCoordinates(
        {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs ",
          altitudeReference: "default"
        },
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        }
      )([4960950.7689646445, -652261.8624914176, 3942007.8149492354])
    ).toEqual([-7.49024, 38.41922000000001, 0]);
  });
  test("Test 4326 to 4978", () => {
    expect(
      transformCoordinates(
        {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +units=m +no_defs",
          altitudeReference: "default"
        },
        {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +no_defs",
          altitudeReference: "default"
        }
      )([-7.56233996602137, 38.96618001296369, 2.9946155063807964])
    ).toBeDeepCloseTo([4922501.3, -653509.07, 3989400.389999], 6);
  });
});
