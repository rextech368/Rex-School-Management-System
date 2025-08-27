import React from 'react';
import { Box } from '@chakra-ui/react';
import { ClassForm } from '../../../components/classes';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const EditClassPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Edit Class">
      <Box>
        {id && typeof id === 'string' && <ClassForm classId={id} isEdit={true} />}
      </Box>
    </MainLayout>
  );
};

export default EditClassPage;

