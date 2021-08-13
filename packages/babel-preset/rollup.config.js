import commonjs from "@rollup/plugin-commonjs";
import resolve from "rollup-plugin-pnp-resolve";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import builtins from "builtin-modules";
import lodash from "lodash";
import fp from "lodash/fp";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "./src/index.ts",
  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external

  external: [
    // Do not package dependencies
    ...Object.keys(pkg.dependencies || {}),
    // Do not package peer dependencies
    ...Object.keys(pkg.peerDependencies || {}),
    // Do not package lodash sub modules
    ...Object.keys(lodash).map(name => `lodash/${name}`),
    // Do not package lodash fp sub modules
    ...Object.keys(fp).map(name => `lodash/fp/${name}`),
    "lodash/fp",
    // Do not package built in modules
    ...builtins,
    "cesium/Source/Cesium"
  ],
  plugins: [
    // Allows node resolution
    nodeResolve({ extensions }),
    // Allows pnp resolution
    resolve({ extensions }),
    // Compile TypeScript/JavaScript files
    babel({ extensions }),
    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      extensions
    })
  ],
  output: [
    {
      dir: "lib",
      entryFileNames: "[name].cjs.js",
      chunkFileNames: "[name]-[hash].cjs.js",
      format: "cjs",
      exports: "named",
      globals: {
        cesium: "Cesium"
      }
    },
    {
      dir: "lib",
      entryFileNames: "[name].esm.js",
      chunkFileNames: "[name]-[hash].esm.js",
      format: "es",
      exports: "named",
      globals: {
        cesium: "Cesium"
      }
    }
  ]
};
