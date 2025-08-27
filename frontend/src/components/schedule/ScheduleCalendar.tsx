import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Class, ClassSchedule, DayOfWeek, Term } from '@/lib/types';

interface ScheduleCalendarProps {
  classes: Class[];
  termId: string;
  canEdit: boolean;
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

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ classes, termId, canEdit }) => {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [term, setTerm] = useState<Term | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!termId) return;

    const fetchTerm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/terms/${termId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch term details');
        }
        
        const data = await response.json();
        setTerm(data);
      } catch (err) {
        console.error('Error fetching term:', err);
        setError('Failed to load term details. Calendar dates may be inaccurate.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerm();
  }, [termId]);

  // Convert classes to FullCalendar events
  const getEvents = () => {
    if (!classes || classes.length === 0) return [];
    
    return classes.flatMap(classItem => {
      if (!classItem.schedules || classItem.schedules.length === 0) {
        return [];
      }
      
      return classItem.schedules.map(schedule => {
        const dayNumber = dayOfWeekMap[schedule.dayOfWeek];
        const color = getRandomColor(classItem.courseId + classItem.section);
        
        return {
          id: `${classItem.id}-${schedule.id}`,
          title: `${classItem.course?.code || 'Unknown'} - ${classItem.section}`,
          daysOfWeek: [dayNumber],
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          extendedProps: {
            classId: classItem.id,
            courseCode: classItem.course?.code,
            courseName: classItem.course?.name,
            section: classItem.section,
            teacher: classItem.teacher?.firstName + ' ' + classItem.teacher?.lastName,
            room: schedule.room || classItem.room,
            building: schedule.building || classItem.building,
          },
          backgroundColor: color,
          borderColor: color,
        };
      });
    });
  };

  const handleEventClick = (info: any) => {
    const classId = info.event.extendedProps.classId;
    const classItem = classes.find(c => c.id === classId);
    
    if (classItem) {
      setSelectedClass(classItem);
      setSelectedEvent(info.event);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedClass(null);
    setSelectedEvent(null);
  };

  const handleEditClass = () => {
    if (selectedClass) {
      router.push(`/classes/${selectedClass.id}/edit`);
    }
  };

  const handleViewClass = () => {
    if (selectedClass) {
      router.push(`/classes/${selectedClass.id}`);
    }
  };

  const getCalendarOptions = () => {
    let validRange = {};
    
    if (term) {
      validRange = {
        start: term.startDate,
        end: term.endDate
      };
    }
    
    return {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      slotMinTime: '07:00:00',
      slotMaxTime: '22:00:00',
      allDaySlot: false,
      height: 'auto',
      validRange,
      eventClick: handleEventClick,
      events: getEvents(),
      slotLabelFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      },
      eventTimeFormat: {
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short'
      }
    };
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {classes.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No classes scheduled for the selected term.
          </Typography>
          {canEdit && (
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => router.push('/classes/new')}
            >
              Create Class
            </Button>
          )}
        </Box>
      ) : (
        <Paper sx={{ p: 2, height: '700px', overflow: 'auto' }}>
          <FullCalendar {...getCalendarOptions()} />
        </Paper>
      )}
      
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Class Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClass && selectedEvent && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  {selectedClass.course?.code}: {selectedClass.course?.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Section {selectedClass.section}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Schedule Information
                    </Typography>
                    <Typography variant="body1">
                      <strong>Day:</strong> {selectedEvent.extendedProps.dayOfWeek}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Location:</strong> {selectedEvent.extendedProps.building} {selectedEvent.extendedProps.room}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Class Information
                    </Typography>
                    <Typography variant="body1">
                      <strong>Teacher:</strong> {selectedClass.teacher ? 
                        `${selectedClass.teacher.firstName} ${selectedClass.teacher.lastName}` : 
                        'Not Assigned'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Capacity:</strong> {selectedClass.enrolledCount || 0}/{selectedClass.capacity || 'Unlimited'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Term:</strong> {selectedClass.term?.name || 'Unknown'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={selectedClass.isActive ? 'Active' : 'Inactive'} 
                    color={selectedClass.isActive ? 'success' : 'default'} 
                  />
                  {selectedClass.waitlistCount > 0 && (
                    <Chip 
                      label={`Waitlist: ${selectedClass.waitlistCount}`} 
                      color="warning" 
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClass} color="primary">
            View Full Details
          </Button>
          {canEdit && (
            <Button onClick={handleEditClass} color="primary" startIcon={<EditIcon />}>
              Edit Class
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleCalendar;

