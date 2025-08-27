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
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { Teacher } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';

interface TeacherQualificationsProps {
  teacher: Teacher;
}

interface Qualification {
  id: string;
  type: 'education' | 'certification' | 'specialization';
  title: string;
  institution?: string;
  date?: string;
  description?: string;
}

const TeacherQualifications: React.FC<TeacherQualificationsProps> = ({ teacher }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [qualificationType, setQualificationType] = useState<'education' | 'certification' | 'specialization'>('education');
  const [qualificationTitle, setQualificationTitle] = useState('');
  const [qualificationInstitution, setQualificationInstitution] = useState('');
  const [qualificationDate, setQualificationDate] = useState('');
  const [qualificationDescription, setQualificationDescription] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isOwnProfile = user?.role === Role.TEACHER && user?.id === teacher.id;

  // Convert string arrays to qualification objects for better display
  const educationQualifications: Qualification[] = (teacher.education || []).map((edu, index) => ({
    id: `edu-${index}`,
    type: 'education',
    title: edu
  }));

  const certificationQualifications: Qualification[] = (teacher.certifications || []).map((cert, index) => ({
    id: `cert-${index}`,
    type: 'certification',
    title: cert
  }));

  const specializationQualifications: Qualification[] = (teacher.specializations || []).map((spec, index) => ({
    id: `spec-${index}`,
    type: 'specialization',
    title: spec
  }));

  const handleOpenDialog = (type: 'education' | 'certification' | 'specialization') => {
    setQualificationType(type);
    setQualificationTitle('');
    setQualificationInstitution('');
    setQualificationDate('');
    setQualificationDescription('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAddQualification = async () => {
    if (!qualificationTitle.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you would call the API to add the qualification
      // const response = await fetch(`/api/teachers/${teacher.id}/qualifications`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     type: qualificationType,
      //     title: qualificationTitle,
      //     institution: qualificationInstitution,
      //     date: qualificationDate,
      //     description: qualificationDescription
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to add qualification');
      // }
      
      setSuccess(`${qualificationType.charAt(0).toUpperCase() + qualificationType.slice(1)} added successfully!`);
      setDialogOpen(false);
      
      // Refresh the teacher data
      // const updatedTeacher = await response.json();
      // setTeacher(updatedTeacher);
    } catch (err) {
      console.error('Error adding qualification:', err);
      setError(err.message || 'An error occurred while adding the qualification.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQualification = async (qualification: Qualification) => {
    if (!confirm(`Are you sure you want to delete this ${qualification.type}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real application, you would call the API to delete the qualification
      // const response = await fetch(`/api/teachers/${teacher.id}/qualifications/${qualification.id}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete qualification');
      // }
      
      setSuccess(`${qualification.type.charAt(0).toUpperCase() + qualification.type.slice(1)} deleted successfully!`);
      
      // Refresh the teacher data
      // const updatedTeacher = await response.json();
      // setTeacher(updatedTeacher);
    } catch (err) {
      console.error('Error deleting qualification:', err);
      setError(err.message || 'An error occurred while deleting the qualification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Education
            </Typography>
            {(isAdmin || isOwnProfile) && (
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('education')}
              >
                Add Education
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {educationQualifications.length === 0 ? (
            <Alert severity="info">
              No education qualifications have been added.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {educationQualifications.map((qualification) => (
                <Grid item xs={12} md={6} key={qualification.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {qualification.title}
                        </Typography>
                      </Box>
                      {qualification.institution && (
                        <Typography variant="body2" color="text.secondary">
                          Institution: {qualification.institution}
                        </Typography>
                      )}
                      {qualification.date && (
                        <Typography variant="body2" color="text.secondary">
                          Date: {qualification.date}
                        </Typography>
                      )}
                      {qualification.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {qualification.description}
                        </Typography>
                      )}
                    </CardContent>
                    {(isAdmin || isOwnProfile) && (
                      <CardActions>
                        <Button 
                          size="small" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteQualification(qualification)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 3 }}>
            <Typography variant="h6">
              Certifications
            </Typography>
            {(isAdmin || isOwnProfile) && (
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('certification')}
              >
                Add Certification
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {certificationQualifications.length === 0 ? (
            <Alert severity="info">
              No certifications have been added.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {certificationQualifications.map((qualification) => (
                <Grid item xs={12} md={6} key={qualification.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {qualification.title}
                        </Typography>
                      </Box>
                      {qualification.institution && (
                        <Typography variant="body2" color="text.secondary">
                          Issuing Organization: {qualification.institution}
                        </Typography>
                      )}
                      {qualification.date && (
                        <Typography variant="body2" color="text.secondary">
                          Date: {qualification.date}
                        </Typography>
                      )}
                      {qualification.description && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {qualification.description}
                        </Typography>
                      )}
                    </CardContent>
                    {(isAdmin || isOwnProfile) && (
                      <CardActions>
                        <Button 
                          size="small" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteQualification(qualification)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 3 }}>
            <Typography variant="h6">
              Specializations
            </Typography>
            {(isAdmin || isOwnProfile) && (
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('specialization')}
              >
                Add Specialization
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {specializationQualifications.length === 0 ? (
            <Alert severity="info">
              No specializations have been added.
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {specializationQualifications.map((qualification) => (
                <Chip 
                  key={qualification.id} 
                  label={qualification.title} 
                  color="primary"
                  onDelete={(isAdmin || isOwnProfile) ? () => handleDeleteQualification(qualification) : undefined}
                />
              ))}
            </Box>
          )}
        </Grid>
      </Grid>
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add {qualificationType.charAt(0).toUpperCase() + qualificationType.slice(1)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details of the {qualificationType} you want to add.
          </DialogContentText>
          
          <TextField
            fullWidth
            label={`${qualificationType.charAt(0).toUpperCase() + qualificationType.slice(1)} Title`}
            value={qualificationTitle}
            onChange={(e) => setQualificationTitle(e.target.value)}
            required
            margin="normal"
          />
          
          {qualificationType !== 'specialization' && (
            <>
              <TextField
                fullWidth
                label={qualificationType === 'education' ? 'Institution' : 'Issuing Organization'}
                value={qualificationInstitution}
                onChange={(e) => setQualificationInstitution(e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Date"
                value={qualificationDate}
                onChange={(e) => setQualificationDate(e.target.value)}
                placeholder={qualificationType === 'education' ? 'e.g., 2015-2019' : 'e.g., June 2020'}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Description"
                value={qualificationDescription}
                onChange={(e) => setQualificationDescription(e.target.value)}
                multiline
                rows={3}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddQualification} 
            variant="contained"
            disabled={loading || !qualificationTitle.trim()}
          >
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherQualifications;

