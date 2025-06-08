import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  Link
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            maxWidth: 600,
            width: '100%',
            borderRadius: 2
          }}
        >
          <ErrorOutlineIcon 
            color="error" 
            sx={{ fontSize: 80, mb: 2 }} 
          />
          
          <Typography component="h1" variant="h3" gutterBottom>
            404 - Page Not Found
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            Oops! The page you're looking for doesn't exist or has been moved.
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
            The link you followed may be broken, or the page may have been removed.
            Please check the URL or return to the home page.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate(-1)}
              sx={{ minWidth: 150 }}
            >
              Go Back
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              component={RouterLink}
              to="/"
              sx={{ minWidth: 150 }}
            >
              Home Page
            </Button>
          </Box>
          
          <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Need help?{' '}
              <Link href="/contact" color="primary">
                Contact Support
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
