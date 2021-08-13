export const systemWgs84 = {
  type: "reference",
  definition: "+proj=longlat +datum=WGS84 +no_defs",
  altitudeReference: "default"
};

export const systemWgs84Egm96 = {
  type: "reference",
  definition: "+proj=longlat +datum=WGS84 +no_defs",
  altitudeReference: "egm96"
};

export const systemWgs84Terrain = {
  type: "reference",
  definition: "+proj=longlat +datum=WGS84 +no_defs",
  altitudeReference: "cesiumTerrain"
};

export const systemGeocentric = {
  type: "reference",
  definition: "+proj=geocent +datum=WGS84 +no_defs +units=m",
  altitudeReference: "default"
};

export const formatArrayXY = {
  type: "arrayXY"
};

export const formatArrayXYZ = {
  type: "arrayXYZ"
};

export const formatArrayLatitudeLongitude = {
  type: "arrayLatitudeLongitude"
};

export const formatArrayLatitudeLongitudeAltitude = {
  type: "arrayLatitudeLongitudeAltitude"
};

export const formatString = {
  type: "string"
};

export const formatObjectXY = {
  type: "objectXY"
};

export const formatObjectXYZ = {
  type: "objectXYZ"
};

export const formatObjectLatLon = {
  type: "objectLatLon"
};

export const formatObjectLatLonAlt = {
  type: "The folowing "
};

export const formatObjectLatitudeLongitude = {
  type: "objectLatitudeLongitude"
};

export const formatObjectLatitudeLongitudeAltitude = {
  type: "objectLatitudeLongitudeAltitude"
};

export const formatThreeVector2 = three => ({
  type: "threeVector2",
  three
});

export const formatThreeVector3 = three => ({
  type: "threeVector3",
  three
});

export const formatThreeVector4 = three => ({
  type: "threeVector4",
  three
});

export const formatCesiumCartographic = cesium => ({
  type: "cesiumCartographic",
  cesium
});

export const formatCesiumCartesian2 = cesium => ({
  type: "cesiumCartesian2",
  cesium
});

export const formatCesiumCartesian3 = cesium => ({
  type: "cesiumCartesian3",
  cesium
});

export const formatCesiumCartesian4 = cesium => ({
  type: "cesiumCartesian4",
  cesium
});
