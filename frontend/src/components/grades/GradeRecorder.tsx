import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

interface GradeRecorderProps {
  classId: string;
  assignmentId: string;
  maxScore: number;
  onSubmit: (gradeData: any) => void;
  loading?: boolean;
  submitButtonId?: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  profileColor?: string;
}

interface GradeRecord {
  studentId: string;
  score: number | null;
  comments?: string;
  status: 'submitted' | 'missing' | 'excused' | 'incomplete';
}

const GradeRecorder: React.FC<GradeRecorderProps> = ({
  classId,
  assignmentId,
  maxScore,
  onSubmit,
  loading = false,
  submitButtonId
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeRecords, setGradeRecords] = useState<Record<string, GradeRecord>>({});
  const [error, setError] = useState<string | null>(null);
  const [existingRecords, setExistingRecords] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // In a real application, you would fetch students enrolled in the class from the API
        // const response = await fetch(`/api/classes/${classId}/students`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch students');
        // }
        // const data = await response.json();
        // setStudents(data);
        
        // For demo purposes, set mock data
        setStudents([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            studentId: '23JD1234'
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            studentId: '23JS5678'
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Johnson',
            studentId: '23MJ9012'
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Williams',
            studentId: '23EW3456'
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Brown',
            studentId: '23DB7890'
          },
          {
            id: '6',
            firstName: 'Sarah',
            lastName: 'Miller',
            studentId: '23SM2345'
          },
          {
            id: '7',
            firstName: 'James',
            lastName: 'Wilson',
            studentId: '23JW6789'
          },
          {
            id: '8',
            firstName: 'Olivia',
            lastName: 'Taylor',
            studentId: '23OT0123'
          },
          {
            id: '9',
            firstName: 'Daniel',
            lastName: 'Anderson',
            studentId: '23DA4567'
          },
          {
            id: '10',
            firstName: 'Sophia',
            lastName: 'Thomas',
            studentId: '23ST8901'
          }
        ]);
        
        // Initialize grade records with all students
        const initialRecords: Record<string, GradeRecord> = {};
        students.forEach(student => {
          initialRecords[student.id] = {
            studentId: student.id,
            score: null,
            comments: '',
            status: 'submitted'
          };
        });
        setGradeRecords(initialRecords);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again later.');
      }
    };

    const fetchExistingGrades = async () => {
      if (!classId || !assignmentId) return;
      
      try {
        // In a real application, you would fetch existing grade records from the API
        // const response = await fetch(`/api/grades?classId=${classId}&assignmentId=${assignmentId}`);
        
        // if (response.status === 404) {
        //   // No existing records, initialize with all null scores
        //   const initialRecords: Record<string, GradeRecord> = {};
        //   students.forEach(student => {
        //     initialRecords[student.id] = {
        //       studentId: student.id,
        //       score: null,
        //       comments: '',
        //       status: 'submitted'
        //     };
        //   });
        //   setGradeRecords(initialRecords);
        //   setExistingRecords(false);
        //   return;
        // }
        
        // if (!response.ok) {
        //   throw new Error('Failed to fetch grade records');
        // }
        
        // const data = await response.json();
        // const recordsMap: Record<string, GradeRecord> = {};
        // data.forEach((record: GradeRecord) => {
        //   recordsMap[record.studentId] = record;
        // });
        // setGradeRecords(recordsMap);
        // setExistingRecords(true);
        
        // For demo purposes, initialize with random scores
        const initialRecords: Record<string, GradeRecord> = {};
        students.forEach(student => {
          const random = Math.random();
          let score: number | null = null;
          let status: 'submitted' | 'missing' | 'excused' | 'incomplete' = 'submitted';
          
          if (random < 0.7) {
            // 70% chance of having a score
            score = Math.floor(Math.random() * (maxScore + 1));
            status = 'submitted';
          } else if (random < 0.85) {
            // 15% chance of missing
            score = null;
            status = 'missing';
          } else if (random < 0.95) {
            // 10% chance of excused
            score = null;
            status = 'excused';
          } else {
            // 5% chance of incomplete
            score = Math.floor(Math.random() * (maxScore * 0.5));
            status = 'incomplete';
          }
          
          initialRecords[student.id] = {
            studentId: student.id,
            score,
            comments: '',
            status
          };
        });
        setGradeRecords(initialRecords);
        setExistingRecords(false);
      } catch (err) {
        console.error('Error fetching grade records:', err);
        setError('Failed to load grade records. Please try again later.');
      }
    };

    fetchStudents();
    fetchExistingGrades();
  }, [classId, assignmentId, maxScore]);

  const handleScoreChange = (studentId: string, scoreStr: string) => {
    const score = scoreStr === '' ? null : Number(scoreStr);
    
    // Validate score
    if (score !== null && (isNaN(score) || score < 0 || score > maxScore)) {
      return;
    }
    
    setGradeRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score,
        status: score !== null ? 'submitted' : prev[studentId].status
      }
    }));
  };

  const handleCommentsChange = (studentId: string, comments: string) => {
    setGradeRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comments
      }
    }));
  };

  const handleStatusChange = (studentId: string, status: 'submitted' | 'missing' | 'excused' | 'incomplete') => {
    setGradeRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        // Clear score if status is missing or excused
        score: (status === 'missing' || status === 'excused') ? null : prev[studentId].score
      }
    }));
  };

  const getLetterGrade = (score: number | null) => {
    if (score === null) return '';
    
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text.secondary';
    
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return 'success.main';
    if (percentage >= 80) return 'primary.main';
    if (percentage >= 70) return 'info.main';
    if (percentage >= 60) return 'warning.main';
    return 'error.main';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert record object to array for submission
    const recordsArray = Object.values(gradeRecords);
    onSubmit(recordsArray);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {existingRecords && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Grade records already exist for this assignment. Editing will update the existing records.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Student Grades
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Max Score: {maxScore}
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell align="center"><strong>Score</strong></TableCell>
                <TableCell align="center"><strong>Grade</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell><strong>Comments</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          bgcolor: student.profileColor || 'primary.main'
                        }}
                      >
                        {student.firstName[0]}{student.lastName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.studentId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={gradeRecords[student.id]?.score === null ? '' : gradeRecords[student.id]?.score}
                      onChange={(e) => handleScoreChange(student.id, e.target.value)}
                      disabled={loading || gradeRecords[student.id]?.status === 'missing' || gradeRecords[student.id]?.status === 'excused'}
                      InputProps={{ 
                        inputProps: { 
                          min: 0, 
                          max: maxScore,
                          style: { textAlign: 'center' }
                        } 
                      }}
                      sx={{ width: '100px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body1" 
                      color={getScoreColor(gradeRecords[student.id]?.score)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {gradeRecords[student.id]?.score !== null ? getLetterGrade(gradeRecords[student.id]?.score) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={gradeRecords[student.id]?.status || 'submitted'}
                        onChange={(e) => handleStatusChange(student.id, e.target.value as any)}
                        disabled={loading}
                      >
                        <MenuItem value="submitted">Submitted</MenuItem>
                        <MenuItem value="missing">Missing</MenuItem>
                        <MenuItem value="excused">Excused</MenuItem>
                        <MenuItem value="incomplete">Incomplete</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add comments..."
                      value={gradeRecords[student.id]?.comments || ''}
                      onChange={(e) => handleCommentsChange(student.id, e.target.value)}
                      disabled={loading}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            id={submitButtonId}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : 'Save Grades'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default GradeRecorder;

