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
  TablePagination
} from '@mui/material';

interface StudentAttendanceProps {
  studentId: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  courseCode: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  notes?: string;
}

const StudentAttendance: React.FC<StudentAttendanceProps> = ({
  studentId,
  startDate,
  endDate
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [summary, setSummary] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    tardyDays: 0,
    excusedDays: 0,
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
        
        // const response = await fetch(`/api/attendance/student/${studentId}?${params.toString()}`);
        
        // if (!response.ok) {
        //   throw new Error('Failed to fetch attendance records');
        // }
        
        // const data = await response.json();
        // setAttendanceRecords(data.records);
        // setSummary(data.summary);
        
        // For demo purposes, set mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRecords: AttendanceRecord[] = [];
        const startDateObj = startDate || new Date(new Date().setDate(new Date().getDate() - 30));
        const endDateObj = endDate || new Date();
        
        // Generate mock attendance records for each day in the date range
        for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {
          // Skip weekends
          if (d.getDay() === 0 || d.getDay() === 6) continue;
          
          // Generate records for multiple classes per day
          const classes = [
            { name: 'Algebra I', code: 'MATH101' },
            { name: 'Biology', code: 'SCI101' },
            { name: 'English Literature', code: 'ENG101' },
            { name: 'World History', code: 'HIST101' },
            { name: 'Physical Education', code: 'PE101' }
          ];
          
          classes.forEach((cls, index) => {
            // Randomly determine attendance status
            const random = Math.random();
            let status: 'present' | 'absent' | 'tardy' | 'excused';
            let notes = '';
            
            if (random < 0.85) {
              status = 'present';
            } else if (random < 0.90) {
              status = 'tardy';
              notes = 'Late by ' + Math.floor(Math.random() * 15 + 5) + ' minutes';
            } else if (random < 0.95) {
              status = 'absent';
              notes = 'No notification received';
            } else {
              status = 'excused';
              notes = 'Doctor\'s appointment';
            }
            
            mockRecords.push({
              id: `${d.toISOString().split('T')[0]}-${index}`,
              date: d.toISOString().split('T')[0],
              className: cls.name,
              courseCode: cls.code,
              status,
              notes
            });
          });
        }
        
        setAttendanceRecords(mockRecords);
        
        // Calculate summary
        const totalDays = mockRecords.length;
        const presentDays = mockRecords.filter(r => r.status === 'present').length;
        const absentDays = mockRecords.filter(r => r.status === 'absent').length;
        const tardyDays = mockRecords.filter(r => r.status === 'tardy').length;
        const excusedDays = mockRecords.filter(r => r.status === 'excused').length;
        
        setSummary({
          totalDays,
          presentDays,
          absentDays,
          tardyDays,
          excusedDays,
          presentPercentage: Math.round(presentDays / totalDays * 100),
          absentPercentage: Math.round(absentDays / totalDays * 100),
          tardyPercentage: Math.round(tardyDays / totalDays * 100),
          excusedPercentage: Math.round(excusedDays / totalDays * 100)
        });
      } catch (err) {
        console.error('Error fetching attendance records:', err);
        setError('Failed to load attendance records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [studentId, startDate, endDate]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination
  const paginatedRecords = attendanceRecords.slice(
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
                    {summary.presentDays} days out of {summary.totalDays} days
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
                    {summary.absentDays} days out of {summary.totalDays} days
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
                    {summary.tardyDays} days out of {summary.totalDays} days
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
                    {summary.excusedDays} days out of {summary.totalDays} days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {record.className}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {record.courseCode}
                      </Typography>
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
                      />
                    </TableCell>
                    <TableCell>{record.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={attendanceRecords.length}
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

export default StudentAttendance;

