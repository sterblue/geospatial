import * as THREE from "three-universal/build/three.node";
import { ValuesOfCorrectType } from "graphql/validation/rules/ValuesOfCorrectType";

///////////////////////////////////////////////////////////////////////////////

/**
 * A system is a mathematical method of specifying positions in space.
 * It can be a system reference: based on proj4 Coordinate System Reference or
 * A local system located in an arbitraty place in space, not related to proj4
 */
export type System = SystemReference | SystemLocal;

export type SystemReference = {
  type: "reference";
  definition: string; // A Proj4 definition string https://proj4.org/usage/quickstart.html Or alternativly a OGC WKT https://www.opengeospatial.org/standards/wkt-crs
  altitudeReference: "default" | "wgs84" | "egm96" | "cesiumTerrain";
};

export type SystemLocal = {
  type: "local";
  origin: ReferencedValue;
  tranformation: Matrix;
};

export type Matrix = number[];

///////////////////////////////////////////////////////////////////////////////

/**
 * A format is a way to represent data in the programming language
 */
export type Format =
  | FormatArrayXY // OpenLayers
  | FormatArrayXYZ
  | FormatArrayLatitudeLongitude
  | FormatArrayLatitudeLongitudeAltitude
  | FormatString
  | FormatObjectXY
  | FormatObjectXYZ
  | FormatObjectLatLon
  | FormatObjectLatLonAlt
  | FormatObjectLatitudeLongitude
  | FormatObjectLatitudeLongitudeAltitude
  | FormatThreeVector2
  | FormatThreeVector3
  | FormatThreeVector4
  | FormatCesiumCartographic
  | FormatCesiumCartesian2
  | FormatCesiumCartesian3
  | FormatCesiumCartesian4;

export type Value =
  | ValueArrayXY // OpenLayers
  | ValueArrayXYZ
  | ValueArrayLatitudeLongitude
  | ValueArrayLatitudeLongitudeAltitude
  | ValueString
  | ValueObjectXY
  | ValueObjectXYZ
  | ValueObjectLatLon
  | ValueObjectLatLonAlt
  | ValueObjectLatitudeLongitude
  | ValueObjectLatitudeLongitudeAltitude
  | ValueThreeVector2
  | ValueThreeVector3
  | ValueThreeVector4
  | ValueCesiumCartographic
  | ValueCesiumCartesian2
  | ValueCesiumCartesian3
  | ValueCesiumCartesian4;

export type FormatArrayXY = {
  type: "arrayXY";
};

export type ValueArrayXY = [number, number];

export type FormatArrayXYZ = {
  type: "arrayXYZ";
};
export type ValueArrayXYZ = [number, number, number];

export type FormatArrayLatitudeLongitude = {
  type: "arrayLatitudeLongitude";
};

export type ValueArrayLatitudeLongitude = [number, number];

export type FormatArrayLatitudeLongitudeAltitude = {
  type: "arrayLatitudeLongitudeAltitude";
};

export type ValueArrayLatitudeLongitudeAltitude = [number, number, number];

export type FormatString = {
  type: "string";
};

export type ValueString = string;

export type FormatObjectXY = {
  type: "objectXY";
};

export type ValueObjectXY = { x: number; y: number };

export type FormatObjectXYZ = {
  type: "objectXYZ";
};

export type ValueObjectXYZ = { x: number; y: number; z: number };

export type FormatObjectLatLon = {
  type: "objectLatLon";
};

export type ValueObjectLatLon = { lat: number; lon: number };

export type FormatObjectLatLonAlt = {
  type: "The folowing ";
};

export type ValueObjectLatLonAlt = { lat: number; lon: number; alt: number };

export type FormatObjectLatitudeLongitude = {
  type: "objectLatitudeLongitude";
};

export type ValueObjectLatitudeLongitude = {
  latitude: number;
  longitude: number;
};

export type FormatObjectLatitudeLongitudeAltitude = {
  type: "objectLatitudeLongitudeAltitude";
};

