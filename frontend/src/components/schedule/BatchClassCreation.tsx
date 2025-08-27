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
  CardHeader
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Course } from '@/lib/types';

interface BatchClassCreationProps {
  termId: string;
  onChange: (config: any) => void;
}

const BatchClassCreation: React.FC<BatchClassCreationProps> = ({ termId, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [sectionsPerCourse, setSectionsPerCourse] = useState<number>(1);
  const [capacity, setCapacity] = useState<number>(30);
  const [roomPrefix, setRoomPrefix] = useState<string>('');
  const [buildingPrefix, setBuildingPrefix] = useState<string>('');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!termId) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/courses?isActive=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [termId]);

  useEffect(() => {
    // Update parent component with current configuration
    onChange({
      courses: selectedCourses,
      sectionsPerCourse,
      capacity,
      roomPrefix,
      buildingPrefix
    });
  }, [selectedCourses, sectionsPerCourse, capacity, roomPrefix, buildingPrefix, onChange]);

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourses(event.target.value as string[]);
  };

  const handleSectionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setSectionsPerCourse(isNaN(value) ? 1 : Math.max(1, value));
  };

  const handleCapacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setCapacity(isNaN(value) ? 30 : Math.max(1, value));
  };

  const handleRoomPrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomPrefix(event.target.value);
  };

  const handleBuildingPrefixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBuildingPrefix(event.target.value);
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(id => id !== courseId));
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="courses-select-label">Select Courses</InputLabel>
            <Select
              labelId="courses-select-label"
              id="courses-select"
              multiple
              value={selectedCourses}
              onChange={handleCourseChange}
              input={<OutlinedInput label="Select Courses" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((courseId) => {
                    const course = courses.find(c => c.id === courseId);
                    return (
                      <Chip 
                        key={courseId} 
                        label={course ? `${course.code}: ${course.name}` : courseId} 
                      />
                    );
                  })}
                </Box>
              )}
              disabled={loading || courses.length === 0}
              startAdornment={
                loading ? (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                ) : null
              }
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  <Checkbox checked={selectedCourses.indexOf(course.id) > -1} />
                  <ListItemText 
                    primary={`${course.code}: ${course.name}`} 
                    secondary={`${course.department} - ${course.credits} credits`} 
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select the courses for which you want to create class sections
            </FormHelperText>
          </FormControl>
        </Grid>
        
        {selectedCourses.length > 0 && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sections Per Course"
                type="number"
                value={sectionsPerCourse}
                onChange={handleSectionsChange}
                inputProps={{ min: 1 }}
                helperText="Number of sections to create for each course"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Default Capacity"
                type="number"
                value={capacity}
                onChange={handleCapacityChange}
                inputProps={{ min: 1 }}
                helperText="Default student capacity for each class"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Building Prefix"
                value={buildingPrefix}
                onChange={handleBuildingPrefixChange}
                helperText="Optional prefix for building names (e.g., 'Main')"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Prefix"
                value={roomPrefix}
                onChange={handleRoomPrefixChange}
                helperText="Optional prefix for room numbers (e.g., 'RM-')"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Selected Courses
              </Typography>
              
              <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                <List dense>
                  {selectedCourses.map(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    return (
                      <ListItem key={courseId}>
                        <ListItemText
                          primary={course ? `${course.code}: ${course.name}` : courseId}
                          secondary={course ? `${course.department} - ${course.credits} credits` : ''}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleRemoveCourse(courseId)}
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
                    This will create <strong>{selectedCourses.length * sectionsPerCourse}</strong> new classes 
                    ({selectedCourses.length} courses × {sectionsPerCourse} sections)
                    for the selected term.
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Each class will have a default capacity of <strong>{capacity}</strong> students.
                  </Typography>
                  {(roomPrefix || buildingPrefix) && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Rooms will be automatically assigned with 
                      {buildingPrefix && <strong> building prefix "{buildingPrefix}"</strong>}
                      {roomPrefix && buildingPrefix && ' and'}
                      {roomPrefix && <strong> room prefix "{roomPrefix}"</strong>}.
                    </Typography>
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

export default BatchClassCreation;

