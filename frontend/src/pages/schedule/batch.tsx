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
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  FormHelperText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Role, Term, Course } from '@/lib/types';
import AccessDenied from '@/components/layouts/AccessDenied';
import BatchClassCreation from '@/components/schedule/BatchClassCreation';
import BatchScheduleAdjustment from '@/components/schedule/BatchScheduleAdjustment';
import BatchTermTransition from '@/components/schedule/BatchTermTransition';

const steps = ['Select Operation', 'Configure', 'Review & Submit'];

const BatchOperationsPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationType, setOperationType] = useState<string>('');
  const [terms, setTerms] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [batchConfig, setBatchConfig] = useState<any>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setOperationType('');
    setBatchConfig({});
    setSubmitSuccess(false);
  };

  const handleOperationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOperationType(event.target.value as string);
    setBatchConfig({});
  };

  const handleTermChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTerm(event.target.value as string);
  };

  const handleConfigChange = (config: any) => {
    setBatchConfig(config);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let endpoint = '';
      let method = 'POST';
      
      switch (operationType) {
        case 'class-creation':
          endpoint = '/api/classes/batch';
          break;
        case 'schedule-adjustment':
          endpoint = '/api/classes/schedule/batch';
          break;
        case 'term-transition':
          endpoint = '/api/terms/transition';
          break;
        default:
          throw new Error('Invalid operation type');
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          termId: selectedTerm,
          ...batchConfig
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to perform batch operation');
      }
      
      setSubmitSuccess(true);
      handleNext();
    } catch (err) {
      console.error('Error performing batch operation:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnToSchedule = () => {
    router.push('/schedule');
  };

  if (!canManageClasses) {
    return <AccessDenied />;
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Batch Operation Type
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="operation-type-label">Operation Type</InputLabel>
              <Select
                labelId="operation-type-label"
                id="operation-type"
                value={operationType}
                label="Operation Type"
                onChange={handleOperationTypeChange}
              >
                <MenuItem value="class-creation">Bulk Class Creation</MenuItem>
                <MenuItem value="schedule-adjustment">Mass Schedule Adjustments</MenuItem>
                <MenuItem value="term-transition">Term Transition</MenuItem>
              </Select>
              <FormHelperText>
                Select the type of batch operation you want to perform
              </FormHelperText>
            </FormControl>
            
            {operationType && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select Term
                </Typography>
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
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configure Batch Operation
            </Typography>
            
            {operationType === 'class-creation' && (
              <BatchClassCreation 
                termId={selectedTerm} 
                onChange={handleConfigChange} 
              />
            )}
            
            {operationType === 'schedule-adjustment' && (
              <BatchScheduleAdjustment 
                termId={selectedTerm} 
                onChange={handleConfigChange} 
              />
            )}
            
            {operationType === 'term-transition' && (
              <BatchTermTransition 
                termId={selectedTerm} 
                onChange={handleConfigChange} 
              />
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review and Submit
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardHeader title="Operation Summary" />
              <CardContent>
                <Typography variant="subtitle1">
                  Operation Type: {operationType === 'class-creation' 
                    ? 'Bulk Class Creation' 
                    : operationType === 'schedule-adjustment'
                    ? 'Mass Schedule Adjustments'
                    : 'Term Transition'}
                </Typography>
                
                <Typography variant="subtitle1">
                  Term: {terms.find(t => t.id === selectedTerm)?.name || selectedTerm}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                {operationType === 'class-creation' && (
                  <>
                    <Typography variant="subtitle1">
                      Courses to create classes for: {batchConfig.courses?.length || 0}
                    </Typography>
                    <Typography variant="subtitle1">
                      Sections per course: {batchConfig.sectionsPerCourse || 1}
                    </Typography>
                  </>
                )}
                
                {operationType === 'schedule-adjustment' && (
                  <>
                    <Typography variant="subtitle1">
                      Classes to adjust: {batchConfig.classes?.length || 0}
                    </Typography>
                    <Typography variant="subtitle1">
                      Adjustment type: {batchConfig.adjustmentType || 'N/A'}
                    </Typography>
                  </>
                )}
                
                {operationType === 'term-transition' && (
                  <>
                    <Typography variant="subtitle1">
                      Source Term: {terms.find(t => t.id === selectedTerm)?.name || selectedTerm}
                    </Typography>
                    <Typography variant="subtitle1">
                      Target Term: {terms.find(t => t.id === batchConfig.targetTermId)?.name || batchConfig.targetTermId}
                    </Typography>
                    <Typography variant="subtitle1">
                      Classes to transition: {batchConfig.classes?.length || 0}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              This operation will affect multiple classes and cannot be easily undone.
              Please review carefully before proceeding.
            </Alert>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Batch Operation {submitSuccess ? 'Completed Successfully' : 'Failed'}
            </Typography>
            
            {submitSuccess ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                The batch operation has been completed successfully.
              </Alert>
            ) : (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || 'An error occurred during the batch operation.'}
              </Alert>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                onClick={handleReturnToSchedule}
                sx={{ mr: 2 }}
              >
                Return to Schedule
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleReset}
              >
                Perform Another Batch Operation
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const isNextDisabled = () => {
    if (activeStep === 0) {
      return !operationType || !selectedTerm;
    }
    if (activeStep === 1) {
      if (operationType === 'class-creation') {
        return !batchConfig.courses || batchConfig.courses.length === 0;
      }
      if (operationType === 'schedule-adjustment') {
        return !batchConfig.classes || batchConfig.classes.length === 0 || !batchConfig.adjustmentType;
      }
      if (operationType === 'term-transition') {
        return !batchConfig.targetTermId || !batchConfig.classes || batchConfig.classes.length === 0;
      }
      return true;
    }
    return false;
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleReturnToSchedule}
            sx={{ mb: 2 }}
          >
            Back to Schedule
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Batch Class Operations
          </Typography>
        </Box>

        {error && activeStep !== 3 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && activeStep < 3 && (
              <Button 
                onClick={handleBack} 
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Back
              </Button>
            )}
            
            {activeStep < 2 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isNextDisabled() || loading}
              >
                Next
              </Button>
            ) : activeStep === 2 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Submit
              </Button>
            ) : null}
          </Box>
        </Paper>
      </Container>
    </DashboardLayout>
  );
};

export default BatchOperationsPage;

