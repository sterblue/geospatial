module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": { isolatedModules: true, diagnostics: false }
  },
  testEnvironment: "jsdom",
  collectCoverage: true,
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["/lib/"],

  moduleNameMapper: {
    "\\.(DAC)$": "<rootDir>/jest/dataMock.js"
  }
};
