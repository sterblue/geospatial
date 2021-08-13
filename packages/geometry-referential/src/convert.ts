import { FormattedSystem, Value, ReferencedValue } from "../types";
import { transformCoordinates, transformCoordinatesAsync } from "./coordinates";
import { convertFormat } from "./formats";
import { transformAltitude } from "./altitude";
import { isEqual } from "lodash/fp";

const identity = p => p;

export const convert = (from: FormattedSystem, to: FormattedSystem) => {
  const convertFormatIn = convertFormat(from.format, { type: "arrayXYZ" });

  let doTransformCoordinates = null;
  if (
    from.system === undefined ||
    from.system === null ||
    to.system === undefined ||
    to.system === null ||
    isEqual(from.system, to.system)
  ) {
    doTransformCoordinates = identity;
  } else {
    doTransformCoordinates = transformCoordinates(from.system, to.system);
  }

  const convertFormatOut = convertFormat({ type: "arrayXYZ" }, to.format);
  return p => convertFormatOut(doTransformCoordinates(convertFormatIn(p)));
};

export const convertAsync = async (
  from: FormattedSystem,
  to: FormattedSystem
) => {
  const convertFormatIn = convertFormat(from.format, { type: "arrayXYZ" });

  let doTransformAltitudes = {
    before: null,
    after: null
  };
  let doTransformCoordinates = null;
  if (
    from.system === undefined ||
    from.system === null ||
    to.system === undefined ||
    to.system === null ||
    isEqual(from.system, to.system)
  ) {
    doTransformAltitudes = {
      before: identity,
      after: identity
    };
    doTransformCoordinates = identity;
  } else {
    doTransformAltitudes = await transformAltitude(from, to);
    doTransformCoordinates = await transformCoordinatesAsync(
      from.system,
      to.system
    );
  }

  const {
    before: transformAltitudeBefore,
    after: transformAltitudeAfter
  } = doTransformAltitudes;

  // const {
  //   before: transformAltitudeBefore,
  //   after: transformAltitudeAfter
  // } = await transformAltitude(from, to);
  // const doTransformCoordinates = await transformCoordinatesAsync(
  //   from.system,
  //   to.system
  // );
  const convertFormatOut = convertFormat({ type: "arrayXYZ" }, to.format);
  return async p =>
    convertFormatOut(
      await transformAltitudeAfter(
        await doTransformCoordinates(
          await transformAltitudeBefore(convertFormatIn(p))
        )
      )
    );
};
