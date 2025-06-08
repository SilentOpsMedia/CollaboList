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
  AlertTitle,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import UpdateEmailForm from '../components/settings/UpdateEmailForm';
import UpdatePasswordForm from '../components/settings/UpdatePasswordForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Container component="main" maxWidth="md">
        <Alert severity="error">You must be logged in to view this page.</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Account Settings
        </Typography>
        
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="settings tabs"
              variant="fullWidth"
            >
              <Tab label="Account" {...a11yProps(0)} />
              <Tab label="Security" {...a11yProps(1)} />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                <strong>Display Name:</strong> {user.displayName || 'Not set'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Account created:</strong> {user.createdAt instanceof Timestamp 
                  ? user.createdAt.toDate().toLocaleDateString() 
                  : new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Update Email Address
            </Typography>
            <Divider sx={{ my: 2 }} />
            <UpdateEmailForm currentEmail={user.email || ''} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ my: 2 }} />
            <UpdatePasswordForm />
            
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Security Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" paragraph>
                For security reasons, you'll need to confirm your current password when changing sensitive account information.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last sign-in: {user.metadata?.lastSignInTime && typeof user.metadata.lastSignInTime === 'string'
                  ? new Date(user.metadata.lastSignInTime).toLocaleString() 
                  : 'Unknown'}
              </Typography>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default SettingsPage;
