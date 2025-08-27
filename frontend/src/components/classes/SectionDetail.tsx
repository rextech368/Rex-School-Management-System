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
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Section {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  capacity?: number;
  enrolledStudents: number;
  status: string;
  roomNumber?: string;
  notes?: string;
  classId: string;
  class?: {
    id: string;
    name: string;
    grade?: string;
  };
  classSectionTeacherId?: string;
  classSectionTeacher?: {
    id: string;
    fullName: string;
    email: string;
  };
  teachers?: Teacher[];
  students?: Student[];
  createdAt: string;
  updatedAt: string;
}

interface Teacher {
  id: string;
  fullName: string;
  email: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
}

interface SectionDetailProps {
  sectionId: string;
}

const SectionDetail: React.FC<SectionDetailProps> = ({ sectionId }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/classes/sections/${sectionId}`);
        setSection(response.data);
      } catch (error) {
        console.error('Error fetching section:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch section details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (sectionId) {
      fetchSection();
    }
  }, [sectionId, toast]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/classes/sections/${sectionId}`);
      onClose();
      toast({
        title: 'Success',
        description: 'Section deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to class details
      if (section?.classId) {
        router.push(`/classes/${section.classId}`);
      } else {
        router.push('/classes');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete section',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = () => {
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

  if (!section) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md">Section not found</Heading>
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
        <Heading size="lg">Section Details</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
          <NextLink href={`/classes/sections/${sectionId}/edit`} passHref>
            <Button as="a" leftIcon={<EditIcon />} colorScheme="blue">
              Edit
            </Button>
          </NextLink>
          <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={confirmDelete}>
            Delete
          </Button>
          <NextLink href={`/students/new?sectionId=${sectionId}`} passHref>
            <Button as="a" leftIcon={<AddIcon />} colorScheme="teal">
              Add Student
            </Button>
          </NextLink>
        </Stack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box>
          <Heading size="md" mb={4}>Basic Information</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold">Name</Text>
              <Text>{section.name}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Display Name</Text>
              <Text>{section.displayName || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Class</Text>
              <NextLink href={`/classes/${section.classId}`} passHref>
                <Link color="blue.500">
                  {section.class?.name} {section.class?.grade ? `(${section.class.grade})` : ''}
                </Link>
              </NextLink>
            </Box>
            <Box>
              <Text fontWeight="bold">Status</Text>
              <Text>{getStatusBadge(section.status)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Students</Text>
              <Text>{section.enrolledStudents} / {section.capacity || '∞'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Room Number</Text>
              <Text>{section.roomNumber || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Section Teacher</Text>
              <Text>{section.classSectionTeacher?.fullName || 'N/A'}</Text>
            </Box>
          </SimpleGrid>

          {section.description && (
            <Box mt={4}>
              <Text fontWeight="bold">Description</Text>
              <Text>{section.description}</Text>
            </Box>
          )}

          {section.notes && (
            <Box mt={4}>
              <Text fontWeight="bold">Notes</Text>
              <Text>{section.notes}</Text>
            </Box>
          )}
        </Box>

        <Box>
          <Heading size="md" mb={4}>Additional Information</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold">Created</Text>
              <Text>{formatDate(section.createdAt)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Last Updated</Text>
              <Text>{formatDate(section.updatedAt)}</Text>
            </Box>
          </SimpleGrid>
        </Box>
      </SimpleGrid>

      <Tabs variant="enclosed" mt={6}>
        <TabList>
          <Tab>Students</Tab>
          <Tab>Teachers</Tab>
        </TabList>

        <TabPanels>
          {/* Students Tab */}
          <TabPanel>
            {section.students && section.students.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Admission Number</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {section.students.map(student => (
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
                        <HStack spacing={2}>
                          <NextLink href={`/students/${student.id}`} passHref>
                            <Button as="a" size="sm" colorScheme="blue">
                              View
                            </Button>
                          </NextLink>
                          <Tooltip label="Remove from Section">
                            <IconButton
                              aria-label="Remove from section"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => {
                                axios.delete(`/api/v1/classes/students/${student.id}/enrollment`)
                                  .then(() => {
                                    toast({
                                      title: 'Success',
                                      description: 'Student removed from section',
                                      status: 'success',
                                      duration: 5000,
                                      isClosable: true,
                                    });
                                    // Refresh section data
                                    axios.get(`/api/v1/classes/sections/${sectionId}`)
                                      .then(response => setSection(response.data));
                                  })
                                  .catch(error => {
                                    toast({
                                      title: 'Error',
                                      description: error.response?.data?.message || 'Failed to remove student',
                                      status: 'error',
                                      duration: 5000,
                                      isClosable: true,
                                    });
                                  });
                              }}
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
                <Text>No students enrolled in this section.</Text>
                <NextLink href={`/students/new?sectionId=${sectionId}`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm" leftIcon={<AddIcon />}>
                    Add Student
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Teachers Tab */}
          <TabPanel>
            {section.teachers && section.teachers.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {section.teachers.map(teacher => (
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
                <Text>No teachers assigned to this section.</Text>
                <NextLink href={`/classes/sections/${sectionId}/edit`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm">
                    Assign Teachers
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
            {section.enrolledStudents > 0 ? (
              <Text color="red.500">
                This section has {section.enrolledStudents} enrolled students. You cannot delete a section with enrolled students.
              </Text>
            ) : (
              <Text>
                Are you sure you want to delete {section.displayName || section.name}? This action cannot be undone.
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
              isDisabled={section.enrolledStudents > 0}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SectionDetail;

