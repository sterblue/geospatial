import { deepRound } from "@geospatial/utils-testing";
import { map } from "lodash/fp";
import {
  wrapAngle180,
  wrapAngle360,
  azimuth,
  getAngle,
  azimuthToBearing,
  angularDifference,
  directAngleTo,
  wrapAnglePi,
  toRadians,
  toDegrees,
  computeTurnMode
} from "../index";

const pointA = {
  latitude: 47.28361425074188,
  longitude: -1.520809829235077,
  altitude: 10
};

const pointB = {
  latitude: 47.28404001896385,
  longitude: -1.520809829235077,
  altitude: 10
};

const pointC = {
  latitude: 47.28428019439786,
  longitude: -1.5214374661445618,
  altitude: 10
};

const pointD = {
  latitude: 47.284329321056845,
  longitude: -1.5200239419937134,
  altitude: 10
};

const pointE = {
  latitude: 47.28367611471339,
  longitude: -1.5205040574073792,
  altitude: 10
};
test("toRadians", () => {
  expect(toRadians(180)).toEqual(Math.PI);
});

test("toDegrees", () => {
  expect(toDegrees(Math.PI)).toEqual(180);
});
test("wrapAngle180", () => {
  expect(wrapAngle180(181)).toEqual(-179);
  expect(wrapAngle180(-181)).toEqual(179);
});

test("wrapAngle360", () => {
  expect(wrapAngle360(-1)).toEqual(359);
  expect(wrapAngle360(361)).toEqual(1);
  expect(wrapAngle360(360)).toEqual(0);
  expect(wrapAngle360(0)).toEqual(0);
});

test("wrapAnglePi", () => {
  expect(wrapAnglePi(Math.PI / 2)).toEqual(Math.PI / 2);
  expect(wrapAnglePi(-Math.PI)).toEqual(Math.PI);
  expect(wrapAnglePi((3 * Math.PI) / 2)).toEqual(-Math.PI / 2);
});

test("azimuth", () => {
  expect(deepRound(azimuth(pointA, pointB))).toEqual(0);
  expect(deepRound(azimuth(pointA, pointC))).toEqual(327.4076491);
  expect(deepRound(azimuth(pointA, pointD))).toEqual(36.7059739);
  expect(deepRound(azimuth(pointA, pointE))).toEqual(73.3929071);
  expect(deepRound(azimuth(pointB, pointC))).toEqual(299.427687);
  expect(deepRound(azimuth(pointB, pointD))).toEqual(61.5127042);
  expect(deepRound(azimuth(pointB, pointE))).toEqual(150.3167475);
  expect(deepRound(azimuth(pointC, pointD))).toEqual(87.0665877);
  expect(deepRound(azimuth(pointC, pointE))).toEqual(133.6517698);
  expect(deepRound(azimuth(pointD, pointE))).toEqual(206.5013527);
});

test("getAngle", () => {
  expect(deepRound(getAngle(pointA, pointB, pointC))).toEqual(119.427687);
  expect(deepRound(getAngle(pointA, pointB, pointD))).toEqual(241.5127042);
});

test("angularDifference", () => {
  const data = [
    [[0, 0], 0],
    [[0, 90], -90],
    [[90, 0], 90],
    [[1, 359], 2],
    [[359, 1], -2],
    [[270, 0], -90],
    [[0, 270], 90]
  ];

  map(dataEntry => {
    expect(angularDifference(dataEntry[0][0], dataEntry[0][1])).toEqual(
      dataEntry[1]
    );
  }, data);
});
test("azimuthToBearing", () => {
  expect(azimuthToBearing(180)).toEqual(180);
  expect(azimuthToBearing(181)).toEqual(-179);
  expect(azimuthToBearing(270)).toEqual(-90);
  expect(azimuthToBearing(360)).toEqual(0);
});
test("directAngleTo", () => {
  expect(directAngleTo(0, 90)).toEqual(90);
  expect(directAngleTo(90, 0)).toEqual(270);
});
test("Compute turn mode", () => {
  expect(computeTurnMode(0, Math.PI / 2, false)).toEqual("increasing");
  expect(computeTurnMode(0, -Math.PI / 2, false)).toEqual("decreasing");
  expect(computeTurnMode(Math.PI, Math.PI / 2, false)).toEqual("decreasing");
});
