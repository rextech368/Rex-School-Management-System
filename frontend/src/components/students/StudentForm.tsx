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
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';

// Define the form data type
interface StudentFormData {
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
  currentClassId?: string;
  currentSectionId?: string;
  academicYearId?: string;
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
  createUserAccount: boolean;
  parentIds?: string[];
}

interface StudentFormProps {
  studentId?: string;
  isEdit?: boolean;
}

interface ClassOption {
  id: string;
  name: string;
}

interface SectionOption {
  id: string;
  name: string;
}

interface AcademicYearOption {
  id: string;
  name: string;
  isCurrent: boolean;
}

interface ParentOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const StudentForm: React.FC<StudentFormProps> = ({ studentId, isEdit = false }) => {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [parents, setParents] = useState<ParentOption[]>([]);
  const [selectedParents, setSelectedParents] = useState<string[]>([]);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<StudentFormData>({
    defaultValues: {
      status: 'active',
      createUserAccount: true,
      admissionDate: new Date().toISOString().split('T')[0],
    }
  });

  // Fetch classes, sections, academic years, and parents
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch classes
        const classesResponse = await axios.get('/api/v1/classes');
        setClasses(classesResponse.data.data);

        // Fetch sections
        const sectionsResponse = await axios.get('/api/v1/sections');
        setSections(sectionsResponse.data.data);

        // Fetch academic years
        const academicYearsResponse = await axios.get('/api/v1/academic-years');
        setAcademicYears(academicYearsResponse.data.data);

