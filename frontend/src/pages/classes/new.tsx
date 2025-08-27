import React from 'react';
import { Box } from '@chakra-ui/react';
import { ClassForm } from '../../components/classes';
import { MainLayout } from '../../components/layouts';

const NewClassPage: React.FC = () => {
  return (
    <MainLayout title="Add New Class">
      <Box>
        <ClassForm />
      </Box>
    </MainLayout>
  );
};

export default NewClassPage;

