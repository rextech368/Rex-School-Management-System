import React from 'react';
import { Box } from '@chakra-ui/react';
import { StudentDetail } from '../../../components/students';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const StudentDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Student Details">
      <Box>
        {id && typeof id === 'string' && <StudentDetail studentId={id} />}
      </Box>
    </MainLayout>
  );
};

export default StudentDetailPage;

