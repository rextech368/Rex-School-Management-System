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
  Tabs,
  Tab,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term } from '@/lib/types';
import EnrollmentList from '@/components/enrollment/EnrollmentList';
import ClassSelection from '@/components/enrollment/ClassSelection';
import StudentSchedule from '@/components/enrollment/StudentSchedule';

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
      id={`enrollment-tabpanel-${index}`}
      aria-labelledby={`enrollment-tab-${index}`}
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

const EnrollmentPage: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const isStudent = user?.role === Role.STUDENT;

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/terms');
        
        if (!response.ok) {
          throw new Error('Failed to fetch terms');
        }
        
        const data = await response.json();
        setTerms(data);
        
        // Set current term as default if available
        const currentTerm = data.find((term: Term) => term.isCurrent);
        if (currentTerm) {
          setSelectedTerm(currentTerm.id);
        } else if (data.length > 0) {
          setSelectedTerm(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError('Failed to load terms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTermChange = (termId: string) => {
    setSelectedTerm(termId);
  };

  const handleManageEnrollments = () => {
    router.push('/enrollment/manage');
  };

  const handleStudentView = () => {
    router.push('/enrollment/student');
  };

  // Determine which tabs to show based on user role
  const getTabsForRole = () => {
    if (isAdmin) {
      return (
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<ListAltIcon />} label="Enrollment List" />
          <Tab icon={<HowToRegIcon />} label="Manage Enrollments" />
          <Tab icon={<SchoolIcon />} label="Class Selection" />
        </Tabs>
      );
    } else if (isTeacher) {
      return (
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<ListAltIcon />} label="Class Roster" />
          <Tab icon={<HowToRegIcon />} label="Enrollment Requests" />
        </Tabs>
      );
    } else if (isStudent) {
      return (
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<SchoolIcon />} label="Class Selection" />
          <Tab icon={<ListAltIcon />} label="My Schedule" />
        </Tabs>
      );
    }
    
    // Default tabs for other roles or unauthenticated users
    return (
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab icon={<SchoolIcon />} label="Class Selection" />
      </Tabs>
    );
  };

  // Render tab content based on user role and selected tab
  const getTabContent = () => {
    if (isAdmin) {
      return (
        <>
          <TabPanel value={tabValue} index={0}>
            <EnrollmentList 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleManageEnrollments}
              >
                Advanced Enrollment Management
              </Button>
            </Box>
            <EnrollmentList 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
              showPending={true}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ClassSelection 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
              adminView={true}
            />
          </TabPanel>
        </>
      );
    } else if (isTeacher) {
      return (
        <>
          <TabPanel value={tabValue} index={0}>
            <EnrollmentList 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
              teacherView={true}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <EnrollmentList 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
              teacherView={true}
              showPending={true}
            />
          </TabPanel>
        </>
      );
    } else if (isStudent) {
      return (
        <>
          <TabPanel value={tabValue} index={0}>
            <ClassSelection 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
              studentId={user?.id}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <StudentSchedule 
              termId={selectedTerm} 
              onTermChange={handleTermChange}
              terms={terms}
              studentId={user?.id}
            />
          </TabPanel>
        </>
      );
    }
    
    // Default content for other roles or unauthenticated users
    return (
      <TabPanel value={tabValue} index={0}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please log in to register for classes.
        </Alert>
        <ClassSelection 
          termId={selectedTerm} 
          onTermChange={handleTermChange}
          terms={terms}
          readOnly={true}
        />
      </TabPanel>
    );
  };

  // Show role-specific dashboard cards
  const getDashboardCards = () => {
    if (!selectedTerm) return null;
    
    if (isAdmin) {
      return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Enrollment Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage student enrollments, process requests, and handle waitlists.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={handleManageEnrollments}>
                  Manage Enrollments
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Student View
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See the enrollment interface from a student's perspective.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={handleStudentView}>
                  Student View
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Term
                </Typography>
                <Typography variant="body2">
                  {terms.find(term => term.id === selectedTerm)?.name || 'Unknown Term'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {terms.find(term => term.id === selectedTerm)?.isCurrent ? 'Active' : 'Inactive'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    } else if (isStudent) {
      return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Registration Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your current registration status and enrolled classes.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setTabValue(1)}>
                  View My Schedule
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Term
                </Typography>
                <Typography variant="body2">
                  {terms.find(term => term.id === selectedTerm)?.name || 'Unknown Term'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {terms.find(term => term.id === selectedTerm)?.isCurrent ? 'Active' : 'Inactive'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }
    
    return null;
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Class Enrollment
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {getDashboardCards()}
            
            <Paper sx={{ width: '100%', mb: 2 }}>
              {getTabsForRole()}
              {getTabContent()}
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default EnrollmentPage;

