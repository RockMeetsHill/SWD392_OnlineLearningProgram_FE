import { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Switch,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  VStack,
  useToast,
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
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import CreateInstructorModal from "../../components/admin/CreateInstructorModal";

// Mock data - replace with actual API calls
const mockInstructors = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@beeenglish.com",
    specialization: "IELTS",
    status: "Active",
    avatar: null,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@beeenglish.com",
    specialization: "Communication",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHRuugyzAgiUtdJuOhsuCR9eayTmJ_2Wfc3km5K5cQ7ccnKjOZxC7eNfV2QEtyABMdRywiwJsKMJWTAf8FBlYI0_kF1-U1-qkMUwGgL6jn6x5dJ0brheM2mZ4bFMtWbEAIAvyIx9eRiHrZmm8TzIBG7GS_3XUbIAQn4WreZ9bmlg3AiJLCOGVRzWM7D25ijEo8NgaUIH61ypCKEq9JwNARbCdE_Fk1QsM5skEWVq5geD99aBaMOeG0dSE9kDHKvy9NPo5-BqllCA",
  },
  {
    id: 3,
    name: "Michael Ross",
    email: "michael.ross@beeenglish.com",
    specialization: "TOEFL",
    status: "Inactive",
    avatar: null,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@beeenglish.com",
    specialization: "IELTS",
    status: "Active",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjyJbO-dWBUoIjyBrRJESsrT_ekQbxE9NnBv_oZnvQtmHvChf3uXALhdp3ViRoWYroXwtyNvXWQkqra32Aypj2L1Z6KwK_xMl_PV_QDXkKK2Jdqd-87IWM7Yxt2BvG4nS8jbJSTOyhQJonaRFABo3GqBTCDDwyjOJFqV5tqfr0d6D5wLNV_VqfkPTmwLI4gyfFKi4EeHmmrBVdRwO9vGrblvo-6qRZMA3q2-F5iahnKMWU6lSEtncLsSUUUXih5OJwU1ca1v5kPg",
  },
  {
    id: 5,
    name: "Emily Liu",
    email: "emily.liu@beeenglish.com",
    specialization: "Business English",
    status: "Active",
    avatar: null,
  },
];

const specializationColors = {
  IELTS: { bg: "blue.50", color: "blue.700" },
  TOEFL: { bg: "orange.50", color: "orange.700" },
  Communication: { bg: "purple.50", color: "purple.700" },
  "Business English": { bg: "green.50", color: "green.700" },
};

const statusColors = {
  Active: { bg: "green.100", color: "green.800" },
  Inactive: { bg: "gray.100", color: "gray.800" },
  Pending: { bg: "yellow.100", color: "yellow.800" },
};

const avatarBgColors = [
  "blue.100",
  "orange.100",
  "pink.100",
  "teal.100",
  "purple.100",
];

