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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SaveIcon from '@mui/icons-material/Save';

interface AttendanceRecorderProps {
  classId: string;
  date: Date | null;
  onSubmit: (attendanceData: any) => void;
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

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  notes?: string;
}

const AttendanceRecorder: React.FC<AttendanceRecorderProps> = ({
  classId,
  date,
  onSubmit,
  loading = false,
  submitButtonId
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
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
        
        // Initialize attendance records with all students present
        const initialRecords: Record<string, AttendanceRecord> = {};
        students.forEach(student => {
          initialRecords[student.id] = {
            studentId: student.id,
            status: 'present',
            notes: ''
          };
        });
        setAttendanceRecords(initialRecords);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again later.');
      }
    };

    const fetchExistingAttendance = async () => {
      if (!classId || !date) return;
      
      try {
        // In a real application, you would fetch existing attendance records from the API
        // const formattedDate = date.toISOString().split('T')[0];
        // const response = await fetch(`/api/attendance/class/${classId}/date/${formattedDate}`);
        
        // if (response.status === 404) {
        //   // No existing records, initialize with all present
        //   const initialRecords: Record<string, AttendanceRecord> = {};
        //   students.forEach(student => {
        //     initialRecords[student.id] = {
        //       studentId: student.id,
        //       status: 'present',
        //       notes: ''
        //     };
        //   });
        //   setAttendanceRecords(initialRecords);
        //   setExistingRecords(false);
        //   return;
        // }
        
        // if (!response.ok) {
        //   throw new Error('Failed to fetch attendance records');
        // }
        
        // const data = await response.json();
        // const recordsMap: Record<string, AttendanceRecord> = {};
        // data.forEach((record: AttendanceRecord) => {
        //   recordsMap[record.studentId] = record;
        // });
        // setAttendanceRecords(recordsMap);
        // setExistingRecords(true);
        
        // For demo purposes, initialize with all present
        const initialRecords: Record<string, AttendanceRecord> = {};
        students.forEach(student => {
          initialRecords[student.id] = {
            studentId: student.id,
            status: 'present',
            notes: ''
          };
        });
        setAttendanceRecords(initialRecords);
        setExistingRecords(false);
      } catch (err) {
        console.error('Error fetching attendance records:', err);
        setError('Failed to load attendance records. Please try again later.');
      }
    };

    fetchStudents();
    fetchExistingAttendance();
  }, [classId, date]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'tardy' | 'excused') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updatedRecords: Record<string, AttendanceRecord> = {};
    students.forEach(student => {
      updatedRecords[student.id] = {
        studentId: student.id,
        status: 'present',
        notes: attendanceRecords[student.id]?.notes || ''
      };
    });
    setAttendanceRecords(updatedRecords);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert record object to array for submission
    const recordsArray = Object.values(attendanceRecords);
    onSubmit(recordsArray);
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {existingRecords && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Attendance records already exist for this class and date. Editing will update the existing records.
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Student Attendance
        </Typography>
        <Button
          variant="outlined"
          onClick={handleMarkAllPresent}
          disabled={loading}
        >
          Mark All Present
        </Button>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell align="center"><strong>Present</strong></TableCell>
                <TableCell align="center"><strong>Absent</strong></TableCell>
                <TableCell align="center"><strong>Tardy</strong></TableCell>
                <TableCell align="center"><strong>Excused</strong></TableCell>
                <TableCell><strong>Notes</strong></TableCell>
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
                    <IconButton 
                      color={attendanceRecords[student.id]?.status === 'present' ? 'success' : 'default'}
                      onClick={() => handleStatusChange(student.id, 'present')}
                      disabled={loading}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color={attendanceRecords[student.id]?.status === 'absent' ? 'error' : 'default'}
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      disabled={loading}
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color={attendanceRecords[student.id]?.status === 'tardy' ? 'warning' : 'default'}
                      onClick={() => handleStatusChange(student.id, 'tardy')}
                      disabled={loading}
                    >
                      <AccessTimeIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color={attendanceRecords[student.id]?.status === 'excused' ? 'info' : 'default'}
                      onClick={() => handleStatusChange(student.id, 'excused')}
                      disabled={loading}
                    >
                      <MedicalServicesIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add notes..."
                      value={attendanceRecords[student.id]?.notes || ''}
                      onChange={(e) => handleNotesChange(student.id, e.target.value)}
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
            ) : 'Save Attendance'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AttendanceRecorder;

