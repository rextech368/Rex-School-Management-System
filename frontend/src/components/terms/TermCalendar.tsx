import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Term } from '@/lib/types';

interface TermCalendarProps {
  terms: Term[];
  onTermClick?: (termId: string) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    type: string;
    termId?: string;
    description?: string;
  };
}

const TermCalendar: React.FC<TermCalendarProps> = ({
  terms,
  onTermClick
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const termEvents: CalendarEvent[] = [];
      
      // Add term periods to calendar
      terms.forEach(term => {
        // Term period
        termEvents.push({
          id: `term-${term.id}`,
          title: term.name,
          start: term.startDate,
          end: term.endDate,
          allDay: true,
          backgroundColor: term.isCurrent ? '#1976d2' : '#90caf9',
          borderColor: term.isCurrent ? '#1565c0' : '#64b5f6',
          textColor: '#fff',
          extendedProps: {
            type: 'term',
            termId: term.id,
            description: term.description
          }
        });
        
        // Registration period
        if (term.registrationStart && term.registrationEnd) {
          termEvents.push({
            id: `registration-${term.id}`,
            title: `${term.name} Registration`,
            start: term.registrationStart,
            end: term.registrationEnd,
            allDay: true,
            backgroundColor: '#4caf50',
            borderColor: '#2e7d32',
            textColor: '#fff',
            extendedProps: {
              type: 'registration',
              termId: term.id
            }
          });
        }
        
        // Term events
        if (term.events && term.events.length > 0) {
          term.events.forEach(event => {
            const eventColor = 
              event.type === 'holiday' ? '#f44336' :
              event.type === 'deadline' ? '#ff9800' :
              event.type === 'event' ? '#2196f3' :
              '#9e9e9e';
            
            const eventBorderColor = 
              event.type === 'holiday' ? '#d32f2f' :
              event.type === 'deadline' ? '#f57c00' :
              event.type === 'event' ? '#1976d2' :
              '#757575';
            
            termEvents.push({
              id: `event-${event.id}`,
              title: event.name,
              start: event.date,
              end: event.date,
              allDay: true,
              backgroundColor: eventColor,
              borderColor: eventBorderColor,
              textColor: '#fff',
              extendedProps: {
                type: event.type,
                termId: term.id,
                description: event.description
              }
            });
          });
        }
      });
      
      setEvents(termEvents);
    } catch (err) {
      console.error('Error preparing calendar events:', err);
      setError('Failed to prepare calendar events.');
    } finally {
      setLoading(false);
    }
  }, [terms]);

  const handleEventClick = (info: any) => {
    const eventType = info.event.extendedProps.type;
    const termId = info.event.extendedProps.termId;
    
    if (eventType === 'term' && onTermClick && termId) {
      onTermClick(termId);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const eventType = eventInfo.event.extendedProps.type;
    
    return (
      <Tooltip title={eventInfo.event.extendedProps.description || eventInfo.event.title}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
          <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
            {eventInfo.event.title}
          </Typography>
          {eventType && (
            <Chip 
              label={eventType} 
              size="small" 
              sx={{ 
                height: 16, 
                fontSize: '0.625rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'inherit'
              }} 
            />
          )}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 2, height: '700px', overflow: 'auto' }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridYear'
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: 'numeric', month: 'long' }
              },
              dayGridYear: {
                duration: { years: 1 },
                titleFormat: { year: 'numeric' }
              }
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
          />
        </Paper>
      )}
    </Box>
  );
};

export default TermCalendar;

