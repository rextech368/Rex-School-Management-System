import React from 'react';
import { Box } from '@chakra-ui/react';
import { ParentList } from '../../components/parents';
import { MainLayout } from '../../components/layouts';

const ParentsPage: React.FC = () => {
  return (
    <MainLayout title="Parents">
      <Box>
        <ParentList />
      </Box>
    </MainLayout>
  );
};

export default ParentsPage;

