import React from 'react';
import { Box } from '@chakra-ui/react';
import { SectionForm } from '../../../../components/classes';
import { MainLayout } from '../../../../components/layouts';
import { useRouter } from 'next/router';

const EditSectionPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Edit Section">
      <Box>
        {id && typeof id === 'string' && <SectionForm sectionId={id} isEdit={true} />}
      </Box>
    </MainLayout>
  );
};

export default EditSectionPage;

