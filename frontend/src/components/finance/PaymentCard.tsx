import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RefundIcon from '@mui/icons-material/AssignmentReturn';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Payment, PaymentStatus, PaymentMethod } from '@/lib/types/finance';

interface PaymentCardProps {
  payment: Payment;
  onView: (paymentId: string) => void;
  onRefund: (paymentId: string) => void;
  onDownload: (paymentId: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, paymentId: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onView,
  onRefund,
  onDownload,
  onMenuOpen
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getStatusChip = (status: PaymentStatus) => {
    let color: 'error' | 'success' | 'warning' | 'info' | 'default' = 'default';
    
    switch (status) {
      case PaymentStatus.COMPLETED:
        color = 'success';
        break;
      case PaymentStatus.PENDING:
        color = 'warning';
        break;
      case PaymentStatus.PROCESSING:
        color = 'info';
        break;
      case PaymentStatus.FAILED:
      case PaymentStatus.CANCELLED:
        color = 'error';
        break;
      case PaymentStatus.REFUNDED:
      case PaymentStatus.PARTIALLY_REFUNDED:
        color = 'default';
        break;
    }
    
    return (
      <Chip 
        label={status.toUpperCase().replace('_', ' ')} 
        color={color} 
        size="small" 
      />
    );
  };

  const getPaymentMethodChip = (method: PaymentMethod) => {
    let label = '';
    
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
        label = 'Credit Card';
        break;
      case PaymentMethod.DEBIT_CARD:
        label = 'Debit Card';
        break;
      case PaymentMethod.BANK_TRANSFER:
        label = 'Bank Transfer';
        break;
      case PaymentMethod.CASH:
        label = 'Cash';
        break;
      case PaymentMethod.CHECK:
        label = 'Check';
        break;
      case PaymentMethod.ONLINE_PAYMENT:
        label = 'Online Payment';
        break;
      case PaymentMethod.MOBILE_PAYMENT:
        label = 'Mobile Payment';
        break;
      case PaymentMethod.OTHER:
        label = 'Other';
        break;
    }
    
    return (
      <Chip 
        label={label} 
        variant="outlined"
        size="small" 
      />
    );
  };

  const canRefund = payment.status === PaymentStatus.COMPLETED;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h2">
              {payment.receiptNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {payment.studentName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusChip(payment.status)}
            <IconButton
              aria-label="more"
              onClick={(e) => onMenuOpen(e, payment.id)}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Payment Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(payment.paymentDate)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Amount:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(payment.amount, payment.currency)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Payment Method:
          </Typography>
          <Box>
            {getPaymentMethodChip(payment.paymentMethod)}
          </Box>
        </Box>
        
        {payment.invoiceId && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Invoice:
            </Typography>
            <Typography variant="body2">
              {payment.invoiceId}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={() => onView(payment.id)}
        >
          View
        </Button>
        {canRefund && (
          <Button 
            size="small" 
            startIcon={<RefundIcon />}
            onClick={() => onRefund(payment.id)}
            color="warning"
          >
            Refund
          </Button>
        )}
        <Button 
          size="small" 
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(payment.id)}
        >
          Receipt
        </Button>
      </CardActions>
    </Card>
  );
};

export default PaymentCard;

