const path = require("path");
const { lstatSync, readdirSync } = require("fs");
const esbuild = require("esbuild");

// Get listing of packages in mono repo
const basePath = path.resolve(__dirname, "../packages");
const packages = readdirSync(basePath).filter((name) =>
    lstatSync(path.join(basePath, name)).isDirectory()
);

// Compile packages
packages.forEach((package) => esbuild.build({
    entryPoints: [path.join(basePath, package, "src/index.ts")],
    target: "es2020",
    bundle: true,
    platform: "neutral",
    format: "esm",
    outfile: path.join(basePath, package, "lib/index.js"),
}).catch(() => process.exit(1)))

