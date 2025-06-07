import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, TextField, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useForm, Controller, SubmitHandler, FieldValues, ControllerRenderProps, FieldPath } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Form validation schema
// Define the form data type
interface FormData extends FieldValues {
  newEmail: string;
  currentPassword: string;
  currentEmail: string;
}

// Create the validation schema
const schema = yup.object({
  newEmail: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .test('different-email', 'New email must be different from current email', function (value) {
      return value !== this.parent.currentEmail;
    }),
  currentPassword: yup.string().required('Current password is required'),
  currentEmail: yup.string().required(),
}).required();

interface UpdateEmailFormProps {
  currentEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UpdateEmailForm: React.FC<UpdateEmailFormProps> = ({ currentEmail, onSuccess, onCancel }) => {
  const { updateEmail, loading, error } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      newEmail: '',
      currentPassword: '',
      currentEmail: currentEmail,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      await updateEmail(data.newEmail, data.currentPassword);
      setSuccessMessage('Your email address has been updated successfully.');
      reset({ newEmail: '', currentPassword: '' });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the auth context
      console.error('Error updating email:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Update Email Address
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      
      <Controller
        name="newEmail"
        control={control}
        render={({ field }: { field: ControllerRenderProps<FormData, 'newEmail'> }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="newEmail"
            label="New Email Address"
            type="email"
            autoComplete="email"
            error={!!errors.newEmail}
            helperText={errors.newEmail?.message}
            disabled={loading}
          />
        )}
      />
      
      <Controller
        name="currentPassword"
        control={control}
        render={({ field }: { field: ControllerRenderProps<FormData, 'currentPassword'> }) => (
          <TextField
            {...field}
            margin="normal"
            fullWidth
            id="currentPassword"
            label="Current Password"
            type="password"
            autoComplete="current-password"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            disabled={loading}
          />
        )}
      />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Email'}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateEmailForm;
