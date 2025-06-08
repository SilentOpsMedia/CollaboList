module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Setup files
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@mocks/(.*)$': '<rootDir>/src/__mocks__/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Transform settings
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
    '!src/react-app-env.d.ts',
    '!src/serviceWorker.ts',
    '!src/serviceWorkerRegistration.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Watch plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset modules between tests
  resetModules: true,
  
  // Reset mocks between tests
  resetMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Test timeout
  testTimeout: 10000,
  
  // Test URL
  testURL: 'http://localhost',
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/.github/',
    '/.vscode/',
  ],
  
  // Module path ignore patterns
  modulePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/.github/',
    '/.vscode/',
  ],
  
  // Watch path ignore patterns
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/.github/',
    '/.vscode/',
  ],
  
  // Coverage path ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
    '/.github/',
    '/.vscode/',
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  
  // Module directories
  moduleDirectories: ['node_modules', 'src'],
  
  // Roots
  roots: ['<rootDir>/src'],
  
  // Test location
  testLocationInResults: true,
  
  // Verbose
  verbose: true,
  
  // Watch
  watch: false,
  
  // Watch all
  watchAll: false,
  
  // Watchman
  watchman: true,
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(@mui|@babel|@emotion|@testing-library|@hookform|react-hook-form|react-markdown|rehype-raw|remark-gfm|react-syntax-highlighter|react-markdown-editor-lite|@uiw)/)',
  ],
  
  // Snapshot serializers
  snapshotSerializers: ['@emotion/jest/serializer'],
  
  // Test results processor
  testResultsProcessor: 'jest-sonar-reporter',
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
      },
    ],
  ],
  
  // Coverage provider
  coverageProvider: 'v8',
  
  // Global setup and teardown
  globalSetup: '<rootDir>/jest.global-setup.js',
  globalTeardown: '<rootDir>/jest.global-teardown.js',
};
