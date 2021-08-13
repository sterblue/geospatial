require("@babel/polyfill");
// import "raf/polyfill";
// import expect from "expect";
// import { toMatchImageSnapshot } from "jest-image-snapshot";
//
// expect.extend({ toMatchImageSnapshot });

// // cf https://www.npmjs.com/package/node-requirejs-define
// const define = require("node-requirejs-define");
// global.define = define;
// define.config({
//   baseUrl: __dirname,
//   paths: {
//     cesium: "node_modules/cesium/Source/Cesium.js"
//   }
// });

// See corresponding in src/connectors/3DTiles/instanced3DModel/__mocks__/vm.js
global.vmActual = require("vm");
// global.defineActual = require("node-requirejs-define");
