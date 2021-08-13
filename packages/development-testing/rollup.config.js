import config from "@geospatial/development-rollup-config";
import pkg from "./package.json";

export default config(pkg, {
  input: "./src/index.ts"
});
