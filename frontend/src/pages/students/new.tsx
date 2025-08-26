import React from 'react';
import { Box } from '@chakra-ui/react';
import { StudentForm } from '../../components/students';
import { MainLayout } from '../../components/layouts';

const NewStudentPage: React.FC = () => {
  return (
    <MainLayout title="Add New Student">
      <Box>
        <StudentForm />
      </Box>
    </MainLayout>
  );
};

export default NewStudentPage;

