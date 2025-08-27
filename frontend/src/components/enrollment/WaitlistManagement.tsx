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
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import { Enrollment, EnrollmentStatus, Class } from '@/lib/types';

interface WaitlistManagementProps {
  termId: string;
  classId: string;
}

const WaitlistManagement: React.FC<WaitlistManagementProps> = ({
  termId,
  classId
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitlistedEnrollments, setWaitlistedEnrollments] = useState<Enrollment[]>([]);
  const [classDetails, setClassDetails] = useState<Class | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'reorder'>('approve');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [studentInfoDialogOpen, setStudentInfoDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!termId || !classId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch waitlisted enrollments for the class
        const enrollmentsResponse = await fetch(`/api/enrollments?classId=${classId}&status=${EnrollmentStatus.WAITLISTED}`);
        if (!enrollmentsResponse.ok) {
          throw new Error('Failed to fetch waitlisted enrollments');
        }
        const enrollmentsData = await enrollmentsResponse.json();
        
        // Sort by enrollment date (oldest first)
        enrollmentsData.sort((a: Enrollment, b: Enrollment) => 
          new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime()
        );
        
        setWaitlistedEnrollments(enrollmentsData);
        
        // Fetch class details
        const classResponse = await fetch(`/api/classes/${classId}`);
        if (!classResponse.ok) {
          throw new Error('Failed to fetch class details');
        }
        const classData = await classResponse.json();
        setClassDetails(classData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [termId, classId]);

  const handleApproveClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setActionType('approve');
    setActionDialogOpen(true);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleRejectClick = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setActionType('reject');
    setActionDialogOpen(true);
    setActionError(null);
    setActionSuccess(null);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    
    const newEnrollments = [...waitlistedEnrollments];
    const temp = newEnrollments[index];
    newEnrollments[index] = newEnrollments[index - 1];
    newEnrollments[index - 1] = temp;
    
    setWaitlistedEnrollments(newEnrollments);
    
    // TODO: Update waitlist order in the backend
    updateWaitlistOrder(newEnrollments);
  };

  const handleMoveDown = (index: number) => {
    if (index >= waitlistedEnrollments.length - 1) return;
    
    const newEnrollments = [...waitlistedEnrollments];
    const temp = newEnrollments[index];
    newEnrollments[index] = newEnrollments[index + 1];
    newEnrollments[index + 1] = temp;
    
    setWaitlistedEnrollments(newEnrollments);
    
    // TODO: Update waitlist order in the backend
    updateWaitlistOrder(newEnrollments);
  };

  const updateWaitlistOrder = async (enrollments: Enrollment[]) => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/classes/${classId}/waitlist-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentIds: enrollments.map(e => e.id)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update waitlist order');
      }
    } catch (err) {
      console.error('Error updating waitlist order:', err);
      setError('Failed to update waitlist order. The displayed order may not be saved.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewStudentInfo = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setStudentInfoDialogOpen(true);
  };

  const handleCloseStudentInfoDialog = () => {
    setStudentInfoDialogOpen(false);
    setSelectedEnrollment(null);
  };

  const handleCloseActionDialog = () => {
    setActionDialogOpen(false);
    setSelectedEnrollment(null);
    setActionType('approve');
  };

  const handleConfirmAction = async () => {
    if (!selectedEnrollment) return;
    
    try {
      setActionLoading(true);
      setActionError(null);
      setActionSuccess(null);
      
      let newStatus: EnrollmentStatus;
      
      if (actionType === 'approve') {
        newStatus = EnrollmentStatus.ENROLLED;
      } else if (actionType === 'reject') {
        newStatus = EnrollmentStatus.DROPPED;
      } else {
        throw new Error('Invalid action type');
      }
      
      const response = await fetch(`/api/enrollments/${selectedEnrollment.id}`, {
        method: 'PUT',
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
      
      // Remove from waitlist
      setWaitlistedEnrollments(waitlistedEnrollments.filter(e => e.id !== data.id));
      
      // Update class details if approving
      if (actionType === 'approve' && classDetails) {
        setClassDetails({
          ...classDetails,
          enrolledCount: classDetails.enrolledCount + 1,
          waitlistCount: classDetails.waitlistCount - 1
        });
      } else if (actionType === 'reject' && classDetails) {
        setClassDetails({
          ...classDetails,
          waitlistCount: classDetails.waitlistCount - 1
        });
      }
      
      setActionSuccess(`Successfully ${actionType === 'approve' ? 'approved' : 'rejected'} enrollment!`);
      
      // Close dialog after a short delay
      setTimeout(() => {
        setActionDialogOpen(false);
        setSelectedEnrollment(null);
        setActionType('approve');
      }, 1500);
    } catch (err) {
      console.error('Error updating enrollment:', err);
      setActionError(err.message || 'An error occurred while updating the enrollment.');
    } finally {
      setActionLoading(false);
    }
  };

  const isClassFull = () => {
    if (!classDetails) return true;
    return classDetails.enrolledCount >= classDetails.capacity;
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {actionSuccess && <Alert severity="success" sx={{ mb: 3 }}>{actionSuccess}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Class Information
                  </Typography>
                  {classDetails ? (
                    <>
                      <Typography variant="body1">
                        {classDetails.course?.code}: {classDetails.course?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Section {classDetails.section}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" gutterBottom>
                        <strong>Instructor:</strong> {classDetails.teacher ? 
                          `${classDetails.teacher.firstName} ${classDetails.teacher.lastName}` : 
                          'Not Assigned'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Enrollment:</strong> {classDetails.enrolledCount}/{classDetails.capacity}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Waitlist:</strong> {classDetails.waitlistCount} students
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> {isClassFull() ? 
                          <Chip label="Full" color="error" size="small" /> : 
                          <Chip label="Open" color="success" size="small" />}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Class information not available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Waitlist Management
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Manage the waitlist for this class by approving or rejecting students, or by reordering the waitlist.
                  </Typography>
                  <Alert severity="info">
                    {isClassFull() ? 
                      'This class is currently full. Approving a student will exceed the class capacity.' : 
                      'This class has available seats. You can approve students from the waitlist.'}
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {waitlistedEnrollments.length === 0 ? (
            <Alert severity="info">
              No students on the waitlist for this class.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="waitlist table">
                <TableHead>
                  <TableRow>
                    <TableCell width="5%"><strong>Position</strong></TableCell>
                    <TableCell><strong>Student</strong></TableCell>
                    <TableCell><strong>Grade</strong></TableCell>
                    <TableCell><strong>Waitlist Date</strong></TableCell>
                    <TableCell><strong>Prerequisites</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {waitlistedEnrollments.map((enrollment, index) => (
                    <TableRow key={enrollment.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2">
                            {index + 1}
                          </Typography>
                          <Box sx={{ ml: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                            >
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleMoveDown(index)}
                              disabled={index === waitlistedEnrollments.length - 1}
                            >
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {enrollment.student ? (
                          <>
                            <Typography variant="body2">
                              {enrollment.student.firstName} {enrollment.student.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {enrollment.student.email}
                            </Typography>
                          </>
                        ) : (
                          'Unknown Student'
                        )}
                      </TableCell>
                      <TableCell>
                        {enrollment.student?.gradeLevel ? 
                          `Grade ${enrollment.student.gradeLevel}` : 
                          'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {enrollment.prerequisitesMet ? (
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Met" 
                            color="success" 
                            size="small" 
                          />
                        ) : (
                          <Chip 
                            icon={<CancelIcon />} 
                            label="Not Met" 
                            color="error" 
                            size="small" 
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="View Student Info">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewStudentInfo(enrollment)}
                              color="primary"
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Button 
                            size="small" 
                            color="primary" 
                            onClick={() => handleApproveClick(enrollment)}
                            disabled={actionLoading}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => handleRejectClick(enrollment)}
                            disabled={actionLoading}
                          >
                            Reject
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <Dialog
            open={actionDialogOpen}
            onClose={handleCloseActionDialog}
            aria-labelledby="action-dialog-title"
            aria-describedby="action-dialog-description"
          >
            <DialogTitle id="action-dialog-title">
              {actionType === 'approve' ? 'Approve Enrollment' : 'Reject Enrollment'}
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
                {actionType === 'approve' ? (
                  <>
                    Are you sure you want to approve this student's enrollment?
                    {isClassFull() && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        This class is currently full. Approving this student will exceed the class capacity.
                      </Alert>
                    )}
                  </>
                ) : (
                  <>
                    Are you sure you want to reject this student's enrollment?
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      This action will remove the student from the waitlist.
                    </Alert>
                  </>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Student:</strong> {selectedEnrollment?.student ? 
                      `${selectedEnrollment.student.firstName} ${selectedEnrollment.student.lastName}` : 
                      'Unknown Student'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Class:</strong> {classDetails?.course ? 
                      `${classDetails.course.code}: ${classDetails.course.name} - Section ${classDetails.section}` : 
                      'Unknown Class'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Waitlist Date:</strong> {selectedEnrollment ? 
                      new Date(selectedEnrollment.enrollmentDate).toLocaleDateString() : 
                      'Unknown'}
                  </Typography>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseActionDialog} disabled={actionLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmAction} 
                color={actionType === 'approve' ? 'primary' : 'error'} 
                disabled={actionLoading || actionSuccess !== null}
                startIcon={actionLoading ? <CircularProgress size={20} /> : null}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogActions>
          </Dialog>
          
          <Dialog
            open={studentInfoDialogOpen}
            onClose={handleCloseStudentInfoDialog}
            aria-labelledby="student-info-dialog-title"
            maxWidth="md"
            fullWidth
          >
            <DialogTitle id="student-info-dialog-title">
              Student Information
            </DialogTitle>
            <DialogContent>
              {selectedEnrollment?.student ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Personal Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Name:</strong> {selectedEnrollment.student.firstName} {selectedEnrollment.student.lastName}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Email:</strong> {selectedEnrollment.student.email}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Grade Level:</strong> {selectedEnrollment.student.gradeLevel ? 
                        `Grade ${selectedEnrollment.student.gradeLevel}` : 
                        'N/A'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Date of Birth:</strong> {selectedEnrollment.student.dateOfBirth ? 
                        new Date(selectedEnrollment.student.dateOfBirth).toLocaleDateString() : 
                        'N/A'}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Guardian Information
                    </Typography>
                    {selectedEnrollment.student.guardianFirstName ? (
                      <>
                        <Typography variant="body2" gutterBottom>
                          <strong>Name:</strong> {selectedEnrollment.student.guardianFirstName} {selectedEnrollment.student.guardianLastName}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Email:</strong> {selectedEnrollment.student.guardianEmail || 'N/A'}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Phone:</strong> {selectedEnrollment.student.guardianPhone || 'N/A'}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No guardian information available
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Academic Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Prerequisites Met:</strong> {selectedEnrollment.prerequisitesMet ? 
                        <Chip label="Yes" color="success" size="small" /> : 
                        <Chip label="No" color="error" size="small" />}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Current Enrollments:</strong>
                    </Typography>
                    {selectedEnrollment.student.currentEnrollments && 
                     selectedEnrollment.student.currentEnrollments.length > 0 ? (
                      <List dense>
                        {selectedEnrollment.student.currentEnrollments.map((enrollment, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemText 
                              primary={`${enrollment.class?.course?.code || 'Unknown'}: ${enrollment.class?.course?.name || 'Unknown'}`} 
                              secondary={`Section ${enrollment.class?.section || 'Unknown'}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No current enrollments
                      </Typography>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Waitlist Information
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Waitlist Date:</strong> {new Date(selectedEnrollment.enrollmentDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Waitlist Position:</strong> {waitlistedEnrollments.findIndex(e => e.id === selectedEnrollment.id) + 1} of {waitlistedEnrollments.length}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Other Waitlists:</strong>
                    </Typography>
                    {selectedEnrollment.student.waitlistedClasses && 
                     selectedEnrollment.student.waitlistedClasses.length > 0 ? (
                      <List dense>
                        {selectedEnrollment.student.waitlistedClasses
                          .filter(wc => wc.classId !== classId)
                          .map((waitlist, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemText 
                              primary={`${waitlist.class?.course?.code || 'Unknown'}: ${waitlist.class?.course?.name || 'Unknown'}`} 
                              secondary={`Section ${waitlist.class?.section || 'Unknown'}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No other waitlists
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Student information not available
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseStudentInfoDialog}>
                Close
              </Button>
              <Button 
                color="primary" 
                onClick={() => {
                  handleCloseStudentInfoDialog();
                  if (selectedEnrollment) {
                    handleApproveClick(selectedEnrollment);
                  }
                }}
              >
                Approve Enrollment
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default WaitlistManagement;

