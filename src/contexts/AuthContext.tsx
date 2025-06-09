/**
 * @file src/contexts/AuthContext.tsx
 * @description Authentication Context for CollaboList
 * 
 * This file provides a React context for managing authentication state and methods
 * throughout the application. It wraps Firebase authentication with a more React-friendly API,
 * providing a clean interface for components to handle user authentication.
 * 
 * @author CollaboList Team
 * @created 2025-06-07
 * @lastModified 2025-06-07
 * 
 * @dependencies react, firebase/auth, @/lib/firebase, @/services/userServices, @/types/user
 */

// Core React imports
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';

// Firebase Auth imports with specific methods we'll use
import {
  User as FirebaseUser,              // Firebase User type
  createUserWithEmailAndPassword as firebaseCreateUser,  // Email sign-up
  signInWithEmailAndPassword as firebaseSignIn,          // Email sign-in
  GoogleAuthProvider,                                   // Google auth provider
  OAuthProvider,                                       // For OAuth providers
  signInWithPopup,                                     // For social auth popups
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,  // Password reset
  onAuthStateChanged,                                   // Auth state listener
  User as FirebaseAuthUser,                            // Firebase Auth User type
  EmailAuthProvider,                                    // For email/password auth
  reauthenticateWithCredential,                         // For re-authentication
  updateEmail as firebaseUpdateEmail,                   // For updating email
  updateProfile as firebaseUpdateProfile,               // For updating profile
  updatePassword,                                      // For updating password
  sendEmailVerification as firebaseSendEmailVerification, // For sending email verification
  signInAnonymously as firebaseSignInAnonymously,      // For anonymous authentication
  linkWithCredential,                                  // For linking auth providers
  EmailAuthProvider as FirebaseEmailAuthProvider,      // For email/password auth
  AuthCredential,                                     // For auth credentials
  linkWithPopup                                        // For linking with popup providers
} from 'firebase/auth';

// Our Firebase configuration and utilities
import {
  auth,
  auth as firebaseAuth,
  isIosOrSafari
} from '../lib/firebase';

// Initialize auth providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure providers
appleProvider.addScope('email');
appleProvider.addScope('name');

// Service for user-related operations
import { userServices } from '../services/userServices';
import { User, UserInput, UserUpdate } from '../types/user';

/**
 * Extended Error interface that includes an optional code property
 * This is commonly returned by Firebase Auth errors
 * 
 * @interface AuthErrorWithCode
 * @extends {Error}
 * 
 * @property {string} [code] - Optional error code (e.g., 'auth/user-not-found')
 * @property {string} message - Human-readable error message
 * 
 * @example
 * try {
 *   // Auth operation that might fail
 * } catch (error) {
 *   if ((error as AuthErrorWithCode).code === 'auth/user-not-found') {
 *     // Handle specific auth error
 *   }
 * }
 */
interface AuthErrorWithCode extends Error {
  code?: string;
  message: string;
}

/**
 * Defines the shape of the authentication context that will be available
 * to components that consume the AuthContext.
 * 
 * @interface AuthContextType
 * 
 * @property {FirebaseUser | null} user - The currently authenticated user or null if not authenticated
 * @property {boolean} loading - Indicates if authentication state is being determined
 * @property {boolean} isAuthenticated - Convenience boolean indicating if a user is authenticated
 * @property {(email: string, password: string) => Promise<void>} signIn - Method to sign in with email/password
 * @property {(email: string, password: string, userData: UserInput) => Promise<void>} signUp - Method to create a new user account
 * @property {() => Promise<void>} signOut - Method to sign out the current user
 * @property {() => Promise<void>} signInWithGoogle - Method to sign in with Google
 * @property {() => Promise<void>} signInWithApple - Method to sign in with Apple (on supported devices)
 * @property {(email: string) => Promise<void>} sendPasswordResetEmail - Method to send a password reset email
 * @property {(updates: UserUpdate) => Promise<void>} updateUserProfile - Method to update the current user's profile
 * 
 * @example
 * // Usage in a component:
 * const { user, isAuthenticated, signIn, signOut } = useAuthContext();
 * 
 * if (isAuthenticated) {
 *   return <div>Welcome, {user?.email}!</div>;
 * }
 * 
 * return <button onClick={() => signIn('user@example.com', 'password')}>Sign In</button>;
 */
export interface AuthContextType {
  // Current authenticated user or null
  user: User | null;

  // Loading state for auth operations
  loading: boolean;

  // Update user's email address
  updateEmail: (newEmail: string, password: string) => Promise<void>;

