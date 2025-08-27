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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term, Class } from '@/lib/types';
import EnrollmentList from '@/components/enrollment/EnrollmentList';
import WaitlistManagement from '@/components/enrollment/WaitlistManagement';
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
      id={`enrollment-manage-tabpanel-${index}`}
      aria-labelledby={`enrollment-manage-tab-${index}`}
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

const ManageEnrollmentPage: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch terms
        const termsResponse = await fetch('/api/terms');
        if (!termsResponse.ok) {
          throw new Error('Failed to fetch terms');
        }
        const termsData = await termsResponse.json();
        setTerms(termsData);
        
        // Set current term as default if available
        const currentTerm = termsData.find((term: Term) => term.isCurrent);
        if (currentTerm) {
          setSelectedTerm(currentTerm.id);
        } else if (termsData.length > 0) {
          setSelectedTerm(termsData[0].id);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedTerm) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/classes?termId=${selectedTerm}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        
        const data = await response.json();
        setClasses(data);
        
        // Set first class as default if available
        if (data.length > 0) {
          setSelectedClass(data[0].id);
        } else {
          setSelectedClass('');
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedTerm]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTermChange = (event: SelectChangeEvent) => {
    setSelectedTerm(event.target.value);
  };

  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

  const handleBack = () => {
    router.push('/enrollment');
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
            Back to Enrollment
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Enrollment Management
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="term-select-label">Academic Term</InputLabel>
                  <Select
                    labelId="term-select-label"
                    id="term-select"
                    value={selectedTerm}
                    label="Academic Term"
                    onChange={handleTermChange}
                    disabled={terms.length === 0}
                  >
                    {terms.map((term) => (
                      <MenuItem key={term.id} value={term.id}>
                        {term.name} {term.isCurrent && '(Current)'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="class-select-label">Class</InputLabel>
                  <Select
                    labelId="class-select-label"
                    id="class-select"
                    value={selectedClass}
                    label="Class"
                    onChange={handleClassChange}
                    disabled={classes.length === 0}
                  >
                    {classes.map((classItem) => (
                      <MenuItem key={classItem.id} value={classItem.id}>
                        {classItem.course?.code || 'Unknown'}: {classItem.course?.name || 'Unknown'} - Section {classItem.section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                <Tab icon={<ListAltIcon />} label="Enrollment List" />
                <Tab icon={<HourglassEmptyIcon />} label="Waitlist Management" />
                <Tab icon={<PeopleIcon />} label="Enrollment Requests" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <EnrollmentList 
                  termId={selectedTerm} 
                  classId={selectedClass}
                  onTermChange={(termId) => setSelectedTerm(termId)}
                  terms={terms}
                  adminView={true}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <WaitlistManagement 
                  termId={selectedTerm} 
                  classId={selectedClass}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <EnrollmentList 
                  termId={selectedTerm} 
                  classId={selectedClass}
                  onTermChange={(termId) => setSelectedTerm(termId)}
                  terms={terms}
                  adminView={true}
                  showPending={true}
                />
              </TabPanel>
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default ManageEnrollmentPage;

