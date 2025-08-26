import React from 'react';
import { Box } from '@chakra-ui/react';
import { StudentList } from '../../components/students';
import { MainLayout } from '../../components/layouts';

const StudentsPage: React.FC = () => {
  return (
    <MainLayout title="Students">
      <Box>
        <StudentList />
      </Box>
    </MainLayout>
  );
};

export default StudentsPage;

