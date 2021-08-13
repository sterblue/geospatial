import { Format, Value } from "../types";
import { get, has } from "lodash/fp";
import { convertStringToArrayXYZ } from "./string";

/**
 * The convertion will always goes from formatX to ArrayXYZ and from ArrayXYZ to FormatX
 */

export const convertFormat = (from: Format, to: Format) => {
  //   const fromFormat = from.type;
  //   const to.type = to.type;
  if (from.type === to.type) {
    // Particular case of converting to itself
    return p => p;
  } else if (from.type === "arrayXYZ") {
    // Particular case of converting from arrayXYZ, which happens a lot
    if (has(to.type, mapConvertFromArrayXYZ)) {
      const convertFromArrayXYZ = get(to.type, mapConvertFromArrayXYZ)(to);
      return convertFromArrayXYZ;
    } else {
      throw new Error(
        `In convertFormat, the format ${to.type} cannot be converted from arrayXYZ because it is not in the mapConvertFromArrayXYZ`
      );
    }
  } else if (to.type === "arrayXYZ") {
    // Particular case of converting to arrayXYZ, which happens a lot
    if (has(from.type, mapConvertToArrayXYZ)) {
      const convertToArrayXYZ = get(from.type, mapConvertToArrayXYZ)(from);
      return convertToArrayXYZ;
    } else {
      throw new Error(
        `In convertFormat, the format ${from.type} cannot be converted to arrayXYZ because it is not in the mapConvertToArrayXYZ`
      );
    }
  } else {
    // General case, which should not happen a lot
    if (has(from.type, mapConvertToArrayXYZ)) {
      if (has(to.type, mapConvertFromArrayXYZ)) {
        const convertToArrayXYZ = get(from.type, mapConvertToArrayXYZ)(from);
        const convertFromArrayXYZ = get(to.type, mapConvertFromArrayXYZ)(to);
        return p => convertFromArrayXYZ(convertToArrayXYZ(p));
      } else {
        throw new Error(
          `In convertFormat, the format ${to.type} cannot be converted from ${from.type} because it is not in the mapConvertFromArrayXYZ, so it can't be converted from the intermediate arrayXYZ`
        );
      }
    } else {
      throw new Error(
        `In convertFormat, the format ${from.type} cannot be converted to ${to.type} because it is not in the mapConvertToArrayXYZ, so it can't be converted to the intermediate arrayXYZ`
      );
    }
  }
};

/**
 * * A Map that contains all functions to convert to arrayXYZ from all other formats
 */
const mapConvertToArrayXYZ = {
  arrayXY: format => ([x, y]) => [x, y, NaN],
  arrayXYZ: format => p => p,
  arrayLatitudeLongitude: format => ([latitude, longitude]) => [
    longitude,
    latitude,
    NaN
  ],
  arrayLatitudeLongitudeAltitude: format => ([
    latitude,
    longitude,
    altitude
  ]) => [longitude, latitude, altitude],
  string: format => convertStringToArrayXYZ,
  objectXY: format => p => [p.x, p.y, NaN],
  objectXYZ: format => p => [p.x, p.y, p.z],
  objectLatLon: format => p => [p.lon, p.lat, NaN],
  objectLatLonAlt: format => p => [p.lon, p.lat, p.alt],
  objectLatitudeLongitude: format => p => [p.longitude, p.latitude, NaN],
  objectLatitudeLongitudeAltitude: format => p => [
    p.longitude,
    p.latitude,
    p.altitude
  ],
  threeVector2: format => vector2 => [vector2.x, vector2.y, NaN],
  threeVector3: format => vector3 => [vector3.x, vector3.y, vector3.z],
  threeVector4: format => vector4 => [vector4.x, vector4.y, vector4.z],
  cesiumCartographic: format => cartographic => [
    cartographic.longitude,
    cartographic.latitude,
    cartographic.height
  ],
  cesiumCartesian2: format => cartesian2 => [cartesian2.x, cartesian2.y, NaN],
  cesiumCartesian3: format => cartesian3 => [
    cartesian3.x,
    cartesian3.y,
    cartesian3.z
  ],
  cesiumCartesian4: format => cartesian4 => [
    cartesian4.x,
    cartesian4.y,
    cartesian4.z
  ]
};

/**
 * A Map that contains all functions to convert from arrayXYZ to all other formats
 */
const mapConvertFromArrayXYZ = {
  arrayXY: format => ([x, y, z]) => [x, y],
  arrayXYZ: format => p => p,
  arrayLatitudeLongitude: format => ([x, y, z]) => [y, x],
  arrayLatitudeLongitudeAltitude: format => ([x, y, z]) => [y, x, z],
  string: format => ([x, y, z]) => {
    if (typeof z === "undefined") {
      z = NaN;
    }
    return `${x} , ${y} , ${z}`.replace(/\s/g, "");
  },
  objectXY: format => ([x, y, z]) => {
    return { x: x, y: y };
  },
  objectXYZ: format => ([x, y, z]) => {
    return { x: x, y: y, z: z };
  },
  objectLatLon: format => ([x, y, z]) => {
    return { lat: y, lon: x };
  },
  objectLatLonAlt: format => ([x, y, z]) => {
    return { lat: y, lon: x, alt: z };
  },
  objectLatitudeLongitude: format => ([x, y, z]) => {
    return { latitude: y, longitude: x };
  },
  objectLatitudeLongitudeAltitude: format => ([x, y, z]) => {
    return { latitude: y, longitude: x, altitude: z };
  },

  threeVector2: format => ([x, y, z]) => new format.three.Vector2(x, y), // new format.three(x, y), // Or new format.three.Vector2(x, y)

  threeVector3: format => ([x, y, z]) => new format.three.Vector3(x, y, z), // Or new format.three.Vector3(x, y, z)

  threeVector4: format => ([x, y, z]) => new format.three.Vector4(x, y, z), // Or new format.three.Vector4(x, y , z)

  cesiumCartographic: format => ([x, y, z]) =>
    new format.cesium.Cartographic(x, y, z), // Or new format.cesium.Cartographic(x, y) // Cesium heigh should always be above ellipsoid, not geocentric heigh
  cesiumCartesian2: format => ([x, y, z]) => new format.cesium.Cartesian2(x, y), // Or new format.cesium.Cartesian2(x, y)
  cesiumCartesian3: format => ([x, y, z]) =>
    new format.cesium.Cartesian3(x, y, z), // Or new format.cesium.Cartesian3(x, y)
  cesiumCartesian4: format => ([x, y, z]) =>
    new format.cesium.Cartesian4(x, y, z) // Or new format.cesium.Cartesian4(x, y)
};
