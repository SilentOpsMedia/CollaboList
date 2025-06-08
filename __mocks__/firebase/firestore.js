// Mock Firestore module

// Mock data store
const mockFirestore = {};

// Helper function to get or create a collection reference
const getOrCreateCollection = (collectionPath) => {
  const pathParts = collectionPath.split('/');
  let current = mockFirestore;
  
  for (let i = 0; i < pathParts.length; i += 2) {
    const collectionName = pathParts[i];
    if (!current[collectionName]) {
      current[collectionName] = { __type: 'collection', docs: {} };
    }
    current = current[collectionName];
    
    // If there's a document ID, move into it
    if (i + 1 < pathParts.length) {
      const docId = pathParts[i + 1];
      if (!current.docs[docId]) {
        current.docs[docId] = { __type: 'document', data: {}, collections: {} };
      }
      current = current.docs[docId];
    }
  }
  
  return current;
};

// Mock collection function
const collection = jest.fn((db, path) => {
  const parts = path.split('/');
  const collectionName = parts[parts.length - 1];
  return {
    id: collectionName,
    path,
    parent: parts.length > 1 ? doc(db, parts.slice(0, -1).join('/')) : null,
    type: 'collection',
  };
});

// Mock doc function
const doc = jest.fn((db, path, ...pathSegments) => {
  const fullPath = pathSegments.length ? `${path}/${pathSegments.join('/')}` : path;
  const parts = fullPath.split('/');
  const id = parts[parts.length - 1];
  return {
    id,
    path: fullPath,
    parent: collection(db, parts.slice(0, -1).join('/')),
    type: 'document',
  };
});

// Mock getDoc
const getDoc = jest.fn((docRef) => {
  const parts = docRef.path.split('/');
  const collectionName = parts[parts.length - 2];
  const docId = parts[parts.length - 1];
  
  const collectionData = getOrCreateCollection(parts.slice(0, -1).join('/'));
  const docData = collectionData.docs[docId]?.data || null;
  
  return Promise.resolve({
    exists: () => !!docData,
    data: () => ({ ...docData }),
    id: docId,
    ref: docRef,
  });
});

// Mock setDoc
const setDoc = jest.fn((docRef, data, options) => {
  const parts = docRef.path.split('/');
  const collectionPath = parts.slice(0, -1).join('/');
  const docId = parts[parts.length - 1];
  
  const collectionData = getOrCreateCollection(collectionPath);
  collectionData.docs[docId] = {
    __type: 'document',
    data: { ...data },
    collections: collectionData.docs[docId]?.collections || {},
  };
  
  return Promise.resolve();
});

// Mock updateDoc
const updateDoc = jest.fn((docRef, data) => {
  const parts = docRef.path.split('/');
  const collectionPath = parts.slice(0, -1).join('/');
  const docId = parts[parts.length - 1];
  
  const collectionData = getOrCreateCollection(collectionPath);
  if (!collectionData.docs[docId]) {
    collectionData.docs[docId] = {
      __type: 'document',
      data: {},
      collections: {},
    };
  }
  
  // Update the document data
  collectionData.docs[docId].data = {
    ...collectionData.docs[docId].data,
    ...data,
  };
  
  return Promise.resolve();
});

// Mock deleteDoc
const deleteDoc = jest.fn((docRef) => {
  const parts = docRef.path.split('/');
  const collectionPath = parts.slice(0, -1).join('/');
  const docId = parts[parts.length - 1];
  
  const collectionData = getOrCreateCollection(collectionPath);
  if (collectionData.docs[docId]) {
    delete collectionData.docs[docId];
  }
  
  return Promise.resolve();
});

// Mock getDocs
const getDocs = jest.fn((query) => {
  // For simplicity, return all documents in the collection
  const collectionRef = query._query.collection;
  const collectionData = getOrCreateCollection(collectionRef.path);
  
  const docs = Object.entries(collectionData.docs).map(([id, docData]) => ({
    id,
    data: () => ({ ...docData.data }),
    ref: doc(collectionRef.firestore, `${collectionRef.path}/${id}`),
  }));
  
  return Promise.resolve({
    docs,
    empty: docs.length === 0,
    size: docs.length,
    forEach: (callback) => docs.forEach(callback),
  });
});

// Mock addDoc
const addDoc = jest.fn((collectionRef, data) => {
  const docId = `mock-doc-${Date.now()}`;
  const docRef = doc(collectionRef.firestore, `${collectionRef.path}/${docId}`);
  
  return setDoc(docRef, data).then(() => ({
    id: docId,
    ...docRef,
  }));
});

// Mock query functions
const query = jest.fn((collectionRef, ...queryConstraints) => {
  // For simplicity, just return the collection ref with query constraints
  return {
    _query: {
      collection: collectionRef,
      constraints: queryConstraints,
    },
    withConverter: () => ({}),
  };
});

const where = jest.fn((fieldPath, opStr, value) => ({
  type: 'where',
  fieldPath,
  opStr,
  value,
}));

const orderBy = jest.fn((fieldPath, directionStr = 'asc') => ({
  type: 'orderBy',
  fieldPath,
  direction: directionStr,
}));

const limit = jest.fn((limitCount) => ({
  type: 'limit',
  limit: limitCount,
}));

const startAfter = jest.fn((...fieldValues) => ({
  type: 'startAfter',
  fieldValues,
}));

const endBefore = jest.fn((...fieldValues) => ({
  type: 'endBefore',
  fieldValues,
}));

const limitToLast = jest.fn((limitCount) => ({
  type: 'limitToLast',
  limit: limitCount,
}));

// Mock batch operations
const writeBatch = jest.fn(() => {
  const batch = {
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  };
  return batch;
});

// Mock transaction
const runTransaction = jest.fn(async (db, updateFunction) => {
  const transaction = {
    get: jest.fn((docRef) => getDoc(docRef)),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  
  try {
    const result = await updateFunction(transaction);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
});

// Mock getCountFromServer
const getCountFromServer = jest.fn((query) => {
  return Promise.resolve({
    data: () => ({
      count: 0, // Mock count, can be customized in tests
    }),
  });
});

// Mock onSnapshot
const onSnapshot = jest.fn((queryOrDoc, onNext, onError, onCompletion) => {
  // For simplicity, immediately call onNext with an empty result
  // In a real test, you might want to simulate document changes
  const unsubscribe = () => {};
  
  if (typeof queryOrDoc.collection === 'function') {
    // It's a document reference
    getDoc(queryOrDoc).then(snapshot => {
      onNext(snapshot);
    }).catch(onError);
  } else {
    // It's a query
    getDocs(queryOrDoc).then(snapshot => {
      onNext(snapshot);
    }).catch(onError);
  }
  
  return unsubscribe;
});

const getFirestore = jest.fn(() => ({
  // Mock Firestore instance methods
  collection,
  doc,
  collectionGroup: jest.fn(),
  batch: writeBatch,
  runTransaction: (updateFunction) => runTransaction(null, updateFunction),
  settings: jest.fn(),
  useEmulator: jest.fn(),
  enableIndexedDbPersistence: jest.fn(() => Promise.resolve()),
  enableMultiTabIndexedDbPersistence: jest.fn(() => Promise.resolve()),
  clearPersistence: jest.fn(() => Promise.resolve()),
  terminate: jest.fn(() => Promise.resolve()),
  waitForPendingWrites: jest.fn(() => Promise.resolve()),
  onSnapshotsInSync: jest.fn(() => () => {}),
}));

module.exports = {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  getCountFromServer,
  writeBatch,
  runTransaction,
  onSnapshot,
};
