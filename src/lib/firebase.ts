// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdoHiw_tfm3E78KhG7u3CMax5Ruz4ON9o",
  authDomain: "collab-checklist-4de23.firebaseapp.com",
  projectId: "collab-checklist-4de23",
  storageBucket: "collab-checklist-4de23.firebasestorage.app",
  messagingSenderId: "217387521862",
  appId: "1:217387521862:web:d374f541783d09cafd3747"
};

// Initialize Firebase
console.log('Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log('Firebase services initialized successfully');

// Log auth state changes
onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user ? 'User signed in' : 'No user signed in');
  console.log('Current user:', user);
});

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

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

// Function to sign in with Google
export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const { uid, email, displayName, photoURL } = result.user;
    
    return { 
      user: { uid, email, displayName, photoURL },
      token 
    };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export { auth, db, storage, googleProvider };
export default app;