import React, { useState, useEffect } from 'react';
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
import { Role, Term } from '@/lib/types';
import TermForm from '@/components/terms/TermForm';
import AccessDenied from '@/components/layouts/AccessDenied';

const EditTermPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [term, setTerm] = useState<Term | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchTerm = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/terms/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Term not found');
          }
          throw new Error('Failed to fetch term');
        }
        
        const data = await response.json();
        setTerm(data);
      } catch (err) {
        console.error('Error fetching term:', err);
        setError(err.message || 'Failed to load term. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [id]);

  const handleSubmit = async (termData: any) => {
    if (!id || Array.isArray(id)) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/terms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(termData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update term');
      }
      
      const data = await response.json();
      setTerm(data);
      setSuccess('Term updated successfully!');
      
      // Redirect to the term details page after a short delay
      setTimeout(() => {
        router.push(`/terms/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating term:', err);
      setError(err.message || 'An error occurred while updating the term.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/terms/${id}`);
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
            Back to Term Details
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Term: {term?.name || ''}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => document.getElementById('term-form-submit')?.click()}
              disabled={loading || submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : !term ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Term not found.
          </Alert>
        ) : (
          <Paper sx={{ p: 3 }}>
            <TermForm 
              onSubmit={handleSubmit} 
              loading={submitting} 
              submitButtonId="term-form-submit"
              initialData={term}
            />
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default EditTermPage;

