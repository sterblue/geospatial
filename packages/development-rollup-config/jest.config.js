module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  testMatch: ["<rootDir>/src/**/__tests__/**/*.{ts,tsx}"],
  testPathIgnorePatterns: ["/lib/"]
};
