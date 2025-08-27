import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  Chip,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

interface Recipient {
  id: string;
  name: string;
  role: Role;
  email?: string;
}

const ComposeMessagePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<string>('all');
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch recipients from the API
        // const response = await fetch('/api/users');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch recipients');
        // }
        // const data = await response.json();
        // setRecipients(data);
        
        // For demo purposes, set mock data
        const mockRecipients: Recipient[] = [
          {
            id: '1',
            name: 'John Smith',
            role: Role.TEACHER,
            email: 'john.smith@example.com'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            role: Role.PARENT,
            email: 'sarah.johnson@example.com'
          },
          {
            id: '3',
            name: 'Michael Williams',
            role: Role.STUDENT,
            email: 'michael.williams@example.com'
          },
          {
            id: '4',
            name: 'Emily Brown',
            role: Role.TEACHER,
            email: 'emily.brown@example.com'
          },
          {
            id: '5',
            name: 'David Jones',
            role: Role.ADMIN,
            email: 'david.jones@example.com'
          },
          {
            id: '6',
            name: 'Jennifer Davis',
            role: Role.PARENT,
            email: 'jennifer.davis@example.com'
          },
          {
            id: '7',
            name: 'Robert Miller',
            role: Role.STUDENT,
            email: 'robert.miller@example.com'
          },
          {
            id: '8',
            name: 'Lisa Wilson',
            role: Role.TEACHER,
            email: 'lisa.wilson@example.com'
          },
          {
            id: '9',
            name: 'James Taylor',
            role: Role.REGISTRAR,
            email: 'james.taylor@example.com'
          },
          {
            id: '10',
            name: 'Patricia Anderson',
            role: Role.STAFF,
            email: 'patricia.anderson@example.com'
          }
        ];
        
        setRecipients(mockRecipients);
        
        // If recipientId is provided in the URL, set it as the selected recipient
        const { recipientId } = router.query;
        if (recipientId && !Array.isArray(recipientId)) {
          const recipient = mockRecipients.find(r => r.id === recipientId);
          if (recipient) {
            setSelectedRecipients([recipient]);
          }
        }
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching recipients:', err);
        setError('Failed to load recipients. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecipients();
  }, [router.query]);

  const handleBack = () => {
    router.push('/messages');
  };

  const handleRecipientTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRecipientType(event.target.value as string);
    
    // Clear selected recipients when changing recipient type
    setSelectedRecipients([]);
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
    if (selectedRecipients.length === 0) {
      setError('Please select at least one recipient.');
      return;
    }
    
    if (!subject.trim()) {
      setError('Please enter a subject.');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the message to the API
      // const formData = new FormData();
      // formData.append('recipients', JSON.stringify(selectedRecipients.map(r => r.id)));
      // formData.append('subject', subject);
      // formData.append('message', message);
      // files.forEach(file => formData.append('files', file));
      
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Message sent successfully!');
      
      // Reset form
      setSelectedRecipients([]);
      setSubject('');
      setMessage('');
      setFiles([]);
      
      // Redirect to messages page after a short delay
      setTimeout(() => {
        router.push('/messages');
      }, 1500);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecipients = recipientType === 'all' 
    ? recipients 
    : recipients.filter(r => r.role.toLowerCase() === recipientType);

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'error.main';
      case Role.TEACHER:
        return 'primary.main';
      case Role.STUDENT:
        return 'success.main';
      case Role.PARENT:
        return 'warning.main';
      case Role.REGISTRAR:
        return 'info.main';
      case Role.STAFF:
        return 'secondary.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Messages
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Compose Message
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="recipient-type-label">Recipient Type</InputLabel>
                  <Select
                    labelId="recipient-type-label"
                    value={recipientType}
                    label="Recipient Type"
                    onChange={handleRecipientTypeChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="teacher">Teachers</MenuItem>
                    <MenuItem value="student">Students</MenuItem>
                    <MenuItem value="parent">Parents</MenuItem>
                    <MenuItem value="admin">Administrators</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={9}>
                <Autocomplete
                  multiple
                  id="recipients"
                  options={filteredRecipients}
                  getOptionLabel={(option) => `${option.name} (${option.role})`}
                  value={selectedRecipients}
                  onChange={(event, newValue) => {
                    setSelectedRecipients(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      placeholder="Select recipients"
                      fullWidth
                      required
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        sx={{ 
                          bgcolor: getRoleColor(option.role),
                          color: 'white'
                        }}
                      />
                    ))
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="body2" color={getRoleColor(option.role)}>
                          {option.role.charAt(0).toUpperCase() + option.role.slice(1)}
                          {option.email && ` - ${option.email}`}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  loading={loading}
                  disabled={submitting}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={submitting}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  rows={10}
                  required
                  disabled={submitting}
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
                          label={file.name}
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
                    {submitting ? 'Sending...' : 'Send Message'}
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

export default ComposeMessagePage;

