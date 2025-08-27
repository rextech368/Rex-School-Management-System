import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Divider,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  IconButton,
  useToast,
  Spinner,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Class {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  grade?: string;
  level?: number;
  capacity?: number;
  enrolledStudents: number;
  status: string;
  roomNumber?: string;
  building?: string;
  floor?: string;
  notes?: string;
  academicYearId?: string;
  academicYear?: {
    id: string;
    name: string;
    isCurrent: boolean;
  };
  headTeacherId?: string;
  headTeacher?: {
    id: string;
    fullName: string;
    email: string;
  };
  sections?: Section[];
  teachers?: Teacher[];
  subjects?: Subject[];
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  name: string;
  displayName?: string;
  capacity?: number;
  enrolledStudents: number;
  status: string;
  roomNumber?: string;
  classSectionTeacher?: {
    id: string;
    fullName: string;
  };
}

interface Teacher {
  id: string;
  fullName: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  currentSectionId?: string;
}

interface ClassDetailProps {
  classId: string;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ classId }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'class' | 'section', id: string, name: string } | null>(null);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/classes/${classId}`);
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch class details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClass();
    }
  }, [classId, toast]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) return;
      
      try {
        setLoadingStudents(true);
        const response = await axios.get(`/api/v1/students?currentClassId=${classId}`);
        setStudents(response.data.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [classId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'class') {
        await axios.delete(`/api/v1/classes/${deleteTarget.id}`);
        router.push('/classes');
      } else {
        await axios.delete(`/api/v1/classes/sections/${deleteTarget.id}`);
        // Refresh class data to update sections list
        const response = await axios.get(`/api/v1/classes/${classId}`);
        setClassData(response.data);
      }
      
      onClose();
      toast({
        title: 'Success',
        description: `${deleteTarget.type === 'class' ? 'Class' : 'Section'} deleted successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to delete ${deleteTarget.type}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDeleteClass = () => {
    if (!classData) return;
    
    setDeleteTarget({
      type: 'class',
      id: classData.id,
      name: classData.displayName || classData.name,
    });
    onOpen();
  };

  const confirmDeleteSection = (section: Section) => {
    setDeleteTarget({
      type: 'section',
      id: section.id,
      name: section.displayName || section.name,
    });
    onOpen();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!classData) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md">Class not found</Heading>
        <NextLink href="/classes" passHref>
          <Button as="a" mt={4} colorScheme="blue">
            Back to Classes
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6} flexWrap="wrap" gap={2}>
        <Heading size="lg">Class Details</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
          <NextLink href={`/classes/${classId}/edit`} passHref>
            <Button as="a" leftIcon={<EditIcon />} colorScheme="blue">
              Edit
            </Button>
          </NextLink>
          <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={confirmDeleteClass}>
            Delete
          </Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
              Add
            </MenuButton>
            <MenuList>
              <NextLink href={`/classes/sections/new?classId=${classId}`} passHref>
                <MenuItem icon={<AddIcon />}>
                  Add Section
                </MenuItem>
              </NextLink>
              <NextLink href={`/students/new?classId=${classId}`} passHref>
                <MenuItem icon={<AddIcon />}>
                  Add Student
                </MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box>
          <Heading size="md" mb={4}>Basic Information</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold">Name</Text>
              <Text>{classData.name}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Display Name</Text>
              <Text>{classData.displayName || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Grade</Text>
              <Text>{classData.grade || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Level</Text>
              <Text>{classData.level || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Status</Text>
              <Text>{getStatusBadge(classData.status)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Students</Text>
              <Text>{classData.enrolledStudents} / {classData.capacity || '∞'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Academic Year</Text>
              <Text>
                {classData.academicYear ? (
                  <>
                    {classData.academicYear.name}
                    {classData.academicYear.isCurrent && (
                      <Badge ml={2} colorScheme="green">Current</Badge>
                    )}
                  </>
                ) : (
                  'N/A'
                )}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Head Teacher</Text>
              <Text>{classData.headTeacher?.fullName || 'N/A'}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Location</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold">Room Number</Text>
              <Text>{classData.roomNumber || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Building</Text>
              <Text>{classData.building || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Floor</Text>
              <Text>{classData.floor || 'N/A'}</Text>
            </Box>
          </SimpleGrid>

          {classData.description && (
            <Box mt={4}>
              <Text fontWeight="bold">Description</Text>
              <Text>{classData.description}</Text>
            </Box>
          )}

          {classData.notes && (
            <Box mt={4}>
              <Text fontWeight="bold">Notes</Text>
              <Text>{classData.notes}</Text>
            </Box>
          )}
        </Box>
      </SimpleGrid>

      <Tabs variant="enclosed" mt={6}>
        <TabList>
          <Tab>Sections</Tab>
          <Tab>Students</Tab>
          <Tab>Teachers</Tab>
          <Tab>Subjects</Tab>
        </TabList>

        <TabPanels>
          {/* Sections Tab */}
          <TabPanel>
            {classData.sections && classData.sections.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Students</Th>
                    <Th>Room</Th>
                    <Th>Section Teacher</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {classData.sections.map(section => (
                    <Tr key={section.id}>
                      <Td>
                        <NextLink href={`/classes/sections/${section.id}`} passHref>
                          <Link color="blue.500">
                            {section.displayName || section.name}
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>{section.enrolledStudents} / {section.capacity || '∞'}</Td>
                      <Td>{section.roomNumber || 'N/A'}</Td>
                      <Td>{section.classSectionTeacher?.fullName || 'N/A'}</Td>
                      <Td>{getStatusBadge(section.status)}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="Edit Section">
                            <IconButton
                              aria-label="Edit section"
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => router.push(`/classes/sections/${section.id}/edit`)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete Section">
                            <IconButton
                              aria-label="Delete section"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => confirmDeleteSection(section)}
                              isDisabled={section.enrolledStudents > 0}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No sections found for this class.</Text>
                <NextLink href={`/classes/sections/new?classId=${classId}`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm" leftIcon={<AddIcon />}>
                    Add Section
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Students Tab */}
          <TabPanel>
            {loadingStudents ? (
              <Flex justifyContent="center" alignItems="center" height="200px">
                <Spinner />
              </Flex>
            ) : students.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Admission Number</Th>
                    <Th>Section</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students.map(student => (
                    <Tr key={student.id}>
                      <Td>
                        <NextLink href={`/students/${student.id}`} passHref>
                          <Link color="blue.500">
                            {student.firstName} {student.lastName}
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>{student.admissionNumber}</Td>
                      <Td>
                        {student.currentSectionId ? (
                          classData.sections?.find(s => s.id === student.currentSectionId)?.name || 'Unknown'
                        ) : (
                          'Not assigned'
                        )}
                      </Td>
                      <Td>
                        <NextLink href={`/students/${student.id}`} passHref>
                          <Button as="a" size="sm" colorScheme="blue">
                            View
                          </Button>
                        </NextLink>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No students enrolled in this class.</Text>
                <NextLink href={`/students/new?classId=${classId}`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm" leftIcon={<AddIcon />}>
                    Add Student
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Teachers Tab */}
          <TabPanel>
            {classData.teachers && classData.teachers.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {classData.teachers.map(teacher => (
                    <Tr key={teacher.id}>
                      <Td>{teacher.fullName}</Td>
                      <Td>{teacher.email}</Td>
                      <Td>
                        <NextLink href={`/users/${teacher.id}`} passHref>
                          <Button as="a" size="sm" colorScheme="blue">
                            View
                          </Button>
                        </NextLink>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No teachers assigned to this class.</Text>
                <NextLink href={`/classes/${classId}/edit`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm">
                    Assign Teachers
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Subjects Tab */}
          <TabPanel>
            {classData.subjects && classData.subjects.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Code</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {classData.subjects.map(subject => (
                    <Tr key={subject.id}>
                      <Td>{subject.name}</Td>
                      <Td>{subject.code}</Td>
                      <Td>
                        <NextLink href={`/academic/subjects/${subject.id}`} passHref>
                          <Button as="a" size="sm" colorScheme="blue">
                            View
                          </Button>
                        </NextLink>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No subjects assigned to this class.</Text>
                <NextLink href={`/classes/${classId}/edit`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm">
                    Assign Subjects
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {deleteTarget?.type === 'class' && classData.enrolledStudents > 0 ? (
              <Text color="red.500">
                This class has {classData.enrolledStudents} enrolled students. You cannot delete a class with enrolled students.
              </Text>
            ) : deleteTarget?.type === 'class' && classData.sections && classData.sections.length > 0 ? (
              <Text color="red.500">
                This class has {classData.sections.length} sections. You must delete all sections first.
              </Text>
            ) : deleteTarget?.type === 'section' && selectedSection?.enrolledStudents && selectedSection.enrolledStudents > 0 ? (
              <Text color="red.500">
                This section has {selectedSection.enrolledStudents} enrolled students. You cannot delete a section with enrolled students.
              </Text>
            ) : (
              <Text>
                Are you sure you want to delete {deleteTarget?.name}? This action cannot be undone.
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
                (deleteTarget?.type === 'class' && (
                  classData.enrolledStudents > 0 || 
                  (classData.sections && classData.sections.length > 0)
                )) ||
                (deleteTarget?.type === 'section' && selectedSection?.enrolledStudents && selectedSection.enrolledStudents > 0)
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

export default ClassDetail;

