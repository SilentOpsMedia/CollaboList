// Import necessary dependencies
// React - Core library for building user interfaces
// useState - Hook for managing component state
import React, { useState } from 'react';
// useNavigate - Hook for programmatic navigation
import { useNavigate } from 'react-router-dom';
// Custom hook for authentication context
import { useAuthContext } from '../../contexts/AuthContext';
// Icons from react-icons library
import { FcGoogle } from 'react-icons/fc'; // Google icon
import { FaApple } from 'react-icons/fa'; // Apple icon
// UI components for modal dialog
import { Dialog, Transition } from '@headlessui/react';
// Close icon from Heroicons
import { XMarkIcon } from '@heroicons/react/24/outline';

// Main Login component
export default function Login() {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  
  // Destructure authentication methods and state from AuthContext
  const { 
    signIn,                    // Function to sign in with email/password
    signInWithGoogle,          // Function to sign in with Google
    signInWithApple,           // Function to sign in with Apple
    sendPasswordResetEmail,    // Function to send password reset email
    isAppleSignInAvailable,    // Boolean indicating if Apple sign-in is available
    error,                    // Error object from authentication
    loading                   // Loading state from authentication
  } = useAuthContext();
  
  // State variables for the component
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // Controls forgot password modal visibility
  const [resetEmail, setResetEmail] = useState(''); // Email input for password reset
  const [resetStatus, setResetStatus] = useState<{success?: boolean; message?: string}>({}); // Status of password reset request
  const [isResetting, setIsResetting] = useState(false); // Loading state for password reset
  const [email, setEmail] = useState(''); // Email input for login
  const [password, setPassword] = useState(''); // Password input for login
  const [isLoading, setIsLoading] = useState(false); // Loading state for login
  const [formError, setFormError] = useState<string | null>(null); // Error message for form validation

  // Handle form submission for email/password login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setFormError(null); // Clear any previous errors
    
    // Basic form validation
    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    setIsLoading(true); // Show loading state
    
    try {
      // Attempt to sign in with email and password
      await signIn(email, password);
      // If successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      // Handle any errors
      console.error('Login error:', err);
      setFormError(error?.message || 'Failed to sign in. Please try again.');
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  // Handle password reset request
  const handlePasswordReset = async () => {
    // Validate email input
    if (!resetEmail) {
      setResetStatus({ success: false, message: 'Please enter your email address' });
      return;
    }
    
    // Set loading state and clear previous status
    setIsResetting(true);
    setResetStatus({});
    
    try {
      // Attempt to send password reset email
      await sendPasswordResetEmail(resetEmail);
      // On success, show success message and clear email field
      setResetStatus({ 
        success: true, 
        message: 'Password reset email sent! Please check your inbox.' 
      });
      setResetEmail('');
    } catch (error) {
      // Handle any errors
      console.error('Password reset error:', error);
      setResetStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send reset email. Please try again.' 
      });
    } finally {
      // Always reset loading state
      setIsResetting(false);
    }
  };

  // Main component render
  return (
    // Main container with responsive padding and centering
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header section with title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      {/* Main form container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* White card with shadow */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Display form errors if any */}
          {formError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Error icon */}
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password input field */}
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Remember me and Forgot password section */}
            <div className="flex items-center justify-between">
              {/* Remember me checkbox */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              {/* Forgot password link */}
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}  // Open forgot password modal
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Social Sign-in Section */}
          {/* Social login section */}
          <div className="mt-6">
            {/* Divider with text */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {/* Google sign-in button */}
              <div>
                <button
                  type="button"
                  onClick={signInWithGoogle}  // Trigger Google sign-in
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <FcGoogle className="h-5 w-5" />
                </button>
              </div>

              {/* Apple sign-in button (only shown on supported devices) */}
              {isAppleSignInAvailable && (
                <div>
                  <button
                    type="button"
                    onClick={signInWithApple}  // Trigger Apple sign-in
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Apple</span>
                    <FaApple className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal - Only renders when isForgotPasswordOpen is true */}
      {isForgotPasswordOpen && (
        // Modal backdrop with semi-transparent overlay
        <div className="fixed z-10 inset-0 overflow-y-auto">
          {/* Modal container */}
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Clickable overlay to close modal */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => {
                // Close modal and reset form when clicking outside
                setIsForgotPasswordOpen(false);
                setResetStatus({});
                setResetEmail('');
              }}
              aria-hidden="true" // Hide from screen readers since it's just for closing
            />

            {/* Invisible element to help with vertical centering */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203; {/* Zero-width space character */}
            </span>
            
            {/* Modal content */}
            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  aria-label="Close modal"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              {/* Modal body */}
              <div>
                {/* Icon container */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {/* Keyhole icon for password reset */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                
                {/* Modal content */}
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Reset your password
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>
                  
                  {/* Status message (success/error) */}
                  {resetStatus.message && (
                    <div 
                      className={`mt-4 p-3 rounded-md ${
                        resetStatus.success 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {resetStatus.message}
                    </div>
                  )}
                  
                  {/* Email input for password reset */}
                  <div className="mt-4">
                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="reset-email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="you@example.com"
                        aria-describedby="email-description"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500" id="email-description">
                      We'll send you a link to reset your password
                    </p>
                  </div>
                </div>
                
                {/* Submit button for password reset */}
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={isResetting}
                    onClick={handlePasswordReset}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? 'Sending...' : 'Send reset link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}