import React from 'react';
import { NextPage } from 'next';
import { Container, Typography, Paper, Box } from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import CourseForm from '@/components/courses/CourseForm';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import { useRouter } from 'next/router';
import AccessDenied from '@/components/layouts/AccessDenied';

const NewCoursePage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  const canCreateCourse = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  const handleSubmitSuccess = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  if (!canCreateCourse) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Course
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <CourseForm onSubmitSuccess={handleSubmitSuccess} />
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default NewCoursePage;

