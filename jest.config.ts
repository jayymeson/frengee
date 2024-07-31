import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/__tests__/.*\\.test\\.temp\\.ts$"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  detectOpenHandles: true,
  forceExit: true,
  verbose: true,
  testTimeout: 30000, // Aumente o timeout global dos testes
};

export default config;
