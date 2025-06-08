import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextField, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useForm, Controller, SubmitHandler, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Form validation schema
const schema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
}).required();

const UpdatePasswordForm: React.FC = () => {
  const { changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      await changePassword(data.currentPassword, data.newPassword);
      
      setSuccessMessage('Your password has been updated successfully.');
      reset();
    } catch (error) {
      console.error('Failed to update password:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      
      <Controller
        name="currentPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="Current Password"
            type="password"
            id="currentPassword"
            autoComplete="current-password"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message as string}
            disabled={isLoading}
          />
        )}
      />
      
      <Controller
        name="newPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message as string}
            disabled={isLoading}
          />
        )}
      />
      
      <Controller
        name="confirmNewPassword"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message as string}
            disabled={isLoading}
          />
        )}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
      </Button>
    </Box>
  );
};

export default UpdatePasswordForm;
