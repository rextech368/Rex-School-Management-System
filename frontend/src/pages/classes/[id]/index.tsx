import React from 'react';
import { Box } from '@chakra-ui/react';
import { ClassDetail } from '../../../components/classes';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const ClassDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Class Details">
      <Box>
        {id && typeof id === 'string' && <ClassDetail classId={id} />}
      </Box>
    </MainLayout>
  );
};

export default ClassDetailPage;