  // Change user's password
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  // Send email verification to the current user
  sendEmailVerification: () => Promise<void>;

  // Check if email is verified
  isEmailVerified: boolean;

  // Any authentication error that occurred
  error: { code: string; message: string } | null;

  // Authentication methods
  signUp: (email: string, password: string) => Promise<void>;  // Create new account
  signIn: (email: string, password: string) => Promise<void>;  // Sign in with email
  signInWithGoogle: () => Promise<void>;                      // Google OAuth sign-in
  signInWithApple: () => Promise<void>;                       // Apple OAuth sign-in
  signInAnonymously: () => Promise<void>;                     // Anonymous sign-in
  isAppleSignInAvailable: boolean;                            // Check if Apple sign-in is supported
  sendPasswordResetEmail: (email: string) => Promise<void>;   // Reset password
  signOut: () => Promise<void>;                              // Sign out current user
  deleteUser: (password: string) => Promise<void>;
  isInitialized: boolean;                                    // Whether auth state is initialized
  isAnonymous: boolean;                                      // Whether current user is anonymous
  linkWithEmail: (email: string, password: string) => Promise<void>; // Link anonymous account with email
  linkWithGoogle: () => Promise<void>;                       // Link anonymous account with Google
  linkWithApple: () => Promise<void>;                        // Link anonymous account with Apple
}

