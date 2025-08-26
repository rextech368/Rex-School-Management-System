import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Enrollment, EnrollmentStatus, Term, Class, ClassSchedule, DayOfWeek } from '@/lib/types';

interface StudentScheduleProps {
  termId: string;
  onTermChange: (termId: string) => void;
  terms: Term[];
  studentId?: string;
}

// Map DayOfWeek enum to FullCalendar day numbers
const dayOfWeekMap: Record<DayOfWeek, number> = {
  [DayOfWeek.SUNDAY]: 0,
  [DayOfWeek.MONDAY]: 1,
  [DayOfWeek.TUESDAY]: 2,
  [DayOfWeek.WEDNESDAY]: 3,
  [DayOfWeek.THURSDAY]: 4,
  [DayOfWeek.FRIDAY]: 5,
  [DayOfWeek.SATURDAY]: 6,
};

// Generate random colors for classes
const getRandomColor = (seed: string) => {
  // Generate a deterministic color based on the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL color with fixed saturation and lightness for readability
  const h = hash % 360;
  return `hsl(${h}, 70%, 65%)`;
};

const StudentSchedule: React.FC<StudentScheduleProps> = ({
  termId,
  onTermChange,
  terms,
  studentId
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [dropDialogOpen, setDropDialogOpen] = useState(false);
  const [dropLoading, setDropLoading] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const [dropSuccess, setDropSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!termId || !studentId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/enrollments?studentId=${studentId}&termId=${termId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch enrollments');
        }
        
        const data = await response.json();
        setEnrollments(data);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('Failed to load enrollments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [termId, studentId]);

  const handleTermChange = (event: SelectChangeEvent) => {
    onTermChange(event.target.value);
  };

  const handleViewModeChange = (event: SelectChangeEvent) => {
    setViewMode(event.target.value as 'calendar' | 'list');
  };

  const handleDropClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setDropDialogOpen(true);
    setDropError(null);
    setDropSuccess(null);
  };

  const handleCloseDropDialog = () => {
    setDropDialogOpen(false);
    setSelectedEnrollment(null);
  };

  const handleConfirmDrop = async () => {
    if (!selectedEnrollment) return;
    
    try {
      setDropLoading(true);
      setDropError(null);
      setDropSuccess(null);
      
      const response = await fetch(`/api/enrollments/${selectedEnrollment.id}`, {
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
      
      setDropSuccess('Successfully dropped class!');
      
      // Close dialog after a short delay
      setTimeout(() => {
        setDropDialogOpen(false);
        setSelectedEnrollment(null);
      }, 1500);
    } catch (err) {
      console.error('Error dropping class:', err);
      setDropError(err.message || 'An error occurred while dropping the class.');
    } finally {
      setDropLoading(false);
    }
  };

  // Filter enrollments to only show enrolled ones
  const activeEnrollments = enrollments.filter(
    enrollment => enrollment.status === EnrollmentStatus.ENROLLED
  );

  // Convert enrollments to FullCalendar events
  const getEvents = () => {
    if (!activeEnrollments || activeEnrollments.length === 0) return [];
    
    return activeEnrollments.flatMap(enrollment => {
      if (!enrollment.class || !enrollment.class.schedules || enrollment.class.schedules.length === 0) {
        return [];
      }
      
      return enrollment.class.schedules.map(schedule => {
        const dayNumber = dayOfWeekMap[schedule.dayOfWeek];
        const color = getRandomColor(enrollment.class?.courseId || enrollment.classId);
        
        return {
          id: `${enrollment.id}-${schedule.id}`,
          title: `${enrollment.class?.course?.code || 'Unknown'} - ${enrollment.class?.section || ''}`,
          daysOfWeek: [dayNumber],
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          extendedProps: {
            enrollmentId: enrollment.id,
            courseCode: enrollment.class?.course?.code,
            courseName: enrollment.class?.course?.name,
            section: enrollment.class?.section,
            teacher: enrollment.class?.teacher?.firstName + ' ' + enrollment.class?.teacher?.lastName,
            room: schedule.room || enrollment.class?.room,
            building: schedule.building || enrollment.class?.building,
          },
          backgroundColor: color,
          borderColor: color,
        };
      });
    });
  };

  // Format schedule for display
  const formatSchedule = (schedule: any) => {
    const dayName = schedule.dayOfWeek.charAt(0).toUpperCase() + schedule.dayOfWeek.slice(1).toLowerCase();
    return `${dayName} ${schedule.startTime} - ${schedule.endTime}`;
  };

  // Calculate total credits
  const totalCredits = activeEnrollments.reduce((sum, enrollment) => {
    return sum + (enrollment.class?.course?.credits || 0);
  }, 0);

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
          <FormControl fullWidth>
            <InputLabel id="view-mode-label">View Mode</InputLabel>
            <Select
              labelId="view-mode-label"
              id="view-mode"
              value={viewMode}
              label="View Mode"
              onChange={handleViewModeChange}
            >
              <MenuItem value="calendar">Calendar View</MenuItem>
              <MenuItem value="list">List View</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Schedule Summary
              </Typography>
              <Typography variant="body2">
                <strong>Classes:</strong> {activeEnrollments.length}
              </Typography>
              <Typography variant="body2">
                <strong>Total Credits:</strong> {totalCredits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {dropSuccess && <Alert severity="success" sx={{ mb: 3 }}>{dropSuccess}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : activeEnrollments.length === 0 ? (
        <Alert severity="info">
          No classes in your schedule for the selected term.
        </Alert>
      ) : viewMode === 'calendar' ? (
        <Paper sx={{ p: 2, height: '700px', overflow: 'auto' }}>
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            height="auto"
            events={getEvents()}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {activeEnrollments.map((enrollment) => (
            <Grid item xs={12} md={6} key={enrollment.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {enrollment.class?.course?.code}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    {enrollment.class?.course?.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Section {enrollment.class?.section}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Instructor:</strong> {enrollment.class?.teacher ? 
                      `${enrollment.class.teacher.firstName} ${enrollment.class.teacher.lastName}` : 
                      'Not Assigned'}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Credits:</strong> {enrollment.class?.course?.credits || 'N/A'}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Department:</strong> {enrollment.class?.course?.department || 'N/A'}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Schedule:</strong>
                  </Typography>
                  
                  {enrollment.class?.schedules && enrollment.class.schedules.length > 0 ? (
                    enrollment.class.schedules.map((schedule, index) => (
                      <Typography key={index} variant="body2" gutterBottom>
                        {formatSchedule(schedule)}
                        {schedule.room && ` - ${schedule.building || ''} ${schedule.room}`}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No schedule available
                    </Typography>
                  )}
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Location:</strong> {enrollment.class?.room ? 
                      `${enrollment.class.building ? enrollment.class.building + ' ' : ''}${enrollment.class.room}` : 
                      'Not Assigned'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDropClick(enrollment)}
                  >
                    Drop Class
                  </Button>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => window.open(`/classes/${enrollment.classId}`, '_blank')}
                  >
                    View Class Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Dialog
        open={dropDialogOpen}
        onClose={handleCloseDropDialog}
        aria-labelledby="drop-dialog-title"
        aria-describedby="drop-dialog-description"
      >
        <DialogTitle id="drop-dialog-title">
          Confirm Drop Class
        </DialogTitle>
        <DialogContent>
          {dropError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dropError}
            </Alert>
          )}
          {dropSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {dropSuccess}
            </Alert>
          )}
          <DialogContentText id="drop-dialog-description">
            Are you sure you want to drop this class?
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Class:</strong> {selectedEnrollment?.class?.course?.code}: {selectedEnrollment?.class?.course?.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Section:</strong> {selectedEnrollment?.class?.section}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Instructor:</strong> {selectedEnrollment?.class?.teacher ? 
                  `${selectedEnrollment.class.teacher.firstName} ${selectedEnrollment.class.teacher.lastName}` : 
                  'Not Assigned'}
              </Typography>
            </Box>
            <Alert severity="warning" sx={{ mt: 2 }}>
              Dropping this class may affect your academic progress. Please consult with your advisor if you have any concerns.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDropDialog} disabled={dropLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDrop} 
            color="error" 
            disabled={dropLoading || dropSuccess !== null}
            startIcon={dropLoading ? <CircularProgress size={20} /> : null}
          >
            Drop Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentSchedule;

