import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { Student } from '@/lib/types';

interface StudentDetailProps {
  student: Student;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 2,
                bgcolor: student.profileColor || 'primary.main',
                fontSize: '3rem'
              }}
            >
              {student.firstName[0]}{student.lastName[0]}
            </Avatar>
            <Typography variant="h6" align="center">
              {student.firstName} {student.middleName ? student.middleName + ' ' : ''}{student.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {student.studentId || student.id}
            </Typography>
            {student.gradeLevel && (
              <Chip 
                label={`Grade ${student.gradeLevel}`} 
                color="primary" 
                sx={{ mt: 1 }}
              />
            )}
            {student.status && (
              <Chip 
                label={student.status} 
                color={student.status === 'Active' ? 'success' : 'default'} 
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Personal Information
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.firstName} {student.middleName ? student.middleName + ' ' : ''}{student.lastName}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Date of Birth
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Gender
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.gender || 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.email || 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.phone || 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.address || 'Not provided'}
                </Typography>
                {(student.city || student.state || student.zipCode) && (
                  <Typography variant="body1">
                    {[
                      student.city,
                      student.state,
                      student.zipCode
                    ].filter(Boolean).join(', ')}
                  </Typography>
                )}
                <Typography variant="body1">
                  {student.country || ''}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Emergency Contact
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {student.emergencyContactName ? (
                  <>
                    <Typography variant="body1">
                      {student.emergencyContactName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.emergencyContactPhone || 'No phone provided'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.emergencyContactRelationship ? `Relationship: ${student.emergencyContactRelationship}` : ''}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1">
                    Not provided
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Medical Information
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.medicalInformation || 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  Notes
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {student.notes || 'No additional notes'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDetail;