/**
 * React Context for authentication state and methods
 * 
 * This context provides access to authentication state and methods throughout the application.
 * It should be provided at the root of the application to make authentication state available
 * to all child components that need it.
 * 
 * @example
 * // In your app's root component:
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourAppComponents />
 *     </AuthProvider>
 *   );
 * }
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * This component provides authentication context to the entire application.
 * It manages user authentication state and provides authentication methods.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the auth context
 * 
 * @example
 * // Basic usage in your app:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * @returns {JSX.Element} The AuthProvider component with authentication context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // State for the authenticated user and loading state
  // We use a type assertion here to handle the difference between Firebase User and our User type
  const [user, setUser] = useState<User | null>(null);        // Current authenticated user
  const [loading, setLoading] = useState<boolean>(true);      // Loading state for auth operations
  const [error, setError] = useState<{ code: string; message: string } | null>(null);  // Authentication errors
  const [isInitialized, setIsInitialized] = useState<boolean>(false);  // Whether auth is initialized
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);  // Whether current user is anonymous

  /**
   * Effect hook to set up authentication state listener
   * This runs once when the component mounts and cleans up when it unmounts
   */
  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        console.log('AuthContext: Auth state changed -', { 
          hasUser: !!firebaseUser,
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          emailVerified: firebaseUser?.emailVerified
        });
        console.log('Auth state changed:', { 
          hasUser: !!firebaseUser, 
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          emailVerified: firebaseUser?.emailVerified
        });
        
        try {
          if (firebaseUser) {
            console.log('Auth state changed: User signed in', { isAnonymous: firebaseUser.isAnonymous });
            
            // Check if user is anonymous
            const userIsAnonymous = firebaseUser.isAnonymous;
            setIsAnonymous(userIsAnonymous);
            
            // Map Firebase user to our User type
            const mappedUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || (userIsAnonymous ? '' : 'no-email@example.com'),
              displayName: firebaseUser.displayName || 
                         (userIsAnonymous ? 'Guest User' : firebaseUser.email?.split('@')[0] || 'User'),
              ...(firebaseUser.photoURL && { photoURL: firebaseUser.photoURL }),
              isActive: true,
              role: userIsAnonymous ? 'guest' : 'user',
              metadata: {
                lastLogin: new Date(),
                failedLoginAttempts: 0,
                preferences: {
                  theme: 'system',
                  notifications: {
                    email: !userIsAnonymous, // Disable email notifications for anonymous users by default
                    push: !userIsAnonymous   // Disable push notifications for anonymous users by default
                  }
                }
              },
              emailVerified: firebaseUser.emailVerified || false,
              createdAt: new Date(),
              updatedAt: new Date(),
              isAnonymous: userIsAnonymous
            };
            
            // For anonymous users, ensure we have a document in Firestore
            if (userIsAnonymous) {
              try {
                const userDoc = await userServices.getUser(firebaseUser.uid);
                if (!userDoc) {
                  // Create a minimal user document for anonymous users
                  // Generate a random password for anonymous users (won't be used for auth)
                  const tempPassword = `temp_${Math.random().toString(36).substring(2, 15)}`;
                  
                  await userServices.createUser({
                    ...mappedUser,
                    password: tempPassword, // Required by UserInput type
                    createdAt: new Date(),
                    updatedAt: new Date()
                  });
                }
              } catch (err) {
                console.error('Error handling anonymous user document:', err);
              }
            }
            
            setUser(mappedUser);
          } else {
            setUser(null);
            setIsAnonymous(false);
          }
        } catch (error) {
          console.error('Error processing auth state:', error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          const errorCode = (error as { code?: string }).code || 'auth/error';
          
          setError({
            code: errorCode,
            message: errorMessage
          });
        } finally {
          setLoading(false);
          setIsInitialized(true);
        }
      },
      (error: unknown) => {
        // This is the error callback for the auth state observer
        console.error('Auth state observer error:', error);
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
      const userCredential = await firebaseCreateUser(firebaseAuth, email, password);

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
      await firebaseSignIn(firebaseAuth, email, password);
      console.log('User signed in successfully');
    } catch (err) {
      const error = err as AuthErrorWithCode;
      console.error('Error signing in:', error);
      setError({
        code: error.code || 'auth/sign-in-failed',
        message: error.message || 'Failed to sign in. Please check your credentials.'
      });
      throw error;
    }
  };

  /**
   * Cleans up user data to ensure it matches the User type
   * Converts null values to undefined for optional fields
   */
  const cleanUserData = (data: Partial<User> | UserUpdate): Partial<User> => {
    const result: Partial<User> = {};

    // Only include defined values and convert null to undefined
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        result[key as keyof User] = value as any;
      }
    });

    return result;
  };

  // Update user profile information
  const updateUserProfile = async (updates: UserUpdate): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!firebaseAuth.currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update Firebase Auth profile if displayName or photoURL is being updated
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await firebaseUpdateProfile(firebaseAuth.currentUser, {
          displayName: updates.displayName,
          photoURL: updates.photoURL || undefined
        });
      }

      // Update user in Firestore
      if (user) {
        const updateData: UserUpdate = {
          ...updates,
          updatedAt: new Date().toISOString()
        };

        await userServices.updateUser(user.id, updateData);

        // Clean and update local user state
        const updatedUser: User = {
          ...user,
          ...cleanUserData(updateData)
        } as User;

        setUser(updatedUser);
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorCode = (error as AuthErrorWithCode).code || 'auth/update-profile-failed';
      const errorMessage = (error as Error).message || 'Failed to update profile';

      setError({
        code: errorCode,
        message: errorMessage
      });

      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  // Update user's email address
  const updateEmail = async (newEmail: string, password: string) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      // Re-authenticate user before updating email
      const credential = EmailAuthProvider.credential(
        firebaseAuth.currentUser.email || '',
        password
      );

      await reauthenticateWithCredential(firebaseAuth.currentUser, credential);

      // Update email in Firebase Auth
      await firebaseUpdateEmail(firebaseAuth.currentUser, newEmail);

      // Update email in Firestore if user document exists
      if (firebaseAuth.currentUser.uid) {
        await userServices.updateUser(firebaseAuth.currentUser.uid, { email: newEmail });
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, email: newEmail } : null);

    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  // Change user's password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!firebaseAuth.currentUser?.email) {
      throw new Error('No user is currently signed in');
    }

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        firebaseAuth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(firebaseAuth.currentUser, credential);

      // Update the password
      await updatePassword(firebaseAuth.currentUser, newPassword);
    } catch (error) {
      console.error('Error changing password:', error);
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
      const result = await signInWithPopup(firebaseAuth, googleProvider);

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

          await userServices.updateUser(userCredential.uid, updateData);
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

  /**
   * Signs in a user anonymously
   * @throws {Error} If anonymous sign-in fails
   */
  const signInAnonymously = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in anonymously using Firebase Auth
      // The auth state listener will handle updating the user state
      await firebaseSignInAnonymously(auth);
      
      console.log('Anonymous sign-in successful');
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error as Error);
      setError({
        code: (error as AuthErrorWithCode).code || 'auth/anonymous-signin-failed',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getAuthErrorMessage = (error: Error): string => {
    const errorCode = (error as AuthErrorWithCode).code;
    
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already in use by another account.';
      case 'auth/invalid-email':
        return 'The email address is not valid.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled.';
      case 'auth/weak-password':
        return 'The password is too weak.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/wrong-password':
        return 'The password is invalid.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later.';
      case 'auth/requires-recent-login':
        return 'Please log in again to verify your identity.';
      default:
        return error.message || 'An unknown error occurred. Please try again.';
    }
  };

  // Send email verification to the current user
  const sendEmailVerification = async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      setLoading(true);
      setError(null);

      // Import the specific function from firebase/auth
      const { sendEmailVerification: sendVerificationEmail } = await import('firebase/auth');
      await sendVerificationEmail(auth.currentUser);

    } catch (error) {
      console.error('Error sending email verification:', error);
      setError({
        code: (error as AuthErrorWithCode).code || 'auth/email-verification-failed',
        message: (error as Error).message || 'Failed to send verification email. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if the current user's email is verified
  const isEmailVerified = user?.emailVerified || false;

  /**
   * Deletes the currently authenticated user's account after re-authentication
   * @param password - The user's current password for re-authentication
   * @throws {Error} If no user is signed in or if deletion fails
   */
  const deleteUser = async (password: string): Promise<void> => {
    if (!auth.currentUser?.email) {
      throw new Error('No user is currently signed in');
    }

    try {
      setLoading(true);
      setError(null);

      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete user document from Firestore if it exists
      if (auth.currentUser.uid) {
        try {
          await userServices.deleteUser(auth.currentUser.uid);
        } catch (error) {
          console.error('Error deleting user data:', error);
          // Continue with account deletion even if Firestore deletion fails
        }
      }

      // Delete the user account
      await auth.currentUser.delete();

      // Update local state
      setUser(null);

    } catch (error) {
      console.error('Error deleting account:', error);
      const errorMessage = (error as Error).message || 'Failed to delete account';
      setError({
        code: (error as any).code || 'auth/account-deletion-failed',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the current user
   * @throws {Error} If sign out fails
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await auth.signOut();
      setUser(null);
      setIsAnonymous(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setError({
        code: (error as any).code || 'auth/sign-out-failed',
        message: 'Failed to sign out. Please try again.'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Links the current anonymous user with an email/password account
   * @param email - User's email address
   * @param password - User's password
   * @throws {Error} If linking fails
   */
  const linkWithEmail = async (email: string, password: string): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create email credential
      const credential = EmailAuthProvider.credential(email, password);
      
      // Link the credential to the anonymous account
      await linkWithCredential(auth.currentUser, credential);
      
      console.log('Successfully linked with email/password');
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error as Error);
      setError({
        code: (error as AuthErrorWithCode).code || 'auth/link-failed',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Links the current anonymous user with a Google account
   * @throws {Error} If linking fails
   */
  const linkWithGoogle = async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Link with Google provider
      await linkWithPopup(auth.currentUser, googleProvider);
      
      console.log('Successfully linked with Google');
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error as Error);
      setError({
        code: (error as AuthErrorWithCode).code || 'auth/google-link-failed',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Links the current anonymous user with an Apple ID
   * @throws {Error} If linking fails or not on iOS/Safari
   */
  const linkWithApple = async (): Promise<void> => {
    if (!isIosOrSafari()) {
      throw new Error('Apple Sign In is only available on iOS and Safari browsers');
    }

    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }

    try {
      setLoading(true);
      setError(null);
      
      // Link with Apple provider
      await linkWithPopup(auth.currentUser, appleProvider);
      
      console.log('Successfully linked with Apple');
    } catch (error) {
      const errorMessage = getAuthErrorMessage(error as Error);
      setError({
        code: (error as AuthErrorWithCode).code || 'auth/apple-link-failed',
        message: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading: loading || !isInitialized,
    updateEmail,
    changePassword,
    sendEmailVerification,
    isEmailVerified,
    error,
    signUp,
    signIn,
    signInAnonymously,
    signOut,
    signInWithGoogle,
    signInWithApple,
    isAppleSignInAvailable: isIosOrSafari(),
    sendPasswordResetEmail,
    updateUserProfile,
    deleteUser,
    isInitialized,
    isAnonymous,
    linkWithEmail,
    linkWithGoogle,
    linkWithApple
  };

  // Debug log to check if the function is available in context
  console.log('AuthContext value keys:', Object.keys(value));

  // Show loading indicator while auth is initializing
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context
 * 
 * This hook provides access to the authentication context values and methods.
 * It must be used within a component that is a descendant of an AuthProvider.
 * 
 * @returns {AuthContextType} The authentication context value
 * 
 * @throws {Error} If used outside of an AuthProvider
 * 
 * @example
 * // In a component:
 * function UserProfile() {
 *   const { user, signOut } = useAuthContext();
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user?.displayName || 'User'}</p>
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   );
 * }
 */
// Export the hook with two names for backward compatibility
// Export the hook with two names for backward compatibility
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Alias for useAuthContext for backward compatibility
export const useAuth = useAuthContext;