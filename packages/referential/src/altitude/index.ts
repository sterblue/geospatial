import {
  System,
  Value,
  ReferencedValue,
  FormattedSystem,
  SystemReference,
  SystemLocal
} from "../types";
import { convert } from "..";
import { getProj4WithDefs } from "../coordinates";
import { includes, toLower, getOr } from "lodash/fp";

export const transformAltitude = async (
  from: FormattedSystem,
  to: FormattedSystem
) => {
  const fromLocal = from.system.type === "local";
  const toLocal = to.system.type === "local";
  // Since we are using the async altitude transform, make sure we load all EPSG codes. This must be done now in order to make sure we have the codes later on the sync convert() function.
  await getProj4WithDefs();
  if (fromLocal) {
    if (toLocal) {
      //  From system local to system local
      const fromLocalAltitude = ((from.system as SystemLocal).origin
        .formattedSystem.system as SystemReference).altitudeReference;

      const toLocalAltitude = ((to.system as SystemLocal).origin.formattedSystem
        .system as SystemReference).altitudeReference;

      if (fromLocalAltitude !== toLocalAltitude) {
        const fromLocalAltitudeNotDefault = !includes(
          "default",
          fromLocalAltitude
        );
        const toLocalAltitudeNotDefault = !includes("default", toLocalAltitude);
        let correctionBefore = nothing;
        let correctionAfter = nothing;
        if (fromLocalAltitudeNotDefault) {
          correctionBefore = await addLocalAltitudeCorrection(from)(
            (from.system as SystemLocal).origin.formattedSystem
          );
          correctionBefore = await correctionBefore(
            (from.system as SystemLocal).origin.value
          );
        }
        if (toLocalAltitudeNotDefault) {
          correctionAfter = await subtractLocalAltitudeCorrection(to)(
            (to.system as SystemLocal).origin.formattedSystem
          );
          correctionAfter = await correctionAfter(
            (to.system as SystemLocal).origin.value
          );
        }
        return { before: correctionBefore, after: correctionAfter };
      }
      return { before: nothing, after: nothing };
    } else {
      //  From system local to system reference
      const toGeocent = includes(
        "+proj=geocent",
        toLower((to.system as SystemReference).definition)
      );
      const fromLocalAltitudeNotDefault = !includes(
        "default",
        ((from.system as SystemLocal).origin.formattedSystem
          .system as SystemReference).altitudeReference
      );
      const toAltitudeNotDefault = !includes(
        "default",
        (to.system as SystemReference).altitudeReference
      );
      if (toGeocent) {
        // From local to definition geocent
        let correctionBefore = nothing;
        let correctionAfter = nothing;
        if (fromLocalAltitudeNotDefault) {
          correctionBefore = await addLocalAltitudeCorrection(from)(
            (from.system as SystemLocal).origin.formattedSystem
          );
          correctionBefore = await correctionBefore(
            (from.system as SystemLocal).origin.value
          );
        }
        if (toAltitudeNotDefault) {
          correctionAfter = subtractAltitudeCorrection(to);
        }
        return {
          before: correctionBefore,
          after: correctionAfter
        };
      } else {
        // From local to definition other
        let correctionBefore = nothing;
        let correctionAfter = subtractAltitudeCorrection(to);

        if (fromLocalAltitudeNotDefault) {
          correctionBefore = await addLocalAltitudeCorrection(from)(
            (from.system as SystemLocal).origin.formattedSystem
          );
          correctionBefore = await correctionBefore(
            (from.system as SystemLocal).origin.value
          );
        }
        return {
          before: correctionBefore,
          after: correctionAfter
        };
      }
    }
  } else {
    if (toLocal) {
      //  From system reference to system local
      const fromGeocent = includes(
        "+proj=geocent",
        toLower((from.system as SystemReference).definition)
      );
      const fromAltitudeNotDefault = !includes(
        "default",
        toLower((from.system as SystemReference).altitudeReference)
      );
      const toLocalAltitudeNotDefault = !includes(
        "default",
        ((to.system as SystemLocal).origin.formattedSystem
          .system as SystemReference).altitudeReference
      );
      if (fromGeocent) {
        // From definition geocent to local
        let correctionBefore = nothing;
        let correctionAfter = nothing;
        if (fromAltitudeNotDefault) {
          correctionBefore = addAltitudeCorrection(from);
        }
        if (toLocalAltitudeNotDefault) {
          correctionAfter = await subtractLocalAltitudeCorrection(to)(
            (to.system as SystemLocal).origin.formattedSystem
          );
          correctionAfter = await correctionAfter(
            (to.system as SystemLocal).origin.value
          );
        }
        return {
          before: correctionBefore,
          after: correctionAfter
        };
      } else {
        // From definition other to local
        let correctionBefore = nothing;
        let correctionAfter = nothing;
        if (fromAltitudeNotDefault) {
          correctionBefore = addAltitudeCorrection(from);
        }
        if (toLocalAltitudeNotDefault) {
          // add this logic, it might be a bit complex!
          correctionAfter = await subtractLocalAltitudeCorrection(to)(
            (to.system as SystemLocal).origin.formattedSystem
          );
          correctionAfter = await correctionAfter(
            (to.system as SystemLocal).origin.value
          );
        }
        return {
          before: correctionBefore,
          after: correctionAfter
        };
      }
    } else {
      // From system reference to system reference
      const fromGeocent = includes(
        "+proj=geocent",
        toLower((from.system as SystemReference).definition)
      );
      const toGeocent = includes(
        "+proj=geocent",
        toLower((to.system as SystemReference).definition)
      );
      const fromAltitudeNotDefault = !includes(
        "default",
        toLower((from.system as SystemReference).altitudeReference)
      );
      const toAltitudeNotDefault = !includes(
        "default",
        (to.system as SystemReference).altitudeReference
      );
      if (fromGeocent) {
        if (toGeocent) {
          // From definition geocent to definition geocent
          return { before: nothing, after: nothing };
        } else {
          // From definition geocent to definition other
          if (fromAltitudeNotDefault) {
            // FIXME: does this logic make sence? do we need this type of complexity?
            return {
              before: addAltitudeCorrection(from),
              after: subtractAltitudeCorrection(to) // Do we actually need to correct altitude in this case?
            };
          } else {
            return {
              before: nothing,
              after: subtractAltitudeCorrection(to) // Do we actually need to correct altitude in this case?
            };
          }
        }
      } else {
        if (toGeocent) {
          // From definition other to definition geocent
          if (toAltitudeNotDefault) {
            // FIXME: does this logic make sence? do we need this type of complexity?
            return {
              before: addAltitudeCorrection(from),
              after: subtractAltitudeCorrection(to)
            };
          } else {
            return {
              before: addAltitudeCorrection(from),
              after: nothing
            };
          }
        } else {
          // From definition other to definition other
          return {
            before: addAltitudeCorrection(from),
            after: subtractAltitudeCorrection(to)
          };
        }
      }
    }
  }
};

