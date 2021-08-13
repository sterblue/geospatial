import { isNil, isNaN, toLower } from "lodash/fp";

export const convertStringToArrayXYZ = (
  dms,
  {
    defaultAltitudeUnits = "m",
    outputAltitudeUnits = "m"
  }: {
    defaultAltitudeUnits: "m" | "ft";
    outputAltitudeUnits: "m" | "ft";
  } = { defaultAltitudeUnits: "m", outputAltitudeUnits: "m" }
) => {
  //   const generalGpsReg = new RegExp(
  //     `^\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(degrees|degree|deg|d|\\°|\\s*)\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(minutes|minute|min|m|\\'|\\′|\\´)\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(seconds|second|sec|s|\\"|\″|\\'\\'|\\′\\′|\\´\\´)\\s*)?)?\\s*(N|W|E|S|North|West|East|South|north|west|east|south|n|w|e|s)?)\\s*.+\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(degrees|degree|deg|d|\\°|\\s*)\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(minutes|minute|min|m|\\'|\\′|\\´)\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(seconds|second|sec|s|\\"|\″|\\'\\'|\\′\\′|\\´\\´)\\s*)?)?\\s*(N|W|E|S|North|West|East|South|north|west|east|south|n|w|e|s)?)\\s*$`,
  //     "g"
  //   );
  // const generalGpsReg = /^
  // \s*
  // (
  //     ((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))
  //     \s*
  //     (degrees|degree|deg|d|\°|\s*)
  //     \s*
  //     (
  //         ((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))
  //         \s*
  //         (minutes|minute|min|m|\'|\′|\´)
  //         \s*
  //         (
  //             ((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))
  //             \s*
  //             (seconds|second|sec|s|\"|\″|\'\'|\′\′|\´\´)
  //             \s*
  //         )?
  //     )?
  //     \s*
  //     (N|W|E|S|North|West|East|South|north|west|east|south|n|w|e|s)?
  // )
  // \s*
  // [^0-9]+
  // \s*
  // (
  //   ((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))
  //   \s*
  //   (degrees|degree|deg|d|\°|\s*)
  //   \s*
  //   (
  //       ((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))
  //       \s*
  //       (minutes|minute|min|m|\'|\′|\´)
  //       \s*
  //       (
  //           ((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))
  //           \s*
  //           (seconds|second|sec|s|\"|\″|\'\'|\′\′|\´\´)
  //           \s*
  //       )?
  //   )?
  //   \s*
  //   (N|W|E|S|North|West|East|South|north|west|east|south|n|w|e|s)?
  // )
  // \s*
  // $/g;

  const generalGpsReg = /^\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(degrees|degree|deg|d|\°|\s*)\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(minutes|minute|min|m|\'|\′|\´)\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(seconds|second|sec|s|\"|\″|\'\'|\′\′|\´\´)\s*)?)?\s*(north|west|east|south|n|w|e|s)?)\s*[^a-zA-Z0-9+-]*\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(degrees|degree|deg|d|\°|\s*)\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(minutes|minute|min|m|\'|\′|\´)\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(seconds|second|sec|s|\"|\″|\'\'|\′\′|\´\´)\s*)?)?\s*(north|west|east|south|n|w|e|s)?)(\s*[^a-zA-Z0-9+-]*\s*((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(m|ms|meter|meters|metre|metres|ft|fts|feet|feets)?)?\s*$/g;

  //   // console.log("dms", dms);
  const generalGpsMatchs = generalGpsReg.exec(toLower(dms));
  //   return generalGpsMatchs;
  //   console.log("==============================");
  //   console.log(toLower(dms));
  //   console.log(generalGpsMatchs);
  if (isNil(generalGpsMatchs)) {
    throw new Error(`${dms} in not in a good GPS format`);
  }

  const degrees1 = parseFloat(generalGpsMatchs[4]);
  const degreeSign1 = generalGpsMatchs[3] === "-" ? -1 : 1;
  const minutes1 = parseFloat(generalGpsMatchs[9]);
  const minuteSign1 = generalGpsMatchs[8] === "-" ? -1 : 1;
  const seconds1 = parseFloat(generalGpsMatchs[14]);
  const secondSign1 = generalGpsMatchs[13] === "-" ? -1 : 1;
  const direction1 = generalGpsMatchs[16];
  const globalSign1 =
    direction1 == "s" ||
    direction1 == "south" ||
    direction1 == "w" ||
    direction1 == "west"
      ? -1
      : 1;
  //   console.log({
  //     degrees1,
  //     degreeSign1,
  //     minutes1,
  //     minuteSign1,
  //     seconds1,
  //     secondSign1,
  //     direction1
  //   });
  const dd1 =
    globalSign1 *
    (degreeSign1 *
      (degrees1 +
        minuteSign1 *
          ((isNaN(minutes1) ? 0 : minutes1) / 60 +
            secondSign1 * ((isNaN(seconds1) ? 0 : seconds1) / (60 * 60)))));
  //   console.log(dd1);

  const degrees2 = parseFloat(generalGpsMatchs[20]);
  const degreeSign2 = generalGpsMatchs[19] === "-" ? -1 : 1;
  const minutes2 = parseFloat(generalGpsMatchs[25]);
  const minuteSign2 = generalGpsMatchs[24] === "-" ? -1 : 1;
  const seconds2 = parseFloat(generalGpsMatchs[30]);
  const secondSign2 = generalGpsMatchs[29] === "-" ? -1 : 1;
  const direction2 = generalGpsMatchs[32];
  const globalSign2 =
    direction2 == "s" ||
    direction2 == "south" ||
    direction2 == "w" ||
    direction2 == "west"
      ? -1
      : 1;
  //   console.log({
  //     degrees2,
  //     degreeSign2,
  //     minutes2,
  //     minuteSign2,
  //     seconds2,
  //     secondSign2,
  //     direction2
  //   });
  const dd2 =
    globalSign2 *
    (degreeSign2 *
      (degrees2 +
        minuteSign2 *
          ((isNaN(minutes2) ? 0 : minutes2) / 60 +
            secondSign2 * ((isNaN(seconds2) ? 0 : seconds2) / (60 * 60)))));
  //   console.log(dd2);

  //   if (
  //     direction1 == "s" ||
  //     direction1 == "south" ||
  //     direction1 == "w" ||
  //     direction1 == "west"
  //   ) {
  //     dd1 = dd1 * -1;
  //   }

  const altValue3 = parseFloat(generalGpsMatchs[36]);
  const altSign3 = generalGpsMatchs[35] === "-" ? -1 : 1;
  const altUnit3 = generalGpsMatchs[37];

  const isLatLon =
    direction1 === "north" ||
    direction1 === "south" ||
    direction1 === "n" ||
    direction1 === "s" ||
    direction2 === "west" ||
    direction2 === "east" ||
    direction2 === "w" ||
    direction2 === "e";
  const isLonLat =
    direction2 === "north" ||
    direction2 === "south" ||
    direction2 === "n" ||
    direction2 === "s" ||
    direction1 === "west" ||
    direction1 === "east" ||
    direction1 === "w" ||
    direction1 === "e";
  const isFeet =
    altUnit3 === "ft" ||
    altUnit3 === "feet" ||
    altUnit3 === "feets" ||
    altUnit3 === "fts" ||
    ((altUnit3 === undefined || altUnit3 === null) &&
      defaultAltitudeUnits === "ft");
  const isMeters =
    altUnit3 === "m" ||
    altUnit3 === "meter" ||
    altUnit3 === "meters" ||
    altUnit3 === "metre" ||
    altUnit3 === "metres" ||
    altUnit3 === "ms" ||
    ((altUnit3 === undefined || altUnit3 === null) &&
      defaultAltitudeUnits === "m");

  let altitudeConversionConstant = null;

  if (isMeters) {
    if (isFeet) {
      throw new Error(
        `${dms} in not in a good GPS format, altitude is in ft or meters?`
      );
    } else {
      //   console.log("IS M");
      if (outputAltitudeUnits === "m") {
        altitudeConversionConstant = 1.0;
      } else if (outputAltitudeUnits === "ft") {
        altitudeConversionConstant = 3.2808399;
      } else {
        throw new Error(
          `${outputAltitudeUnits} in not in a good altitude unit`
        );
      }
    }
  } else {
    if (isFeet) {
      //   console.log("IS FT");
      if (outputAltitudeUnits === "m") {
        altitudeConversionConstant = 1.0 / 3.2808399;
      } else if (outputAltitudeUnits === "ft") {
        altitudeConversionConstant = 1.0;
      } else {
        throw new Error(
          `${outputAltitudeUnits} in not in a good altitude unit`
        );
      }
    } else {
      // By default, it's meters
      //   console.log("DEFAULT TO M");
      if (outputAltitudeUnits === "m") {
        altitudeConversionConstant = 1.0;
      } else if (outputAltitudeUnits === "ft") {
        altitudeConversionConstant = 3.2808399;
      } else {
        throw new Error(
          `${outputAltitudeUnits} in not in a good altitude unit`
        );
      }
    }
  }

  const alt3 = altSign3 * altValue3 * altitudeConversionConstant;

  if (isLatLon) {
    if (isLonLat) {
      throw new Error(
        `${dms} in not in a good GPS format, it is both in LonLat and LatLon ordering?`
      );
    } else {
      return [dd1, dd2, alt3];
    }
  } else {
    if (isLonLat) {
      return [dd2, dd1, alt3];
    } else {
      return [dd1, dd2, alt3];
    }
  }
};

export const convertStringToNumber = dms => {
  //   const generalGpsReg = new RegExp(
  //     `^((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(degrees|degree|deg|d|\\°|\\s*)\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(minutes|minute|min|m|\\'|\\′|\\´)\\s*(((\\+|\\-)?\\s*([0-9]*\.[0-9]*|[0-9]+))\\s*(seconds|second|sec|s|\\"|\″|\\'\\'|\\′\\′|\\´\\´)\\s*)?)?\\s*(N|W|E|S|North|West|East|South|north|west|east|south|n|w|e|s)?$`,
  //     "g"
  //   );

  const generalGpsReg = /^((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(degrees|degree|deg|d|\°|\s*)\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(minutes|minute|min|m|\'|\′|\´)\s*(((\+|\-)?\s*([0-9]*\.[0-9]*|[0-9]+))\s*(seconds|second|sec|s|\"|\″|\'\'|\′\′|\´\´)\s*)?)?\s*(N|W|E|S|North|West|East|South|north|west|east|south|n|w|e|s)?$/g;
  // console.log("dms", dms);
  const generalGpsMatchs = generalGpsReg.exec(dms);

  if (isNil(generalGpsMatchs)) {
    throw new Error(`${dms} in not in a good GPS format`);
  }
  const degrees = parseFloat(generalGpsMatchs[1]);
  const degreeSign = generalGpsMatchs[2] == "-" ? -1 : 1;
  const minutes = parseFloat(generalGpsMatchs[6]);
  const minuteSign = generalGpsMatchs[7] == "-" ? -1 : 1;
  const seconds = parseFloat(generalGpsMatchs[11]);
  const secondSign = generalGpsMatchs[12] == "-" ? -1 : 1;
  const direction = generalGpsMatchs[15];
  // console.log({
  //   degrees,
  //   degreeSign,
  //   minutes,
  //   minuteSign,
  //   seconds,
  //   secondSign,
  //   direction
  // });

  let dd =
    degrees +
    degreeSign *
      ((isNaN(minutes) ? 0 : minutes) / 60 +
        minuteSign * ((isNaN(seconds) ? 0 : seconds) / (60 * 60)));

  if (
    direction == "S" ||
    direction == "South" ||
    direction == "s" ||
    direction == "south" ||
    direction == "w" ||
    direction == "west" ||
    direction == "West" ||
    direction == "W"
  ) {
    dd = dd * -1;
  }
  return dd;
};
