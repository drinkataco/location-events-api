import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/src/__utils__/setEnvVars.ts'],
  globalSetup: '<rootDir>/src/__utils__/globalSetup.ts',
  globalTeardown: '<rootDir>/src/__utils__/globalTeardown.ts',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/?(*.)spec.ts', '<rootDir>/src/**/?(*.)spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', 'src/**/*.ts', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['src/index.ts', 'src/generated/*.ts'],
};

export default config;
