import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { AnalyticsMetric } from '@/lib/types';

interface MetricCardProps {
  metric: AnalyticsMetric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getIcon = () => {
    switch (metric.icon) {
      case 'person':
        return <PersonIcon />;
      case 'assessment':
        return <AssessmentIcon />;
      case 'school':
        return <SchoolIcon />;
      case 'class':
        return <ClassIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" color="text.secondary">
            {metric.name}
          </Typography>
          <Box
            sx={{
              bgcolor: metric.color || 'primary.main',
              color: 'white',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getIcon()}
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" component="div">
            {metric.value}{metric.unit}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {metric.status === 'positive' ? (
              <TrendingUpIcon fontSize="small" color="success" />
            ) : (
              <TrendingDownIcon fontSize="small" color="error" />
            )}
            <Typography 
              variant="body2" 
              color={metric.status === 'positive' ? 'success.main' : 'error.main'}
              sx={{ ml: 0.5 }}
            >
              {metric.trend > 0 ? '+' : ''}{metric.trend}{metric.unit} {metric.trendPeriod}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;

