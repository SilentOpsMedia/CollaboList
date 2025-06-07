/**
 * @file src/components/auth/SignUp.tsx
 * @description User Registration Component
 * 
 * A comprehensive sign-up form that handles new user registration with email/password
 * and creates corresponding user documents in Firestore. This component manages the
 * complete user registration flow including form validation, error handling, and
 * integration with Firebase Authentication and Firestore.
 * 
 * ## Features
 * - Email and password registration
 * - Display name collection
 * - Form validation with helpful error messages
 * - Loading states during registration
 * - Error handling and user feedback
 * - Automatic redirection after successful registration
 * - Mobile-responsive design
 * 
 * ## Registration Flow
 * 1. User fills out the registration form
 * 2. Form data is validated
 * 3. Firebase Authentication creates a new user account
 * 4. User document is created in Firestore
 * 5. User is redirected to the dashboard
 * 
 * ## Dependencies
 * - `react-router-dom` for navigation
 * - `AuthContext` for authentication state and methods
 * - `userServices` for Firestore operations
 * - Firebase Authentication and Firestore
 * 
 * @see https://firebase.google.com/docs/auth
 * @see https://firebase.google.com/docs/firestore
 * @module components/auth/SignUp
 * 
 * @component
 * @returns {JSX.Element} The sign-up form component
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAuthContext } from '../../contexts/AuthContext';

// Services
import { userServices } from '../../services/userServices';

// Types
import { User } from '../../types/user';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form submission for user registration
   * @param {React.FormEvent} e - The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!email || !password) {
      console.error('Email and password are required');
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Create authentication account
      await signUp(email, password);
      
      // 2. Create user document in Firestore
      const userData = {
        id: email, // Using email as ID for simplicity
        email,
        password, // Include the password as required by UserInput
        displayName: displayName || email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await userServices.createUser(userData);
      
      // 3. Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Error during sign up:', err);
      // Error is already handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      aria-label="Sign up form"
      data-testid="signup-form"
    >
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="displayName" className="sr-only">
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error.message}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default SignUp;