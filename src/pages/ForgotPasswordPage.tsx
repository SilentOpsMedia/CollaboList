import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { sendPasswordResetEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return setError('Please enter your email address');
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await sendPasswordResetEmail(email);
      setMessage('Check your email for further instructions to reset your password.');
    } catch (err) {
      console.error('Failed to reset password', err);
      setError('Failed to send password reset email. Please try again.');
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
          }}
        >
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {message ? (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {message}
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
            </Box>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Sign In
            </Link>
          </Box>
        </Box>
      </Container>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
