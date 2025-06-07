/**
 * @file jest.setup.ts
 * @description Jest setup configuration for testing React components
 * 
 * This file contains global test configurations and mocks that are applied
 * before running any tests. It's referenced in the Jest configuration.
 * 
 * @see https://jestjs.io/docs/configuration#setupfilesafterenv-array
 * @see https://testing-library.com/docs/react-testing-library/setup
 */

// Import jest-dom for custom matchers for DOM testing
import '@testing-library/jest-dom';

// Mock window.matchMedia which is not available in JSDOM by default

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
