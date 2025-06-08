import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateEmailForm from '../components/settings/UpdateEmailForm';
import UpdatePasswordForm from '../components/settings/UpdatePasswordForm';
import { DeleteAccountDialog } from '../components/dialogs/DeleteAccountDialog';

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
  const { user, deleteUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async (password: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Delete the user account
      await deleteUser(password);
      
      // Sign out the user after successful deletion
      await signOut();
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
      throw err; // Re-throw to be handled by the dialog
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleOpenDeleteDialog = () => {
    setError(null);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
    }
  };

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
              <Typography variant="body2" color="text.secondary" paragraph>
                Last sign-in: {user.metadata?.lastSignInTime && typeof user.metadata.lastSignInTime === 'string'
                  ? new Date(user.metadata.lastSignInTime).toLocaleString() 
                  : 'Unknown'}
              </Typography>
              
              <Divider sx={{ my: 4 }} />
              
              <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                <CardContent>
                  <Typography variant="h6" color="error" gutterBottom>
                    Danger Zone
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Once you delete your account, there is no going back. Please be certain.
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenDeleteDialog}
                    disabled={isDeleting}
                  >
                    Delete My Account
                  </Button>
                </CardActions>
              </Card>
            </Box>
            
            <DeleteAccountDialog 
              open={deleteDialogOpen}
              onClose={handleCloseDeleteDialog}
              onConfirm={handleDeleteAccount}
            />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default SettingsPage;
