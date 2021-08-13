import fp from "lodash/fp";
import builtins from "builtin-modules";

export function handleExternals(pkg) {
  const allDependencies = fp.uniq([
    ...Object.keys(pkg.dependencies || {}),
    // Do not package dev dependencies
    ...Object.keys(pkg.devDependencies || {}),
    // Do not package peer dependencies
    ...Object.keys(pkg.peerDependencies || {})
  ]);
  return [
    ...builtins,
    ...fp.map(dependency => RegExp(`^${dependency}(/.*)*`), allDependencies)
  ];
}
