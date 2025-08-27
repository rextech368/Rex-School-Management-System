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
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import AttendanceRecorder from '@/components/attendance/AttendanceRecorder';
import AccessDenied from '@/components/layouts/AccessDenied';

const RecordAttendancePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [classes, setClasses] = useState<any[]>([]);
  const [classSelected, setClassSelected] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch classes from the API
        // const response = await fetch('/api/classes');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch classes');
        // }
        // const data = await response.json();
        // setClasses(data);
        
        // For demo purposes, set mock data
        setClasses([
          {
            id: '1',
            courseName: 'Algebra I',
            courseCode: 'MATH101',
            termName: 'Fall 2023',
            teacherName: 'John Smith',
            schedule: 'MWF 9:00 AM - 10:00 AM',
            room: 'Room 101'
          },
          {
            id: '2',
            courseName: 'Biology',
            courseCode: 'SCI101',
            termName: 'Fall 2023',
            teacherName: 'Sarah Johnson',
            schedule: 'TTh 11:00 AM - 12:30 PM',
            room: 'Room 102'
          },
          {
            id: '3',
            courseName: 'English Literature',
            courseCode: 'ENG101',
            termName: 'Fall 2023',
            teacherName: 'Michael Williams',
            schedule: 'MWF 1:00 PM - 2:00 PM',
            room: 'Room 103'
          },
          {
            id: '4',
            courseName: 'World History',
            courseCode: 'HIST101',
            termName: 'Fall 2023',
            teacherName: 'Emily Brown',
            schedule: 'TTh 2:00 PM - 3:30 PM',
            room: 'Room 104'
          },
          {
            id: '5',
            courseName: 'Physical Education',
            courseCode: 'PE101',
            termName: 'Fall 2023',
            teacherName: 'David Jones',
            schedule: 'F 3:00 PM - 4:00 PM',
            room: 'Room 105'
          }
        ]);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
    setClassSelected(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleBack = () => {
    router.push('/attendance');
  };

  const handleSubmit = async (attendanceData: any) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the attendance data to the API
      // const response = await fetch('/api/attendance', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     classId: selectedClass,
      //     date: selectedDate,
      //     records: attendanceData
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save attendance');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Attendance recorded successfully!');
      
      // Redirect to the attendance page after a short delay
      setTimeout(() => {
        router.push('/attendance');
      }, 1500);
    } catch (err) {
      console.error('Error recording attendance:', err);
      setError(err.message || 'An error occurred while recording attendance.');
    } finally {
      setSubmitting(false);
    }
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
              Record Attendance
            </Typography>
            {classSelected && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => document.getElementById('attendance-form-submit')?.click()}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Attendance'}
              </Button>
            )}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
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
                        {cls.courseName} ({cls.courseCode}) - {cls.termName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Attendance Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            
            {selectedClass && (
              <>
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {classes.find(cls => cls.id === selectedClass)?.courseName} ({classes.find(cls => cls.id === selectedClass)?.courseCode})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teacher: {classes.find(cls => cls.id === selectedClass)?.teacherName} | 
                    Room: {classes.find(cls => cls.id === selectedClass)?.room} | 
                    Schedule: {classes.find(cls => cls.id === selectedClass)?.schedule}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {selectedDate?.toLocaleDateString()}
                  </Typography>
                </Box>
                
                <AttendanceRecorder 
                  classId={selectedClass} 
                  date={selectedDate} 
                  onSubmit={handleSubmit}
                  loading={submitting}
                  submitButtonId="attendance-form-submit"
                />
              </>
            )}
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default RecordAttendancePage;

