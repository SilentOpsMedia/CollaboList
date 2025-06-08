import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock Firebase auth methods
const mockSignInWithEmailAndPassword = jest.fn();
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockOnAuthStateChanged = jest.fn();
const mockSignInWithPopup = jest.fn();
const mockSignInWithRedirect = jest.fn();
const mockSendEmailVerification = jest.fn();

// Mock the Firebase auth module
jest.mock('../../lib/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
    createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
    signOut: mockSignOut,
    sendPasswordResetEmail: mockSendPasswordResetEmail,
    onAuthStateChanged: mockOnAuthStateChanged,
    signInWithPopup: mockSignInWithPopup,
    signInWithRedirect: mockSignInWithRedirect,
    currentUser: {
      sendEmailVerification: mockSendEmailVerification,
      emailVerified: false,
    },
  },
  GoogleAuthProvider: jest.fn(),
  OAuthProvider: jest.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation for onAuthStateChanged
    mockOnAuthStateChanged.mockImplementation((callback) => {
      // Default to no user signed in
      callback(null);
      return jest.fn(); // Return unsubscribe function
    });
  });

  it('provides initial context', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('handles sign in with email and password', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles sign up with email and password', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    mockSendEmailVerification.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(mockSendEmailVerification).toHaveBeenCalled();
  });

  it('handles sign out', async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('handles password reset', async () => {
    const email = 'test@example.com';
    mockSendPasswordResetEmail.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.sendPasswordResetEmail(email);
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(email);
  });

  it('handles auth state changes', () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    
    // Set up the mock to call the callback with a user
    mockOnAuthStateChanged.mockImplementationOnce((callback) => {
      callback(mockUser);
      return jest.fn();
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  it('handles errors during sign in', async () => {
    const error = new Error('Invalid credentials');
    mockSignInWithEmailAndPassword.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await expect(
        result.current.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    expect(result.current.error).toBeDefined();
  });

  it('handles email verification', async () => {
    const mockUser = { 
      uid: 'test-uid', 
      email: 'test@example.com',
      emailVerified: false,
      sendEmailVerification: mockSendEmailVerification,
    };
    
    mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
    mockSendEmailVerification.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });

    expect(mockSendEmailVerification).toHaveBeenCalled();
  });
});
