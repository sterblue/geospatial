/**
 * @module utils/testing/toBeDeepCloseTo
 */

import {
  isArray,
  isPlainObject,
  isNumber,
  isUndefined,
  isEqual,
  isString,
  isNaN,
  isNil,
  sortBy,
  identity,
  keys,
  join,
  map
} from "lodash/fp";

/**
 *
 * @param {number|Array} received
 * @param {number|Array} expected
 * @param {number} decimals
 * @returns {{message: (function(): string), pass: boolean}}
 */
export function toBeDeepCloseTo(received, expected, decimals) {
  const error = recursiveCheck(received, expected, [], decimals);
  /* istanbul ignore next */
  if (error) {
    return {
      message: () =>
        this.utils.matcherHint(".toBeDeepCloseTo") +
        "\n\n" +
        `${error.reason}:\n` +
        `  ${this.utils.printExpected(error.expected)}\n` +
        "Received:\n" +
        `  ${this.utils.printReceived(error.received)}`,
      pass: false
    };
  } else {
    return {
      message: () =>
        this.utils.matcherHint(".not.toBeDeepCloseTo") +
        "\n\n" +
        "The two objects are deeply equal:\n" +
        `  ${this.utils.printExpected(expected)}\n` +
        "Received:\n" +
        `  ${this.utils.printReceived(received)}`,
      pass: true
    };
  }
}

/**
 * @param {number|Array} actual
 * @param {number|Array} expected
 * @param {number} decimals
 * @return {boolean|{reason, expected, received}}
 */
function recursiveCheck(
  actual: mixed,
  expected: mixed,
  path: string[],
  decimals = 9
): boolean | { reason: string; expected: string; received: string } {
  if (isNumber(actual) && isNumber(expected)) {
    if (Math.abs(actual - expected) <= Math.pow(10, -decimals)) {
      return false;
    } else {
      return {
        reason: `Expected received${join(
          "",
          map(x => (!isNaN(x) ? `[${x}]` : `.${x}`), path)
        )} to equal (up to ${decimals} decimals)`,
        expected: expected,
        received: actual
      };
    }
  } else if (isArray(actual) && isArray(expected)) {
    if (actual.length !== expected.length) {
      return {
        reason: `The arrays lengths do not match at received${join(
          "",
          map(x => (!isNaN(x) ? `[${x}]` : `.${x}`), path)
        )}`,
        expected: expected,
        received: actual
      };
    }

    for (let i = 0; i < actual.length; i++) {
      var error = recursiveCheck(
        actual[i],
        expected[i],
        [...path, i.toString()],
        decimals
      );
      if (error) return error;
    }
    return false;
  } else if (isPlainObject(actual) && isPlainObject(expected)) {
    const actualKeys = sortBy(identity, keys(actual));
    const expectedKeys = sortBy(identity, keys(expected));
    if (!isEqual(actualKeys, expectedKeys)) {
      return {
        reason: `The object at received${join(
          "",
          map(x => (!isNaN(x) ? `[${x}]` : `.${x}`), path)
        )} dos not have correct keys`,
        expected: expected,
        received: actual
      };
    }

    for (const i of actualKeys) {
      var error = recursiveCheck(
        actual[i],
        expected[i],
        [...path, i.toString()],
        decimals
      );
      if (error) return error;
    }
    return false;
  } else if (
    (isUndefined(actual) && isUndefined(expected)) ||
    (isNil(actual) && isNil(expected))
  ) {
    return false;
  } else if (isString(actual) && isString(expected)) {
    return actual !== expected;
  } else {
    // error for all other types
    return {
      reason: `The data type at received${join(
        "",
        map(x => (!isNaN(x) ? `[${x}]` : `.${x}`), path)
      )} is not supported or does not match expected value`,
      expected: expected,
      received: actual
    };
  }
}
