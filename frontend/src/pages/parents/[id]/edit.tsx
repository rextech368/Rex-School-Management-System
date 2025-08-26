import React from 'react';
import { Box } from '@chakra-ui/react';
import { ParentForm } from '../../../components/parents';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const EditParentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Edit Parent">
      <Box>
        {id && typeof id === 'string' && <ParentForm parentId={id} isEdit={true} />}
      </Box>
    </MainLayout>
  );
};

export default EditParentPage;

