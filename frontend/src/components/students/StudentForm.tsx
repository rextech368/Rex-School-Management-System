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
  AccordionDetails
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Student } from '@/lib/types';

interface StudentFormProps {
  onSubmit: (studentData: any) => void;
  loading?: boolean;
  submitButtonId?: string;
  initialData?: Student;
}

const StudentForm: React.FC<StudentFormProps> = ({
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
  
  // Academic Information
  const [studentId, setStudentId] = useState(initialData?.studentId || '');
  const [gradeLevel, setGradeLevel] = useState<number | ''>(initialData?.gradeLevel || '');
  const [enrollmentDate, setEnrollmentDate] = useState<Date | null>(initialData?.enrollmentDate ? new Date(initialData.enrollmentDate) : null);
  const [status, setStatus] = useState(initialData?.status || 'Active');
  
  // Guardian Information
  const [guardianFirstName, setGuardianFirstName] = useState(initialData?.guardianFirstName || '');
  const [guardianLastName, setGuardianLastName] = useState(initialData?.guardianLastName || '');
  const [guardianEmail, setGuardianEmail] = useState(initialData?.guardianEmail || '');
  const [guardianPhone, setGuardianPhone] = useState(initialData?.guardianPhone || '');
  const [guardianRelationship, setGuardianRelationship] = useState(initialData?.guardianRelationship || '');
  const [guardianAddress, setGuardianAddress] = useState(initialData?.guardianAddress || '');
  const [sameAsStudent, setSameAsStudent] = useState(false);
  
  // Additional Information
  const [emergencyContactName, setEmergencyContactName] = useState(initialData?.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialData?.emergencyContactPhone || '');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState(initialData?.emergencyContactRelationship || '');
  const [medicalInformation, setMedicalInformation] = useState(initialData?.medicalInformation || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update guardian address when sameAsStudent changes
  useEffect(() => {
    if (sameAsStudent) {
      setGuardianAddress(address);
    }
  }, [sameAsStudent, address]);

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
    
    if (guardianEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail)) {
      newErrors.guardianEmail = 'Invalid email format';
    }
    
    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number should be 10 digits';
    }
    
    if (guardianPhone && !/^\d{10}$/.test(guardianPhone.replace(/\D/g, ''))) {
      newErrors.guardianPhone = 'Phone number should be 10 digits';
    }
    
    if (emergencyContactPhone && !/^\d{10}$/.test(emergencyContactPhone.replace(/\D/g, ''))) {
      newErrors.emergencyContactPhone = 'Phone number should be 10 digits';
    }
    
    if (dateOfBirth) {
      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      if (age < 4 || age > 22) {
        newErrors.dateOfBirth = 'Student age should be between 4 and 22 years';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const studentData = {
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
      studentId,
      gradeLevel,
      enrollmentDate,
      status,
      guardianFirstName,
      guardianLastName,
      guardianEmail,
      guardianPhone,
      guardianRelationship,
      guardianAddress,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      medicalInformation,
      notes
    };
    
    onSubmit(studentData);
  };

  const generateStudentId = () => {
    // Generate a student ID based on name and current date
    const year = new Date().getFullYear().toString().slice(-2);
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    
    setStudentId(`${year}${firstInitial}${lastInitial}${randomDigits}`);
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
              Academic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={generateStudentId}
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
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="grade-level-label">Grade Level</InputLabel>
              <Select
                labelId="grade-level-label"
                value={gradeLevel}
                label="Grade Level"
                onChange={(e) => setGradeLevel(e.target.value as number | '')}
              >
                <MenuItem value="">Not Assigned</MenuItem>
                {[...Array(12)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Grade {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Enrollment Date"
              value={enrollmentDate}
              onChange={(newValue) => setEnrollmentDate(newValue)}
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
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Graduated">Graduated</MenuItem>
                <MenuItem value="Transferred">Transferred</MenuItem>
                <MenuItem value="Withdrawn">Withdrawn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Guardian Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guardian First Name"
              value={guardianFirstName}
              onChange={(e) => setGuardianFirstName(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guardian Last Name"
              value={guardianLastName}
              onChange={(e) => setGuardianLastName(e.target.value)}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guardian Email"
              type="email"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              error={!!errors.guardianEmail}
              helperText={errors.guardianEmail}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guardian Phone"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              error={!!errors.guardianPhone}
              helperText={errors.guardianPhone}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel id="guardian-relationship-label">Relationship</InputLabel>
              <Select
                labelId="guardian-relationship-label"
                value={guardianRelationship}
                label="Relationship"
                onChange={(e) => setGuardianRelationship(e.target.value)}
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
            <FormControlLabel
              control={
                <Switch
                  checked={sameAsStudent}
                  onChange={(e) => setSameAsStudent(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Same address as student"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Guardian Address"
              value={guardianAddress}
              onChange={(e) => setGuardianAddress(e.target.value)}
              disabled={loading || sameAsStudent}
            />
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
                      Medical Information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Medical Information"
                      value={medicalInformation}
                      onChange={(e) => setMedicalInformation(e.target.value)}
                      multiline
                      rows={3}
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
                ) : initialData ? 'Update Student' : 'Create Student'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default StudentForm;

