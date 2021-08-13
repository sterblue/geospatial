import { map, range } from "lodash/fp";
import { norm } from "mathjs";
import { convertLocationDictToSterblueList } from "./";

/**
*    Returns the exact "air" distance in metres between two WGS84 locations.
*    Does not consider the altitude
    http://www.movable-type.co.uk/scripts/latlong.html
*/
export function getDistanceMetres(
  location1: CoordinatesSterblue,
  location2: CoordinatesSterblue
) {
  const R = 6378137.0; // Radius of "spherical" earth

  const lat1 = (location1[0] * Math.PI) / 180;
  const lon1 = (location1[1] * Math.PI) / 180;

  const lat2 = (location2[0] * Math.PI) / 180;
  const lon2 = (location2[1] * Math.PI) / 180;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

/**
*    Returns the exact "air" distance in metres between two WGS84 locations.
*   Consider the altitude
    http://www.movable-type.co.uk/scripts/latlong.html
*/
export function getDistanceMetres3D(
  location1: CoordinatesDict,
  location2: CoordinatesDict
) {
  const twoDimensionalDistance = getDistanceMetres(
    convertLocationDictToSterblueList(location1),
    convertLocationDictToSterblueList(location2)
  );

  return Math.sqrt(
    Math.pow(twoDimensionalDistance, 2) +
      Math.pow(location1.altitude - location2.altitude, 2)
  );
}

export function getDistanceMetresLTP3D(
  location1: LTPCoordinates,
  location2: LTPCoordinates
): number {
  return norm(
    map(
      index => location2[index] - location1[index],
      range(0, location1.length)
    )
  );
}
