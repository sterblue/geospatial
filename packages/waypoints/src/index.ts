/**
 * @module utils/convert/waypoints
 */

import { point } from "@turf/turf";

type Longitude = number;
type Latitude = number;
type Altitude = number;

export type Coordinates = [Latitude, Longitude, Altitude];

type CoordinatesDict = {
  longitude: Longitude;
  latitude: Latitude;
  altitude: Altitude;
};

export type CoordinatesSterblue = Coordinates;
export type CoordinatesGeoJson = [Longitude, Latitude, Altitude];

import {
  getDistanceMetres,
  getDistanceMetres3D,
  getDistanceMetresLTP3D
} from "./distance";

export { getDistanceMetres, getDistanceMetres3D, getDistanceMetresLTP3D };

/**
 *    Returns the exact "air" distance in metres between two WGS84 locations.
 *    Does not consider the altitude
 *    http://www.movable-type.co.uk/scripts/latlong.html
 *    Inputs and output are dict
 */
export function getDistanceMetresDict(
  location1: CoordinatesDict,
  location2: CoordinatesDict
) {
  return getDistanceMetres(
    convertLocationDictToSterblueList(location1),
    convertLocationDictToSterblueList(location2)
  );
}

export function convertLocationDictToSterblueList(
  dict: CoordinatesDict
): CoordinatesSterblue {
  const sterblueList = [dict.latitude, dict.longitude, dict.altitude];
  return sterblueList;
}

export function convertLocationDictToGeojsonList(
  dict: CoordinatesDict
): CoordinatesGeoJson {
  const geoJsonList = [dict.longitude, dict.latitude, dict.altitude];
  return geoJsonList;
}

export function convertLocationDictToPoint(
  dict: CoordinatesDict
): GeoJsonPoint {
  const geoJsonPoint = point([dict.longitude, dict.latitude, dict.altitude]);
  return geoJsonPoint;
}

export function convertPointToDict(point: GeoJsonPoint): CoordinatesDict {
  const dict = {
    latitude: point.geometry.coordinates[1],
    longitude: point.geometry.coordinates[0],
    altitude: point.geometry.coordinates[2]
  };
  return dict;
}

export function convertPointToGeoJsonList(
  point: GeoJsonPoint
): CoordinatesGeoJson {
  const geoJsonList = point.geometry.coordinates;
  return geoJsonList;
}

export function convertPointToSterblueList(
  point: GeoJsonPoint
): CoordinatesSterblue {
  const sterblueList = [
    point.geometry.coordinates[1],
    point.geometry.coordinates[0],
    point.geometry.coordinates[2]
  ];
  return sterblueList;
}

export function convertSterblueListToDict(
  sterblueList: CoordinatesSterblue
): CoordinatesDict {
  const dict = {
    latitude: sterblueList[0],
    longitude: sterblueList[1],
    altitude: sterblueList[2]
  };
  return dict;
}

export function convertSterblueListToGeoJsonList(
  sterblueList: CoordinatesSterblue
): CoordinatesGeoJson {
  const geoJsonList = [sterblueList[1], sterblueList[0], sterblueList[2]];
  return geoJsonList;
}

export function convertSterblueListToPoint(
  sterblueList: CoordinatesSterblue
): GeoJsonPoint {
  const geoJsonPoint = point([
    sterblueList[1],
    sterblueList[0],
    sterblueList[2]
  ]);
  return geoJsonPoint;
}

export function convertGeoJsonListToPoint(
  geoJsonList: CoordinatesGeoJson
): GeoJsonPoint {
  const geoJsonPoint = point(geoJsonList);
  return geoJsonPoint;
}

export function convertGeoJsonListToDict(
  geoJsonList: CoordinatesGeoJson
): CoordinatesDict {
  const dict = {
    latitude: geoJsonList[1],
    longitude: geoJsonList[0],
    altitude: geoJsonList[2]
  };
  return dict;
}

export function convertGeoJsonListToSterblueList(
  geoJsonList: CoordinatesGeoJson
): CoordinatesSterblue {
  const sterblueList = [geoJsonList[1], geoJsonList[0], geoJsonList[2]];
  return sterblueList;
}
