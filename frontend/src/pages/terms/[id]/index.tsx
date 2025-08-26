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
  Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClassIcon from '@mui/icons-material/Class';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term } from '@/lib/types';
import TermDetail from '@/components/terms/TermDetail';
import TermCalendar from '@/components/terms/TermCalendar';
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
      id={`term-tabpanel-${index}`}
      aria-labelledby={`term-tab-${index}`}
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

const TermDetailPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState<Term | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchTerm = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/terms/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Term not found');
          }
          throw new Error('Failed to fetch term');
        }
        
        const data = await response.json();
        setTerm(data);
        
        // Fetch additional statistics
        const statsResponse = await fetch(`/api/terms/${id}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setClassCount(statsData.classCount || 0);
          setEnrollmentCount(statsData.enrollmentCount || 0);
        }
      } catch (err) {
        console.error('Error fetching term:', err);
        setError(err.message || 'Failed to load term. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    router.push('/terms');
  };

  const handleEdit = () => {
    if (term) {
      router.push(`/terms/${term.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!term) return;
    
    if (!confirm('Are you sure you want to delete this term? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/terms/${term.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete term');
      }
      
      // Redirect to terms list
      router.push('/terms');
    } catch (err) {
      console.error('Error deleting term:', err);
      setError('Failed to delete term. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrent = async () => {
    if (!term) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/terms/${term.id}/set-current`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to set term as current');
      }
      
      // Update term data
      setTerm({
        ...term,
        isCurrent: true
      });
    } catch (err) {
      console.error('Error setting term as current:', err);
      setError('Failed to set term as current. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to access this page
  if (!isAdmin) {
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
            Back to Terms
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {term?.name || 'Term Details'}
              </Typography>
              {term?.isCurrent && (
                <Chip 
                  label="Current Term" 
                  color="primary" 
                  sx={{ mr: 1 }}
                />
              )}
              <Chip 
                label={term?.isActive ? 'Active' : 'Inactive'} 
                color={term?.isActive ? 'success' : 'default'} 
              />
            </Box>
            <Box>
              {!term?.isCurrent && (
                <Button
                  variant="outlined"
                  onClick={handleSetCurrent}
                  sx={{ mr: 2 }}
                  disabled={loading}
                >
                  Set as Current Term
                </Button>
              )}
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
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : !term ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Term not found.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Term Dates
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Start Date:</strong> {new Date(term.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>End Date:</strong> {new Date(term.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Duration:</strong> {Math.ceil((new Date(term.endDate).getTime() - new Date(term.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Registration Period
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Registration Start:</strong> {term.registrationStart ? new Date(term.registrationStart).toLocaleDateString() : 'Not set'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Registration End:</strong> {term.registrationEnd ? new Date(term.registrationEnd).toLocaleDateString() : 'Not set'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong> {
                        !term.registrationStart || !term.registrationEnd ? 'Not configured' :
                        new Date() < new Date(term.registrationStart) ? 'Not started' :
                        new Date() > new Date(term.registrationEnd) ? 'Closed' :
                        'Open'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Statistics
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Classes:</strong> {classCount}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Enrollments:</strong> {enrollmentCount}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Status:</strong> {
                        new Date() < new Date(term.startDate) ? 'Upcoming' :
                        new Date() > new Date(term.endDate) ? 'Completed' :
                        'In Progress'
                      }
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => router.push(`/classes?termId=${term.id}`)}>
                      View Classes
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
                <Tab icon={<CalendarTodayIcon />} label="Calendar" />
                <Tab icon={<ClassIcon />} label="Classes" />
                <Tab icon={<PeopleIcon />} label="Enrollments" />
                <Tab icon={<SettingsIcon />} label="Settings" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <TermCalendar terms={[term]} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Classes in this Term
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => router.push(`/classes/new?termId=${term.id}`)}
                  >
                    Add Class
                  </Button>
                </Box>
                {classCount === 0 ? (
                  <Alert severity="info">
                    No classes found for this term.
                  </Alert>
                ) : (
                  <Button 
                    variant="outlined" 
                    onClick={() => router.push(`/classes?termId=${term.id}`)}
                    fullWidth
                  >
                    View All Classes
                  </Button>
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Enrollments in this Term
                  </Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => router.push(`/enrollment/manage?termId=${term.id}`)}
                  >
                    Manage Enrollments
                  </Button>
                </Box>
                {enrollmentCount === 0 ? (
                  <Alert severity="info">
                    No enrollments found for this term.
                  </Alert>
                ) : (
                  <Button 
                    variant="outlined" 
                    onClick={() => router.push(`/enrollment?termId=${term.id}`)}
                    fullWidth
                  >
                    View All Enrollments
                  </Button>
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <TermDetail term={term} />
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
                        Schedule Classes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create and manage classes for this academic term.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push(`/schedule?termId=${term.id}`)}>
                        Manage Schedule
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Term Transition
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Copy classes from this term to another term.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => router.push(`/schedule/batch?termId=${term.id}`)}>
                        Term Transition
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Registration Settings
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configure registration periods and enrollment settings.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={handleEdit}>
                        Edit Settings
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

export default TermDetailPage;

