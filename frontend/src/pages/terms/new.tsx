import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Button,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import TermForm from '@/components/terms/TermForm';
import AccessDenied from '@/components/layouts/AccessDenied';

const NewTermPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  const handleSubmit = async (termData: any) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(termData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create term');
      }
      
      const data = await response.json();
      setSuccess('Term created successfully!');
      
      // Redirect to the term details page after a short delay
      setTimeout(() => {
        router.push(`/terms/${data.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating term:', err);
      setError(err.message || 'An error occurred while creating the term.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/terms');
  };

  // Check if user has permission to access this page
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleCancel}
            sx={{ mb: 2 }}
          >
            Back to Terms
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Academic Term
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => document.getElementById('term-form-submit')?.click()}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Term'}
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        <Paper sx={{ p: 3 }}>
          <TermForm 
            onSubmit={handleSubmit} 
            loading={loading} 
            submitButtonId="term-form-submit"
          />
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default NewTermPage;

