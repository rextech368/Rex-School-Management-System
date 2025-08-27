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
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EmailIcon from '@mui/icons-material/Email';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationType, NotificationPreference } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

const NotificationSettingsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch notification preferences from the API
        // const response = await fetch('/api/notifications/preferences');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch notification preferences');
        // }
        // const data = await response.json();
        // setPreferences(data);
        
        // For demo purposes, set mock data
        const mockPreferences: NotificationPreference = {
          userId: user?.id || '',
          email: true,
          sms: false,
          inApp: true,
          types: {
            [NotificationType.ANNOUNCEMENT]: {
              email: true,
              sms: false,
              inApp: true
            },
            [NotificationType.MESSAGE]: {
              email: true,
              sms: true,
              inApp: true
            },
            [NotificationType.GRADE]: {
              email: true,
              sms: false,
              inApp: true
            },
            [NotificationType.ATTENDANCE]: {
              email: true,
              sms: true,
              inApp: true
            },
            [NotificationType.ASSIGNMENT]: {
              email: true,
              sms: false,
              inApp: true
            },
            [NotificationType.SYSTEM]: {
              email: false,
              sms: false,
              inApp: true
            },
            [NotificationType.EVENT]: {
              email: true,
              sms: false,
              inApp: true
            }
          }
        };
        
        setPreferences(mockPreferences);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching notification preferences:', err);
        setError('Failed to load notification preferences. Please try again later.');
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const handleBack = () => {
    router.push('/notifications');
  };

  const handleGlobalToggle = (channel: 'email' | 'sms' | 'inApp', value: boolean) => {
    if (!preferences) return;
    
    // Update the global setting
    setPreferences(prev => {
      if (!prev) return null;
      
      // Create a copy of the preferences
      const newPreferences = { ...prev, [channel]: value };
      
      // If turning off a channel globally, also turn it off for all notification types
      if (!value) {
        const newTypes = { ...prev.types };
        Object.keys(newTypes).forEach(type => {
          newTypes[type as NotificationType] = {
            ...newTypes[type as NotificationType],
            [channel]: false
          };
        });
        newPreferences.types = newTypes;
      }
      
      return newPreferences;
    });
  };

  const handleTypeToggle = (type: NotificationType, channel: 'email' | 'sms' | 'inApp', value: boolean) => {
    if (!preferences) return;
    
    setPreferences(prev => {
      if (!prev) return null;
      
      // Create a copy of the preferences
      return {
        ...prev,
        types: {
          ...prev.types,
          [type]: {
            ...prev.types[type],
            [channel]: value
          }
        }
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!preferences) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the preferences to the API
      // const response = await fetch('/api/notifications/preferences', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(preferences)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update notification preferences');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Notification preferences updated successfully!');
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      setError('Failed to update notification preferences. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ANNOUNCEMENT:
        return <AnnouncementIcon />;
      case NotificationType.MESSAGE:
        return <EmailIcon />;
      case NotificationType.GRADE:
        return <GradeIcon />;
      case NotificationType.ATTENDANCE:
        return <PersonIcon />;
      case NotificationType.ASSIGNMENT:
        return <AssignmentIcon />;
      case NotificationType.EVENT:
        return <EventIcon />;
      case NotificationType.SYSTEM:
        return <NotificationsIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ANNOUNCEMENT:
        return 'Announcements';
      case NotificationType.MESSAGE:
        return 'Messages';
      case NotificationType.GRADE:
        return 'Grades';
      case NotificationType.ATTENDANCE:
        return 'Attendance';
      case NotificationType.ASSIGNMENT:
        return 'Assignments';
      case NotificationType.EVENT:
        return 'Events';
      case NotificationType.SYSTEM:
        return 'System Notifications';
      default:
        return 'Notifications';
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
            Back to Notifications
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Notification Settings
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : !preferences ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load notification preferences.
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Global Notification Settings" 
                    subheader="These settings apply to all notification types"
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={preferences.email}
                              onChange={(e) => handleGlobalToggle('email', e.target.checked)}
                              disabled={submitting}
                            />
                          }
                          label="Email Notifications"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={preferences.sms}
                              onChange={(e) => handleGlobalToggle('sms', e.target.checked)}
                              disabled={submitting}
                            />
                          }
                          label="SMS Notifications"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={preferences.inApp}
                              onChange={(e) => handleGlobalToggle('inApp', e.target.checked)}
                              disabled={submitting}
                            />
                          }
                          label="In-App Notifications"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Notification Type Settings" 
                    subheader="Customize settings for each notification type"
                  />
                  <CardContent>
                    <List
                      subheader={
                        <ListSubheader component="div">
                          <Grid container>
                            <Grid item xs={6}>
                              Notification Type
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                              Email
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                              SMS
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                              In-App
                            </Grid>
                          </Grid>
                        </ListSubheader>
                      }
                    >
                      {Object.values(NotificationType).map((type) => (
                        <React.Fragment key={type}>
                          <ListItem>
                            <Grid container alignItems="center">
                              <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ListItemIcon>
                                    {getNotificationIcon(type)}
                                  </ListItemIcon>
                                  <ListItemText primary={getNotificationLabel(type)} />
                                </Box>
                              </Grid>
                              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Switch
                                  checked={preferences.types[type].email}
                                  onChange={(e) => handleTypeToggle(type, 'email', e.target.checked)}
                                  disabled={submitting || !preferences.email}
                                />
                              </Grid>
                              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Switch
                                  checked={preferences.types[type].sms}
                                  onChange={(e) => handleTypeToggle(type, 'sms', e.target.checked)}
                                  disabled={submitting || !preferences.sms}
                                />
                              </Grid>
                              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Switch
                                  checked={preferences.types[type].inApp}
                                  onChange={(e) => handleTypeToggle(type, 'inApp', e.target.checked)}
                                  disabled={submitting || !preferences.inApp}
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
                    startIcon={<SaveIcon />}
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default NotificationSettingsPage;

