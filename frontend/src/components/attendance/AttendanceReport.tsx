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
  Divider
} from '@mui/material';

interface AttendanceReportProps {
  reportType: string;
  classId?: string;
  studentId?: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  tardyDays: number;
  excusedDays: number;
  presentPercentage: number;
  absentPercentage: number;
  tardyPercentage: number;
  excusedPercentage: number;
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({
  reportType,
  classId,
  studentId,
  startDate,
  endDate
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary>({
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
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch report data from the API
        // const params = new URLSearchParams();
        // if (reportType === 'class' && classId) params.append('classId', classId);
        // if (reportType === 'student' && studentId) params.append('studentId', studentId);
        // if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
        // if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
        
        // const response = await fetch(`/api/attendance/reports/${reportType}?${params.toString()}`);
        
        // if (!response.ok) {
        //   throw new Error('Failed to fetch report data');
        // }
        
        // const data = await response.json();
        // setReportData(data.records);
        // setSummary(data.summary);
        
        // For demo purposes, set mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (reportType === 'class') {
          setReportData([
            {
              id: '1',
              studentName: 'John Doe',
              studentId: '23JD1234',
              presentDays: 18,
              absentDays: 2,
              tardyDays: 0,
              excusedDays: 0,
              attendanceRate: 90
            },
            {
              id: '2',
              studentName: 'Jane Smith',
              studentId: '23JS5678',
              presentDays: 20,
              absentDays: 0,
              tardyDays: 0,
              excusedDays: 0,
              attendanceRate: 100
            },
            {
              id: '3',
              studentName: 'Michael Johnson',
              studentId: '23MJ9012',
              presentDays: 19,
              absentDays: 0,
              tardyDays: 1,
              excusedDays: 0,
              attendanceRate: 95
            },
            {
              id: '4',
              studentName: 'Emily Williams',
              studentId: '23EW3456',
              presentDays: 17,
              absentDays: 1,
              tardyDays: 2,
              excusedDays: 0,
              attendanceRate: 85
            },
            {
              id: '5',
              studentName: 'David Brown',
              studentId: '23DB7890',
              presentDays: 16,
              absentDays: 3,
              tardyDays: 1,
              excusedDays: 0,
              attendanceRate: 80
            }
          ]);
          
          setSummary({
            totalDays: 20,
            presentDays: 90,
            absentDays: 6,
            tardyDays: 4,
            excusedDays: 0,
            presentPercentage: 90,
            absentPercentage: 6,
            tardyPercentage: 4,
            excusedPercentage: 0
          });
        } else if (reportType === 'student') {
          setReportData([
            {
              id: '1',
              date: '2023-09-01',
              className: 'Algebra I',
              courseCode: 'MATH101',
              status: 'present',
              notes: ''
            },
            {
              id: '2',
              date: '2023-09-02',
              className: 'Algebra I',
              courseCode: 'MATH101',
              status: 'present',
              notes: ''
            },
            {
              id: '3',
              date: '2023-09-03',
              className: 'Algebra I',
              courseCode: 'MATH101',
              status: 'absent',
              notes: 'Called in sick'
            },
            {
              id: '4',
              date: '2023-09-04',
              className: 'Algebra I',
              courseCode: 'MATH101',
              status: 'present',
              notes: ''
            },
            {
              id: '5',
              date: '2023-09-05',
              className: 'Algebra I',
              courseCode: 'MATH101',
              status: 'tardy',
              notes: 'Late by 10 minutes'
            }
          ]);
          
          setSummary({
            totalDays: 5,
            presentDays: 3,
            absentDays: 1,
            tardyDays: 1,
            excusedDays: 0,
            presentPercentage: 60,
            absentPercentage: 20,
            tardyPercentage: 20,
            excusedPercentage: 0
          });
        } else {
          // Summary report
          setReportData([
            {
              id: '1',
              className: 'Algebra I',
              courseCode: 'MATH101',
              totalStudents: 25,
              averageAttendance: 92,
              perfectAttendance: 18,
              chronicAbsences: 2
            },
            {
              id: '2',
              className: 'Biology',
              courseCode: 'SCI101',
              totalStudents: 22,
              averageAttendance: 88,
              perfectAttendance: 15,
              chronicAbsences: 3
            },
            {
              id: '3',
              className: 'English Literature',
              courseCode: 'ENG101',
              totalStudents: 28,
              averageAttendance: 90,
              perfectAttendance: 20,
              chronicAbsences: 2
            },
            {
              id: '4',
              className: 'World History',
              courseCode: 'HIST101',
              totalStudents: 24,
              averageAttendance: 85,
              perfectAttendance: 16,
              chronicAbsences: 4
            },
            {
              id: '5',
              className: 'Physical Education',
              courseCode: 'PE101',
              totalStudents: 30,
              averageAttendance: 95,
              perfectAttendance: 25,
              chronicAbsences: 1
            }
          ]);
          
          setSummary({
            totalDays: 20,
            presentDays: 2300,
            absentDays: 250,
            tardyDays: 150,
            excusedDays: 100,
            presentPercentage: 82,
            absentPercentage: 9,
            tardyPercentage: 5,
            excusedPercentage: 4
          });
        }
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, classId, studentId, startDate, endDate]);

  const renderClassReport = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Class Attendance Report
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
      </Typography>
      
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
                {summary.presentDays} days out of {summary.totalDays * 5} student-days
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
                {summary.absentDays} days out of {summary.totalDays * 5} student-days
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
                {summary.tardyDays} days out of {summary.totalDays * 5} student-days
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
                {summary.excusedDays} days out of {summary.totalDays * 5} student-days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Student</strong></TableCell>
              <TableCell align="center"><strong>Present</strong></TableCell>
              <TableCell align="center"><strong>Absent</strong></TableCell>
              <TableCell align="center"><strong>Tardy</strong></TableCell>
              <TableCell align="center"><strong>Excused</strong></TableCell>
              <TableCell align="center"><strong>Attendance Rate</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Typography variant="body1">
                    {record.studentName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.studentId}
                  </Typography>
                </TableCell>
                <TableCell align="center">{record.presentDays}</TableCell>
                <TableCell align="center">{record.absentDays}</TableCell>
                <TableCell align="center">{record.tardyDays}</TableCell>
                <TableCell align="center">{record.excusedDays}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={`${record.attendanceRate}%`} 
                    color={
                      record.attendanceRate >= 90 ? 'success' :
                      record.attendanceRate >= 80 ? 'warning' :
                      'error'
                    } 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderStudentReport = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Student Attendance Report
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
      </Typography>
      
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
            {reportData.map((record) => (
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
    </>
  );

  const renderSummaryReport = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Attendance Summary Report
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Attendance
              </Typography>
              <Typography variant="h4" color="primary.main">
                {summary.presentPercentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                School-wide attendance rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">
                129
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled in all classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Perfect Attendance
              </Typography>
              <Typography variant="h4" color="success.main">
                94
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students with 100% attendance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chronic Absences
              </Typography>
              <Typography variant="h4" color="error.main">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students with &lt;80% attendance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Class</strong></TableCell>
              <TableCell align="center"><strong>Total Students</strong></TableCell>
              <TableCell align="center"><strong>Average Attendance</strong></TableCell>
              <TableCell align="center"><strong>Perfect Attendance</strong></TableCell>
              <TableCell align="center"><strong>Chronic Absences</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Typography variant="body1">
                    {record.className}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.courseCode}
                  </Typography>
                </TableCell>
                <TableCell align="center">{record.totalStudents}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={`${record.averageAttendance}%`} 
                    color={
                      record.averageAttendance >= 90 ? 'success' :
                      record.averageAttendance >= 80 ? 'warning' :
                      'error'
                    } 
                  />
                </TableCell>
                <TableCell align="center">{record.perfectAttendance} ({Math.round(record.perfectAttendance / record.totalStudents * 100)}%)</TableCell>
                <TableCell align="center">{record.chronicAbsences} ({Math.round(record.chronicAbsences / record.totalStudents * 100)}%)</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
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
          {reportType === 'class' && renderClassReport()}
          {reportType === 'student' && renderStudentReport()}
          {reportType === 'summary' && renderSummaryReport()}
        </>
      )}
    </Box>
  );
};

export default AttendanceReport;

