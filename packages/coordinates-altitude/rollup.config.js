import config from "@geospatial/development-rollup-config";
import pkg from "./package.json";
import { remove, isEqual } from "lodash/fp";

const baseConfig = config(pkg, {
  input: "./src/index.ts"
});

export default {
  ...baseConfig,
  external: [
    "Build/Cesium/Cesium",
    "cesium/Source/Cesium.js",
    "cesium/Build/Cesium/Cesium.js",
    "cesium/Source/Cesium",
    "cesium/Build/Cesium/Cesium",
    "cesium/Source",
    "cesium/Build/Cesium",
    "cesium/Build",
    "cesium/Build/CesiumUnminified/Cesium.js",
    "cesium/Build/CesiumUnminified/Cesium",
    "cesium/Build/CesiumUnminified",
    "cesium"
  ]
};
