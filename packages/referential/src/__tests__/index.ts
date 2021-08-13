import { Vector3 } from "three-universal/build/three.node";
import * as THREE from "three-universal/build/three.node";
import { convert, convertAsync } from "../";
import * as cesium from "cesium";

import { toBeDeepCloseTo } from "@geospatial/development-testing";
import {
  systemWgs84Egm96,
  systemGeocentric,
  formatArrayLatitudeLongitudeAltitude,
  formatObjectXYZ
} from "../constants";
expect.extend({ toBeDeepCloseTo });

jest.setTimeout(30000);

describe("Convert formats", () => {
  test("XY to XYZ", () => {
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "arrayXY"
          }
        },
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "arrayXYZ"
          }
        }
      )([1, 1])
    ).toEqual([1, 1, NaN]);
  });

  test("XY to object XYZ", () => {
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "arrayXY"
          }
        },
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "objectXYZ"
          }
        }
      )([1, 1])
    ).toEqual({ x: 1, y: 1, z: NaN });
  });

  test("Transform from 4326 to 3763 (Portugal TM06) and change format from cesium cartographic to arrayXYZ ", () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "cesiumCartographic",
            cesium: cesium
          }
        },
        {
          system: {
            type: "reference",
            definition:
              "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "arrayXYZ"
          }
        }
      )(testingPointObject)
    ).toEqual([49467.31334521535, -77790.87043755408, 2.9946155063807964]);
  });
  test("Transform from 4326 to 4978 and change format from cesium cartographic to threeVector3 ", () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    //Already transformed point in destination format to check if the test works.
    const referencePointObject = new Vector3(
      4922501.300000001,
      -653509.0700000002,
      3989400.3899999997
    );
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "cesiumCartographic",
            cesium: cesium
          }
        },
        {
          system: {
            type: "reference",
            definition: "+proj=geocent +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "threeVector3",
            three: THREE
          }
        }
      )(testingPointObject)
    ).toEqual(referencePointObject);
  });
  test("Transform from 4326 to 4978 and change format from cesium cartographic to objectXYZ ", () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    //Already transformed point in destination format to check if the test works.
    const referencePointObject = {
      x: 4922501.300000001,
      y: -653509.0700000002,
      z: 3989400.3899999997
    };
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "cesiumCartographic",
            cesium: cesium
          }
        },
        {
          system: {
            type: "reference",
            definition: "+proj=geocent +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "objectXYZ"
          }
        }
      )(testingPointObject)
    ).toEqual(referencePointObject);
  });
  test("Transform for geocentric to local origin", () => {
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "arrayXYZ"
          }
        },
        {
          format: { type: "arrayXYZ" },
          system: {
            type: "reference",
            altitude: "default",
            definition: "+proj=geocent +datum=WGS84 +no_defs"
          }
        }
      )([0, 0, 0])
    ).toEqual([6378137, 0, 0]);

    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "arrayXYZ"
          }
        },
        {
          format: { type: "arrayXYZ" },
          system: {
            type: "reference",
            altitude: "default",
            definition: "+proj=geocent +datum=WGS84 +no_defs"
          }
        }
      )([-7.56233996602137, 38.96618001296369, 2.9946155063807964])
    ).toBeDeepCloseTo([4922501.3, -653509.07, 3989400.389999], 6);
  });
  test("Transform from 4326 to local and change format from cesium cartographic to arrayXYZ", () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    expect(
      convert(
        {
          system: {
            type: "reference",
            definition: "+proj=longlat +datum=WGS84 +no_defs",
            altitudeReference: "default"
          },
          format: {
            type: "cesiumCartographic",
            cesium: cesium
          }
        },
        {
          system: {
            type: "local",
            origin: {
              value: [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
              formattedSystem: {
                system: {
                  type: "reference",
                  definition: "+proj=longlat +datum=WGS84 +no_defs",
                  altitudeReference: "default"
                },
                format: {
                  type: "arrayXYZ"
                }
              }
            }
          },
          format: {
            type: "arrayXYZ"
          }
        }
      )(testingPointObject)
    ).toEqual([0, 0, 0]);
  });
  test("Transform syncronous from 4326 to local", () => {
    const result = convert(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "default"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(
      result([-7.56233996602137, 38.96618001296369, 2.9946155063807964])
    ).toEqual([0, 0, 0]);
  });
  test("Transform syncronous from local to 4326", () => {
    const result = convert(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "default"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(result([0, 0, 0])).toBeDeepCloseTo(
      [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
      6
    );
  });
  test("Transfor async from 4326 in objectLatLonAlt to TM06 (Portugal)  ", async () => {
    // const testingPointObject = new cesium.Cartographic(
    //   -7.56233996602137,
    //   38.96618001296369,
    //   2.9946155063807964
    // );
    // const testingPointObject = {
    //   lat: 38.96618001296369,
    //   lon: -7.56233996602137,
    //   alt: 2.9946155063807964
    // };
    const testingPointObject = {
      lat: 38.96618001296369,
      lon: -7.56233996602137,
      alt: 2.9946155063807964
    };

    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "objectLatLonAlt"
          // cesium: cesium
        }
      },
      {
        system: {
          type: "reference",
          definition:
            "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toEqual([
      49467.31334521535,
      -77790.87043755408,
      2.9946155045181513
    ]);
  });
  test("Transfor async from 4326 in cesiumCartographic to TM06 (Portugal)  ", async () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );

    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      },
      {
        system: {
          type: "reference",
          definition:
            "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toEqual([
      49467.31334521535,
      -77790.87043755408,
      2.9946155045181513
    ]);
  });
  test("Transform asyncronous from local to 4326", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "default"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
      6
    );
  });
  test("Transform asyncronous from 4326 to local and change format from cesium to arrayXYZ", async () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "cesiumCartographic"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [-7.56233996602137, 38.96618001296369, 2.9946155063807964],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "default"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toEqual([0, 0, 0]);
  });

  test("Transform asyncronous from local (with a X value very far away from origin) to 4326. The result shoul give a very hight Z value", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.56233996602137, 38.96618001296369, 2.9946155063807964], // this coordinates are in Portugal
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "default"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([10000000, 0, 0])).toEqual([
      56.03008264953296,
      19.7279962891025,
      5480654.000839868 // this result makes sence, Basically this coordinates are in Oman but the altitude is very high!
    ]);
  });

  test("Transform asyncronous from local Geocent egm96 to local Geocent default in ObjectXYZ ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "egm96"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "objectXYZ"
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toBeDeepCloseTo(
      { x: 1, y: 2, z: 3 - 228 },
      0.1
    );
  });

  test("Transform asyncronous from local wgs84 egm96 to local wgs84 default in ObjectXYZ ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [1.77, 45.86, 39.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "egm96"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [1.77, 45.86, 39.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "objectXYZ"
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toBeDeepCloseTo(
      { x: 1, y: 2, z: 3 - 512.61224396034123 },
      2
    );
  });

  test.skip("Recursive Local Origin", async () => {
    const result1 = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [0, 0, 0],
            formattedSystem: {
              system: {
                type: "local",
                origin: {
                  value: [0, 0, 0],
                  formattedSystem: {
                    system: {
                      type: "local",
                      origin: {
                        value: [1.77, 45.86, 0],
                        formattedSystem: {
                          system: {
                            type: "reference",
                            definition: "+proj=longlat +datum=WGS84 +no_defs",
                            altitudeReference: "egm96"
                          },
                          format: {
                            type: "arrayXYZ"
                          }
                        }
                      }
                    },
                    format: {
                      type: "arrayXYZ"
                    }
                  }
                }
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "objectLatitudeLongitudeAltitude"
        }
      }
    );
    const result2 = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [1.77, 45.86, 0],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "egm96"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "objectLatitudeLongitudeAltitude"
        }
      }
    );
    expect(await result1([0, 0, 0])).toBeDeepCloseTo(
      await result2([0, 0, 0]),
      2
    );
  });

  test("Transform asyncronous from local Geocent egm96 to local Geocent default in ObjectXYZ ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "egm96"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "objectXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      }
    );
    expect(await result({ x: 1, y: 2, z: 3 - 55 })).toEqual({
      height: -225.2344184910094,
      latitude: 2,
      longitude: 1
    });
  });

  test("Test from local arrayXYZ geocent in objectXYZ to local cesiumCartographic in geocent objectLatitudeLongitudeAltitude ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: { x: 4960950.77, y: -652261.86, z: 3942007.81 }, //[4960950.77, -652261.86, 3942007.81]
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "egm96"
              },
              format: {
                type: "objectXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: {
              latitude: -652261.86,
              longitude: 4960950.77,
              altitude: 3942007.81
            }, //{ lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "objectLatitudeLongitudeAltitude"
              }
            }
          }
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toEqual({
      // { x: 1, y: 2, z: 3 - 55 }
      height: -225.2344184910094,
      latitude: 2,
      longitude: 1
    });
  });

  test("Test from local arrayXYZ geocent in objectLatLonAlt to local cesiumCartographic in geocent objectLatitudeLongitudeAltitude ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: { lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }, //[4960950.77, -652261.86, 3942007.81]
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "egm96"
              },
              format: {
                type: "objectLatLonAlt"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: {
              latitude: -652261.86,
              longitude: 4960950.77,
              altitude: 3942007.81
            }, //{ lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "objectLatitudeLongitudeAltitude"
              }
            }
          }
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toEqual({
      // { x: 1, y: 2, z: 3 - 55 }
      height: -225.2344184910094,
      latitude: 2,
      longitude: 1
    });
  });

  test("Test from local arrayXYZ geocent in Vector3 to local cesiumCartographic in geocent objectLatitudeLongitudeAltitude ", async () => {
    //Already transformed point in destination format to check if the test works.
    const referencePointObject = new Vector3(
      4960950.77,
      -652261.86,
      3942007.81
    );
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: referencePointObject, //{ lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }, //[4960950.77, -652261.86, 3942007.81]
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "egm96"
              },
              format: {
                type: "threeVector3",
                THREE: THREE
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: {
              latitude: -652261.86,
              longitude: 4960950.77,
              altitude: 3942007.81
            }, //{ lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "objectLatitudeLongitudeAltitude"
              }
            }
          }
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toEqual({
      height: 3 - 228.2344184910094,
      latitude: 2,
      longitude: 1
    });
  });

  test("Test from local arrayXYZ geocent in Vector3 to local cesiumCartographic in geocent objectLatitudeLongitudeAltitude ", async () => {
    //Already transformed point in destination format to check if the test works.
    const referencePointObject = new Vector3(
      4960950.77,
      -652261.86,
      3942007.81
    );
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: referencePointObject, //{ lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }, //[4960950.77, -652261.86, 3942007.81]
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "egm96"
              },
              format: {
                type: "threeVector3",
                THREE: THREE
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: {
              latitude: -652261.86,
              longitude: 4960950.77,
              altitude: 3942007.81
            }, //{ lon: 4960950.77, lat: -652261.86, alt: 3942007.81 }
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
                altitudeReference: "cesiumTerrain"
              },
              format: {
                type: "objectLatitudeLongitudeAltitude"
              }
            }
          }
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toEqual({
      height: 3 - 228.2344184910094,
      latitude: 2,
      longitude: 1
    });
  });

  test("Example for discussion ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(
      await result([4.866050519561703, 48.276707704462588, 258.6572265625])
    ).toBeDeepCloseTo(
      [4.866050519561703, 48.276707704462588, 258.6572265625 - 46.99],
      2
    );
  });

  test("Testing altitude by the sea level ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-1.9425367, 46.68808, 0])).toBeDeepCloseTo(
      [-1.9425367, 46.68808, 0.01494517178596766],
      2
    );
  });

  test("Testing async format convert only", async () => {
    const result = await convertAsync(
      {
        format: {
          type: "arrayXYZ"
        }
      },
      {
        format: {
          type: "objectXYZ"
        }
      }
    );
    expect(await result([-1.9425367, 46.68808, 0])).toBeDeepCloseTo(
      { x: -1.9425367, y: 46.68808, z: 0 },
      2
    );
  });

  test("Testing sync format convert only", () => {
    const result = convert(
      {
        format: {
          type: "arrayXYZ"
        }
      },
      {
        format: {
          type: "objectXYZ"
        }
      }
    );
    expect(result([-1.9425367, 46.68808, 0])).toBeDeepCloseTo(
      { x: -1.9425367, y: 46.68808, z: 0 },
      2
    );
  });

  test("Testing sync format same systems", () => {
    const result = convert(
      {
        system: "toto",
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: "toto",
        format: {
          type: "objectXYZ"
        }
      }
    );
    expect(result([-1.9425367, 46.68808, 0])).toBeDeepCloseTo(
      { x: -1.9425367, y: 46.68808, z: 0 },
      2
    );
  });

  test("Use constant aliases", () => {
    expect(
      convert(
        {
          system: systemGeocentric,
          format: formatObjectXYZ
        },
        {
          system: systemWgs84Egm96,
          format: formatArrayLatitudeLongitudeAltitude
        }
      )({ x: 6800000, y: 0, z: 0 })
    ).toEqual([0, 0, 421863]);
  });

  test("Transform from 4326 to 3763 (Portugal TM06) and change format from cesium cartographic to arrayXYZ ", async () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      },
      {
        system: {
          type: "reference",
          definition: "EPSG:3763",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toEqual([
      49467.31334521535,
      -77790.87043755408,
      2.9946155045181513
    ]);
  });
  test("Transform from 4326 to 3763 (Portugal TM06) and change format from cesium cartographic to arrayXYZ and EGM96", async () => {
    const testingPointObject = new cesium.Cartographic(
      -7.56233996602137,
      38.96618001296369,
      2.9946155063807964
    );
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "cesiumCartographic",
          cesium: cesium
        }
      },
      {
        system: {
          type: "reference",
          definition: "EPSG:3763",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toBeDeepCloseTo(
      [49467.31334521535, -77790.87043755408, 2.9946155045181513 - 55],
      0.7
    );
  });

  test("Transform from 4326 to 3763 (Portugal TM06) and change format from xyz string to arrayXYZ and EGM96", async () => {
    const testingPointObject = "-7.56232, 38.96618, 2.9946155045181513 m";
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "string"
        }
      },
      {
        system: {
          type: "reference",
          definition: "EPSG:3763",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toEqual([
      49469.04378009703,
      -77790.86103577942,
      -52.17715634050917
    ]);
  });

  test("Transform from 4326 to 3763 (Portugal TM06) and change format from xyz (longitude latitude altitude) string to arrayXYZ", async () => {
    const testingPointObject =
      "38°57'58\" E, 7°33'44\" S, 2.9946155045181513 m";
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "string"
        }
      },
      {
        system: {
          type: "reference",
          definition: "EPSG:3763",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result(testingPointObject)).toEqual([
      49477.565958628555,
      -77798.4557088422,
      2.994615505449474
    ]);
  });

  test("Two coordinates distant 11.54 meters from each other. Confirming their distance using a local system", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [-1.4581972222222221, 46.426877777777776, 71.33],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=longlat +datum=WGS84 +no_defs",
                altitudeReference: "default"
              },
              format: {
                type: "arrayXYZ"
              }
            }
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(
      await result([-1.458047, 46.426877777777776, 71.33])
    ).toBeDeepCloseTo([11.54, 0, 0], 2);
  });
});
