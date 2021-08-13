global.require =
  process.env.NODE_ENV === "production"
    ? __non_webpack_require__ => {
        if (typeof __non_webpack_require__ !== "undefined") {
          return __non_webpack_require__;
        } else {
          return null;
        }
      }
    : require;

import {
  Ion,
  sampleTerrainMostDetailed,
  createWorldTerrain,
  Cartographic
} from "cesium";
import { map, get } from "lodash/fp";
import Bluebird from "bluebird";
// console.log("cesium");
// console.log(cesium);
// console.log(Object.keys(cesium));

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjQ4MGM4ZS02MTdiLTRlMzctYWQzMS0wMzJmY2I4MjVhZjEiLCJpZCI6MTc0NzgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzIyODYyMTF9.KQfJW5f0nnq1OAAxG9vJ9D4IeGnOpkVXmurd2znlwzM";

/**
 * promisifyCesiumFunction is not needed for this particular case. We can directly use cesium.sampleTerrainMostDetailed because it's a promise
 */
export { sampleTerrainMostDetailed };

// export const sampleTerrainMostDetailed = promisifyCesiumFunction(
//   cesium.sampleTerrainMostDetailed
// );
// export async function main(terrainProvider, positions) {
//   //const terrainProvider = Cesium.createWorldTerrain();
//   const updatedPositions = await sampleTerrainMostDetailed(
//     terrainProvider,
//     positions
//   );
//   console.log(updatedPositions);
//   return updatedPositions;
// }

// Create Cesium World Terrain with default settings, this should use wgs84 ellipsiod
export const terrainProvider = createWorldTerrain();

/**
 * A function that takes as arguments an array of coordinates (latitude and longitude)
 * or a pair of coordinates and returns an array with cesium cartographic coordinates.
 * This is useful for using coordinates (lat long) within Cesium
 *
 * @param {} positions An array with coordinates
 * @returns {} The same array, but this time with cesium cartographic coordinates
 */
export const generateCesiumCoordinates = (positions: Array) => {
  if (Array.isArray(positions)) {
    // is an array check
    if (Array.isArray(positions[0])) {
      // is an array of array
      return map(p => {
        if (p.length == 2) {
          return Cartographic.fromDegrees(p[0], p[1]);
        } else if (p.length == 3) {
          return Cartographic.fromDegrees(p[0], p[1], p[2]);
        } else {
          throw "Object must have only 2 or 3 coordinates";
        }
      }, positions);
    } else {
      // Should be a single coordinate, check if its an array of numbers only
      if (!positions.some(isNaN)) {
        if (positions.length == 2) {
          return Cartographic.fromDegrees(positions[0], positions[1]);
        } else if (positions.length == 3) {
          return Cartographic.fromDegrees(
            positions[0],
            positions[1],
            positions[2]
          );
        } else {
          throw "Object must have only 2 or 3 coordinates";
        }
      } else {
        throw "Object must be and array of numbers";
      }
    }
  } else {
    throw "Object must an array";
  }
};

export const addAltitudeToLocation = async ({
  longitude,
  latitude,
  ...rest
}) => {
  const positions = generateCesiumCoordinates([longitude, latitude]);
  const updatedPositions = await sampleTerrainMostDetailed(terrainProvider, [
    positions
  ]);
  return { longitude, latitude, ...rest, altitude: updatedPositions[0].height };
};

export const addAltitudeToGeojson = async (geojson, offset = 0) => {
  // This only works with single geometries. Multi geometries not allowed at this moment

  const features = await Bluebird.map(
    geojson.features,
    async f => {
      if (f.geometry.type.toLowerCase() == "point") {
        const coordinates = await addAltitudeToLocation({
          longitude: f.geometry.coordinates[0],
          latitude: f.geometry.coordinates[1]
        });
        f.geometry.coordinates = [
          coordinates.longitude,
          coordinates.latitude,
          coordinates.altitude + offset
        ];
        return f;
      } else if (f.geometry.type.toLowerCase() == "linestring") {
        const coordinates = await Bluebird.map(
          f.geometry.coordinates,
          async c => {
            const coordinates = await addAltitudeToLocation({
              longitude: c[0],
              latitude: c[1]
            });
            return [
              coordinates.longitude,
              coordinates.latitude,
              coordinates.altitude + offset
            ];
          },
          { concurrency: 10 }
        );
        f.geometry.coordinates = coordinates;
        return f;
      } else if (f.geometry.type.toLowerCase() == "polygon") {
        const coordinates = await Bluebird.map(
          f.geometry.coordinates,
          async p => {
            const polygonCoordinates = await Bluebird.map(
              p,
              async c => {
                const coordinates = await addAltitudeToLocation({
                  longitude: c[0],
                  latitude: c[1]
                });
                return [
                  coordinates.longitude,
                  coordinates.latitude,
                  coordinates.altitude + offset
                ];
              },
              { concurrency: 10 }
            );
            return polygonCoordinates;
          },
          { concurrency: 10 }
        );
        f.geometry.coordinates = coordinates;
        return f;
      } else {
        throw "Single geometries only. Multi geometries are not allowed.";
      }
    },
    { concurrency: 10 }
  );

  geojson.features = features;
  return geojson;
};
export const terrainMaximumLevelOfDetail = async location => {
  await terrainProvider.readyPromise;
  const availability = terrainProvider.availability;
  const position = new Cartographic.fromDegrees(
    get("longitude", location),
    get("latitude", location)
  );
  await sampleTerrainMostDetailed(terrainProvider, [position]);
  const result = availability.computeMaximumLevelAtPosition(position);

  return result;
};
