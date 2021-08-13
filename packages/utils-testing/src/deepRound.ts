/**
 * @module utils/testing/deepRound
 */

import { isObject, isArray, isNumber, map, mapValues } from "lodash/fp";
import { round } from "mathjs";

const deepRoundCurry = precision => {
  const deepRoundCurryPrecision = obj => {
    if (isArray(obj)) {
      return map(deepRoundCurryPrecision, obj);
    } else if (isObject(obj)) {
      return mapValues(deepRoundCurryPrecision, obj);
    } else if (isNumber(obj)) {
      return round(obj, precision);
    } else {
      return obj;
    }
  };
  return deepRoundCurryPrecision;
};

export function deepRound(obj, precision = 7) {
  return deepRoundCurry(precision)(obj);
}
