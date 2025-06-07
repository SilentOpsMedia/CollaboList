/**
 * @file src/App.tsx
 * @description Root component and routing configuration for the CollaboList application
 * 
 * This is the root component that sets up the application's routing structure using React Router.
 * It manages the following routes:
 * - `/login`: Authentication page for existing users
 * - `/signup`: Registration page for new users
 * - `/dashboard`: Main application interface (protected route)
 * - `/`: Redirects to `/login` by default
 * 
 * The component wraps authentication-related routes in an `AuthLayout` for consistent styling
 * and applies global styles from `App.css`.
 * 
 * @see https://reactrouter.com/
 * @see https://reactjs.org/docs/typechecking-with-proptypes.html
 * 
 * @module App
 */

import React from 'react';
import './App.css';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layout and Page Components
import AuthLayout from './components/auth/AuthLayout';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import SettingsPage from './pages/SettingsPage';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

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
        {/* Public routes */}
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
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
