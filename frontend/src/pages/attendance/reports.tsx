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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import AttendanceReport from '@/components/attendance/AttendanceReport';
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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
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

const AttendanceReportsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState<string>('class');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch classes and students from the API
        // const classesResponse = await fetch('/api/classes');
        // const studentsResponse = await fetch('/api/students');
        
        // if (!classesResponse.ok || !studentsResponse.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        
        // const classesData = await classesResponse.json();
        // const studentsData = await studentsResponse.json();
        
        // setClasses(classesData);
        // setStudents(studentsData);
        
        // For demo purposes, set mock data
        setClasses([
          {
            id: '1',
            courseName: 'Algebra I',
            courseCode: 'MATH101',
            termName: 'Fall 2023',
            teacherName: 'John Smith'
          },
          {
            id: '2',
            courseName: 'Biology',
            courseCode: 'SCI101',
            termName: 'Fall 2023',
            teacherName: 'Sarah Johnson'
          },
          {
            id: '3',
            courseName: 'English Literature',
            courseCode: 'ENG101',
            termName: 'Fall 2023',
            teacherName: 'Michael Williams'
          },
          {
            id: '4',
            courseName: 'World History',
            courseCode: 'HIST101',
            termName: 'Fall 2023',
            teacherName: 'Emily Brown'
          },
          {
            id: '5',
            courseName: 'Physical Education',
            courseCode: 'PE101',
            termName: 'Fall 2023',
            teacherName: 'David Jones'
          }
        ]);
        
        setStudents([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            gradeLevel: 9
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            gradeLevel: 10
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Johnson',
            gradeLevel: 11
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Williams',
            gradeLevel: 9
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Brown',
            gradeLevel: 12
          }
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReportTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setReportType(event.target.value as string);
    setReportGenerated(false);
  };

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
    setReportGenerated(false);
  };

  const handleStudentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStudent(event.target.value as string);
    setReportGenerated(false);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setReportGenerated(false);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setReportGenerated(false);
  };

  const handleBack = () => {
    router.push('/attendance');
  };

  const handleGenerateReport = () => {
    // Validate inputs
    if (reportType === 'class' && !selectedClass) {
      setError('Please select a class');
      return;
    }
    
    if (reportType === 'student' && !selectedStudent) {
      setError('Please select a student');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }
    
    if (startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }
    
    setError(null);
    setReportGenerated(true);
  };

  const handleDownloadReport = () => {
    alert('Download functionality would be implemented here.');
  };

  const handlePrintReport = () => {
    window.print();
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
              Attendance Reports
            </Typography>
            {reportGenerated && (
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
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="report-type-label">Report Type</InputLabel>
                    <Select
                      labelId="report-type-label"
                      value={reportType}
                      label="Report Type"
                      onChange={handleReportTypeChange}
                    >
                      <MenuItem value="class">Class Report</MenuItem>
                      <MenuItem value="student">Student Report</MenuItem>
                      <MenuItem value="summary">Summary Report</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {reportType === 'class' && (
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel id="class-select-label">Select Class</InputLabel>
                      <Select
                        labelId="class-select-label"
                        value={selectedClass}
                        label="Select Class"
                        onChange={handleClassChange}
                      >
                        {classes.map((cls) => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.courseName} ({cls.courseCode})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                
                {reportType === 'student' && (
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel id="student-select-label">Select Student</InputLabel>
                      <Select
                        labelId="student-select-label"
                        value={selectedStudent}
                        label="Select Student"
                        onChange={handleStudentChange}
                      >
                        {students.map((student) => (
                          <MenuItem key={student.id} value={student.id}>
                            {student.firstName} {student.lastName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                
                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      onClick={handleGenerateReport}
                    >
                      Generate Report
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {reportGenerated && (
              <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Report" />
                  <Tab label="Charts" />
                  <Tab label="Details" />
                </Tabs>
                
                <TabPanel value={tabValue} index={0}>
                  <AttendanceReport 
                    reportType={reportType}
                    classId={selectedClass}
                    studentId={selectedStudent}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </TabPanel>
                
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="h6" gutterBottom>
                    Attendance Charts
                  </Typography>
                  <Alert severity="info">
                    This section will display charts and visualizations of the attendance data.
                  </Alert>
                  <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Attendance charts and visualizations will be displayed here.
                    </Typography>
                  </Box>
                </TabPanel>
                
                <TabPanel value={tabValue} index={2}>
                  <Typography variant="h6" gutterBottom>
                    Detailed Attendance Records
                  </Typography>
                  <Alert severity="info">
                    This section will display detailed attendance records for the selected parameters.
                  </Alert>
                  <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Detailed attendance records will be displayed here.
                    </Typography>
                  </Box>
                </TabPanel>
              </Paper>
            )}
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default AttendanceReportsPage;

