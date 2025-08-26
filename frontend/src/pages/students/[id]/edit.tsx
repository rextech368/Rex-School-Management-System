import React from 'react';
import { Box } from '@chakra-ui/react';
import { StudentForm } from '../../../components/students';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const EditStudentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Edit Student">
      <Box>
        {id && typeof id === 'string' && <StudentForm studentId={id} isEdit={true} />}
      </Box>
    </MainLayout>
  );
};

export default EditStudentPage;

