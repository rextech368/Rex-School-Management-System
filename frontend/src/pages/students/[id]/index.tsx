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
  Chip,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HistoryIcon from '@mui/icons-material/History';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Student } from '@/lib/types';
import StudentDetail from '@/components/students/StudentDetail';
import StudentAcademics from '@/components/students/StudentAcademics';
import StudentGuardians from '@/components/students/StudentGuardians';
import StudentHistory from '@/components/students/StudentHistory';
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
      id={`student-tabpanel-${index}`}
      aria-labelledby={`student-tab-${index}`}
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

const StudentDetailPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const isParent = user?.role === Role.PARENT;
  const isOwnProfile = user?.role === Role.STUDENT && user?.id === id;

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
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    router.push('/students');
  };

  const handleEdit = () => {
    if (student) {
      router.push(`/students/${student.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!student) return;
    
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      // Redirect to students list
      router.push('/students');
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = () => {
    if (student) {
      router.push(`/enrollment/student?studentId=${student.id}`);
    }
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isTeacher && !isParent && !isOwnProfile) {
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
            Back to Students
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mr: 2,
                  bgcolor: student?.profileColor || 'primary.main'
                }}
              >
                {student ? `${student.firstName[0]}${student.lastName[0]}` : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {student ? `${student.firstName} ${student.lastName}` : 'Student Details'}
                </Typography>
                {student && (
                  <Typography variant="subtitle1" color="text.secondary">
                    ID: {student.studentId || student.id}
                    {student.gradeLevel && (
                      <Chip 
                        label={`Grade ${student.gradeLevel}`} 
                        color="primary" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                    {student.status && (
                      <Chip 
                        label={student.status} 
                        color={student.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
            {isAdmin && (
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
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
                      Contact Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {student.email || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Phone:</strong> {student.phone || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Address:</strong> {student.address || 'Not provided'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Academic Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Grade Level:</strong> {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'Not assigned'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Enrollment Date:</strong> {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'Not provided'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong> {student.status || 'Active'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewSchedule}>
                      View Schedule
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Guardian Information
                    </Typography>
                    {student.guardianFirstName ? (
                      <>
                        <Typography variant="body2" gutterBottom>
                          <strong>Name:</strong> {student.guardianFirstName} {student.guardianLastName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Email:</strong> {student.guardianEmail || 'Not provided'}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Phone:</strong> {student.guardianPhone || 'Not provided'}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No guardian information available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Paper sx={{ width: '100%', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab icon={<PersonIcon />} label="Personal" />
                <Tab icon={<SchoolIcon />} label="Academics" />
                <Tab icon={<FamilyRestroomIcon />} label="Guardians" />
                <Tab icon={<HistoryIcon />} label="History" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <StudentDetail student={student} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <StudentAcademics student={student} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <StudentGuardians student={student} />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <StudentHistory student={student} />
              </TabPanel>
            </Paper>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Class Schedule
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View and manage the student's class schedule and enrollments.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={handleViewSchedule}>
                        View Schedule
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Academic Records
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View the student's grades, transcripts, and academic history.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push(`/students/${student.id}/academics`)}>
                        View Records
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Attendance
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View and manage the student's attendance records.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push(`/attendance/student/${student.id}`)}>
                        View Attendance
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default StudentDetailPage;

