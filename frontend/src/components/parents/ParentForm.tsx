import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Stack,
  Heading,
  SimpleGrid,
  Divider,
  useToast,
  Checkbox,
  FormErrorMessage,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';

// Define the form data type
interface ParentFormData {
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
  createUserAccount: boolean;
  studentIds: string[];
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

interface ParentFormProps {
  parentId?: string;
  isEdit?: boolean;
  initialStudentId?: string;
}

interface StudentOption {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  currentClass?: {
    name: string;
  };
}

const ParentForm: React.FC<ParentFormProps> = ({ parentId, isEdit = false, initialStudentId }) => {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(initialStudentId ? [initialStudentId] : []);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ParentFormData>({
    defaultValues: {
      status: 'active',
      createUserAccount: true,
      isAuthorizedForPickup: true,
      hasFinancialResponsibility: true,
      relationshipType: 'PARENT',
      preferences: {
        emailNotifications: true,
        smsNotifications: true,
        whatsappNotifications: true,
        inAppNotifications: true,
        attendanceNotifications: true,
        academicNotifications: true,
        behaviorNotifications: true,
        financialNotifications: true,
        eventNotifications: true,
        emergencyNotifications: true,
        preferredLanguage: 'en',
        preferredCommunicationChannel: 'email',
        receiveMarketingCommunications: false,
        receiveNewsletters: true,
      }
    }
  });

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/api/v1/students');
        setStudents(response.data.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load students. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchStudents();
  }, [toast]);

