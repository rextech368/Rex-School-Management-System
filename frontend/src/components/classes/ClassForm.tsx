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
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';

// Define the form data type
interface ClassFormData {
  name: string;
  displayName?: string;
  description?: string;
  grade?: string;
  level?: number;
  capacity?: number;
  status: string;
  roomNumber?: string;
  building?: string;
  floor?: string;
  notes?: string;
  academicYearId?: string;
  headTeacherId?: string;
  teacherIds?: string[];
  subjectIds?: string[];
}

interface ClassFormProps {
  classId?: string;
  isEdit?: boolean;
}

interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
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

const ClassForm: React.FC<ClassFormProps> = ({ classId, isEdit = false }) => {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ClassFormData>({
    defaultValues: {
      status: 'active',
    }
  });

  // Fetch academic years, teachers, and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicYearsRes, teachersRes, subjectsRes] = await Promise.all([
          axios.get('/api/v1/academic/years'),
          axios.get('/api/v1/users?role=Teacher'),
          axios.get('/api/v1/academic/subjects'),
        ]);
        
        setAcademicYears(academicYearsRes.data.data);
        setTeachers(teachersRes.data.data);
        setSubjects(subjectsRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load required data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [toast]);

  // Fetch class data if in edit mode
  useEffect(() => {
    if (isEdit && classId) {
      const fetchClass = async () => {
        try {
          const response = await axios.get(`/api/v1/classes/${classId}`);
          const classData = response.data;
          
          // Set selected teachers
          if (classData.teachers && classData.teachers.length > 0) {
            const teacherIds = classData.teachers.map(teacher => teacher.id);
            setSelectedTeachers(teacherIds);
            classData.teacherIds = teacherIds;
          }
          
          // Set selected subjects
          if (classData.subjects && classData.subjects.length > 0) {
            const subjectIds = classData.subjects.map(subject => subject.id);
            setSelectedSubjects(subjectIds);
            classData.subjectIds = subjectIds;
          }
          
          reset(classData);
        } catch (error) {
          console.error('Error fetching class:', error);
          toast({
            title: 'Error',
            description: 'Could not load class data. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      fetchClass();
    }
  }, [isEdit, classId, reset, toast]);

  const onSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true);
    
    try {
      // Add selected teachers and subjects to the form data
      data.teacherIds = selectedTeachers;
      data.subjectIds = selectedSubjects;
      
      if (isEdit && classId) {
        // Update existing class
        await axios.patch(`/api/v1/classes/${classId}`, data);
        toast({
          title: 'Success',
          description: 'Class updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Create new class
        await axios.post('/api/v1/classes', data);
        toast({
          title: 'Success',
          description: 'Class created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        reset(); // Clear form after successful creation
      }
      
      // Redirect to classes list
      router.push('/classes');
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

  const handleTeacherSelection = (teacherId: string) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId);
      } else {
        return [...prev, teacherId];
      }
    });
  };

  const handleSubjectSelection = (subjectId: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Heading size="lg" mb={6}>
        {isEdit ? 'Edit Class' : 'Add New Class'}
      </Heading>

      <Tabs variant="enclosed" mb={6}>
        <TabList>
          <Tab>Basic Information</Tab>
          <Tab>Location Details</Tab>
          <Tab>Teachers & Subjects</Tab>
          <Tab>Additional Details</Tab>
        </TabList>

        <TabPanels>
          {/* Basic Information Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Class Name</FormLabel>
                <Input
                  {...register('name', { required: 'Class name is required' })}
                  placeholder="Class Name (e.g., Grade 1, Form 3)"
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.displayName}>
                <FormLabel>Display Name</FormLabel>
                <Input
                  {...register('displayName')}
                  placeholder="Display Name (e.g., First Grade, Senior 3)"
                />
                <FormErrorMessage>{errors.displayName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.grade}>
                <FormLabel>Grade</FormLabel>
                <Input
                  {...register('grade')}
                  placeholder="Grade (e.g., Grade 1, Form 3)"
                />
                <FormErrorMessage>{errors.grade?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.level}>
                <FormLabel>Level</FormLabel>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      min={1}
                      max={20}
                      {...field}
                      onChange={(_, value) => field.onChange(value)}
                    >
                      <NumberInputField placeholder="Level (e.g., 1, 2, 3)" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>{errors.level?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.capacity}>
                <FormLabel>Capacity</FormLabel>
                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      min={1}
                      max={200}
                      {...field}
                      onChange={(_, value) => field.onChange(value)}
                    >
                      <NumberInputField placeholder="Maximum number of students" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                <FormErrorMessage>{errors.capacity?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  {...register('status', { required: 'Status is required' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </Select>
                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.academicYearId}>
                <FormLabel>Academic Year</FormLabel>
                <Select
                  {...register('academicYearId')}
                  placeholder="Select Academic Year"
                >
                  {academicYears.map(year => (
                    <option key={year.id} value={year.id}>
                      {year.name} {year.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.academicYearId?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description} gridColumn="span 2">
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register('description')}
                  placeholder="Class description"
                  rows={3}
                />
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Location Details Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={!!errors.roomNumber}>
                <FormLabel>Room Number</FormLabel>
                <Input
                  {...register('roomNumber')}
                  placeholder="Room Number"
                />
                <FormErrorMessage>{errors.roomNumber?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.building}>
                <FormLabel>Building</FormLabel>
                <Input
                  {...register('building')}
                  placeholder="Building Name or Number"
                />
                <FormErrorMessage>{errors.building?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.floor}>
                <FormLabel>Floor</FormLabel>
                <Input
                  {...register('floor')}
                  placeholder="Floor Number or Name"
                />
                <FormErrorMessage>{errors.floor?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </TabPanel>

          {/* Teachers & Subjects Tab */}
          <TabPanel>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <FormControl isInvalid={!!errors.headTeacherId}>
                  <FormLabel>Head Teacher</FormLabel>
                  <Select
                    {...register('headTeacherId')}
                    placeholder="Select Head Teacher"
                  >
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.fullName} ({teacher.email})
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.headTeacherId?.message}</FormErrorMessage>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Teachers</FormLabel>
                  <Box maxH="300px" overflowY="auto" p={2} border="1px" borderColor="gray.200" borderRadius="md">
                    {teachers.length > 0 ? (
                      teachers.map(teacher => (
                        <Box key={teacher.id} p={2} borderBottom="1px" borderColor="gray.100">
                          <Checkbox
                            isChecked={selectedTeachers.includes(teacher.id)}
                            onChange={() => handleTeacherSelection(teacher.id)}
                          >
                            {teacher.fullName} ({teacher.email})
                          </Checkbox>
                        </Box>
                      ))
                    ) : (
                      <Box p={4} textAlign="center">No teachers found.</Box>
                    )}
                  </Box>
                </FormControl>
              </Box>

              <Box>
                <FormControl mt={4}>
                  <FormLabel>Subjects</FormLabel>
                  <Box maxH="300px" overflowY="auto" p={2} border="1px" borderColor="gray.200" borderRadius="md">
                    {subjects.length > 0 ? (
                      subjects.map(subject => (
                        <Box key={subject.id} p={2} borderBottom="1px" borderColor="gray.100">
                          <Checkbox
                            isChecked={selectedSubjects.includes(subject.id)}
                            onChange={() => handleSubjectSelection(subject.id)}
                          >
                            {subject.name} ({subject.code})
                          </Checkbox>
                        </Box>
                      ))
                    ) : (
                      <Box p={4} textAlign="center">No subjects found.</Box>
                    )}
                  </Box>
                </FormControl>
              </Box>
            </SimpleGrid>
          </TabPanel>

          {/* Additional Details Tab */}
          <TabPanel>
            <FormControl isInvalid={!!errors.notes}>
              <FormLabel>Notes</FormLabel>
              <Textarea
                {...register('notes')}
                placeholder="Additional notes about this class"
                rows={5}
              />
              <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
            </FormControl>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider my={6} />

      <Stack direction="row" spacing={4} justifyContent="flex-end">
        <Button
          variant="outline"
          onClick={() => router.push('/classes')}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          {isEdit ? 'Update Class' : 'Create Class'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ClassForm;

