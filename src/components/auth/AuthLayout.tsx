/**
 * @file src/components/auth/AuthLayout.tsx
 * @description Authentication Layout Component
 * 
 * A reusable layout component that wraps authentication-related pages (login, signup, etc.).
 * It provides a consistent UI structure and handles authentication state management.
 * 
 * ## Features
 * - Redirects authenticated users to the dashboard
 * - Shows a loading state while checking authentication status
 * - Provides a consistent layout for all auth pages
 * - Responsive design that works on all screen sizes
 * 
 * ## Usage
 * ```tsx
 * // In your routing configuration
 * <Route path="/login" element={
 *   <AuthLayout>
 *     <LoginForm />
 *   </AuthLayout>
 * } />
 * 
 * <Route path="/signup" element={
 *   <AuthLayout>
 *     <SignUpForm />
 *   </AuthLayout>
 * } />
 * ```
 * 
 * ## Authentication Flow
 * 1. Checks if user is authenticated
 * 2. If authenticated, redirects to `/dashboard`
 * 3. If not authenticated, renders the child components
 * 4. Shows loading state while checking auth status
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered within the layout
 * @returns {JSX.Element} The authentication layout with consistent styling
 * 
 * @see https://reactrouter.com/web/guides/quick-start
 * @see https://tailwindcss.com/docs/installation
 * @module components/auth/AuthLayout
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

/**
 * Props for the AuthLayout component
 */
interface AuthLayoutProps {
  /** Child components to be rendered within the layout */
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { user, loading } = useAuthContext();

  // Show loading state while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if user is already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      data-testid="auth-layout"
    >
      <div className="max-w-md w-full space-y-8">
        {/* Application Logo and Title */}
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CollaboList
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get started with your collaborative lists
          </p>
        </div>
        
        {/* Authentication Form Content */}
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;