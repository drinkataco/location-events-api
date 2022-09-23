import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/src/__utils__/setEnvVars.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/?(*.)spec.ts', '<rootDir>/src/**/?(*.)spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
