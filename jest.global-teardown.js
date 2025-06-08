// Global teardown for Jest tests
module.exports = async () => {
  // Clean up any global mocks or test state here
  
  // Reset all mocks
  jest.clearAllMocks();
  
  // Clear any test data from localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  
  // Clear any test data from sessionStorage
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.clear();
  }
  
  // Clear any test data from indexedDB
  if (typeof window !== 'undefined' && window.indexedDB) {
    try {
      const dbs = await window.indexedDB.databases();
      await Promise.all(
        dbs.map(db => 
          new Promise((resolve, reject) => {
            const request = window.indexedDB.deleteDatabase(db.name);
            request.onsuccess = resolve;
            request.onerror = reject;
          })
        )
      );
    } catch (error) {
      console.error('Error cleaning up indexedDB:', error);
    }
  }
  
  // Clear any test cookies
  if (typeof document !== 'undefined') {
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  }
  
  // Reset any global state
  if (typeof global.gc === 'function') {
    global.gc();
  }
  
  // Force garbage collection in Node.js
  if (global.gc) {
    global.gc();
  }
  
  // Reset any timers
  if (typeof jest !== 'undefined') {
    jest.useRealTimers();
  }
  
  // Reset any fetch mocks
  if (typeof global.fetch !== 'undefined') {
    global.fetch.mockClear();
  }
  
  // Reset any localStorage mocks
  if (typeof localStorage !== 'undefined' && localStorage.clear) {
    localStorage.clear();
  }
  
  // Reset any sessionStorage mocks
  if (typeof sessionStorage !== 'undefined' && sessionStorage.clear) {
    sessionStorage.clear();
  }
  
  // Reset any other global state
  if (typeof global.console !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('Global teardown complete');
  }
};
