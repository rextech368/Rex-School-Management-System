import React from 'react';
import { Box } from '@chakra-ui/react';
import { ParentDetail } from '../../../components/parents';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const ParentDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Parent Details">
      <Box>
        {id && typeof id === 'string' && <ParentDetail parentId={id} />}
      </Box>
    </MainLayout>
  );
};

export default ParentDetailPage;

