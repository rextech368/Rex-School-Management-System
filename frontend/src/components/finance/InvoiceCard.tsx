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
import PaymentIcon from '@mui/icons-material/Payment';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Invoice, InvoiceStatus } from '@/lib/types/finance';

interface InvoiceCardProps {
  invoice: Invoice;
  onView: (invoiceId: string) => void;
  onPay: (invoiceId: string) => void;
  onDownload: (invoiceId: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, invoiceId: string) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onView,
  onPay,
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

  const getStatusChip = (status: InvoiceStatus) => {
    let color: 'error' | 'success' | 'warning' | 'info' | 'default' = 'default';
    
    switch (status) {
      case InvoiceStatus.PAID:
        color = 'success';
        break;
      case InvoiceStatus.PARTIALLY_PAID:
        color = 'info';
        break;
      case InvoiceStatus.OVERDUE:
        color = 'error';
        break;
      case InvoiceStatus.SENT:
        color = 'warning';
        break;
      case InvoiceStatus.DRAFT:
        color = 'default';
        break;
      case InvoiceStatus.CANCELLED:
      case InvoiceStatus.VOID:
        color = 'error';
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

  const isPaid = invoice.status === InvoiceStatus.PAID;
  const isCancelled = invoice.status === InvoiceStatus.CANCELLED || invoice.status === InvoiceStatus.VOID;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h2">
              {invoice.invoiceNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {invoice.studentName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusChip(invoice.status)}
            <IconButton
              aria-label="more"
              onClick={(e) => onMenuOpen(e, invoice.id)}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Issue Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(invoice.issueDate)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Due Date:
          </Typography>
          <Typography variant="body2">
            {formatDate(invoice.dueDate)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Total:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(invoice.total, invoice.currency)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Amount Due:
          </Typography>
          <Typography 
            variant="body2" 
            fontWeight="bold"
            color={invoice.amountDue > 0 ? 'error.main' : 'success.main'}
          >
            {formatCurrency(invoice.amountDue, invoice.currency)}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={() => onView(invoice.id)}
        >
          View
        </Button>
        {!isPaid && !isCancelled && (
          <Button 
            size="small" 
            startIcon={<PaymentIcon />}
            onClick={() => onPay(invoice.id)}
            color="primary"
          >
            Pay
          </Button>
        )}
        <Button 
          size="small" 
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(invoice.id)}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
};

export default InvoiceCard;

