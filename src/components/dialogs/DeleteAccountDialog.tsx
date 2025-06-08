import React, { useState } from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  TextField, 
  Box, 
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

/**
 * A dialog component that confirms account deletion with password verification.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls the visibility of the dialog
 * @param {Function} props.onClose - Callback when dialog is closed
 * @param {Function} props.onConfirm - Callback when deletion is confirmed (receives password)
 * @returns {JSX.Element} The rendered DeleteAccountDialog component
 */
export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ 
  open, 
  onClose, 
  onConfirm 
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onConfirm(password);
      // onClose will be called after successful deletion
    } catch (err) {
      const error = err as Error;
      console.error('Account deletion failed:', error);
      setError(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="delete-account-dialog"
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="delete-account-dialog">
          Delete Your Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            <Typography variant="body1" color="error" fontWeight="bold" gutterBottom>
              Warning: This action cannot be undone.
            </Typography>
            <Typography variant="body2" gutterBottom>
              All your data, including lists, tasks, and account information will be permanently deleted.
            </Typography>
          </DialogContentText>
          
          <DialogContentText sx={{ mb: 2 }}>
            To confirm, please enter your password:
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            disabled={isLoading}
            error={!!error}
            helperText={error}
          />
          
          {error && (
            <Box mt={2}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          
          <Box mt={3}>
            <Typography variant="caption" color="textSecondary">
              Note: This action will sign you out of all devices and you won't be able to recover your account.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={onClose} 
            color="inherit"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="error"
            variant="contained"
            disabled={isLoading || !password.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
