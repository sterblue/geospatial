import { getDistanceMetres3D, getDistanceMetresLTP3D } from "../distance";

describe("Distance", () => {
  test("3D distance ", () => {
    const pointA = { latitude: 45, longitude: 10, altitude: 10 };
    const pointB = { latitude: 45.1, longitude: 10.1, altitude: 1000 };
    const pointC = { latitude: 45.1, longitude: 10.1, altitude: 10 };
    expect(getDistanceMetres3D(pointA, pointB)).toEqual(13665.735392773517);
    expect(getDistanceMetres3D(pointC, pointB)).toEqual(990);
    expect(getDistanceMetres3D(pointB, pointC)).toEqual(990);
  });

  test("3D distance alti negative", () => {
    const pointA = { latitude: 45, longitude: 10, altitude: 10 };
    const pointB = { latitude: 45.1, longitude: 10.1, altitude: -1000 };
    const pointC = { latitude: 45.1, longitude: 10.1, altitude: 10 };
    expect(getDistanceMetres3D(pointA, pointB)).toEqual(13667.198828776243);
    expect(getDistanceMetres3D(pointC, pointB)).toEqual(1010);
    expect(getDistanceMetres3D(pointB, pointC)).toEqual(1010);
  });

  test("3D distance alti negative", () => {
    const pointA = { latitude: -1, longitude: -1, altitude: -1 };
    const pointB = { latitude: -1, longitude: -1, altitude: 1 };
    const pointC = { latitude: -1, longitude: 1, altitude: -1 };
    const pointD = { latitude: -1, longitude: 1, altitude: 1 };
    const pointE = { latitude: 1, longitude: -1, altitude: -1 };
    const pointF = { latitude: 1, longitude: -1, altitude: 1 };
    const pointG = { latitude: 1, longitude: 1, altitude: -1 };
    const pointH = { latitude: 1, longitude: 1, altitude: 1 };

    expect(getDistanceMetres3D(pointA, pointB)).toEqual(
      getDistanceMetres3D(pointB, pointA)
    );
    expect(getDistanceMetres3D(pointA, pointC)).toEqual(
      getDistanceMetres3D(pointC, pointA)
    );

    expect(getDistanceMetres3D(pointA, pointD)).toEqual(
      getDistanceMetres3D(pointD, pointA)
    );
    expect(getDistanceMetres3D(pointA, pointF)).toEqual(
      getDistanceMetres3D(pointF, pointA)
    );
    expect(getDistanceMetres3D(pointA, pointB)).toEqual(
      getDistanceMetres3D(pointC, pointD)
    );

    expect(getDistanceMetres3D(pointA, pointE)).toEqual(
      getDistanceMetres3D(pointB, pointF)
    );

    expect(getDistanceMetres3D(pointA, pointC)).toEqual(
      getDistanceMetres3D(pointE, pointG)
    );
  });

  test("LTP 3D distance ", () => {
    const pointA = [0, 0, 0];
    const pointB = [1, 1, 0];
    const pointC = [1, 1, 1];
    expect(getDistanceMetresLTP3D(pointA, pointB)).toBeCloseTo(
      1.4142135623730951,
      0.001
    );
    expect(getDistanceMetresLTP3D(pointC, pointA)).toBeCloseTo(
      1.7320508075688772,
      0.001
    );
  });
});
