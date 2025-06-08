import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireEmailVerification?: boolean;
}

/**
 * A protected route that checks if the user is authenticated before rendering its children.
 * If the user is not authenticated, they will be redirected to the login page.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render if authenticated
 * @param {boolean} [props.requireEmailVerification=false] - If true, requires the user's email to be verified
 * @returns {JSX.Element} The protected route component
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { children, requireEmailVerification = false } = props;
  const { user, loading, isInitialized } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Auth state:', { 
    user: !!user, 
    loading, 
    isInitialized,
    path: location.pathname,
    requireEmailVerification,
    emailVerified: user?.emailVerified
  });

  if (loading || !isInitialized) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // If we're not yet initialized, show loading state
    if (!isInitialized) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      );
    }
    
    // Redirect to login with the current location to return to after login
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !user.emailVerified) {
    console.log('ProtectedRoute: Email not verified, redirecting to verify-email');
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
