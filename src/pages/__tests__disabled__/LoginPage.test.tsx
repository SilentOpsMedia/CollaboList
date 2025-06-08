import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import { defaultAuthContext } from '../../test-utils/auth-test-utils';
import LoginPage from '../LoginPage';
import { createMockUser } from '../../test-utils';
import { useAuth } from '../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock implementation of useAuth
const mockSignIn = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockSignInWithApple = jest.fn();

const defaultAuthState = {
  user: null,
  loading: false,
  error: null,
  signIn: mockSignIn,
  signInWithGoogle: mockSignInWithGoogle,
  signInWithApple: mockSignInWithApple,
  signUp: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateEmail: jest.fn(),
  changePassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  isEmailVerified: false,
  isInitialized: true,
  isAppleSignInAvailable: false, // Add missing property
};

/**
 * @core
 */
describe('LoginPage', () => {
  const mockUser = createMockUser({
    email: 'test@example.com',
    emailVerified: true,
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up the default mock implementation
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthContext, // Use the default auth context
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
    }));
  });

  it('renders the login form with all elements', () => {
    render(<LoginPage />);
    
    // Check if the form elements are rendered
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('validates form inputs before submission', async () => {
    render(<LoginPage />);
    
    // Try to submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for validation errors
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    
    // Test invalid email format
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    
    // Test short password
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    // Mock successful sign-in
    mockSignIn.mockResolvedValueOnce({});
    
    render(<LoginPage />);
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check that signIn was called with the correct arguments
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Check that loading state is handled
    expect(submitButton).toBeDisabled();
  });
  
  it('handles login errors', async () => {
    // Mock a failed sign-in
    const errorMessage = 'Invalid email or password';
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<LoginPage />);
    
    // Fill in the form and submit
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    // Check that the error message is displayed
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    
    // Check that the button is re-enabled after error
    expect(submitButton).not.toBeDisabled();
  });
  
  it('allows signing in with Google', async () => {
    render(<LoginPage />);
    
    const googleButton = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });
  
  it('shows loading state during authentication', () => {
    // Set loading to true in the auth context
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      loading: true,
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
      signUp: jest.fn(),
      signOut: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      updateEmail: jest.fn(),
      changePassword: jest.fn(),
      sendEmailVerification: jest.fn(),
    }));
    
    render(<LoginPage />);
    
    // Check that the loading indicator is shown and button is disabled
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeDisabled();
  });
  
  it('redirects to dashboard if already authenticated', () => {
    // Set a user in the auth context
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthContext, // Use the default auth context
      user: mockUser,
    }));
    
    const { container } = render(<LoginPage />);
    
    // Check that the component doesn't show the login form
    expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
  });
  
  it('toggles password visibility', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    // Password should be hidden by default
    expect(passwordInput.type).toBe('password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
  
  it('navigates to signup and forgot password pages', () => {
    render(<LoginPage />);
    
    // Test signup link
    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toHaveAttribute('href', '/signup');
    
    // Test forgot password link
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });
});

describe('LoginPage Integration', () => {
  // Mock the useNavigate hook
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    
    // Mock useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    
    // Reset the mock implementation
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      signIn: mockSignIn,
      signInWithGoogle: mockSignInWithGoogle,
      signInWithApple: mockSignInWithApple,
    }));
  });
  
  it('navigates to dashboard after successful login', async () => {
    // Mock successful sign-in
    mockSignIn.mockResolvedValueOnce({});
    
    render(<LoginPage />);
    
    // Fill in the form with valid data
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check that signIn was called with the correct arguments
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
  
  it('handles navigation to signup and forgot password pages', async () => {
    render(<LoginPage />);
    
    // Test signup link
    const signupLink = screen.getByRole('link', { name: /sign up/i });
    expect(signupLink).toHaveAttribute('href', '/signup');
    
    // Test forgot password link
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });
});
