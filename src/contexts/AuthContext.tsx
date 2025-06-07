import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword as firebaseCreateUser, 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseSignOut,
  AuthError
} from 'firebase/auth';
import { auth, signInWithGoogle, GoogleSignInResult } from '../lib/firebase';
import { userServices } from '../services/userServices';

interface AuthErrorWithCode extends Error {
  code?: string;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: { code: string; message: string } | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log('Auth state changed:', user ? 'User signed in' : 'No user');
          setUser(user);
          setLoading(false);
          setError(null);
          setIsInitialized(true);
        },
        (error) => {
          console.error('Auth state error:', error);
          const authError = error as AuthError;
          setError({
            code: authError.code || 'auth/error',
            message: authError.message || 'An unknown error occurred'
          });
          setLoading(false);
          setIsInitialized(true);
        }
      );

      // Cleanup subscription on unmount
      return () => {
        console.log('Cleaning up auth state listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up auth state listener:', err);
      setError({
        code: 'auth/initialization-error',
        message: 'Failed to initialize authentication'
      });
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('Attempting to sign up with:', email);
    try {
      setError(null);
      console.log('Creating user with email/password');
      const userCredential = await firebaseCreateUser(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);
      
      if (user) {
        console.log('Creating user document in Firestore');
        await userServices.createUser({
          id: user.uid,
          email: user.email || '',
          displayName: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log('User document created');
      }
    } catch (err: any) {
      console.error('Error during sign up:', err);
      const errorMessage = err.message || 'Failed to create an account';
      setError({
        code: err.code || 'auth/error',
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await firebaseSignIn(auth, email, password);
    } catch (err: any) {
      setError({
        code: err.code,
        message: err.message,
      });
      throw err;
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      
      if (result?.user) {
        const { user } = result;
        // Check if user exists in Firestore, if not create a new user document
        await userServices.getUser(user.uid).catch(async () => {
          const userData = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            ...(user.photoURL && { photoURL: user.photoURL }),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await userServices.createUser(userData);
        });
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError({
        code: err.code || 'auth/google-signin-error',
        message: err.message || 'Failed to sign in with Google',
      });
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError({
        code: err.code,
        message: err.message,
      });
      throw err;
    }
  };

  const value = {
    user,
    loading: loading || !isInitialized,
    error,
    signUp,
    signIn,
    signInWithGoogle: handleGoogleSignIn,
    signOut,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}