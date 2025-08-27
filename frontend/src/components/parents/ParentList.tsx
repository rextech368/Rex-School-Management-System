import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Badge,
  Input,
  Select,
  HStack,
  useToast,
  Tooltip,
  Spinner,
  Link,
  Checkbox,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, EditIcon, DeleteIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { FaFileExcel, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  relationshipType: string;
  status: string;
  students?: {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
  }[];
}

interface ParentListProps {
  initialParents?: Parent[];
}

const ParentList: React.FC<ParentListProps> = ({ initialParents = [] }) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('');
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParents, setTotalParents] = useState(0);
  const [limit, setLimit] = useState(10);

  // Fetch parents
  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (searchTerm) params.append('name', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        if (relationshipFilter) params.append('relationshipType', relationshipFilter);
        
        const response = await axios.get(`/api/v1/parents?${params.toString()}`);
        setParents(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setTotalParents(response.data.meta.total);
      } catch (error) {
        console.error('Error fetching parents:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch parents',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, [page, limit, searchTerm, statusFilter, relationshipFilter, toast]);

  const handleDelete = async () => {
    if (!selectedParent) return;

    try {
      await axios.delete(`/api/v1/parents/${selectedParent.id}`);
      setParents(parents.filter(parent => parent.id !== selectedParent.id));
      onClose();
      toast({
        title: 'Success',
        description: 'Parent deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting parent:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete parent',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = (parent: Parent) => {
    setSelectedParent(parent);
    onOpen();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handleRelationshipFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRelationshipFilter(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedParents(parents.map(parent => parent.id));
    } else {
      setSelectedParents([]);
    }
  };

  const handleSelectParent = (id: string) => {
    setSelectedParents(prev => {
      if (prev.includes(id)) {
        return prev.filter(parentId => parentId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const exportParents = (format: 'pdf' | 'excel' | 'csv') => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('name', searchTerm);
    if (statusFilter) params.append('status', statusFilter);
    if (relationshipFilter) params.append('relationshipType', relationshipFilter);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = `/api/v1/parents/export/${format}?${params.toString()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const colorScheme = status === 'active' ? 'green' : 'gray';
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  const getRelationshipBadge = (relationshipType: string) => {
    let colorScheme;
    switch (relationshipType) {
      case 'FATHER':
        colorScheme = 'blue';
        break;
      case 'MOTHER':
        colorScheme = 'pink';
        break;
      case 'GUARDIAN':
        colorScheme = 'purple';
        break;
      case 'GRANDPARENT':
        colorScheme = 'teal';
        break;
      default:
        colorScheme = 'gray';
    }
    return <Badge colorScheme={colorScheme}>{relationshipType.toLowerCase()}</Badge>;
  };

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Parents</Heading>
        <NextLink href="/parents/new" passHref>
          <Button as="a" leftIcon={<AddIcon />} colorScheme="blue">
            Add Parent
          </Button>
        </NextLink>
      </Flex>

      <Flex mb={4} flexWrap="wrap" gap={2}>
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
          width={{ base: 'full', md: 'auto' }}
          flex={{ md: 1 }}
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={handleStatusFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <Select
          placeholder="Filter by relationship"
          value={relationshipFilter}
          onChange={handleRelationshipFilter}
          width={{ base: 'full', md: '200px' }}
        >
          <option value="">All Relationships</option>
          <option value="FATHER">Father</option>
          <option value="MOTHER">Mother</option>
          <option value="GUARDIAN">Guardian</option>
          <option value="GRANDPARENT">Grandparent</option>
          <option value="OTHER">Other</option>
        </Select>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
            Export
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaFilePdf />} onClick={() => exportParents('pdf')}>
              Export as PDF
            </MenuItem>
            <MenuItem icon={<FaFileExcel />} onClick={() => exportParents('excel')}>
              Export as Excel
            </MenuItem>
            <MenuItem icon={<FaFileCsv />} onClick={() => exportParents('csv')}>
              Export as CSV
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {selectedParents.length > 0 && (
        <Flex mb={4} alignItems="center">
          <Text mr={4}>{selectedParents.length} parents selected</Text>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
              Bulk Actions
            </MenuButton>
            <MenuList>
              <MenuItem>Send Notification</MenuItem>
              <MenuItem>Update Status</MenuItem>
              <MenuItem>Export Selected</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}

      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th width="40px">
                    <Checkbox
                      isChecked={selectedParents.length === parents.length && parents.length > 0}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Relationship</Th>
                  <Th>Students</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {parents.length > 0 ? (
                  parents.map(parent => (
                    <Tr key={parent.id}>
                      <Td>
                        <Checkbox
                          isChecked={selectedParents.includes(parent.id)}
                          onChange={() => handleSelectParent(parent.id)}
                        />
                      </Td>
                      <Td>
                        <NextLink href={`/parents/${parent.id}`} passHref>
                          <Link color="blue.500">
                            {parent.firstName} {parent.lastName}
                          </Link>
                        </NextLink>
                      </Td>
                      <Td>{parent.email}</Td>
                      <Td>{parent.phoneNumber}</Td>
                      <Td>{getRelationshipBadge(parent.relationshipType)}</Td>
                      <Td>
                        {parent.students && parent.students.length > 0 ? (
                          <HStack spacing={1}>
                            <Text>{parent.students.length}</Text>
                            <Tooltip 
                              label={parent.students.map(s => `${s.firstName} ${s.lastName}`).join(', ')}
                              placement="top"
                            >
                              <InfoIcon boxSize={4} color="gray.500" />
                            </Tooltip>
                          </HStack>
                        ) : (
                          <Text>0</Text>
                        )}
                      </Td>
                      <Td>{getStatusBadge(parent.status)}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Tooltip label="View Parent">
                            <IconButton
                              aria-label="View parent"
                              icon={<ViewIcon />}
                              size="sm"
                              onClick={() => router.push(`/parents/${parent.id}`)}
                            />
                          </Tooltip>
                          <Tooltip label="Edit Parent">
                            <IconButton
                              aria-label="Edit parent"
                              icon={<EditIcon />}
                              size="sm"
                              onClick={() => router.push(`/parents/${parent.id}/edit`)}
                            />
                          </Tooltip>
                          <Tooltip label="Delete Parent">
                            <IconButton
                              aria-label="Delete parent"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => confirmDelete(parent)}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={4}>
                      No parents found
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>

          <Flex justifyContent="space-between" alignItems="center" mt={4}>
            <Text>
              Showing {parents.length} of {totalParents} parents
            </Text>
            <HStack>
              <Button
                size="sm"
                onClick={() => setPage(page - 1)}
                isDisabled={page === 1}
              >
                Previous
              </Button>
              <Text>
                Page {page} of {totalPages}
              </Text>
              <Button
                size="sm"
                onClick={() => setPage(page + 1)}
                isDisabled={page === totalPages}
              >
                Next
              </Button>
              <Select
                size="sm"
                width="80px"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // Reset to first page when changing limit
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Select>
            </HStack>
          </Flex>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete {selectedParent?.firstName} {selectedParent?.lastName}? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ParentList;

