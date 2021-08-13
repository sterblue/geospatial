module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": { isolatedModules: true, diagnostics: false }
  },
  testEnvironment: "node",
  collectCoverage: true,
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["/lib/"],

  setupFiles: ["./setupJest.js"],
  coverageReporters: ["json", "lcov"]
};
