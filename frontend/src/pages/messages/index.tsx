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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArchiveIcon from '@mui/icons-material/Archive';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Conversation } from '@/lib/types';
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
      id={`messages-tabpanel-${index}`}
      aria-labelledby={`messages-tab-${index}`}
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

const MessagesPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch conversations from the API
        // const response = await fetch('/api/messages/conversations');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch conversations');
        // }
        // const data = await response.json();
        // setConversations(data);
        
        // For demo purposes, set mock data
        const mockConversations: Conversation[] = [
          {
            id: '1',
            participants: [
              {
                id: '2',
                name: 'John Smith',
                role: Role.TEACHER,
                avatar: ''
              }
            ],
            lastMessage: {
              content: 'Hello, I wanted to discuss the upcoming parent-teacher conference.',
              senderId: '2',
              createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
              isRead: false
            },
            unreadCount: 1,
            updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          },
          {
            id: '2',
            participants: [
              {
                id: '3',
                name: 'Sarah Johnson',
                role: Role.PARENT,
                avatar: ''
              }
            ],
            lastMessage: {
              content: 'Thank you for the update on Michael\'s progress.',
              senderId: '3',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
              isRead: true
            },
            unreadCount: 0,
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
          },
          {
            id: '3',
            participants: [
              {
                id: '4',
                name: 'Emily Williams',
                role: Role.STUDENT,
                avatar: ''
              }
            ],
            lastMessage: {
              content: 'I\'ve submitted my assignment. Could you please check if you received it?',
              senderId: '4',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
              isRead: true
            },
            unreadCount: 0,
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
          },
          {
            id: '4',
            participants: [
              {
                id: '5',
                name: 'David Brown',
                role: Role.ADMIN,
                avatar: ''
              }
            ],
            lastMessage: {
              content: 'Please review the updated school calendar for the next semester.',
              senderId: '5',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
              isRead: true
            },
            unreadCount: 0,
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
          },
          {
            id: '5',
            participants: [
              {
                id: '6',
                name: 'Michael Johnson',
                role: Role.TEACHER,
                avatar: ''
              }
            ],
            lastMessage: {
              content: 'Can we discuss the curriculum changes for next term?',
              senderId: '6',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
              isRead: true
            },
            unreadCount: 0,
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
          }
        ];
        
        setConversations(mockConversations);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations. Please try again later.');
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleComposeMessage = () => {
    router.push('/messages/compose');
  };

  const handleOpenConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  const filteredConversations = conversations.filter(conversation => {
    const participantNames = conversation.participants.map(p => p.name.toLowerCase()).join(' ');
    const messageContent = conversation.lastMessage.content.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return participantNames.includes(query) || messageContent.includes(query);
  });

  // Get conversations based on tab
  const getTabConversations = () => {
    switch (tabValue) {
      case 0: // Inbox
        return filteredConversations;
      case 1: // Starred
        return filteredConversations.filter(c => c.lastMessage.isRead === false);
      case 2: // Sent
        return filteredConversations.filter(c => c.lastMessage.senderId === user?.id);
      case 3: // Archived
        return []; // In a real app, you would filter for archived conversations
      default:
        return filteredConversations;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
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

  const getRoleChip = (role: Role) => {
    let color: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default' = 'default';
    
    switch (role) {
      case Role.ADMIN:
        color = 'error';
        break;
      case Role.TEACHER:
        color = 'primary';
        break;
      case Role.STUDENT:
        color = 'success';
        break;
      case Role.PARENT:
        color = 'warning';
        break;
      case Role.REGISTRAR:
        color = 'info';
        break;
      case Role.STAFF:
        color = 'secondary';
        break;
    }
    
    return (
      <Chip 
        label={role.charAt(0).toUpperCase() + role.slice(1)} 
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
            Messages
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleComposeMessage}
          >
            Compose
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ mb: 3 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab 
                  icon={<InboxIcon />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Inbox
                      {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                        <Badge 
                          color="primary" 
                          badgeContent={conversations.filter(c => c.unreadCount > 0).length} 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  } 
                />
                <Tab icon={<StarIcon />} label="Starred" />
                <Tab icon={<SendIcon />} label="Sent" />
                <Tab icon={<ArchiveIcon />} label="Archived" />
              </Tabs>
            </Paper>
            
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip 
                    label="All Messages" 
                    color="primary" 
                    variant="outlined" 
                    onClick={() => {}} 
                  />
                  <Chip 
                    label="Unread" 
                    variant="outlined" 
                    onClick={() => {}} 
                  />
                  <Chip 
                    label="From Teachers" 
                    variant="outlined" 
                    onClick={() => {}} 
                  />
                  <Chip 
                    label="From Students" 
                    variant="outlined" 
                    onClick={() => {}} 
                  />
                  <Chip 
                    label="From Parents" 
                    variant="outlined" 
                    onClick={() => {}} 
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Paper>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  placeholder="Search messages..."
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
              
              <TabPanel value={tabValue} index={0}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : getTabConversations().length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No messages found.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {getTabConversations().map((conversation, index) => (
                      <React.Fragment key={conversation.id}>
                        <ListItem 
                          alignItems="flex-start" 
                          button 
                          onClick={() => handleOpenConversation(conversation.id)}
                          sx={{ 
                            bgcolor: conversation.unreadCount > 0 ? 'action.hover' : 'inherit',
                            '&:hover': {
                              bgcolor: 'action.selected',
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              {conversation.participants[0].name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography 
                                    component="span" 
                                    variant="body1" 
                                    color="text.primary"
                                    sx={{ fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal' }}
                                  >
                                    {conversation.participants[0].name}
                                  </Typography>
                                  {getRoleChip(conversation.participants[0].role)}
                                </Box>
                                <Typography 
                                  component="span" 
                                  variant="body2" 
                                  color="text.secondary"
                                >
                                  {formatDate(conversation.lastMessage.createdAt)}
                                </Typography>
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
                                    fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal'
                                  }}
                                >
                                  {conversation.lastMessage.content.length > 100 
                                    ? conversation.lastMessage.content.substring(0, 100) + '...' 
                                    : conversation.lastMessage.content
                                  }
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          {conversation.unreadCount > 0 && (
                            <Badge 
                              color="primary" 
                              badgeContent={conversation.unreadCount} 
                              sx={{ ml: 2 }}
                            />
                          )}
                        </ListItem>
                        {index < getTabConversations().length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : getTabConversations().length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No starred messages.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {getTabConversations().map((conversation, index) => (
                      <React.Fragment key={conversation.id}>
                        <ListItem 
                          alignItems="flex-start" 
                          button 
                          onClick={() => handleOpenConversation(conversation.id)}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              {conversation.participants[0].name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography component="span" variant="body1" color="text.primary">
                                    {conversation.participants[0].name}
                                  </Typography>
                                  {getRoleChip(conversation.participants[0].role)}
                                </Box>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {formatDate(conversation.lastMessage.createdAt)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'inline' }}
                                >
                                  {conversation.lastMessage.content.length > 100 
                                    ? conversation.lastMessage.content.substring(0, 100) + '...' 
                                    : conversation.lastMessage.content
                                  }
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <IconButton edge="end" aria-label="unstar">
                            <StarIcon color="warning" />
                          </IconButton>
                        </ListItem>
                        {index < getTabConversations().length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : getTabConversations().length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No sent messages.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {getTabConversations().map((conversation, index) => (
                      <React.Fragment key={conversation.id}>
                        <ListItem 
                          alignItems="flex-start" 
                          button 
                          onClick={() => handleOpenConversation(conversation.id)}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              {conversation.participants[0].name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography component="span" variant="body1" color="text.primary">
                                    To: {conversation.participants[0].name}
                                  </Typography>
                                  {getRoleChip(conversation.participants[0].role)}
                                </Box>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {formatDate(conversation.lastMessage.createdAt)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                  sx={{ display: 'inline' }}
                                >
                                  {conversation.lastMessage.content.length > 100 
                                    ? conversation.lastMessage.content.substring(0, 100) + '...' 
                                    : conversation.lastMessage.content
                                  }
                                </Typography>
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        {index < getTabConversations().length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No archived messages.
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default MessagesPage;

