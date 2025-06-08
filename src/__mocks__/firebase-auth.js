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
  GoogleAuthProvider: {
    credential: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  },
  FacebookAuthProvider: {
    credential: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  },
  TwitterAuthProvider: {
    credential: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  },
  GithubAuthProvider: {
    credential: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  },
  OAuthProvider: {
    credential: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
  },
  EmailAuthProvider: {
    credential: jest.fn(),
    credentialWithLink: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
    PROVIDER_ID: 'password',
  },
  PhoneAuthProvider: {
    credential: jest.fn(),
    credentialFromResult: jest.fn(),
    credentialFromError: jest.fn(),
    PROVIDER_ID: 'phone',
  },
  RecaptchaVerifier: jest.fn(),
  PhoneMultiFactorGenerator: {
    assertion: jest.fn(),
    FACTOR_ID: 'phone',
  },
  inMemoryPersistence: jest.fn(),
  browserLocalPersistence: jest.fn(),
  browserSessionPersistence: jest.fn(),
  indexedDBLocalPersistence: jest.fn(),
  connectAuthEmulator: jest.fn(),
  debugErrorMap: {},
  getAdditionalUserInfo: jest.fn(),
  getMultiFactorResolver: jest.fn(),
  getRedirectResult: jest.fn(),
  isSignInWithEmailLink: jest.fn(),
  linkWithCredential: jest.fn(),
  linkWithPhoneNumber: jest.fn(),
  linkWithPopup: jest.fn(),
  linkWithRedirect: jest.fn(),
  multiFactor: jest.fn(),
  onAuthStateChanged: jest.fn(),
  parseActionCodeURL: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  reauthenticateWithPhoneNumber: jest.fn(),
  reauthenticateWithPopup: jest.fn(),
  reauthenticateWithRedirect: jest.fn(),
  signInAnonymously: jest.fn(),
  signInWithCredential: jest.fn(),
  signInWithCustomToken: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithEmailLink: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
  signInWithPopup: jest.fn(),
  signInWithRedirect: jest.fn(),
  unlink: jest.fn(),
  updateCurrentUser: jest.fn(),
  updateProfile: jest.fn(),
  verifyBeforeUpdateEmail: jest.fn(),
  verifyPasswordResetCode: jest.fn(),
}));

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

export const RecaptchaVerifier = jest.fn();

export const PhoneMultiFactorGenerator = {
  assertion: jest.fn(),
  FACTOR_ID: 'phone',
};

export const inMemoryPersistence = jest.fn();
export const browserLocalPersistence = jest.fn();
export const browserSessionPersistence = jest.fn();
export const indexedDBLocalPersistence = jest.fn();
export const connectAuthEmulator = jest.fn();

export const debugErrorMap = {};

export const getAdditionalUserInfo = jest.fn();
export const getMultiFactorResolver = jest.fn();
export const getRedirectResult = jest.fn();
export const isSignInWithEmailLink = jest.fn();
export const linkWithCredential = jest.fn();
export const linkWithPhoneNumber = jest.fn();
export const linkWithPopup = jest.fn();
export const linkWithRedirect = jest.fn();
export const multiFactor = jest.fn();
export const onAuthStateChanged = jest.fn();
export const parseActionCodeURL = jest.fn();
export const reauthenticateWithCredential = jest.fn();
export const reauthenticateWithPhoneNumber = jest.fn();
export const reauthenticateWithPopup = jest.fn();
export const reauthenticateWithRedirect = jest.fn();
export const signInAnonymously = jest.fn();
export const signInWithCredential = jest.fn();
export const signInWithCustomToken = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signInWithEmailLink = jest.fn();
export const signInWithPhoneNumber = jest.fn();
export const signInWithPopup = jest.fn();
export const signInWithRedirect = jest.fn();
export const unlink = jest.fn();
export const updateCurrentUser = jest.fn();
export const updateProfile = jest.fn();
export const verifyBeforeUpdateEmail = jest.fn();
export const verifyPasswordResetCode = jest.fn();

export default {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  EmailAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  PhoneMultiFactorGenerator,
  inMemoryPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  indexedDBLocalPersistence,
  connectAuthEmulator,
  debugErrorMap,
  getAdditionalUserInfo,
  getMultiFactorResolver,
  getRedirectResult,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  linkWithRedirect,
  multiFactor,
  onAuthStateChanged,
  parseActionCodeURL,
  reauthenticateWithCredential,
  reauthenticateWithPhoneNumber,
  reauthenticateWithPopup,
  reauthenticateWithRedirect,
  signInAnonymously,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  unlink,
  updateCurrentUser,
  updateProfile,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode,
};
