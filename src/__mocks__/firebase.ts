// Mock Firebase Auth
export const getAuth = jest.fn(() => ({
  currentUser: null,
  onAuthStateChanged: jest.fn((callback) => {
    callback(null);
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithRedirect: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  verifyPasswordResetCode: jest.fn(),
  applyActionCode: jest.fn(),
  checkActionCode: jest.fn(),
  reload: jest.fn(),
  updateProfile: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  onIdTokenChanged: jest.fn(),
  setPersistence: jest.fn(),
  useDeviceLanguage: jest.fn(),
  useEmulator: jest.fn(),
}));

// Mock Firestore
export const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  endBefore: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  runTransaction: jest.fn(),
  batch: jest.fn(),
  enableIndexedDbPersistence: jest.fn(),
  enableMultiTabIndexedDbPersistence: jest.fn(),
  clearIndexedDbPersistence: jest.fn(),
  waitForPendingWrites: jest.fn(),
  onSnapshotsInSync: jest.fn(),
  terminate: jest.fn(),
  useEmulator: jest.fn(),
}));

// Mock Firebase Storage
export const getStorage = jest.fn(() => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
  refFromURL: jest.fn(),
  useEmulator: jest.fn(),
}));

// Mock Firebase App
export const initializeApp = jest.fn(() => ({
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
}));

export const getApp = jest.fn(() => ({
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false,
}));

// Mock other Firebase services
export const GoogleAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));

export const FacebookAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));

export const TwitterAuthProvider = jest.fn(() => ({
  setCustomParameters: jest.fn(),
}));

export const GithubAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
}));

export const OAuthProvider = jest.fn(() => ({
  addScope: jest.fn(),
  setCustomParameters: jest.fn(),
}));

export const EmailAuthProvider = {
  credential: jest.fn(),
  credentialWithLink: jest.fn(),
  PROVIDER_ID: 'password',
};

export const PhoneAuthProvider = jest.fn(() => ({
  verifyPhoneNumber: jest.fn(),
  credential: jest.fn(),
  PROVIDER_ID: 'phone',
}));
