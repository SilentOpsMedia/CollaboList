import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  Button, 
  Alert,
  AlertTitle
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import UpdateEmailForm from '../components/settings/UpdateEmailForm';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Please sign in to access settings.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Email Address
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Current email: {user.email}
          </Typography>
          
          {!showEmailForm ? (
            <Button 
              variant="outlined" 
              onClick={() => setShowEmailForm(true)}
            >
              Change Email
            </Button>
          ) : (
            <Box sx={{ mt: 2 }}>
              <UpdateEmailForm 
                currentEmail={user.email} 
                onSuccess={() => setShowEmailForm(false)}
                onCancel={() => setShowEmailForm(false)}
              />
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Display Name: {user.displayName || 'Not set'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Account created: {user.createdAt instanceof Timestamp 
              ? user.createdAt.toDate().toLocaleDateString() 
              : new Date(user.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>Security Tips</AlertTitle>
          Always use a strong, unique password and enable two-factor authentication if available.
        </Alert>
        <Button 
          variant="outlined" 
          color="primary"
          href="/forgot-password"
        >
          Change Password
        </Button>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
