const { getEgm96Offset } = require("./lib/index.cjs");

getEgm96Offset(45, 0)
  .then(result => {
    console.log(result);
    console.log("should be 47.29");
  })
  .catch(error => {
    console.error(error);
  });
