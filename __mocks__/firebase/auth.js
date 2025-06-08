// Mock Firebase Auth module
const getAuth = jest.fn((app) => ({
  // Mock auth methods
  app: app || { name: '[DEFAULT]' },
  currentUser: null,
  languageCode: null,
  settings: {
    appVerificationDisabledForTesting: false,
  },
  
  // Auth state management
  onAuthStateChanged: jest.fn((callback) => {
    // Store the callback to simulate auth state changes
    authStateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = authStateCallbacks.indexOf(callback);
      if (index > -1) {
        authStateCallbacks.splice(index, 1);
      }
    };
  }),
  
  // Sign in methods
  signInWithEmailAndPassword: jest.fn((email, password) => 
    Promise.resolve({
      user: {
        uid: 'test-uid',
        email,
        emailVerified: true,
        displayName: 'Test User',
        phoneNumber: null,
        photoURL: null,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
        },
        getIdToken: jest.fn(() => Promise.resolve('test-id-token')),
        getIdTokenResult: jest.fn(() => 
          Promise.resolve({
            token: 'test-id-token',
            expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
            authTime: new Date().toISOString(),
            issuedAtTime: new Date().toISOString(),
            signInProvider: 'password',
            claims: {},
          })
        ),
        reload: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      },
      providerId: 'password',
    })
  ),
  
  // Sign up methods
  createUserWithEmailAndPassword: jest.fn((email, password) => 
    Promise.resolve({
      user: {
        uid: 'new-user-uid',
        email,
        emailVerified: false,
        sendEmailVerification: jest.fn(() => Promise.resolve()),
      },
    })
  ),
  
  // Sign out
  signOut: jest.fn(() => Promise.resolve()),
  
  // Password reset
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  confirmPasswordReset: jest.fn(() => Promise.resolve()),
  
  // Email verification
  applyActionCode: jest.fn(() => Promise.resolve()),
  checkActionCode: jest.fn(() => 
    Promise.resolve({
      data: { email: 'test@example.com' },
      operation: 'VERIFY_EMAIL',
    })
  ),
  
  // User management
  updateProfile: jest.fn(() => Promise.resolve()),
  updateEmail: jest.fn(() => Promise.resolve()),
  updatePassword: jest.fn(() => Promise.resolve()),
  sendEmailVerification: jest.fn(() => Promise.resolve()),
  verifyBeforeUpdateEmail: jest.fn(() => Promise.resolve()),
  
  // Social providers
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
  TwitterAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
  OAuthProvider: jest.fn(),
  
  // Sign in with popup/redirect
  signInWithPopup: jest.fn(() => Promise.resolve({
    user: {
      uid: 'social-user-uid',
      email: 'social@example.com',
      displayName: 'Social User',
      emailVerified: true,
    },
  })),
  
  signInWithRedirect: jest.fn(() => Promise.resolve()),
  getRedirectResult: jest.fn(() => Promise.resolve({
    user: {
      uid: 'redirect-user-uid',
      email: 'redirect@example.com',
      displayName: 'Redirect User',
      emailVerified: true,
    },
  })),
  
  // Other methods
  setPersistence: jest.fn(() => Promise.resolve()),
  useDeviceLanguage: jest.fn(),
  useEmulator: jest.fn(),
}));

// Store auth state change callbacks
const authStateCallbacks = [];

// Helper to simulate auth state changes
const simulateAuthStateChange = (user) => {
  authStateCallbacks.forEach(callback => callback(user));
};

const signInWithEmailAndPassword = jest.fn();
const createUserWithEmailAndPassword = jest.fn();
const signOut = jest.fn();
const sendPasswordResetEmail = jest.fn();
const confirmPasswordReset = jest.fn();
const verifyPasswordResetCode = jest.fn();
const applyActionCode = jest.fn();
const checkActionCode = jest.fn();
const updateProfile = jest.fn();
const updateEmail = jest.fn();
const updatePassword = jest.fn();
const EmailAuthProvider = {
  credential: jest.fn(),
};

const GoogleAuthProvider = jest.fn();
const FacebookAuthProvider = jest.fn();
const TwitterAuthProvider = jest.fn();
const GithubAuthProvider = jest.fn();
const OAuthProvider = jest.fn();

const signInWithPopup = jest.fn();
const signInWithRedirect = jest.fn();
const getRedirectResult = jest.fn();

const setPersistence = jest.fn(() => Promise.resolve());

module.exports = {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
  checkActionCode,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  simulateAuthStateChange, // Export the helper for tests
};
