// __mocks__/vm.js

import { clone } from "lodash/fp";
import fs from "fs";

// The actual vm module
// See corresponding in setupJest.js
const vmActual = global.vmActual;
// const defineActual = global.defineActual;

// The mocked vm module
const vm = clone(vmActual);

vm.createContext = function (sandbox, options) {
  // console.log("createContext");
  return vmActual.createContext(sandbox, options);
};

vm.isContext = function (sandbox) {
  // console.log("isContext");
  return vmActual.isContext(sandbox);
};

vm.runInContext = function (code, contextifiedSandbox, options) {
  // console.log("runInContext");
  return vmActual.runInThisContext(code, contextifiedSandbox, options);
};

vm.runInNewContext = function (code, sandboxActual, options) {
  // console.log("runInNewContext");
  const sandbox = clone(sandboxActual);
  sandbox.global = global;
  return vmActual.runInThisContext(code, sandbox, options);
};

vm.runInThisContext = function (code, options) {
  // We clone the current context
  const sandbox = clone(global);
  // We put requireJsVars in the new context
  sandbox.requirejsVars = global.requirejsVars;
  // We run in a new context with the requireJsVars
  // But actually not in this context
  return vmActual.runInNewContext(code, sandbox, options);
  // return vmActual.runInThisContext(code, options);
};

module.exports = vm;
