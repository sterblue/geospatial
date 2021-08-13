import commonjs from "@rollup/plugin-commonjs";
import resolve from "rollup-plugin-pnp-resolve";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
// import pkg from "./package.json";
// import fp from "lodash/fp";
// import lodash from "lodash";
import builtins from "rollup-plugin-node-builtins";
// import globals from "rollup-plugin-node-globals";
// import shim from "rollup-plugin-shim";
import visualizer from "rollup-plugin-visualizer";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const config = {
  //input: "./src/thread.ts",
  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],
  plugins: [
    json({
      // // All JSON files will be parsed by default,
      // // but you can also specifically include/exclude files
      // include: 'node_modules/**',
      // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: "  ",

      // ignores indent and generates the smallest code
      compact: true, // Default: false

      // generate a named export for every property of the JSON object
      namedExports: true // Default: true
    }),
    // Allow to import builtins
    builtins(),
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
    // globals(),
    // builtins({ fs: false, crypto: false })
  ],
  output: [
    {
      dir: "lib",
      entryFileNames: "[name].app.esm.js",
      chunkFileNames: "[name]-[hash].app.esm.js",
      format: "es"
    }
  ]
};

export default [
  {
    ...config,
    input: "./src/index.ts",
    plugins: [
      visualizer({ filename: "stats-index.html", template: "treemap" }),
      ...config.plugins
    ]
  }
];
