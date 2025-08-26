import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Chip,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import HistoryIcon from '@mui/icons-material/History';
import { Student } from '@/lib/types';

interface StudentHistoryProps {
  student: Student;
}

interface HistoryEvent {
  id: string;
  date: string;
  type: 'enrollment' | 'grade' | 'attendance' | 'discipline' | 'achievement' | 'other';
  title: string;
  description: string;
}

const StudentHistory: React.FC<StudentHistoryProps> = ({ student }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would fetch this data from the API
        // const response = await fetch(`/api/students/${student.id}/history`);
        // if (!response.ok) {
        //   throw new Error('Failed to fetch student history');
        // }
        // const data = await response.json();
        // setHistoryEvents(data);
        
        // For demo purposes, set mock data
        setHistoryEvents([
          {
            id: '1',
            date: '2023-08-15',
            type: 'enrollment',
            title: 'Enrolled in School',
            description: 'Student enrolled in the school for the 2023-2024 academic year.'
          },
          {
            id: '2',
            date: '2023-08-20',
            type: 'enrollment',
            title: 'Class Registration',
            description: 'Registered for 5 classes for the Fall 2023 term.'
          },
          {
            id: '3',
            date: '2023-09-05',
            type: 'attendance',
            title: 'First Day of School',
            description: 'Attended first day of classes for the Fall 2023 term.'
          },
          {
            id: '4',
            date: '2023-10-15',
            type: 'grade',
            title: 'Mid-term Grades',
            description: 'Received mid-term grades for Fall 2023 term. Overall GPA: 3.7'
          },
          {
            id: '5',
            date: '2023-11-10',
            type: 'achievement',
            title: 'Honor Roll',
            description: 'Qualified for the Honor Roll for academic excellence.'
          }
        ]);
      } catch (err) {
        console.error('Error fetching student history:', err);
        setError('Failed to load student history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [student.id]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <SchoolIcon />;
      case 'grade':
        return <GradeIcon />;
      case 'attendance':
        return <EventIcon />;
      case 'achievement':
        return <AssignmentIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'primary';
      case 'grade':
        return 'success';
      case 'attendance':
        return 'info';
      case 'discipline':
        return 'error';
      case 'achievement':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Typography variant="h6" gutterBottom>
        Student History
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        A chronological record of the student's academic journey, including enrollments, achievements, and key events.
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : historyEvents.length === 0 ? (
        <Alert severity="info">
          No history records found for this student.
        </Alert>
      ) : (
        <Timeline position="alternate">
          {historyEvents
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((event) => (
              <TimelineItem key={event.id}>
                <TimelineOppositeContent color="text.secondary">
                  {new Date(event.date).toLocaleDateString()}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={getEventColor(event.type) as any}>
                    {getEventIcon(event.type)}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" component="h3">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                    <Chip 
                      label={event.type.charAt(0).toUpperCase() + event.type.slice(1)} 
                      color={getEventColor(event.type) as any} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      )}
    </Box>
  );
};

export default StudentHistory;

