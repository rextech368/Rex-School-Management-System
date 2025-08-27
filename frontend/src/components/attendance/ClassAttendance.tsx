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
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  TablePagination,
  Avatar
} from '@mui/material';

interface ClassAttendanceProps {
  classId: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  notes?: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  profileColor?: string;
}

interface DailyAttendance {
  date: string;
  records: AttendanceRecord[];
  presentCount: number;
  absentCount: number;
  tardyCount: number;
  excusedCount: number;
  attendanceRate: number;
}

const ClassAttendance: React.FC<ClassAttendanceProps> = ({
  classId,
  startDate,
  endDate
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [summary, setSummary] = useState({
    totalDays: 0,
    totalRecords: 0,
    presentCount: 0,
    absentCount: 0,
    tardyCount: 0,
    excusedCount: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    tardyPercentage: 0,
    excusedPercentage: 0
  });

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch attendance records from the API
        // const params = new URLSearchParams();
        // if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
        // if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
        
        // const response = await fetch(`/api/attendance/class/${classId}?${params.toString()}`);
        // const studentsResponse = await fetch(`/api/classes/${classId}/students`);
        
        // if (!response.ok || !studentsResponse.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        
        // const data = await response.json();
        // const studentsData = await studentsResponse.json();
        
        // setDailyAttendance(data.dailyAttendance);
        // setStudents(studentsData);
        // setSummary(data.summary);
        
        // For demo purposes, set mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock students
        const mockStudents: Student[] = [
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
          }
        ];
        
        setStudents(mockStudents);
        
        // Generate mock daily attendance records
        const mockDailyAttendance: DailyAttendance[] = [];
        const startDateObj = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
        const endDateObj = endDate || new Date();
        
        // Generate mock attendance records for each day in the date range
        for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {
          // Skip weekends
          if (d.getDay() === 0 || d.getDay() === 6) continue;
          
          const dateStr = d.toISOString().split('T')[0];
          const records: AttendanceRecord[] = [];
          let presentCount = 0;
          let absentCount = 0;
          let tardyCount = 0;
          let excusedCount = 0;
          
          // Generate attendance records for each student
          mockStudents.forEach(student => {
            // Randomly determine attendance status
            const random = Math.random();
            let status: 'present' | 'absent' | 'tardy' | 'excused';
            let notes = '';
            
            if (random < 0.85) {
              status = 'present';
              presentCount++;
            } else if (random < 0.90) {
              status = 'tardy';
              tardyCount++;
              notes = 'Late by ' + Math.floor(Math.random() * 15 + 5) + ' minutes';
            } else if (random < 0.95) {
              status = 'absent';
              absentCount++;
              notes = 'No notification received';
            } else {
              status = 'excused';
              excusedCount++;
              notes = 'Doctor\'s appointment';
            }
            
            records.push({
              id: `${dateStr}-${student.id}`,
              date: dateStr,
              studentId: student.id,
              studentName: `${student.firstName} ${student.lastName}`,
              status,
              notes
            });
          });
          
          const totalStudents = mockStudents.length;
          const attendanceRate = Math.round((presentCount + tardyCount + excusedCount) / totalStudents * 100);
          
          mockDailyAttendance.push({
            date: dateStr,
            records,
            presentCount,
            absentCount,
            tardyCount,
            excusedCount,
            attendanceRate
          });
        }
        
        // Sort by date descending
        mockDailyAttendance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setDailyAttendance(mockDailyAttendance);
        
        // Calculate summary
        const totalDays = mockDailyAttendance.length;
        const totalRecords = mockDailyAttendance.reduce((sum, day) => sum + day.records.length, 0);
        const totalPresentCount = mockDailyAttendance.reduce((sum, day) => sum + day.presentCount, 0);
        const totalAbsentCount = mockDailyAttendance.reduce((sum, day) => sum + day.absentCount, 0);
        const totalTardyCount = mockDailyAttendance.reduce((sum, day) => sum + day.tardyCount, 0);
        const totalExcusedCount = mockDailyAttendance.reduce((sum, day) => sum + day.excusedCount, 0);
        
        setSummary({
          totalDays,
          totalRecords,
          presentCount: totalPresentCount,
          absentCount: totalAbsentCount,
          tardyCount: totalTardyCount,
          excusedCount: totalExcusedCount,
          presentPercentage: Math.round(totalPresentCount / totalRecords * 100),
          absentPercentage: Math.round(totalAbsentCount / totalRecords * 100),
          tardyPercentage: Math.round(totalTardyCount / totalRecords * 100),
          excusedPercentage: Math.round(totalExcusedCount / totalRecords * 100)
        });
      } catch (err) {
        console.error('Error fetching attendance records:', err);
        setError('Failed to load attendance records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [classId, startDate, endDate]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination
  const paginatedDailyAttendance = dailyAttendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Present
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {summary.presentPercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.presentCount} out of {summary.totalRecords} student-days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Absent
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {summary.absentPercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.absentCount} out of {summary.totalRecords} student-days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tardy
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {summary.tardyPercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.tardyCount} out of {summary.totalRecords} student-days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Excused
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {summary.excusedPercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.excusedCount} out of {summary.totalRecords} student-days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {paginatedDailyAttendance.map((day) => (
            <Box key={day.date} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                <Chip 
                  label={`Attendance: ${day.attendanceRate}%`} 
                  color={
                    day.attendanceRate >= 90 ? 'success' :
                    day.attendanceRate >= 80 ? 'warning' :
                    'error'
                  } 
                />
              </Box>
              
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Student</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Notes</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {day.records.map((record) => {
                      const student = students.find(s => s.id === record.studentId);
                      return (
                        <TableRow key={record.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  mr: 1,
                                  bgcolor: student?.profileColor || 'primary.main',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {student?.firstName[0]}{student?.lastName[0]}
                              </Avatar>
                              <Typography variant="body2">
                                {record.studentName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                              color={
                                record.status === 'present' ? 'success' :
                                record.status === 'absent' ? 'error' :
                                record.status === 'tardy' ? 'warning' :
                                'info'
                              } 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{record.notes}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dailyAttendance.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default ClassAttendance;

