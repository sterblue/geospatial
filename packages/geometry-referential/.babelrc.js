module.exports = {
  presets: [
    [
      require("@geospatial/development-babel-preset"),
      {
        targets: {
          node: "current"
        }
      }
    ]
  ]
  // // Might be needed:
  // plugins: ["dynamic-import-node"],
  // // Or maybe that:
  // env: {
  //   test: {
  //     plugins: ["dynamic-import-node"]
  //   }
  // }
};
