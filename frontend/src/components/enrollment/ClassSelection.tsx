import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { Class, Course, Term, Enrollment, EnrollmentStatus } from '@/lib/types';

interface ClassSelectionProps {
  termId: string;
  onTermChange: (termId: string) => void;
  terms: Term[];
  studentId?: string;
  adminView?: boolean;
  readOnly?: boolean;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({
  termId,
  onTermChange,
  terms,
  studentId,
  adminView = false,
  readOnly = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [enrollingClass, setEnrollingClass] = useState<Class | null>(null);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<string | null>(null);

  // Extract unique departments for filtering
  const departments = [...new Set(classes
    .filter(classItem => classItem.course?.department)
    .map(classItem => classItem.course?.department || '')
  )];

  useEffect(() => {
    const fetchData = async () => {
      if (!termId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch classes for the selected term
        const classesResponse = await fetch(`/api/classes?termId=${termId}`);
        if (!classesResponse.ok) {
          throw new Error('Failed to fetch classes');
        }
        const classesData = await classesResponse.json();
        setClasses(classesData);
        
        // Fetch student enrollments if studentId is provided
        if (studentId) {
          const enrollmentsResponse = await fetch(`/api/enrollments?studentId=${studentId}&termId=${termId}`);
          if (!enrollmentsResponse.ok) {
            throw new Error('Failed to fetch enrollments');
          }
          const enrollmentsData = await enrollmentsResponse.json();
          setEnrollments(enrollmentsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [termId, studentId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDepartmentFilterChange = (event: SelectChangeEvent) => {
    setDepartmentFilter(event.target.value);
  };

  const handleTermChange = (event: SelectChangeEvent) => {
    onTermChange(event.target.value);
  };

  const toggleExpandClass = (classId: string) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleEnrollClick = (classItem: Class) => {
    setEnrollingClass(classItem);
    setEnrollmentDialogOpen(true);
    setEnrollmentError(null);
    setEnrollmentSuccess(null);
  };

  const handleCloseEnrollmentDialog = () => {
    setEnrollmentDialogOpen(false);
    setEnrollingClass(null);
  };

  const handleConfirmEnrollment = async () => {
    if (!enrollingClass || !studentId) return;
    
    try {
      setEnrollmentLoading(true);
      setEnrollmentError(null);
      setEnrollmentSuccess(null);
      
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: enrollingClass.id,
          studentId: studentId,
          status: EnrollmentStatus.ENROLLED
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll in class');
      }
      
      const data = await response.json();
      
      // Update local enrollments list
      setEnrollments([...enrollments, data]);
      
      setEnrollmentSuccess('Successfully enrolled in class!');
      
      // Close dialog after a short delay
      setTimeout(() => {
        setEnrollmentDialogOpen(false);
        setEnrollingClass(null);
      }, 1500);
    } catch (err) {
      console.error('Error enrolling in class:', err);
      setEnrollmentError(err.message || 'An error occurred while enrolling in the class.');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleDropClass = async (classId: string) => {
    if (!studentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Find the enrollment for this class
      const enrollment = enrollments.find(e => e.classId === classId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }
      
      const response = await fetch(`/api/enrollments/${enrollment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: EnrollmentStatus.DROPPED
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to drop class');
      }
      
      const data = await response.json();
      
      // Update local enrollments list
      setEnrollments(enrollments.map(e => 
        e.id === data.id ? data : e
      ));
      
      setEnrollmentSuccess('Successfully dropped class!');
    } catch (err) {
      console.error('Error dropping class:', err);
      setError(err.message || 'An error occurred while dropping the class.');
    } finally {
      setLoading(false);
    }
  };

  // Filter classes based on search term and department filter
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      searchTerm === '' || 
      (classItem.course?.name && classItem.course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (classItem.course?.code && classItem.course.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (classItem.section && classItem.section.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = 
      departmentFilter === '' || 
      classItem.course?.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Check if a student is enrolled in a class
  const isEnrolled = (classId: string) => {
    return enrollments.some(enrollment => 
      enrollment.classId === classId && 
      enrollment.status === EnrollmentStatus.ENROLLED
    );
  };

  // Check if a student is waitlisted for a class
  const isWaitlisted = (classId: string) => {
    return enrollments.some(enrollment => 
      enrollment.classId === classId && 
      enrollment.status === EnrollmentStatus.WAITLISTED
    );
  };

  // Check if a class is full
  const isClassFull = (classItem: Class) => {
    return classItem.enrolledCount >= classItem.capacity;
  };

  // Format schedule for display
  const formatSchedule = (schedule: any) => {
    const dayName = schedule.dayOfWeek.charAt(0).toUpperCase() + schedule.dayOfWeek.slice(1).toLowerCase();
    return `${dayName} ${schedule.startTime} - ${schedule.endTime}`;
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="term-select-label">Academic Term</InputLabel>
            <Select
              labelId="term-select-label"
              id="term-select"
              value={termId}
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
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Classes"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="department-filter-label">Department</InputLabel>
            <Select
              labelId="department-filter-label"
              value={departmentFilter}
              label="Department"
              onChange={handleDepartmentFilterChange}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="">All Departments</MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {enrollmentSuccess && <Alert severity="success" sx={{ mb: 3 }}>{enrollmentSuccess}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredClasses.length === 0 ? (
        <Alert severity="info">
          No classes found matching your criteria.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredClasses.map((classItem) => {
            const enrolled = isEnrolled(classItem.id);
            const waitlisted = isWaitlisted(classItem.id);
            const isFull = isClassFull(classItem);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={classItem.id}>
                <Card 
                  variant="outlined"
                  sx={{
                    borderLeft: enrolled ? '4px solid #4caf50' : 
                              waitlisted ? '4px solid #ff9800' : 
                              'none'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {classItem.course?.code}
                      </Typography>
                      <Box>
                        {enrolled && (
                          <Tooltip title="Enrolled">
                            <Chip 
                              icon={<CheckCircleIcon />} 
                              label="Enrolled" 
                              color="success" 
                              size="small" 
                            />
                          </Tooltip>
                        )}
                        {waitlisted && (
                          <Tooltip title="Waitlisted">
                            <Chip 
                              icon={<WarningIcon />} 
                              label="Waitlisted" 
                              color="warning" 
                              size="small" 
                            />
                          </Tooltip>
                        )}
                        {isFull && !enrolled && !waitlisted && (
                          <Tooltip title="Class is full">
                            <Chip 
                              icon={<ErrorIcon />} 
                              label="Full" 
                              color="error" 
                              size="small" 
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      {classItem.course?.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Section {classItem.section}
                    </Typography>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Instructor:</strong> {classItem.teacher ? 
                        `${classItem.teacher.firstName} ${classItem.teacher.lastName}` : 
                        'Not Assigned'}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Schedule:</strong> {classItem.schedules && classItem.schedules.length > 0 ? 
                        formatSchedule(classItem.schedules[0]) : 
                        'No schedule'}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Location:</strong> {classItem.room ? 
                        `${classItem.building ? classItem.building + ' ' : ''}${classItem.room}` : 
                        'Not Assigned'}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Enrollment:</strong> {classItem.enrolledCount}/{classItem.capacity}
                    </Typography>
                    
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleExpandClass(classItem.id)}
                        aria-expanded={expandedClass === classItem.id}
                        aria-label="show more"
                      >
                        {expandedClass === classItem.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      
                      <Tooltip title="Department">
                        <Chip 
                          label={classItem.course?.department} 
                          size="small" 
                          variant="outlined"
                        />
                      </Tooltip>
                    </Box>
                    
                    <Collapse in={expandedClass === classItem.id} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Credits:</strong> {classItem.course?.credits}
                        </Typography>
                        
                        {classItem.course?.description && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Description:</strong> {classItem.course.description.length > 150 ? 
                              `${classItem.course.description.substring(0, 150)}...` : 
                              classItem.course.description}
                          </Typography>
                        )}
                        
                        {classItem.schedules && classItem.schedules.length > 1 && (
                          <>
                            <Typography variant="body2" gutterBottom>
                              <strong>All Schedules:</strong>
                            </Typography>
                            <List dense>
                              {classItem.schedules.map((schedule, index) => (
                                <ListItem key={index} disablePadding>
                                  <ListItemText 
                                    primary={formatSchedule(schedule)} 
                                    secondary={schedule.room ? `${schedule.building || ''} ${schedule.room}` : ''}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </>
                        )}
                        
                        {classItem.waitlistCount > 0 && (
                          <Typography variant="body2" color="warning.main" gutterBottom>
                            <strong>Waitlist:</strong> {classItem.waitlistCount} students
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </CardContent>
                  
                  {!readOnly && !adminView && (
                    <CardActions>
                      {enrolled ? (
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleDropClass(classItem.id)}
                          disabled={loading}
                        >
                          Drop Class
                        </Button>
                      ) : waitlisted ? (
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleDropClass(classItem.id)}
                          disabled={loading}
                        >
                          Remove from Waitlist
                        </Button>
                      ) : (
                        <Button 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEnrollClick(classItem)}
                          disabled={loading || !studentId}
                        >
                          {isFull ? 'Join Waitlist' : 'Enroll'}
                        </Button>
                      )}
                      
                      <Button 
                        size="small" 
                        color="inherit" 
                        onClick={() => toggleExpandClass(classItem.id)}
                      >
                        {expandedClass === classItem.id ? 'Show Less' : 'Show More'}
                      </Button>
                    </CardActions>
                  )}
                  
                  {adminView && (
                    <CardActions>
                      <Button 
                        size="small" 
                        color="primary" 
                        onClick={() => router.push(`/classes/${classItem.id}`)}
                      >
                        View Class
                      </Button>
                      <Button 
                        size="small" 
                        color="inherit" 
                        onClick={() => router.push(`/enrollment/manage?classId=${classItem.id}`)}
                      >
                        Manage Enrollments
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      <Dialog
        open={enrollmentDialogOpen}
        onClose={handleCloseEnrollmentDialog}
        aria-labelledby="enrollment-dialog-title"
        aria-describedby="enrollment-dialog-description"
      >
        <DialogTitle id="enrollment-dialog-title">
          {isClassFull(enrollingClass) ? 'Join Waitlist' : 'Confirm Enrollment'}
        </DialogTitle>
        <DialogContent>
          {enrollmentError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {enrollmentError}
            </Alert>
          )}
          {enrollmentSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {enrollmentSuccess}
            </Alert>
          )}
          <DialogContentText id="enrollment-dialog-description">
            {isClassFull(enrollingClass) ? (
              <>
                This class is currently full. Would you like to join the waitlist?
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Class:</strong> {enrollingClass?.course?.code}: {enrollingClass?.course?.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Section:</strong> {enrollingClass?.section}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Current Waitlist:</strong> {enrollingClass?.waitlistCount} students
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                Are you sure you want to enroll in this class?
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Class:</strong> {enrollingClass?.course?.code}: {enrollingClass?.course?.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Section:</strong> {enrollingClass?.section}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Instructor:</strong> {enrollingClass?.teacher ? 
                      `${enrollingClass.teacher.firstName} ${enrollingClass.teacher.lastName}` : 
                      'Not Assigned'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Schedule:</strong> {enrollingClass?.schedules && enrollingClass.schedules.length > 0 ? 
                      formatSchedule(enrollingClass.schedules[0]) : 
                      'No schedule'}
                  </Typography>
                </Box>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEnrollmentDialog} disabled={enrollmentLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmEnrollment} 
            color="primary" 
            disabled={enrollmentLoading || enrollmentSuccess !== null}
            startIcon={enrollmentLoading ? <CircularProgress size={20} /> : null}
          >
            {isClassFull(enrollingClass) ? 'Join Waitlist' : 'Enroll'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassSelection;

