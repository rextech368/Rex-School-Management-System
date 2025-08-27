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
  IconButton,
  Divider,
  Avatar,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ArchiveIcon from '@mui/icons-material/Archive';
import ReplyIcon from '@mui/icons-material/Reply';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import ForwardIcon from '@mui/icons-material/Forward';
import DownloadIcon from '@mui/icons-material/Download';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Message, Attachment } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';

const MessageDetailPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!id || Array.isArray(id)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch the conversation from the API
        // const response = await fetch(`/api/messages/conversations/${id}`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch conversation');
        // }
        // const data = await response.json();
        // setConversation(data.messages);
        // setIsStarred(data.isStarred);
        // setIsArchived(data.isArchived);
        
        // For demo purposes, set mock data
        const mockConversation: Message[] = [
          {
            id: '1',
            senderId: '2',
            senderName: 'John Smith',
            senderRole: Role.TEACHER,
            recipientId: user?.id || '',
            recipientName: user?.name || '',
            recipientRole: user?.role || Role.STUDENT,
            subject: 'Parent-Teacher Conference',
            content: 'Hello, I wanted to discuss the upcoming parent-teacher conference. We have scheduled it for next Friday at 3:00 PM. Please let me know if this time works for you.',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: '2',
            senderId: user?.id || '',
            senderName: user?.name || '',
            senderRole: user?.role || Role.STUDENT,
            recipientId: '2',
            recipientName: 'John Smith',
            recipientRole: Role.TEACHER,
            subject: 'Re: Parent-Teacher Conference',
            content: 'Thank you for the information. The scheduled time works for me. I look forward to discussing my progress in your class.',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
          },
          {
            id: '3',
            senderId: '2',
            senderName: 'John Smith',
            senderRole: Role.TEACHER,
            recipientId: user?.id || '',
            recipientName: user?.name || '',
            recipientRole: user?.role || Role.STUDENT,
            subject: 'Re: Parent-Teacher Conference',
            content: 'Great! I will prepare a detailed report on your academic progress for our discussion. Please come prepared with any questions or concerns you may have.',
            attachments: [
              {
                id: '1',
                name: 'progress_report.pdf',
                type: 'application/pdf',
                size: 1024 * 1024 * 2.5, // 2.5 MB
                url: '#',
                uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
                uploadedBy: '2'
              }
            ],
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
          }
        ];
        
        setConversation(mockConversation);
        setIsStarred(false);
        setIsArchived(false);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching conversation:', err);
        setError('Failed to load conversation. Please try again later.');
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id, user]);

  useEffect(() => {
    // Scroll to bottom when conversation changes
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleBack = () => {
    router.push('/messages');
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

  const handleToggleStar = async () => {
    try {
      // In a real application, you would update the star status in the API
      // const response = await fetch(`/api/messages/conversations/${id}/star`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ isStarred: !isStarred }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update star status');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsStarred(!isStarred);
    } catch (err) {
      console.error('Error updating star status:', err);
      setError('Failed to update star status. Please try again later.');
    }
  };

  const handleToggleArchive = async () => {
    try {
      // In a real application, you would update the archive status in the API
      // const response = await fetch(`/api/messages/conversations/${id}/archive`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ isArchived: !isArchived }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update archive status');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsArchived(!isArchived);
      
      // If archiving, redirect to messages page after a short delay
      if (!isArchived) {
        setTimeout(() => {
          router.push('/messages');
        }, 1000);
      }
    } catch (err) {
      console.error('Error updating archive status:', err);
      setError('Failed to update archive status. Please try again later.');
    }
  };

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!replyMessage.trim()) {
      setError('Please enter a message.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // In a real application, you would submit the reply to the API
      // const formData = new FormData();
      // formData.append('conversationId', id as string);
      // formData.append('message', replyMessage);
      // files.forEach(file => formData.append('files', file));
      
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to send reply');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the new message to the conversation
      const newMessage: Message = {
        id: `new-${Date.now()}`,
        senderId: user?.id || '',
        senderName: user?.name || '',
        senderRole: user?.role || Role.STUDENT,
        recipientId: conversation[0].senderId,
        recipientName: conversation[0].senderName,
        recipientRole: conversation[0].senderRole,
        subject: `Re: ${conversation[0].subject}`,
        content: replyMessage,
        attachments: files.length > 0 ? files.map((file, index) => ({
          id: `new-attachment-${index}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: '#',
          uploadedAt: new Date().toISOString(),
          uploadedBy: user?.id || ''
        })) : undefined,
        isRead: true,
        createdAt: new Date().toISOString(),
      };
      
      setConversation(prev => [...prev, newMessage]);
      setSuccess('Reply sent successfully!');
      
      // Reset form
      setReplyMessage('');
      setFiles([]);
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('Failed to send reply. Please try again later.');
    } finally {
      setSubmitting(false);
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
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Messages
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {conversation.length > 0 ? conversation[0].subject : 'Message'}
            </Typography>
            <Box>
              <IconButton onClick={handleToggleStar} color={isStarred ? 'warning' : 'default'}>
                {isStarred ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              <IconButton onClick={handleToggleArchive} color={isArchived ? 'primary' : 'default'}>
                <ArchiveIcon />
              </IconButton>
              <IconButton onClick={() => router.push(`/messages/compose?recipientId=${conversation[0]?.senderId}`)}>
                <ReplyIcon />
              </IconButton>
              <IconButton onClick={() => router.push(`/messages/compose?recipientId=${conversation[0]?.senderId}`)}>
                <ForwardIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : conversation.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Conversation not found.
          </Alert>
        ) : (
          <Paper sx={{ p: 3, mb: 3 }}>
            <List>
              {conversation.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getRoleColor(message.senderRole) }}>
                          {message.senderName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1" component="span">
                              {message.senderName}
                            </Typography>
                            {getRoleChip(message.senderRole)}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(message.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          To: {message.recipientName}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ pl: 7, width: '100%' }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                        {message.content}
                      </Typography>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Attachments:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {message.attachments.map((attachment) => (
                              <Chip
                                key={attachment.id}
                                label={`${attachment.name} (${formatFileSize(attachment.size)})`}
                                icon={<AttachFileIcon />}
                                onClick={() => {}}
                                deleteIcon={<DownloadIcon />}
                                onDelete={() => {}}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                  {index < conversation.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Paper>
        )}
        
        {!loading && conversation.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reply
            </Typography>
            <form onSubmit={handleReply}>
              <TextField
                fullWidth
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                multiline
                rows={5}
                required
                disabled={submitting}
                sx={{ mb: 2 }}
              />
              
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
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Reply'}
                </Button>
              </Box>
            </form>
          </Paper>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default MessageDetailPage;

