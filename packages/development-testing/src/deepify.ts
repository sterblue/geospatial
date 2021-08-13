import { isObject, isArray, map, mapValues } from "lodash/fp";

export const deepify = func => {
  const deepifyFunc = object => {
    if (isArray(object)) {
      return map(deepifyFunc, object);
    } else if (isObject(object)) {
      return mapValues(deepifyFunc, object);
    } else {
      return func(object);
    }
  };
  return deepifyFunc;
};
