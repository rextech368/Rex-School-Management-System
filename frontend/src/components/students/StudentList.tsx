import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Badge,
  Input,
  Select,
  HStack,
  useToast,
  Tooltip,
  Spinner,
  Link,
  Checkbox,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, EditIcon, DeleteIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { FaFileExcel, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  status: string;
  currentClass?: {
    name: string;
  };
  currentSection?: {
    name: string;
  };
}

interface StudentListProps {
  initialStudents?: Student[];
}

const StudentList: React.FC<StudentListProps> = ({ initialStudents = [] }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit, setLimit] = useState(10);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (searchTerm) params.append('name', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        if (classFilter) params.append('classId', classFilter);
        
        const response = await axios.get(`/api/v1/students?${params.toString()}`);
        setStudents(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setTotalStudents(response.data.meta.total);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch students',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit, searchTerm, statusFilter, classFilter, toast]);

  // Fetch classes for filter
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/v1/classes');
        setClasses(response.data.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleDelete = async () => {
    if (!selectedStudent) return;

    try {
      await axios.delete(`/api/v1/students/${selectedStudent.id}`);
      setStudents(students.filter(student => student.id !== selectedStudent.id));
      onClose();
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (student: Student) => {
    setSelectedStudent(student);
    onOpen();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handleClassFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents(students.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(id)) {
        return prev.filter(studentId => studentId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const exportStudents = (format: 'pdf' | 'excel' | 'csv') => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('name', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    if (classFilter) params.append('classId', classFilter);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = `/api/v1/students/export/${format}?${params.toString()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    let colorScheme;
    switch (status) {
      case 'active':
        colorScheme = 'green';
        break;
      case 'inactive':
        colorScheme = 'gray';
        break;
      case 'graduated':
        colorScheme = 'blue';
        break;
      case 'transferred':
        colorScheme = 'purple';
        break;
      case 'suspended':
        colorScheme = 'orange';
        break;
      case 'expelled':
        colorScheme = 'red';
        break;
      case 'alumni':
        colorScheme = 'teal';
        break;
      case 'pending':
        colorScheme = 'yellow';
        break;
      default:
        colorScheme = 'gray';
    }
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Students</Heading>
        <NextLink href="/students/new" passHref>
          <Button as="a" leftIcon={<AddIcon />} colorScheme="blue">
            Add Student
          </Button>
        </NextLink>
      </Flex>

      <Flex mb={4} flexWrap="wrap" gap={2}>
        <Input
          placeholder="Search by name or admission number"
          value={searchTerm}
          onChange={handleSearch}
          width={{ base: 'full', md: 'auto' }}
          flex={{ md: 1 }}
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={handleStatusFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
          <option value="transferred">Transferred</option>
          <option value="suspended">Suspended</option>
          <option value="expelled">Expelled</option>
          <option value="alumni">Alumni</option>
          <option value="pending">Pending</option>
        </Select>
        <Select
          placeholder="Filter by class"
          value={classFilter}
          onChange={handleClassFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </Select>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
            Export
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaFilePdf />} onClick={() => exportStudents('pdf')}>
              Export as PDF
            </MenuItem>
            <MenuItem icon={<FaFileExcel />} onClick={() => exportStudents('excel')}>
              Export as Excel
            </MenuItem>
            <MenuItem icon={<FaFileCsv />} onClick={() => exportStudents('csv')}>
              Export as CSV
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {selectedStudents.length > 0 && (
        <Flex mb={4} alignItems="center">
          <Text mr={4}>{selectedStudents.length} students selected</Text>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
              Bulk Actions
            </MenuButton>
            <MenuList>
              <MenuItem>Promote Students</MenuItem>
              <MenuItem>Change Class/Section</MenuItem>
              <MenuItem>Update Status</MenuItem>
              <MenuItem>Send Notification</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}

      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th width="40px">
                    <Checkbox
                      isChecked={selectedStudents.length === students.length && students.length > 0}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th>Admission No.</Th>
                  <Th>Name</Th>
                  <Th>Class</Th>
                  <Th>Gender</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <Tr key={student.id}>
                      <Td>
                        <Checkbox
                          isChecked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelectStudent(student.id)}
                        />
                      </Td>
                      <Td>{student.admissionNumber}</Td>
                      <Td>
                        <NextLink href={`/students/${student.id}`} passHref>
                          <Link color="blue.500">
                            {student.firstName} {student.lastName}
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>{student.currentClass?.name || 'N/A'}</Td>
                      <Td>{student.gender}</Td>
                      <Td>{getStatusBadge(student.status)}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="View Student">
                            <IconButton
                              aria-label="View student"
                              icon={<ViewIcon />}
                              size="sm"
                              onClick={() => router.push(`/students/${student.id}`)}
                            />
                          </Tooltip>
                          <Tooltip label="Edit Student">
                            <IconButton
                              aria-label="Edit student"
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => router.push(`/students/${student.id}/edit`)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete Student">
                            <IconButton
                              aria-label="Delete student"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => confirmDelete(student)}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={4}>
                      No students found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            <Text>
              Showing {students.length} of {totalStudents} students
            </Text>
            <HStack>
              <Button
                size="sm"
                onClick={() => setPage(page - 1)}
                isDisabled={page === 1}
              >
                Previous
              </Button>
              <Text>
                Page {page} of {totalPages}
              </Text>
              <Button
                size="sm"
                onClick={() => setPage(page + 1)}
                isDisabled={page === totalPages}
              >
                Next
              </Button>
              <Select
                size="sm"
                width="80px"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // Reset to first page when changing limit
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </HStack>
          </Flex>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentList;

