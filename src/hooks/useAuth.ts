/**
 * @file src/hooks/useAuth.ts
 * @description Authentication state management hook
 * 
 * A custom React hook that provides a clean interface for managing user authentication
 * throughout the application. It encapsulates Firebase Authentication logic and provides
 * a simple API for components to interact with the authentication system.
 * 
 * ## Features
 * - Tracks authentication state (signed in/out)
 * - Handles user registration with email/password
 * - Manages user login/logout
 * - Provides loading and error states
 * - Automatically syncs with Firebase Auth state
 * 
 * ## Usage
 * ```tsx
 * function LoginForm() {
 *   const { user, loading, error, signIn, signUp } = useAuth();
 *   const [email, setEmail] = useState('');
 *   const [password, setPassword] = useState('');
 *   const [isLogin, setIsLogin] = useState(true);
 * 
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     try {
 *       if (isLogin) {
 *         await signIn(email, password);
 *       } else {
 *         await signUp(email, password);
 *       }
 *     } catch (err) {
 *       console.error('Authentication error:', err);
 *     }
 *   };
 * 
 *   if (loading) return <div>Loading...</div>;
 *   if (user) return <div>Welcome, {user.email}!</div>;
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         type="email"
 *         value={email}
 *         onChange={(e) => setEmail(e.target.value)}
 *         placeholder="Email"
 *         required
 *       />
 *       <input
 *         type="password"
 *         value={password}
 *         onChange={(e) => setPassword(e.target.value)}
 *         placeholder="Password"
 *         required
 *       />
 *       <button type="submit">
 *         {isLogin ? 'Sign In' : 'Sign Up'}
 *       </button>
 *       <button type="button" onClick={() => setIsLogin(!isLogin)}>
 *         {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 * 
 * @see https://firebase.google.com/docs/auth
 * @module hooks/useAuth
 */

import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError as FirebaseAuthError
} from 'firebase/auth';

/**
 * Interface for authentication error
 */
interface AuthError {
  /** Error code from Firebase Authentication */
  code: string;
  
  /** Human-readable error message */
  message: string;
}

/**
 * Interface for the return value of useAuth hook
 */
interface UseAuthReturn {
  /** The current authenticated user or null if not authenticated */
  user: FirebaseUser | null;
  
  /** Boolean indicating if authentication state is being checked */
  loading: boolean;
  
  /** Authentication error, if any */
  error: AuthError | null;
  
  /** Function to register a new user */
  signUp: (email: string, password: string) => Promise<void>;
  
  /** Function to sign in an existing user */
  signIn: (email: string, password: string) => Promise<void>;
  
  /** Function to sign out the current user */
  signOut: () => Promise<void>;
}

/**
 * useAuth Hook Implementation
 * 
 * Manages authentication state and provides authentication methods.
 * Uses Firebase Authentication under the hood.
 * 
 * @returns {UseAuthReturn} Authentication state and methods
 */
export function useAuth(): UseAuthReturn {
  // State for authentication
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Subscribe to authentication state changes
  useEffect(() => {
    // Set up the auth state change listener
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        // Update user state when auth state changes
        setUser(user);
        // Clear any previous errors on successful auth state change
        setError(null);
        // Set loading to false once we have the initial auth state
        setLoading(false);
      },
      (error: Error) => {
        // Handle auth state change errors
        console.error('Auth state change error:', error);
        setError({
          code: 'auth/state-changed-error',
          message: error.message || 'Authentication error occurred',
        });
        setLoading(false);
      }
    );

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Registers a new user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>} A promise that resolves when sign up is complete
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // No need to set user here - it will be handled by the auth state listener
    } catch (err) {
      const error = err as AuthError;
      console.error('Sign up error:', error);
      setError({
        code: error.code || 'auth/unknown-error',
        message: error.message || 'Failed to create account',
      });
      throw error; // Re-throw to allow error handling in components
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs in an existing user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<void>} A promise that resolves when sign in is complete
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // No need to set user here - it will be handled by the auth state listener
    } catch (err) {
      const error = err as AuthError;
      console.error('Sign in error:', error);
      setError({
        code: error.code || 'auth/unknown-error',
        message: error.message || 'Failed to sign in',
      });
      throw error; // Re-throw to allow error handling in components
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the currently authenticated user
   * @returns {Promise<void>} A promise that resolves when sign out is complete
   */
  const signOutUser = async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await firebaseSignOut(auth);
      // User state will be updated by the auth state listener
    } catch (err) {
      const error = err as AuthError;
      console.error('Sign out error:', error);
      setError({
        code: error.code || 'auth/unknown-error',
        message: error.message || 'Failed to sign out',
      });
      throw error; // Re-throw to allow error handling in components
    } finally {
      setLoading(false);
    }
  };

  // Return the authentication state and methods
  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut: signOutUser,
  };
}