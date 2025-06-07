/**
 * @file jest.config.ts
 * @description Jest configuration for testing React components with TypeScript
 * 
 * This file configures Jest to work with TypeScript, React, and other tools
 * in the project. It sets up the test environment, coverage settings, and
 * module resolution.
 * 
 * @see https://jestjs.io/docs/configuration
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
 */

import type { Config } from '@jest/types';

/**
 * Jest configuration object
 * 
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
