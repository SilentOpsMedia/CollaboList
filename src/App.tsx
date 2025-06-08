/**
 * @file src/App.tsx
 * @description Root component and routing configuration for the CollaboList application
 * 
 * This is the root component that sets up the application's routing structure using React Router.
 * It manages the following routes:
 * - `/login`: Authentication page for existing users
 * - `/signup`: Registration page for new users
 * - `/dashboard`: Main application interface (protected route)
 * - `/settings`: User settings page (protected route)
 * - `/`: Redirects to `/dashboard` if authenticated, otherwise to `/login`
 * 
 * The component uses `AuthLayout` for authentication pages and `ProtectedRoute` to protect
 * routes that require authentication.
 * 
 * @see https://reactrouter.com/
 * @see https://reactjs.org/docs/typechecking-with-proptypes.html
 * 
 * @module App
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';

// Pages - Using dynamic imports with React.lazy for code splitting
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/VerifyEmailPage'));
const ChecklistPage = React.lazy(() => import('./pages/ChecklistPage'));

// Components
const ProtectedRoute = React.lazy(() => import('./components/auth/ProtectedRoute'));
const AuthLayout = React.lazy(() => import('./components/auth/AuthLayout'));

// Loading component for Suspense fallback
const LoadingFallback: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
  }}>
    <div>Loading...</div>
  </div>
);

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

/**
 * Main App Component
 * 
 * Sets up the application routing using React Router and provides the theme and auth context.
 * Wraps authentication routes in AuthLayout for consistent styling.
 * 
 * @returns {JSX.Element} The root application component with routing configuration
 */
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          } />
          
          <Route path="/signup" element={
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          } />
          
          <Route path="/forgot-password" element={
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          } />
          
          <Route path="/verify-email" element={
            <AuthLayout>
              <VerifyEmailPage />
            </AuthLayout>
          } />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/dashboard" 
              element={
                <React.Suspense fallback={<div>Loading dashboard...</div>}>
                  <div style={{ padding: '2rem', border: '2px solid red' }}>
                    🚀 Dashboard route is working!
                    <DashboardPage />
                  </div>
                </React.Suspense>
              } 
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/checklists" element={<ChecklistPage />} />
            <Route path="/checklists/:id" element={<ChecklistPage />} />
            
            {/* Redirect root to dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all route for protected paths */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
          
          {/* Public routes */}
          <Route path="/" element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }>
            <Route index element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch-all route for non-existent public paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
