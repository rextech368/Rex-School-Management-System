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
  Stack,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Class {
  id: string;
  name: string;
  displayName?: string;
  grade?: string;
  level?: number;
  status: string;
  enrolledStudents: number;
  capacity?: number;
  academicYear?: {
    name: string;
    isCurrent: boolean;
  };
  headTeacher?: {
    fullName: string;
  };
  sections?: {
    id: string;
    name: string;
    enrolledStudents: number;
  }[];
}

interface ClassListProps {
  initialClasses?: Class[];
}

const ClassList: React.FC<ClassListProps> = ({ initialClasses = [] }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalClasses, setTotalClasses] = useState(0);
  const [limit, setLimit] = useState(10);
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string; isCurrent: boolean }[]>([]);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (searchTerm) params.append('name', searchTerm);
        if (gradeFilter) params.append('grade', gradeFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (academicYearFilter) params.append('academicYearId', academicYearFilter);
        
        const response = await axios.get(`/api/v1/classes?${params.toString()}`);
        setClasses(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setTotalClasses(response.data.meta.total);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch classes',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [page, limit, searchTerm, gradeFilter, statusFilter, academicYearFilter, toast]);

  // Fetch academic years for filtering
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get('/api/v1/academic/years');
        setAcademicYears(response.data.data);
      } catch (error) {
        console.error('Error fetching academic years:', error);
      }
    };

    fetchAcademicYears();
  }, []);

  const handleDelete = async () => {
    if (!selectedClass) return;

    try {
      await axios.delete(`/api/v1/classes/${selectedClass.id}`);
      setClasses(classes.filter(cls => cls.id !== selectedClass.id));
      onClose();
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete class',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (cls: Class) => {
    setSelectedClass(cls);
    onOpen();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleGradeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handleAcademicYearFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAcademicYearFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const getStatusBadge = (status: string) => {
    let colorScheme;
    switch (status) {
      case 'active':
        colorScheme = 'green';
        break;
      case 'inactive':
        colorScheme = 'yellow';
        break;
      case 'archived':
        colorScheme = 'gray';
        break;
      default:
        colorScheme = 'gray';
    }
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Classes</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
          <NextLink href="/classes/new" passHref>
            <Button as="a" leftIcon={<AddIcon />} colorScheme="blue">
              Add Class
            </Button>
          </NextLink>
          <NextLink href="/classes/sections/new" passHref>
            <Button as="a" leftIcon={<AddIcon />} colorScheme="teal">
              Add Section
            </Button>
          </NextLink>
        </Stack>
      </Flex>

      <Flex mb={4} flexWrap="wrap" gap={2}>
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          width={{ base: 'full', md: 'auto' }}
          flex={{ md: 1 }}
        />
        <Select
          placeholder="Filter by grade"
          value={gradeFilter}
          onChange={handleGradeFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Grades</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
          <option value="Grade 3">Grade 3</option>
          <option value="Grade 4">Grade 4</option>
          <option value="Grade 5">Grade 5</option>
          <option value="Grade 6">Grade 6</option>
          <option value="Form 1">Form 1</option>
          <option value="Form 2">Form 2</option>
          <option value="Form 3">Form 3</option>
          <option value="Form 4">Form 4</option>
        </Select>
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={handleStatusFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </Select>
        <Select
          placeholder="Filter by academic year"
          value={academicYearFilter}
          onChange={handleAcademicYearFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Academic Years</option>
          {academicYears.map(year => (
            <option key={year.id} value={year.id}>
              {year.name} {year.isCurrent ? '(Current)' : ''}
            </option>
          ))}
        </Select>
      </Flex>

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
                  <Th>Name</Th>
                  <Th>Grade</Th>
                  <Th>Level</Th>
                  <Th>Students</Th>
                  <Th>Sections</Th>
                  <Th>Academic Year</Th>
                  <Th>Head Teacher</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {classes.length > 0 ? (
                  classes.map(cls => (
                    <Tr key={cls.id}>
                      <Td>
                        <NextLink href={`/classes/${cls.id}`} passHref>
                          <Link color="blue.500">
                            {cls.displayName || cls.name}
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>{cls.grade || 'N/A'}</Td>
                      <Td>{cls.level || 'N/A'}</Td>
                      <Td>
                        {cls.enrolledStudents} / {cls.capacity || '∞'}
                      </Td>
                      <Td>
                        {cls.sections ? cls.sections.length : 0}
                      </Td>
                      <Td>
                        {cls.academicYear ? (
                          <Text>
                            {cls.academicYear.name}
                            {cls.academicYear.isCurrent && (
                              <Badge ml={2} colorScheme="green">Current</Badge>
                            )}
                          </Text>
                        ) : (
                          'N/A'
                        )}
                      </Td>
                      <Td>{cls.headTeacher?.fullName || 'N/A'}</Td>
                      <Td>{getStatusBadge(cls.status)}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="View Class">
                            <IconButton
                              aria-label="View class"
                              icon={<ViewIcon />}
                              size="sm"
                              onClick={() => router.push(`/classes/${cls.id}`)}
                            />
                          </Tooltip>
                          <Tooltip label="Edit Class">
                            <IconButton
                              aria-label="Edit class"
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => router.push(`/classes/${cls.id}/edit`)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete Class">
                            <IconButton
                              aria-label="Delete class"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => confirmDelete(cls)}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={9} textAlign="center" py={4}>
                      No classes found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            <Text>
              Showing {classes.length} of {totalClasses} classes
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
            {selectedClass?.enrolledStudents > 0 ? (
              <Text color="red.500">
                This class has {selectedClass.enrolledStudents} enrolled students. You cannot delete a class with enrolled students.
              </Text>
            ) : selectedClass?.sections && selectedClass.sections.length > 0 ? (
              <Text color="red.500">
                This class has {selectedClass.sections.length} sections. You must delete all sections first.
              </Text>
            ) : (
              <Text>
                Are you sure you want to delete {selectedClass?.displayName || selectedClass?.name}? This action cannot be undone.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDelete}
              isDisabled={
                (selectedClass?.enrolledStudents || 0) > 0 || 
                ((selectedClass?.sections?.length || 0) > 0)
              }
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ClassList;

