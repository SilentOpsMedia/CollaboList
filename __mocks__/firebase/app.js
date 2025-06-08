// Mock Firebase App module
const initializeApp = jest.fn(() => ({
  // Mock app methods
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
  delete: jest.fn(() => Promise.resolve()),
}));

const getApp = jest.fn(() => ({
  // Return a mock app instance
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
  delete: jest.fn(() => Promise.resolve()),
}));

const getApps = jest.fn(() => [
  // Return an array with a mock app
  {
    name: '[DEFAULT]',
    options: {},
    automaticDataCollectionEnabled: false,
    delete: jest.fn(() => Promise.resolve()),
  },
]);

const deleteApp = jest.fn(() => Promise.resolve());

module.exports = {
  initializeApp,
  getApp,
  getApps,
  deleteApp,
};
