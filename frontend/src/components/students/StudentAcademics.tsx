import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { Student } from '@/lib/types';

interface StudentAcademicsProps {
  student: Student;
}

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
      id={`academics-tabpanel-${index}`}
      aria-labelledby={`academics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Enrollment {
  id: string;
  className: string;
  courseCode: string;
  term: string;
  status: string;
  grade?: string;
}

interface Transcript {
  term: string;
  year: string;
  courses: {
    courseCode: string;
    courseName: string;
    grade: string;
    credits: number;
  }[];
  gpa: number;
}

const StudentAcademics: React.FC<StudentAcademicsProps> = ({ student }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch this data from the API
        // const response = await fetch(`/api/students/${student.id}/academics`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch academic data');
        // }
        // const data = await response.json();
        // setEnrollments(data.enrollments);
        // setTranscripts(data.transcripts);
        
        // For demo purposes, set mock data
        setEnrollments([
          {
            id: '1',
            className: 'Algebra I',
            courseCode: 'MATH101',
            term: 'Fall 2023',
            status: 'Enrolled',
            grade: 'A'
          },
          {
            id: '2',
            className: 'Biology',
            courseCode: 'SCI101',
            term: 'Fall 2023',
            status: 'Enrolled',
            grade: 'B+'
          },
          {
            id: '3',
            className: 'English Literature',
            courseCode: 'ENG101',
            term: 'Fall 2023',
            status: 'Enrolled',
            grade: 'A-'
          },
          {
            id: '4',
            className: 'World History',
            courseCode: 'HIST101',
            term: 'Fall 2023',
            status: 'Enrolled',
            grade: 'B'
          },
          {
            id: '5',
            className: 'Physical Education',
            courseCode: 'PE101',
            term: 'Fall 2023',
            status: 'Enrolled',
            grade: 'A'
          }
        ]);
        
        setTranscripts([
          {
            term: 'Spring',
            year: '2023',
            courses: [
              {
                courseCode: 'MATH100',
                courseName: 'Pre-Algebra',
                grade: 'A',
                credits: 1
              },
              {
                courseCode: 'SCI100',
                courseName: 'Introduction to Science',
                grade: 'A-',
                credits: 1
              },
              {
                courseCode: 'ENG100',
                courseName: 'English Composition',
                grade: 'B+',
                credits: 1
              },
              {
                courseCode: 'HIST100',
                courseName: 'American History',
                grade: 'B',
                credits: 1
              },
              {
                courseCode: 'PE100',
                courseName: 'Physical Education',
                grade: 'A',
                credits: 0.5
              }
            ],
            gpa: 3.7
          }
        ]);
      } catch (err) {
        console.error('Error fetching academic data:', err);
        setError('Failed to load academic data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicData();
  }, [student.id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateGPA = (transcript: Transcript) => {
    const totalCredits = transcript.courses.reduce((sum, course) => sum + course.credits, 0);
    const totalPoints = transcript.courses.reduce((sum, course) => {
      const gradePoints = 
        course.grade === 'A' ? 4.0 :
        course.grade === 'A-' ? 3.7 :
        course.grade === 'B+' ? 3.3 :
        course.grade === 'B' ? 3.0 :
        course.grade === 'B-' ? 2.7 :
        course.grade === 'C+' ? 2.3 :
        course.grade === 'C' ? 2.0 :
        course.grade === 'C-' ? 1.7 :
        course.grade === 'D+' ? 1.3 :
        course.grade === 'D' ? 1.0 :
        course.grade === 'D-' ? 0.7 : 0;
      
      return sum + (gradePoints * course.credits);
    }, 0);
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Current Enrollments" />
              <Tab label="Transcript" />
              <Tab label="Academic Summary" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Current Enrollments
            </Typography>
            
            {enrollments.length === 0 ? (
              <Alert severity="info">
                No current enrollments found.
              </Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Course</strong></TableCell>
                      <TableCell><strong>Code</strong></TableCell>
                      <TableCell><strong>Term</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Grade</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.className}</TableCell>
                        <TableCell>{enrollment.courseCode}</TableCell>
                        <TableCell>{enrollment.term}</TableCell>
                        <TableCell>
                          <Chip 
                            label={enrollment.status} 
                            color={
                              enrollment.status === 'Enrolled' ? 'success' :
                              enrollment.status === 'Waitlisted' ? 'warning' :
                              enrollment.status === 'Dropped' ? 'error' :
                              'default'
                            } 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{enrollment.grade || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Academic Transcript
            </Typography>
            
            {transcripts.length === 0 ? (
              <Alert severity="info">
                No transcript records found.
              </Alert>
            ) : (
              <>
                {transcripts.map((transcript, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">
                        {transcript.term} {transcript.year}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle1">
                          GPA: {calculateGPA(transcript)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Course Code</strong></TableCell>
                            <TableCell><strong>Course Name</strong></TableCell>
                            <TableCell><strong>Grade</strong></TableCell>
                            <TableCell><strong>Credits</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transcript.courses.map((course, courseIndex) => (
                            <TableRow key={courseIndex}>
                              <TableCell>{course.courseCode}</TableCell>
                              <TableCell>{course.courseName}</TableCell>
                              <TableCell>{course.grade}</TableCell>
                              <TableCell>{course.credits}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="outlined">
                    Download Transcript
                  </Button>
                </Box>
              </>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Academic Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Academic Standing
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Grade Level
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'Not assigned'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Enrollment Date
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'Not provided'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Chip 
                        label={student.status || 'Active'} 
                        color={student.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Cumulative GPA
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {transcripts.length > 0 ? calculateGPA(transcripts[0]) : 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Credits Earned
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        {transcripts.reduce((sum, transcript) => 
                          sum + transcript.courses.reduce((courseSum, course) => 
                            courseSum + course.credits, 0), 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Academic Progress
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Academic progress charts and visualizations would be displayed here.
                  </Alert>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      GPA Trend, Credits Earned, and other academic metrics would be visualized here.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default StudentAcademics;

