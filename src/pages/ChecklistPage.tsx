import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';

/**
 * ChecklistPage Component
 * 
 * Displays a single checklist or the list of checklists
 * Protected route - only accessible to authenticated users
 */
const ChecklistPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {id ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Checklist #{id}
            </Typography>
            <Typography variant="body1">
              This is where you can view and edit your checklist.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              My Checklists
            </Typography>
            <Typography variant="body1">
              This is where you can manage all your checklists.
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ChecklistPage;
