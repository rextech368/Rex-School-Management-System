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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term, Student } from '@/lib/types';
import ClassSelection from '@/components/enrollment/ClassSelection';
import StudentSchedule from '@/components/enrollment/StudentSchedule';
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
      id={`student-enrollment-tabpanel-${index}`}
      aria-labelledby={`student-enrollment-tab-${index}`}
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

const StudentEnrollmentPage: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isParent = user?.role === Role.PARENT;

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
        
        // Fetch students (for admin or parent view)
        if (isAdmin || isParent) {
          const studentsResponse = await fetch('/api/students');
          if (!studentsResponse.ok) {
            throw new Error('Failed to fetch students');
          }
          const studentsData = await studentsResponse.json();
          setStudents(studentsData);
          
          // Set first student as default if available
          if (studentsData.length > 0) {
            setSelectedStudent(studentsData[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, isParent]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTermChange = (termId: string) => {
    setSelectedTerm(termId);
  };

  const handleStudentChange = (event: SelectChangeEvent) => {
    setSelectedStudent(event.target.value);
  };

  const handleBack = () => {
    router.push('/enrollment');
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isParent && user?.role !== Role.STUDENT) {
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
              Student Enrollment View
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
              {(isAdmin || isParent) && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="student-select-label">Student</InputLabel>
                    <Select
                      labelId="student-select-label"
                      id="student-select"
                      value={selectedStudent}
                      label="Student"
                      onChange={handleStudentChange}
                      disabled={students.length === 0}
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} {student.gradeLevel ? `(Grade ${student.gradeLevel})` : ''}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12} md={(isAdmin || isParent) ? 6 : 12}>
                <FormControl fullWidth>
                  <InputLabel id="term-select-label">Academic Term</InputLabel>
                  <Select
                    labelId="term-select-label"
                    id="term-select"
                    value={selectedTerm}
                    label="Academic Term"
                    onChange={(e) => handleTermChange(e.target.value)}
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
            </Grid>
            
            <Paper sx={{ width: '100%', mb: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab icon={<SchoolIcon />} label="Class Selection" />
                <Tab icon={<ListAltIcon />} label="Current Schedule" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <ClassSelection 
                  termId={selectedTerm} 
                  onTermChange={handleTermChange}
                  terms={terms}
                  studentId={(isAdmin || isParent) ? selectedStudent : user?.id}
                  adminView={isAdmin}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <StudentSchedule 
                  termId={selectedTerm} 
                  onTermChange={handleTermChange}
                  terms={terms}
                  studentId={(isAdmin || isParent) ? selectedStudent : user?.id}
                />
              </TabPanel>
            </Paper>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default StudentEnrollmentPage;

