import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import CourseForm from '@/components/courses/CourseForm';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

const EditCoursePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const canEditCourse = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Course not found');
          }
          throw new Error('Failed to fetch course details');
        }
        
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmitSuccess = () => {
    router.push(`/courses/${id}`);
  };

  const handleBack = () => {
    router.push(`/courses/${id}`);
  };

  if (!canEditCourse) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Course Details
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Course
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : course ? (
            <CourseForm 
              initialData={course} 
              isEditing={true} 
              onSubmitSuccess={handleSubmitSuccess} 
            />
          ) : (
            !error && <Alert severity="info">Course not found</Alert>
          )}
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default EditCoursePage;

