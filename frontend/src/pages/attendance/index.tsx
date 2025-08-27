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
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
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

const AttendancePage: NextPage = () => {
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

  const handleRecordAttendance = () => {
    router.push('/attendance/record');
  };

  const handleViewReports = () => {
    router.push('/attendance/reports');
  };

  const handleViewStudentAttendance = () => {
    // This would typically open a search or selection dialog
    router.push('/attendance/student');
  };

  const handleViewClassAttendance = () => {
    // This would typically open a search or selection dialog
    router.push('/attendance/class');
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
            Attendance Management
          </Typography>
          {(isAdmin || isTeacher) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleRecordAttendance}
            >
              Record Attendance
            </Button>
          )}
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
                      Record Attendance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Take attendance for classes and record student presence, absence, or tardiness.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleRecordAttendance}>
                      Record Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Attendance Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate and view attendance reports for classes, students, or time periods.
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
                      Student Attendance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View attendance records for individual students across all classes.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewStudentAttendance}>
                      View Student
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class Attendance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View attendance records for entire classes over time.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewClassAttendance}>
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
                <Tab label="Recent Attendance" />
                <Tab label="Attendance Trends" />
                <Tab label="Notifications" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Recent Attendance Records
                </Typography>
                <Alert severity="info">
                  This section will display recent attendance records taken by the current user or for classes relevant to the user.
                </Alert>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Recent attendance data will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Attendance Trends
                </Typography>
                <Alert severity="info">
                  This section will display attendance trends and patterns over time, including charts and statistics.
                </Alert>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Attendance trend charts and visualizations will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Attendance Notifications
                </Typography>
                <Alert severity="info">
                  This section will display notifications related to attendance, such as students with excessive absences.
                </Alert>
                <Box sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Attendance notifications and alerts will be displayed here.
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

export default AttendancePage;

