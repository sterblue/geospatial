const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const fp = require("lodash/fp");

function drawAxes(size, canvas) {
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.moveTo(0, size.height / 2);
  ctx.lineTo(size.width, size.height / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(size.width / 2, 0);
  ctx.lineTo(size.width / 2, size.height);
  ctx.stroke();
  return canvas;
}

function drawPoint(point, size, canvas) {
  const ctx = canvas.getContext("2d");
  const text = fp.getOr("X", "name", point);
  const fontSize = 30;
  ctx.font = `${fontSize}px Impact`;
  ctx.fillStyle = fp.getOr("#000000", "color", point);
  const textBox = ctx.measureText(text);
  ctx.fillText(
    text,
    (size.width * (1 + point.x)) / 2 - textBox.width / 2,
    (size.height * (1 - point.y)) / 2 + (fontSize * 0.7) / 2
  );
  return canvas;
}

function drawPoints(points, size, canvas) {
  return fp.map(point => drawPoint(point, size, canvas), points);
}

function writeCanvas(canvas) {
  const fileName = __dirname + "/out.png";
  console.log(`Writing PNG file at ${fileName}`);
  const out = fs.createWriteStream(fileName);
  const stream = canvas.pngStream();
  stream.pipe(out);
  out.on("finish", function () {
    console.log(`The PNG file was created at ${fileName}`);
  });
}

export function draw2DPoints(
  points = [
    { x: -1, y: -1, name: "(-1,-1)", color: "#880000" },
    { x: -1, y: 1, name: "(-1,1)", color: "#880088" },
    { x: 1, y: -1, name: "(1,-1)", color: "#888800" },
    { x: 1, y: 1, name: "(1,1)", color: "#888888" },
    { x: 0.5, y: 0.5, name: "1", color: "#008800" },
    { x: 0, y: 0, name: "X", color: "#FF0000" }
  ]
) {
  const size = { width: 800, height: 800 };
  const canvas = createCanvas(size.width, size.height);
  drawAxes(size, canvas);
  drawPoints(points, size, canvas);
  writeCanvas(canvas);
}
