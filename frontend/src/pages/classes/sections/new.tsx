import React from 'react';
import { Box } from '@chakra-ui/react';
import { SectionForm } from '../../../components/classes';
import { MainLayout } from '../../../components/layouts';
import { useRouter } from 'next/router';

const NewSectionPage: React.FC = () => {
  const router = useRouter();
  const { classId } = router.query;

  return (
    <MainLayout title="Add New Section">
      <Box>
        <SectionForm classId={typeof classId === 'string' ? classId : undefined} />
      </Box>
    </MainLayout>
  );
};

export default NewSectionPage;

