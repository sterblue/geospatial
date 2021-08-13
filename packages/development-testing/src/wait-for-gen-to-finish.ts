/**
 * @module utils/testing/waitForGenToFinish
 */

export async function waitForGenToFinish(gen, verbosity = 0) {
  let result = await gen.next();
  let previousValue;
  let i = 0;
  while (result.done !== true) {
    previousValue = result;
    result = await gen.next();
    if (verbosity >= 1) console.log(i);
    if (verbosity >= 2) console.log(result);
    i = i + 1;
  }
  return previousValue;
}
