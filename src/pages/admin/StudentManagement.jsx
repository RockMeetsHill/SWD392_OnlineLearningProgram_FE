import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  HStack,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import {
  SearchIcon,
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFilter,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";

// Mock data
const initialStudents = [
  {
    id: "ST-2023-001",
    name: "Emma Watson",
    email: "emma.watson@example.com",
    phone: "+1 (555) 123-4567",
    joinedDate: "Oct 24, 2023",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "ST-2023-042",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 987-6543",
    joinedDate: "Sep 15, 2023",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "ST-2023-089",
    name: "Sophia Lee",
    email: "sophia.l@example.com",
    phone: "+1 (555) 234-5678",
    joinedDate: "Aug 02, 2023",
    status: "Inactive",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "ST-2023-104",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1 (555) 876-5432",
    joinedDate: "Jul 19, 2023",
    status: "Blocked",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "ST-2023-112",
    name: "Ava Johnson",
    email: "ava.j@example.com",
    phone: "+1 (555) 345-6789",
    joinedDate: "Jun 10, 2023",
    status: "Active",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
];

const statusColorMap = {
  Active: "green",
  Inactive: "gray",
  Blocked: "red",
};

const StudentManagement = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);

  const toast = useToast();

  // Filter & Search
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aVal = a[sortField]?.toLowerCase() || "";
    const bVal = b[sortField]?.toLowerCase() || "";
    if (sortOrder === "asc") return aVal.localeCompare(bVal);
    return bVal.localeCompare(aVal);
  });

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ name: "", email: "", phone: "", status: "Active" });
    onOpen();
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      status: student.status,
    });
    onOpen();
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    setStudents(students.filter((s) => s.id !== selectedStudent.id));
    toast({
      title: "Student deleted.",
      description: `${selectedStudent.name} has been removed.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and Email are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (isEditing) {
      setStudents(
        students.map((s) =>
          s.id === selectedStudent.id ? { ...s, ...formData } : s
        )
      );
      toast({
        title: "Student updated.",
        description: `${formData.name} has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      const newStudent = {
        ...formData,
        id: `ST-${Date.now()}`,
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };
      setStudents([newStudent, ...students]);
      toast({
        title: "Student added.",
        description: `${formData.name} has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <FiArrowUp style={{ display: "inline", marginLeft: 4 }} />
    ) : (
      <FiArrowDown style={{ display: "inline", marginLeft: 4 }} />
    );
  };

  return (
    <Box bg="#fcfcf8" minH="100vh" p={{ base: 4, md: 8 }}>
      <Box maxW="6xl" mx="auto">
        {/* Page Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "flex-end" }}
          mb={6}
          gap={4}
        >
          <Box>
            <Heading size="lg" color="#0A1926" fontWeight="bold">
              Student Management
            </Heading>
            <Text color="#6b6646" mt={1} fontSize="sm">
              Manage and view all registered students in the BeeEnglish
              platform.
            </Text>
          </Box>
          <Button
            leftIcon={<AddIcon />}
            bg="#0A1926"
            color="white"
            fontWeight="bold"
            fontSize="sm"
            _hover={{ bg: "#0A1926", opacity: 0.9 }}
            onClick={handleAddNew}
          >
            Add New Student
          </Button>
        </Flex>

        {/* Filters & Search */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          p={4}
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="#e5e5e0"
          mb={6}
          align="center"
          boxShadow="sm"
        >
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="#6b6646" />
            </InputLeftElement>
            <Input
              placeholder="Search by student name, email, or phone..."
              bg="#fcfcf8"
              border="1px solid"
              borderColor="#e5e5e0"
              fontSize="sm"
              _focus={{ borderColor: "#fde90d", boxShadow: "0 0 0 1px #fde90d" }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>

          <HStack spacing={2} flexShrink={0}>
            <HStack spacing={1}>
              <Box as={FiFilter} color="#6b6646" />
              <Select
                size="md"
                bg="#fcfcf8"
                border="1px solid"
                borderColor="#e5e5e0"
                fontSize="sm"
                fontWeight="medium"
                w="160px"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </Select>
            </HStack>

            <Select
              size="md"
              bg="#fcfcf8"
              border="1px solid"
              borderColor="#e5e5e0"
              fontSize="sm"
              fontWeight="medium"
              w="160px"
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="name">Sort: Name</option>
              <option value="email">Sort: Email</option>
              <option value="joinedDate">Sort: Date</option>
              <option value="status">Sort: Status</option>
            </Select>
          </HStack>
        </Flex>

        {/* Data Table */}
        <Box
          bg="white"
          borderRadius="xl"
          border="1px solid"
          borderColor="#e5e5e0"
          boxShadow="sm"
          overflow="hidden"
        >
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead bg="#fcfcf8">
                <Tr>
                  <Th
                    fontSize="xs"
                    textTransform="uppercase"
                    color="#6b6646"
                    letterSpacing="wider"
                    cursor="pointer"
                    onClick={() => handleSort("name")}
                    _hover={{ color: "#0A1926" }}
                  >
                    Student Name <SortIcon field="name" />
                  </Th>
                  <Th
                    fontSize="xs"
                    textTransform="uppercase"
                    color="#6b6646"
                    letterSpacing="wider"
                    cursor="pointer"
                    onClick={() => handleSort("email")}
                    _hover={{ color: "#0A1926" }}
                  >
                    Email Address <SortIcon field="email" />
                  </Th>
                  <Th
                    fontSize="xs"
                    textTransform="uppercase"
                    color="#6b6646"
                    letterSpacing="wider"
                  >
                    Phone Number
                  </Th>
                  <Th
                    fontSize="xs"
                    textTransform="uppercase"
                    color="#6b6646"
                    letterSpacing="wider"
                    cursor="pointer"
                    onClick={() => handleSort("joinedDate")}
                    _hover={{ color: "#0A1926" }}
                  >
                    Joined Date <SortIcon field="joinedDate" />
                  </Th>
                  <Th
                    fontSize="xs"
                    textTransform="uppercase"
                    color="#6b6646"
                    letterSpacing="wider"
                    cursor="pointer"
                    onClick={() => handleSort("status")}
                    _hover={{ color: "#0A1926" }}
                  >
                    Status <SortIcon field="status" />
                  </Th>
                  <Th
                    fontSize="xs"
                    textTransform="uppercase"
                    color="#6b6646"
                    letterSpacing="wider"
                    textAlign="right"
                  >
                    Action
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedStudents.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={10}>
                      <VStack spacing={2}>
                        <Text fontSize="lg" color="#6b6646" fontWeight="medium">
                          No students found
                        </Text>
                        <Text fontSize="sm" color="#6b6646">
                          Try adjusting your search or filter criteria.
                        </Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  paginatedStudents.map((student) => (
                    <Tr
                      key={student.id}
                      _hover={{ bg: "yellow.50" }}
                      transition="background 0.15s"
                      cursor="pointer"
                    >
                      <Td>
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={student.name}
                            src={student.avatar}
                          />
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="#0A1926"
                            >
                              {student.name}
                            </Text>
                            <Text fontSize="xs" color="#6b6646">
                              ID: #{student.id}
                            </Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td fontSize="sm" color="#1c1b0c">
                        {student.email}
                      </Td>
                      <Td fontSize="sm" color="#1c1b0c">
                        {student.phone}
                      </Td>
                      <Td fontSize="sm" color="#1c1b0c">
                        {student.joinedDate}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={statusColorMap[student.status]}
                          borderRadius="full"
                          px={2.5}
                          py={0.5}
                          fontSize="xs"
                          fontWeight="medium"
                        >
                          {student.status}
                        </Badge>
                      </Td>
                      <Td textAlign="right">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<FiMoreVertical />}
                            variant="ghost"
                            size="sm"
                            color="#6b6646"
                            _hover={{ bg: "gray.100", color: "#0A1926" }}
                            aria-label="Actions"
                          />
                          <MenuList
                            fontSize="sm"
                            shadow="lg"
                            borderColor="#e5e5e0"
                          >
                            <MenuItem icon={<FiEye />}>View Details</MenuItem>
                            <MenuItem
                              icon={<FiEdit2 />}
                              onClick={() => handleEdit(student)}
                            >
                              Edit Student
                            </MenuItem>
                            <MenuItem
                              icon={<FiTrash2 />}
                              color="red.500"
                              onClick={() => handleDelete(student)}
                            >
                              Delete Student
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination */}
          <Flex
            justify="space-between"
            align="center"
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor="#e5e5e0"
          >
            <Text fontSize="sm" color="#6b6646">
              Showing{" "}
              <Text as="span" fontWeight="medium" color="#1c1b0c">
                {sortedStudents.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </Text>{" "}
              to{" "}
              <Text as="span" fontWeight="medium" color="#1c1b0c">
                {Math.min(currentPage * itemsPerPage, sortedStudents.length)}
              </Text>{" "}
              of{" "}
              <Text as="span" fontWeight="medium" color="#1c1b0c">
                {sortedStudents.length}
              </Text>{" "}
              results
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                borderColor="#e5e5e0"
                fontSize="sm"
                fontWeight="medium"
                color="#6b6646"
                leftIcon={<ChevronLeftIcon />}
                isDisabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                _hover={{ bg: "#fcfcf8" }}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "solid" : "outline"}
                    bg={currentPage === page ? "#fde90d" : "transparent"}
                    color={currentPage === page ? "#0A1926" : "#6b6646"}
                    borderColor="#e5e5e0"
                    fontWeight="bold"
                    fontSize="sm"
                    onClick={() => setCurrentPage(page)}
                    _hover={{
                      bg: currentPage === page ? "#fde90d" : "#fcfcf8",
                    }}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                size="sm"
                variant="outline"
                borderColor="#e5e5e0"
                fontSize="sm"
                fontWeight="medium"
                color="#6b6646"
                rightIcon={<ChevronRightIcon />}
                isDisabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                _hover={{ bg: "#fcfcf8" }}
              >
                Next
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Box>

      {/* Add / Edit Student Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent borderRadius="xl">
          <ModalHeader fontWeight="bold" color="#0A1926">
            {isEditing ? "Edit Student" : "Add New Student"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium" color="#1c1b0c">
                  Full Name
                </FormLabel>
                <Input
                  placeholder="Enter student name"
                  fontSize="sm"
                  bg="#fcfcf8"
                  borderColor="#e5e5e0"
                  _focus={{
                    borderColor: "#fde90d",
                    boxShadow: "0 0 0 1px #fde90d",
                  }}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium" color="#1c1b0c">
                  Email Address
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  fontSize="sm"
                  bg="#fcfcf8"
                  borderColor="#e5e5e0"
                  _focus={{
                    borderColor: "#fde90d",
                    boxShadow: "0 0 0 1px #fde90d",
                  }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color="#1c1b0c">
                  Phone Number
                </FormLabel>
                <Input
                  placeholder="Enter phone number"
                  fontSize="sm"
                  bg="#fcfcf8"
                  borderColor="#e5e5e0"
                  _focus={{
                    borderColor: "#fde90d",
                    boxShadow: "0 0 0 1px #fde90d",
                  }}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color="#1c1b0c">
                  Status
                </FormLabel>
                <Select
                  fontSize="sm"
                  bg="#fcfcf8"
                  borderColor="#e5e5e0"
                  _focus={{
                    borderColor: "#fde90d",
                    boxShadow: "0 0 0 1px #fde90d",
                  }}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Blocked">Blocked</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              variant="outline"
              borderColor="#e5e5e0"
              fontSize="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              bg="#0A1926"
              color="white"
              fontSize="sm"
              fontWeight="bold"
              _hover={{ opacity: 0.9 }}
              onClick={handleSubmit}
            >
              {isEditing ? "Save Changes" : "Add Student"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent borderRadius="xl">
          <ModalHeader fontWeight="bold" color="#0A1926">
            Confirm Delete
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="#1c1b0c">
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="bold">
                {selectedStudent?.name}
              </Text>
              ? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              variant="outline"
              borderColor="#e5e5e0"
              fontSize="sm"
              onClick={onDeleteClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              fontSize="sm"
              fontWeight="bold"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentManagement;