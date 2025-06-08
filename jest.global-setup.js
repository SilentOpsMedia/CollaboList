// Global setup for Jest tests
module.exports = async () => {
  // Set environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.REACT_APP_API_URL = 'http://localhost:3001';
  process.env.REACT_APP_FIREBASE_API_KEY = 'test-api-key';
  process.env.REACT_APP_FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
  process.env.REACT_APP_FIREBASE_PROJECT_ID = 'test-project';
  process.env.REACT_APP_FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
  process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID = '123456789';
  process.env.REACT_APP_FIREBASE_APP_ID = '1:123456789:web:abcdef123456';
  process.env.REACT_APP_FIREBASE_MEASUREMENT_ID = 'G-ABCDEF1234';
  
  // Mock Date
  const mockDate = new Date('2023-01-01T00:00:00.000Z');
  global.Date = class extends Date {
    constructor() {
      super();
      return mockDate;
    }
  };
  
  // Mock console methods
  global.console = {
    ...console,
    // Uncomment to debug tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
};
