import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to CollaboList
        </Typography>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Name:</strong> {user?.displayName || 'Not set'}
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/settings')}
            >
              Account Settings
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
