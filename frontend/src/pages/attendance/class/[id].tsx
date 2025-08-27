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
import { Role, Class } from '@/lib/types';
import ClassAttendance from '@/components/attendance/ClassAttendance';
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

const ClassAttendancePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<Class | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;

  useEffect(() => {
    const fetchClass = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/classes/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Class not found');
          }
          throw new Error('Failed to fetch class');
        }
        
        const data = await response.json();
        setClassData(data);
      } catch (err) {
        console.error('Error fetching class:', err);
        setError(err.message || 'Failed to load class. Please try again later.');
        
        // For demo purposes, set mock data
        setClassData({
          id: id as string,
          courseId: '1',
          courseName: 'Algebra I',
          courseCode: 'MATH101',
          termId: '1',
          termName: 'Fall 2023',
          teacherId: '1',
          teacherName: 'John Smith',
          room: 'Room 101',
          schedule: 'MWF 9:00 AM - 10:00 AM',
          capacity: 30,
          enrolledCount: 25,
          waitlistCount: 0,
          status: 'active'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
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

  const handleRecordAttendance = () => {
    router.push(`/attendance/record?classId=${id}`);
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isTeacher) {
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
              Class Attendance
            </Typography>
            <Box>
              <Button
                variant="contained"
                onClick={handleRecordAttendance}
                sx={{ mr: 2 }}
              >
                Record Attendance
              </Button>
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
        ) : !classData ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Class not found.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Course:</strong> {classData.courseName} ({classData.courseCode})
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Term:</strong> {classData.termName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Teacher:</strong> {classData.teacherName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Schedule:</strong> {classData.schedule}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Room:</strong> {classData.room}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Enrollment:</strong> {classData.enrolledCount}/{classData.capacity}
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
                      <strong>Average Attendance Rate:</strong> 92%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Perfect Attendance:</strong> 18 students (72%)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Chronic Absences:</strong> 2 students (8%)
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Total Class Days:</strong> 25 days
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
                <Tab label="Student Breakdown" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <ClassAttendance 
                  classId={classData.id}
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
                  Student Attendance Breakdown
                </Typography>
                <Alert severity="info">
                  This section will display attendance records broken down by student.
                </Alert>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Student-specific attendance records will be displayed here.
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

export default ClassAttendancePage;

