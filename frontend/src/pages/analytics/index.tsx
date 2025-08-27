import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  AnalyticsMetric,
  AttendanceAnalytics,
  GradeAnalytics,
  EnrollmentAnalytics,
  StudentPerformanceAnalytics,
  TeacherPerformanceAnalytics,
  SchoolOverviewAnalytics
} from '@/lib/types';
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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

const AnalyticsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [schoolOverview, setSchoolOverview] = useState<SchoolOverviewAnalytics | null>(null);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [gradeAnalytics, setGradeAnalytics] = useState<GradeAnalytics | null>(null);
  const [enrollmentAnalytics, setEnrollmentAnalytics] = useState<EnrollmentAnalytics | null>(null);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformanceAnalytics | null>(null);
  const [teacherPerformance, setTeacherPerformance] = useState<TeacherPerformanceAnalytics | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.role === 'registrar';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch analytics from the API
        // const response = await fetch('/api/analytics/overview');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch analytics');
        // }
        // const data = await response.json();
        // setSchoolOverview(data);
        
        // For demo purposes, set mock data
        const mockSchoolOverview: SchoolOverviewAnalytics = {
          students: {
            total: 1250,
            byGradeLevel: [
              { gradeLevel: 6, count: 180 },
              { gradeLevel: 7, count: 175 },
              { gradeLevel: 8, count: 190 },
              { gradeLevel: 9, count: 185 },
              { gradeLevel: 10, count: 170 },
              { gradeLevel: 11, count: 180 },
              { gradeLevel: 12, count: 170 }
            ],
            byStatus: [
              { status: 'active', count: 1200 },
              { status: 'inactive', count: 30 },
              { status: 'suspended', count: 20 }
            ],
            trend: [
              { period: 'Jan', count: 1200 },
              { period: 'Feb', count: 1210 },
              { period: 'Mar', count: 1225 },
              { period: 'Apr', count: 1230 },
              { period: 'May', count: 1240 },
              { period: 'Jun', count: 1250 }
            ]
          },
          teachers: {
            total: 85,
            byDepartment: [
              { department: 'Mathematics', count: 15 },
              { department: 'Science', count: 18 },
              { department: 'English', count: 14 },
              { department: 'History', count: 12 },
              { department: 'Languages', count: 10 },
              { department: 'Arts', count: 8 },
              { department: 'Physical Education', count: 8 }
            ],
            byStatus: [
              { status: 'active', count: 80 },
              { status: 'on leave', count: 3 },
              { status: 'inactive', count: 2 }
            ],
            trend: [
              { period: 'Jan', count: 82 },
              { period: 'Feb', count: 82 },
              { period: 'Mar', count: 83 },
              { period: 'Apr', count: 84 },
              { period: 'May', count: 85 },
              { period: 'Jun', count: 85 }
            ]
          },
          classes: {
            total: 210,
            byStatus: [
              { status: 'active', count: 180 },
              { status: 'scheduled', count: 20 },
              { status: 'completed', count: 10 }
            ],
            byDepartment: [
              { department: 'Mathematics', count: 35 },
              { department: 'Science', count: 40 },
              { department: 'English', count: 30 },
              { department: 'History', count: 25 },
              { department: 'Languages', count: 20 },
              { department: 'Arts', count: 15 },
              { department: 'Physical Education', count: 15 },
              { department: 'Electives', count: 30 }
            ],
            capacityUtilization: 0.92
          },
          attendance: {
            overallRate: 0.94,
            byGradeLevel: [
              { gradeLevel: 6, rate: 0.96 },
              { gradeLevel: 7, rate: 0.95 },
              { gradeLevel: 8, rate: 0.94 },
              { gradeLevel: 9, rate: 0.93 },
              { gradeLevel: 10, rate: 0.92 },
              { gradeLevel: 11, rate: 0.93 },
              { gradeLevel: 12, rate: 0.95 }
            ],
            trend: [
              { period: 'Jan', rate: 0.93 },
              { period: 'Feb', rate: 0.94 },
              { period: 'Mar', rate: 0.94 },
              { period: 'Apr', rate: 0.95 },
              { period: 'May', rate: 0.94 },
              { period: 'Jun', rate: 0.94 }
            ]
          },
          grades: {
            averageGPA: 3.2,
            passingRate: 0.91,
            byGradeLevel: [
              { gradeLevel: 6, averageGPA: 3.4, passingRate: 0.94 },
              { gradeLevel: 7, averageGPA: 3.3, passingRate: 0.93 },
              { gradeLevel: 8, averageGPA: 3.2, passingRate: 0.92 },
              { gradeLevel: 9, averageGPA: 3.1, passingRate: 0.90 },
              { gradeLevel: 10, averageGPA: 3.0, passingRate: 0.89 },
              { gradeLevel: 11, averageGPA: 3.2, passingRate: 0.91 },
              { gradeLevel: 12, averageGPA: 3.4, passingRate: 0.93 }
            ],
            trend: [
              { period: 'Jan', averageGPA: 3.1, passingRate: 0.90 },
              { period: 'Feb', averageGPA: 3.1, passingRate: 0.90 },
              { period: 'Mar', averageGPA: 3.2, passingRate: 0.91 },
              { period: 'Apr', averageGPA: 3.2, passingRate: 0.91 },
              { period: 'May', averageGPA: 3.3, passingRate: 0.92 },
              { period: 'Jun', averageGPA: 3.2, passingRate: 0.91 }
            ]
          },
          keyMetrics: [
            {
              id: '1',
              name: 'Student Attendance',
              value: 94,
              unit: '%',
              trend: 1,
              trendPeriod: 'vs last month',
              status: 'positive',
              target: 95,
              icon: 'person',
              color: 'primary.main'
            },
            {
              id: '2',
              name: 'Average GPA',
              value: 3.2,
              unit: '',
              trend: 0.1,
              trendPeriod: 'vs last month',
              status: 'positive',
              target: 3.5,
              icon: 'assessment',
              color: 'success.main'
            },
            {
              id: '3',
              name: 'Passing Rate',
              value: 91,
              unit: '%',
              trend: 1,
              trendPeriod: 'vs last month',
              status: 'positive',
              target: 95,
              icon: 'school',
              color: 'info.main'
            },
            {
              id: '4',
              name: 'Class Capacity',
              value: 92,
              unit: '%',
              trend: 2,
              trendPeriod: 'vs last month',
              status: 'positive',
              target: 90,
              icon: 'class',
              color: 'warning.main'
            }
          ]
        };
        
        setSchoolOverview(mockSchoolOverview);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateDashboard = () => {
    router.push('/analytics/create');
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Check if user has permission to access analytics
  if (!isAdmin && !['teacher'].includes(user?.role || '')) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Analytics Dashboard
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateDashboard}
            >
              Create Dashboard
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" />
            <Tab label="Attendance" />
            <Tab label="Grades" />
            <Tab label="Enrollment" />
            <Tab label="Student Performance" />
            <Tab label="Teacher Performance" />
          </Tabs>
        </Paper>
        
        <TabPanel value={tabValue} index={0}>
          {renderOverviewDashboard()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Attendance Analytics
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Detailed attendance analytics will be implemented in the next phase.
          </Alert>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Grade Analytics
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Detailed grade analytics will be implemented in the next phase.
          </Alert>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Enrollment Analytics
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Detailed enrollment analytics will be implemented in the next phase.
          </Alert>
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6" gutterBottom>
            Student Performance Analytics
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Detailed student performance analytics will be implemented in the next phase.
          </Alert>
        </TabPanel>
        
        <TabPanel value={tabValue} index={5}>
          <Typography variant="h6" gutterBottom>
            Teacher Performance Analytics
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Detailed teacher performance analytics will be implemented in the next phase.
          </Alert>
        </TabPanel>
      </Container>
    </DashboardLayout>
  );

  function renderOverviewDashboard() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (!schoolOverview) {
      return (
        <Alert severity="error">
          Failed to load analytics data. Please try again later.
        </Alert>
      );
    }
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {schoolOverview.keyMetrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" color="text.secondary">
                      {metric.name}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: metric.color,
                        color: 'white',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {metric.icon === 'person' && <PersonIcon />}
                      {metric.icon === 'assessment' && <AssessmentIcon />}
                      {metric.icon === 'school' && <SchoolIcon />}
                      {metric.icon === 'class' && <ClassIcon />}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h4" component="div">
                      {metric.value}{metric.unit}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {metric.status === 'positive' ? (
                        <TrendingUpIcon fontSize="small" color="success" />
                      ) : (
                        <TrendingDownIcon fontSize="small" color="error" />
                      )}
                      <Typography 
                        variant="body2" 
                        color={metric.status === 'positive' ? 'success.main' : 'error.main'}
                        sx={{ ml: 0.5 }}
                      >
                        {metric.trend > 0 ? '+' : ''}{metric.trend}{metric.unit} {metric.trendPeriod}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Student Overview" />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" component="div" align="center">
                    {formatNumber(schoolOverview.students.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total Students
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Students by Grade Level
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {schoolOverview.students.byGradeLevel.map((grade) => (
                    <Box key={grade.gradeLevel} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Grade {grade.gradeLevel}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(grade.count)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Students by Status
                </Typography>
                <Box>
                  {schoolOverview.students.byStatus.map((status) => (
                    <Box key={status.status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {status.status}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(status.count)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Teacher Overview" />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" component="div" align="center">
                    {formatNumber(schoolOverview.teachers.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total Teachers
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Teachers by Department
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {schoolOverview.teachers.byDepartment.map((dept) => (
                    <Box key={dept.department} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {dept.department}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(dept.count)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Teachers by Status
                </Typography>
                <Box>
                  {schoolOverview.teachers.byStatus.map((status) => (
                    <Box key={status.status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {status.status}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(status.count)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Class Overview" />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h3" component="div" align="center">
                    {formatNumber(schoolOverview.classes.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total Classes
                  </Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Classes by Department
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {schoolOverview.classes.byDepartment.map((dept) => (
                    <Box key={dept.department} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {dept.department}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(dept.count)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Classes by Status
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {schoolOverview.classes.byStatus.map((status) => (
                    <Box key={status.status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {status.status}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {formatNumber(status.count)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Capacity Utilization
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    Overall Capacity Utilization
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatPercentage(schoolOverview.classes.capacityUtilization)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Academic Performance" />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      Average GPA
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {schoolOverview.grades.averageGPA.toFixed(1)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      Passing Rate
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {formatPercentage(schoolOverview.grades.passingRate)}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Attendance Rate
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">
                      Overall Attendance
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {formatPercentage(schoolOverview.attendance.overallRate)}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  GPA by Grade Level
                </Typography>
                <Box>
                  {schoolOverview.grades.byGradeLevel.map((grade) => (
                    <Box key={grade.gradeLevel} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Grade {grade.gradeLevel}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {grade.averageGPA.toFixed(1)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default AnalyticsPage;

