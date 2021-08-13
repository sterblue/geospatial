import * as THREE from "three-universal/build/three.node";
import { Vector2, Vector3, Vector4 } from "three-universal/build/three.node";
import { convertFormat } from "..";
import * as cesium from "cesium";

describe("Formats", () => {
  test("XY to XYZ", () => {
    expect(
      convertFormat(
        {
          type: "arrayXY"
        },
        {
          type: "arrayXYZ"
        }
      )([1, 1])
    ).toEqual([1, 1, NaN]);
  });

  test("XY to string", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "string"
        }
      )([1, 1])
    ).toEqual("1,1,NaN");
  });
  test("XYZ to string", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "string"
        }
      )([1, 2, 3])
    ).toEqual("1,2,3");
  });

  test("XY to object XYZ", () => {
    expect(
      convertFormat(
        {
          type: "arrayXY"
        },
        {
          type: "objectLatitudeLongitudeAltitude"
        }
      )([1, 1])
    ).toEqual({ latitude: 1, longitude: 1, altitude: NaN });
  });

  test("XY to object lat lon", () => {
    expect(
      convertFormat(
        {
          type: "arrayXY"
        },
        {
          type: "objectLatLon"
        }
      )([1, 1])
    ).toEqual({ lat: 1, lon: 1 });
  });

  test("XYZ to arrayLatitudeLongitudeAltitude", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "arrayLatitudeLongitudeAltitude"
        }
      )([1, 2, 3])
    );
  });
  test("XYZ to object lat lon alt", () => {
    expect(
      convertFormat(
        {
          type: "arrayXY"
        },
        {
          type: "objectLatLonAlt"
        }
      )([1, 1])
    ).toEqual({ lat: 1, lon: 1, alt: NaN });
  });

  test("ArrayXY to THREE vector 2", () => {
    expect(
      convertFormat(
        {
          type: "arrayXY"
        },
        {
          type: "threeVector2",
          three: THREE
        }
      )([1, 1])
    ).toBeInstanceOf(Vector2);
  });
  test(" THREE vector 2 to ArrayXYZ", () => {
    const pointObject = new Vector2(1, 2);
    expect(
      convertFormat(
        {
          type: "threeVector2",
          three: THREE
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, NaN]);
  });
  test("ArrayXYZ to THREE vector 3", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "threeVector3",
          three: THREE
        }
      )([1, 1, 4])
    ).toBeInstanceOf(Vector3);
  });
  test("THREE vector 3 to ArrayXYZ", () => {
    const pointObject = new Vector3(1, 2, 3);
    expect(
      convertFormat(
        {
          type: "threeVector3",
          three: THREE
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, 3]);
  });
  test("ArrayXYZ to THREE vector 4", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "threeVector4",
          three: THREE
        }
      )([1, 1, 3, 4])
    ).toBeInstanceOf(Vector4);
  });
  test("THREE vector 4 to ArrayXYZ", () => {
    const pointObject = new Vector4(1, 2, 3, 4);
    expect(
      convertFormat(
        {
          type: "threeVector4",
          three: THREE
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, 3]);
  });
  test("ArrayXYZ to Cesium Cartographic", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "cesiumCartographic",
          cesium: cesium
        }
      )([1, 1, 3])
    ).toBeInstanceOf(cesium.Cartographic);
  });
  test("Cesium Cartographic to ArrayXYZ", () => {
    const pointObject = new cesium.Cartographic(1, 2, 3);
    expect(
      convertFormat(
        {
          type: "cesiumCartographic",
          cesium: cesium
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, 3]);
  });
  test("ArrayXYZ to Cesium Cartesian2", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "cesiumCartesian2",
          cesium: cesium
        }
      )([1, 1, 3])
    ).toBeInstanceOf(cesium.Cartesian2);
  });
  test("Cesium Cartesian2 to ArrayXYZ", () => {
    const pointObject = new cesium.Cartesian2(1, 2);
    expect(
      convertFormat(
        {
          type: "cesiumCartesian2",
          cesium: cesium
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, NaN]);
  });
  test("ArrayXYZ to Cesium Cartesian3", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "cesiumCartesian3",
          cesium: cesium
        }
      )([1, 1, 3])
    ).toBeInstanceOf(cesium.Cartesian3);
  });
  test("Cesium Cartesian3 to ArrayXYZ", () => {
    const pointObject = new cesium.Cartesian3(1, 2, 3);
    expect(
      convertFormat(
        {
          type: "cesiumCartesian3",
          cesium: cesium
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, 3]);
  });
  test("ArrayXYZ to Cesium Cartesian4", () => {
    expect(
      convertFormat(
        {
          type: "arrayXYZ"
        },
        {
          type: "cesiumCartesian4",
          cesium: cesium
        }
      )([1, 1, 3])
    ).toBeInstanceOf(cesium.Cartesian4);
  });
  test("Cesium Cartesian4 to ArrayXYZ", () => {
    const pointObject = new cesium.Cartesian4(1, 2, 3, 4);
    expect(
      convertFormat(
        {
          type: "cesiumCartesian4",
          cesium: cesium
        },
        {
          type: "arrayXYZ"
        }
      )(pointObject)
    ).toEqual([1, 2, 3]);
  });
});
