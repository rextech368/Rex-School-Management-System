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
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Report, ReportType } from '@/lib/types';

interface ReportCardProps {
  report: Report;
  onView: (reportId: string) => void;
  onRun: (reportId: string) => void;
  onDownload: (reportId: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onRun,
  onDownload,
  onMenuOpen
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case ReportType.ATTENDANCE:
        return <PersonIcon />;
      case ReportType.GRADES:
        return <AssessmentIcon />;
      case ReportType.ENROLLMENT:
        return <PeopleIcon />;
      case ReportType.STUDENT_PERFORMANCE:
        return <SchoolIcon />;
      case ReportType.TEACHER_PERFORMANCE:
        return <SchoolIcon />;
      case ReportType.FINANCIAL:
        return <AttachMoneyIcon />;
      case ReportType.CUSTOM:
        return <AssessmentIcon />;
      default:
        return <AssessmentIcon />;
    }
  };

  const getReportTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.ATTENDANCE:
        return 'primary.main';
      case ReportType.GRADES:
        return 'success.main';
      case ReportType.ENROLLMENT:
        return 'info.main';
      case ReportType.STUDENT_PERFORMANCE:
        return 'warning.main';
      case ReportType.TEACHER_PERFORMANCE:
        return 'secondary.main';
      case ReportType.FINANCIAL:
        return 'error.main';
      case ReportType.CUSTOM:
        return 'text.primary';
      default:
        return 'text.primary';
    }
  };

  const getReportTypeChip = (type: ReportType) => {
    let label = '';
    let color: 'error' | 'primary' | 'success' | 'warning' | 'info' | 'secondary' | 'default' = 'default';
    
    switch (type) {
      case ReportType.ATTENDANCE:
        label = 'Attendance';
        color = 'primary';
        break;
      case ReportType.GRADES:
        label = 'Grades';
        color = 'success';
        break;
      case ReportType.ENROLLMENT:
        label = 'Enrollment';
        color = 'info';
        break;
      case ReportType.STUDENT_PERFORMANCE:
        label = 'Student Performance';
        color = 'warning';
        break;
      case ReportType.TEACHER_PERFORMANCE:
        label = 'Teacher Performance';
        color = 'secondary';
        break;
      case ReportType.FINANCIAL:
        label = 'Financial';
        color = 'error';
        break;
      case ReportType.CUSTOM:
        label = 'Custom';
        color = 'default';
        break;
    }
    
    return (
      <Chip 
        label={label} 
        color={color} 
        size="small" 
        sx={{ ml: 1 }}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                bgcolor: getReportTypeColor(report.type),
                color: 'white',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              {getReportTypeIcon(report.type)}
            </Box>
            <Box>
              <Typography variant="h6" component="h2">
                {report.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                {getReportTypeChip(report.type)}
                {report.schedule && (
                  <Chip 
                    icon={<ScheduleIcon />} 
                    label="Scheduled" 
                    size="small" 
                    variant="outlined" 
                    sx={{ ml: 1 }} 
                  />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton
            aria-label="more"
            onClick={(e) => onMenuOpen(e, report.id)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {report.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Created:
          </Typography>
          <Typography variant="body2">
            {formatDate(report.createdAt)}
          </Typography>
        </Box>
        
        {report.lastRunAt && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Last Run:
            </Typography>
            <Typography variant="body2">
              {formatDate(report.lastRunAt)}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Button 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={() => onView(report.id)}
        >
          View
        </Button>
        <Button 
          size="small" 
          startIcon={<AssessmentIcon />}
          onClick={() => onRun(report.id)}
        >
          Run Report
        </Button>
        <Button 
          size="small" 
          startIcon={<DownloadIcon />}
          onClick={() => onDownload(report.id)}
        >
          Download
        </Button>
      </CardActions>
    </Card>
  );
};

export default ReportCard;

