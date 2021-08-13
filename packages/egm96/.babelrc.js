module.exports = {
  presets: [require("@geospatial/development-babel-preset")],
  env: {
    test: {
      plugins: ["dynamic-import-node"]
    }
  }
};
