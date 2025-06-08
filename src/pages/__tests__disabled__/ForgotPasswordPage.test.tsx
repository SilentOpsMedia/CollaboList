import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import ForgotPasswordPage from '../ForgotPasswordPage';
import { useAuth } from '../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock implementations
const mockSendPasswordResetEmail = jest.fn();

const defaultAuthState = {
  user: null,
  loading: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  reloadUser: jest.fn(),
  isEmailVerified: false,
  isInitialized: true,
};

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      sendPasswordResetEmail: mockSendPasswordResetEmail,
    }));
  });

  it('renders the forgot password form with all elements', () => {
    render(<ForgotPasswordPage />);
    
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByText(/enter your email address and we'll send you a link to reset your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
  });

  it('validates email input before submission', async () => {
    render(<ForgotPasswordPage />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    
    // Check for validation error
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    
    // Test invalid email format
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('submits the form with a valid email', async () => {
    // Mock successful password reset email
    mockSendPasswordResetEmail.mockResolvedValueOnce({});
    
    render(<ForgotPasswordPage />);
    
    // Fill in the form with a valid email
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    // Check that sendPasswordResetEmail was called with the correct email
    await waitFor(() => {
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');
    });
    
    // Check that success message is shown
    expect(await screen.findByText(/check your email for further instructions/i)).toBeInTheDocument();
    
    // Check that the form is hidden after successful submission
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
  });
  
  it('handles errors when sending reset email fails', async () => {
    // Mock a failed password reset email
    const errorMessage = 'User not found';
    mockSendPasswordResetEmail.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<ForgotPasswordPage />);
    
    // Fill in the form and submit
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(submitButton);
    
    // Check that the error message is displayed
    expect(await screen.findByText(/user not found/i)).toBeInTheDocument();
    
    // Check that the form is still visible
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
  
  it('shows loading state during submission', async () => {
    // Mock a slow API call
    mockSendPasswordResetEmail.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );
    
    render(<ForgotPasswordPage />);
    
    // Fill in the form and submit
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send reset link/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    // Check that the button is disabled and shows loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/sending.../i);
    
    // Wait for the promise to resolve
    await waitFor(() => {
      expect(mockSendPasswordResetEmail).toHaveBeenCalled();
    });
  });
  
  it('navigates back to login page', () => {
    render(<ForgotPasswordPage />);
    
    const backLink = screen.getByRole('link', { name: /back to login/i });
    expect(backLink).toHaveAttribute('href', '/login');
  });
  
  it('shows a success message after successful submission', async () => {
    // Mock successful password reset email
    mockSendPasswordResetEmail.mockResolvedValueOnce({});
    
    render(<ForgotPasswordPage />);
    
    // Fill in the form and submit
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    
    // Check that success message is shown
    expect(await screen.findByText(/check your email for further instructions/i)).toBeInTheDocument();
    
    // Check that the success message contains the email
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    
    // Check that there's a button to return to login
    expect(screen.getByRole('link', { name: /return to login/i })).toHaveAttribute('href', '/login');
  });
  
  it('disables the submit button while loading', () => {
    // Set loading to true in the auth context
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      loading: true,
    }));
    
    render(<ForgotPasswordPage />);
    
    // Check that the submit button is disabled
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeDisabled();
  });
});
