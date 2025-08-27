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
import { Role, Student } from '@/lib/types';
import StudentForm from '@/components/students/StudentForm';
import AccessDenied from '@/components/layouts/AccessDenied';

const EditStudentPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/students/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Student not found');
          }
          throw new Error('Failed to fetch student');
        }
        
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student:', err);
        setError(err.message || 'Failed to load student. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleSubmit = async (studentData: any) => {
    if (!id || Array.isArray(id)) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update student');
      }
      
      const data = await response.json();
      setStudent(data);
      setSuccess('Student updated successfully!');
      
      // Redirect to the student details page after a short delay
      setTimeout(() => {
        router.push(`/students/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error updating student:', err);
      setError(err.message || 'An error occurred while updating the student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/students/${id}`);
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
            Back to Student Details
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Student: {student ? `${student.firstName} ${student.lastName}` : ''}
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => document.getElementById('student-form-submit')?.click()}
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
        ) : !student ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Student not found.
          </Alert>
        ) : (
          <Paper sx={{ p: 3 }}>
            <StudentForm 
              onSubmit={handleSubmit} 
              loading={submitting} 
              submitButtonId="student-form-submit"
              initialData={student}
            />
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default EditStudentPage;

