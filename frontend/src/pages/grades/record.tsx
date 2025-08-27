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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import GradeRecorder from '@/components/grades/GradeRecorder';
import AccessDenied from '@/components/layouts/AccessDenied';

const RecordGradesPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classSelected, setClassSelected] = useState(false);
  const [assignmentSelected, setAssignmentSelected] = useState(false);
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

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!selectedClass) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch assignments from the API
        // const response = await fetch(`/api/classes/${selectedClass}/assignments`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch assignments');
        // }
        // const data = await response.json();
        // setAssignments(data);
        
        // For demo purposes, set mock data
        setAssignments([
          {
            id: '1',
            title: 'Chapter 1 Homework',
            type: 'homework',
            dueDate: '2023-09-15',
            maxScore: 100,
            weight: 10,
            status: 'published'
          },
          {
            id: '2',
            title: 'Quiz 1',
            type: 'quiz',
            dueDate: '2023-09-20',
            maxScore: 50,
            weight: 15,
            status: 'published'
          },
          {
            id: '3',
            title: 'Midterm Exam',
            type: 'test',
            dueDate: '2023-10-15',
            maxScore: 100,
            weight: 25,
            status: 'published'
          },
          {
            id: '4',
            title: 'Research Project',
            type: 'project',
            dueDate: '2023-11-15',
            maxScore: 100,
            weight: 20,
            status: 'published'
          },
          {
            id: '5',
            title: 'Final Exam',
            type: 'test',
            dueDate: '2023-12-15',
            maxScore: 100,
            weight: 30,
            status: 'published'
          }
        ]);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [selectedClass]);

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClass(event.target.value as string);
    setSelectedAssignment('');
    setClassSelected(true);
    setAssignmentSelected(false);
  };

  const handleAssignmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAssignment(event.target.value as string);
    setAssignmentSelected(true);
  };

  const handleBack = () => {
    router.push('/grades');
  };

  const handleSubmit = async (gradeData: any) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the grade data to the API
      // const response = await fetch('/api/grades', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     classId: selectedClass,
      //     assignmentId: selectedAssignment,
      //     grades: gradeData
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to save grades');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Grades recorded successfully!');
      
      // Redirect to the grades page after a short delay
      setTimeout(() => {
        router.push('/grades');
      }, 1500);
    } catch (err) {
      console.error('Error recording grades:', err);
      setError(err.message || 'An error occurred while recording grades.');
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Record Grades
            </Typography>
            {assignmentSelected && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => document.getElementById('grade-form-submit')?.click()}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Grades'}
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
                <FormControl fullWidth disabled={!selectedClass}>
                  <InputLabel id="assignment-select-label">Select Assignment</InputLabel>
                  <Select
                    labelId="assignment-select-label"
                    value={selectedAssignment}
                    label="Select Assignment"
                    onChange={handleAssignmentChange}
                  >
                    {assignments.map((assignment) => (
                      <MenuItem key={assignment.id} value={assignment.id}>
                        {assignment.title} ({assignment.type}) - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {selectedClass && selectedAssignment && (
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
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Assignment:</strong> {assignments.find(a => a.id === selectedAssignment)?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {assignments.find(a => a.id === selectedAssignment)?.type} | 
                    Due Date: {new Date(assignments.find(a => a.id === selectedAssignment)?.dueDate).toLocaleDateString()} | 
                    Max Score: {assignments.find(a => a.id === selectedAssignment)?.maxScore} | 
                    Weight: {assignments.find(a => a.id === selectedAssignment)?.weight}%
                  </Typography>
                </Box>
                
                <GradeRecorder 
                  classId={selectedClass} 
                  assignmentId={selectedAssignment}
                  maxScore={assignments.find(a => a.id === selectedAssignment)?.maxScore}
                  onSubmit={handleSubmit}
                  loading={submitting}
                  submitButtonId="grade-form-submit"
                />
              </>
            )}
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default RecordGradesPage;

