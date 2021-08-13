const fs = require("fs");
const path = require("path");

const data = fs.readFileSync(path.join(__dirname, "../src/WW15MGH.DAC"));

const encodedData =
  "data:application/octet-stream; charset=binary;base64," +
  data.toString("latin1");

module.exports = { default: encodedData };
