/**
 * Main Application Component
 * 
 * This is the root component of the CollaboList application.
 * It sets up the routing configuration for the entire application.
 * 
 * Routes:
 * - /login: Login page for existing users
 * - /signup: Registration page for new users
 * - /dashboard: Main application dashboard (protected route)
 * - /: Redirects to /login by default
 */

import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout and Page Components
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';

/**
 * Main App Component
 * 
 * Sets up the application routing using React Router.
 * Wraps authentication routes in AuthLayout for consistent styling.
 * 
 * @returns {JSX.Element} The root application component with routing configuration
 */
const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout>
            <SignUp />
          </AuthLayout>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
