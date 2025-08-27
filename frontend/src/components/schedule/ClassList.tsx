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
  Typography,
  Button,
  Collapse,
  Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Class, DayOfWeek } from '@/lib/types';

interface ClassListProps {
  classes: Class[];
  termId: string;
  canEdit: boolean;
}

const ClassList: React.FC<ClassListProps> = ({ classes, termId, canEdit }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [teacherFilter, setTeacherFilter] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // Extract unique departments for filtering
  const departments = [...new Set(classes.map(classItem => 
    classItem.course?.department || 'Unknown'
  ))];
  
  // Extract unique teachers for filtering
  const teachers = [...new Set(classes
    .filter(classItem => classItem.teacher)
    .map(classItem => 
      classItem.teacher ? 
        `${classItem.teacher.firstName} ${classItem.teacher.lastName}` : 
        null
    )
    .filter(Boolean)
  )];

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

  const handleTeacherFilterChange = (event: SelectChangeEvent) => {
    setTeacherFilter(event.target.value);
    setPage(0);
  };

  const handleViewClass = (classId: string) => {
    router.push(`/classes/${classId}`);
  };

  const handleEditClass = (classId: string) => {
    router.push(`/classes/${classId}/edit`);
  };

  const toggleExpandRow = (classId: string) => {
    setExpandedRow(expandedRow === classId ? null : classId);
  };

  // Format schedule for display
  const formatSchedule = (schedule: any) => {
    const dayName = schedule.dayOfWeek.charAt(0).toUpperCase() + schedule.dayOfWeek.slice(1).toLowerCase();
    return `${dayName} ${schedule.startTime} - ${schedule.endTime}`;
  };

  // Filter classes based on search term and filters
  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      searchTerm === '' || 
      (classItem.course?.name && classItem.course.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (classItem.course?.code && classItem.course.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (classItem.section && classItem.section.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = 
      departmentFilter === '' || 
      classItem.course?.department === departmentFilter;
    
    const matchesTeacher = 
      teacherFilter === '' || 
      (classItem.teacher && 
        `${classItem.teacher.firstName} ${classItem.teacher.lastName}` === teacherFilter);
    
    return matchesSearch && matchesDepartment && matchesTeacher;
  });

  // Pagination
  const paginatedClasses = filteredClasses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          label="Search Classes"
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
          <InputLabel id="teacher-filter-label">Teacher</InputLabel>
          <Select
            labelId="teacher-filter-label"
            value={teacherFilter}
            label="Teacher"
            onChange={handleTeacherFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Teachers</MenuItem>
            {teachers.map(teacher => (
              <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredClasses.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No classes found matching your criteria.
          </Typography>
          {canEdit && (
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => router.push('/classes/new')}
            >
              Create Class
            </Button>
          )}
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table aria-label="classes table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Section</strong></TableCell>
                  <TableCell><strong>Teacher</strong></TableCell>
                  <TableCell><strong>Schedule</strong></TableCell>
                  <TableCell><strong>Room</strong></TableCell>
                  <TableCell><strong>Enrollment</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedClasses.map((classItem) => (
                  <React.Fragment key={classItem.id}>
                    <TableRow hover>
                      <TableCell padding="checkbox">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleExpandRow(classItem.id)}
                        >
                          {expandedRow === classItem.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {classItem.course ? (
                          <>
                            <Typography variant="body2" fontWeight="bold">
                              {classItem.course.code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {classItem.course.name}
                            </Typography>
                          </>
                        ) : (
                          'Unknown Course'
                        )}
                      </TableCell>
                      <TableCell>{classItem.section}</TableCell>
                      <TableCell>
                        {classItem.teacher ? (
                          `${classItem.teacher.firstName} ${classItem.teacher.lastName}`
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not Assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {classItem.schedules && classItem.schedules.length > 0 ? (
                          <Typography variant="body2">
                            {formatSchedule(classItem.schedules[0])}
                            {classItem.schedules.length > 1 && (
                              <Typography variant="body2" color="text.secondary">
                                +{classItem.schedules.length - 1} more
                              </Typography>
                            )}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No schedule
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {classItem.room ? (
                          <Typography variant="body2">
                            {classItem.building ? `${classItem.building} ` : ''}
                            {classItem.room}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not Assigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {classItem.enrolledCount || 0}/{classItem.capacity || 'Unlimited'}
                        </Typography>
                        {classItem.waitlistCount > 0 && (
                          <Chip 
                            label={`Waitlist: ${classItem.waitlistCount}`} 
                            size="small" 
                            color="warning" 
                            sx={{ mt: 0.5 }} 
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            onClick={() => handleViewClass(classItem.id)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {canEdit && (
                          <Tooltip title="Edit Class">
                            <IconButton 
                              onClick={() => handleEditClass(classItem.id)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={expandedRow === classItem.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Class Details
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Department
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  {classItem.course?.department || 'N/A'}
                                </Typography>
                                
                                <Typography variant="subtitle2" color="text.secondary">
                                  Term
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                  {classItem.term?.name || 'N/A'}
                                </Typography>
                                
                                <Typography variant="subtitle2" color="text.secondary">
                                  Status
                                </Typography>
                                <Chip 
                                  label={classItem.isActive ? 'Active' : 'Inactive'} 
                                  color={classItem.isActive ? 'success' : 'default'} 
                                  size="small" 
                                />
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  All Schedules
                                </Typography>
                                {classItem.schedules && classItem.schedules.length > 0 ? (
                                  classItem.schedules.map((schedule, index) => (
                                    <Typography key={index} variant="body2" gutterBottom>
                                      {formatSchedule(schedule)}
                                      {schedule.room && ` - ${schedule.building || ''} ${schedule.room}`}
                                    </Typography>
                                  ))
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    No schedules defined
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredClasses.length}
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

export default ClassList;

