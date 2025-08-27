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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Student } from '@/lib/types';
import StudentGrades from '@/components/grades/StudentGrades';
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

const StudentGradesPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [terms, setTerms] = useState<any[]>([]);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const isParent = user?.role === Role.PARENT;
  const isOwnRecord = user?.role === Role.STUDENT && user?.id === id;

  useEffect(() => {
    const fetchData = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch student and terms from the API
        // const studentResponse = await fetch(`/api/students/${id}`);
        // const termsResponse = await fetch('/api/terms');
        
        // if (!studentResponse.ok || !termsResponse.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        
        // const studentData = await studentResponse.json();
        // const termsData = await termsResponse.json();
        
        // setStudent(studentData);
        // setTerms(termsData);
        // setSelectedTerm(termsData.find(t => t.status === 'active')?.id || '');
        
        // For demo purposes, set mock data
        setStudent({
          id: id as string,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          gradeLevel: 9,
          status: 'Active',
          enrollmentDate: '2023-08-15'
        });
        
        const mockTerms = [
          {
            id: '1',
            name: 'Fall 2023',
            startDate: '2023-08-15',
            endDate: '2023-12-15',
            status: 'active'
          },
          {
            id: '2',
            name: 'Spring 2024',
            startDate: '2024-01-15',
            endDate: '2024-05-15',
            status: 'upcoming'
          },
          {
            id: '3',
            name: 'Summer 2024',
            startDate: '2024-06-01',
            endDate: '2024-07-31',
            status: 'upcoming'
          }
        ];
        
        setTerms(mockTerms);
        setSelectedTerm(mockTerms.find(t => t.status === 'active')?.id || '1');
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

  const handleTermChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTerm(event.target.value as string);
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

  const handleViewReportCard = () => {
    router.push(`/grades/reports?reportType=report-card&studentId=${id}&termId=${selectedTerm}`);
  };

  // Check if user has permission to access this page
  if (!isAdmin && !isTeacher && !isParent && !isOwnRecord) {
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
              Student Grades
            </Typography>
            <Box>
              <Button
                variant="outlined"
                onClick={handleViewReportCard}
                sx={{ mr: 2 }}
              >
                View Report Card
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
                      Student Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Name:</strong> {student.firstName} {student.lastName}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>ID:</strong> {student.studentId || student.id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Grade Level:</strong> {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'Not assigned'}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Status:</strong> {' '}
                      <Chip 
                        label={student.status || 'Active'} 
                        color={student.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Academic Summary
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Current GPA:</strong> 3.75
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Cumulative GPA:</strong> 3.82
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Credits Earned:</strong> 12
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Academic Standing:</strong> {' '}
                      <Chip 
                        label="Good Standing" 
                        color="success" 
                        size="small" 
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Term Selection
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel id="term-select-label">Select Term</InputLabel>
                      <Select
                        labelId="term-select-label"
                        value={selectedTerm}
                        label="Select Term"
                        onChange={handleTermChange}
                      >
                        {terms.map((term) => (
                          <MenuItem key={term.id} value={term.id}>
                            {term.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                <Tab label="Current Grades" />
                <Tab label="Grade History" />
                <Tab label="Academic Progress" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <StudentGrades 
                  studentId={student.id}
                  termId={selectedTerm}
                />
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                  Grade History
                </Typography>
                <Alert severity="info">
                  This section will display the student's grade history across all terms.
                </Alert>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Grade history data will be displayed here.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>
                  Academic Progress
                </Typography>
                <Alert severity="info">
                  This section will display the student's academic progress over time.
                </Alert>
                <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Academic progress charts and data will be displayed here.
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

export default StudentGradesPage;