export type ValueObjectLatitudeLongitudeAltitude = {
  latitude: number;
  longitude: number;
  altitude: number;
};

export type FormatThreeVector2 = {
  type: "threeVector2";
  three: {};
};

export type ValueThreeVector2 = THREE.Vector2;

export type FormatThreeVector3 = {
  type: "threeVector3";
  three: {};
};

export type ValueThreeVector3 = THREE.Vector3;

export type FormatThreeVector4 = {
  type: "threeVector4";
  three: {};
};

export type ValueThreeVector4 = THREE.Vector4;

export type FormatCesiumCartographic = {
  type: "cesiumCartographic";
  cesium: {};
};

export type ValueCesiumCartographic = Cesium.Cartographic;

export type FormatCesiumCartesian2 = {
  type: "cesiumCartesian2";
  cesium: {};
};

export type ValueCesiumCartesian2 = Cesium.Cartesian2;

export type FormatCesiumCartesian3 = {
  type: "cesiumCartesian3";
  cesium: {};
};

export type ValueCesiumCartesian3 = Cesium.Cartesian3;

export type FormatCesiumCartesian4 = {
  type: "cesiumCartesian4";
  cesium: {};
};

export type ValueCesiumCartesian4 = Cesium.Cartesian4;

///////////////////////////////////////////////////////////////////////////////

/**
 * A formated reference is the combination of a system reference and a format.
 * It is a full spec of what can go in and out of the referential functions.
 */
export type FormattedSystem = FormattedSystemReference | FormattedSystemLocal;

export type FormattedSystemReference =
  | {
      system: SystemReference;
      format: FormatArrayXY;
    }
  | {
      system: SystemReference;
      format: FormatArrayXYZ;
    }
  | {
      system: SystemReference;
      format: FormatArrayLatitudeLongitude;
    }
  | {
      system: SystemReference;
      format: FormatArrayLatitudeLongitudeAltitude;
    }
  | {
      system: SystemReference;
      format: FormatString;
    }
  | {
      system: SystemReference;
      format: FormatObjectXY;
    }
  | {
      system: SystemReference;
      format: FormatObjectXYZ;
    }
  | {
      system: SystemReference;
      format: FormatObjectLatLon;
    }
  | {
      system: SystemReference;
      format: FormatObjectLatLonAlt;
    }
  | {
      system: SystemReference;
      format: FormatObjectLatitudeLongitude;
    }
  | {
      system: SystemReference;
      format: FormatObjectLatitudeLongitudeAltitude;
    }
  | {
      system: SystemReference;
      format: FormatThreeVector2;
    }
  | {
      system: SystemReference;
      format: FormatThreeVector3;
    }
  | {
      system: SystemReference;
      format: FormatThreeVector4;
    }
  | {
      system: SystemReference;
      format: FormatCesiumCartographic;
    }
  | {
      system: SystemReference;
      format: FormatCesiumCartesian2;
    }
  | {
      system: SystemReference;
      format: FormatCesiumCartesian3;
    }
  | {
      system: SystemReference;
      format: FormatCesiumCartesian4;
    };

export type FormattedSystemLocal =
  | {
      system: SystemLocal;
      format: FormatArrayXY;
    }
  | {
      system: SystemLocal;
      format: FormatArrayXYZ;
    }
  | {
      system: SystemLocal;
      format: FormatObjectXY;
    }
  | {
      system: SystemLocal;
      format: FormatObjectXYZ;
    }
  | {
      system: SystemLocal;
      format: FormatThreeVector2;
    }
  | {
      system: SystemLocal;
      format: FormatThreeVector3;
    }
  | {
      system: SystemLocal;
      format: FormatThreeVector4;
    }
  | {
      system: SystemLocal;
      format: FormatCesiumCartesian2;
    }
  | {
      system: SystemLocal;
      format: FormatCesiumCartesian3;
    }
  | {
      system: SystemLocal;
      format: FormatCesiumCartesian4;
    };

///////////////////////////////////////////////////////////////////////////////
export type ReferencedValue = {
  value: Value;
  formattedSystem: FormattedSystem;
};
