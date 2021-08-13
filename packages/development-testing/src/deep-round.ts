/**
 * @module utils/testing/deepRound
 */

import { isNumber } from "lodash/fp";
import { round } from "mathjs";
import { deepify } from "./deepify";

const deepRoundCurry = precision => {
  const deepRoundCurryPrecision = deepify(obj => {
    if (isNumber(obj)) {
      return round(obj, precision);
    } else {
      return obj;
    }
  });
  return deepRoundCurryPrecision;
};

export function deepRound(obj, precision = 7) {
  return deepRoundCurry(precision)(obj);
}
