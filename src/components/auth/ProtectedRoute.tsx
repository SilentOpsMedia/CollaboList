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
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
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
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
