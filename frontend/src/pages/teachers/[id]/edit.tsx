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
import { Role, Teacher } from '@/lib/types';
import TeacherForm from '@/components/teachers/TeacherForm';
import AccessDenied from '@/components/layouts/AccessDenied';

const EditTeacherPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/teachers/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Teacher not found');
          }
          throw new Error('Failed to fetch teacher');
        }
        
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        console.error('Error fetching teacher:', err);
        setError(err.message || 'Failed to load teacher. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const handleSubmit = async (teacherData: any) => {
    if (!id || Array.isArray(id)) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update teacher');
      }
      
      const data = await response.json();
      setTeacher(data);
      setSuccess('Teacher updated successfully!');
      
      // Redirect to the teacher details page after a short delay
      setTimeout(() => {
        router.push(`/teachers/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating teacher:', err);
      setError(err.message || 'An error occurred while updating the teacher.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/teachers/${id}`);
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
            Back to Teacher Details
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Teacher: {teacher ? `${teacher.firstName} ${teacher.lastName}` : ''}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => document.getElementById('teacher-form-submit')?.click()}
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
        ) : !teacher ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Teacher not found.
          </Alert>
        ) : (
          <Paper sx={{ p: 3 }}>
            <TeacherForm 
              onSubmit={handleSubmit} 
              loading={submitting} 
              submitButtonId="teacher-form-submit"
              initialData={teacher}
            />
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default EditTeacherPage;

