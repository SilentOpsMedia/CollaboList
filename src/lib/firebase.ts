/**
 * @file src/lib/firebase.ts
 * @description Firebase configuration and service initialization
 * 
 * This module handles the initialization and configuration of all Firebase services
 * used in the application. It provides a centralized location for Firebase setup
 * and exports the initialized services for use throughout the application.
 * 
 * ## Services Initialized
 * - Firebase App: Core Firebase functionality
 * - Authentication: User sign-in and management
 * - Firestore: NoSQL database for structured data
 * - Storage: File storage and serving
 * 
 * ## Environment Variables
 * The following environment variables must be set in your `.env` file:
 * - `VITE_FIREBASE_API_KEY`
 * - `VITE_FIREBASE_AUTH_DOMAIN`
 * - `VITE_FIREBASE_PROJECT_ID`
 * - `VITE_FIREBASE_STORAGE_BUCKET`
 * - `VITE_FIREBASE_MESSAGING_SENDER_ID`
 * - `VITE_FIREBASE_APP_ID`
 * 
 * @see https://firebase.google.com/docs/web/setup
 * @see https://firebase.google.com/docs/auth
 * @see https://firebase.google.com/docs/firestore
 * @see https://firebase.google.com/docs/storage
 * 
 * @module lib/firebase
 */

// Core Firebase SDK imports
import { initializeApp } from 'firebase/app';

// Authentication service imports
import { 
  getAuth,              // Firebase Authentication service
  onAuthStateChanged,  // Listener for auth state changes
  GoogleAuthProvider,  // Google authentication provider
  signInWithPopup,     // Popup-based sign-in method
  OAuthProvider,       // Base class for OAuth providers
  AuthProvider,        // Base type for all auth providers
  setPersistence,      // For setting auth state persistence
  browserLocalPersistence, // For local persistence
  signOut as firebaseSignOut // Firebase sign out function
} from 'firebase/auth';

// Firestore database service
import { getFirestore } from 'firebase/firestore';

// Firebase Storage service for file uploads
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/**
 * Firebase configuration object
 * 
 * Contains all the necessary configuration details to connect to your Firebase project.
 * This data is safe to expose in your frontend code as per Firebase's security rules.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBdoHiw_tfm3E78KhG7u3CMax5Ruz4ON9o",          // API key for Firebase services
  authDomain: "collab-checklist-4de23.firebaseapp.com",    // Domain for Firebase Authentication
  projectId: "collab-checklist-4de23",                     // Your Firebase project ID
  storageBucket: "collab-checklist-4de23.firebasestorage.app", // Storage bucket for files
  messagingSenderId: "217387521862",                       // Sender ID for Firebase Cloud Messaging
  appId: "1:217387521862:web:d374f541783d09cafd3747"        // Your Firebase App ID
};

/**
 * Initialize Firebase with the provided configuration
 * 
 * This creates and initializes a Firebase app instance that can be used
 * throughout the application to access Firebase services.
 */
console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);

/**
 * Initialize Firebase Services
 * 
 * These services are initialized once here and exported for use throughout the app.
 * This ensures we're using the same instance of each service everywhere.
 */
const auth = getAuth(app);

// Set persistence to LOCAL to persist auth state across page refreshes
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth state persistence set to LOCAL');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

const db = getFirestore(app);     // Firestore database
const storage = getStorage(app);  // Cloud Storage for files

console.log('Firebase services initialized successfully');

// Log auth state changes
onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user ? 'User signed in' : 'No user signed in');
});

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure Apple provider
appleProvider.addScope('email');
appleProvider.addScope('name');

// Interface for Google Sign-In response
export interface GoogleSignInResult {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  token: string | undefined;
}

/**
 * Sign in with Google using Firebase Authentication
 * @returns Promise that resolves with user info and access token
 */
const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // The signed-in user info
    const user = result.user;
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      token: token
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Function to check if device is iOS or Safari
const isIosOrSafari = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  return isIos || isSafari;
};

// Sign out function that properly clears the auth state
const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Export all necessary Firebase services and utilities
export { 
  auth,              // Firebase Authentication service
  db,                // Firestore database
  storage,           // Firebase Storage
  signInWithGoogle,  // Google sign-in function
  isIosOrSafari,     // Utility function to detect iOS/Safari
  signOut           // Sign out function
};

export default app;