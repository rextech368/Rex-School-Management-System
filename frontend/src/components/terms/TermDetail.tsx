import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Term } from '@/lib/types';

interface TermDetailProps {
  term: Term;
}

interface TermEvent {
  id: string;
  name: string;
  date: Date;
  type: string;
  description?: string;
}

const TermDetail: React.FC<TermDetailProps> = ({ term }) => {
  const [events, setEvents] = useState<TermEvent[]>(term.events || []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventType, setEventType] = useState('holiday');
  const [eventDescription, setEventDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddEvent = () => {
    setDialogOpen(true);
    setEventName('');
    setEventDate(null);
    setEventType('holiday');
    setEventDescription('');
    setError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveEvent = async () => {
    if (!eventName || !eventDate) {
      setError('Event name and date are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const newEvent: TermEvent = {
        id: Date.now().toString(), // Temporary ID
        name: eventName,
        date: eventDate,
        type: eventType,
        description: eventDescription || undefined
      };
      
      // In a real application, you would save this to the backend
      // const response = await fetch(`/api/terms/${term.id}/events`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newEvent),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to add event');
      // }
      
      // const savedEvent = await response.json();
      // setEvents([...events, savedEvent]);
      
      // For now, just add it to the local state
      setEvents([...events, newEvent]);
      setDialogOpen(false);
    } catch (err) {
      console.error('Error adding event:', err);
      setError(err.message || 'An error occurred while adding the event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      
      // In a real application, you would delete this from the backend
      // const response = await fetch(`/api/terms/${term.id}/events/${eventId}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete event');
      // }
      
      // For now, just remove it from the local state
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || 'An error occurred while deleting the event.');
    } finally {
      setLoading(false);
    }
  };

  // Get term status for display
  const getTermStatus = () => {
    const now = new Date();
    const startDate = new Date(term.startDate);
    const endDate = new Date(term.endDate);
    
    if (!term.isActive) {
      return { label: 'Inactive', color: 'default' };
    } else if (now < startDate) {
      return { label: 'Upcoming', color: 'info' };
    } else if (now > endDate) {
      return { label: 'Completed', color: 'secondary' };
    } else {
      return { label: 'In Progress', color: 'success' };
    }
  };

  // Get registration status for display
  const getRegistrationStatus = () => {
    if (!term.registrationStart || !term.registrationEnd) {
      return { label: 'Not Configured', color: 'default' };
    }
    
    const now = new Date();
    const regStart = new Date(term.registrationStart);
    const regEnd = new Date(term.registrationEnd);
    
    if (now < regStart) {
      return { label: 'Not Started', color: 'default' };
    } else if (now > regEnd) {
      return { label: 'Closed', color: 'error' };
    } else {
      return { label: 'Open', color: 'success' };
    }
  };

  const termStatus = getTermStatus();
  const registrationStatus = getRegistrationStatus();

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Term Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.name}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Code
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.code}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.type}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Academic Year
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.academicYear || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.description || 'No description provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Chip 
                  label={termStatus.label} 
                  color={termStatus.color as any} 
                  size="small" 
                />
                {term.isCurrent && (
                  <Chip 
                    label="Current Term" 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Term Dates
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {new Date(term.startDate).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {new Date(term.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {Math.ceil((new Date(term.endDate).getTime() - new Date(term.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Registration Start
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.registrationStart ? new Date(term.registrationStart).toLocaleDateString() : 'Not set'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Registration End
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {term.registrationEnd ? new Date(term.registrationEnd).toLocaleDateString() : 'Not set'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Registration Status
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Chip 
                  label={registrationStatus.label} 
                  color={registrationStatus.color as any} 
                  size="small" 
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Term Calendar Events
              </Typography>
              <Button 
                startIcon={<AddIcon />} 
                onClick={handleAddEvent}
                variant="outlined"
                size="small"
              >
                Add Event
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {events.length === 0 ? (
              <Alert severity="info">
                No events have been added to this term's calendar.
              </Alert>
            ) : (
              <List>
                {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
                  <ListItem 
                    key={event.id}
                    secondaryAction={
                      <Button
                        startIcon={<DeleteIcon />}
                        color="error"
                        size="small"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1">
                            {event.name}
                          </Typography>
                          <Chip 
                            label={event.type} 
                            size="small" 
                            color={
                              event.type === 'holiday' ? 'error' :
                              event.type === 'deadline' ? 'warning' :
                              event.type === 'event' ? 'info' :
                              'default'
                            }
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {new Date(event.date).toLocaleDateString()}
                          </Typography>
                          {event.description && (
                            <Typography variant="body2" color="text.secondary">
                              {event.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Add Calendar Event</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <DialogContentText>
              Add an event to the term calendar, such as holidays, deadlines, or special events.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Event Name"
              fullWidth
              variant="outlined"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <DatePicker
              label="Event Date"
              value={eventDate}
              onChange={(newValue) => setEventDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  margin: "dense",
                  sx: { mb: 2 }
                }
              }}
            />
            <TextField
              select
              margin="dense"
              label="Event Type"
              fullWidth
              variant="outlined"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="holiday">Holiday</MenuItem>
              <MenuItem value="deadline">Deadline</MenuItem>
              <MenuItem value="event">Special Event</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="Description (Optional)"
              fullWidth
              variant="outlined"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent} 
              variant="contained" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Event'}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </Box>
  );
};

export default TermDetail;

