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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Class } from '@/lib/types';
import ClassGrades from '@/components/grades/ClassGrades';
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

const ClassGradesPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classData, setClassData] = useState<Class | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [assignments, setAssignments] = useState<any[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;

  useEffect(() => {
    const fetchData = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch class and assignments from the API
        // const classResponse = await fetch(`/api/classes/${id}`);
        // const assignmentsResponse = await fetch(`/api/classes/${id}/assignments`);
        
        // if (!classResponse.ok || !assignmentsResponse.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        
        // const classData = await classResponse.json();
        // const assignmentsData = await assignmentsResponse.json();
        
        // setClassData(classData);
        // setAssignments(assignmentsData);
        
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
        
        setAssignments([
          {
            id: '1',
            title: 'Chapter 1 Homework',
            type: 'homework',
            dueDate: '2023-09-15',
            maxScore: 100,
            weight: 10,
            status: 'graded',
            averageScore: 85
          },
          {
            id: '2',
            title: 'Quiz 1',
            type: 'quiz',
            dueDate: '2023-09-20',
            maxScore: 50,
            weight: 15,
            status: 'graded',
            averageScore: 42
          },
          {
            id: '3',
            title: 'Midterm Exam',
            type: 'test',
            dueDate: '2023-10-15',
            maxScore: 100,
            weight: 25,
            status: 'graded',
            averageScore: 78
          },
          {
            id: '4',
            title: 'Research Project',
            type: 'project',
            dueDate: '2023-11-15',
            maxScore: 100,
            weight: 20,
            status: 'published',
            averageScore: null
          },
          {
            id: '5',
            title: 'Final Exam',
            type: 'test',
            dueDate: '2023-12-15',
            maxScore: 100,
            weight: 30,
            status: 'draft',
            averageScore: null
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
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    router.push('/grades');
  };

  const handleDownloadReport = () => {
    alert('Download functionality would be implemented here.');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleCreateAssignment = () => {
    router.push(`/grades/assignments/new?classId=${id}`);
  };

  const handleRecordGrades = (assignmentId: string) => {
    router.push(`/grades/record?classId=${id}&assignmentId=${assignmentId}`);
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
              Class Grades
            </Typography>
            <Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleCreateAssignment}
                sx={{ mr: 2 }}
              >
                Create Assignment
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
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Grade Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Class Average:</strong> 82%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Highest Grade:</strong> 98%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Lowest Grade:</strong> 65%
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Grade Distribution:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip label="A: 20%" color="success" />
                      <Chip label="B: 35%" color="primary" />
                      <Chip label="C: 30%" color="info" />
                      <Chip label="D: 10%" color="warning" />
                      <Chip label="F: 5%" color="error" />
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
                <Tab label="Assignments" />
                <Tab label="Student Grades" />
                <Tab label="Grade Distribution" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                  Assignments
                </Typography>
                <Grid container spacing={2}>
                  {assignments.map((assignment) => (
                    <Grid item xs={12} md={6} key={assignment.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6">
                              {assignment.title}
                            </Typography>
                            <Chip 
                              label={assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)} 
                              color={
                                assignment.type === 'test' ? 'error' :
                                assignment.type === 'quiz' ? 'warning' :
                                assignment.type === 'project' ? 'info' :
                                'default'
                              }
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">
                                Max Score
                              </Typography>
                              <Typography variant="body1">
                                {assignment.maxScore}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">
                                Weight
                              </Typography>
                              <Typography variant="body1">
                                {assignment.weight}%
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography variant="body2" color="text.secondary">
                                Status
                              </Typography>
                              <Chip 
                                label={assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)} 
                                color={
                                  assignment.status === 'graded' ? 'success' :
                                  assignment.status === 'published' ? 'primary' :
                                  'default'
                                }
                                size="small"
                              />
                            </Grid>
                          </Grid>
                          {assignment.averageScore !== null && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Average Score
                              </Typography>
                              <Typography variant="body1">
                                {assignment.averageScore} / {assignment.maxScore} ({Math.round(assignment.averageScore / assignment.maxScore * 100)}%)
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                          {assignment.status === 'published' && (
                            <Button 
                              size="small" 
                              variant="contained"
                              onClick={() => handleRecordGrades(assignment.id)}
                            >
                              Record Grades
                            </Button>
                          )}
                          {assignment.status === 'graded' && (
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => handleRecordGrades(assignment.id)}
                            >
                              Edit Grades
                            </Button>
                          )}
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <ClassGrades 
                  classId={classData.id}
                />
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Grade Distribution
                </Typography>
                <Alert severity="info">
                  This section will display grade distribution charts and statistics.
                </Alert>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Grade distribution charts and visualizations will be displayed here.
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

export default ClassGradesPage;

