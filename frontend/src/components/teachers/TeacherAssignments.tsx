import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Teacher } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import { useRouter } from 'next/router';

interface TeacherAssignmentsProps {
  teacher: Teacher;
}

interface ClassAssignment {
  id: string;
  className: string;
  courseCode: string;
  term: string;
  schedule: string;
  room: string;
  studentCount: number;
}

const TeacherAssignments: React.FC<TeacherAssignmentsProps> = ({ teacher }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<ClassAssignment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch this data from the API
        // const response = await fetch(`/api/teachers/${teacher.id}/assignments`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch assignments');
        // }
        // const data = await response.json();
        // setAssignments(data);
        
        // For demo purposes, set mock data
        setAssignments([
          {
            id: '1',
            className: 'Algebra I',
            courseCode: 'MATH101',
            term: 'Fall 2023',
            schedule: 'MWF 9:00 AM - 10:00 AM',
            room: 'Room 101',
            studentCount: 25
          },
          {
            id: '2',
            className: 'Geometry',
            courseCode: 'MATH201',
            term: 'Fall 2023',
            schedule: 'TTh 11:00 AM - 12:30 PM',
            room: 'Room 102',
            studentCount: 22
          },
          {
            id: '3',
            className: 'Pre-Calculus',
            courseCode: 'MATH301',
            term: 'Fall 2023',
            schedule: 'MWF 1:00 PM - 2:00 PM',
            room: 'Room 103',
            studentCount: 18
          },
          {
            id: '4',
            className: 'AP Calculus',
            courseCode: 'MATH401',
            term: 'Fall 2023',
            schedule: 'TTh 2:00 PM - 3:30 PM',
            room: 'Room 104',
            studentCount: 15
          },
          {
            id: '5',
            className: 'Math Lab',
            courseCode: 'MATH100',
            term: 'Fall 2023',
            schedule: 'F 3:00 PM - 4:00 PM',
            room: 'Room 105',
            studentCount: 12
          }
        ]);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [teacher.id]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddAssignment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you would call the API to add the assignment
      // const response = await fetch(`/api/teachers/${teacher.id}/assignments`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     // assignment data
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to add assignment');
      // }
      
      setSuccess('Assignment added successfully!');
      setDialogOpen(false);
      
      // Refresh the assignments data
      // const updatedAssignments = await response.json();
      // setAssignments(updatedAssignments);
    } catch (err) {
      console.error('Error adding assignment:', err);
      setError(err.message || 'An error occurred while adding the assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to remove this assignment? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real application, you would call the API to remove the assignment
      // const response = await fetch(`/api/teachers/${teacher.id}/assignments/${assignmentId}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to remove assignment');
      // }
      
      // Remove the assignment from the list
      setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      setSuccess('Assignment removed successfully!');
    } catch (err) {
      console.error('Error removing assignment:', err);
      setError('Failed to remove assignment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = (assignmentId: string) => {
    router.push(`/classes/${assignmentId}`);
  };

  const handleViewGradeBook = (assignmentId: string) => {
    router.push(`/grades/class/${assignmentId}`);
  };

  const handleViewAttendance = (assignmentId: string) => {
    router.push(`/attendance/class/${assignmentId}`);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Class Assignments
        </Typography>
        {isAdmin && (
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Assignment
          </Button>
        )}
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : assignments.length === 0 ? (
        <Alert severity="info">
          No class assignments found for this teacher.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Course Code</strong></TableCell>
                <TableCell><strong>Term</strong></TableCell>
                <TableCell><strong>Schedule</strong></TableCell>
                <TableCell><strong>Room</strong></TableCell>
                <TableCell><strong>Students</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id} hover>
                  <TableCell>{assignment.className}</TableCell>
                  <TableCell>{assignment.courseCode}</TableCell>
                  <TableCell>{assignment.term}</TableCell>
                  <TableCell>{assignment.schedule}</TableCell>
                  <TableCell>{assignment.room}</TableCell>
                  <TableCell>{assignment.studentCount}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="View Class">
                        <IconButton onClick={() => handleViewClass(assignment.id)} size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Grade Book">
                        <IconButton onClick={() => handleViewGradeBook(assignment.id)} size="small">
                          <GradeIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Attendance">
                        <IconButton onClick={() => handleViewAttendance(assignment.id)} size="small">
                          <EventIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {isAdmin && (
                        <Tooltip title="Remove Assignment">
                          <IconButton 
                            onClick={() => handleRemoveAssignment(assignment.id)} 
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Add Class Assignment
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Assign a class to this teacher. Select from available classes below.
          </DialogContentText>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            In a real application, this would display a list of available classes that can be assigned to the teacher.
          </Alert>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  label="Class"
                  // value={selectedClass}
                  // onChange={handleClassChange}
                >
                  <MenuItem value="1">Algebra II (MATH202) - Fall 2023</MenuItem>
                  <MenuItem value="2">Trigonometry (MATH203) - Fall 2023</MenuItem>
                  <MenuItem value="3">Statistics (MATH301) - Fall 2023</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddAssignment} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Assignment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Import these icons for the table actions
const Tooltip = ({ title, children }) => {
  return children;
};

const GradeIcon = ({ fontSize }) => {
  return <span style={{ marginRight: '8px' }}>📊</span>;
};

const EventIcon = ({ fontSize }) => {
  return <span style={{ marginRight: '8px' }}>📅</span>;
};

export default TeacherAssignments;

