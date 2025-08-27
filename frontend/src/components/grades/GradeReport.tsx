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

interface GradeReportProps {
  reportType: string;
  classId?: string;
  studentId?: string;
  termId?: string;
}

interface GradeSummary {
  totalAssignments: number;
  completedAssignments: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  letterGrade: string;
}

const GradeReport: React.FC<GradeReportProps> = ({
  reportType,
  classId,
  studentId,
  termId
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const [summary, setSummary] = useState<GradeSummary>({
    totalAssignments: 0,
    completedAssignments: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    letterGrade: ''
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch report data from the API
        // const params = new URLSearchParams();
        // params.append('reportType', reportType);
        // if (reportType === 'class' && classId) params.append('classId', classId);
        // if ((reportType === 'student' || reportType === 'report-card') && studentId) params.append('studentId', studentId);
        // if (reportType === 'report-card' && termId) params.append('termId', termId);
        
        // const response = await fetch(`/api/grades/reports?${params.toString()}`);
        
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
              averageScore: 92,
              letterGrade: 'A',
              completedAssignments: 5,
              totalAssignments: 5
            },
            {
              id: '2',
              studentName: 'Jane Smith',
              studentId: '23JS5678',
              averageScore: 88,
              letterGrade: 'B',
              completedAssignments: 5,
              totalAssignments: 5
            },
            {
              id: '3',
              studentName: 'Michael Johnson',
              studentId: '23MJ9012',
              averageScore: 76,
              letterGrade: 'C',
              completedAssignments: 4,
              totalAssignments: 5
            },
            {
              id: '4',
              studentName: 'Emily Williams',
              studentId: '23EW3456',
              averageScore: 95,
              letterGrade: 'A',
              completedAssignments: 5,
              totalAssignments: 5
            },
            {
              id: '5',
              studentName: 'David Brown',
              studentId: '23DB7890',
              averageScore: 65,
              letterGrade: 'D',
              completedAssignments: 3,
              totalAssignments: 5
            }
          ]);
          
          setSummary({
            totalAssignments: 5,
            completedAssignments: 22,
            averageScore: 83,
            highestScore: 95,
            lowestScore: 65,
            letterGrade: 'B'
          });
        } else if (reportType === 'student') {
          setReportData([
            {
              id: '1',
              className: 'Algebra I',
              courseCode: 'MATH101',
              assignmentTitle: 'Chapter 1 Homework',
              type: 'homework',
              dueDate: '2023-09-15',
              score: 90,
              maxScore: 100,
              letterGrade: 'A',
              status: 'graded'
            },
            {
              id: '2',
              className: 'Algebra I',
              courseCode: 'MATH101',
              assignmentTitle: 'Quiz 1',
              type: 'quiz',
              dueDate: '2023-09-20',
              score: 45,
              maxScore: 50,
              letterGrade: 'A',
              status: 'graded'
            },
            {
              id: '3',
              className: 'Algebra I',
              courseCode: 'MATH101',
              assignmentTitle: 'Midterm Exam',
              type: 'test',
              dueDate: '2023-10-15',
              score: 85,
              maxScore: 100,
              letterGrade: 'B',
              status: 'graded'
            },
            {
              id: '4',
              className: 'Algebra I',
              courseCode: 'MATH101',
              assignmentTitle: 'Research Project',
              type: 'project',
              dueDate: '2023-11-15',
              score: null,
              maxScore: 100,
              letterGrade: '',
              status: 'published'
            },
            {
              id: '5',
              className: 'Algebra I',
              courseCode: 'MATH101',
              assignmentTitle: 'Final Exam',
              type: 'test',
              dueDate: '2023-12-15',
              score: null,
              maxScore: 100,
              letterGrade: '',
              status: 'draft'
            }
          ]);
          
          setSummary({
            totalAssignments: 5,
            completedAssignments: 3,
            averageScore: 88,
            highestScore: 90,
            lowestScore: 85,
            letterGrade: 'B'
          });
        } else if (reportType === 'report-card') {
          setReportData([
            {
              id: '1',
              className: 'Algebra I',
              courseCode: 'MATH101',
              teacherName: 'John Smith',
              letterGrade: 'A',
              percentage: 92,
              comments: 'Excellent work throughout the term.'
            },
            {
              id: '2',
              className: 'Biology',
              courseCode: 'SCI101',
              teacherName: 'Sarah Johnson',
              letterGrade: 'B',
              percentage: 85,
              comments: 'Good understanding of concepts, but needs to improve lab work.'
            },
            {
              id: '3',
              className: 'English Literature',
              courseCode: 'ENG101',
              teacherName: 'Michael Williams',
              letterGrade: 'A',
              percentage: 94,
              comments: 'Outstanding analysis and writing skills.'
            },
            {
              id: '4',
              className: 'World History',
              courseCode: 'HIST101',
              teacherName: 'Emily Brown',
              letterGrade: 'B',
              percentage: 88,
              comments: 'Good participation in class discussions.'
            },
            {
              id: '5',
              className: 'Physical Education',
              courseCode: 'PE101',
              teacherName: 'David Jones',
              letterGrade: 'A',
              percentage: 95,
              comments: 'Excellent effort and participation.'
            }
          ]);
          
          setSummary({
            totalAssignments: 0,
            completedAssignments: 0,
            averageScore: 91,
            highestScore: 95,
            lowestScore: 85,
            letterGrade: 'A'
          });
        } else {
          // Summary report
          setReportData([
            {
              id: '1',
              className: 'Algebra I',
              courseCode: 'MATH101',
              teacherName: 'John Smith',
              averageGrade: 'B',
              averagePercentage: 85,
              aCount: 8,
              bCount: 10,
              cCount: 5,
              dCount: 2,
              fCount: 0
            },
            {
              id: '2',
              className: 'Biology',
              courseCode: 'SCI101',
              teacherName: 'Sarah Johnson',
              averageGrade: 'B',
              averagePercentage: 82,
              aCount: 6,
              bCount: 12,
              cCount: 3,
              dCount: 1,
              fCount: 0
            },
            {
              id: '3',
              className: 'English Literature',
              courseCode: 'ENG101',
              teacherName: 'Michael Williams',
              averageGrade: 'B',
              averagePercentage: 84,
              aCount: 7,
              bCount: 11,
              cCount: 6,
              dCount: 4,
              fCount: 0
            },
            {
              id: '4',
              className: 'World History',
              courseCode: 'HIST101',
              teacherName: 'Emily Brown',
              averageGrade: 'C',
              averagePercentage: 76,
              aCount: 5,
              bCount: 8,
              cCount: 9,
              dCount: 2,
              fCount: 0
            },
            {
              id: '5',
              className: 'Physical Education',
              courseCode: 'PE101',
              teacherName: 'David Jones',
              averageGrade: 'A',
              averagePercentage: 92,
              aCount: 20,
              bCount: 8,
              cCount: 2,
              dCount: 0,
              fCount: 0
            }
          ]);
          
          setSummary({
            totalAssignments: 0,
            completedAssignments: 0,
            averageScore: 84,
            highestScore: 92,
            lowestScore: 76,
            letterGrade: 'B'
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
  }, [reportType, classId, studentId, termId]);

  const renderClassReport = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Class Grade Report
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Average
              </Typography>
              <Typography variant="h4" color="primary.main">
                {summary.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Letter Grade: {summary.letterGrade}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Highest Score
              </Typography>
              <Typography variant="h4" color="success.main">
                {summary.highestScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top student performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lowest Score
              </Typography>
              <Typography variant="h4" color="error.main">
                {summary.lowestScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lowest student performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignments
              </Typography>
              <Typography variant="h4">
                {summary.totalAssignments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total assignments in class
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
              <TableCell align="center"><strong>Average Score</strong></TableCell>
              <TableCell align="center"><strong>Letter Grade</strong></TableCell>
              <TableCell align="center"><strong>Completed</strong></TableCell>
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
                <TableCell align="center">{record.averageScore}%</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={record.letterGrade} 
                    color={
                      record.letterGrade === 'A' ? 'success' :
                      record.letterGrade === 'B' ? 'primary' :
                      record.letterGrade === 'C' ? 'info' :
                      record.letterGrade === 'D' ? 'warning' :
                      'error'
                    } 
                  />
                </TableCell>
                <TableCell align="center">
                  {record.completedAssignments}/{record.totalAssignments} ({Math.round(record.completedAssignments / record.totalAssignments * 100)}%)
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
        Student Grade Report
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h4" color="primary.main">
                {summary.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Letter Grade: {summary.letterGrade}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Highest Score
              </Typography>
              <Typography variant="h4" color="success.main">
                {summary.highestScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lowest Score
              </Typography>
              <Typography variant="h4" color="error.main">
                {summary.lowestScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lowest performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion
              </Typography>
              <Typography variant="h4">
                {summary.completedAssignments}/{summary.totalAssignments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assignments completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Assignment</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell align="center"><strong>Score</strong></TableCell>
              <TableCell align="center"><strong>Grade</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                  <Typography variant="body1">
                    {record.assignmentTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.className} ({record.courseCode})
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={record.type.charAt(0).toUpperCase() + record.type.slice(1)} 
                    color={
                      record.type === 'test' ? 'error' :
                      record.type === 'quiz' ? 'warning' :
                      record.type === 'project' ? 'info' :
                      'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  {record.score !== null ? `${record.score}/${record.maxScore} (${Math.round(record.score / record.maxScore * 100)}%)` : '-'}
                </TableCell>
                <TableCell align="center">
                  {record.letterGrade ? (
                    <Chip 
                      label={record.letterGrade} 
                      color={
                        record.letterGrade === 'A' ? 'success' :
                        record.letterGrade === 'B' ? 'primary' :
                        record.letterGrade === 'C' ? 'info' :
                        record.letterGrade === 'D' ? 'warning' :
                        'error'
                      } 
                      size="small"
                    />
                  ) : '-'}
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                    color={
                      record.status === 'graded' ? 'success' :
                      record.status === 'published' ? 'primary' :
                      'default'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderReportCard = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Student Report Card
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                GPA
              </Typography>
              <Typography variant="h4" color="primary.main">
                {(summary.averageScore / 25).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Term GPA (4.0 scale)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average
              </Typography>
              <Typography variant="h4" color="primary.main">
                {summary.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Academic Standing
              </Typography>
              <Typography variant="h4" color="success.main">
                Good
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current academic status
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Teacher</strong></TableCell>
              <TableCell align="center"><strong>Grade</strong></TableCell>
              <TableCell align="center"><strong>Percentage</strong></TableCell>
              <TableCell><strong>Comments</strong></TableCell>
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
                <TableCell>{record.teacherName}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={record.letterGrade} 
                    color={
                      record.letterGrade === 'A' ? 'success' :
                      record.letterGrade === 'B' ? 'primary' :
                      record.letterGrade === 'C' ? 'info' :
                      record.letterGrade === 'D' ? 'warning' :
                      'error'
                    } 
                  />
                </TableCell>
                <TableCell align="center">{record.percentage}%</TableCell>
                <TableCell>{record.comments}</TableCell>
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
        Grade Summary Report
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                School Average
              </Typography>
              <Typography variant="h4" color="primary.main">
                {summary.averageScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall school average
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Highest Class
              </Typography>
              <Typography variant="h4" color="success.main">
                {summary.highestScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Physical Education (PE101)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lowest Class
              </Typography>
              <Typography variant="h4" color="error.main">
                {summary.lowestScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                World History (HIST101)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Grade Distribution
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip label="A: 30%" size="small" color="success" />
                <Chip label="B: 40%" size="small" color="primary" />
                <Chip label="C: 20%" size="small" color="info" />
                <Chip label="D: 8%" size="small" color="warning" />
                <Chip label="F: 2%" size="small" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Class</strong></TableCell>
              <TableCell><strong>Teacher</strong></TableCell>
              <TableCell align="center"><strong>Average Grade</strong></TableCell>
              <TableCell align="center"><strong>Average Score</strong></TableCell>
              <TableCell align="center"><strong>Grade Distribution</strong></TableCell>
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
                <TableCell>{record.teacherName}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={record.averageGrade} 
                    color={
                      record.averageGrade === 'A' ? 'success' :
                      record.averageGrade === 'B' ? 'primary' :
                      record.averageGrade === 'C' ? 'info' :
                      record.averageGrade === 'D' ? 'warning' :
                      'error'
                    } 
                  />
                </TableCell>
                <TableCell align="center">{record.averagePercentage}%</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip label={`A: ${record.aCount}`} size="small" color="success" />
                    <Chip label={`B: ${record.bCount}`} size="small" color="primary" />
                    <Chip label={`C: ${record.cCount}`} size="small" color="info" />
                    <Chip label={`D: ${record.dCount}`} size="small" color="warning" />
                    <Chip label={`F: ${record.fCount}`} size="small" color="error" />
                  </Box>
                </TableCell>
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
          {reportType === 'report-card' && renderReportCard()}
          {reportType === 'summary' && renderSummaryReport()}
        </>
      )}
    </Box>
  );
};

export default GradeReport;