/**
 * Gets the altitude of the EGM96 geoid at a point expressed in a formattedSystem
 * @param formattedSystem
 * @param point
 */
const getEgm96GeoidAltitude = (formattedSystem: FormattedSystem) => {
  const doConvertToWgs84 = convert(formattedSystem, {
    format: { type: "arrayLatitudeLongitudeAltitude" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=longlat +datum=WGS84 +no_defs"
    }
  });
  return async point => {
    const [latitude, longitude, altitude] = doConvertToWgs84(point);
    let egm96Module = await import("@geospatial/geometry-egm96");
    while (egm96Module.default) {
      egm96Module = egm96Module.default;
    }
    const { getEgm96Offset } = egm96Module;
    return await getEgm96Offset(latitude, longitude);
  };
};

/**
 * Gets the altitude of Cesium terrain at a point expressed in a formattedSystem
 * @param formattedSystem
 * @param point
 */
const getCesiumTerrainAltitude = (formattedSystem: FormattedSystem) => {
  const doConvertToWgs84 = convert(formattedSystem, {
    format: { type: "arrayLatitudeLongitudeAltitude" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=longlat +datum=WGS84 +no_defs"
    }
  });
  return async point => {
    const [latitude, longitude, altitude] = doConvertToWgs84(point);
    const { addAltitudeToLocation } = await import(
      "@geospatial/geometry-coordinates-altitude"
    );
    const result = await addAltitudeToLocation({
      longitude: longitude,
      latitude: latitude,
      altitude: altitude
    });
    return result.altitude;
  };
};

/**
 * Gets the altitude of the ellipsoid of a reference system at a point
 * @param formattedSystem to get the altitude of the ellipsoid from
 * @param point, we want to get the altitude of the ellipsoid of the system at this point
 */
