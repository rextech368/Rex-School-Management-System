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
import TeacherList from '@/components/teachers/TeacherList';
import AccessDenied from '@/components/layouts/AccessDenied';

const TeachersPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateTeacher = () => {
    router.push('/teachers/new');
  };

  const handleImportTeachers = () => {
    // This would typically open a modal or navigate to an import page
    alert('Import teachers functionality would be implemented here.');
  };

  const handleExportTeachers = () => {
    // This would typically trigger a download
    alert('Export teachers functionality would be implemented here.');
  };

  const handleManageAssignments = () => {
    router.push('/schedule/assignments');
  };

  // Check if user has permission to access this page
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Teacher & Staff Management
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTeacher}
            >
              Add Teacher/Staff
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Import Teachers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Import teacher records from CSV, Excel, or other formats.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleImportTeachers}>
                      Import
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Export Teachers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Export teacher records to CSV, Excel, or other formats.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleExportTeachers}>
                      Export
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class Assignments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage teacher assignments to classes and courses.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleManageAssignments}>
                      Manage Assignments
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
            
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TeacherList isAdmin={isAdmin} />
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default TeachersPage;

