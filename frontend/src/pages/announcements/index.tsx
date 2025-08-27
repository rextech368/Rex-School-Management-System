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
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Announcement, AnnouncementAudience } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`announcements-tabpanel-${index}`}
      aria-labelledby={`announcements-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AnnouncementsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;
  const isTeacher = user?.role === Role.TEACHER;
  const canCreateAnnouncement = isAdmin || isTeacher;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch announcements from the API
        // const response = await fetch('/api/announcements');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch announcements');
        // }
        // const data = await response.json();
        // setAnnouncements(data);
        
        // For demo purposes, set mock data
        const mockAnnouncements: Announcement[] = [
          {
            id: '1',
            title: 'School Closure Due to Weather',
            content: 'Due to the severe weather forecast, the school will be closed tomorrow. All classes and activities are cancelled. Please stay safe and check your email for updates on when classes will resume.',
            authorId: '1',
            authorName: 'Principal Johnson',
            authorRole: Role.ADMIN,
            targetAudience: AnnouncementAudience.ALL,
            isPinned: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: '2',
            title: 'Parent-Teacher Conference Schedule',
            content: 'The parent-teacher conferences will be held next week from Monday to Thursday, 3:00 PM to 7:00 PM. Please sign up for a time slot using the online scheduling system. If you need assistance, please contact the school office.',
            authorId: '2',
            authorName: 'Sarah Williams',
            authorRole: Role.TEACHER,
            targetAudience: AnnouncementAudience.PARENTS,
            isPinned: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: '3',
            title: 'Final Exam Schedule',
            content: 'The final exam schedule for this semester has been posted. Please review the schedule carefully and note the dates and times for your exams. If you have any conflicts, please contact your academic advisor as soon as possible.',
            authorId: '3',
            authorName: 'Academic Affairs',
            authorRole: Role.REGISTRAR,
            targetAudience: AnnouncementAudience.STUDENTS,
            attachments: [
              {
                id: '1',
                name: 'final_exam_schedule.pdf',
                type: 'application/pdf',
                size: 1024 * 1024 * 1.5, // 1.5 MB
                url: '#',
                uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                uploadedBy: '3'
              }
            ],
            isPinned: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          },
          {
            id: '4',
            title: 'Staff Meeting Reminder',
            content: 'This is a reminder that we will have a staff meeting tomorrow at 3:30 PM in the conference room. We will be discussing the upcoming school events and budget allocations for the next quarter. Please bring your department reports.',
            authorId: '4',
            authorName: 'HR Department',
            authorRole: Role.STAFF,
            targetAudience: AnnouncementAudience.STAFF,
            isPinned: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
          },
          {
            id: '5',
            title: 'New Curriculum Resources Available',
            content: 'We have added new curriculum resources to the teacher portal. These resources include lesson plans, activities, and assessments aligned with the state standards. Please review these materials and incorporate them into your teaching as appropriate.',
            authorId: '5',
            authorName: 'Curriculum Committee',
            authorRole: Role.TEACHER,
            targetAudience: AnnouncementAudience.TEACHERS,
            attachments: [
              {
                id: '2',
                name: 'curriculum_resources.zip',
                type: 'application/zip',
                size: 1024 * 1024 * 5, // 5 MB
                url: '#',
                uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
                uploadedBy: '5'
              }
            ],
            isPinned: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
          }
        ];
        
        setAnnouncements(mockAnnouncements);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateAnnouncement = () => {
    router.push('/announcements/create');
  };

  const handleViewAnnouncement = (announcementId: string) => {
    router.push(`/announcements/${announcementId}`);
  };

  const handleTogglePin = async (announcementId: string, isPinned: boolean) => {
    try {
      // In a real application, you would update the pin status in the API
      // const response = await fetch(`/api/announcements/${announcementId}/pin`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ isPinned: !isPinned }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update pin status');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the announcement in the state
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(announcement => 
          announcement.id === announcementId 
            ? { ...announcement, isPinned: !isPinned } 
            : announcement
        )
      );
    } catch (err) {
      console.error('Error updating pin status:', err);
      setError('Failed to update pin status. Please try again later.');
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const titleMatch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = announcement.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return titleMatch || contentMatch || authorMatch;
  });

  // Get announcements based on tab
  const getTabAnnouncements = () => {
    switch (tabValue) {
      case 0: // All
        return filteredAnnouncements;
      case 1: // Pinned
        return filteredAnnouncements.filter(a => a.isPinned);
      case 2: // For Me
        // Filter announcements targeted to the user's role
        return filteredAnnouncements.filter(a => 
          a.targetAudience === AnnouncementAudience.ALL ||
          (a.targetAudience === AnnouncementAudience.TEACHERS && user?.role === Role.TEACHER) ||
          (a.targetAudience === AnnouncementAudience.STUDENTS && user?.role === Role.STUDENT) ||
          (a.targetAudience === AnnouncementAudience.PARENTS && user?.role === Role.PARENT) ||
          (a.targetAudience === AnnouncementAudience.STAFF && 
            (user?.role === Role.STAFF || user?.role === Role.ADMIN || user?.role === Role.REGISTRAR))
        );
      default:
        return filteredAnnouncements;
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
        sx={{ ml: 1 }}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Announcements
          </Typography>
          {canCreateAnnouncement && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateAnnouncement}
            >
              Create Announcement
            </Button>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab label="Pinned" />
            <Tab label="For Me" />
          </Tabs>
        </Paper>
        
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : getTabAnnouncements().length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No announcements found.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {getTabAnnouncements().map((announcement) => (
                <Grid item xs={12} key={announcement.id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: announcement.isPinned ? 1 : 0,
                      borderColor: 'primary.main'
                    }}
                  >
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
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                          {announcement.title}
                        </Typography>
                        {getAudienceChip(announcement.targetAudience)}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: getRoleColor(announcement.authorRole), mr: 1 }}>
                          {announcement.authorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {announcement.authorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(announcement.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {announcement.content.length > 300 
                          ? announcement.content.substring(0, 300) + '...' 
                          : announcement.content
                        }
                      </Typography>
                      
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          {announcement.attachments.map((attachment) => (
                            <Chip
                              key={attachment.id}
                              icon={<AttachFileIcon />}
                              label={attachment.name}
                              variant="outlined"
                              onClick={() => {}}
                            />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewAnnouncement(announcement.id)}
                      >
                        View Details
                      </Button>
                      {(isAdmin || (isTeacher && announcement.authorId === user?.id)) && (
                        <IconButton 
                          onClick={() => handleTogglePin(announcement.id, announcement.isPinned)}
                          color={announcement.isPinned ? 'primary' : 'default'}
                        >
                          {announcement.isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : getTabAnnouncements().length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No pinned announcements found.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {getTabAnnouncements().map((announcement) => (
                <Grid item xs={12} key={announcement.id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: 1,
                      borderColor: 'primary.main'
                    }}
                  >
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
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                          {announcement.title}
                        </Typography>
                        {getAudienceChip(announcement.targetAudience)}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: getRoleColor(announcement.authorRole), mr: 1 }}>
                          {announcement.authorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {announcement.authorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(announcement.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {announcement.content.length > 300 
                          ? announcement.content.substring(0, 300) + '...' 
                          : announcement.content
                        }
                      </Typography>
                      
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          {announcement.attachments.map((attachment) => (
                            <Chip
                              key={attachment.id}
                              icon={<AttachFileIcon />}
                              label={attachment.name}
                              variant="outlined"
                              onClick={() => {}}
                            />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewAnnouncement(announcement.id)}
                      >
                        View Details
                      </Button>
                      {(isAdmin || (isTeacher && announcement.authorId === user?.id)) && (
                        <IconButton 
                          onClick={() => handleTogglePin(announcement.id, announcement.isPinned)}
                          color="primary"
                        >
                          <PushPinIcon />
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : getTabAnnouncements().length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No announcements for you.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {getTabAnnouncements().map((announcement) => (
                <Grid item xs={12} key={announcement.id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      border: announcement.isPinned ? 1 : 0,
                      borderColor: 'primary.main'
                    }}
                  >
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
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                          {announcement.title}
                        </Typography>
                        {getAudienceChip(announcement.targetAudience)}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: getRoleColor(announcement.authorRole), mr: 1 }}>
                          {announcement.authorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {announcement.authorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(announcement.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {announcement.content.length > 300 
                          ? announcement.content.substring(0, 300) + '...' 
                          : announcement.content
                        }
                      </Typography>
                      
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          {announcement.attachments.map((attachment) => (
                            <Chip
                              key={attachment.id}
                              icon={<AttachFileIcon />}
                              label={attachment.name}
                              variant="outlined"
                              onClick={() => {}}
                            />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewAnnouncement(announcement.id)}
                      >
                        View Details
                      </Button>
                      {(isAdmin || (isTeacher && announcement.authorId === user?.id)) && (
                        <IconButton 
                          onClick={() => handleTogglePin(announcement.id, announcement.isPinned)}
                          color={announcement.isPinned ? 'primary' : 'default'}
                        >
                          {announcement.isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Container>
    </DashboardLayout>
  );
};

export default AnnouncementsPage;

