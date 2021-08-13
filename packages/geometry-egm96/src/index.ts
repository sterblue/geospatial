// global.Buffer = global.Buffer || require("buffer").Buffer;

if (typeof btoa === "undefined") {
  global.btoa = function (str) {
    return Buffer.from(str, "latin1").toString("base64");
  };
}

if (typeof atob === "undefined") {
  global.atob = function (b64Encoded) {
    return Buffer.from(b64Encoded, "base64").toString("latin1");
  };
}

function toDegree(radians) {
  return radians * (180 / Math.PI);
}

function fromDegree(degrees) {
  return degrees * (Math.PI / 180);
}

function getPostOffset(data, row, col) {
  const k = row * NUM_COLS + col;

  if (k >= data.length * 2) {
    throw new RangeError("Offset exceeds height measurements");
  }

  return data.readInt16BE(k * 2);
}

const INTERVAL = fromDegree(15 / 60),
  INTERVAL_DEGREE = toDegree(INTERVAL),
  NUM_ROWS = 721,
  NUM_COLS = 1440;

// http://cddis.gsfc.nasa.gov/926/egm96/egm96.html
export async function getEgm96Offset(latitude, longitude) {
  let dataBlob = await import("./WW15MGH.DAC");
  while (dataBlob.default) {
    dataBlob = dataBlob.default;
  }

  const data = Buffer.from(
    dataBlob.slice(
      "data:application/octet-stream; charset=binary;base64,".length
    ),
    "latin1"
  );

  const longitudeWrapped = longitude >= 0 ? longitude : longitude + 360;

  let topRow = Math.round((90 - latitude) / INTERVAL_DEGREE);
  if (latitude <= -90) {
    topRow = NUM_ROWS - 2;
  }
  const bottomRow = topRow + 1;

  let leftCol = Math.round(longitudeWrapped / INTERVAL_DEGREE);
  let rightCol = leftCol + 1;

  if (longitudeWrapped >= 360 - INTERVAL_DEGREE) {
    leftCol = NUM_COLS - 1;
    rightCol = 0;
  }

  const latTop = 90 - topRow * INTERVAL_DEGREE;
  const lonLeft = leftCol * INTERVAL_DEGREE;

  const ul = getPostOffset(data, topRow, leftCol);
  const ll = getPostOffset(data, bottomRow, leftCol);
  const lr = getPostOffset(data, bottomRow, rightCol);
  const ur = getPostOffset(data, topRow, rightCol);

  const u = (longitudeWrapped - lonLeft) / INTERVAL_DEGREE;
  const v = (latTop - latitude) / INTERVAL_DEGREE;

  const pll = (1.0 - u) * (1.0 - v);
  const plr = (1.0 - u) * v;
  const pur = u * v;
  const pul = u * (1.0 - v);

  const offset = pll * ll + plr * lr + pur * ur + pul * ul;

  return offset / 100;
}