        // Fetch parents
        const parentsResponse = await axios.get('/api/v1/parents');
        setParents(parentsResponse.data.data);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load form options. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchOptions();
  }, [toast]);

  // Fetch student data if in edit mode
  useEffect(() => {
    if (isEdit && studentId) {
      const fetchStudent = async () => {
        try {
          const response = await axios.get(`/api/v1/students/${studentId}`);
          const studentData = response.data;
          
          // Format dates for form inputs
          if (studentData.dateOfBirth) {
            studentData.dateOfBirth = new Date(studentData.dateOfBirth).toISOString().split('T')[0];
          }
          if (studentData.admissionDate) {
            studentData.admissionDate = new Date(studentData.admissionDate).toISOString().split('T')[0];
          }
          if (studentData.graduationDate) {
            studentData.graduationDate = new Date(studentData.graduationDate).toISOString().split('T')[0];
          }
          
          // Set selected parents
          if (studentData.parents && studentData.parents.length > 0) {
            const parentIds = studentData.parents.map(parent => parent.id);
            setSelectedParents(parentIds);
            studentData.parentIds = parentIds;
          }
          
          reset(studentData);
        } catch (error) {
          console.error('Error fetching student:', error);
          toast({
            title: 'Error',
            description: 'Could not load student data. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      fetchStudent();
    }
  }, [isEdit, studentId, reset, toast]);

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    
    try {
      // Add selected parents to the form data
      data.parentIds = selectedParents;
      
      if (isEdit && studentId) {
        // Update existing student
        await axios.put(`/api/v1/students/${studentId}`, data);
        toast({
          title: 'Success',
          description: 'Student updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Create new student
        await axios.post('/api/v1/students', data);
        toast({
          title: 'Success',
          description: 'Student created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        reset(); // Clear form after successful creation
      }
      
      // Redirect to students list
      router.push('/students');
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

  const handleParentSelection = (parentId: string) => {
    setSelectedParents(prev => {
      if (prev.includes(parentId)) {
        return prev.filter(id => id !== parentId);
      } else {
        return [...prev, parentId];
      }
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Heading size="lg" mb={6}>
        {isEdit ? 'Edit Student' : 'Add New Student'}
      </Heading>

      <Tabs variant="enclosed" mb={6}>
        <TabList>
          <Tab>Basic Information</Tab>
          <Tab>Contact Details</Tab>
          <Tab>Academic Information</Tab>
          <Tab>Medical Information</Tab>
          <Tab>Additional Details</Tab>
          <Tab>Parents</Tab>
        </TabList>

        <TabPanels>
          {/* Basic Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!errors.admissionNumber}>
                <FormLabel>Admission Number</FormLabel>
                <Input
                  {...register('admissionNumber', { required: 'Admission number is required' })}
                  placeholder="e.g., ADM-2023-001"
                  isReadOnly={isEdit} // Make read-only in edit mode
                />
                <FormErrorMessage>{errors.admissionNumber?.message}</FormErrorMessage>
              </FormControl>

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

              <FormControl isInvalid={!!errors.middleName}>
                <FormLabel>Middle Name</FormLabel>
                <Input
                  {...register('middleName')}
                  placeholder="Middle Name (optional)"
                />
                <FormErrorMessage>{errors.middleName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.dateOfBirth}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                />
                <FormErrorMessage>{errors.dateOfBirth?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Select
                  {...register('gender', { required: 'Gender is required' })}
                  placeholder="Select gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
                <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.bloodGroup}>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  {...register('bloodGroup')}
                  placeholder="Select blood group (optional)"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Select>
                <FormErrorMessage>{errors.bloodGroup?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.admissionDate}>
                <FormLabel>Admission Date</FormLabel>
                <Input
                  type="date"
                  {...register('admissionDate', { required: 'Admission date is required' })}
                />
                <FormErrorMessage>{errors.admissionDate?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.graduationDate}>
                <FormLabel>Graduation Date</FormLabel>
                <Input
                  type="date"
                  {...register('graduationDate')}
                />
                <FormErrorMessage>{errors.graduationDate?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  {...register('status', { required: 'Status is required' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                  <option value="suspended">Suspended</option>
                  <option value="expelled">Expelled</option>
                  <option value="alumni">Alumni</option>
                  <option value="pending">Pending</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.nationality}>
                <FormLabel>Nationality</FormLabel>
                <Input
                  {...register('nationality')}
                  placeholder="e.g., Cameroonian"
                />
                <FormErrorMessage>{errors.nationality?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.religion}>
                <FormLabel>Religion</FormLabel>
                <Input
                  {...register('religion')}
                  placeholder="e.g., Christianity"
                />
                <FormErrorMessage>{errors.religion?.message}</FormErrorMessage>
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

              <FormControl isInvalid={!!errors.phoneNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register('phoneNumber')}
                  placeholder="e.g., +237612345678"
                />
                <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="e.g., student@example.com"
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.emergencyContactName}>
                <FormLabel>Emergency Contact Name</FormLabel>
                <Input
                  {...register('emergencyContactName')}
                  placeholder="Emergency Contact Name"
                />
                <FormErrorMessage>{errors.emergencyContactName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.emergencyContactPhone}>
                <FormLabel>Emergency Contact Phone</FormLabel>
                <Input
                  {...register('emergencyContactPhone')}
                  placeholder="Emergency Contact Phone"
                />
                <FormErrorMessage>{errors.emergencyContactPhone?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.emergencyContactRelationship}>
                <FormLabel>Emergency Contact Relationship</FormLabel>
                <Input
                  {...register('emergencyContactRelationship')}
                  placeholder="e.g., Parent, Guardian"
                />
                <FormErrorMessage>{errors.emergencyContactRelationship?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Academic Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={!!errors.currentClassId}>
                <FormLabel>Current Class</FormLabel>
                <Select
                  {...register('currentClassId')}
                  placeholder="Select class"
                >
                  {classes.map(classOption => (
                    <option key={classOption.id} value={classOption.id}>
                      {classOption.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.currentClassId?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.currentSectionId}>
                <FormLabel>Current Section</FormLabel>
                <Select
                  {...register('currentSectionId')}
                  placeholder="Select section"
                >
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.currentSectionId?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.academicYearId}>
                <FormLabel>Academic Year</FormLabel>
                <Select
                  {...register('academicYearId')}
                  placeholder="Select academic year"
                >
                  {academicYears.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name} {year.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.academicYearId?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.rollNumber}>
                <FormLabel>Roll Number</FormLabel>
                <Input
                  {...register('rollNumber')}
                  placeholder="Roll Number"
                />
                <FormErrorMessage>{errors.rollNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.registrationNumber}>
                <FormLabel>Registration Number</FormLabel>
                <Input
                  {...register('registrationNumber')}
                  placeholder="Registration Number"
                />
                <FormErrorMessage>{errors.registrationNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.house}>
                <FormLabel>House/Team</FormLabel>
                <Input
                  {...register('house')}
                  placeholder="e.g., Red House"
                />
                <FormErrorMessage>{errors.house?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.previousSchool}>
                <FormLabel>Previous School</FormLabel>
                <Input
                  {...register('previousSchool')}
                  placeholder="Previous School Name"
                />
                <FormErrorMessage>{errors.previousSchool?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.previousSchoolAddress}>
                <FormLabel>Previous School Address</FormLabel>
                <Textarea
                  {...register('previousSchoolAddress')}
                  placeholder="Previous School Address"
                />
                <FormErrorMessage>{errors.previousSchoolAddress?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.transferCertificateNumber}>
                <FormLabel>Transfer Certificate Number</FormLabel>
                <Input
                  {...register('transferCertificateNumber')}
                  placeholder="Transfer Certificate Number"
                />
                <FormErrorMessage>{errors.transferCertificateNumber?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Medical Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={!!errors.medicalConditions}>
                <FormLabel>Medical Conditions</FormLabel>
                <Textarea
                  {...register('medicalConditions')}
                  placeholder="Any medical conditions"
                />
                <FormErrorMessage>{errors.medicalConditions?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.allergies}>
                <FormLabel>Allergies</FormLabel>
                <Textarea
                  {...register('allergies')}
                  placeholder="Any allergies"
                />
                <FormErrorMessage>{errors.allergies?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.medications}>
                <FormLabel>Medications</FormLabel>
                <Textarea
                  {...register('medications')}
                  placeholder="Any regular medications"
                />
                <FormErrorMessage>{errors.medications?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.specialNeeds}>
                <FormLabel>Special Needs</FormLabel>
                <Textarea
                  {...register('specialNeeds')}
                  placeholder="Any special needs or accommodations"
                />
                <FormErrorMessage>{errors.specialNeeds?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Additional Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={!!errors.birthCertificateNumber}>
                <FormLabel>Birth Certificate Number</FormLabel>
                <Input
                  {...register('birthCertificateNumber')}
                  placeholder="Birth Certificate Number"
                />
                <FormErrorMessage>{errors.birthCertificateNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.idCardNumber}>
                <FormLabel>ID Card Number</FormLabel>
                <Input
                  {...register('idCardNumber')}
                  placeholder="ID Card Number"
                />
                <FormErrorMessage>{errors.idCardNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.scholarshipInfo}>
                <FormLabel>Scholarship Information</FormLabel>
                <Textarea
                  {...register('scholarshipInfo')}
                  placeholder="Scholarship details if applicable"
                />
                <FormErrorMessage>{errors.scholarshipInfo?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.feeCategory}>
                <FormLabel>Fee Category</FormLabel>
                <Input
                  {...register('feeCategory')}
                  placeholder="e.g., Standard, Scholarship"
                />
                <FormErrorMessage>{errors.feeCategory?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.busRouteNumber}>
                <FormLabel>Bus Route Number</FormLabel>
                <Input
                  {...register('busRouteNumber')}
                  placeholder="Bus Route Number"
                />
                <FormErrorMessage>{errors.busRouteNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.busStop}>
                <FormLabel>Bus Stop</FormLabel>
                <Input
                  {...register('busStop')}
                  placeholder="Bus Stop"
                />
                <FormErrorMessage>{errors.busStop?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.hostelRoomNumber}>
                <FormLabel>Hostel Room Number</FormLabel>
                <Input
                  {...register('hostelRoomNumber')}
                  placeholder="Hostel Room Number"
                />
                <FormErrorMessage>{errors.hostelRoomNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lockerNumber}>
                <FormLabel>Locker Number</FormLabel>
                <Input
                  {...register('lockerNumber')}
                  placeholder="Locker Number"
                />
                <FormErrorMessage>{errors.lockerNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.profilePicture}>
                <FormLabel>Profile Picture URL</FormLabel>
                <Input
                  {...register('profilePicture')}
                  placeholder="Profile Picture URL"
                />
                <FormErrorMessage>{errors.profilePicture?.message}</FormErrorMessage>
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
                      Create user account for this student
                    </Checkbox>
                  )}
                />
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Parents Tab */}
          <TabPanel>
            <Box mb={4}>
              <Heading size="md" mb={2}>Associate Parents</Heading>
              <Box maxH="400px" overflowY="auto" p={2} border="1px" borderColor="gray.200" borderRadius="md">
                {parents.length > 0 ? (
                  parents.map(parent => (
                    <Box key={parent.id} p={2} borderBottom="1px" borderColor="gray.100">
                      <Checkbox
                        isChecked={selectedParents.includes(parent.id)}
                        onChange={() => handleParentSelection(parent.id)}
                      >
                        {parent.firstName} {parent.lastName} ({parent.email})
                      </Checkbox>
                    </Box>
                  ))
                ) : (
                  <Box p={4} textAlign="center">No parents found. Please add parents first.</Box>
                )}
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider my={6} />

      <Stack direction="row" spacing={4} justifyContent="flex-end">
        <Button
          variant="outline"
          onClick={() => router.push('/students')}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          {isEdit ? 'Update Student' : 'Create Student'}
        </Button>
      </Stack>
    </Box>
  );
};

export default StudentForm;

