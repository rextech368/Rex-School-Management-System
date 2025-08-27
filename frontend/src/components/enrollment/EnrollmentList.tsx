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
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import { Enrollment, EnrollmentStatus, Term, Class } from '@/lib/types';

interface EnrollmentListProps {
  termId: string;
  classId?: string;
  onTermChange: (termId: string) => void;
  terms: Term[];
  adminView?: boolean;
  teacherView?: boolean;
  showPending?: boolean;
}

const EnrollmentList: React.FC<EnrollmentListProps> = ({
  termId,
  classId,
  onTermChange,
  terms,
  adminView = false,
  teacherView = false,
  showPending = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!termId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        let queryParams = `termId=${termId}`;
        if (classId) queryParams += `&classId=${classId}`;
        if (showPending) queryParams += `&status=${EnrollmentStatus.WAITLISTED}`;
        if (teacherView) queryParams += `&teacherId=${user?.id}`;
        
        // Fetch enrollments
        const enrollmentsResponse = await fetch(`/api/enrollments?${queryParams}`);
        if (!enrollmentsResponse.ok) {
          throw new Error('Failed to fetch enrollments');
        }
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData);
        
        // Fetch classes for the term if needed for filtering
        if (!classId && (adminView || teacherView)) {
          const classesResponse = await fetch(`/api/classes?termId=${termId}`);
          if (!classesResponse.ok) {
            throw new Error('Failed to fetch classes');
          }
          const classesData = await classesResponse.json();
          setClasses(classesData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [termId, classId, showPending, teacherView, adminView]);

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

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleTermChange = (event: SelectChangeEvent) => {
    onTermChange(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, enrollment: Enrollment) => {
    setAnchorEl(event.currentTarget);
    setSelectedEnrollment(enrollment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: string) => {
    setActionType(action);
    setActionDialogOpen(true);
    setActionError(null);
    setActionSuccess(null);
    handleMenuClose();
  };

  const handleCloseActionDialog = () => {
    setActionDialogOpen(false);
    setSelectedEnrollment(null);
    setActionType('');
  };

  const handleConfirmAction = async () => {
    if (!selectedEnrollment) return;
    
    try {
      setActionLoading(true);
      setActionError(null);
      setActionSuccess(null);
      
      let newStatus: EnrollmentStatus;
      let method = 'PUT';
      
      switch (actionType) {
        case 'approve':
          newStatus = EnrollmentStatus.ENROLLED;
          break;
        case 'reject':
          newStatus = EnrollmentStatus.DROPPED;
          break;
        case 'drop':
          newStatus = EnrollmentStatus.DROPPED;
          break;
        case 'waitlist':
          newStatus = EnrollmentStatus.WAITLISTED;
          break;
        default:
          throw new Error('Invalid action type');
      }
      
      const response = await fetch(`/api/enrollments/${selectedEnrollment.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update enrollment');
      }
      
      const data = await response.json();
      
      // Update local enrollments list
      setEnrollments(enrollments.map(e => 
        e.id === data.id ? data : e
      ));
      
      setActionSuccess(`Successfully ${actionType}ed enrollment!`);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setActionDialogOpen(false);
        setSelectedEnrollment(null);
        setActionType('');
      }, 1500);
    } catch (err) {
      console.error('Error updating enrollment:', err);
      setActionError(err.message || 'An error occurred while updating the enrollment.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter enrollments based on search term and status filter
  const filteredEnrollments = enrollments.filter(enrollment => {
    const studentName = enrollment.student ? 
      `${enrollment.student.firstName} ${enrollment.student.lastName}`.toLowerCase() : 
      '';
    const className = enrollment.class?.course ? 
      `${enrollment.class.course.code} ${enrollment.class.course.name}`.toLowerCase() : 
      '';
    
    const matchesSearch = 
      searchTerm === '' || 
      studentName.includes(searchTerm.toLowerCase()) ||
      className.includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === '' || 
      enrollment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const paginatedEnrollments = filteredEnrollments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get status chip for enrollment status
  const getStatusChip = (status: EnrollmentStatus) => {
    switch (status) {
      case EnrollmentStatus.ENROLLED:
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Enrolled" 
            color="success" 
            size="small" 
          />
        );
      case EnrollmentStatus.WAITLISTED:
        return (
          <Chip 
            icon={<HourglassEmptyIcon />} 
            label="Waitlisted" 
            color="warning" 
            size="small" 
          />
        );
      case EnrollmentStatus.DROPPED:
        return (
          <Chip 
            icon={<CancelIcon />} 
            label="Dropped" 
            color="error" 
            size="small" 
          />
        );
      case EnrollmentStatus.COMPLETED:
        return (
          <Chip 
            label="Completed" 
            color="primary" 
            size="small" 
          />
        );
      default:
        return (
          <Chip 
            label={status} 
            size="small" 
          />
        );
    }
  };

  // Get action dialog title and content based on action type
  const getActionDialogContent = () => {
    if (!selectedEnrollment) return { title: '', content: '' };
    
    const studentName = selectedEnrollment.student ? 
      `${selectedEnrollment.student.firstName} ${selectedEnrollment.student.lastName}` : 
      'Unknown Student';
    const className = selectedEnrollment.class?.course ? 
      `${selectedEnrollment.class.course.code}: ${selectedEnrollment.class.course.name}` : 
      'Unknown Class';
    
    switch (actionType) {
      case 'approve':
        return {
          title: 'Approve Enrollment',
          content: `Are you sure you want to approve ${studentName}'s enrollment in ${className}?`
        };
      case 'reject':
        return {
          title: 'Reject Enrollment',
          content: `Are you sure you want to reject ${studentName}'s enrollment in ${className}?`
        };
      case 'drop':
        return {
          title: 'Drop Student',
          content: `Are you sure you want to drop ${studentName} from ${className}?`
        };
      case 'waitlist':
        return {
          title: 'Move to Waitlist',
          content: `Are you sure you want to move ${studentName} to the waitlist for ${className}?`
        };
      default:
        return { title: '', content: '' };
    }
  };

  const actionDialogContent = getActionDialogContent();

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={adminView || teacherView ? 3 : 4}>
          <FormControl fullWidth>
            <InputLabel id="term-select-label">Academic Term</InputLabel>
            <Select
              labelId="term-select-label"
              id="term-select"
              value={termId}
              label="Academic Term"
              onChange={handleTermChange}
              disabled={terms.length === 0}
            >
              {terms.map((term) => (
                <MenuItem key={term.id} value={term.id}>
                  {term.name} {term.isCurrent && '(Current)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {(adminView || teacherView) && !classId && (
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="class-filter-label">Class</InputLabel>
              <Select
                labelId="class-filter-label"
                id="class-filter"
                value={classFilter}
                label="Class"
                onChange={handleClassFilterChange}
                disabled={classes.length === 0}
              >
                <MenuItem value="">All Classes</MenuItem>
                {classes.map((classItem) => (
                  <MenuItem key={classItem.id} value={classItem.id}>
                    {classItem.course?.code}: Section {classItem.section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        
        <Grid item xs={12} md={adminView || teacherView ? 3 : 4}>
          <TextField
            fullWidth
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={adminView || teacherView ? 3 : 4}>
          <FormControl fullWidth>
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
              <MenuItem value={EnrollmentStatus.ENROLLED}>Enrolled</MenuItem>
              <MenuItem value={EnrollmentStatus.WAITLISTED}>Waitlisted</MenuItem>
              <MenuItem value={EnrollmentStatus.DROPPED}>Dropped</MenuItem>
              <MenuItem value={EnrollmentStatus.COMPLETED}>Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {actionSuccess && <Alert severity="success" sx={{ mb: 3 }}>{actionSuccess}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredEnrollments.length === 0 ? (
        <Alert severity="info">
          No enrollments found matching your criteria.
        </Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="enrollments table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Class</strong></TableCell>
                  <TableCell><strong>Section</strong></TableCell>
                  <TableCell><strong>Enrollment Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  {(adminView || teacherView) && (
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id} hover>
                    <TableCell>
                      {enrollment.student ? (
                        <>
                          <Typography variant="body2">
                            {enrollment.student.firstName} {enrollment.student.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Grade {enrollment.student.gradeLevel}
                          </Typography>
                        </>
                      ) : (
                        'Unknown Student'
                      )}
                    </TableCell>
                    <TableCell>
                      {enrollment.class?.course ? (
                        <>
                          <Typography variant="body2">
                            {enrollment.class.course.code}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {enrollment.class.course.name}
                          </Typography>
                        </>
                      ) : (
                        'Unknown Class'
                      )}
                    </TableCell>
                    <TableCell>
                      {enrollment.class?.section || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(enrollment.status)}
                    </TableCell>
                    {(adminView || teacherView) && (
                      <TableCell align="center">
                        <IconButton
                          aria-label="more"
                          aria-controls="enrollment-menu"
                          aria-haspopup="true"
                          onClick={(event) => handleMenuOpen(event, enrollment)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEnrollments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          
          <Menu
            id="enrollment-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {selectedEnrollment?.status === EnrollmentStatus.WAITLISTED && (
              <MenuItem onClick={() => handleActionClick('approve')}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Approve" />
              </MenuItem>
            )}
            {selectedEnrollment?.status === EnrollmentStatus.WAITLISTED && (
              <MenuItem onClick={() => handleActionClick('reject')}>
                <ListItemIcon>
                  <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reject" />
              </MenuItem>
            )}
            {selectedEnrollment?.status === EnrollmentStatus.ENROLLED && (
              <MenuItem onClick={() => handleActionClick('drop')}>
                <ListItemIcon>
                  <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Drop Student" />
              </MenuItem>
            )}
            {selectedEnrollment?.status === EnrollmentStatus.ENROLLED && (
              <MenuItem onClick={() => handleActionClick('waitlist')}>
                <ListItemIcon>
                  <HourglassEmptyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Move to Waitlist" />
              </MenuItem>
            )}
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
                </ListItemIcon>
              <ListItemText primary="View Student" />
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ClassIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View Class" />
            </MenuItem>
          </Menu>
          
          <Dialog
            open={actionDialogOpen}
            onClose={handleCloseActionDialog}
            aria-labelledby="action-dialog-title"
            aria-describedby="action-dialog-description"
          >
            <DialogTitle id="action-dialog-title">
              {actionDialogContent.title}
            </DialogTitle>
            <DialogContent>
              {actionError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {actionError}
                </Alert>
              )}
              {actionSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {actionSuccess}
                </Alert>
              )}
              <DialogContentText id="action-dialog-description">
                {actionDialogContent.content}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseActionDialog} disabled={actionLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmAction} 
                color="primary" 
                disabled={actionLoading || actionSuccess !== null}
                startIcon={actionLoading ? <CircularProgress size={20} /> : null}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default EnrollmentList;

