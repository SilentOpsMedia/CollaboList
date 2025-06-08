// Mock Firebase Storage
export const getStorage = jest.fn(() => ({
  ref: jest.fn().mockReturnThis(),
  refFromURL: jest.fn().mockReturnThis(),
  uploadBytes: jest.fn(() => Promise.resolve({
    ref: {
      getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/file.jpg')),
    },
    metadata: {
      bucket: 'mock-bucket',
      fullPath: 'mock/path/file.jpg',
      name: 'file.jpg',
      size: 1024,
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString(),
      contentType: 'image/jpeg',
    },
  })),
  uploadString: jest.fn(() => Promise.resolve({
    ref: {
      getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/file.jpg')),
    },
  })),
  getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/file.jpg')),
  deleteObject: jest.fn(() => Promise.resolve()),
  list: jest.fn(() => Promise.resolve({
    items: [],
    prefixes: [],
    nextPageToken: null,
    getNextPage: jest.fn(() => Promise.resolve(null)),
  })),
  listAll: jest.fn(() => Promise.resolve({
    items: [],
    prefixes: [],
  })),
  getMetadata: jest.fn(() => Promise.resolve({
    bucket: 'mock-bucket',
    fullPath: 'mock/path/file.jpg',
    name: 'file.jpg',
    size: 1024,
    timeCreated: new Date().toISOString(),
    updated: new Date().toISOString(),
    contentType: 'image/jpeg',
  })),
  updateMetadata: jest.fn(() => Promise.resolve()),
  useEmulator: jest.fn(),
  connectStorageEmulator: jest.fn(),
}));

// Mock StorageReference
export const ref = jest.fn().mockReturnThis();
export const refFromURL = jest.fn().mockReturnThis();

// Mock UploadTask
export const uploadBytes = jest.fn(() => Promise.resolve({
  ref: {
    getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/file.jpg')),
  },
  snapshot: {
    ref: {
      fullPath: 'mock/path/file.jpg',
      name: 'file.jpg',
    },
    totalBytes: 1024,
    bytesTransferred: 1024,
    state: 'success',
    metadata: {
      bucket: 'mock-bucket',
      fullPath: 'mock/path/file.jpg',
      name: 'file.jpg',
      size: 1024,
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString(),
      contentType: 'image/jpeg',
    },
  },
  task: {
    cancel: jest.fn(),
    catch: jest.fn(),
    on: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    snapshot: {
      bytesTransferred: 1024,
      totalBytes: 1024,
      state: 'success',
    },
    then: jest.fn(),
  },
}));

export const uploadString = jest.fn(() => Promise.resolve({
  ref: {
    getDownloadURL: jest.fn(() => Promise.resolve('https://example.com/file.jpg')),
  },
}));

export const getDownloadURL = jest.fn(() => Promise.resolve('https://example.com/file.jpg'));

export const deleteObject = jest.fn(() => Promise.resolve());

export const list = jest.fn(() => Promise.resolve({
  items: [],
  prefixes: [],
  nextPageToken: null,
  getNextPage: jest.fn(() => Promise.resolve(null)),
}));

export const listAll = jest.fn(() => Promise.resolve({
  items: [],
  prefixes: [],
}));

export const getMetadata = jest.fn(() => Promise.resolve({
  bucket: 'mock-bucket',
  fullPath: 'mock/path/file.jpg',
  name: 'file.jpg',
  size: 1024,
  timeCreated: new Date().toISOString(),
  updated: new Date().toISOString(),
  contentType: 'image/jpeg',
}));

export const updateMetadata = jest.fn(() => Promise.resolve());

export const connectStorageEmulator = jest.fn();

export const useEmulator = jest.fn();

export default {
  getStorage,
  ref,
  refFromURL,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
  list,
  listAll,
  getMetadata,
  updateMetadata,
  connectStorageEmulator,
  useEmulator,
};
