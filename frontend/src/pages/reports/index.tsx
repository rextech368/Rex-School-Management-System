import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Report, ReportType } from '@/lib/types';
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
      id={`reports-tabpanel-${index}`}
      aria-labelledby={`reports-tab-${index}`}
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

const ReportsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.role === 'registrar';

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch reports from the API
        // const response = await fetch('/api/reports');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch reports');
        // }
        // const data = await response.json();
        // setReports(data);
        
        // For demo purposes, set mock data
        const mockReports: Report[] = [
          {
            id: '1',
            title: 'Student Attendance Report',
            description: 'Comprehensive report on student attendance patterns across all classes',
            type: ReportType.ATTENDANCE,
            parameters: [
              {
                name: 'startDate',
                label: 'Start Date',
                type: 'date',
                required: true,
                defaultValue: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              },
              {
                name: 'endDate',
                label: 'End Date',
                type: 'date',
                required: true,
                defaultValue: new Date().toISOString().split('T')[0]
              },
              {
                name: 'gradeLevel',
                label: 'Grade Level',
                type: 'multiselect',
                required: false,
                options: [
                  { value: '6', label: 'Grade 6' },
                  { value: '7', label: 'Grade 7' },
                  { value: '8', label: 'Grade 8' },
                  { value: '9', label: 'Grade 9' },
                  { value: '10', label: 'Grade 10' },
                  { value: '11', label: 'Grade 11' },
                  { value: '12', label: 'Grade 12' }
                ]
              }
            ],
            createdBy: 'admin',
            createdAt: '2023-09-15T10:30:00Z',
            lastRunAt: '2023-10-01T08:15:00Z',
            schedule: {
              frequency: 'weekly',
              dayOfWeek: 1, // Monday
              time: '08:00',
              recipients: ['principal@example.com', 'teachers@example.com'],
              active: true,
              lastSentAt: '2023-10-01T08:15:00Z'
            },
            isPublic: true,
            accessRoles: ['admin', 'teacher', 'registrar']
          },
          {
            id: '2',
            title: 'Academic Performance Summary',
            description: 'Overview of student grades and performance metrics by class and subject',
            type: ReportType.GRADES,
            parameters: [
              {
                name: 'termId',
                label: 'Term',
                type: 'select',
                required: true,
                options: [
                  { value: '1', label: 'Fall 2023' },
                  { value: '2', label: 'Spring 2024' }
                ],
                defaultValue: '1'
              },
              {
                name: 'includeCharts',
                label: 'Include Charts',
                type: 'boolean',
                required: false,
                defaultValue: true
              }
            ],
            createdBy: 'admin',
            createdAt: '2023-09-20T14:45:00Z',
            lastRunAt: '2023-10-02T09:30:00Z',
            isPublic: true,
            accessRoles: ['admin', 'teacher', 'registrar']
          },
          {
            id: '3',
            title: 'Enrollment Trends Report',
            description: 'Analysis of enrollment patterns and trends over time',
            type: ReportType.ENROLLMENT,
            parameters: [
              {
                name: 'years',
                label: 'Number of Years',
                type: 'number',
                required: true,
                defaultValue: 3
              },
              {
                name: 'groupBy',
                label: 'Group By',
                type: 'select',
                required: true,
                options: [
                  { value: 'term', label: 'Term' },
                  { value: 'gradeLevel', label: 'Grade Level' },
                  { value: 'subject', label: 'Subject' }
                ],
                defaultValue: 'term'
              }
            ],
            createdBy: 'registrar',
            createdAt: '2023-08-10T11:20:00Z',
            lastRunAt: '2023-10-01T10:45:00Z',
            schedule: {
              frequency: 'monthly',
              dayOfMonth: 1,
              time: '09:00',
              recipients: ['principal@example.com', 'registrar@example.com'],
              active: true,
              lastSentAt: '2023-10-01T09:00:00Z'
            },
            isPublic: false,
            accessRoles: ['admin', 'registrar']
          },
          {
            id: '4',
            title: 'Teacher Performance Evaluation',
            description: 'Comprehensive evaluation of teacher performance based on student outcomes',
            type: ReportType.TEACHER_PERFORMANCE,
            parameters: [
              {
                name: 'termId',
                label: 'Term',
                type: 'select',
                required: true,
                options: [
                  { value: '1', label: 'Fall 2023' },
                  { value: '2', label: 'Spring 2024' }
                ],
                defaultValue: '1'
              },
              {
                name: 'department',
                label: 'Department',
                type: 'multiselect',
                required: false,
                options: [
                  { value: 'math', label: 'Mathematics' },
                  { value: 'science', label: 'Science' },
                  { value: 'english', label: 'English' },
                  { value: 'history', label: 'History' },
                  { value: 'language', label: 'Foreign Languages' }
                ]
              }
            ],
            createdBy: 'admin',
            createdAt: '2023-09-05T15:30:00Z',
            lastRunAt: '2023-09-30T16:00:00Z',
            isPublic: false,
            accessRoles: ['admin']
          },
          {
            id: '5',
            title: 'At-Risk Students Report',
            description: 'Identifies students who may be at risk academically or attendance-wise',
            type: ReportType.STUDENT_PERFORMANCE,
            parameters: [
              {
                name: 'termId',
                label: 'Term',
                type: 'select',
                required: true,
                options: [
                  { value: '1', label: 'Fall 2023' },
                  { value: '2', label: 'Spring 2024' }
                ],
                defaultValue: '1'
              },
              {
                name: 'riskThreshold',
                label: 'Risk Threshold',
                type: 'select',
                required: true,
                options: [
                  { value: 'high', label: 'High Risk Only' },
                  { value: 'medium', label: 'Medium Risk and Above' },
                  { value: 'all', label: 'All Risk Levels' }
                ],
                defaultValue: 'medium'
              }
            ],
            createdBy: 'counselor',
            createdAt: '2023-09-25T09:15:00Z',
            lastRunAt: '2023-10-02T08:00:00Z',
            schedule: {
              frequency: 'weekly',
              dayOfWeek: 3, // Wednesday
              time: '08:00',
              recipients: ['counselor@example.com', 'principal@example.com'],
              active: true,
              lastSentAt: '2023-10-02T08:00:00Z'
            },
            isPublic: false,
            accessRoles: ['admin', 'teacher']
          }
        ];
        
        setReports(mockReports);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again later.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateReport = () => {
    router.push('/reports/create');
  };

  const handleViewReport = (reportId: string) => {
    router.push(`/reports/${reportId}`);
  };

  const handleRunReport = (reportId: string) => {
    router.push(`/reports/${reportId}/run`);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reportId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleEditReport = () => {
    if (selectedReport) {
      router.push(`/reports/${selectedReport}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteReport = async () => {
    if (!selectedReport) return;
    
    try {
      // In a real application, you would delete the report via the API
      // const response = await fetch(`/api/reports/${selectedReport}`, {
      //   method: 'DELETE'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete report');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the report from the state
      setReports(prevReports => prevReports.filter(report => report.id !== selectedReport));
      
      handleDeleteDialogClose();
    } catch (err) {
      console.error('Error deleting report:', err);
      setError('Failed to delete report. Please try again later.');
      handleDeleteDialogClose();
    }
  };

  const handleScheduleReport = () => {
    if (selectedReport) {
      router.push(`/reports/${selectedReport}/schedule`);
    }
    handleMenuClose();
  };

  const handleShareReport = () => {
    if (selectedReport) {
      router.push(`/reports/${selectedReport}/share`);
    }
    handleMenuClose();
  };

  const handleDownloadReport = async () => {
    if (!selectedReport) return;
    
    try {
      // In a real application, you would download the report via the API
      // const response = await fetch(`/api/reports/${selectedReport}/download`);
      
      // if (!response.ok) {
      //   throw new Error('Failed to download report');
      // }
      
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `report-${selectedReport}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      
      // Simulate download
      alert('Report download started. This is a demo, so no actual file will be downloaded.');
      
      handleMenuClose();
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report. Please try again later.');
      handleMenuClose();
    }
  };

  const filteredReports = reports.filter(report => {
    const titleMatch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatch = report.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const typeMatch = report.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    return titleMatch || descriptionMatch || typeMatch;
  });

  // Get reports based on tab
  const getTabReports = () => {
    switch (tabValue) {
      case 0: // All
        return filteredReports;
      case 1: // Attendance
        return filteredReports.filter(r => r.type === ReportType.ATTENDANCE);
      case 2: // Grades
        return filteredReports.filter(r => r.type === ReportType.GRADES);
      case 3: // Enrollment
        return filteredReports.filter(r => r.type === ReportType.ENROLLMENT);
      case 4: // Performance
        return filteredReports.filter(r => 
          r.type === ReportType.STUDENT_PERFORMANCE || 
          r.type === ReportType.TEACHER_PERFORMANCE
        );
      default:
        return filteredReports;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case ReportType.ATTENDANCE:
        return <PersonIcon />;
      case ReportType.GRADES:
        return <AssessmentIcon />;
      case ReportType.ENROLLMENT:
        return <PeopleIcon />;
      case ReportType.STUDENT_PERFORMANCE:
        return <SchoolIcon />;
      case ReportType.TEACHER_PERFORMANCE:
        return <SchoolIcon />;
      case ReportType.FINANCIAL:
        return <AttachMoneyIcon />;
      case ReportType.CUSTOM:
        return <AssessmentIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  const getReportTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.ATTENDANCE:
        return 'primary.main';
      case ReportType.GRADES:
        return 'success.main';
      case ReportType.ENROLLMENT:
        return 'info.main';
      case ReportType.STUDENT_PERFORMANCE:
        return 'warning.main';
      case ReportType.TEACHER_PERFORMANCE:
        return 'secondary.main';
      case ReportType.FINANCIAL:
        return 'error.main';
      case ReportType.CUSTOM:
        return 'text.primary';
      default:
        return 'text.primary';
    }
  };

  const getReportTypeChip = (type: ReportType) => {
    let label = '';
    let color: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default' = 'default';
    
    switch (type) {
      case ReportType.ATTENDANCE:
        label = 'Attendance';
        color = 'primary';
        break;
      case ReportType.GRADES:
        label = 'Grades';
        color = 'success';
        break;
      case ReportType.ENROLLMENT:
        label = 'Enrollment';
        color = 'info';
        break;
      case ReportType.STUDENT_PERFORMANCE:
        label = 'Student Performance';
        color = 'warning';
        break;
      case ReportType.TEACHER_PERFORMANCE:
        label = 'Teacher Performance';
        color = 'secondary';
        break;
      case ReportType.FINANCIAL:
        label = 'Financial';
        color = 'error';
        break;
      case ReportType.CUSTOM:
        label = 'Custom';
        color = 'default';
        break;
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        sx={{ ml: 1 }}
      />
    );
  };

  // Check if user has permission to access reports
  if (!isAdmin && !['teacher'].includes(user?.role || '')) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reports
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateReport}
            >
              Create Report
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search reports..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Reports" />
            <Tab label="Attendance" />
            <Tab label="Grades" />
            <Tab label="Enrollment" />
            <Tab label="Performance" />
          </Tabs>
        </Paper>
        
        <TabPanel value={tabValue} index={0}>
          {renderReportsList()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderReportsList()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {renderReportsList()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          {renderReportsList()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          {renderReportsList()}
        </TabPanel>
      </Container>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewReport.bind(null, selectedReport || '')}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Report</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRunReport.bind(null, selectedReport || '')}>
          <ListItemIcon>
            <AssessmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Run Report</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadReport}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        {isAdmin && (
          <>
            <Divider />
            <MenuItem onClick={handleScheduleReport}>
              <ListItemIcon>
                <ScheduleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Schedule</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleShareReport}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleEditReport}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleDeleteDialogOpen}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteReport} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );

  function renderReportsList() {
    const tabReports = getTabReports();
    
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (tabReports.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No reports found.
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {tabReports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        bgcolor: getReportTypeColor(report.type),
                        color: 'white',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      {getReportTypeIcon(report.type)}
                    </Box>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {report.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        {getReportTypeChip(report.type)}
                        {report.schedule && (
                          <Chip 
                            icon={<ScheduleIcon />} 
                            label="Scheduled" 
                            size="small" 
                            variant="outlined" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <IconButton
                    aria-label="more"
                    onClick={(e) => handleMenuOpen(e, report.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {report.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(report.createdAt)}
                  </Typography>
                </Box>
                
                {report.lastRunAt && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Run:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(report.lastRunAt)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <Divider />
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewReport(report.id)}
                >
                  View
                </Button>
                <Button 
                  size="small" 
                  startIcon={<AssessmentIcon />}
                  onClick={() => handleRunReport(report.id)}
                >
                  Run Report
                </Button>
                <Button 
                  size="small" 
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    setSelectedReport(report.id);
                    handleDownloadReport();
                  }}
                >
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
};

export default ReportsPage;

