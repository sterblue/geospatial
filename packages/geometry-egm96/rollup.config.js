import config from "@geospatial/development-rollup-config";
import fileAsBlob from "rollup-plugin-file-as-blob";
import pkg from "./package.json";

export default config(pkg, {
  input: "./src/index.ts",
  plugins: [
    fileAsBlob({
      include: "**/**.DAC"
    })
  ]
});
