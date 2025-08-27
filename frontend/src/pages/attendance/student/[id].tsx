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
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Student } from '@/lib/types';
import StudentAttendance from '@/components/attendance/StudentAttendance';
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

const StudentAttendancePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const isParent = user?.role === Role.PARENT;
  const isOwnRecord = user?.role === Role.STUDENT && user?.id === id;

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
        
        // For demo purposes, set mock data
        setStudent({
          id: id as string,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          gradeLevel: 9,
          status: 'Active',
          enrollmentDate: '2023-08-15'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const handleBack = () => {
    router.push('/attendance');
  };

  const handleDownloadReport = () => {
    alert('Download functionality would be implemented here.');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleSendNotification = () => {
    alert('Notification functionality would be implemented here.');
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isTeacher && !isParent && !isOwnRecord) {
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
            Back to Attendance
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Student Attendance
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadReport}
                sx={{ mr: 2 }}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrintReport}
              >
                Print
              </Button>
            </Box>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : !student ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Student not found.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Student Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {student.firstName} {student.lastName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>ID:</strong> {student.studentId || student.id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Grade Level:</strong> {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'Not assigned'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Status:</strong> {' '}
                      <Chip 
                        label={student.status || 'Active'} 
                        color={student.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Attendance Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Present:</strong> 42 days (84%)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Absent:</strong> 5 days (10%)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Tardy:</strong> 3 days (6%)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Total School Days:</strong> 50 days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Date Range
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: { mb: 2 }
                            }
                          }}
                        />
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small"
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </CardContent>
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
                <Tab label="Attendance Records" />
                <Tab label="Attendance Trends" />
                <Tab label="Class Breakdown" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <StudentAttendance 
                  studentId={student.id}
                  startDate={startDate}
                  endDate={endDate}
                />
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Attendance Trends
                </Typography>
                <Alert severity="info">
                  This section will display attendance trends and patterns over time, including charts and statistics.
                </Alert>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Attendance trend charts and visualizations will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Class Attendance Breakdown
                </Typography>
                <Alert severity="info">
                  This section will display attendance records broken down by class.
                </Alert>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Class-specific attendance records will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
            </Paper>
            
            {(isAdmin || isTeacher) && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSendNotification}
                >
                  Send Attendance Notification
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default StudentAttendancePage;

