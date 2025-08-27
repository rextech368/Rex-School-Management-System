import React, { useState, useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Grid,
  Autocomplete,
  FormControlLabel,
  Switch,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PushPinIcon from '@mui/icons-material/PushPin';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, AnnouncementAudience } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

interface ClassOption {
  id: string;
  name: string;
  code: string;
}

interface GradeLevelOption {
  id: string;
  name: string;
}

const CreateAnnouncementPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<AnnouncementAudience>(AnnouncementAudience.ALL);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<ClassOption[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevelOption[]>([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<GradeLevelOption[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const canCreateAnnouncement = isAdmin || isTeacher;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch classes and grade levels from the API
        // const classesResponse = await fetch('/api/classes');
        // const gradeLevelsResponse = await fetch('/api/grade-levels');
        
        // if (!classesResponse.ok || !gradeLevelsResponse.ok) {
        //   throw new Error('Failed to fetch data');
        // }
        
        // const classesData = await classesResponse.json();
        // const gradeLevelsData = await gradeLevelsResponse.json();
        
        // setClasses(classesData);
        // setGradeLevels(gradeLevelsData);
        
        // For demo purposes, set mock data
        const mockClasses: ClassOption[] = [
          { id: '1', name: 'Algebra I', code: 'MATH101' },
          { id: '2', name: 'Biology', code: 'SCI101' },
          { id: '3', name: 'English Literature', code: 'ENG101' },
          { id: '4', name: 'World History', code: 'HIST101' },
          { id: '5', name: 'Physical Education', code: 'PE101' },
          { id: '6', name: 'Chemistry', code: 'SCI201' },
          { id: '7', name: 'Geometry', code: 'MATH201' },
          { id: '8', name: 'Spanish I', code: 'LANG101' },
          { id: '9', name: 'Art History', code: 'ART101' },
          { id: '10', name: 'Computer Science', code: 'CS101' }
        ];
        
        const mockGradeLevels: GradeLevelOption[] = [
          { id: '1', name: 'Grade 6' },
          { id: '2', name: 'Grade 7' },
          { id: '3', name: 'Grade 8' },
          { id: '4', name: 'Grade 9' },
          { id: '5', name: 'Grade 10' },
          { id: '6', name: 'Grade 11' },
          { id: '7', name: 'Grade 12' }
        ];
        
        setClasses(mockClasses);
        setGradeLevels(mockGradeLevels);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBack = () => {
    router.push('/announcements');
  };

  const handleTargetAudienceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTargetAudience(event.target.value as AnnouncementAudience);
    
    // Reset selected classes and grade levels when changing target audience
    setSelectedClasses([]);
    setSelectedGradeLevels([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter content.');
      return;
    }
    
    if (targetAudience === AnnouncementAudience.CLASSES && selectedClasses.length === 0) {
      setError('Please select at least one class.');
      return;
    }
    
    if (targetAudience === AnnouncementAudience.GRADE_LEVELS && selectedGradeLevels.length === 0) {
      setError('Please select at least one grade level.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the announcement to the API
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('content', content);
      // formData.append('targetAudience', targetAudience);
      
      // if (targetAudience === AnnouncementAudience.CLASSES) {
      //   formData.append('targetIds', JSON.stringify(selectedClasses.map(c => c.id)));
      // } else if (targetAudience === AnnouncementAudience.GRADE_LEVELS) {
      //   formData.append('targetIds', JSON.stringify(selectedGradeLevels.map(g => g.id)));
      // }
      
      // formData.append('isPinned', isPinned.toString());
      
      // if (expiryDate) {
      //   formData.append('expiresAt', new Date(expiryDate).toISOString());
      // }
      
      // files.forEach(file => formData.append('files', file));
      
      // const response = await fetch('/api/announcements', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to create announcement');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Announcement created successfully!');
      
      // Reset form
      setTitle('');
      setContent('');
      setTargetAudience(AnnouncementAudience.ALL);
      setSelectedClasses([]);
      setSelectedGradeLevels([]);
      setIsPinned(false);
      setExpiryDate('');
      setFiles([]);
      
      // Redirect to announcements page after a short delay
      setTimeout(() => {
        router.push('/announcements');
      }, 1500);
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Failed to create announcement. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
  };

  // Check if user has permission to create announcements
  if (!canCreateAnnouncement) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Announcements
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Create Announcement
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={submitting}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={10}
                  required
                  disabled={submitting}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="target-audience-label">Target Audience</InputLabel>
                  <Select
                    labelId="target-audience-label"
                    value={targetAudience}
                    label="Target Audience"
                    onChange={handleTargetAudienceChange}
                    disabled={submitting}
                  >
                    <MenuItem value={AnnouncementAudience.ALL}>All</MenuItem>
                    <MenuItem value={AnnouncementAudience.STAFF}>Staff</MenuItem>
                    <MenuItem value={AnnouncementAudience.TEACHERS}>Teachers</MenuItem>
                    <MenuItem value={AnnouncementAudience.STUDENTS}>Students</MenuItem>
                    <MenuItem value={AnnouncementAudience.PARENTS}>Parents</MenuItem>
                    <MenuItem value={AnnouncementAudience.CLASSES}>Specific Classes</MenuItem>
                    <MenuItem value={AnnouncementAudience.GRADE_LEVELS}>Specific Grade Levels</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (Optional)"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={submitting}
                />
              </Grid>
              
              {targetAudience === AnnouncementAudience.CLASSES && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="classes"
                    options={classes}
                    getOptionLabel={(option) => `${option.name} (${option.code})`}
                    value={selectedClasses}
                    onChange={(event, newValue) => {
                      setSelectedClasses(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Classes"
                        placeholder="Select classes"
                        required
                      />
                    )}
                    disabled={submitting}
                  />
                </Grid>
              )}
              
              {targetAudience === AnnouncementAudience.GRADE_LEVELS && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="grade-levels"
                    options={gradeLevels}
                    getOptionLabel={(option) => option.name}
                    value={selectedGradeLevels}
                    onChange={(event, newValue) => {
                      setSelectedGradeLevels(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Grade Levels"
                        placeholder="Select grade levels"
                        required
                      />
                    )}
                    disabled={submitting}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      color="primary"
                      disabled={submitting}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PushPinIcon sx={{ mr: 1 }} />
                      Pin this announcement
                    </Box>
                  }
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                  >
                    Attach Files
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    multiple
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    {files.length} {files.length === 1 ? 'file' : 'files'} attached
                  </Typography>
                </Box>
                
                {files.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Attachments:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {files.map((file, index) => (
                        <Chip
                          key={index}
                          label={`${file.name} (${formatFileSize(file.size)})`}
                          onDelete={() => handleRemoveFile(index)}
                          disabled={submitting}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ mr: 2 }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SendIcon />}
                    disabled={submitting}
                  >
                    {submitting ? 'Publishing...' : 'Publish Announcement'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default CreateAnnouncementPage;

