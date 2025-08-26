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
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import StudentList from '@/components/students/StudentList';
import AccessDenied from '@/components/layouts/AccessDenied';

const StudentsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateStudent = () => {
    router.push('/students/new');
  };

  const handleImportStudents = () => {
    // This would typically open a modal or navigate to an import page
    alert('Import students functionality would be implemented here.');
  };

  const handleExportStudents = () => {
    // This would typically trigger a download
    alert('Export students functionality would be implemented here.');
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isTeacher) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Student Management
          </Typography>
          <Box>
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateStudent}
              >
                Add Student
              </Button>
            )}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {isAdmin && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Import Students
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Import student records from CSV, Excel, or other formats.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={handleImportStudents}>
                        Import
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Export Students
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Export student records to CSV, Excel, or other formats.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={handleExportStudents}>
                        Export
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Bulk Actions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Perform actions on multiple students at once.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push('/students/bulk')}>
                        Bulk Actions
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            )}
            
            <Paper sx={{ width: '100%', mb: 2 }}>
              <StudentList 
                isAdmin={isAdmin} 
                teacherId={isTeacher ? user?.id : undefined} 
              />
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default StudentsPage;

