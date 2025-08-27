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
import { Teacher } from '@/lib/types';

interface TeacherListProps {
  isAdmin: boolean;
}

const TeacherList: React.FC<TeacherListProps> = ({
  isAdmin
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/teachers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to load teachers. Please try again later.');
        
        // For demo purposes, set some mock data
        setTeachers([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            department: 'Mathematics',
            position: 'Teacher',
            status: 'Active',
            hireDate: '2020-08-15',
            teachingHours: 25,
            classCount: 5,
            studentCount: 125
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@example.com',
            department: 'Science',
            position: 'Department Head',
            status: 'Active',
            hireDate: '2018-07-10',
            teachingHours: 20,
            classCount: 4,
            studentCount: 100
          },
          {
            id: '3',
            firstName: 'Michael',
            lastName: 'Williams',
            email: 'michael.williams@example.com',
            department: 'English',
            position: 'Teacher',
            status: 'Active',
            hireDate: '2021-01-05',
            teachingHours: 25,
            classCount: 5,
            studentCount: 125
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Brown',
            email: 'emily.brown@example.com',
            department: 'History',
            position: 'Teacher',
            status: 'On Leave',
            hireDate: '2019-08-20',
            teachingHours: 0,
            classCount: 0,
            studentCount: 0
          },
          {
            id: '5',
            firstName: 'David',
            lastName: 'Jones',
            email: 'david.jones@example.com',
            department: 'Physical Education',
            position: 'Teacher',
            status: 'Active',
            hireDate: '2017-08-15',
            teachingHours: 25,
            classCount: 10,
            studentCount: 250
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

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

  const handleDepartmentFilterChange = (event: SelectChangeEvent) => {
    setDepartmentFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleViewTeacher = (teacherId: string) => {
    router.push(`/teachers/${teacherId}`);
  };

  const handleEditTeacher = (teacherId: string) => {
    router.push(`/teachers/${teacherId}/edit`);
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }
      
      // Remove the deleted teacher from the list
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (err) {
      console.error('Error deleting teacher:', err);
      setError('Failed to delete teacher. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(teachers.map(teacher => teacher.department))].filter(Boolean);

  // Filter teachers based on search term and filters
  const filteredTeachers = teachers.filter(teacher => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch = 
      searchTerm === '' || 
      fullName.includes(searchTerm.toLowerCase()) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (teacher.teacherId && teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = 
      departmentFilter === '' || 
      teacher.department === departmentFilter;
    
    const matchesStatus = 
      statusFilter === '' || 
      teacher.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const paginatedTeachers = filteredTeachers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2 }}>
        <TextField
          label="Search Teachers"
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
          <InputLabel id="department-filter-label">Department</InputLabel>
          <Select
            labelId="department-filter-label"
            value={departmentFilter}
            label="Department"
            onChange={handleDepartmentFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
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
            <MenuItem value="On Leave">On Leave</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Retired">Retired</MenuItem>
            <MenuItem value="Terminated">Terminated</MenuItem>
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
            <Table sx={{ minWidth: 650 }} aria-label="teachers table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Teacher</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell><strong>Position</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell><strong>Teaching Load</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTeachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2,
                            bgcolor: teacher.profileColor || 'primary.main'
                          }}
                        >
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            {teacher.firstName} {teacher.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {teacher.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.department || 'Not assigned'}</TableCell>
                    <TableCell>{teacher.position || 'Teacher'}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {teacher.phone || 'No phone'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {teacher.office ? `Office: ${teacher.office}` : 'No office'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Classes: {teacher.classCount || '0'}
                      </Typography>
                      <Typography variant="body2">
                        Hours: {teacher.teachingHours || '0'}/week
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={teacher.status || 'Active'} 
                        color={
                          teacher.status === 'Active' ? 'success' :
                          teacher.status === 'On Leave' ? 'warning' :
                          'default'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton onClick={() => handleViewTeacher(teacher.id)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {isAdmin && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleEditTeacher(teacher.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleDeleteTeacher(teacher.id)} color="error">
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
            count={filteredTeachers.length}
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

export default TeacherList;

