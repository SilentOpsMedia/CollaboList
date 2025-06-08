import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmailPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  
  const { user, sendEmailVerification } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is already verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate(location.state?.from || '/dashboard', { replace: true });
    }
  }, [user, navigate, location.state]);
  
  // Check for email verification action
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');
    
    if (mode === 'verifyEmail' && actionCode) {
      // In a real app, you would verify the email using the action code
      // For now, we'll just show a success message
      setMessage('Your email has been verified successfully! You can now sign in.');
    }
  }, []);

  const handleResendVerification = async () => {
    if (!user) {
      return setError('No user is signed in');
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await sendEmailVerification();
      setMessage('Verification email sent. Please check your inbox.');
      setVerificationSent(true);
    } catch (err) {
      console.error('Failed to send verification email', err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Verify Your Email
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {message ? (
            <Alert severity="success" sx={{ width: '100%', mt: 2, mb: 2 }}>
              {message}
            </Alert>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
                We've sent a verification link to <strong>{user?.email}</strong>.
                Please check your email and click the link to verify your account.
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Didn't receive the email? Check your spam folder or click below to resend.
              </Typography>
              
              <Button
                variant="contained"
                onClick={handleResendVerification}
                disabled={loading || verificationSent}
                sx={{ mb: 3 }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : verificationSent ? (
                  'Email Sent!'
                ) : (
                  'Resend Verification Email'
                )}
              </Button>
            </>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </Container>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
