/**
 * useAuth Hook
 * 
 * A custom React hook that provides authentication state and methods.
 * Handles user authentication state, sign up, sign in, and sign out functionality.
 * Integrates with Firebase Authentication for user management.
 * 
 * @returns {Object} An object containing:
 *   - user: The current authenticated user or null
 *   - loading: Boolean indicating if authentication state is being checked
 *   - error: Any authentication error that occurred
 *   - signUp: Function to register a new user
 *   - signIn: Function to sign in an existing user
 *   - signOut: Function to sign out the current user
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