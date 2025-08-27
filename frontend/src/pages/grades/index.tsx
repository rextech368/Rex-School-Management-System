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
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`grades-tabpanel-${index}`}
      aria-labelledby={`grades-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const GradesPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRecordGrades = () => {
    router.push('/grades/record');
  };

  const handleViewReports = () => {
    router.push('/grades/reports');
  };

  const handleViewStudentGrades = () => {
    // This would typically open a search or selection dialog
    router.push('/grades/student');
  };

  const handleViewClassGrades = () => {
    // This would typically open a search or selection dialog
    router.push('/grades/class');
  };

  const handleCreateAssignment = () => {
    router.push('/grades/assignments/new');
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
            Grade Management
          </Typography>
          <Box>
            {(isAdmin || isTeacher) && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateAssignment}
                  sx={{ mr: 2 }}
                >
                  Create Assignment
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleRecordGrades}
                >
                  Record Grades
                </Button>
              </>
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
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Record Grades
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enter grades for assignments, quizzes, tests, and other assessments.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleRecordGrades}>
                      Record Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Grade Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate and view grade reports for classes, students, or time periods.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewReports}>
                      View Reports
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Student Grades
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View grade records for individual students across all classes.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewStudentGrades}>
                      View Student
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class Grades
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View grade records for entire classes and assignments.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewClassGrades}>
                      View Class
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
            
            <Paper sx={{ width: '100%', mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Recent Assignments" />
                <Tab label="Grade Distribution" />
                <Tab label="Academic Standing" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Recent Assignments
                </Typography>
                <Alert severity="info">
                  This section will display recent assignments created by the current user or for classes relevant to the user.
                </Alert>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Recent assignment data will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <Alert severity="info">
                  This section will display grade distribution and patterns, including charts and statistics.
                </Alert>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Grade distribution charts and visualizations will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Academic Standing
                </Typography>
                <Alert severity="info">
                  This section will display academic standing information, such as students at risk of failing.
                </Alert>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Academic standing information and alerts will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default GradesPage;