export const getReferenceEllipsoidAltitude = (
  formattedSystem: FormattedSystem
) => {
  const doConvertToArrayLatitudeLongitudeAltitude = convert(
    { ...formattedSystem, format: { type: "arrayXYZ" } },
    {
      ...formattedSystem,
      format: { type: "arrayLatitudeLongitudeAltitude" }
    }
  );
  const doConvertToWgs84Geocent = convert(
    {
      ...formattedSystem,
      format: { type: "arrayLatitudeLongitudeAltitude" }
    },
    {
      format: { type: "arrayLatitudeLongitudeAltitude" },
      system: {
        type: "reference",
        altitude: "default",
        definition: "+proj=geocent +datum=WGS84 +no_defs"
      }
    }
  );
  const doConvertFromWgs84GeocentToWgs84 = convert(
    {
      format: { type: "arrayLatitudeLongitudeAltitude" },
      system: {
        type: "reference",
        altitude: "default",
        definition: "+proj=geocent +datum=WGS84 +no_defs"
      }
    },
    {
      format: { type: "arrayLatitudeLongitudeAltitude" },
      system: {
        type: "reference",
        altitude: "default",
        definition: "+proj=longlat +datum=WGS84 +no_defs"
      }
    }
  );
  const doConvertFromWgs84GeocentToSystemDefinition = convert(
    {
      format: { type: "arrayLatitudeLongitudeAltitude" },
      system: {
        type: "reference",
        altitude: "default",
        definition: "+proj=geocent +datum=WGS84 +no_defs"
      }
    },
    {
      ...formattedSystem,
      format: { type: "arrayLatitudeLongitudeAltitude" }
    }
  );
  return async point => {
    // Coordinates of the source point to get the ellipsoid altitude at
    const [
      pointLatitude,
      pointLongitude,
      pointAltitude // We don't care about altitude of the source point over the ellipsoid, because we want the altitude of the ellipsoid itself
    ] = doConvertToArrayLatitudeLongitudeAltitude(point);
    // Coordinates of the point on the ellipsoid, vertically under the source point
    const [
      pointOnEllipsoidLatitude,
      pointOnEllipsoidLongitude,
      pointOnEllipsoidAltitude
    ] = [pointLatitude, pointLongitude, 0];
    // Coordinates of the point on the ellipsoid, vertically under the source point, expressed in WGS84
    const [
      latitude,
      longitude,
      altitude
    ] = doConvertFromWgs84GeocentToSystemDefinition(
      // alternatively we can convert always to wgs84 using doConvertFromWgs84GeocentToWgs84 instead
      doConvertToWgs84Geocent([
        pointOnEllipsoidLatitude,
        pointOnEllipsoidLongitude,
        pointOnEllipsoidAltitude
      ])
    );
    return altitude;
  };
};

/**
 * Gets the altitude of the WGS84 ellipsoid at a point expressed in a formattedSystem
 * @param formattedSystem
 * @param point
 */
const getWGS84GeoidAltitude = format => async p => 0;

/**
 * A map of functions that get the altitude of various things above the WGS84 Ellipsoid
 */
const mapGetAltitude = {
  wgs84: getWGS84GeoidAltitude,
  egm96: getEgm96GeoidAltitude,
  cesiumTerrain: getCesiumTerrainAltitude,
  default: getReferenceEllipsoidAltitude
};

/**
 * @param p A function that takes a point and returns the same point, it does not correct its altitude
 */
const nothing = async p => p;

/**
 * A function which, given an alitude reference, returns a function which adds the altitude reference to the altitude of points
 * @param p
 */
const correctAltitude = (direction = +1) => (
  FormattedSystem: FormattedSystem
) => {
  const altitudeReference = (FormattedSystem.system as SystemReference)
    .altitudeReference;
  const getGeoidAltitude = getOr(
    getWGS84GeoidAltitude,
    altitudeReference,
    mapGetAltitude
  )(FormattedSystem);
  return async ([latitude, longitude, altitude]) => {
    const altitudeOffset = await getGeoidAltitude([
      latitude,
      longitude,
      altitude
    ]);
    // console.log(altitudeOffset);
    return [latitude, longitude, altitude + direction * altitudeOffset];
  };
};

/**
 * Add the geoid altitude correction to a given point
 */
const addAltitudeCorrection = correctAltitude(+1);

/**
 * Remove the geoid altitude correction to a given point
 */
const subtractAltitudeCorrection = correctAltitude(-1);

/**
 * A function which, given an alitude reference, returns a function which adds the altitude reference to the altitude of points
 * @param p
 */
const correctLocalAltitude = (direction = +1) => (
  FormattedSystem: FormattedSystem
) => {
  const altitudeReference = (FormattedSystem.system as SystemReference)
    .altitudeReference;
  const getGeoidAltitude = getOr(
    getWGS84GeoidAltitude,
    altitudeReference,
    mapGetAltitude
  )(FormattedSystem);
  return async (FormattedLocalSystem: FormattedSystem) => {
    const altitudeLocalReference = (FormattedLocalSystem.system as SystemReference)
      .altitudeReference;
    const getGeoidLocalAltitude = getOr(
      getWGS84GeoidAltitude,
      altitudeLocalReference,
      mapGetAltitude
    )(FormattedLocalSystem);
    return async p => {
      const altitudeLocalOffset = await getGeoidLocalAltitude(p);
      return async ([latitude, longitude, altitude]) => {
        const altitudeOffset = await getGeoidAltitude([
          latitude,
          longitude,
          altitude
        ]);
        return [
          latitude,
          longitude,
          altitude +
            direction * altitudeOffset +
            direction * altitudeLocalOffset
        ];
      };
    };
  };
};

/**
 * Add the geoid altitude correction to a given point
 */
const addLocalAltitudeCorrection = correctLocalAltitude(+1);

/**
 * Remove the geoid altitude correction to a given point
 */
const subtractLocalAltitudeCorrection = correctLocalAltitude(-1);
