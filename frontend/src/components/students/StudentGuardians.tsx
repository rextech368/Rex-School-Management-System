import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
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
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { Student } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';

interface StudentGuardiansProps {
  student: Student;
}

interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  email: string;
  phone: string;
  address: string;
  isPrimary: boolean;
}

const StudentGuardians: React.FC<StudentGuardiansProps> = ({ student }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    relationship: '',
    email: '',
    phone: '',
    address: '',
    isPrimary: false
  });
  const { user } = useAuth();
  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch this data from the API
        // const response = await fetch(`/api/students/${student.id}/guardians`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch guardians');
        // }
        // const data = await response.json();
        // setGuardians(data);
        
        // For demo purposes, create a guardian from student data if available
        const guardiansList: Guardian[] = [];
        
        if (student.guardianFirstName) {
          guardiansList.push({
            id: '1',
            firstName: student.guardianFirstName,
            lastName: student.guardianLastName || '',
            relationship: student.guardianRelationship || 'Parent',
            email: student.guardianEmail || '',
            phone: student.guardianPhone || '',
            address: student.guardianAddress || student.address || '',
            isPrimary: true
          });
        }
        
        // Add a second guardian for demo purposes
        if (guardiansList.length > 0) {
          guardiansList.push({
            id: '2',
            firstName: 'Secondary',
            lastName: 'Guardian',
            relationship: 'Grandparent',
            email: 'secondary.guardian@example.com',
            phone: '555-987-6543',
            address: '456 Other St, Anytown, USA',
            isPrimary: false
          });
        }
        
        setGuardians(guardiansList);
      } catch (err) {
        console.error('Error fetching guardians:', err);
        setError('Failed to load guardians. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuardians();
  }, [student]);

  const handleAddGuardian = () => {
    setEditingGuardian(null);
    setFormData({
      firstName: '',
      lastName: '',
      relationship: '',
      email: '',
      phone: '',
      address: student.address || '',
      isPrimary: guardians.length === 0 // Make primary if it's the first guardian
    });
    setDialogOpen(true);
  };

  const handleEditGuardian = (guardian: Guardian) => {
    setEditingGuardian(guardian);
    setFormData({
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      relationship: guardian.relationship,
      email: guardian.email,
      phone: guardian.phone,
      address: guardian.address,
      isPrimary: guardian.isPrimary
    });
    setDialogOpen(true);
  };

  const handleDeleteGuardian = async (guardianId: string) => {
    if (!confirm('Are you sure you want to remove this guardian? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real application, you would call the API to delete the guardian
      // const response = await fetch(`/api/students/${student.id}/guardians/${guardianId}`, {
      //   method: 'DELETE',
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete guardian');
      // }
      
      // For demo purposes, just remove from the local state
      setGuardians(guardians.filter(g => g.id !== guardianId));
    } catch (err) {
      console.error('Error deleting guardian:', err);
      setError('Failed to delete guardian. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSaveGuardian = async () => {
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        setLoading(false);
        return;
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Invalid email format');
        setLoading(false);
        return;
      }
      
      // In a real application, you would call the API to save the guardian
      // const url = editingGuardian 
      //   ? `/api/students/${student.id}/guardians/${editingGuardian.id}`
      //   : `/api/students/${student.id}/guardians`;
      // const method = editingGuardian ? 'PUT' : 'POST';
      
      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error(`Failed to ${editingGuardian ? 'update' : 'add'} guardian`);
      // }
      
      // const savedGuardian = await response.json();
      
      // For demo purposes, just update the local state
      if (editingGuardian) {
        setGuardians(guardians.map(g => 
          g.id === editingGuardian.id 
            ? { ...formData, id: editingGuardian.id } as Guardian
            : formData.isPrimary && g.isPrimary ? { ...g, isPrimary: false } : g
        ));
      } else {
        const newGuardian: Guardian = {
          ...formData,
          id: Date.now().toString() // Generate a temporary ID
        };
        
        if (formData.isPrimary) {
          // If the new guardian is primary, make sure no other guardian is primary
          setGuardians([
            ...guardians.map(g => ({ ...g, isPrimary: false })),
            newGuardian
          ]);
        } else {
          setGuardians([...guardians, newGuardian]);
        }
      }
      
      setDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error saving guardian:', err);
      setError(`Failed to ${editingGuardian ? 'update' : 'add'} guardian. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Guardians & Emergency Contacts
        </Typography>
        {isAdmin && (
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={handleAddGuardian}
          >
            Add Guardian
          </Button>
        )}
      </Box>
      
      {loading && guardians.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : guardians.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No guardians or emergency contacts have been added for this student.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {guardians.map((guardian) => (
            <Grid item xs={12} md={6} key={guardian.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: guardian.isPrimary ? 'primary.main' : 'secondary.main',
                        mr: 2
                      }}
                    >
                      <FamilyRestroomIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {guardian.firstName} {guardian.lastName}
                        {guardian.isPrimary && (
                          <Chip 
                            label="Primary" 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {guardian.relationship}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="body2" gutterBottom>
                    <strong>Email:</strong> {guardian.email || 'Not provided'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Phone:</strong> {guardian.phone || 'Not provided'}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Address:</strong> {guardian.address || 'Not provided'}
                  </Typography>
                </CardContent>
                {isAdmin && (
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => handleEditGuardian(guardian)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteGuardian(guardian.id)}
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
      
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingGuardian ? 'Edit Guardian' : 'Add Guardian'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            {editingGuardian 
              ? 'Update the guardian information below.'
              : 'Enter the guardian information below. This person will be able to access student information and be contacted in case of emergency.'}
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="relationship-label">Relationship</InputLabel>
                <Select
                  labelId="relationship-label"
                  name="relationship"
                  value={formData.relationship}
                  label="Relationship"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Parent">Parent</MenuItem>
                  <MenuItem value="Guardian">Guardian</MenuItem>
                  <MenuItem value="Grandparent">Grandparent</MenuItem>
                  <MenuItem value="Sibling">Sibling</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="primary-label">Primary Guardian</InputLabel>
                <Select
                  labelId="primary-label"
                  name="isPrimary"
                  value={formData.isPrimary}
                  label="Primary Guardian"
                  onChange={handleInputChange}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveGuardian} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentGuardians;

