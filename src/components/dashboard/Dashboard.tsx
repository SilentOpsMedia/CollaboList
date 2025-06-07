/**
 * Dashboard Component
 * 
 * Main application dashboard that displays after successful authentication.
 * Shows user information and provides navigation to other parts of the app.
 * 
 * @component
 * @returns {JSX.Element | null} The dashboard component or null if redirecting
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAuthContext } from '../../contexts/AuthContext';

// Types
import { User } from '../../types/user';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  /**
   * Handles user sign out
   * Signs out the user and redirects to the login page
   */
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Consider showing a toast notification here
    }
  };

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Format the username from email (everything before @)
  const username = user.email?.split('@')[0] || 'User';
  const displayName = user.displayName || username;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CollaboList</h1>
              <p className="text-sm text-gray-500">Welcome back, {displayName}!</p>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to Your Dashboard, {displayName}!
              </h2>
              <p className="text-gray-600 mb-6">
                This is your personal workspace. Start creating and managing your collaborative lists.
              </p>
              <div className="mt-8">
                <p className="text-sm text-gray-500">
                  Dashboard features and content will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} CollaboList. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;