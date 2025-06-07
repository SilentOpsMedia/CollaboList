/**
 * Authentication Context for CollaboList
 * 
 * This file provides a React context for managing authentication state and methods
 * throughout the application. It wraps Firebase authentication with a more React-friendly API.
 */

// Core React imports
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

// Firebase Auth imports with specific methods we'll use
import { 
  User as FirebaseUser,              // Firebase User type
  createUserWithEmailAndPassword as firebaseCreateUser,  // Email sign-up
  signInWithEmailAndPassword as firebaseSignIn,          // Email sign-in
  signOut as firebaseSignOut,                            // Sign out
  GoogleAuthProvider,                                   // Google auth provider
  signInWithPopup,                                      // For social auth popups
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,  // Password reset
  onAuthStateChanged,                                   // Auth state listener
  User as FirebaseAuthUser                             // Firebase Auth User type
} from 'firebase/auth';

// Our Firebase configuration and utilities
import { 
  auth,
  googleProvider,
  appleProvider, 
  isIosOrSafari 
} from '../lib/firebase';

// Service for user-related operations
import { userServices } from '../services/userServices';
import { User, UserInput, UserUpdate } from '../types/user';

/**
 * Extended Error interface that includes an optional code property
 * This is commonly returned by Firebase Auth errors
 */
interface AuthErrorWithCode extends Error {
  code?: string;
  message: string;
}

/**
 * The shape of our authentication context
 * This defines what values and methods are available to components
 * that consume the auth context
 */
interface AuthContextType {
  // Current authenticated user or null if not authenticated
  user: User | null;
  
  // Loading state for auth operations
  loading: boolean;
  
  // Any authentication error that occurred
  error: { code: string; message: string } | null;
  
  // Authentication methods
  signUp: (email: string, password: string) => Promise<void>;  // Create new account
  signIn: (email: string, password: string) => Promise<void>;  // Sign in with email
  signInWithGoogle: () => Promise<void>;                      // Google OAuth sign-in
  signInWithApple: () => Promise<void>;                       // Apple OAuth sign-in
  isAppleSignInAvailable: boolean;                            // Check if Apple sign-in is supported
  sendPasswordResetEmail: (email: string) => Promise<void>;   // Reset password
  signOut: () => Promise<void>;                              // Sign out current user
  isInitialized: boolean;                                    // Whether auth state is initialized
}

