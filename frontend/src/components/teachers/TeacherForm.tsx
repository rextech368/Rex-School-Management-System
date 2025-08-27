import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Typography,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { Teacher } from '@/lib/types';

interface TeacherFormProps {
  onSubmit: (teacherData: any) => void;
  loading?: boolean;
  submitButtonId?: string;
  initialData?: Teacher;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
  onSubmit,
  loading = false,
  submitButtonId,
  initialData
}) => {
  // Personal Information
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [middleName, setMiddleName] = useState(initialData?.middleName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(initialData?.dateOfBirth ? new Date(initialData.dateOfBirth) : null);
  const [gender, setGender] = useState(initialData?.gender || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [state, setState] = useState(initialData?.state || '');
  const [zipCode, setZipCode] = useState(initialData?.zipCode || '');
  const [country, setCountry] = useState(initialData?.country || 'United States');
  
  // Professional Information
  const [teacherId, setTeacherId] = useState(initialData?.teacherId || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [position, setPosition] = useState(initialData?.position || 'Teacher');
  const [hireDate, setHireDate] = useState<Date | null>(initialData?.hireDate ? new Date(initialData.hireDate) : null);
  const [status, setStatus] = useState(initialData?.status || 'Active');
  const [office, setOffice] = useState(initialData?.office || '');
  const [officeHours, setOfficeHours] = useState(initialData?.officeHours || '');
  
  // Qualifications
  const [education, setEducation] = useState<string[]>(initialData?.education || []);
  const [certifications, setCertifications] = useState<string[]>(initialData?.certifications || []);
  const [specializations, setSpecializations] = useState<string[]>(initialData?.specializations || []);
  const [newEducation, setNewEducation] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  
  // Additional Information
  const [emergencyContactName, setEmergencyContactName] = useState(initialData?.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData?.emergencyContactPhone || '');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(initialData?.emergencyContactRelationship || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    
    if (emergencyContactPhone && !/^\d{10}$/.test(emergencyContactPhone.replace(/\D/g, ''))) {
      newErrors.emergencyContactPhone = 'Phone number should be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const teacherData = {
      firstName,
      lastName,
      middleName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      country,
      teacherId,
      department,
      position,
      hireDate,
      status,
      office,
      officeHours,
      education,
      certifications,
      specializations,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      notes
    };
    
    onSubmit(teacherData);
  };

  const generateTeacherId = () => {
    // Generate a teacher ID based on name and current date
    const year = new Date().getFullYear().toString().slice(-2);
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    
    setTeacherId(`T${year}${firstInitial}${lastInitial}${randomDigits}`);
  };

  const handleAddEducation = () => {
    if (newEducation.trim()) {
      setEducation([...education, newEducation.trim()]);
      setNewEducation('');
    }
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim()) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleRemoveSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(newValue) => setDateOfBirth(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth,
                  disabled: loading
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="Gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Non-Binary">Non-Binary</MenuItem>
                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="State/Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="ZIP/Postal Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Professional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teacher ID"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={generateTeacherId}
                    disabled={loading}
                    size="small"
                  >
                    Generate
                  </Button>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Hire Date"
              value={hireDate}
              onChange={(newValue) => setHireDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  disabled: loading
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
                <MenuItem value="Terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Office"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Office Hours"
              value={officeHours}
              onChange={(e) => setOfficeHours(e.target.value)}
              placeholder="e.g., Monday 10:00 AM - 12:00 PM, Wednesday 2:00 PM - 4:00 PM"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Qualifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Education
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {education.map((edu, index) => (
                <Chip 
                  key={index} 
                  label={edu} 
                  onDelete={() => handleRemoveEducation(index)}
                  color="primary"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Education"
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
                placeholder="e.g., M.Ed. in Mathematics Education, Harvard University"
                disabled={loading}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddEducation}
                disabled={loading || !newEducation.trim()}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Certifications
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {certifications.map((cert, index) => (
                <Chip 
                  key={index} 
                  label={cert} 
                  onDelete={() => handleRemoveCertification(index)}
                  color="secondary"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Certification"
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="e.g., State Teaching License, Advanced Placement Certification"
                disabled={loading}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddCertification}
                disabled={loading || !newCertification.trim()}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Specializations
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {specializations.map((spec, index) => (
                <Chip 
                  key={index} 
                  label={spec} 
                  onDelete={() => handleRemoveSpecialization(index)}
                  color="info"
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Add Specialization"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="e.g., Calculus, Physics, Special Education"
                disabled={loading}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddSpecialization}
                disabled={loading || !newSpecialization.trim()}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Additional Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Emergency Contact
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Emergency Contact Name"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Emergency Contact Phone"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      error={!!errors.emergencyContactPhone}
                      helperText={errors.emergencyContactPhone}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Emergency Contact Relationship"
                      value={emergencyContactRelationship}
                      onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                      Notes
                    </Typography>
                    <TextField
                      fullWidth
                      label="Additional Notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      multiline
                      rows={3}
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                id={submitButtonId}
                sx={{ display: 'none' }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : initialData ? 'Update Teacher' : 'Create Teacher'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default TeacherForm;

