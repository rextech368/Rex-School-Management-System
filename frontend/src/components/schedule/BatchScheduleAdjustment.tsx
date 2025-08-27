import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  FormHelperText,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardHeader,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Class, DayOfWeek } from '@/lib/types';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface BatchScheduleAdjustmentProps {
  termId: string;
  onChange: (config: any) => void;
}

const BatchScheduleAdjustment: React.FC<BatchScheduleAdjustmentProps> = ({ termId, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [adjustmentType, setAdjustmentType] = useState<string>('room');
  const [newRoom, setNewRoom] = useState<string>('');
  const [newBuilding, setNewBuilding] = useState<string>('');
  const [newDayOfWeek, setNewDayOfWeek] = useState<DayOfWeek | ''>('');
  const [newStartTime, setNewStartTime] = useState<Date | null>(null);
  const [newEndTime, setNewEndTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!termId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/classes?termId=${termId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [termId]);

  useEffect(() => {
    // Update parent component with current configuration
    let config: any = {
      classes: selectedClasses,
      adjustmentType
    };
    
    if (adjustmentType === 'room') {
      config.newRoom = newRoom;
      config.newBuilding = newBuilding;
    } else if (adjustmentType === 'time') {
      config.newDayOfWeek = newDayOfWeek;
      config.newStartTime = newStartTime ? formatTime(newStartTime) : null;
      config.newEndTime = newEndTime ? formatTime(newEndTime) : null;
    }
    
    onChange(config);
  }, [
    selectedClasses, 
    adjustmentType, 
    newRoom, 
    newBuilding, 
    newDayOfWeek, 
    newStartTime, 
    newEndTime, 
    onChange
  ]);

  const formatTime = (date: Date): string => {
    return date.toTimeString().split(' ')[0];
  };

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClasses(event.target.value as string[]);
  };

  const handleAdjustmentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustmentType(event.target.value);
  };

  const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoom(event.target.value);
  };

  const handleBuildingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewBuilding(event.target.value);
  };

  const handleDayOfWeekChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewDayOfWeek(event.target.value as DayOfWeek);
  };

  const handleStartTimeChange = (newValue: Date | null) => {
    setNewStartTime(newValue);
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    setNewEndTime(newValue);
  };

  const handleRemoveClass = (classId: string) => {
    setSelectedClasses(selectedClasses.filter(id => id !== classId));
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="classes-select-label">Select Classes</InputLabel>
            <Select
              labelId="classes-select-label"
              id="classes-select"
              multiple
              value={selectedClasses}
              onChange={handleClassChange}
              input={<OutlinedInput label="Select Classes" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((classId) => {
                    const classItem = classes.find(c => c.id === classId);
                    return (
                      <Chip 
                        key={classId} 
                        label={classItem ? 
                          `${classItem.course?.code || 'Unknown'} - Section ${classItem.section}` : 
                          classId
                        } 
                      />
                    );
                  })}
                </Box>
              )}
              disabled={loading || classes.length === 0}
              startAdornment={
                loading ? (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                ) : null
              }
            >
              {classes.map((classItem) => (
                <MenuItem key={classItem.id} value={classItem.id}>
                  <Checkbox checked={selectedClasses.indexOf(classItem.id) > -1} />
                  <ListItemText 
                    primary={`${classItem.course?.code || 'Unknown'} - Section ${classItem.section}`} 
                    secondary={
                      classItem.teacher ? 
                        `Teacher: ${classItem.teacher.firstName} ${classItem.teacher.lastName}` : 
                        'No teacher assigned'
                    } 
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select the classes you want to adjust
            </FormHelperText>
          </FormControl>
        </Grid>
        
        {selectedClasses.length > 0 && (
          <>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Adjustment Type</FormLabel>
                <RadioGroup
                  row
                  name="adjustment-type"
                  value={adjustmentType}
                  onChange={handleAdjustmentTypeChange}
                >
                  <FormControlLabel value="room" control={<Radio />} label="Room Assignment" />
                  <FormControlLabel value="time" control={<Radio />} label="Schedule Time" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            {adjustmentType === 'room' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Building"
                    value={newBuilding}
                    onChange={handleBuildingChange}
                    helperText="New building for selected classes"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="New Room"
                    value={newRoom}
                    onChange={handleRoomChange}
                    helperText="New room number for selected classes"
                  />
                </Grid>
              </>
            )}
            
            {adjustmentType === 'time' && (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="day-of-week-label">Day of Week</InputLabel>
                    <Select
                      labelId="day-of-week-label"
                      id="day-of-week"
                      value={newDayOfWeek}
                      label="Day of Week"
                      onChange={handleDayOfWeekChange}
                    >
                      <MenuItem value="">
                        <em>No change</em>
                      </MenuItem>
                      {Object.values(DayOfWeek).map((day) => (
                        <MenuItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>New day of week for selected classes</FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="New Start Time"
                      value={newStartTime}
                      onChange={handleStartTimeChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          helperText: "New start time for selected classes"
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="New End Time"
                      value={newEndTime}
                      onChange={handleEndTimeChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          helperText: "New end time for selected classes"
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Selected Classes
              </Typography>
              
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List dense>
                  {selectedClasses.map(classId => {
                    const classItem = classes.find(c => c.id === classId);
                    return (
                      <ListItem key={classId}>
                        <ListItemText
                          primary={classItem ? 
                            `${classItem.course?.code || 'Unknown'} - Section ${classItem.section}` : 
                            classId
                          }
                          secondary={classItem ? 
                            `Room: ${classItem.room || 'Not assigned'}, Teacher: ${
                              classItem.teacher ? 
                                `${classItem.teacher.firstName} ${classItem.teacher.lastName}` : 
                                'Not assigned'
                            }` : 
                            ''
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleRemoveClass(classId)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardHeader title="Summary" />
                <CardContent>
                  <Typography variant="body1">
                    This will update <strong>{selectedClasses.length}</strong> classes 
                    with the following changes:
                  </Typography>
                  
                  {adjustmentType === 'room' && (
                    <Box sx={{ mt: 1 }}>
                      {newBuilding && (
                        <Typography variant="body1">
                          • New building: <strong>{newBuilding}</strong>
                        </Typography>
                      )}
                      {newRoom && (
                        <Typography variant="body1">
                          • New room: <strong>{newRoom}</strong>
                        </Typography>
                      )}
                      {!newBuilding && !newRoom && (
                        <Typography variant="body1" color="error">
                          No room changes specified
                        </Typography>
                      )}
                    </Box>
                  )}
                  
                  {adjustmentType === 'time' && (
                    <Box sx={{ mt: 1 }}>
                      {newDayOfWeek && (
                        <Typography variant="body1">
                          • New day: <strong>{newDayOfWeek.charAt(0).toUpperCase() + newDayOfWeek.slice(1).toLowerCase()}</strong>
                        </Typography>
                      )}
                      {newStartTime && (
                        <Typography variant="body1">
                          • New start time: <strong>{formatTime(newStartTime)}</strong>
                        </Typography>
                      )}
                      {newEndTime && (
                        <Typography variant="body1">
                          • New end time: <strong>{formatTime(newEndTime)}</strong>
                        </Typography>
                      )}
                      {!newDayOfWeek && !newStartTime && !newEndTime && (
                        <Typography variant="body1" color="error">
                          No time changes specified
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default BatchScheduleAdjustment;

