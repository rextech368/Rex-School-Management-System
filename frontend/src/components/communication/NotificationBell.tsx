import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EmailIcon from '@mui/icons-material/Email';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/router';
import { Notification, NotificationType } from '@/lib/types';

interface NotificationBellProps {
  userId: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real application, you would fetch notifications from the API
        // const response = await fetch(`/api/notifications?limit=5`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch notifications');
        // }
        // const data = await response.json();
        // setNotifications(data);
        // setUnreadCount(data.filter((n: Notification) => !n.isRead).length);
        
        // For demo purposes, set mock data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            userId,
            title: 'New Announcement',
            message: 'School Closure Due to Weather: The school will be closed tomorrow due to severe weather.',
            type: NotificationType.ANNOUNCEMENT,
            relatedId: '1',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          },
          {
            id: '2',
            userId,
            title: 'New Message',
            message: 'You have received a new message from John Smith regarding the parent-teacher conference.',
            type: NotificationType.MESSAGE,
            relatedId: '1',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: '3',
            userId,
            title: 'Grade Posted',
            message: 'Your grade for "Midterm Exam" in "Algebra I" has been posted.',
            type: NotificationType.GRADE,
            relatedId: '3',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    
    // In a real application, you might set up a WebSocket or polling to get new notifications
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    
    return () => clearInterval(interval);
  }, [userId]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        // In a real application, you would update the notification status via the API
        // const response = await fetch(`/api/notifications/${notification.id}/read`, {
        //   method: 'PUT'
        // });
        
        // if (!response.ok) {
        //   throw new Error('Failed to mark notification as read');
        // }
        
        // Update the notification in the state
        setNotifications(prevNotifications => 
          prevNotifications.map(n => 
            n.id === notification.id 
              ? { ...n, isRead: true } 
              : n
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
    
    // Navigate to the related page based on notification type
    handleClose();
    
    switch (notification.type) {
      case NotificationType.ANNOUNCEMENT:
        router.push(`/announcements/${notification.relatedId}`);
        break;
      case NotificationType.MESSAGE:
        router.push(`/messages/${notification.relatedId}`);
        break;
      case NotificationType.GRADE:
        router.push(`/grades/student/${userId}`);
        break;
      case NotificationType.ATTENDANCE:
        router.push(`/attendance/student/${userId}`);
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

  const handleViewAll = () => {
    handleClose();
    router.push('/notifications');
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

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label={`${unreadCount} new notifications`}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="primary">
              {unreadCount} new
            </Typography>
          )}
        </Box>
        
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem 
                key={notification.id} 
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
                    <Typography 
                      variant="body1" 
                      sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography 
                        variant="body2" 
                        color="text.primary"
                        sx={{ 
                          display: 'block',
                          fontWeight: notification.isRead ? 'normal' : 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        
        <Divider />
        
        <Box sx={{ p: 1 }}>
          <Button 
            fullWidth 
            onClick={handleViewAll}
          >
            View All Notifications
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;

