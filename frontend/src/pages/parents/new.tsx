import React from 'react';
import { Box } from '@chakra-ui/react';
import { ParentForm } from '../../components/parents';
import { MainLayout } from '../../components/layouts';
import { useRouter } from 'next/router';

const NewParentPage: React.FC = () => {
  const router = useRouter();
  const { studentId } = router.query;

  return (
    <MainLayout title="Add New Parent">
      <Box>
        <ParentForm initialStudentId={studentId as string} />
      </Box>
    </MainLayout>
  );
};

export default NewParentPage;

