import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Course } from '@/lib/types';

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
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
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

interface CourseDetailProps {
  course: Course;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  const [tabValue, setTabValue] = useState(0);
  const [classes, setClasses] = useState<any[]>([]);
  const [prerequisites, setPrerequisites] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        setLoading(true);
        
        // Fetch classes for this course
        const classesResponse = await fetch(`/api/classes?courseId=${course.id}`);
        if (classesResponse.ok) {
          const classesData = await classesResponse.json();
          setClasses(classesData);
        }
        
        // Fetch prerequisites if any
        if (course.prerequisites && course.prerequisites.length > 0) {
          const prerequisiteIds = Array.isArray(course.prerequisites) 
            ? course.prerequisites 
            : [course.prerequisites];
            
          const prerequisitesData = await Promise.all(
            prerequisiteIds.map(async (prereqId) => {
              const response = await fetch(`/api/courses/${prereqId}`);
              if (response.ok) {
                return await response.json();
              }
              return null;
            })
          );
          
          setPrerequisites(prerequisitesData.filter(Boolean));
        }
      } catch (err) {
        console.error('Error fetching related data:', err);
        setError('Failed to load some course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [course]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MenuBookIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" component="h2">
                {course.code}: {course.name}
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              {course.description || 'No description available.'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {course.department}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Credits
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {course.credits}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Grade Level
                </Typography>
                <Box>
                  {Array.isArray(course.gradeLevel) ? (
                    course.gradeLevel.map(grade => (
                      <Chip 
                        key={grade} 
                        label={`Grade ${grade}`} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    ))
                  ) : (
                    course.gradeLevel ? (
                      <Chip 
                        label={`Grade ${course.gradeLevel}`} 
                        size="small" 
                      />
                    ) : (
                      <Typography variant="body1">N/A</Typography>
                    )
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={course.isActive ? 'Active' : 'Inactive'} 
                  color={course.isActive ? 'success' : 'default'} 
                  size="small" 
                />
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardHeader title="Course Information" />
              <CardContent>
                <List dense>
                  {course.syllabus && (
                    <ListItem>
                      <ListItemText 
                        primary="Syllabus" 
                        secondary={
                          <Button 
                            variant="text" 
                            size="small" 
                            href={course.syllabus} 
                            target="_blank"
                          >
                            View Syllabus
                          </Button>
                        } 
                      />
                    </ListItem>
                  )}
                  
                  <ListItem>
                    <ListItemText 
                      primary="Prerequisites" 
                      secondary={
                        prerequisites.length > 0 
                          ? prerequisites.map(prereq => prereq.code).join(', ') 
                          : 'None'
                      } 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Available Classes" 
                      secondary={`${classes.length} class(es)`} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Classes" icon={<ClassIcon />} iconPosition="start" />
          <Tab label="Prerequisites" icon={<SchoolIcon />} iconPosition="start" />
          <Tab label="Materials" icon={<MenuBookIcon />} iconPosition="start" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : classes.length > 0 ? (
            <Grid container spacing={2}>
              {classes.map((classItem) => (
                <Grid item xs={12} md={6} lg={4} key={classItem.id}>
                  <Card variant="outlined">
                    <CardHeader 
                      title={`Section ${classItem.section}`}
                      subheader={`${classItem.term?.name || 'No Term'}`}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Teacher: {classItem.teacher?.name || 'Not Assigned'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Capacity: {classItem.enrolledCount || 0}/{classItem.capacity || 'Unlimited'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Room: {classItem.room || 'Not Assigned'}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          href={`/classes/${classItem.id}`}
                        >
                          View Class
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No classes available for this course.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : prerequisites.length > 0 ? (
            <List>
              {prerequisites.map((prereq) => (
                <ListItem key={prereq.id} divider>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {prereq.code}: {prereq.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Department: {prereq.department} | Credits: {prereq.credits}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {prereq.description?.substring(0, 150)}
                          {prereq.description && prereq.description.length > 150 ? '...' : ''}
                        </Typography>
                        <Button 
                          variant="text" 
                          size="small" 
                          sx={{ mt: 1 }}
                          href={`/courses/${prereq.id}`}
                        >
                          View Course
                        </Button>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              This course has no prerequisites.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {course.materials && course.materials.length > 0 ? (
            <List>
              {course.materials.map((material, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={material.title}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {material.description}
                        </Typography>
                        {material.url && (
                          <Button 
                            variant="text" 
                            size="small" 
                            sx={{ mt: 1 }}
                            href={material.url}
                            target="_blank"
                          >
                            Access Material
                          </Button>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
              No course materials available.
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CourseDetail;

