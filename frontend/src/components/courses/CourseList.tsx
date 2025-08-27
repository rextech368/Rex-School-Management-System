import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Course } from '@/lib/types';

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('');

  // Extract unique departments for filtering
  const departments = [...new Set(courses.map(course => course.department))];
  
  // Extract unique grade levels for filtering
  const gradeLevels = [...new Set(
    courses.flatMap(course => 
      course.gradeLevel ? 
        Array.isArray(course.gradeLevel) ? 
          course.gradeLevel : 
          [course.gradeLevel] 
        : []
    )
  )].sort((a, b) => a - b);

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

  const handleGradeFilterChange = (event: SelectChangeEvent) => {
    setGradeFilter(event.target.value);
    setPage(0);
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  // Filter courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      searchTerm === '' || 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = 
      departmentFilter === '' || 
      course.department === departmentFilter;
    
    const matchesGrade = 
      gradeFilter === '' || 
      (course.gradeLevel && 
        (Array.isArray(course.gradeLevel) 
          ? course.gradeLevel.includes(parseInt(gradeFilter))
          : course.gradeLevel === parseInt(gradeFilter))
      );
    
    return matchesSearch && matchesDepartment && matchesGrade;
  });

  // Pagination
  const paginatedCourses = filteredCourses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
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
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="grade-filter-label">Grade Level</InputLabel>
          <Select
            labelId="grade-filter-label"
            value={gradeFilter}
            label="Grade Level"
            onChange={handleGradeFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Grades</MenuItem>
            {gradeLevels.map(grade => (
              <MenuItem key={grade} value={grade.toString()}>Grade {grade}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredCourses.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No courses found matching your criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table aria-label="courses table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Course Code</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Department</strong></TableCell>
                  <TableCell><strong>Credits</strong></TableCell>
                  <TableCell><strong>Grade Level</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCourses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      {Array.isArray(course.gradeLevel) ? (
                        course.gradeLevel.map(grade => (
                          <Chip 
                            key={grade} 
                            label={`Grade ${grade}`} 
                            size="small" 
                            sx={{ mr: 0.5, mb: 0.5 }} 
                          />
                        ))
                      ) : (
                        course.gradeLevel ? `Grade ${course.gradeLevel}` : 'N/A'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton 
                          onClick={() => handleViewCourse(course.id)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCourses.length}
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

export default CourseList;

