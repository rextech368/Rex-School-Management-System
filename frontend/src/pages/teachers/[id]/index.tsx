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
import WorkIcon from '@mui/icons-material/Work';
import HistoryIcon from '@mui/icons-material/History';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Teacher } from '@/lib/types';
import TeacherDetail from '@/components/teachers/TeacherDetail';
import TeacherQualifications from '@/components/teachers/TeacherQualifications';
import TeacherAssignments from '@/components/teachers/TeacherAssignments';
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
      id={`teacher-tabpanel-${index}`}
      aria-labelledby={`teacher-tab-${index}`}
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

const TeacherDetailPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isOwnProfile = user?.role === Role.TEACHER && user?.id === id;

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/teachers/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Teacher not found');
          }
          throw new Error('Failed to fetch teacher');
        }
        
        const data = await response.json();
        setTeacher(data);
      } catch (err) {
        console.error('Error fetching teacher:', err);
        setError(err.message || 'Failed to load teacher. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    router.push('/teachers');
  };

  const handleEdit = () => {
    if (teacher) {
      router.push(`/teachers/${teacher.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!teacher) return;
    
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/teachers/${teacher.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }
      
      // Redirect to teachers list
      router.push('/teachers');
    } catch (err) {
      console.error('Error deleting teacher:', err);
      setError('Failed to delete teacher. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = () => {
    if (teacher) {
      router.push(`/schedule/teacher?teacherId=${teacher.id}`);
    }
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isOwnProfile) {
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
            Back to Teachers
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mr: 2,
                  bgcolor: teacher?.profileColor || 'primary.main'
                }}
              >
                {teacher ? `${teacher.firstName[0]}${teacher.lastName[0]}` : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Teacher Details'}
                </Typography>
                {teacher && (
                  <Typography variant="subtitle1" color="text.secondary">
                    ID: {teacher.teacherId || teacher.id}
                    {teacher.department && (
                      <Chip 
                        label={teacher.department} 
                        color="primary" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                    {teacher.status && (
                      <Chip 
                        label={teacher.status} 
                        color={teacher.status === 'Active' ? 'success' : 'default'} 
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
        ) : !teacher ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Teacher not found.
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
                      <strong>Email:</strong> {teacher.email || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Phone:</strong> {teacher.phone || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Office:</strong> {teacher.office || 'Not assigned'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Professional Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Department:</strong> {teacher.department || 'Not assigned'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Position:</strong> {teacher.position || 'Teacher'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Hire Date:</strong> {teacher.hireDate ? new Date(teacher.hireDate).toLocaleDateString() : 'Not provided'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Teaching Load
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Classes:</strong> {teacher.classCount || '0'} classes
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Students:</strong> {teacher.studentCount || '0'} students
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Hours:</strong> {teacher.teachingHours || '0'} hours/week
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={handleViewSchedule}>
                      View Schedule
                    </Button>
                  </CardActions>
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
                <Tab icon={<SchoolIcon />} label="Qualifications" />
                <Tab icon={<WorkIcon />} label="Assignments" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <TeacherDetail teacher={teacher} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TeacherQualifications teacher={teacher} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TeacherAssignments teacher={teacher} />
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
                        View and manage the teacher's class schedule and assignments.
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
                        Grade Books
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Access the teacher's grade books for their assigned classes.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push(`/grades/teacher/${teacher.id}`)}>
                        View Grade Books
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Attendance Records
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        View and manage attendance records for the teacher's classes.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push(`/attendance/teacher/${teacher.id}`)}>
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

export default TeacherDetailPage;

