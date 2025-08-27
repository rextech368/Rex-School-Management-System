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
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

const NewAssignmentPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  
  // Form state
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('homework');
  const [dueDate, setDueDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 7)));
  const [maxScore, setMaxScore] = useState<string>('100');
  const [weight, setWeight] = useState<string>('10');
  const [publishImmediately, setPublishImmediately] = useState<boolean>(false);
  
  // Form validation
  const [titleError, setTitleError] = useState<string>('');
  const [maxScoreError, setMaxScoreError] = useState<string>('');
  const [weightError, setWeightError] = useState<string>('');
  
  const router = useRouter();
  const { classId } = router.query;
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
        
        // If classId is provided in the URL, set it as the selected class
        if (classId && !Array.isArray(classId)) {
          setSelectedClass(classId);
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [classId]);

  const validateForm = () => {
    let isValid = true;
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    // Validate max score
    if (!maxScore) {
      setMaxScoreError('Max score is required');
      isValid = false;
    } else if (isNaN(Number(maxScore)) || Number(maxScore) <= 0) {
      setMaxScoreError('Max score must be a positive number');
      isValid = false;
    } else {
      setMaxScoreError('');
    }
    
    // Validate weight
    if (!weight) {
      setWeightError('Weight is required');
      isValid = false;
    } else if (isNaN(Number(weight)) || Number(weight) < 0 || Number(weight) > 100) {
      setWeightError('Weight must be a number between 0 and 100');
      isValid = false;
    } else {
      setWeightError('');
    }
    
    return isValid;
  };

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
  };

  const handleBack = () => {
    router.push('/grades');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the assignment data to the API
      // const response = await fetch('/api/assignments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     classId: selectedClass,
      //     title,
      //     description,
      //     type,
      //     dueDate,
      //     maxScore: Number(maxScore),
      //     weight: Number(weight),
      //     status: publishImmediately ? 'published' : 'draft'
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create assignment');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Assignment created successfully!');
      
      // Redirect to the class grades page after a short delay
      setTimeout(() => {
        router.push(`/grades/class/${selectedClass}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err.message || 'An error occurred while creating the assignment.');
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
            Back to Grades
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Assignment
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!selectedClass}>
                    <InputLabel id="class-select-label">Select Class</InputLabel>
                    <Select
                      labelId="class-select-label"
                      value={selectedClass}
                      label="Select Class"
                      onChange={handleClassChange}
                      required
                    >
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.courseName} ({cls.courseCode}) - {cls.termName}
                        </MenuItem>
                      ))}
                    </Select>
                    {!selectedClass && (
                      <FormHelperText>Please select a class</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Assignment Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    error={!!titleError}
                    helperText={titleError}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="type-select-label">Assignment Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      value={type}
                      label="Assignment Type"
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem value="homework">Homework</MenuItem>
                      <MenuItem value="quiz">Quiz</MenuItem>
                      <MenuItem value="test">Test</MenuItem>
                      <MenuItem value="project">Project</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Due Date"
                      value={dueDate}
                      onChange={(date) => setDueDate(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Score"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    type="number"
                    required
                    error={!!maxScoreError}
                    helperText={maxScoreError}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Weight (%)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    required
                    error={!!weightError}
                    helperText={weightError}
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={publishImmediately}
                        onChange={(e) => setPublishImmediately(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Publish immediately (otherwise saved as draft)"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={submitting || !selectedClass}
                    >
                      {submitting ? 'Creating...' : 'Create Assignment'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default NewAssignmentPage;

