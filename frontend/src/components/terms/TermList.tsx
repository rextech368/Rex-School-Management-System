import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Term, TermType } from '@/lib/types';

interface TermListProps {
  terms: Term[];
  onEdit: (termId: string) => void;
  onDelete: (termId: string) => void;
  onView: (termId: string) => void;
}

const TermList: React.FC<TermListProps> = ({
  terms,
  onEdit,
  onDelete,
  onView
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Filter terms based on search term and filters
  const filteredTerms = terms.filter(term => {
    const matchesSearch = 
      searchTerm === '' || 
      term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (term.academicYear && term.academicYear.includes(searchTerm));
    
    const matchesType = 
      typeFilter === '' || 
      term.type === typeFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'current') {
      matchesStatus = term.isCurrent;
    } else if (statusFilter === 'active') {
      matchesStatus = term.isActive;
    } else if (statusFilter === 'inactive') {
      matchesStatus = !term.isActive;
    } else if (statusFilter === 'upcoming') {
      matchesStatus = new Date(term.startDate) > new Date();
    } else if (statusFilter === 'past') {
      matchesStatus = new Date(term.endDate) < new Date();
    } else if (statusFilter === 'ongoing') {
      const now = new Date();
      matchesStatus = new Date(term.startDate) <= now && new Date(term.endDate) >= now;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const paginatedTerms = filteredTerms.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Get term status for display
  const getTermStatus = (term: Term) => {
    const now = new Date();
    const startDate = new Date(term.startDate);
    const endDate = new Date(term.endDate);
    
    if (!term.isActive) {
      return { label: 'Inactive', color: 'default' };
    } else if (now < startDate) {
      return { label: 'Upcoming', color: 'info' };
    } else if (now > endDate) {
      return { label: 'Completed', color: 'secondary' };
    } else {
      return { label: 'In Progress', color: 'success' };
    }
  };

  // Get registration status for display
  const getRegistrationStatus = (term: Term) => {
    if (!term.registrationStart || !term.registrationEnd) {
      return { label: 'Not Configured', color: 'default' };
    }
    
    const now = new Date();
    const regStart = new Date(term.registrationStart);
    const regEnd = new Date(term.registrationEnd);
    
    if (now < regStart) {
      return { label: 'Not Started', color: 'default' };
    } else if (now > regEnd) {
      return { label: 'Closed', color: 'error' };
    } else {
      return { label: 'Open', color: 'success' };
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search Terms"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="term-type-filter-label">Type</InputLabel>
          <Select
            labelId="term-type-filter-label"
            value={typeFilter}
            label="Type"
            onChange={handleTypeFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value={TermType.SEMESTER}>Semester</MenuItem>
            <MenuItem value={TermType.QUARTER}>Quarter</MenuItem>
            <MenuItem value={TermType.TRIMESTER}>Trimester</MenuItem>
            <MenuItem value={TermType.SUMMER}>Summer</MenuItem>
            <MenuItem value={TermType.WINTER}>Winter</MenuItem>
            <MenuItem value={TermType.YEAR}>Full Year</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="term-status-filter-label">Status</InputLabel>
          <Select
            labelId="term-status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="current">Current</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="ongoing">In Progress</MenuItem>
            <MenuItem value="past">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="terms table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Code</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Dates</strong></TableCell>
              <TableCell><strong>Registration</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTerms.map((term) => {
              const termStatus = getTermStatus(term);
              const registrationStatus = getRegistrationStatus(term);
              
              return (
                <TableRow key={term.id} hover>
                  <TableCell>
                    {term.name}
                    {term.isCurrent && (
                      <Chip 
                        label="Current" 
                        color="primary" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{term.code}</TableCell>
                  <TableCell>{term.type}</TableCell>
                  <TableCell>
                    {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={registrationStatus.label} 
                      color={registrationStatus.color as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={termStatus.label} 
                      color={termStatus.color as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton onClick={() => onView(term.id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onEdit(term.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => onDelete(term.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTerms.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default TermList;

