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
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term } from '@/lib/types';
import TermList from '@/components/terms/TermList';
import TermCalendar from '@/components/terms/TermCalendar';
import AccessDenied from '@/components/layouts/AccessDenied';

const TermsPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/terms');
        
        if (!response.ok) {
          throw new Error('Failed to fetch terms');
        }
        
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError('Failed to load terms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const handleCreateTerm = () => {
    router.push('/terms/new');
  };

  const handleEditTerm = (termId: string) => {
    router.push(`/terms/${termId}/edit`);
  };

  const handleViewTerm = (termId: string) => {
    router.push(`/terms/${termId}`);
  };

  const handleDeleteTerm = async (termId: string) => {
    if (!confirm('Are you sure you want to delete this term? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/terms/${termId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete term');
      }
      
      // Remove the deleted term from the list
      setTerms(terms.filter(term => term.id !== termId));
    } catch (err) {
      console.error('Error deleting term:', err);
      setError('Failed to delete term. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'calendar' : 'list');
  };

  // Check if user has permission to access this page
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Academic Terms
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={viewMode === 'list' ? <CalendarTodayIcon /> : <ListIcon />}
              onClick={handleToggleViewMode}
              sx={{ mr: 2 }}
            >
              {viewMode === 'list' ? 'Calendar View' : 'List View'}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTerm}
            >
              Create Term
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : terms.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No academic terms found. Click the "Create Term" button to add a new term.
          </Alert>
        ) : viewMode === 'list' ? (
          <TermList 
            terms={terms} 
            onEdit={handleEditTerm} 
            onDelete={handleDeleteTerm} 
            onView={handleViewTerm} 
          />
        ) : (
          <TermCalendar terms={terms} onTermClick={handleViewTerm} />
        )}
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Create New Term
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set up a new academic term with custom dates, registration periods, and settings.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={handleCreateTerm}>
                    Create Term
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Term Transition
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copy classes from one term to another and manage term transitions.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => router.push('/schedule/batch')}>
                    Manage Transition
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Academic Calendar
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage the academic calendar with important dates and events.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => setViewMode('calendar')}>
                    View Calendar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default TermsPage;

