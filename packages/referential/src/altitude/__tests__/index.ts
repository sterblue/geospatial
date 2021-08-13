import { convert, convertAsync } from "../..";
import { getReferenceEllipsoidAltitude } from "..";
import { toBeDeepCloseTo } from "@geospatial/development-testing";
expect.extend({ toBeDeepCloseTo });

jest.setTimeout(30000);

describe("Altitude tests", () => {
  test("Transform from 3763 to 4326 and change altitude from default to egm96", async () => {
    const result = await convertAsync(
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
    expect(await result([56142.232, -138468.337, 0])).toEqual([
      -7.490237727793534,
      38.419216239295935,
      -55.198834677223665
    ]);
  });

  test("Transform altitude from default to cesium terrain", async () => {
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
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, 0])).toEqual([
      -7.49024,
      38.41922,
      -228.4332850880927
    ]);
  });

  test("Transform altitude from egm96 to default", async () => {
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
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, -55])).toBeDeepCloseTo(
      [-7.49024, 38.41922, 0],
      0.7
    );
  });
  test("Transform altitude from egm96 to cesium terrain", async () => {
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
    expect(await result([-7.49024, 38.41922, -55])).toBeDeepCloseTo(
      [-7.49024, 38.41922, -228.4332850880927],
      0.7
    );
  });
  test("Transform altitude from cesium terrain to egm96", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "cesiumTerrain"
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
      await result([-7.49024, 38.41922, -228.4332850880927])
    ).toBeDeepCloseTo([-7.49024, 38.41922, -55], 0.7);
  });
  test("Transform altitude from egm96 to wgs84 and at the same time transform coordinates to European Datum 1950", async () => {
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
          definition:
            "+proj=tmerc +towgs84=-84.0000,-97.0000,-117.0000 +a=6378388.0000 +rf=297.0000000000000 +lat_0=0.000000000 +lon_0=-3.000000000 +k_0=0.99960000 +x_0=500000.000 +y_0=0.000 +units=m +no_defs",
          altitudeReference: "wgs84"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, -55])).toBeDeepCloseTo(
      [108027.984, 4262090.08, 0],
      0.1 //In this particular case we might have a bigger error due to the use of only 3 Bursa Wolf parameters
    );
  });

  test("Transform altitude from default to default", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([4960950.77, -652261.86, 3942007.81])).toBeDeepCloseTo(
      [-7.49024, 38.41922, 0],
      0.1
    );
  });
  test("Transform altitude from default geocentric to cesium terrain latlong", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([4960950.77, -652261.86, 3942007.81])).toBeDeepCloseTo(
      [-7.49024, 38.41922, -228],
      0.1
    );
  });
  test("Transform altitude from default geocentric to egm96 latlong", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
    expect(await result([4960950.77, -652261.86, 3942007.81])).toBeDeepCloseTo(
      [-7.49024, 38.41922, -55],
      0.1
    );
  });
  test("Transform altitude from default latlong to geocentric default", async () => {
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
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });
  test("Transform altitude from egm96 latlong to geocentric default", async () => {
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
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, -55])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });
  test("Transform altitude from cesiumTerrain latlong to geocentric default", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=longlat +datum=WGS84 +no_defs",
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, -228])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });
  test("Transform altitude from default latlong to geocentric default", async () => {
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
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });
  // does this test make sense???? Do i need this?
  test("Transform altitude from default latlong to geocentric egm96", async () => {
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
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81 - 55],
      0.1
    );
  });
  // does this test make sense???? Do i need this?
  test("Transform altitude from default latlong to geocentric cesiumTerrain", async () => {
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
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81 - 228],
      0.1
    );
  });
  // does this test make sense???? Do we need this?
  test("Transform altitude from geocent egm96 to default", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(
      await result([4960950.77, -652261.86, 3942007.81 - 55])
    ).toBeDeepCloseTo([-7.49024, 38.41922, 0], 0.1);
  });
  // does this test make sense???? Do we need this?
  test("Transform altitude from geocent terrain to default", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "cesiumTerrain"
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
    expect(
      await result([4960950.77, -652261.86, 3942007.81 - 228])
    ).toBeDeepCloseTo([-7.49024, 38.41922, 0], 0.1);
  });
  /////////////////////////////////// Local transformation Tests ///////////////////////////////////////
  test("Transform altitude from wgs84 default to local", async () => {
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
            value: [-7.49024, 38.41922, 0],
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
    expect(await result([-7.49024, 38.41922, 0])).toEqual([0, 0, 0]);
  });

  test("Transform altitude from wgs84 default to local egm96", async () => {
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
            value: [-7.49024, 38.41922, -55],
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
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [0, 0, 0],
      0.1
    );
  });

  test("Transform altitude from wgs84 default to local cesiumTerrain", async () => {
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
            value: [-7.49024, 38.41922, -228],
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
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [0, 0, 0],
      0.1
    );
  });

  test("Transform altitude from wgs84 egm96 to local default", async () => {
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
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [0, 0, 55],
      0.1
    );
  });

  test("Transform altitude from wgs84 egm96 to local egm96", async () => {
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
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
    );
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [0, 0, 0],
      0.1
    );
  });

  test("Transform altitude from wgs84 egm96 to local cesiumTerrain", async () => {
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
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([-7.49024, 38.41922, -55])).toBeDeepCloseTo(
      [0, 0, -228],
      0.1
    );
  });
  test("Transform altitude from wgs84 default to local geocent default", async () => {
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
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
    expect(await result([-7.49024, 38.41922, 0])).toBeDeepCloseTo(
      [0, 0, 0],
      0.1
    );
  });

  test("Transform altitude from wgs84 geocent default to local", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
    expect(await result([4960950.77, -652261.86, 3942007.81])).toBeDeepCloseTo(
      [0, 0, 0],
      0.1
    );
  });

  test("Transform altitude from wgs84 geocent default to local", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
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
            value: [-7.49024, 38.41922, 0],
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
    expect(await result([4960950.77, -652261.86, 3942007.81])).toBeDeepCloseTo(
      [0, 0, 0],
      0.1
    );
  });

  test("Transform altitude from wgs84 geocent egm96 to local", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
      await result([4960950.77, -652261.86, 3942007.81 - 55])
    ).toBeDeepCloseTo([0, 0, 0], 0.1);
  });

  test("Transform altitude from wgs84 geocent cesiumTerrain to local", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "reference",
          definition: "+proj=geocent +datum=WGS84 +units=m +no_defs",
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      },
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
      await result([4960950.77, -652261.86, 3942007.81 - 228])
    ).toBeDeepCloseTo([0, 0, 0], 0.1);
  });
  // test.only("Transform altitude from wgs84 default to local", async () => {
  //   const result = await convertAsync(
  //     {
  //       system: {
  //         type: "reference",
  //         definition: "+proj=longlat +datum=WGS84 +no_defs",
  //         altitudeReference: "default"
  //       },
  //       format: {
  //         type: "arrayXYZ"
  //       }
  //     },
  //     {
  //       system: {
  //         type: "local",
  //         origin: {
  //           value: [38.41922, -7.49024, 0],
  //           system: {
  //             system: {
  //               type: "reference",
  //               definition: "+proj=longlat +datum=WGS84 +no_defs",
  //               altitudeReference: "egm96"
  //             },
  //             format: {
  //               type: "arrayXYZ"
  //             }
  //           }
  //         }
  //       },
  //       format: {
  //         type: "arrayXYZ"
  //       }
  //     }
  //   );
  //   expect(await result([-7.49024, 38.41922, 0])).toEqual([0, 0, 0]);
  // });
  test("Transform local to wgs84 default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 100],
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
      [-7.49024, 38.41922, 100],
      0.1
    );
  });
  test("Transform local to wgs84 egm96 ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [-7.49024, 38.41922, -55],
      0.1
    );
  });
  test("Transform local to wgs84 cesiumTerrain ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [-7.49024, 38.41922, -228],
      0.1
    );
  });
  test("Transform local to geocent default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });

  test("Transform local to geocent egm96 ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
          altitudeReference: "egm96"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81 - 55],
      0.1
    );
  });
  test("Transform local to geocent cesiumTerrain ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
          altitudeReference: "cesiumTerrain"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81 - 228],
      0.1
    );
  });
  test("Transform local in egm96 to wgs84 default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, -55],
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
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [-7.49024, 38.41922, 0],
      0.1
    );
  });

  test("Transform local in egm96 to geocent default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, -55],
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
          definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });

  test("Transform local in geocent default to geocent default ", async () => {
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
          definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
          altitudeReference: "default"
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([0, 0, 0])).toBeDeepCloseTo(
      [4960950.77, -652261.86, 3942007.81],
      0.1
    );
  });

  test("Transform from local wgs84 default to local TM06 default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          type: "local",
          origin: {
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
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
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });

  test("Transform from local wgs84 egm96 to local TM06 default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
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
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });

  test("Transform from local wgs84 default to local TM06 cesiumTerrain ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
          type: "local",
          origin: {
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
              system: {
                type: "reference",
                definition:
                  "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
                altitudeReference: "cesiumTerrain"
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
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3 - 228], 0.1);
  });

  test("Transform from local wgs84 egm96 to local TM06 cesiumTerrain ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [-7.49024, 38.41922, 0],
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
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
              system: {
                type: "reference",
                definition:
                  "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
                altitudeReference: "cesiumTerrain"
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
    expect(await result([1, 2, 3 - 55])).toBeDeepCloseTo([1, 2, 3 - 228], 0.1);
  });

  test("Transform from local geocent default to local TM06 default ", async () => {
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
          type: "local",
          origin: {
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
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
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });
  test("Transform from local geocent egm96 to local TM06 default ", async () => {
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
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
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
          }
        },
        format: {
          type: "arrayXYZ"
        }
      }
    );
    expect(await result([1, 2, 3 - 55])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });
  test("Transform from local geocent egm96 to local TM06 egm96 ", async () => {
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
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
              system: {
                type: "reference",
                definition:
                  "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
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
    );
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });
  test("Transform from local geocent default to local TM06 egm96 ", async () => {
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
          type: "local",
          origin: {
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
              system: {
                type: "reference",
                definition:
                  "+proj=tmerc +lat_0=39.66825833333333 +lon_0=-8.133108333333334 +k=1 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
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
    );
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3 - 55], 0.1);
  });
  test("Transform from local TM06 default to local Geocent default ", async () => {
    const result = await convertAsync(
      {
        system: {
          type: "local",
          origin: {
            value: [56142.232, -138468.337, 0],
            formattedSystem: {
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
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });
  test("Transform from local Geocent default to local Geocent default ", async () => {
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
          type: "local",
          origin: {
            value: [4960950.77, -652261.86, 3942007.81],
            formattedSystem: {
              system: {
                type: "reference",
                definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
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
    expect(await result([1, 2, 3])).toBeDeepCloseTo([1, 2, 3], 0.1);
  });
  // test("Transform from local Geocent egm96 to local Geocent default ", async () => {
  //   const result = await convertAsync(
  //     {
  //       system: {
  //         type: "local",
  //         origin: {
  //           value: [4960950.77, -652261.86, 3942007.81],
  //           formattedSystem: {
  //             system: {
  //               type: "reference",
  //               definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
  //               altitudeReference: "egm96"
  //             },
  //             format: {
  //               type: "arrayXYZ"
  //             }
  //           }
  //         }
  //       },
  //       format: {
  //         type: "arrayXYZ"
  //       }
  //     },
  //     {
  //       system: {
  //         type: "local",
  //         origin: {
  //           value: [4960950.77, -652261.86, 3942007.81],
  //           formattedSystem: {
  //             system: {
  //               type: "reference",
  //               definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
  //               altitudeReference: "cesiumTerrain"
  //             },
  //             format: {
  //               type: "arrayXYZ"
  //             }
  //           }
  //         }
  //       },
  //       format: {
  //         type: "arrayXYZ"
  //       }
  //     }
  //   );
  //   expect(await result([1, 2, 3 - 55])).toBeDeepCloseTo([1, 2, 3 - 228], 0.1);
  // });
});
