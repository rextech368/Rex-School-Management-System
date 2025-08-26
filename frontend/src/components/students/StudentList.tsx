import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Avatar,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useRouter } from 'next/router';
import { Student } from '@/lib/types';

interface StudentListProps {
  isAdmin: boolean;
  teacherId?: string;
}

const StudentList: React.FC<StudentListProps> = ({
  isAdmin,
  teacherId
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (teacherId) params.append('teacherId', teacherId);
        
        const response = await fetch(`/api/students${params.toString() ? `?${params.toString()}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Please try again later.');
        
        // For demo purposes, set some mock data
        setStudents([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            gradeLevel: 9,
            status: 'Active',
            enrollmentDate: '2023-08-15',
            guardianFirstName: 'Jane',
            guardianLastName: 'Doe',
            guardianEmail: 'jane.doe@example.com',
            guardianPhone: '555-123-4567'
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            gradeLevel: 10,
            status: 'Active',
            enrollmentDate: '2023-08-10',
            guardianFirstName: 'John',
            guardianLastName: 'Smith',
            guardianEmail: 'john.smith@example.com',
            guardianPhone: '555-987-6543'
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.johnson@example.com',
            gradeLevel: 11,
            status: 'Active',
            enrollmentDate: '2023-08-12',
            guardianFirstName: 'Sarah',
            guardianLastName: 'Johnson',
            guardianEmail: 'sarah.johnson@example.com',
            guardianPhone: '555-456-7890'
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Williams',
            email: 'emily.williams@example.com',
            gradeLevel: 9,
            status: 'Active',
            enrollmentDate: '2023-08-14',
            guardianFirstName: 'Robert',
            guardianLastName: 'Williams',
            guardianEmail: 'robert.williams@example.com',
            guardianPhone: '555-789-0123'
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.brown@example.com',
            gradeLevel: 12,
            status: 'Active',
            enrollmentDate: '2023-08-11',
            guardianFirstName: 'Linda',
            guardianLastName: 'Brown',
            guardianEmail: 'linda.brown@example.com',
            guardianPhone: '555-321-6547'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [teacherId]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleGradeFilterChange = (event: SelectChangeEvent) => {
    setGradeFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleViewStudent = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const handleEditStudent = (studentId: string) => {
    router.push(`/students/${studentId}/edit`);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      // Remove the deleted student from the list
      setStudents(students.filter(student => student.id !== studentId));
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term and filters
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch = 
      searchTerm === '' || 
      fullName.includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGrade = 
      gradeFilter === '' || 
      student.gradeLevel?.toString() === gradeFilter;
    
    const matchesStatus = 
      statusFilter === '' || 
      student.status === statusFilter;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Pagination
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2 }}>
        <TextField
          label="Search Students"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="grade-filter-label">Grade</InputLabel>
          <Select
            labelId="grade-filter-label"
            value={gradeFilter}
            label="Grade"
            onChange={handleGradeFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Grades</MenuItem>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={(i + 1).toString()}>
                Grade {i + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Graduated">Graduated</MenuItem>
            <MenuItem value="Transferred">Transferred</MenuItem>
            <MenuItem value="Withdrawn">Withdrawn</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="students table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Grade</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>Guardian</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((student) => (
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
                            {student.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.studentId || student.id}</TableCell>
                    <TableCell>
                      {student.gradeLevel ? `Grade ${student.gradeLevel}` : 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.phone || 'No phone'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.address ? `${student.city || ''}, ${student.state || ''}` : 'No address'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {student.guardianFirstName ? (
                        <>
                          <Typography variant="body2">
                            {student.guardianFirstName} {student.guardianLastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.guardianPhone || student.guardianEmail || 'No contact info'}
                          </Typography>
                        </>
                      ) : (
                        'Not provided'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.status || 'Active'} 
                        color={student.status === 'Active' ? 'success' : 'default'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton onClick={() => handleViewStudent(student.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {isAdmin && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEditStudent(student.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteStudent(student.id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
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

export default StudentList;

