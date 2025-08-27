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
  Chip,
  Avatar,
  Divider,
  IconButton,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Announcement, AnnouncementAudience } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

const AnnouncementDetailPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const isAuthor = announcement?.authorId === user?.id;
  const canEdit = isAdmin || (isTeacher && isAuthor);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch the announcement from the API
        // const response = await fetch(`/api/announcements/${id}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch announcement');
        // }
        // const data = await response.json();
        // setAnnouncement(data);
        
        // For demo purposes, set mock data
        const mockAnnouncement: Announcement = {
          id: id,
          title: 'School Closure Due to Weather',
          content: `Due to the severe weather forecast, the school will be closed tomorrow. All classes and activities are cancelled. Please stay safe and check your email for updates on when classes will resume.

The National Weather Service has issued a severe weather warning for our area, with predictions of heavy snow and ice accumulation. The safety of our students and staff is our top priority, and we have made the decision to close the school to ensure everyone's well-being.

During this closure:
- All classes and extracurricular activities are cancelled
- Staff are not required to report to work
- Online resources will remain available for students
- The school office will be closed, but staff will be monitoring emails

We will continue to monitor the weather conditions and will provide updates on when classes will resume. Please check your email, the school website, and our social media channels for the latest information.

Stay safe and warm!`,
          authorId: '1',
          authorName: 'Principal Johnson',
          authorRole: Role.ADMIN,
          targetAudience: AnnouncementAudience.ALL,
          attachments: [
            {
              id: '1',
              name: 'weather_advisory.pdf',
              type: 'application/pdf',
              size: 1024 * 1024 * 1.2, // 1.2 MB
              url: '#',
              uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              uploadedBy: '1'
            },
            {
              id: '2',
              name: 'emergency_contacts.docx',
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              size: 1024 * 512, // 512 KB
              url: '#',
              uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              uploadedBy: '1'
            }
          ],
          isPinned: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        };
        
        setAnnouncement(mockAnnouncement);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching announcement:', err);
        setError('Failed to load announcement. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleBack = () => {
    router.push('/announcements');
  };

  const handleEdit = () => {
    router.push(`/announcements/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!announcement) return;
    
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you would delete the announcement via the API
      // const response = await fetch(`/api/announcements/${id}`, {
      //   method: 'DELETE'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete announcement');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to announcements page
      router.push('/announcements');
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement. Please try again later.');
      setLoading(false);
    }
  };

  const handleTogglePin = async () => {
    if (!announcement) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you would update the pin status via the API
      // const response = await fetch(`/api/announcements/${id}/pin`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ isPinned: !announcement.isPinned })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update pin status');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the announcement in the state
      setAnnouncement(prev => {
        if (!prev) return null;
        return { ...prev, isPinned: !prev.isPinned };
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error updating pin status:', err);
      setError('Failed to update pin status. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) + 
      ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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

  const getAudienceChip = (audience: AnnouncementAudience) => {
    let label = '';
    let color: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default' = 'default';
    
    switch (audience) {
      case AnnouncementAudience.ALL:
        label = 'All';
        color = 'primary';
        break;
      case AnnouncementAudience.STAFF:
        label = 'Staff';
        color = 'secondary';
        break;
      case AnnouncementAudience.TEACHERS:
        label = 'Teachers';
        color = 'info';
        break;
      case AnnouncementAudience.STUDENTS:
        label = 'Students';
        color = 'success';
        break;
      case AnnouncementAudience.PARENTS:
        label = 'Parents';
        color = 'warning';
        break;
      case AnnouncementAudience.CLASSES:
        label = 'Classes';
        color = 'error';
        break;
      case AnnouncementAudience.GRADE_LEVELS:
        label = 'Grade Levels';
        color = 'default';
        break;
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
      />
    );
  };

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
            Back to Announcements
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : !announcement ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Announcement not found.
          </Alert>
        ) : (
          <Paper sx={{ p: 3, position: 'relative' }}>
            {announcement.isPinned && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  right: 0, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderBottomLeftRadius: 4
                }}
              >
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PushPinIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Pinned
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {announcement.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Target Audience:
                  </Typography>
                  {getAudienceChip(announcement.targetAudience)}
                </Box>
              </Box>
              
              {canEdit && (
                <Box>
                  <IconButton 
                    onClick={handleTogglePin}
                    color={announcement.isPinned ? 'primary' : 'default'}
                  >
                    {announcement.isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                  </IconButton>
                  <IconButton onClick={handleEdit} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: getRoleColor(announcement.authorRole), mr: 1 }}>
                {announcement.authorName.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="body1">
                  {announcement.authorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(announcement.createdAt)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
              {announcement.content}
            </Typography>
            
            {announcement.attachments && announcement.attachments.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Attachments
                </Typography>
                <Grid container spacing={2}>
                  {announcement.attachments.map((attachment) => (
                    <Grid item xs={12} sm={6} md={4} key={attachment.id}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          display: 'flex', 
                          flexDirection: 'column',
                          height: '100%'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachFileIcon sx={{ mr: 1 }} />
                          <Typography variant="body1" noWrap>
                            {attachment.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {formatFileSize(attachment.size)}
                        </Typography>
                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={handleBack}
              >
                Back to Announcements
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default AnnouncementDetailPage;

