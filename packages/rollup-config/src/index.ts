import commonjs from "@rollup/plugin-commonjs";
import resolve from "rollup-plugin-pnp-resolve";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import postcss from "rollup-plugin-postcss";
import lodash from "lodash";
import fp from "lodash/fp";

import { handleExternals } from "./externals";

function customizer(objValue, srcValue) {
  if (fp.isArray(objValue)) {
    // return objValue.concat(srcValue);
    return srcValue;
  }
}

export const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default function config(pkg, overrides) {
  const baseConfig = {
    input: "./src/index.ts",
    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: handleExternals(pkg),
    plugins: [
      // Allows node resolution
      nodeResolve({ extensions, mainFields: ["module"] }),
      // Allows pnp resolution
      resolve({ extensions }),
      // Compile TypeScript/JavaScript files
      babel({ extensions }),
      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs({
        extensions
      }),
      // Parse json files when needed
      json(),
      // Deal with css
      postcss({
        extract: false,
        inject: true
      }),
      // Import images and returns their path or data url
      image()
    ],
    output: [
      {
        dir: "lib",
        entryFileNames: "[name].cjs.js",
        chunkFileNames: "[name]-[hash].cjs.js",
        format: "cjs",
        globals: {
          cesium: "Cesium",
          "@babel/runtime": "7.6.3"
        }
      },
      {
        dir: "lib",
        entryFileNames: "[name].esm.js",
        chunkFileNames: "[name]-[hash].esm.js",
        format: "es",
        globals: {
          cesium: "Cesium",
          "@babel/runtime": "7.6.3"
        }
      }
    ]
  };
  return fp.mergeWith(customizer, baseConfig, overrides);
}
