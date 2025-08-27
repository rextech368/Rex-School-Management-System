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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ChevronDownIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons';
import { FaWhatsapp, FaSms, FaBell } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  relationshipType: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  occupation?: string;
  employer?: string;
  workPhone?: string;
  emergencyContactPriority?: number;
  isAuthorizedForPickup: boolean;
  hasFinancialResponsibility: boolean;
  notes?: string;
  profilePicture?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  students?: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    currentClass?: {
      name: string;
    };
  }[];
  user?: {
    id: string;
    email: string;
    fullName: string;
    status: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    inAppNotifications: boolean;
    attendanceNotifications: boolean;
    academicNotifications: boolean;
    behaviorNotifications: boolean;
    financialNotifications: boolean;
    eventNotifications: boolean;
    emergencyNotifications: boolean;
    preferredLanguage: string;
    preferredCommunicationChannel: string;
    notificationFrequency?: string;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    receiveMarketingCommunications: boolean;
    receiveNewsletters: boolean;
    additionalPreferences?: string;
  };
}

interface ParentDetailProps {
  parentId: string;
}

const ParentDetail: React.FC<ParentDetailProps> = ({ parentId }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/parents/${parentId}`);
        setParent(response.data);
      } catch (error) {
        console.error('Error fetching parent:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch parent details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchParent();
    }
  }, [parentId, toast]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/parents/${parentId}`);
      onClose();
      toast({
        title: 'Success',
        description: 'Parent deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/parents');
    } catch (error) {
      console.error('Error deleting parent:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete parent',
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
    const colorScheme = status === 'active' ? 'green' : 'gray';
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  const getRelationshipBadge = (relationshipType: string) => {
    let colorScheme;
    switch (relationshipType) {
      case 'FATHER':
        colorScheme = 'blue';
        break;
      case 'MOTHER':
        colorScheme = 'pink';
        break;
      case 'GUARDIAN':
        colorScheme = 'purple';
        break;
      case 'GRANDPARENT':
        colorScheme = 'teal';
        break;
      default:
        colorScheme = 'gray';
    }
    return <Badge colorScheme={colorScheme}>{relationshipType.toLowerCase()}</Badge>;
  };

  const sendNotification = async (type: 'email' | 'sms' | 'whatsapp' | 'in-app') => {
    try {
      // This would be implemented to call the notification API
      toast({
        title: 'Notification Sent',
        description: `${type.toUpperCase()} notification sent to ${parent?.firstName} ${parent?.lastName}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Error sending ${type} notification:`, error);
      toast({
        title: 'Error',
        description: `Failed to send ${type} notification`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!parent) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md">Parent not found</Heading>
        <NextLink href="/parents" passHref>
          <Button as="a" mt={4} colorScheme="blue">
            Back to Parents
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6} flexWrap="wrap" gap={2}>
        <Heading size="lg">Parent Details</Heading>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={2}>
          <NextLink href={`/parents/${parentId}/edit`} passHref>
            <Button as="a" leftIcon={<EditIcon />} colorScheme="blue">
              Edit
            </Button>
          </NextLink>
          <Button leftIcon={<DeleteIcon />} colorScheme="red" onClick={onOpen}>
            Delete
          </Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Send Notification
            </MenuButton>
            <MenuList>
              <MenuItem icon={<EmailIcon />} onClick={() => sendNotification('email')}>
                Send Email
              </MenuItem>
              <MenuItem icon={<FaSms />} onClick={() => sendNotification('sms')}>
                Send SMS
              </MenuItem>
              <MenuItem icon={<FaWhatsapp />} onClick={() => sendNotification('whatsapp')}>
                Send WhatsApp
              </MenuItem>
              <MenuItem icon={<FaBell />} onClick={() => sendNotification('in-app')}>
                Send In-App Notification
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Flex mb={6} direction={{ base: 'column', md: 'row' }} gap={6}>
        <Box textAlign="center">
          <Avatar
            size="2xl"
            src={parent.profilePicture || ''}
            name={`${parent.firstName} ${parent.lastName}`}
            mb={2}
          />
          <Text fontWeight="bold" fontSize="lg">
            {parent.firstName} {parent.lastName}
          </Text>
          <Text color="gray.600">{parent.email}</Text>
          <Text mt={1}>{getRelationshipBadge(parent.relationshipType)}</Text>
          <Text mt={1}>{getStatusBadge(parent.status)}</Text>
        </Box>

        <Box flex="1">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Box>
              <Text fontWeight="bold">Phone Number</Text>
              <Text>{parent.phoneNumber}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Occupation</Text>
              <Text>{parent.occupation || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Employer</Text>
              <Text>{parent.employer || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Work Phone</Text>
              <Text>{parent.workPhone || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Emergency Contact Priority</Text>
              <Text>{parent.emergencyContactPriority || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Authorized for Pickup</Text>
              <Badge colorScheme={parent.isAuthorizedForPickup ? 'green' : 'red'}>
                {parent.isAuthorizedForPickup ? 'Yes' : 'No'}
              </Badge>
            </Box>
            <Box>
              <Text fontWeight="bold">Financial Responsibility</Text>
              <Badge colorScheme={parent.hasFinancialResponsibility ? 'green' : 'red'}>
                {parent.hasFinancialResponsibility ? 'Yes' : 'No'}
              </Badge>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>

      <Tabs variant="enclosed" mt={6}>
        <TabList>
          <Tab>Students</Tab>
          <Tab>Contact Details</Tab>
          <Tab>Notification Preferences</Tab>
          <Tab>Additional Information</Tab>
        </TabList>

        <TabPanels>
          {/* Students Tab */}
          <TabPanel>
            {parent.students && parent.students.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Admission Number</Th>
                    <Th>Class</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {parent.students.map(student => (
                    <Tr key={student.id}>
                      <Td>
                        <NextLink href={`/students/${student.id}`} passHref>
                          <Link color="blue.500">
                            {student.firstName} {student.lastName}
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>{student.admissionNumber}</Td>
                      <Td>{student.currentClass?.name || 'N/A'}</Td>
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
                <Text>No students associated with this parent.</Text>
                <NextLink href={`/students/new?parentId=${parentId}`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm">
                    Add Student
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Contact Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">Address</Text>
                <Text>{parent.address || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">City</Text>
                <Text>{parent.city || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">State/Province</Text>
                <Text>{parent.state || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Country</Text>
                <Text>{parent.country || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Postal Code</Text>
                <Text>{parent.postalCode || 'N/A'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Email</Text>
                <Text>{parent.email}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Phone Number</Text>
                <Text>{parent.phoneNumber}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Work Phone</Text>
                <Text>{parent.workPhone || 'N/A'}</Text>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Notification Preferences Tab */}
          <TabPanel>
            {parent.preferences ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Heading size="sm" mb={4}>Communication Channels</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Email Notifications</Text>
                      <Badge colorScheme={parent.preferences.emailNotifications ? 'green' : 'red'}>
                        {parent.preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">SMS Notifications</Text>
                      <Badge colorScheme={parent.preferences.smsNotifications ? 'green' : 'red'}>
                        {parent.preferences.smsNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">WhatsApp Notifications</Text>
                      <Badge colorScheme={parent.preferences.whatsappNotifications ? 'green' : 'red'}>
                        {parent.preferences.whatsappNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">In-App Notifications</Text>
                      <Badge colorScheme={parent.preferences.inAppNotifications ? 'green' : 'red'}>
                        {parent.preferences.inAppNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Box>
                  <Heading size="sm" mb={4}>Notification Types</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Attendance</Text>
                      <Badge colorScheme={parent.preferences.attendanceNotifications ? 'green' : 'red'}>
                        {parent.preferences.attendanceNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Academic</Text>
                      <Badge colorScheme={parent.preferences.academicNotifications ? 'green' : 'red'}>
                        {parent.preferences.academicNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Behavior</Text>
                      <Badge colorScheme={parent.preferences.behaviorNotifications ? 'green' : 'red'}>
                        {parent.preferences.behaviorNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Financial</Text>
                      <Badge colorScheme={parent.preferences.financialNotifications ? 'green' : 'red'}>
                        {parent.preferences.financialNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Events</Text>
                      <Badge colorScheme={parent.preferences.eventNotifications ? 'green' : 'red'}>
                        {parent.preferences.eventNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Emergency</Text>
                      <Badge colorScheme={parent.preferences.emergencyNotifications ? 'green' : 'red'}>
                        {parent.preferences.emergencyNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </Box>
                  </SimpleGrid>
                </Box>

                <Box>
                  <Text fontWeight="bold">Preferred Language</Text>
                  <Text>{parent.preferences.preferredLanguage === 'en' ? 'English' : 
                         parent.preferences.preferredLanguage === 'fr' ? 'French' : 
                         parent.preferences.preferredLanguage === 'es' ? 'Spanish' : 
                         parent.preferences.preferredLanguage === 'ar' ? 'Arabic' : 
                         parent.preferences.preferredLanguage}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Preferred Communication Channel</Text>
                  <Text>{parent.preferences.preferredCommunicationChannel}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Notification Frequency</Text>
                  <Text>{parent.preferences.notificationFrequency || 'N/A'}</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Quiet Hours</Text>
                  <Text>
                    {parent.preferences.quietHoursStart && parent.preferences.quietHoursEnd
                      ? `${parent.preferences.quietHoursStart} - ${parent.preferences.quietHoursEnd}`
                      : 'N/A'}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold">Marketing Communications</Text>
                  <Badge colorScheme={parent.preferences.receiveMarketingCommunications ? 'green' : 'red'}>
                    {parent.preferences.receiveMarketingCommunications ? 'Enabled' : 'Disabled'}
                  </Badge>
                </Box>

                <Box>
                  <Text fontWeight="bold">Newsletters</Text>
                  <Badge colorScheme={parent.preferences.receiveNewsletters ? 'green' : 'red'}>
                    {parent.preferences.receiveNewsletters ? 'Enabled' : 'Disabled'}
                  </Badge>
                </Box>

                {parent.preferences.additionalPreferences && (
                  <Box gridColumn="span 2">
                    <Text fontWeight="bold">Additional Preferences</Text>
                    <Text>{parent.preferences.additionalPreferences}</Text>
                  </Box>
                )}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" p={4}>
                <Text>No notification preferences set for this parent.</Text>
                <NextLink href={`/parents/${parentId}/edit`} passHref>
                  <Button as="a" mt={2} colorScheme="blue" size="sm">
                    Set Preferences
                  </Button>
                </NextLink>
              </Box>
            )}
          </TabPanel>

          {/* Additional Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontWeight="bold">User Account</Text>
                <Text>
                  {parent.user ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Not Created</Badge>
                  )}
                </Text>
              </Box>
              {parent.user && (
                <Box>
                  <Text fontWeight="bold">User Email</Text>
                  <Text>{parent.user.email}</Text>
                </Box>
              )}
              <Box>
                <Text fontWeight="bold">Created At</Text>
                <Text>{formatDate(parent.createdAt)}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Last Updated</Text>
                <Text>{formatDate(parent.updatedAt)}</Text>
              </Box>
              {parent.notes && (
                <Box gridColumn="span 2">
                  <Text fontWeight="bold">Notes</Text>
                  <Text>{parent.notes}</Text>
                </Box>
              )}
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
            Are you sure you want to delete {parent.firstName} {parent.lastName}? This action cannot be undone.
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

export default ParentDetail;

