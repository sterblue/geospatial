import { handleExternals } from "../externals";
import { some } from "lodash/fp";

describe("handleExternals", () => {
  const externals = handleExternals({
    dependencies: {
      react: "x.x.x",
      lodash: "x.x.x",
      "react-datepicker": "x.x.x"
    },
    peerDependencies: {
      ol: "x.x.x",
      cesium: "x.x.x"
    },
    devDependencies: {
      proj4: "x.x.x"
    }
  });
  const isExternal = moduleName =>
    some(
      external =>
        external === moduleName ||
        (external instanceof RegExp && external.test(moduleName)),
      externals
    );
  test("it should package source files", () => {
    expect(isExternal("./src/index.ts")).toEqual(false);
  });

  test("it should not package dependencies", () => {
    expect(isExternal("react")).toEqual(true);
  });

  test("it should not package peer dependencies", () => {
    expect(isExternal("ol")).toEqual(true);
  });

  test("it should not package dev dependencies", () => {
    expect(isExternal("proj4")).toEqual(true);
  });

  test("it should not package sub modules", () => {
    expect(isExternal("ol/source")).toEqual(true);
    expect(isExternal("lodash/fp/get")).toEqual(true);
    expect(isExternal("lodash/get")).toEqual(true);
    expect(isExternal("cesium/Source/Cesium")).toEqual(true);
    expect(isExternal("react-datepicker/dist/react-datepicker.css")).toEqual(
      true
    );
  });


  test("it should not package builtin modules", () => {
    expect(isExternal("assert")).toEqual(true);
  });
});