/**
 * Create the authentication context with an undefined default value
 * This will be populated by the AuthProvider component
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * This component provides authentication context to the entire application.
 * It manages user authentication state and provides authentication methods.
 * 
 * @param children - Child components that will have access to the auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // State for the authenticated user and loading state
  // We use a type assertion here to handle the difference between Firebase User and our User type
  const [user, setUser] = useState<User | null>(null);        // Current authenticated user
  const [loading, setLoading] = useState<boolean>(true);      // Loading state for auth operations
  const [error, setError] = useState<{ code: string; message: string } | null>(null);  // Authentication errors
  const [isInitialized, setIsInitialized] = useState<boolean>(false);  // Whether auth is initialized

  /**
   * Effect hook to set up authentication state listener
   * This runs once when the component mounts and cleans up when it unmounts
   */
  useEffect(() => {
    // Set up auth state listener when component mounts
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseAuthUser | null) => {
      // User is signed in or out
      if (firebaseUser) {
        // Map Firebase user to our User type
        const mappedUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          ...(firebaseUser.photoURL && { photoURL: firebaseUser.photoURL }),
          isActive: true,
          role: 'user',
          metadata: {
            lastLogin: new Date(),
            failedLoginAttempts: 0,
            preferences: {
              theme: 'system',
              notifications: {
                email: true,
                push: true
              }
            }
          },
          // Add any other required fields from your User type
          emailVerified: firebaseUser.emailVerified || false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
      setIsInitialized(true);
    },
    // Error handler - wrapped in a try-catch to handle any errors
    (error: unknown) => {
      console.error('Auth state error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const errorCode = (error as { code?: string }).code || 'auth/error';
      
      setError({ 
        code: errorCode, 
        message: errorMessage 
      });
      setLoading(false);
      setIsInitialized(true);
    }
  );

  // Cleanup function to unsubscribe from auth state changes
  return () => {
    console.log('Cleaning up auth listener');
    unsubscribe();
  };
}, []); // Empty dependency array means this effect runs once on mount

  /**
   * Signs up a new user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @throws {AuthErrorWithCode} If signup fails
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Create user in Firebase Authentication
      const userCredential = await firebaseCreateUser(auth, email, password);
      
      // Create corresponding user document in Firestore with only necessary fields
      // Prepare user data for Firestore
      const userData: UserInput & { id: string } = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || email.split('@')[0], // Default to email prefix if no display name
        password, // This is only used for type compatibility, not stored directly
        ...(userCredential.user.photoURL && { photoURL: userCredential.user.photoURL }),
        isActive: true,
        role: 'user',
        metadata: {
          lastLogin: new Date(),
          failedLoginAttempts: 0,
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true
            }
          }
        },
        emailVerified: userCredential.user.emailVerified || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Create the user document in Firestore
      await userServices.createUser(userData);
      
      console.log('User created successfully:', userCredential.user.uid);
    } catch (err) {
      // Handle and re-throw authentication errors
      const error = err as AuthErrorWithCode;
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'An account with this email already exists.'
        : 'Failed to create account. Please try again.';
        
      console.error('Sign up error:', error);
      setError({ 
        code: error.code || 'auth/error', 
        message: errorMessage
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs in an existing user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @throws {AuthErrorWithCode} If sign in fails
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      await firebaseSignIn(auth, email, password);
      console.log('User signed in successfully');
    } catch (err) {
      const error = err as AuthErrorWithCode;
      console.error('Sign in error:', error);
      setError({ 
        code: error.code || 'auth/error', 
        message: error.message || 'Failed to sign in' 
      });
      throw error;
    }
  };

  /**
   * Signs out the current user
   * @throws {AuthErrorWithCode} If sign out fails
   */
  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      console.log('User signed out successfully');
    } catch (err) {
      const error = err as AuthErrorWithCode;
      console.error('Sign out error:', error);
      setError({
        code: error.code || 'auth/error',
        message: error.message || 'Failed to sign out'
      });
      throw error;
    }
  };

  /**
   * Signs in a user using Google OAuth
   * Creates or updates the user's document in Firestore after successful authentication
   * @throws {AuthErrorWithCode} If Google sign in fails
   */
  const signInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      console.log('Initiating Google sign in...');
      
      // Trigger Google sign-in popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create or update user in Firestore after successful authentication
      if (result?.user) {
        // Handle Google Sign In success
        const userCredential = result.user;
        
        // Prepare user data for Firestore
        const userData: UserInput & { id: string } = {
          id: userCredential.uid,
          email: userCredential.email || '',
          displayName: userCredential.displayName || userCredential.email?.split('@')[0] || 'User',
          password: '', // Not used for Google sign-in
          ...(userCredential.photoURL && { photoURL: userCredential.photoURL }),
          isActive: true,
          role: 'user',
          metadata: {
            lastLogin: new Date(),
            failedLoginAttempts: 0,
            preferences: {
              theme: 'system',
              notifications: {
                email: true,
                push: true
              }
            }
          }
        };
        
        // Check if user document exists
        const userDoc = await userServices.getUser(userCredential.uid);
        
        if (!userDoc) {
          // Create new user document if it doesn't exist
          const userData: UserInput & { id: string } = {
            id: userCredential.uid,
            email: userCredential.email || '',
            displayName: userCredential.displayName || userCredential.email?.split('@')[0] || 'User',
            password: '', // Not used for Google sign-in
            ...(userCredential.photoURL && { photoURL: userCredential.photoURL }),
            isActive: true,
            role: 'user',
            metadata: {
              lastLogin: new Date(),
              failedLoginAttempts: 0,
              preferences: {
                theme: 'system',
                notifications: {
                  email: true,
                  push: true
                }
              }
            }
          };
          
          await userServices.createUser(userData);
        } else {
          // Update last login time and other fields for existing user
          const updateData: any = {
            'metadata.lastLogin': new Date(),
            updatedAt: new Date()
          };
          
          if (userCredential.photoURL && userCredential.photoURL !== userDoc.photoURL) {
            updateData.photoURL = userCredential.photoURL;
          }
          
          if (userCredential.displayName && userCredential.displayName !== userDoc.displayName) {
            updateData.displayName = userCredential.displayName;
          }
          
          if (Object.keys(updateData).length > 2) { // Only update if there are changes beyond the timestamps
            await userServices.updateUser(userCredential.uid, updateData);
          }
        }
      }
    } catch (err) {
      const error = err as AuthErrorWithCode;
      console.error('Google sign in error:', error);
      setError({ 
        code: error.code || 'auth/error', 
        message: error.message || 'Failed to sign in with Google' 
      });
      throw error;
    }
  };

  /**
   * Handles Apple ID sign-in
   * Only available on iOS and Safari browsers
   * @throws {Error} If not on iOS/Safari or if sign in fails
   */
  const signInWithApple = async (): Promise<void> => {
    // Check if running on a supported platform
    if (!isIosOrSafari()) {
      const error = new Error('Apple Sign In is only available on iOS and Safari browsers');
      setError({ code: 'auth/unsupported-browser', message: error.message });
      throw error;
    }

    try {
      setError(null);
      console.log('Initiating Apple sign in...');
      
      // Trigger Apple sign-in popup
      const result = await signInWithPopup(auth, appleProvider);
      
      // Create or update user in Firestore after successful authentication
      if (result.user) {
        const userCredential = result.user;
        console.log('Apple sign in successful, updating user data...');
        
        // Prepare user data for Firestore
        const userData: UserInput & { id: string } = {
          id: userCredential.uid,
          email: userCredential.email || '',
          displayName: userCredential.displayName || userCredential.email?.split('@')[0] || 'Apple User',
          password: '', // Not used for Apple sign-in
          ...(userCredential.photoURL && { photoURL: userCredential.photoURL }),
          isActive: true,
          role: 'user',
          metadata: {
            lastLogin: new Date(),
            failedLoginAttempts: 0,
            preferences: {
              theme: 'system',
              notifications: {
                email: true,
                push: true
              }
            }
          },
          emailVerified: userCredential.emailVerified || false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Check if user document exists
        const userDoc = await userServices.getUser(userCredential.uid);
        
        if (!userDoc) {
          // Create new user document if it doesn't exist
          await userServices.createUser(userData);
        } else {
          // Update last login time and other fields for existing user
          const updateData: Partial<UserUpdate> = {
            updatedAt: new Date(),
            metadata: {
              ...(userDoc.metadata || {}),
              lastLogin: new Date()
            }
          };
          
          // Only update photoURL if it's different
          if (userCredential.photoURL && userCredential.photoURL !== userDoc.photoURL) {
            updateData.photoURL = userCredential.photoURL;
          }
          
          // Only update displayName if it's different
          if (userCredential.displayName && userCredential.displayName !== userDoc.displayName) {
            updateData.displayName = userCredential.displayName;
          }
          
          await userServices.updateUser(userCredential.uid, updateData);
        }
        
        console.log('User data updated in Firestore');
      }
    } catch (err) {
      const error = err as AuthErrorWithCode;
      console.error('Apple sign in error:', error);
      setError({ 
        code: error.code || 'auth/error', 
        message: error.message || 'Failed to sign in with Apple' 
      });
      throw error;
    }
  };

  /**
   * Sends a password reset email to the specified email address
   * @param email - The email address to send the password reset to
   * @throws {AuthErrorWithCode} If sending the password reset email fails
   */
  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
      setError(null);
      await firebaseSendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
    } catch (err) {
      const error = err as AuthErrorWithCode;
      console.error('Password reset error:', error);
      setError({
        code: error.code || 'auth/error',
        message: error.message || 'Failed to send password reset email'
      });
      throw error;
    }
  };

  const value = {
    user,
    loading: loading || !isInitialized,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    isAppleSignInAvailable: isIosOrSafari(),
    sendPasswordResetEmail,
    signOut,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context
 * @returns {AuthContextType} The authentication context
 * @throws {Error} If used outside of an AuthProvider
 * 
 * @example
 * const { user, signIn, signOut } = useAuthContext();
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};