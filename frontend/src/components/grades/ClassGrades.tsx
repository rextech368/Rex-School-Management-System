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
  Avatar,
  Tabs,
  Tab
} from '@mui/material';

interface ClassGradesProps {
  classId: string;
}

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
      id={`grades-tabpanel-${index}`}
      aria-labelledby={`grades-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  profileColor?: string;
}

interface Assignment {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  maxScore: number;
  weight: number;
  status: string;
}

interface GradeRecord {
  studentId: string;
  assignmentId: string;
  score: number | null;
  percentage: number | null;
  letterGrade: string;
  status: string;
}

const ClassGrades: React.FC<ClassGradesProps> = ({
  classId
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [gradeRecords, setGradeRecords] = useState<Record<string, Record<string, GradeRecord>>>({});
  const [studentSummaries, setStudentSummaries] = useState<any[]>([]);
  const [assignmentSummaries, setAssignmentSummaries] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [summary, setSummary] = useState({
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    letterGradeDistribution: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      F: 0
    }
  });

  useEffect(() => {
    const fetchClassGrades = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch class grades from the API
        // const studentsResponse = await fetch(`/api/classes/${classId}/students`);
        // const assignmentsResponse = await fetch(`/api/classes/${classId}/assignments`);
        // const gradesResponse = await fetch(`/api/classes/${classId}/grades`);
        
        // if (!studentsResponse.ok || !assignmentsResponse.ok || !gradesResponse.ok) {
        //   throw new Error('Failed to fetch class grades');
        // }
        
        // const studentsData = await studentsResponse.json();
        // const assignmentsData = await assignmentsResponse.json();
        // const gradesData = await gradesResponse.json();
        
        // setStudents(studentsData);
        // setAssignments(assignmentsData);
        // setGradeRecords(gradesData.records);
        // setStudentSummaries(gradesData.studentSummaries);
        // setAssignmentSummaries(gradesData.assignmentSummaries);
        // setSummary(gradesData.summary);
        
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
        ];
        
        setStudents(mockStudents);
        
        // Mock assignments
        const mockAssignments: Assignment[] = [
          {
            id: '1',
            title: 'Chapter 1 Homework',
            type: 'homework',
            dueDate: '2023-09-15',
            maxScore: 100,
            weight: 10,
            status: 'graded'
          },
          {
            id: '2',
            title: 'Quiz 1',
            type: 'quiz',
            dueDate: '2023-09-20',
            maxScore: 50,
            weight: 15,
            status: 'graded'
          },
          {
            id: '3',
            title: 'Midterm Exam',
            type: 'test',
            dueDate: '2023-10-15',
            maxScore: 100,
            weight: 25,
            status: 'graded'
          },
          {
            id: '4',
            title: 'Research Project',
            type: 'project',
            dueDate: '2023-11-15',
            maxScore: 100,
            weight: 20,
            status: 'published'
          },
          {
            id: '5',
            title: 'Final Exam',
            type: 'test',
            dueDate: '2023-12-15',
            maxScore: 100,
            weight: 30,
            status: 'draft'
          }
        ];
        
        setAssignments(mockAssignments);
        
        // Generate mock grade records
        const mockGradeRecords: Record<string, Record<string, GradeRecord>> = {};
        const mockStudentSummaries: any[] = [];
        const mockAssignmentSummaries: any[] = [];
        
        // Initialize grade records for each student
        mockStudents.forEach(student => {
          mockGradeRecords[student.id] = {};
          
          let totalScore = 0;
          let totalWeight = 0;
          let completedAssignments = 0;
          
          // Generate grades for each assignment
          mockAssignments.forEach(assignment => {
            if (assignment.status === 'graded') {
              // Generate a random score between 60% and 100% of max score
              const score = Math.floor(Math.random() * (assignment.maxScore * 0.4)) + Math.floor(assignment.maxScore * 0.6);
              const percentage = (score / assignment.maxScore) * 100;
              
              let letterGrade = '';
              if (percentage >= 90) letterGrade = 'A';
              else if (percentage >= 80) letterGrade = 'B';
              else if (percentage >= 70) letterGrade = 'C';
              else if (percentage >= 60) letterGrade = 'D';
              else letterGrade = 'F';
              
              mockGradeRecords[student.id][assignment.id] = {
                studentId: student.id,
                assignmentId: assignment.id,
                score,
                percentage,
                letterGrade,
                status: 'graded'
              };
              
              totalScore += percentage * (assignment.weight / 100);
              totalWeight += assignment.weight;
              completedAssignments++;
            } else {
              mockGradeRecords[student.id][assignment.id] = {
                studentId: student.id,
                assignmentId: assignment.id,
                score: null,
                percentage: null,
                letterGrade: '',
                status: assignment.status
              };
            }
          });
          
          // Calculate student summary
          const weightedAverage = totalWeight > 0 ? totalScore / totalWeight * 100 : 0;
          
          let letterGrade = '';
          if (weightedAverage >= 90) letterGrade = 'A';
          else if (weightedAverage >= 80) letterGrade = 'B';
          else if (weightedAverage >= 70) letterGrade = 'C';
          else if (weightedAverage >= 60) letterGrade = 'D';
          else letterGrade = 'F';
          
          mockStudentSummaries.push({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentIdNumber: student.studentId,
            averageScore: Math.round(weightedAverage),
            letterGrade,
            completedAssignments,
            totalAssignments: mockAssignments.length
          });
        });
        
        setGradeRecords(mockGradeRecords);
        setStudentSummaries(mockStudentSummaries);
        
        // Calculate assignment summaries
        mockAssignments.forEach(assignment => {
          if (assignment.status === 'graded') {
            const scores = mockStudents.map(student => mockGradeRecords[student.id][assignment.id].score).filter(score => score !== null) as number[];
            const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
            const highest = Math.max(...scores);
            const lowest = Math.min(...scores);
            
            // Count letter grades
            const letterGrades = mockStudents.map(student => mockGradeRecords[student.id][assignment.id].letterGrade).filter(grade => grade !== '');
            const letterGradeCounts = {
              A: letterGrades.filter(grade => grade === 'A').length,
              B: letterGrades.filter(grade => grade === 'B').length,
              C: letterGrades.filter(grade => grade === 'C').length,
              D: letterGrades.filter(grade => grade === 'D').length,
              F: letterGrades.filter(grade => grade === 'F').length
            };
            
            mockAssignmentSummaries.push({
              assignmentId: assignment.id,
              title: assignment.title,
              type: assignment.type,
              dueDate: assignment.dueDate,
              maxScore: assignment.maxScore,
              averageScore: Math.round(average),
              highestScore: highest,
              lowestScore: lowest,
              letterGradeCounts
            });
          }
        });
        
        setAssignmentSummaries(mockAssignmentSummaries);
        
        // Calculate class summary
        const averageScores = mockStudentSummaries.map(summary => summary.averageScore);
        const classAverage = averageScores.reduce((sum, score) => sum + score, 0) / averageScores.length;
        const highestAverage = Math.max(...averageScores);
        const lowestAverage = Math.min(...averageScores);
        
        // Count letter grades
        const letterGrades = mockStudentSummaries.map(summary => summary.letterGrade);
        const letterGradeDistribution = {
          A: letterGrades.filter(grade => grade === 'A').length,
          B: letterGrades.filter(grade => grade === 'B').length,
          C: letterGrades.filter(grade => grade === 'C').length,
          D: letterGrades.filter(grade => grade === 'D').length,
          F: letterGrades.filter(grade => grade === 'F').length
        };
        
        setSummary({
          averageScore: Math.round(classAverage),
          highestScore: highestAverage,
          lowestScore: lowestAverage,
          letterGradeDistribution
        });
      } catch (err) {
        console.error('Error fetching class grades:', err);
        setError('Failed to load class grades. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClassGrades();
  }, [classId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Pagination for student summaries
  const paginatedStudentSummaries = studentSummaries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getLetterGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'primary';
      case 'C': return 'info';
      case 'D': return 'warning';
      case 'F': return 'error';
      default: return 'default';
    }
  };

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
                    Class Average
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {summary.averageScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall class average
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Highest Average
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {summary.highestScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Top student average
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Lowest Average
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {summary.lowestScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lowest student average
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
                    <Chip 
                      label={`A: ${summary.letterGradeDistribution.A}`} 
                      size="small" 
                      color="success" 
                    />
                    <Chip 
                      label={`B: ${summary.letterGradeDistribution.B}`} 
                      size="small" 
                      color="primary" 
                    />
                    <Chip 
                      label={`C: ${summary.letterGradeDistribution.C}`} 
                      size="small" 
                      color="info" 
                    />
                    <Chip 
                      label={`D: ${summary.letterGradeDistribution.D}`} 
                      size="small" 
                      color="warning" 
                    />
                    <Chip 
                      label={`F: ${summary.letterGradeDistribution.F}`} 
                      size="small" 
                      color="error" 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="grade tabs">
              <Tab label="Student Grades" />
              <Tab label="Assignment Analysis" />
              <Tab label="Grade Matrix" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell align="center"><strong>Average</strong></TableCell>
                    <TableCell align="center"><strong>Grade</strong></TableCell>
                    <TableCell align="center"><strong>Completed</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStudentSummaries.map((summary) => (
                    <TableRow key={summary.studentId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              mr: 2,
                              bgcolor: 'primary.main'
                            }}
                          >
                            {summary.studentName.split(' ')[0][0]}{summary.studentName.split(' ')[1][0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">
                              {summary.studentName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {summary.studentIdNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">{summary.averageScore}%</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={summary.letterGrade} 
                          color={getLetterGradeColor(summary.letterGrade)} 
                        />
                      </TableCell>
                      <TableCell align="center">
                        {summary.completedAssignments}/{summary.totalAssignments} ({Math.round(summary.completedAssignments / summary.totalAssignments * 100)}%)
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={studentSummaries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Assignment</strong></TableCell>
                    <TableCell><strong>Type</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell align="center"><strong>Average</strong></TableCell>
                    <TableCell align="center"><strong>Highest</strong></TableCell>
                    <TableCell align="center"><strong>Lowest</strong></TableCell>
                    <TableCell align="center"><strong>Grade Distribution</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignmentSummaries.map((summary) => (
                    <TableRow key={summary.assignmentId} hover>
                      <TableCell>{summary.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={summary.type.charAt(0).toUpperCase() + summary.type.slice(1)} 
                          color={
                            summary.type === 'test' ? 'error' :
                            summary.type === 'quiz' ? 'warning' :
                            summary.type === 'project' ? 'info' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(summary.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell align="center">{summary.averageScore}/{summary.maxScore} ({Math.round(summary.averageScore / summary.maxScore * 100)}%)</TableCell>
                      <TableCell align="center">{summary.highestScore}/{summary.maxScore} ({Math.round(summary.highestScore / summary.maxScore * 100)}%)</TableCell>
                      <TableCell align="center">{summary.lowestScore}/{summary.maxScore} ({Math.round(summary.lowestScore / summary.maxScore * 100)}%)</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Chip 
                            label={`A: ${summary.letterGradeCounts.A}`} 
                            size="small" 
                            color="success" 
                          />
                          <Chip 
                            label={`B: ${summary.letterGradeCounts.B}`} 
                            size="small" 
                            color="primary" 
                          />
                          <Chip 
                            label={`C: ${summary.letterGradeCounts.C}`} 
                            size="small" 
                            color="info" 
                          />
                          <Chip 
                            label={`D: ${summary.letterGradeCounts.D}`} 
                            size="small" 
                            color="warning" 
                          />
                          <Chip 
                            label={`F: ${summary.letterGradeCounts.F}`} 
                            size="small" 
                            color="error" 
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Student</strong></TableCell>
                    {assignments.filter(a => a.status === 'graded').map((assignment) => (
                      <TableCell key={assignment.id} align="center">
                        <Tooltip title={`${assignment.title} (${assignment.type})`}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 100 }}>
                            {assignment.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    ))}
                    <TableCell align="center"><strong>Average</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {student.firstName} {student.lastName}
                        </Typography>
                      </TableCell>
                      {assignments.filter(a => a.status === 'graded').map((assignment) => {
                        const gradeRecord = gradeRecords[student.id]?.[assignment.id];
                        return (
                          <TableCell key={`${student.id}-${assignment.id}`} align="center">
                            {gradeRecord?.score !== null ? (
                              <Chip 
                                label={gradeRecord?.letterGrade} 
                                size="small"
                                color={getLetterGradeColor(gradeRecord?.letterGrade)}
                              />
                            ) : '-'}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center">
                        {studentSummaries.find(s => s.studentId === student.id)?.letterGrade ? (
                          <Chip 
                            label={studentSummaries.find(s => s.studentId === student.id)?.letterGrade} 
                            color={getLetterGradeColor(studentSummaries.find(s => s.studentId === student.id)?.letterGrade)}
                          />
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

// Simple tooltip component for the grade matrix
const Tooltip = ({ title, children }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <Box
        sx={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1,
          visibility: 'hidden',
          opacity: 0,
          transition: 'opacity 0.3s',
          '&:hover': {
            visibility: 'visible',
            opacity: 1
          }
        }}
      >
        {title}
      </Box>
    </Box>
  );
};

export default ClassGrades;

