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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Chip,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EmailIcon from '@mui/icons-material/Email';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Notification, NotificationType } from '@/lib/types';
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
      id={`notifications-tabpanel-${index}`}
      aria-labelledby={`notifications-tab-${index}`}
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

const NotificationsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch notifications from the API
        // const response = await fetch('/api/notifications');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch notifications');
        // }
        // const data = await response.json();
        // setNotifications(data);
        
        // For demo purposes, set mock data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            userId: user?.id || '',
            title: 'New Announcement',
            message: 'School Closure Due to Weather: The school will be closed tomorrow due to severe weather.',
            type: NotificationType.ANNOUNCEMENT,
            relatedId: '1',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          },
          {
            id: '2',
            userId: user?.id || '',
            title: 'New Message',
            message: 'You have received a new message from John Smith regarding the parent-teacher conference.',
            type: NotificationType.MESSAGE,
            relatedId: '1',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: '3',
            userId: user?.id || '',
            title: 'Grade Posted',
            message: 'Your grade for "Midterm Exam" in "Algebra I" has been posted.',
            type: NotificationType.GRADE,
            relatedId: '3',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          },
          {
            id: '4',
            userId: user?.id || '',
            title: 'Attendance Recorded',
            message: 'Your attendance for "English Literature" on 2023-10-15 has been marked as "absent".',
            type: NotificationType.ATTENDANCE,
            relatedId: '4',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: '5',
            userId: user?.id || '',
            title: 'New Assignment',
            message: 'A new assignment "Research Project" has been posted in "Biology".',
            type: NotificationType.ASSIGNMENT,
            relatedId: '5',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          },
          {
            id: '6',
            userId: user?.id || '',
            title: 'System Maintenance',
            message: 'The system will be undergoing maintenance on Sunday from 2:00 AM to 4:00 AM.',
            type: NotificationType.SYSTEM,
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
          },
          {
            id: '7',
            userId: user?.id || '',
            title: 'Upcoming Event',
            message: 'Reminder: Parent-Teacher Conference is scheduled for next Friday.',
            type: NotificationType.EVENT,
            relatedId: '7',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
          }
        ];
        
        setNotifications(mockNotifications);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again later.');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // In a real application, you would update the notification status via the API
      // const response = await fetch(`/api/notifications/${notificationId}/read`, {
      //   method: 'PUT'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to mark notification as read');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the notification in the state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      handleMenuClose();
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read. Please try again later.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real application, you would update all notifications via the API
      // const response = await fetch('/api/notifications/read-all', {
      //   method: 'PUT'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to mark all notifications as read');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update all notifications in the state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read. Please try again later.');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // In a real application, you would delete the notification via the API
      // const response = await fetch(`/api/notifications/${notificationId}`, {
      //   method: 'DELETE'
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to delete notification');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the notification from the state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      handleMenuClose();
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification. Please try again later.');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    // Navigate to the related page based on notification type
    switch (notification.type) {
      case NotificationType.ANNOUNCEMENT:
        router.push(`/announcements/${notification.relatedId}`);
        break;
      case NotificationType.MESSAGE:
        router.push(`/messages/${notification.relatedId}`);
        break;
      case NotificationType.GRADE:
        router.push(`/grades/student/${user?.id}`);
        break;
      case NotificationType.ATTENDANCE:
        router.push(`/attendance/student/${user?.id}`);
        break;
      case NotificationType.ASSIGNMENT:
        router.push(`/assignments/${notification.relatedId}`);
        break;
      case NotificationType.EVENT:
        router.push(`/calendar?event=${notification.relatedId}`);
        break;
      default:
        // For system notifications, just mark as read
        break;
    }
  };

  const handleSettingsClick = () => {
    router.push('/notifications/settings');
  };

  // Get notifications based on tab and filter
  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Apply unread filter if enabled
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }
    
    // Apply tab filter
    switch (tabValue) {
      case 0: // All
        return filtered;
      case 1: // Announcements
        return filtered.filter(n => n.type === NotificationType.ANNOUNCEMENT);
      case 2: // Messages
        return filtered.filter(n => n.type === NotificationType.MESSAGE);
      case 3: // Grades
        return filtered.filter(n => n.type === NotificationType.GRADE);
      case 4: // Other
        return filtered.filter(n => 
          n.type !== NotificationType.ANNOUNCEMENT && 
          n.type !== NotificationType.MESSAGE && 
          n.type !== NotificationType.GRADE
        );
      default:
        return filtered;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
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

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ANNOUNCEMENT:
        return 'primary.main';
      case NotificationType.MESSAGE:
        return 'info.main';
      case NotificationType.GRADE:
        return 'success.main';
      case NotificationType.ATTENDANCE:
        return 'warning.main';
      case NotificationType.ASSIGNMENT:
        return 'secondary.main';
      case NotificationType.EVENT:
        return 'error.main';
      case NotificationType.SYSTEM:
        return 'text.primary';
      default:
        return 'text.primary';
    }
  };

  const getNotificationTypeChip = (type: NotificationType) => {
    let label = '';
    let color: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default' = 'default';
    
    switch (type) {
      case NotificationType.ANNOUNCEMENT:
        label = 'Announcement';
        color = 'primary';
        break;
      case NotificationType.MESSAGE:
        label = 'Message';
        color = 'info';
        break;
      case NotificationType.GRADE:
        label = 'Grade';
        color = 'success';
        break;
      case NotificationType.ATTENDANCE:
        label = 'Attendance';
        color = 'warning';
        break;
      case NotificationType.ASSIGNMENT:
        label = 'Assignment';
        color = 'secondary';
        break;
      case NotificationType.EVENT:
        label = 'Event';
        color = 'error';
        break;
      case NotificationType.SYSTEM:
        label = 'System';
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

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Notifications
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<MarkEmailReadIcon />}
              onClick={handleMarkAllAsRead}
              sx={{ mr: 2 }}
            >
              Mark All as Read
            </Button>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={handleSettingsClick}
            >
              Settings
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    All
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Badge 
                        color="primary" 
                        badgeContent={notifications.filter(n => !n.isRead).length} 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Announcements
                    {notifications.filter(n => n.type === NotificationType.ANNOUNCEMENT && !n.isRead).length > 0 && (
                      <Badge 
                        color="primary" 
                        badgeContent={notifications.filter(n => n.type === NotificationType.ANNOUNCEMENT && !n.isRead).length} 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Messages
                    {notifications.filter(n => n.type === NotificationType.MESSAGE && !n.isRead).length > 0 && (
                      <Badge 
                        color="primary" 
                        badgeContent={notifications.filter(n => n.type === NotificationType.MESSAGE && !n.isRead).length} 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Grades
                    {notifications.filter(n => n.type === NotificationType.GRADE && !n.isRead).length > 0 && (
                      <Badge 
                        color="primary" 
                        badgeContent={notifications.filter(n => n.type === NotificationType.GRADE && !n.isRead).length} 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Other
                    {notifications.filter(n => 
                      n.type !== NotificationType.ANNOUNCEMENT && 
                      n.type !== NotificationType.MESSAGE && 
                      n.type !== NotificationType.GRADE && 
                      !n.isRead
                    ).length > 0 && (
                      <Badge 
                        color="primary" 
                        badgeContent={notifications.filter(n => 
                          n.type !== NotificationType.ANNOUNCEMENT && 
                          n.type !== NotificationType.MESSAGE && 
                          n.type !== NotificationType.GRADE && 
                          !n.isRead
                        ).length} 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                } 
              />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  color="primary"
                />
              }
              label="Show unread only"
            />
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {renderNotificationList()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {renderNotificationList()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            {renderNotificationList()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            {renderNotificationList()}
          </TabPanel>
          
          <TabPanel value={tabValue} index={4}>
            {renderNotificationList()}
          </TabPanel>
        </Paper>
      </Container>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedNotification && handleMarkAsRead(selectedNotification)}>
          <MarkEmailReadIcon fontSize="small" sx={{ mr: 1 }} />
          Mark as read
        </MenuItem>
        <MenuItem onClick={() => selectedNotification && handleDeleteNotification(selectedNotification)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </DashboardLayout>
  );

  function renderNotificationList() {
    const filteredNotifications = getFilteredNotifications();
    
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (filteredNotifications.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No notifications found.
          </Typography>
        </Box>
      );
    }
    
    return (
      <List>
        {filteredNotifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem 
              alignItems="flex-start" 
              button 
              onClick={() => handleNotificationClick(notification)}
              sx={{ 
                bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected',
                }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                  {getNotificationIcon(notification.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography 
                      component="span" 
                      variant="body1" 
                      color="text.primary"
                      sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                    >
                      {notification.title}
                    </Typography>
                    {getNotificationTypeChip(notification.type)}
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ 
                        display: 'inline',
                        fontWeight: notification.isRead ? 'normal' : 'bold'
                      }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {formatDate(notification.createdAt)}
                    </Typography>
                  </React.Fragment>
                }
              />
              <IconButton 
                edge="end" 
                aria-label="more"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, notification.id);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </ListItem>
            {index < filteredNotifications.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  }
};

export default NotificationsPage;

