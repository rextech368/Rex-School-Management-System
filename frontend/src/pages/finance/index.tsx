import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
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
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
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

const FinancePage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  // Check if user has permission to access finance module
  const isAuthorized = user?.role === 'admin' || user?.role === 'finance_admin' || user?.role === 'finance_staff';

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateInvoice = () => {
    router.push('/finance/invoices/create');
  };

  const handleCreateFee = () => {
    router.push('/finance/fees/create');
  };

  const handleRecordPayment = () => {
    router.push('/finance/payments/create');
  };

  const handleManageScholarships = () => {
    router.push('/finance/scholarships');
  };

  const handleFinanceSettings = () => {
    router.push('/finance/settings');
  };

  // If user is not authorized to access finance module
  if (!isAuthorized) {
    return <AccessDenied />;
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Financial Management
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<ReceiptIcon />}
              onClick={handleCreateInvoice}
              sx={{ mr: 1 }}
            >
              Create Invoice
            </Button>
            <Button
              variant="outlined"
              startIcon={<PaymentIcon />}
              onClick={handleRecordPayment}
              sx={{ mr: 1 }}
            >
              Record Payment
            </Button>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={handleFinanceSettings}
            >
              Settings
            </Button>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Dashboard" icon={<AttachMoneyIcon />} iconPosition="start" />
            <Tab label="Invoices" icon={<ReceiptIcon />} iconPosition="start" />
            <Tab label="Payments" icon={<PaymentIcon />} iconPosition="start" />
            <Tab label="Fees" icon={<AccountBalanceIcon />} iconPosition="start" />
            <Tab label="Scholarships" icon={<SchoolIcon />} iconPosition="start" />
            <Tab label="Reports" icon={<DownloadIcon />} iconPosition="start" />
          </Tabs>
        </Paper>
        
        <TabPanel value={tabValue} index={0}>
          {renderFinanceDashboard()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {renderInvoicesTab()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {renderPaymentsTab()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          {renderFeesTab()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          {renderScholarshipsTab()}
        </TabPanel>
        
        <TabPanel value={tabValue} index={5}>
          {renderReportsTab()}
        </TabPanel>
      </Container>
    </DashboardLayout>
  );

  function renderFinanceDashboard() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: 'success.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AttachMoneyIcon />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h4" component="div">
                    $1,250,000
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Academic Year
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Outstanding
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: 'warning.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ReceiptIcon />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h4" component="div">
                    $125,000
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    10% of Total Revenue
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Collection Rate
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PaymentIcon />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h4" component="div">
                    90%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Academic Year
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" color="text.secondary">
                    Scholarships
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: 'info.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SchoolIcon />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h4" component="div">
                    $175,000
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    14% of Total Revenue
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Recent Transactions" />
              <Divider />
              <CardContent>
                <Alert severity="info">
                  Transaction history will be implemented in the next phase.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardHeader title="Revenue by Fee Type" />
              <Divider />
              <CardContent>
                <Alert severity="info">
                  Revenue breakdown chart will be implemented in the next phase.
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader title="Outstanding by Grade Level" />
              <Divider />
              <CardContent>
                <Alert severity="info">
                  Outstanding balance chart will be implemented in the next phase.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }

  function renderInvoicesTab() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Invoices
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateInvoice}
          >
            Create Invoice
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search invoices by student name, invoice number, or status"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Alert severity="info">
          Invoice management interface will be implemented in the next phase.
        </Alert>
      </>
    );
  }

  function renderPaymentsTab() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Payments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleRecordPayment}
          >
            Record Payment
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search payments by student name, receipt number, or payment method"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Alert severity="info">
          Payment management interface will be implemented in the next phase.
        </Alert>
      </>
    );
  }

  function renderFeesTab() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Fee Structure
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateFee}
          >
            Create Fee
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search fees by name, type, or frequency"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Alert severity="info">
          Fee structure management interface will be implemented in the next phase.
        </Alert>
      </>
    );
  }

  function renderScholarshipsTab() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Scholarships & Financial Aid
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleManageScholarships}
          >
            Create Scholarship
          </Button>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search scholarships by name, type, or status"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Alert severity="info">
          Scholarship management interface will be implemented in the next phase.
        </Alert>
      </>
    );
  }

  function renderReportsTab() {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    return (
      <>
        <Typography variant="h5" component="h2" gutterBottom>
          Financial Reports
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Report
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Analyze revenue by fee type, grade level, and time period.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Outstanding Balances
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View outstanding balances by student, grade level, or due date.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Payment Collection
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Analyze payment collection rates and methods over time.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Scholarship Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View scholarship allocation by type, grade level, and student.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Comprehensive financial summary for the selected time period.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Custom Report
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create a custom financial report with selected parameters.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Create Custom Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
};

export default FinancePage;