function InstructorManagement() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    status: "Active",
  });

  const itemsPerPage = 5;
  const toast = useToast();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setInstructors(mockInstructors);
      } catch (error) {
        toast({
          title: "Error fetching instructors",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, [toast]);

  // Filter logic
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      !filterSpecialization ||
      instructor.specialization === filterSpecialization;
    const matchesStatus = !filterStatus || instructor.status === filterStatus;
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const startItem =
    filteredInstructors.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredInstructors.length,
  );

  // Handlers
  const handleToggleStatus = (instructor) => {
    const newStatus = instructor.status === "Active" ? "Inactive" : "Active";
    setInstructors((prev) =>
      prev.map((i) =>
        i.id === instructor.id ? { ...i, status: newStatus } : i,
      ),
    );
    toast({
      title: `Instructor ${newStatus === "Active" ? "activated" : "deactivated"}`,
      description: `${instructor.name} is now ${newStatus.toLowerCase()}.`,
      status: newStatus === "Active" ? "success" : "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEditClick = (instructor) => {
    setSelectedInstructor(instructor);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      specialization: instructor.specialization,
      status: instructor.status,
    });
    onEditOpen();
  };

  const handleEditSave = () => {
    if (!formData.name || !formData.email || !formData.specialization) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setInstructors((prev) =>
      prev.map((i) =>
        i.id === selectedInstructor.id ? { ...i, ...formData } : i,
      ),
    );
    toast({
      title: "Instructor updated",
      description: `${formData.name}'s information has been updated.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onEditClose();
  };

  const handleCreateOpen = () => {
    setFormData({ name: "", email: "", specialization: "", status: "Active" });
    onCreateOpen();
  };

  const handleCreateSave = () => {
    if (!formData.name || !formData.email || !formData.specialization) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newInstructor = {
      id: Date.now(),
      ...formData,
      avatar: null,
    };
    setInstructors((prev) => [...prev, newInstructor]);
    toast({
      title: "Instructor created",
      description: `${formData.name} has been added successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onCreateClose();
  };

  const handleInstructorCreated = (newInstructor) => {
    setInstructors((prev) => [...prev, newInstructor]);
    toast({
      title: "Instructor created",
      description: `${newInstructor.name} has been added successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeleteClick = (instructor) => {
    setDeleteTarget(instructor);
    onDeleteOpen();
  };

  const handleDeleteConfirm = () => {
    setInstructors((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    toast({
      title: "Instructor deleted",
      description: `${deleteTarget.name} has been removed.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
    setDeleteTarget(null);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Edit Form Modal (kept inline since it shares formData state)
  const EditInstructorModal = () => (
    <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Instructor</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Specialization</FormLabel>
              <Select
                placeholder="Select specialization"
                value={formData.specialization}
                onChange={(e) =>
                  handleFormChange("specialization", e.target.value)
                }
              >
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
                <option value="Communication">Communication</option>
                <option value="Business English">Business English</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onEditClose} mr={3}>
            Cancel
          </Button>
          <Button
            bg="#FDE80B"
            color="gray.800"
            _hover={{ bg: "#e6d30a" }}
            onClick={handleEditSave}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <Box minH="100vh">
      <AdminNavbar />
      <Flex>
        <AdminSidebar />
        <Box
          flex="1"
          ml={{ base: 0, md: "256px" }}
          p={{ base: 4, lg: 10 }}
          minH="calc(100vh - 64px)"
          bg="gray.50"
        >
          {/* Header */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            mb={8}
            gap={4}
          >
            <Box>
              <Heading size="lg" color="gray.800">
                Instructor Management
              </Heading>
              <Text color="gray.500" mt={1}>
                Manage, verify, and monitor all instructor accounts.
              </Text>
            </Box>
            <Button
              bg="#FDE80B"
              color="gray.800"
              _hover={{ bg: "#e6d30a" }}
              fontWeight="semibold"
              leftIcon={<AddIcon />}
              shadow="sm"
              onClick={onCreateOpen}
            >
              Create Instructor Account
            </Button>
          </Flex>

          {/* Table Card */}
          <Box
            bg="white"
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
            shadow="sm"
            overflow="hidden"
          >
            {/* Filters */}
            <Flex
              p={5}
              borderBottom="1px"
              borderColor="gray.200"
              bg="gray.50"
              direction={{ base: "column", md: "row" }}
              gap={4}
              align="center"
              justify="space-between"
            >
              <InputGroup maxW={{ base: "100%", md: "384px" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name or email..."
                  bg="white"
                  borderColor="gray.300"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
              <HStack spacing={3} w={{ base: "100%", md: "auto" }}>
                <Select
                  placeholder="All Specializations"
                  maxW={{ base: "100%", md: "192px" }}
                  bg="white"
                  borderColor="gray.300"
                  fontSize="sm"
                  value={filterSpecialization}
                  onChange={(e) => {
                    setFilterSpecialization(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="Communication">Communication</option>
                  <option value="Business English">Business English</option>
                </Select>
                <Select
                  placeholder="All Statuses"
                  maxW={{ base: "100%", md: "160px" }}
                  bg="white"
                  borderColor="gray.300"
                  fontSize="sm"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </Select>
              </HStack>
            </Flex>

            {/* Table */}
            {loading ? (
              <Center py={20}>
                <Spinner size="xl" color="yellow.400" thickness="4px" />
              </Center>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg="gray.50">
                      <Th
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={4}
                      >
                        Name
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={4}
                      >
                        Email
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={4}
                      >
                        Specialization
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={4}
                      >
                        Status
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={4}
                        textAlign="right"
                      >
                        Actions
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedInstructors.length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={10}>
                          <Text color="gray.500">No instructors found.</Text>
                        </Td>
                      </Tr>
                    ) : (
                      paginatedInstructors.map((instructor, index) => (
                        <Tr
                          key={instructor.id}
                          _hover={{ bg: "gray.50" }}
                          transition="background-color 0.15s"
                        >
                          <Td py={4}>
                            <HStack spacing={3}>
                              <Avatar
                                size="sm"
                                name={instructor.name}
                                src={instructor.avatar}
                                bg={
                                  instructor.avatar
                                    ? "transparent"
                                    : avatarBgColors[
                                        index % avatarBgColors.length
                                      ]
                                }
                                color={
                                  instructor.avatar
                                    ? "white"
                                    : avatarBgColors[
                                        index % avatarBgColors.length
                                      ].replace(".100", ".700")
                                }
                                fontWeight="bold"
                                fontSize="sm"
                              />
                              <Box>
                                <Text fontWeight="medium" color="gray.800">
                                  {instructor.name}
                                </Text>
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  display={{ base: "block", md: "none" }}
                                >
                                  {instructor.email}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {instructor.email}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              px={2.5}
                              py={0.5}
                              borderRadius="md"
                              fontSize="xs"
                              fontWeight="medium"
                              bg={
                                specializationColors[instructor.specialization]
                                  ?.bg || "gray.50"
                              }
                              color={
                                specializationColors[instructor.specialization]
                                  ?.color || "gray.700"
                              }
                            >
                              {instructor.specialization}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              px={2.5}
                              py={0.5}
                              borderRadius="full"
                              fontSize="xs"
                              fontWeight="medium"
                              bg={
                                statusColors[instructor.status]?.bg ||
                                "gray.100"
                              }
                              color={
                                statusColors[instructor.status]?.color ||
                                "gray.800"
                              }
                            >
                              {instructor.status}
                            </Badge>
                          </Td>
                          <Td textAlign="right">
                            <HStack spacing={2} justify="flex-end">
                              <IconButton
                                aria-label="Edit instructor"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                color="gray.400"
                                _hover={{ color: "blue.600", bg: "blue.50" }}
                                onClick={() => handleEditClick(instructor)}
                              />
                              <Switch
                                size="sm"
                                colorScheme="green"
                                isChecked={instructor.status === "Active"}
                                onChange={() => handleToggleStatus(instructor)}
                                title={
                                  instructor.status === "Active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                              />
                              <IconButton
                                aria-label="Delete instructor"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                color="gray.400"
                                _hover={{ color: "red.600", bg: "red.50" }}
                                onClick={() => handleDeleteClick(instructor)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}

            {/* Pagination */}
            <Flex
              bg="gray.50"
              borderTop="1px"
              borderColor="gray.200"
              px={6}
              py={4}
              align="center"
              justify="space-between"
            >
              <Text fontSize="sm" color="gray.500">
                Showing{" "}
                <Text as="span" fontWeight="medium">
                  {startItem}
                </Text>{" "}
                to{" "}
                <Text as="span" fontWeight="medium">
                  {endItem}
                </Text>{" "}
                of{" "}
                <Text as="span" fontWeight="medium">
                  {filteredInstructors.length}
                </Text>{" "}
                results
              </Text>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  isDisabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  isDisabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>

          {/* Footer */}
          <Box mt={12} borderTop="1px" borderColor="gray.200" pt={6}>
            <Text fontSize="sm" color="gray.400">
              © 2023 BeeEnglish Platform. All rights reserved.
            </Text>
          </Box>

          {/* Create Modal - now separate component */}
          <CreateInstructorModal
            isOpen={isCreateOpen}
            onClose={onCreateClose}
            onCreated={handleInstructorCreated}
          />

          {/* Edit Modal */}
          <EditInstructorModal />

          {/* Delete Confirmation */}
          <AlertDialog
            isOpen={isDeleteOpen}
            leastDestructiveRef={cancelRef}
            onClose={onDeleteClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Instructor
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete{" "}
                  <Text as="span" fontWeight="bold">
                    {deleteTarget?.name}
                  </Text>
                  ? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteConfirm}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </Flex>
    </Box>
  );
}

export default InstructorManagement;
