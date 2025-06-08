import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Divider, 
  Alert,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError("Passwords don't match");
    }
    
    if (!acceptedTerms) {
      return setError("You must accept the terms and conditions");
    }
    
    try {
      setError('');
      setLoading(true);
      await signUp(email, password);
      navigate('/onboarding'); // Or wherever you want to redirect after signup
    } catch (err) {
      console.error('Failed to create an account', err);
      setError('Failed to create an account. ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign in failed', err);
      setError('Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithApple();
      navigate('/dashboard');
    } catch (err) {
      console.error('Apple sign in failed', err);
      setError('Failed to sign up with Apple.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Create your account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        
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
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            error={password !== confirmPassword && confirmPassword.length > 0}
            helperText={
              password !== confirmPassword && confirmPassword.length > 0 
                ? "Passwords don't match" 
                : ""
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox 
                value="acceptTerms" 
                color="primary" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link href="/terms" target="_blank" rel="noopener">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" rel="noopener">
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mt: 2, mb: 2 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disabled={loading || !acceptedTerms || password !== confirmPassword}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
          
          <Divider sx={{ my: 2 }}>OR</Divider>
          
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                width={20} 
                height={20} 
              />
            }
          >
            Sign up with Google
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleAppleSignIn}
            disabled={loading}
            startIcon={
              <img 
                src="https://www.apple.com/favicon.ico" 
                alt="Apple" 
                width={20} 
                height={20} 
              />
            }
          >
            Sign up with Apple
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
