/**
 * @module utils/convert/angles
 */

export type Radians = number;
export type Degrees = number;

import * as math from "mathjs";
import { bearingToAzimuth, bearing } from "@turf/turf";
import { convertLocationDictToPoint } from "@geospatial/data-waypoints";

export function toRadians(x: Degrees): Radians {
  return (x * Math.PI) / 180.0;
}

export function toDegrees(x: Radians): Degrees {
  return (x * 180.0) / Math.PI;
}

/**
 * Wraps the input angle which must be in degrees to the [-180, 180[ degrees interval.
 * @param angle input angle in degrees
 * @return      returns the angle in the [-180, 180[ degrees interval
 */
export function wrapAngle180(angle: number): number {
  const angleResult = angle % 360;
  if (angleResult < -180) {
    return angleResult + 360;
  } else if (angleResult >= 180) {
    return angleResult - 360;
  } else {
    return angleResult;
  }
}

/**
 * Wraps the input angle which must be in degrees to the ]-PI, PI] degrees interval.
 * @param angle input angle in radians
 * @return      returns the angle in the ]-PI, PI] radians interval
 */
export function wrapAnglePi(angle: Radians): number {
  const angleResult = angle % (2 * Math.PI);
  if (angleResult <= -Math.PI) {
    return angleResult + Math.PI * 2;
  } else if (angleResult > Math.PI) {
    return angleResult - Math.PI * 2;
  } else {
    return angleResult;
  }
}

/**
 *
 * @return Returns angle between 0 and 360
 */
export function wrapAngle360(number) {
  const res = number % 360;
  if (res < 0) {
    return res + 360;
  } else return res;
}

/**
 * Computes the angle in degrees between angle1 and angle2 when
 * going from 1 to 2 in a direct rotation.
 * @param angle1
 * @param angle2
 */
export const directAngleTo = (angle1: number, angle2: number) => {
  const a = wrapAngle180(angle1);
  const b = wrapAngle180(angle2);
  return a <= b ? b - a : 360 + b - a;
};

/**
 * Computes the angle in radians between angle1 and angle2 when
 * going from 1 to 2 in a direct rotation.
 * @param angle1
 * @param angle2
 */
export const directAngleToInRadians = (angle1: number, angle2: number) => {
  const a = wrapAnglePi(angle1);
  const b = wrapAnglePi(angle2);
  return a <= b ? b - a : 2 * Math.PI + b - a;
};

export function azimuth(
  coordinatesA: CoordinatesDict,
  coordinatesB: CoordinatesDict
): Degrees {
  return bearingToAzimuth(
    bearing(
      convertLocationDictToPoint(coordinatesA),
      convertLocationDictToPoint(coordinatesB)
    )
  );
}

/**
 * Return angle at B from triangle A, B, C
 * @param  pointA
 * @param  pointB
 * @param  pointC
 *
 */
export function getAngle(
  pointA: CoordinatesDict,
  pointB: CoordinatesDict,
  pointC: CoordinatesDict
): Degrees {
  const azimuthBA = azimuth(pointB, pointA);
  const azimuthBC = azimuth(pointB, pointC);

  const angle = azimuthBC - azimuthBA;

  return angle > 0 ? angle : angle + 360;
}

export function angularDifference(AngleA: Degrees, AngleB: Degrees): Degrees {
  return (((AngleA % 360) - (AngleB % 360) + 180 + 360) % 360) - 180;
}
export function azimuthToBearing(azimuthInput: Degrees) {
  return azimuthInput > 180 ? azimuthInput - 360 : azimuthInput;
}
/**
 * Computes turn direction by selecting the
 * natural (closest in angle's space) direction.
 * @param initialAngle initial angle in radians
 * @param finalAngle final angle in radians
 * @param isNilFinalAngle boolean which is true if final angle is null or undefined
 */
export const computeTurnMode = (
  initialAngle: number,
  finalAngle: number,
  isNilFinalAngle: boolean
): "decreasing" | "increasing" => {
  return isNilFinalAngle ||
    directAngleToInRadians(initialAngle, finalAngle) <
      directAngleToInRadians(finalAngle, initialAngle)
    ? "increasing"
    : "decreasing";
};
