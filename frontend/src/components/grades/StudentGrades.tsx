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

interface StudentGradesProps {
  studentId: string;
  termId: string;
}

interface GradeRecord {
  id: string;
  classId: string;
  className: string;
  courseCode: string;
  assignmentId: string;
  assignmentTitle: string;
  type: string;
  dueDate: string;
  score: number | null;
  maxScore: number;
  percentage: number | null;
  letterGrade: string;
  status: string;
  comments?: string;
}

const StudentGrades: React.FC<StudentGradesProps> = ({
  studentId,
  termId
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>([]);
  const [classSummaries, setClassSummaries] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [summary, setSummary] = useState({
    gpa: 0,
    averagePercentage: 0,
    letterGrade: '',
    completedAssignments: 0,
    totalAssignments: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchGradeRecords = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch grade records from the API
        // const response = await fetch(`/api/grades/student/${studentId}?termId=${termId}`);
        
        // if (!response.ok) {
        //   throw new Error('Failed to fetch grade records');
        // }
        
        // const data = await response.json();
        // setGradeRecords(data.records);
        // setClassSummaries(data.classSummaries);
        // setSummary(data.summary);
        
        // For demo purposes, set mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock grade records
        const mockClasses = [
          { id: '1', name: 'Algebra I', code: 'MATH101' },
          { id: '2', name: 'Biology', code: 'SCI101' },
          { id: '3', name: 'English Literature', code: 'ENG101' },
          { id: '4', name: 'World History', code: 'HIST101' },
          { id: '5', name: 'Physical Education', code: 'PE101' }
        ];
        
        const mockAssignmentTypes = ['homework', 'quiz', 'test', 'project'];
        const mockRecords: GradeRecord[] = [];
        
        // Generate 5 assignments for each class
        mockClasses.forEach(cls => {
          for (let i = 1; i <= 5; i++) {
            const type = mockAssignmentTypes[Math.floor(Math.random() * mockAssignmentTypes.length)];
            const maxScore = type === 'quiz' ? 50 : 100;
            const dueDate = new Date(2023, 8 + i, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
            
            // Determine if the assignment is graded yet
            const isGraded = Math.random() < 0.8; // 80% chance of being graded
            
            let score = null;
            let percentage = null;
            let letterGrade = '';
            let status = 'published';
            
            if (isGraded) {
              score = Math.floor(Math.random() * (maxScore * 0.3)) + Math.floor(maxScore * 0.7); // Score between 70% and 100%
              percentage = (score / maxScore) * 100;
              
              if (percentage >= 90) letterGrade = 'A';
              else if (percentage >= 80) letterGrade = 'B';
              else if (percentage >= 70) letterGrade = 'C';
              else if (percentage >= 60) letterGrade = 'D';
              else letterGrade = 'F';
              
              status = 'graded';
            }
            
            mockRecords.push({
              id: `${cls.id}-${i}`,
              classId: cls.id,
              className: cls.name,
              courseCode: cls.code,
              assignmentId: `${cls.id}-assignment-${i}`,
              assignmentTitle: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
              type,
              dueDate,
              score,
              maxScore,
              percentage,
              letterGrade,
              status,
              comments: isGraded ? (Math.random() < 0.3 ? 'Good work!' : '') : ''
            });
          }
        });
        
        // Sort by due date (most recent first)
        mockRecords.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        
        setGradeRecords(mockRecords);
        
        // Generate class summaries
        const mockClassSummaries = mockClasses.map(cls => {
          const classRecords = mockRecords.filter(r => r.classId === cls.id);
          const gradedRecords = classRecords.filter(r => r.status === 'graded');
          const totalScore = gradedRecords.reduce((sum, r) => sum + (r.percentage || 0), 0);
          const averagePercentage = gradedRecords.length > 0 ? totalScore / gradedRecords.length : 0;
          
          let letterGrade = '';
          if (averagePercentage >= 90) letterGrade = 'A';
          else if (averagePercentage >= 80) letterGrade = 'B';
          else if (averagePercentage >= 70) letterGrade = 'C';
          else if (averagePercentage >= 60) letterGrade = 'D';
          else letterGrade = 'F';
          
          return {
            id: cls.id,
            className: cls.name,
            courseCode: cls.code,
            averagePercentage: Math.round(averagePercentage),
            letterGrade,
            completedAssignments: gradedRecords.length,
            totalAssignments: classRecords.length
          };
        });
        
        setClassSummaries(mockClassSummaries);
        
        // Calculate overall summary
        const gradedRecords = mockRecords.filter(r => r.status === 'graded');
        const totalScore = gradedRecords.reduce((sum, r) => sum + (r.percentage || 0), 0);
        const averagePercentage = gradedRecords.length > 0 ? totalScore / gradedRecords.length : 0;
        
        let letterGrade = '';
        if (averagePercentage >= 90) letterGrade = 'A';
        else if (averagePercentage >= 80) letterGrade = 'B';
        else if (averagePercentage >= 70) letterGrade = 'C';
        else if (averagePercentage >= 60) letterGrade = 'D';
        else letterGrade = 'F';
        
        const gpa = letterGrade === 'A' ? 4.0 :
                   letterGrade === 'B' ? 3.0 :
                   letterGrade === 'C' ? 2.0 :
                   letterGrade === 'D' ? 1.0 : 0.0;
        
        setSummary({
          gpa,
          averagePercentage: Math.round(averagePercentage),
          letterGrade,
          completedAssignments: gradedRecords.length,
          totalAssignments: mockRecords.length,
          completionRate: Math.round((gradedRecords.length / mockRecords.length) * 100)
        });
      } catch (err) {
        console.error('Error fetching grade records:', err);
        setError('Failed to load grade records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGradeRecords();
  }, [studentId, termId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination
  const paginatedRecords = gradeRecords.slice(
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
                    GPA
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {summary.gpa.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current term GPA
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {summary.averagePercentage}%
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
                    Completion
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {summary.completionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {summary.completedAssignments}/{summary.totalAssignments} assignments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Classes
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {classSummaries.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enrolled classes
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom>
            Class Summaries
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell align="center"><strong>Average</strong></TableCell>
                  <TableCell align="center"><strong>Grade</strong></TableCell>
                  <TableCell align="center"><strong>Completion</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classSummaries.map((cls) => (
                  <TableRow key={cls.id} hover>
                    <TableCell>
                      <Typography variant="body1">
                        {cls.className}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cls.courseCode}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{cls.averagePercentage}%</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={cls.letterGrade} 
                        color={
                          cls.letterGrade === 'A' ? 'success' :
                          cls.letterGrade === 'B' ? 'primary' :
                          cls.letterGrade === 'C' ? 'info' :
                          cls.letterGrade === 'D' ? 'warning' :
                          'error'
                        } 
                      />
                    </TableCell>
                    <TableCell align="center">
                      {cls.completedAssignments}/{cls.totalAssignments} ({Math.round(cls.completedAssignments / cls.totalAssignments * 100)}%)
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="h6" gutterBottom>
            Assignment Grades
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Assignment</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Due Date</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="center"><strong>Grade</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.assignmentTitle}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {record.className}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {record.courseCode}
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
                      {record.score !== null ? `${record.score}/${record.maxScore}` : '-'}
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
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={gradeRecords.length}
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

export default StudentGrades;

