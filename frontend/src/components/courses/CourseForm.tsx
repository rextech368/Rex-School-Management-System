import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Course } from '@/lib/types';
import { Editor } from '@tinymce/tinymce-react';

interface CourseFormProps {
  initialData?: Course;
  isEditing?: boolean;
  onSubmitSuccess: (courseId: string) => void;
}

// Department options
const departments = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Social Studies',
  'Computer Science',
  'Foreign Languages',
  'Arts',
  'Music',
  'Physical Education',
  'Health',
  'Special Education',
  'Career and Technical Education'
];

// Grade level options
const gradeLevels = Array.from({ length: 12 }, (_, i) => i + 1);

const CourseForm: React.FC<CourseFormProps> = ({ 
  initialData, 
  isEditing = false,
  onSubmitSuccess 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch('/api/courses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses for prerequisites');
        }
        
        const data = await response.json();
        // Filter out the current course if editing
        const filteredCourses = isEditing && initialData 
          ? data.filter((course: Course) => course.id !== initialData.id)
          : data;
          
        setAvailableCourses(filteredCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        // Non-critical error, so just log it
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [isEditing, initialData]);

  const validationSchema = Yup.object({
    code: Yup.string()
      .required('Course code is required')
      .max(20, 'Course code must be at most 20 characters'),
    name: Yup.string()
      .required('Course name is required')
      .max(100, 'Course name must be at most 100 characters'),
    description: Yup.string()
      .nullable(),
    department: Yup.string()
      .required('Department is required'),
    credits: Yup.number()
      .required('Credits are required')
      .min(0, 'Credits must be a positive number')
      .max(12, 'Credits cannot exceed 12'),
    gradeLevel: Yup.array()
      .of(Yup.number())
      .min(1, 'At least one grade level must be selected'),
    prerequisites: Yup.array()
      .of(Yup.string())
      .nullable(),
    isActive: Yup.boolean()
      .required('Status is required')
  });

  const formik = useFormik({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      department: initialData?.department || '',
      credits: initialData?.credits || 1,
      gradeLevel: initialData?.gradeLevel ? 
        (Array.isArray(initialData.gradeLevel) ? 
          initialData.gradeLevel : 
          [initialData.gradeLevel]) : 
        [],
      prerequisites: initialData?.prerequisites || [],
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        const url = isEditing && initialData 
          ? `/api/courses/${initialData.id}` 
          : '/api/courses';
        
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || 'Failed to save course');
        }
        
        const savedCourse = await response.json();
        onSubmitSuccess(savedCourse.id);
      } catch (err) {
        console.error('Error saving course:', err);
        setError(err.message || 'An error occurred while saving the course. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCancel = () => {
    if (isEditing && initialData) {
      router.push(`/courses/${initialData.id}`);
    } else {
      router.push('/courses');
    }
  };

  const handleDescriptionChange = (content: string) => {
    formik.setFieldValue('description', content);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="code"
            name="code"
            label="Course Code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.code && Boolean(formik.errors.code)}
            helperText={formik.touched.code && formik.errors.code}
            required
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Course Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            required
            margin="normal"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Course Description
          </Typography>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <Editor
              apiKey="your-tinymce-api-key" // Replace with your TinyMCE API key
              initialValue={formik.values.description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={handleDescriptionChange}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl 
            fullWidth 
            margin="normal"
            error={formik.touched.department && Boolean(formik.errors.department)}
            required
          >
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Department"
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.department && formik.errors.department && (
              <FormHelperText>{formik.errors.department}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="credits"
            name="credits"
            label="Credits"
            type="number"
            value={formik.values.credits}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.credits && Boolean(formik.errors.credits)}
            helperText={formik.touched.credits && formik.errors.credits}
            required
            margin="normal"
            InputProps={{
              inputProps: { min: 0, max: 12, step: 0.5 }
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <FormControl 
            fullWidth 
            margin="normal"
            error={formik.touched.gradeLevel && Boolean(formik.errors.gradeLevel)}
            required
          >
            <InputLabel id="grade-level-label">Grade Level</InputLabel>
            <Select
              labelId="grade-level-label"
              id="gradeLevel"
              name="gradeLevel"
              multiple
              value={formik.values.gradeLevel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              input={<OutlinedInput label="Grade Level" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={`Grade ${value}`} />
                  ))}
                </Box>
              )}
            >
              {gradeLevels.map((grade) => (
                <MenuItem key={grade} value={grade}>
                  <Checkbox checked={formik.values.gradeLevel.indexOf(grade) > -1} />
                  <ListItemText primary={`Grade ${grade}`} />
                </MenuItem>
              ))}
            </Select>
            {formik.touched.gradeLevel && formik.errors.gradeLevel && (
              <FormHelperText>{formik.errors.gradeLevel as string}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl 
            fullWidth 
            margin="normal"
          >
            <InputLabel id="prerequisites-label">Prerequisites</InputLabel>
            <Select
              labelId="prerequisites-label"
              id="prerequisites"
              name="prerequisites"
              multiple
              value={formik.values.prerequisites}
              onChange={formik.handleChange}
              input={<OutlinedInput label="Prerequisites" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const course = availableCourses.find(c => c.id === value);
                    return (
                      <Chip key={value} label={course ? `${course.code}: ${course.name}` : value} />
                    );
                  })}
                </Box>
              )}
              startAdornment={
                loadingCourses ? (
                  <InputAdornment position="start">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ) : null
              }
            >
              {availableCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  <Checkbox checked={formik.values.prerequisites.indexOf(course.id) > -1} />
                  <ListItemText primary={`${course.code}: ${course.name}`} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select courses that must be completed before this course</FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl component="fieldset" margin="normal">
            <Typography variant="subtitle1" gutterBottom>
              Course Status
            </Typography>
            <FormControl fullWidth>
              <Select
                id="isActive"
                name="isActive"
                value={formik.values.isActive}
                onChange={formik.handleChange}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
              <FormHelperText>
                Active courses are visible in the catalog and can have classes scheduled
              </FormHelperText>
            </FormControl>
          </FormControl>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {isEditing ? 'Update Course' : 'Create Course'}
        </Button>
      </Box>
    </Box>
  );
};

export default CourseForm;

