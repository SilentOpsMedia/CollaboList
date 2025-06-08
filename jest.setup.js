// Setup file for Jest tests
import '@testing-library/jest-dom';

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

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock Date
const mockDate = new Date('2023-01-01T00:00:00.000Z');
const RealDate = Date;

global.Date = class extends RealDate {
  constructor() {
    super();
    return mockDate;
  }
  static now() {
    return mockDate.getTime();
  }
} as DateConstructor;

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'node.js',
    clipboard: {
      writeText: jest.fn(),
      readText: jest.fn(),
    },
  },
});

// Mock document.createRange
if (!global.document.createRange) {
  document.createRange = () => ({
    setStart: jest.fn(),
    setEnd: jest.fn(),
    // @ts-ignore
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });
}

// Mock IntersectionObserver
class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor() {}
  
  disconnect() {
    return null;
  }
  
  observe() {
    return null;
  }
  
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  
  unobserve() {
    return null;
  }
}

window.IntersectionObserver = IntersectionObserver;

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock console.error to fail tests on prop-type errors
const originalConsoleError = console.error;
console.error = (message, ...args) => {
  if (/(Failed prop type|Error:)/.test(message)) {
    throw new Error(`Prop type error: ${message}`);
  }
  originalConsoleError(message, ...args);
};

// Mock console.warn to fail tests on warnings
const originalConsoleWarn = console.warn;
console.warn = (message, ...args) => {
  if (/(deprecated|deprecation)/i.test(message)) {
    throw new Error(`Warning: ${message}`);
  }
  originalConsoleWarn(message, ...args);
};
