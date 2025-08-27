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
  Switch,
  FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Class, Term } from '@/lib/types';

interface BatchTermTransitionProps {
  termId: string;
  onChange: (config: any) => void;
}

const BatchTermTransition: React.FC<BatchTermTransitionProps> = ({ termId, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [targetTermId, setTargetTermId] = useState<string>('');
  const [keepTeachers, setKeepTeachers] = useState<boolean>(true);
  const [keepRooms, setKeepRooms] = useState<boolean>(true);
  const [keepSchedules, setKeepSchedules] = useState<boolean>(true);
  const [adjustCapacity, setAdjustCapacity] = useState<boolean>(false);
  const [capacityAdjustment, setCapacityAdjustment] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!termId) return;
      
      try {
        setLoading(true);
        
        // Fetch classes for the current term
        const classesResponse = await fetch(`/api/classes?termId=${termId}`);
        if (!classesResponse.ok) {
          throw new Error('Failed to fetch classes');
        }
        const classesData = await classesResponse.json();
        setClasses(classesData);
        
        // Fetch all terms
        const termsResponse = await fetch('/api/terms');
        if (!termsResponse.ok) {
          throw new Error('Failed to fetch terms');
        }
        const termsData = await termsResponse.json();
        
        // Filter out the current term from target options
        const filteredTerms = termsData.filter((term: Term) => term.id !== termId);
        setTerms(filteredTerms);
        
        // Set a default target term if available
        if (filteredTerms.length > 0) {
          // Try to find a term with a later start date
          const currentTerm = termsData.find((term: Term) => term.id === termId);
          if (currentTerm) {
            const laterTerms = filteredTerms.filter(
              (term: Term) => new Date(term.startDate) > new Date(currentTerm.startDate)
            );
            if (laterTerms.length > 0) {
              setTargetTermId(laterTerms[0].id);
            } else {
              setTargetTermId(filteredTerms[0].id);
            }
          } else {
            setTargetTermId(filteredTerms[0].id);
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
  }, [termId]);

  useEffect(() => {
    // Update parent component with current configuration
    onChange({
      classes: selectedClasses,
      targetTermId,
      keepTeachers,
      keepRooms,
      keepSchedules,
      adjustCapacity,
      capacityAdjustment
    });
  }, [
    selectedClasses, 
    targetTermId, 
    keepTeachers, 
    keepRooms, 
    keepSchedules, 
    adjustCapacity, 
    capacityAdjustment, 
    onChange
  ]);

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedClasses(event.target.value as string[]);
  };

  const handleTargetTermChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTargetTermId(event.target.value as string);
  };

  const handleKeepTeachersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeepTeachers(event.target.checked);
  };

  const handleKeepRoomsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeepRooms(event.target.checked);
  };

  const handleKeepSchedulesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeepSchedules(event.target.checked);
  };

  const handleAdjustCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdjustCapacity(event.target.checked);
  };

  const handleCapacityAdjustmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapacityAdjustment(parseInt(event.target.value) || 0);
  };

  const handleRemoveClass = (classId: string) => {
    setSelectedClasses(selectedClasses.filter(id => id !== classId));
  };

  const handleSelectAllClasses = () => {
    setSelectedClasses(classes.map(c => c.id));
  };

  const handleClearSelection = () => {
    setSelectedClasses([]);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="target-term-label">Target Term</InputLabel>
            <Select
              labelId="target-term-label"
              id="target-term"
              value={targetTermId}
              label="Target Term"
              onChange={handleTargetTermChange}
              disabled={loading || terms.length === 0}
            >
              {terms.map((term) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.name} ({new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()})
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select the term to which classes will be transitioned
            </FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1">
              Select Classes to Transition
            </Typography>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={selectedClasses.length === classes.length} 
                    indeterminate={selectedClasses.length > 0 && selectedClasses.length < classes.length}
                    onChange={selectedClasses.length === classes.length ? handleClearSelection : handleSelectAllClasses}
                    disabled={loading || classes.length === 0}
                  />
                }
                label="Select All"
              />
            </Box>
          </Box>
          
          <FormControl fullWidth>
            <Select
              multiple
              value={selectedClasses}
              onChange={handleClassChange}
              input={<OutlinedInput />}
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
              sx={{ maxHeight: 300 }}
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
              Select the classes you want to transition to the target term
            </FormHelperText>
          </FormControl>
        </Grid>
        
        {selectedClasses.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Transition Options
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={keepTeachers} 
                          onChange={handleKeepTeachersChange} 
                        />
                      }
                      label="Keep Teacher Assignments"
                    />
                    <FormHelperText>
                      Maintain the same teacher assignments in the new term
                    </FormHelperText>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={keepRooms} 
                          onChange={handleKeepRoomsChange} 
                        />
                      }
                      label="Keep Room Assignments"
                    />
                    <FormHelperText>
                      Maintain the same room assignments in the new term
                    </FormHelperText>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={keepSchedules} 
                          onChange={handleKeepSchedulesChange} 
                        />
                      }
                      label="Keep Schedules"
                    />
                    <FormHelperText>
                      Maintain the same class schedules in the new term
                    </FormHelperText>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={adjustCapacity} 
                          onChange={handleAdjustCapacityChange} 
                        />
                      }
                      label="Adjust Capacity"
                    />
                    <FormHelperText>
                      Modify the capacity of classes in the new term
                    </FormHelperText>
                  </Grid>
                  
                  {adjustCapacity && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Capacity Adjustment"
                        type="number"
                        value={capacityAdjustment}
                        onChange={handleCapacityAdjustmentChange}
                        helperText="Positive values increase capacity, negative values decrease capacity"
                      />
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardHeader title="Transition Summary" />
                <CardContent>
                  <Typography variant="body1">
                    This will transition <strong>{selectedClasses.length}</strong> classes 
                    from the current term to <strong>{terms.find(t => t.id === targetTermId)?.name || targetTermId}</strong>.
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    The following settings will be applied:
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary={`Teacher Assignments: ${keepTeachers ? 'Preserved' : 'Reset'}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={`Room Assignments: ${keepRooms ? 'Preserved' : 'Reset'}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={`Class Schedules: ${keepSchedules ? 'Preserved' : 'Reset'}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary={adjustCapacity 
                          ? `Capacity: Adjusted by ${capacityAdjustment > 0 ? '+' : ''}${capacityAdjustment}` 
                          : 'Capacity: Unchanged'
                        } 
                      />
                    </ListItem>
                  </List>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Student enrollments will not be transferred to the new term.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default BatchTermTransition;

