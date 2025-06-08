import React, { useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { auth } from './lib/firebase';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  const { user, loading } = useAuth();

  const handleSignOut = useCallback(async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <DashboardPage onSignOut={handleSignOut} />
            ) : (
              <Navigate to="/login" state={{ from: '/dashboard' }} replace />
            )
          } 
        />
        
        {/* Redirect root to dashboard or login based on auth status */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
