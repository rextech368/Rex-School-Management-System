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
import { Term, TermType } from '@/lib/types';

interface TermFormProps {
  onSubmit: (termData: any) => void;
  loading?: boolean;
  submitButtonId?: string;
  initialData?: Term;
}

const TermForm: React.FC<TermFormProps> = ({
  onSubmit,
  loading = false,
  submitButtonId,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [type, setType] = useState<TermType>(initialData?.type || TermType.SEMESTER);
  const [startDate, setStartDate] = useState<Date | null>(initialData?.startDate ? new Date(initialData.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(initialData?.endDate ? new Date(initialData.endDate) : null);
  const [registrationStart, setRegistrationStart] = useState<Date | null>(
    initialData?.registrationStart ? new Date(initialData.registrationStart) : null
  );
  const [registrationEnd, setRegistrationEnd] = useState<Date | null>(
    initialData?.registrationEnd ? new Date(initialData.registrationEnd) : null
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isCurrent, setIsCurrent] = useState(initialData?.isCurrent ?? false);
  const [description, setDescription] = useState(initialData?.description || '');
  const [academicYear, setAcademicYear] = useState(initialData?.academicYear || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Term name is required';
    }
    
    if (!code.trim()) {
      newErrors.code = 'Term code is required';
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && endDate && endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (registrationStart && registrationEnd && registrationEnd <= registrationStart) {
      newErrors.registrationEnd = 'Registration end date must be after registration start date';
    }
    
    if (registrationStart && startDate && registrationStart > startDate) {
      newErrors.registrationStart = 'Registration start date should be before term start date';
    }
    
    if (registrationEnd && startDate && registrationEnd > startDate) {
      newErrors.registrationEnd = 'Registration end date should be before term start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const termData = {
      name,
      code,
      type,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      isActive,
      isCurrent,
      description,
      academicYear
    };
    
    onSubmit(termData);
  };

  const generateTermCode = () => {
    if (!startDate) return;
    
    const year = startDate.getFullYear();
    let seasonCode = '';
    
    const month = startDate.getMonth();
    
    if (month >= 0 && month <= 4) {
      // Spring: January - May
      seasonCode = 'SP';
    } else if (month >= 5 && month <= 7) {
      // Summer: June - August
      seasonCode = 'SU';
    } else {
      // Fall: September - December
      seasonCode = 'FA';
    }
    
    setCode(`${seasonCode}${year}`);
  };

  const generateAcademicYear = () => {
    if (!startDate) return;
    
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    
    // If the term starts in the second half of the year (July-December),
    // the academic year is typically that year and the next
    if (month >= 6) {
      setAcademicYear(`${year}-${year + 1}`);
    } else {
      // Otherwise, it's the previous year and the current year
      setAcademicYear(`${year - 1}-${year}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Term Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name || 'e.g., Fall 2023, Spring 2024'}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Term Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={!!errors.code}
              helperText={errors.code || 'e.g., FA2023, SP2024'}
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={generateTermCode}
                    disabled={!startDate || loading}
                    size="small"
                  >
                    Generate
                  </Button>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required disabled={loading}>
              <InputLabel id="term-type-label">Term Type</InputLabel>
              <Select
                labelId="term-type-label"
                value={type}
                label="Term Type"
                onChange={(e) => setType(e.target.value as TermType)}
              >
                <MenuItem value={TermType.SEMESTER}>Semester</MenuItem>
                <MenuItem value={TermType.QUARTER}>Quarter</MenuItem>
                <MenuItem value={TermType.TRIMESTER}>Trimester</MenuItem>
                <MenuItem value={TermType.SUMMER}>Summer</MenuItem>
                <MenuItem value={TermType.WINTER}>Winter</MenuItem>
                <MenuItem value={TermType.YEAR}>Full Year</MenuItem>
              </Select>
              <FormHelperText>Select the type of academic term</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Academic Year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              helperText="e.g., 2023-2024"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={generateAcademicYear}
                    disabled={!startDate || loading}
                    size="small"
                  >
                    Generate
                  </Button>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Term Dates
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Start Date *"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                  disabled: loading
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="End Date *"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.endDate,
                  helperText: errors.endDate,
                  disabled: loading
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Registration Period
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Registration Start Date"
              value={registrationStart}
              onChange={(newValue) => setRegistrationStart(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.registrationStart,
                  helperText: errors.registrationStart || 'When students can begin registering for classes',
                  disabled: loading
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Registration End Date"
              value={registrationEnd}
              onChange={(newValue) => setRegistrationEnd(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.registrationEnd,
                  helperText: errors.registrationEnd || 'When registration closes',
                  disabled: loading
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Term Settings
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Active Term"
            />
            <FormHelperText>
              Active terms are visible to users and can be selected for enrollment
            </FormHelperText>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Current Term"
            />
            <FormHelperText>
              The current term is the default selection in dropdowns and dashboards
            </FormHelperText>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              helperText="Optional description or notes about this term"
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Additional term settings can be configured after creating the term.
                </Alert>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Advanced settings include:
                </Typography>
                <ul>
                  <li>Add-drop deadlines</li>
                  <li>Grade submission periods</li>
                  <li>Term breaks and holidays</li>
                  <li>Custom academic calendar events</li>
                </ul>
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
                ) : initialData ? 'Update Term' : 'Create Term'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default TermForm;

