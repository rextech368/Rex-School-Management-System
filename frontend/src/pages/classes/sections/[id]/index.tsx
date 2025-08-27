import React from 'react';
import { Box } from '@chakra-ui/react';
import { SectionDetail } from '../../../../components/classes';
import { MainLayout } from '../../../../components/layouts';
import { useRouter } from 'next/router';

const SectionDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainLayout title="Section Details">
      <Box>
        {id && typeof id === 'string' && <SectionDetail sectionId={id} />}
      </Box>
    </MainLayout>
  );
};

export default SectionDetailPage;