  // Fetch parent data if in edit mode
  useEffect(() => {
    if (isEdit && parentId) {
      const fetchParent = async () => {
        try {
          const response = await axios.get(`/api/v1/parents/${parentId}`);
          const parentData = response.data;
          
          // Set selected students
          if (parentData.students && parentData.students.length > 0) {
            const studentIds = parentData.students.map(student => student.id);
            setSelectedStudents(studentIds);
            parentData.studentIds = studentIds;
          }
          
          reset(parentData);
        } catch (error) {
          console.error('Error fetching parent:', error);
          toast({
            title: 'Error',
            description: 'Could not load parent data. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      fetchParent();
    }
  }, [isEdit, parentId, reset, toast]);

  // Set initial student if provided via query param
  useEffect(() => {
    if (initialStudentId && !isEdit) {
      setSelectedStudents([initialStudentId]);
    }
  }, [initialStudentId, isEdit]);

  const onSubmit = async (data: ParentFormData) => {
    setIsSubmitting(true);
    
    try {
      // Add selected students to the form data
      data.studentIds = selectedStudents;
      
      if (isEdit && parentId) {
        // Update existing parent
        await axios.patch(`/api/v1/parents/${parentId}`, data);
        toast({
          title: 'Success',
          description: 'Parent updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Create new parent
        await axios.post('/api/v1/parents', data);
        toast({
          title: 'Success',
          description: 'Parent created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        reset(); // Clear form after successful creation
      }
      
      // Redirect to parents list
      router.push('/parents');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Heading size="lg" mb={6}>
        {isEdit ? 'Edit Parent' : 'Add New Parent'}
      </Heading>

      <Tabs variant="enclosed" mb={6}>
        <TabList>
          <Tab>Basic Information</Tab>
          <Tab>Contact Details</Tab>
          <Tab>Students</Tab>
          <Tab>Notification Preferences</Tab>
          <Tab>Additional Details</Tab>
        </TabList>

        <TabPanels>
          {/* Basic Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  {...register('firstName', { required: 'First name is required' })}
                  placeholder="First Name"
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  {...register('lastName', { required: 'Last name is required' })}
                  placeholder="Last Name"
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="Email"
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                  placeholder="Phone Number"
                />
                <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.relationshipType}>
                <FormLabel>Relationship Type</FormLabel>
                <Select
                  {...register('relationshipType', { required: 'Relationship type is required' })}
                >
                  <option value="FATHER">Father</option>
                  <option value="MOTHER">Mother</option>
                  <option value="GUARDIAN">Guardian</option>
                  <option value="GRANDPARENT">Grandparent</option>
                  <option value="OTHER">Other</option>
                </Select>
                <FormErrorMessage>{errors.relationshipType?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.occupation}>
                <FormLabel>Occupation</FormLabel>
                <Input
                  {...register('occupation')}
                  placeholder="Occupation"
                />
                <FormErrorMessage>{errors.occupation?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.employer}>
                <FormLabel>Employer</FormLabel>
                <Input
                  {...register('employer')}
                  placeholder="Employer"
                />
                <FormErrorMessage>{errors.employer?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.workPhone}>
                <FormLabel>Work Phone</FormLabel>
                <Input
                  {...register('workPhone')}
                  placeholder="Work Phone"
                />
                <FormErrorMessage>{errors.workPhone?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  {...register('status', { required: 'Status is required' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.profilePicture}>
                <FormLabel>Profile Picture URL</FormLabel>
                <Input
                  {...register('profilePicture')}
                  placeholder="Profile Picture URL"
                />
                <FormErrorMessage>{errors.profilePicture?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Contact Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={!!errors.address}>
                <FormLabel>Address</FormLabel>
                <Textarea
                  {...register('address')}
                  placeholder="Street address"
                />
                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.city}>
                <FormLabel>City</FormLabel>
                <Input
                  {...register('city')}
                  placeholder="City"
                />
                <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.state}>
                <FormLabel>State/Province</FormLabel>
                <Input
                  {...register('state')}
                  placeholder="State/Province"
                />
                <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.country}>
                <FormLabel>Country</FormLabel>
                <Input
                  {...register('country')}
                  placeholder="Country"
                />
                <FormErrorMessage>{errors.country?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.postalCode}>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  {...register('postalCode')}
                  placeholder="Postal Code"
                />
                <FormErrorMessage>{errors.postalCode?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Students Tab */}
          <TabPanel>
            <Box mb={4}>
              <Heading size="md" mb={2}>Associate Students</Heading>
              <Box maxH="400px" overflowY="auto" p={2} border="1px" borderColor="gray.200" borderRadius="md">
                {students.length > 0 ? (
                  students.map(student => (
                    <Box key={student.id} p={2} borderBottom="1px" borderColor="gray.100">
                      <Checkbox
                        isChecked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelection(student.id)}
                      >
                        {student.firstName} {student.lastName} ({student.admissionNumber})
                        {student.currentClass && ` - ${student.currentClass.name}`}
                      </Checkbox>
                    </Box>
                  ))
                ) : (
                  <Box p={4} textAlign="center">No students found. Please add students first.</Box>
                )}
              </Box>
            </Box>
          </TabPanel>

          {/* Notification Preferences Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Heading size="sm" mb={4}>Communication Channels</Heading>
                <Stack spacing={3}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-notifications" mb="0">
                      Email Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.emailNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="email-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="sms-notifications" mb="0">
                      SMS Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.smsNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="sms-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="whatsapp-notifications" mb="0">
                      WhatsApp Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.whatsappNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="whatsapp-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="in-app-notifications" mb="0">
                      In-App Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.inAppNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="in-app-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>
                </Stack>
              </Box>

              <Box>
                <Heading size="sm" mb={4}>Notification Types</Heading>
                <Stack spacing={3}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="attendance-notifications" mb="0">
                      Attendance Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.attendanceNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="attendance-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="academic-notifications" mb="0">
                      Academic Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.academicNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="academic-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="behavior-notifications" mb="0">
                      Behavior Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.behaviorNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="behavior-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="financial-notifications" mb="0">
                      Financial Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.financialNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="financial-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="event-notifications" mb="0">
                      Event Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.eventNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="event-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="emergency-notifications" mb="0">
                      Emergency Notifications
                    </FormLabel>
                    <Controller
                      name="preferences.emergencyNotifications"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="emergency-notifications"
                          isChecked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>
                </Stack>
              </Box>

              <FormControl>
                <FormLabel>Preferred Language</FormLabel>
                <Controller
                  name="preferences.preferredLanguage"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="ar">Arabic</option>
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Preferred Communication Channel</FormLabel>
                <Controller
                  name="preferences.preferredCommunicationChannel"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="in-app">In-App</option>
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notification Frequency</FormLabel>
                <Controller
                  name="preferences.notificationFrequency"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select frequency">
                      <option value="immediate">Immediate</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </Select>
                  )}
                />
              </FormControl>

              <Box>
                <FormControl>
                  <FormLabel>Quiet Hours</FormLabel>
                  <SimpleGrid columns={2} spacing={2}>
                    <Box>
                      <Text fontSize="sm">Start</Text>
                      <Input
                        type="time"
                        {...register('preferences.quietHoursStart')}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm">End</Text>
                      <Input
                        type="time"
                        {...register('preferences.quietHoursEnd')}
                      />
                    </Box>
                  </SimpleGrid>
                </FormControl>
              </Box>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="marketing-communications" mb="0">
                  Receive Marketing Communications
                </FormLabel>
                <Controller
                  name="preferences.receiveMarketingCommunications"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="marketing-communications"
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="newsletters" mb="0">
                  Receive Newsletters
                </FormLabel>
                <Controller
                  name="preferences.receiveNewsletters"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="newsletters"
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </FormControl>

              <FormControl gridColumn="span 2">
                <FormLabel>Additional Preferences</FormLabel>
                <Textarea
                  {...register('preferences.additionalPreferences')}
                  placeholder="Any additional preferences or notes"
                />
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Additional Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={!!errors.emergencyContactPriority}>
                <FormLabel>Emergency Contact Priority</FormLabel>
                <Select
                  {...register('emergencyContactPriority')}
                  placeholder="Select priority"
                >
                  <option value="1">Primary (1)</option>
                  <option value="2">Secondary (2)</option>
                  <option value="3">Tertiary (3)</option>
                </Select>
                <FormErrorMessage>{errors.emergencyContactPriority?.message}</FormErrorMessage>
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="authorized-pickup" mb="0">
                  Authorized for Pickup
                </FormLabel>
                <Controller
                  name="isAuthorizedForPickup"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="authorized-pickup"
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="financial-responsibility" mb="0">
                  Financial Responsibility
                </FormLabel>
                <Controller
                  name="hasFinancialResponsibility"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="financial-responsibility"
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  {...register('notes')}
                  placeholder="Any additional notes about this parent"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Create User Account</FormLabel>
                <Controller
                  name="createUserAccount"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      isChecked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      isDisabled={isEdit} // Disable in edit mode
                    >
                      Create user account for this parent
                    </Checkbox>
                  )}
                />
              </FormControl>
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider my={6} />

      <Stack direction="row" spacing={4} justifyContent="flex-end">
        <Button
          variant="outline"
          onClick={() => router.push('/parents')}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          {isEdit ? 'Update Parent' : 'Create Parent'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ParentForm;

