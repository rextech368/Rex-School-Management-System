import React from 'react';
import { Box } from '@chakra-ui/react';
import { ClassList } from '../../components/classes';
import { MainLayout } from '../../components/layouts';

const ClassesPage: React.FC = () => {
  return (
    <MainLayout title="Classes">
      <Box>
        <ClassList />
      </Box>
    </MainLayout>
  );
};

export default ClassesPage;

