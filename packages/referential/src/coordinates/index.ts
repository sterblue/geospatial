import proj4 from "proj4";
import { map, values } from "lodash/fp";
import { System, Value, ReferencedValue } from "../types";
import { convert } from "..";

// This is needed because Proj4 mutates it's inputs!
const cloneArrayXYZ = ([x, y, z]) => [x, y, z];
// const cloneArrayXYZ = x => x;

export const transformCoordinates = (from: System, to: System) => {
  if (from.type === "reference") {
    if (to.type === "reference") {
      // Reference to Reference
      const applyProj4 = proj4(from.definition, to.definition);
      return p => {
        return applyProj4.forward(cloneArrayXYZ(p));
      }; // Return directly the proj4 forward transform function
    } else if (to.type === "local") {
      // Reference to Local
      const applyTransformToGeocentric = proj4(
        from.definition,
        "+proj=geocent +datum=WGS84 +no_defs"
      ).forward;
      const applyTransformGeocentricToLocal = transformGeocentricToLocal(
        to.origin
      );
      return p =>
        applyTransformGeocentricToLocal(
          applyTransformToGeocentric(cloneArrayXYZ(p))
        );
    } else {
      throw new Error(
        `In transformCoordinates, coordinate system "to" should be "reference" or "local"`
      );
    }
  } else if (from.type === "local") {
    if (to.type === "reference") {
      // Local to Reference
      const applyTransformLocalToGeocentric = transformLocalToGeocentric(
        from.origin
      );
      const applyTransformFromGeocentric = proj4(
        "+proj=geocent +datum=WGS84 +no_defs",
        to.definition
      ).forward;
      return p =>
        applyTransformFromGeocentric(
          cloneArrayXYZ(applyTransformLocalToGeocentric(p))
        );
    } else if (to.type === "local") {
      // Local to Local
      return transformLocalToLocal(from.origin, to.origin);
    } else {
      throw new Error(
        `In transformCoordinates, coordinate system "to" should be "reference" or "local"`
      );
    }
  } else {
    throw new Error(
      `In transformCoordinates, coordinate system "from" should be "reference" or "local"`
    );
  }
};

export const transformCoordinatesAsync = async (from: System, to: System) => {
  if (from.type === "reference") {
    if (to.type === "reference") {
      // Reference to Reference
      const proj4 = await getProj4WithDefs();
      const applyProj4 = proj4(from.definition, to.definition);
      return p => applyProj4.forward(cloneArrayXYZ(p)); // Return directly the proj4 forward transform function
    } else if (to.type === "local") {
      // Reference to Local
      const proj4 = await getProj4WithDefs();
      const applyTransformToGeocentric = proj4(
        from.definition,
        "+proj=geocent +datum=WGS84 +no_defs"
      ).forward;
      const applyTransformGeocentricToLocal = transformGeocentricToLocal(
        to.origin
      );
      return p =>
        applyTransformGeocentricToLocal(
          applyTransformToGeocentric(cloneArrayXYZ(p))
        );
    } else {
      throw new Error(
        `In transformCoordinates, coordinate system "to" should be "reference" or "local"`
      );
    }
  } else if (from.type === "local") {
    if (to.type === "reference") {
      // Local to Reference
      const proj4 = await getProj4WithDefs();
      const applyTransformLocalToGeocentric = transformLocalToGeocentric(
        from.origin
      );
      const applyTransformFromGeocentric = proj4(
        "+proj=geocent +datum=WGS84 +no_defs",
        to.definition
      ).forward;
      return p =>
        applyTransformFromGeocentric(
          cloneArrayXYZ(applyTransformLocalToGeocentric(p))
        );
    } else if (to.type === "local") {
      // Local to Local
      return transformLocalToLocal(from.origin, to.origin);
    } else {
      throw new Error(
        `In transformCoordinates, coordinate system "to" should be "reference" or "local"`
      );
    }
  } else {
    throw new Error(
      `In transformCoordinates, coordinate system "from" should be "reference" or "local"`
    );
  }
};

/**
 * Async function that loads epsg code defs into existing proj4 instance.
 */
export const getProj4WithDefs = async () => {
  // const { default: proj4WithDefs } = await import("proj4");
  // Make sure we only load the codes if they are not loaded
  if (typeof proj4.defs("EPSG:3763") === "undefined") {
    const epsgProjections = await import("epsg-index/all.json");

    const defs = map(
      ({ code, proj4 }) => [`EPSG:${code}`, proj4],
      values(epsgProjections)
    );
    proj4.defs(defs);
  }
  return proj4;
};

/**
 * Convert the geocentric xyz coordinates to local coordinates in local frame with origin at olat olon oalt
 * @param position coordinates
 * @param origin origin location
 */
const transformGeocentricToLocal = (origin: ReferencedValue) => {
  const [olatDeg, olonDeg, oalt] = convert(origin.formattedSystem, {
    format: { type: "arrayLatitudeLongitudeAltitude" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=longlat +datum=WGS84 +no_defs"
    }
  })(origin.value);
  const toto = convert(origin.formattedSystem, {
    format: { type: "arrayXYZ" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=geocent +datum=WGS84 +no_defs"
    }
  })(origin.value);
  const [ox, oy, oz] = toto;
  const [olat, olon] = [(olatDeg * Math.PI) / 180, (olonDeg * Math.PI) / 180];
  return ([x, y, z]: [number, number, number]): [number, number, number] => {
    return [
      (-oy + y) * Math.cos(olon) + (ox - x) * Math.sin(olon),
      (-oz + z) * Math.cos(olat) +
        Math.sin(olat) *
          ((ox - x) * Math.cos(olon) + (oy - y) * Math.sin(olon)),
      (-oz + z) * Math.sin(olat) +
        Math.cos(olat) *
          ((-ox + x) * Math.cos(olon) + (-oy + y) * Math.sin(olon))
    ];
  };
};

