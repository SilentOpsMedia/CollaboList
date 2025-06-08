import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { User as FirebaseUser } from 'firebase/auth';
import SignupPage from '../SignupPage';
import { createMockUser } from '../../test-utils';
import { defaultAuthContext } from '../../test-utils/auth-test-utils';
import { useAuth } from '../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock implementations
const mockSignUp = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockSignInWithApple = jest.fn();

/**
 * @core
 */
describe('SignupPage', () => {
  const mockUser = createMockUser({
    email: 'newuser@example.com',
    displayName: 'New User',
    emailVerified: false,
    role: 'user' as const,
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up the default mock implementation
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthContext, // Use the default auth context
      signUp: mockSignUp,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
    }));
  });

  it('renders the signup form with all elements', () => {
    render(<SignupPage />);
    
    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument();
  });

  it('validates form inputs before submission', async () => {
    render(<SignupPage />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Check for validation errors
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    
    // Fill in with invalid data
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    // Test name validation
    fireEvent.change(nameInput, { target: { value: 'ab' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'mismatch' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Check validation messages
    expect(await screen.findByText(/name must be at least 3 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    
    // Test password confirmation
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    // Mock successful signup
    mockSignUp.mockResolvedValueOnce({ user: { ...mockUser, sendEmailVerification: jest.fn() } });
    
    render(<SignupPage />);
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);
    
    // Check that signUp was called with the correct arguments
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('newuser@example.com', 'password123', 'New User');
    });
    
    // Check loading state
    expect(submitButton).toHaveTextContent(/creating account.../i);
  });
  
  it('handles signup errors', async () => {
    // Mock a failed signup
    const errorMessage = 'Email already in use';
    mockSignUp.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<SignupPage />);
    
    // Fill in the form and submit
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Check that the error message is displayed
    expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
    
    // Check that the button is re-enabled after error
    expect(screen.getByRole('button', { name: /sign up/i })).not.toBeDisabled();
  });
  
  it('allows signing up with Google', async () => {
    render(<SignupPage />);
    
    const googleButton = screen.getByRole('button', { name: /sign up with google/i });
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });
  
  it('shows loading state during authentication', () => {
    // Set loading to true in the auth context
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthContext,
      loading: true,
    }));
    
    render(<SignupPage />);
    
    // Check that the loading indicator is shown and button is disabled
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeDisabled();
  });
  
  it('redirects to dashboard if already authenticated', () => {
    // Create a properly typed mock user with all required properties
    const mockUser = {
      ...createMockUser({
        id: 'test-user-id',
        email: 'test@example.com',
        displayName: 'Test User',
        emailVerified: true,
        role: 'user' as const,
        isActive: true,
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          lastLogin: new Date().toISOString(),
          failedLoginAttempts: 0,
          preferences: {
            theme: 'light' as 'light' | 'dark' | 'system',
            notifications: {
              email: true,
              push: true,
            },
          },
        } as const,
      }),
      // Ensure role is properly typed
      role: 'user' as const,
    };
    
    // Create a properly typed user object that matches the expected User type
    const userWithProperTypes = {
      ...mockUser,
      // Ensure theme is properly typed
      metadata: {
        ...mockUser.metadata,
        preferences: {
          ...mockUser.metadata.preferences,
          theme: 'light' as const
        }
      },
      // Firebase User properties
      uid: mockUser.id,
      providerData: [],
      refreshToken: 'mock-refresh-token',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
      getIdTokenResult: jest.fn().mockResolvedValue({}),
      reload: jest.fn().mockResolvedValue(undefined),
      toJSON: jest.fn()
    };
    
    const mockAuthContext = {
      ...defaultAuthContext,
      user: userWithProperTypes as unknown as FirebaseUser & typeof mockUser,
      isInitialized: true,
      // Add any other required auth methods with proper types
      updateEmail: jest.fn().mockResolvedValue(undefined),
      changePassword: jest.fn().mockResolvedValue(undefined),
      sendEmailVerification: jest.fn().mockResolvedValue(undefined),
      isEmailVerified: true,
      error: null,
      signUp: jest.fn().mockResolvedValue(undefined),
      signIn: jest.fn().mockResolvedValue(undefined),
      signInWithGoogle: jest.fn().mockResolvedValue(undefined),
      signInWithApple: jest.fn().mockResolvedValue(undefined),
      isAppleSignInAvailable: false,
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
      signOut: jest.fn().mockResolvedValue(undefined),
      deleteUser: jest.fn().mockResolvedValue(undefined),
    };
    mockUseAuth.mockImplementation(() => mockAuthContext);
    
    render(<SignupPage />);
    
    // Check that the component doesn't show the signup form
    expect(screen.queryByRole('heading', { name: /create an account/i })).not.toBeInTheDocument();
  });
  
  it('toggles password visibility', () => {
    render(<SignupPage />);
    
    const passwordInput = screen.getByLabelText(/^password/i) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i) as HTMLInputElement;
    const toggleButtons = screen.getAllByRole('button', { name: /toggle password visibility/i });
    
    // Password should be hidden by default
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');
    
    // Click to show passwords
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('password');
    
    // Click to hide passwords again
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput.type).toBe('password');
    
    // Toggle confirm password
    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput.type).toBe('text');
  });
  
  it('navigates to login page', () => {
    render(<SignupPage />);
    
    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});
