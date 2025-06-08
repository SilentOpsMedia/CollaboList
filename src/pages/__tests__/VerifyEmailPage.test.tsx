import React from 'react';
import { render, screen, waitFor } from '../../test-utils';
import VerifyEmailPage from '../VerifyEmailPage';
import { useAuth } from '../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock implementations
const mockReloadUser = jest.fn();
const mockSendEmailVerification = jest.fn();

const defaultAuthState = {
  user: {
    email: 'test@example.com',
    emailVerified: false,
    sendEmailVerification: mockSendEmailVerification,
  },
  loading: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  sendEmailVerification: mockSendEmailVerification,
  reloadUser: mockReloadUser,
  isEmailVerified: false,
  isInitialized: true,
};

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendEmailVerification.mockResolvedValue(undefined);
    mockReloadUser.mockResolvedValue(undefined);
  });

  it('renders the verify email page for unverified email', () => {
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: { ...defaultAuthState.user, emailVerified: false },
    }));
    
    render(<VerifyEmailPage />);
    
    expect(screen.getByRole('heading', { name: /verify your email/i })).toBeInTheDocument();
    expect(screen.getByText(/we've sent a verification email to/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toHaveAttribute('href', '/dashboard');
  });

  it('shows success message when email is already verified', () => {
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: { ...defaultAuthState.user, emailVerified: true },
      isEmailVerified: true,
    }));
    
    render(<VerifyEmailPage />);
    
    expect(screen.getByRole('heading', { name: /email verified/i })).toBeInTheDocument();
    expect(screen.getByText(/your email has been successfully verified/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toHaveAttribute('href', '/dashboard');
    
    // Should not show the resend button if already verified
    expect(screen.queryByRole('button', { name: /resend verification email/i })).not.toBeInTheDocument();
  });

  it('allows resending the verification email', async () => {
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: { ...defaultAuthState.user, emailVerified: false },
    }));
    
    render(<VerifyEmailPage />);
    
    const resendButton = screen.getByRole('button', { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    // Check that sendEmailVerification was called
    await waitFor(() => {
      expect(mockSendEmailVerification).toHaveBeenCalled();
    });
    
    // Check that success message is shown
    expect(await screen.findByText(/verification email sent/i)).toBeInTheDocument();
  });
  
  it('handles errors when resending verification email fails', async () => {
    const errorMessage = 'Failed to send verification email';
    mockSendEmailVerification.mockRejectedValueOnce(new Error(errorMessage));
    
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: { ...defaultAuthState.user, emailVerified: false },
    }));
    
    render(<VerifyEmailPage />);
    
    const resendButton = screen.getByRole('button', { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    // Check that the error message is displayed
    expect(await screen.findByText(/failed to send verification email/i)).toBeInTheDocument();
  });
  
  it('refreshes the user status', async () => {
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: { ...defaultAuthState.user, emailVerified: false },
    }));
    
    render(<VerifyEmailPage />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);
    
    // Check that reloadUser was called
    await waitFor(() => {
      expect(mockReloadUser).toHaveBeenCalled();
    });
  });
  
  it('shows loading state when checking email verification', () => {
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      loading: true,
      user: { ...defaultAuthState.user, emailVerified: false },
    }));
    
    render(<VerifyEmailPage />);
    
    // Check that loading indicator is shown
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Buttons should be disabled during loading
    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeDisabled();
  });
  
  it('shows an error when user is not available', () => {
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: null,
    }));
    
    render(<VerifyEmailPage />);
    
    expect(screen.getByText(/user not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute('href', '/login');
  });
  
  it('shows a cooldown message after resending verification email', async () => {
    jest.useFakeTimers();
    
    mockUseAuth.mockImplementation(() => ({
      ...defaultAuthState,
      user: { ...defaultAuthState.user, emailVerified: false },
    }));
    
    render(<VerifyEmailPage />);
    
    // Click the resend button
    const resendButton = screen.getByRole('button', { name: /resend verification email/i });
    fireEvent.click(resendButton);
    
    // Fast-forward time to just before cooldown ends
    jest.advanceTimersByTime(59000);
    
    // Button should still be disabled
    expect(resendButton).toBeDisabled();
    expect(resendButton).toHaveTextContent(/resend in 1s/i);
    
    // Fast-forward to when cooldown ends
    jest.advanceTimersByTime(1000);
    
    // Button should be enabled again
    await waitFor(() => {
      expect(resendButton).not.toBeDisabled();
      expect(resendButton).toHaveTextContent(/resend verification email/i);
    });
    
    jest.useRealTimers();
  });
});
