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
  Avatar,
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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DownloadIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaFilePdf, FaIdCard, FaUserGraduate, FaExchangeAlt } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  nationality?: string;
  religion?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  profilePicture?: string;
  admissionDate: string;
  graduationDate?: string;
  status: string;
  previousSchool?: string;
  previousSchoolAddress?: string;
  transferCertificateNumber?: string;
  birthCertificateNumber?: string;
  idCardNumber?: string;
  rollNumber?: string;
  house?: string;
  registrationNumber?: string;
  specialNeeds?: string;
  scholarshipInfo?: string;
  feeCategory?: string;
  busRouteNumber?: string;
  busStop?: string;
  hostelRoomNumber?: string;
  lockerNumber?: string;
  createdAt: string;
  updatedAt: string;
  currentClass?: {
    id: string;
    name: string;
  };
  currentSection?: {
    id: string;
    name: string;
  };
  academicYear?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    email: string;
    fullName: string;
    status: string;
  };
  parents?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationshipType: string;
  }[];
}

interface StudentDetailProps {
  studentId: string;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ studentId }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/students/${studentId}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch student details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId, toast]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/students/${studentId}`);
      onClose();
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/students');
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

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!student) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md">Student not found</Heading>
        <NextLink href="/students" passHref>
          <Button as="a" mt={4} colorScheme="blue">
            Back to Students
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6} flexWrap="wrap" gap={2}>
        <Heading size="lg">Student Details</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
          <NextLink href={`/students/${studentId}/edit`} passHref>
            <Button as="a" leftIcon={<EditIcon />} colorScheme="blue">
              Edit
            </Button>
          </NextLink>
          <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={onOpen}>
            Delete
          </Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FaFilePdf />}>Generate Report Card</MenuItem>
              <MenuItem icon={<FaIdCard />}>Print ID Card</MenuItem>
              <MenuItem icon={<FaUserGraduate />}>Graduate Student</MenuItem>
              <MenuItem icon={<FaExchangeAlt />}>Transfer Student</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Flex mb={6} direction={{ base: 'column', md: 'row' }} gap={6}>
        <Box textAlign="center">
          <Avatar
            size="2xl"
            src={student.profilePicture || ''}
            name={`${student.firstName} ${student.lastName}`}
            mb={2}
          />
          <Text fontWeight="bold" fontSize="lg">
            {student.firstName} {student.middleName ? student.middleName + ' ' : ''}{student.lastName}
          </Text>
          <Text color="gray.600">{student.admissionNumber}</Text>
          <Text mt={1}>{getStatusBadge(student.status)}</Text>
        </Box>

        <Box flex="1">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Box>
              <Text fontWeight="bold">Class</Text>
              <Text>{student.currentClass?.name || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Section</Text>
              <Text>{student.currentSection?.name || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Roll Number</Text>
              <Text>{student.rollNumber || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Academic Year</Text>
              <Text>{student.academicYear?.name || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Date of Birth</Text>
              <Text>{formatDate(student.dateOfBirth)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Gender</Text>
              <Text>{student.gender}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Admission Date</Text>
              <Text>{formatDate(student.admissionDate)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">House/Team</Text>
              <Text>{student.house || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Blood Group</Text>
              <Text>{student.bloodGroup || 'N/A'}</Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>

      <Tabs variant="enclosed" mt={6}>
        <TabList>
          <Tab>Personal Information</Tab>
          <Tab>Contact Details</Tab>
          <Tab>Academic Information</Tab>
          <Tab>Medical Information</Tab>
          <Tab>Parents & Guardians</Tab>
          <Tab>Additional Details</Tab>
        </TabList>

        <TabPanels>
          {/* Personal Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">Nationality</Text>
                <Text>{student.nationality || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Religion</Text>
                <Text>{student.religion || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Birth Certificate Number</Text>
                <Text>{student.birthCertificateNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">ID Card Number</Text>
                <Text>{student.idCardNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Registration Number</Text>
                <Text>{student.registrationNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">User Account</Text>
                <Text>
                  {student.user ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Not Created</Badge>
                  )}
                </Text>
              </Box>
              {student.user && (
                <Box>
                  <Text fontWeight="bold">User Email</Text>
                  <Text>{student.user.email}</Text>
                </Box>
              )}
              <Box>
                <Text fontWeight="bold">Created At</Text>
                <Text>{formatDate(student.createdAt)}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Last Updated</Text>
                <Text>{formatDate(student.updatedAt)}</Text>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Contact Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">Email</Text>
                <Text>{student.email || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Phone Number</Text>
                <Text>{student.phoneNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Address</Text>
                <Text>{student.address || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">City</Text>
                <Text>{student.city || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">State/Province</Text>
                <Text>{student.state || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Country</Text>
                <Text>{student.country || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Postal Code</Text>
                <Text>{student.postalCode || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Emergency Contact Name</Text>
                <Text>{student.emergencyContactName || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Emergency Contact Phone</Text>
                <Text>{student.emergencyContactPhone || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Emergency Contact Relationship</Text>
                <Text>{student.emergencyContactRelationship || 'N/A'}</Text>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Academic Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">Previous School</Text>
                <Text>{student.previousSchool || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Previous School Address</Text>
                <Text>{student.previousSchoolAddress || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Transfer Certificate Number</Text>
                <Text>{student.transferCertificateNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Graduation Date</Text>
                <Text>{student.graduationDate ? formatDate(student.graduationDate) : 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Scholarship Information</Text>
                <Text>{student.scholarshipInfo || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Fee Category</Text>
                <Text>{student.feeCategory || 'N/A'}</Text>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Medical Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">Medical Conditions</Text>
                <Text>{student.medicalConditions || 'None'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Allergies</Text>
                <Text>{student.allergies || 'None'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Medications</Text>
                <Text>{student.medications || 'None'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Special Needs</Text>
                <Text>{student.specialNeeds || 'None'}</Text>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Parents & Guardians Tab */}
          <TabPanel>
            {student.parents && student.parents.length > 0 ? (
              student.parents.map((parent) => (
                <Box key={parent.id} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Heading size="sm">
                        {parent.firstName} {parent.lastName}
                      </Heading>
                      <Text color="gray.600">
                        <Badge>{parent.relationshipType}</Badge>
                      </Text>
                    </Box>
                    <NextLink href={`/parents/${parent.id}`} passHref>
                      <Button as="a" size="sm" colorScheme="blue">
                        View Details
                      </Button>
                    </NextLink>
                  </Flex>
                  <Divider my={2} />
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Email</Text>
                      <Text>{parent.email}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Phone</Text>
                      <Text>{parent.phoneNumber}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              ))
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No parents or guardians associated with this student.</Text>
                <NextLink href={`/parents/new?studentId=${studentId}`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm">
                    Add Parent/Guardian
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Additional Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">Bus Route Number</Text>
                <Text>{student.busRouteNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Bus Stop</Text>
                <Text>{student.busStop || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Hostel Room Number</Text>
                <Text>{student.hostelRoomNumber || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Locker Number</Text>
                <Text>{student.lockerNumber || 'N/A'}</Text>
              </Box>
            </SimpleGrid>
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
            Are you sure you want to delete {student.firstName} {student.lastName}? This action cannot be undone.
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

export default StudentDetail;

