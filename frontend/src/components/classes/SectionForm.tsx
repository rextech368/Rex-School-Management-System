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
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';

// Define the form data type
interface SectionFormData {
  name: string;
  displayName?: string;
  description?: string;
  capacity?: number;
  status: string;
  roomNumber?: string;
  notes?: string;
  classId: string;
  classSectionTeacherId?: string;
  teacherIds?: string[];
}

interface SectionFormProps {
  sectionId?: string;
  classId?: string;
  isEdit?: boolean;
}

interface Class {
  id: string;
  name: string;
  grade?: string;
}

interface Teacher {
  id: string;
  fullName: string;
  email: string;
}

const SectionForm: React.FC<SectionFormProps> = ({ sectionId, classId, isEdit = false }) => {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const { register, handleSubmit, control, reset, formState: { errors }, setValue } = useForm<SectionFormData>({
    defaultValues: {
      status: 'active',
      classId: classId || '',
    }
  });

  // Fetch classes and teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, teachersRes] = await Promise.all([
          axios.get('/api/v1/classes'),
          axios.get('/api/v1/users?role=Teacher'),
        ]);
        
        setClasses(classesRes.data.data);
        setTeachers(teachersRes.data.data);
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

  // Set class ID from props
  useEffect(() => {
    if (classId) {
      setValue('classId', classId);
    }
  }, [classId, setValue]);

  // Fetch section data if in edit mode
  useEffect(() => {
    if (isEdit && sectionId) {
      const fetchSection = async () => {
        try {
          const response = await axios.get(`/api/v1/classes/sections/${sectionId}`);
          const sectionData = response.data;
          
          // Set selected teachers
          if (sectionData.teachers && sectionData.teachers.length > 0) {
            const teacherIds = sectionData.teachers.map(teacher => teacher.id);
            setSelectedTeachers(teacherIds);
            sectionData.teacherIds = teacherIds;
          }
          
          reset(sectionData);
        } catch (error) {
          console.error('Error fetching section:', error);
          toast({
            title: 'Error',
            description: 'Could not load section data. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      };

      fetchSection();
    }
  }, [isEdit, sectionId, reset, toast]);

  const onSubmit = async (data: SectionFormData) => {
    setIsSubmitting(true);
    
    try {
      // Add selected teachers to the form data
      data.teacherIds = selectedTeachers;
      
      if (isEdit && sectionId) {
        // Update existing section
        await axios.patch(`/api/v1/classes/sections/${sectionId}`, data);
        toast({
          title: 'Success',
          description: 'Section updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Create new section
        await axios.post('/api/v1/classes/sections', data);
        toast({
          title: 'Success',
          description: 'Section created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        reset(); // Clear form after successful creation
      }
      
      // Redirect to class details or sections list
      if (classId) {
        router.push(`/classes/${classId}`);
      } else {
        router.push('/classes');
      }
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

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={4}>
      <Heading size="lg" mb={6}>
        {isEdit ? 'Edit Section' : 'Add New Section'}
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <FormControl isRequired isInvalid={!!errors.classId}>
          <FormLabel>Class</FormLabel>
          <Select
            {...register('classId', { required: 'Class is required' })}
            placeholder="Select Class"
            isDisabled={!!classId} // Disable if classId is provided via props
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.grade ? `(${cls.grade})` : ''}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.classId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Section Name</FormLabel>
          <Input
            {...register('name', { required: 'Section name is required' })}
            placeholder="Section Name (e.g., A, B, Red, Blue)"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.displayName}>
          <FormLabel>Display Name</FormLabel>
          <Input
            {...register('displayName')}
            placeholder="Display Name (e.g., Section A, Blue Group)"
          />
          <FormErrorMessage>{errors.displayName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.capacity}>
          <FormLabel>Capacity</FormLabel>
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <NumberInput
                min={1}
                max={100}
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

        <FormControl isInvalid={!!errors.roomNumber}>
          <FormLabel>Room Number</FormLabel>
          <Input
            {...register('roomNumber')}
            placeholder="Room Number"
          />
          <FormErrorMessage>{errors.roomNumber?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.classSectionTeacherId}>
          <FormLabel>Section Teacher</FormLabel>
          <Select
            {...register('classSectionTeacherId')}
            placeholder="Select Section Teacher"
          >
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.fullName} ({teacher.email})
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.classSectionTeacherId?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description} gridColumn="span 2">
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register('description')}
            placeholder="Section description"
            rows={3}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
      </SimpleGrid>

      <Box mb={6}>
        <FormControl>
          <FormLabel>Additional Teachers</FormLabel>
          <Box maxH="200px" overflowY="auto" p={2} border="1px" borderColor="gray.200" borderRadius="md">
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

      <FormControl isInvalid={!!errors.notes} mb={6}>
        <FormLabel>Notes</FormLabel>
        <Textarea
          {...register('notes')}
          placeholder="Additional notes about this section"
          rows={3}
        />
        <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
      </FormControl>

      <Divider my={6} />

      <Stack direction="row" spacing={4} justifyContent="flex-end">
        <Button
          variant="outline"
          onClick={() => classId ? router.push(`/classes/${classId}`) : router.push('/classes')}
        >
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          {isEdit ? 'Update Section' : 'Create Section'}
        </Button>
      </Stack>
    </Box>
  );
};

export default SectionForm;

