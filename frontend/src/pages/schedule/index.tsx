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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewListIcon from '@mui/icons-material/ViewList';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ScheduleCalendar from '@/components/schedule/ScheduleCalendar';
import ClassList from '@/components/schedule/ClassList';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term } from '@/lib/types';

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
      id={`schedule-tabpanel-${index}`}
      aria-labelledby={`schedule-tab-${index}`}
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

const SchedulePage: NextPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [classes, setClasses] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  const canManageClasses = user?.role === Role.ADMIN || user?.role === Role.REGISTRAR;

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/terms');
        
        if (!response.ok) {
          throw new Error('Failed to fetch terms');
        }
        
        const data = await response.json();
        setTerms(data);
        
        // Set current term as default if available
        const currentTerm = data.find((term: Term) => term.isCurrent);
        if (currentTerm) {
          setSelectedTerm(currentTerm.id);
        } else if (data.length > 0) {
          setSelectedTerm(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError('Failed to load terms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    if (!selectedTerm) return;

    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/classes?termId=${selectedTerm}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [selectedTerm]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTermChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTerm(event.target.value as string);
  };

  const handleCreateClass = () => {
    router.push('/classes/new');
  };

  const handleBatchOperations = () => {
    router.push('/schedule/batch');
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Class Scheduling & Management
          </Typography>
          
          {canManageClasses && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCreateClass}
              >
                Create Class
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleBatchOperations}
              >
                Batch Operations
              </Button>
            </Box>
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="term-select-label">Academic Term</InputLabel>
              <Select
                labelId="term-select-label"
                id="term-select"
                value={selectedTerm}
                label="Academic Term"
                onChange={handleTermChange}
                disabled={loading || terms.length === 0}
              >
                {terms.map((term) => (
                  <MenuItem key={term.id} value={term.id}>
                    {term.name} {term.isCurrent && '(Current)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<CalendarMonthIcon />} label="Calendar View" />
            <Tab icon={<ViewListIcon />} label="List View" />
          </Tabs>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                <ScheduleCalendar 
                  classes={classes} 
                  termId={selectedTerm} 
                  canEdit={canManageClasses} 
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <ClassList 
                  classes={classes} 
                  termId={selectedTerm} 
                  canEdit={canManageClasses} 
                />
              </TabPanel>
            </>
          )}
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default SchedulePage;