/**
 * Convert the local frame xyz coordinates to geocentric coordinates
 * @param position coordinates
 * @param origin origin location
 */
const transformLocalToGeocentric = (origin: ReferencedValue) => {
  const [olatDeg, olonDeg, oalt] = convert(origin.formattedSystem, {
    format: { type: "arrayLatitudeLongitudeAltitude" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=longlat +datum=WGS84 +no_defs"
    }
  })(origin.value);
  const [ox, oy, oz] = convert(origin.formattedSystem, {
    format: { type: "arrayXYZ" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=geocent +datum=WGS84 +no_defs"
    }
  })(origin.value);
  const [olat, olon] = [(olatDeg * Math.PI) / 180, (olonDeg * Math.PI) / 180];
  return ([x, y, z]: [number, number, number]): [number, number, number] => {
    return [
      ox +
        z * Math.cos(olat) * Math.cos(olon) -
        y * Math.cos(olon) * Math.sin(olat) -
        x * Math.sin(olon),
      oy +
        x * Math.cos(olon) +
        z * Math.cos(olat) * Math.sin(olon) -
        y * Math.sin(olat) * Math.sin(olon),
      oz + y * Math.cos(olat) + z * Math.sin(olat)
    ];
  };
};

/**
 * Convert the local frame xyz coordinates to geocentric coordinates
 * @param position coordinates
 * @param origin origin location
 */
const transformLocalToLocal = (
  originFrom: ReferencedValue,
  originTo: ReferencedValue
) => {
  const [o1latDeg, o1lonDeg, o1alt] = convert(originFrom.formattedSystem, {
    format: { type: "arrayLatitudeLongitudeAltitude" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=longlat +datum=WGS84 +no_defs"
    }
  })(originFrom.value);
  const [o1x, o1y, o1z] = convert(originFrom.formattedSystem, {
    format: { type: "arrayXYZ" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=geocent +datum=WGS84 +no_defs"
    }
  })(originFrom.value);

  const [o2latDeg, o2lonDeg, o2alt] = convert(originTo.formattedSystem, {
    format: { type: "arrayLatitudeLongitudeAltitude" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=longlat +datum=WGS84 +no_defs"
    }
  })(originTo.value);
  const [o2x, o2y, o2z] = convert(originTo.formattedSystem, {
    format: { type: "arrayXYZ" },
    system: {
      type: "reference",
      altitude: "default",
      definition: "+proj=geocent +datum=WGS84 +no_defs"
    }
  })(originTo.value);

  const [o1lat, o1lon] = [
    (o1latDeg * Math.PI) / 180,
    (o1lonDeg * Math.PI) / 180
  ];
  const [o2lat, o2lon] = [
    (o2latDeg * Math.PI) / 180,
    (o2lonDeg * Math.PI) / 180
  ];

  return ([x, y, z]: [number, number, number]): [number, number, number] => {
    return [
      Math.cos(o2lon) *
        (o1y -
          o2y +
          x * Math.cos(o1lon) +
          z * Math.cos(o1lat) * Math.sin(o1lon) -
          y * Math.sin(o1lat) * Math.sin(o1lon)) +
        (-o1x +
          o2x -
          z * Math.cos(o1lat) * Math.cos(o1lon) +
          y * Math.cos(o1lon) * Math.sin(o1lat) +
          x * Math.sin(o1lon)) *
          Math.sin(o2lon),
      Math.cos(o2lat) *
        (o1z - o2z + y * Math.cos(o1lat) + z * Math.sin(o1lat)) +
        Math.sin(o2lat) *
          (Math.cos(o2lon) *
            (-o1x +
              o2x -
              z * Math.cos(o1lat) * Math.cos(o1lon) +
              y * Math.cos(o1lon) * Math.sin(o1lat) +
              x * Math.sin(o1lon)) -
            (o1y -
              o2y +
              x * Math.cos(o1lon) +
              z * Math.cos(o1lat) * Math.sin(o1lon) -
              y * Math.sin(o1lat) * Math.sin(o1lon)) *
              Math.sin(o2lon)),
      (o1z - o2z + y * Math.cos(o1lat) + z * Math.sin(o1lat)) *
        Math.sin(o2lat) +
        Math.cos(o2lat) *
          (Math.cos(o2lon) *
            (o1x -
              o2x +
              z * Math.cos(o1lat) * Math.cos(o1lon) -
              y * Math.cos(o1lon) * Math.sin(o1lat) -
              x * Math.sin(o1lon)) +
            (o1y -
              o2y +
              x * Math.cos(o1lon) +
              z * Math.cos(o1lat) * Math.sin(o1lon) -
              y * Math.sin(o1lat) * Math.sin(o1lon)) *
              Math.sin(o2lon))
    ];
  };
};
