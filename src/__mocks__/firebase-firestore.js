// Mock Firestore
export const getFirestore = jest.fn(() => ({
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  setDoc: jest.fn(() => Promise.resolve()),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn(() => () => {}),
  query: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  startAfter: jest.fn().mockReturnThis(),
  endBefore: jest.fn().mockReturnThis(),
  getDocs: jest.fn(() => Promise.resolve({ 
    docs: [],
    empty: true,
    size: 0,
    forEach: (callback) => {},
    docChanges: () => [],
  })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  runTransaction: jest.fn((transaction) => 
    Promise.resolve(transaction({ get: () => Promise.resolve() }))
  ),
  batch: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  enableIndexedDbPersistence: jest.fn(() => Promise.resolve()),
  enableMultiTabIndexedDbPersistence: jest.fn(() => Promise.resolve()),
  clearIndexedDbPersistence: jest.fn(() => Promise.resolve()),
  waitForPendingWrites: jest.fn(() => Promise.resolve()),
  onSnapshotsInSync: jest.fn(() => () => {}),
  terminate: jest.fn(() => Promise.resolve()),
  useEmulator: jest.fn(),
  connectFirestoreEmulator: jest.fn(),
  getFirestore: jest.fn().mockReturnThis(),
  collectionGroup: jest.fn().mockReturnThis(),
  getCountFromServer: jest.fn(() => Promise.resolve({ data: () => ({ count: 0 }) })),
  writeBatch: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  runTransaction: jest.fn(async (updateFunction) => {
    const transaction = {
      get: jest.fn(() => Promise.resolve({ exists: false })),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    await updateFunction(transaction);
    return Promise.resolve();
  }),
  FieldValue: {
    serverTimestamp: jest.fn(() => ({ _method: 'serverTimestamp' })),
    delete: jest.fn(() => ({ _method: 'delete' })),
    arrayUnion: jest.fn((...elements) => ({
      _method: 'arrayUnion',
      _elements: elements,
    })),
    arrayRemove: jest.fn((...elements) => ({
      _method: 'arrayRemove',
      _elements: elements,
    })),
    increment: jest.fn((n) => ({
      _method: 'increment',
      _operand: n,
    })),
  },
  Timestamp: {
    fromDate: jest.fn((date) => ({
      toDate: () => date,
      toMillis: () => date.getTime(),
      isEqual: (other) => date.getTime() === other.toDate().getTime(),
    })),
    fromMillis: jest.fn((millis) => ({
      toDate: () => new Date(millis),
      toMillis: () => millis,
      isEqual: (other) => millis === other.toMillis(),
    })),
    now: jest.fn(() => ({
      toDate: () => new Date(),
      toMillis: () => Date.now(),
      isEqual: (other) => Date.now() === other.toMillis(),
    })),
  },
  setLogLevel: jest.fn(),
  CACHE_SIZE_UNLIMITED: -1,
}));

// Mock Firestore types
export const collection = jest.fn().mockReturnThis();
export const collectionGroup = jest.fn().mockReturnThis();
export const doc = jest.fn().mockReturnThis();
export const getDoc = jest.fn(() => Promise.resolve({ exists: () => false }));
export const getDocs = jest.fn(() => Promise.resolve({ 
  docs: [],
  empty: true,
  size: 0,
  forEach: (callback) => {},
  docChanges: () => [],
}));
export const setDoc = jest.fn(() => Promise.resolve());
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const query = jest.fn().mockReturnThis();
export const where = jest.fn().mockReturnThis();
export const orderBy = jest.fn().mockReturnThis();
export const limit = jest.fn().mockReturnThis();
export const startAfter = jest.fn().mockReturnThis();
export const endBefore = jest.fn().mockReturnThis();
export const startAt = jest.fn().mockReturnThis();
export const endAt = jest.fn().mockReturnThis();
export const limitToLast = jest.fn().mockReturnThis();

export const addDoc = jest.fn(() => Promise.resolve({ id: 'mock-doc-id' }));

export const arrayUnion = jest.fn((...elements) => ({
  _method: 'arrayUnion',
  _elements: elements,
}));

export const arrayRemove = jest.fn((...elements) => ({
  _method: 'arrayRemove',
  _elements: elements,
}));

export const increment = jest.fn((n) => ({
  _method: 'increment',
  _operand: n,
}));

export const serverTimestamp = jest.fn(() => ({
  _method: 'serverTimestamp',
}));

export const deleteField = jest.fn(() => ({
  _method: 'delete',
}));

export const documentId = jest.fn().mockReturnThis();

export const getCountFromServer = jest.fn(() => 
  Promise.resolve({ data: () => ({ count: 0 }) })
);

export const writeBatch = jest.fn(() => ({
  set: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  commit: jest.fn(() => Promise.resolve()),
}));

export const runTransaction = jest.fn(async (db, updateFunction) => {
  const transaction = {
    get: jest.fn(() => Promise.resolve({ exists: () => false })),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  await updateFunction(transaction);
  return Promise.resolve();
});

export const Timestamp = {
  fromDate: jest.fn((date) => ({
    toDate: () => date,
    toMillis: () => date.getTime(),
    isEqual: (other) => date.getTime() === other.toDate().getTime(),
  })),
  fromMillis: jest.fn((millis) => ({
    toDate: () => new Date(millis),
    toMillis: () => millis,
    isEqual: (other) => millis === other.toMillis(),
  })),
  now: jest.fn(() => ({
    toDate: () => new Date(),
    toMillis: () => Date.now(),
    isEqual: (other) => Date.now() === other.toMillis(),
  })),
};

export const FieldValue = {
  serverTimestamp,
  delete: deleteField,
  arrayUnion,
  arrayRemove,
  increment,
};

export const setLogLevel = jest.fn();

export const CACHE_SIZE_UNLIMITED = -1;

export default {
  getFirestore,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  startAt,
  endAt,
  limitToLast,
  addDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  deleteField,
  documentId,
  getCountFromServer,
  writeBatch,
  runTransaction,
  Timestamp,
  FieldValue,
  setLogLevel,
  CACHE_SIZE_UNLIMITED,
};
