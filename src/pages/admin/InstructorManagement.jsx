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
  HStack,
  VStack,
  useToast,
  useDisclosure,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import CreateInstructorModal from "../../components/admin/CreateInstructorModal";
import UpdateInstructorModal from "../../components/admin/UpdateInstructorModal";
import InstructorInfoModal from "../../components/admin/InstructorInfoModal";
import { instructorAPI } from "../../services/admin/instructorManagementService";

const statusColors = {
  active: { bg: "green.100", color: "green.800" },
  inactive: { bg: "red.100", color: "red.800" },
};

const avatarBgColors = [
  "blue.100",
  "orange.100",
  "pink.100",
  "teal.100",
  "purple.100",
];

const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];

function InstructorManagement() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [viewInstructor, setViewInstructor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(null);

  const itemsPerPage = 10;
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
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const cancelRef = useRef();

  // Fetch instructors from API
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const data = await instructorAPI.getAllInstructors();
      setInstructors(data);
    } catch (error) {
      toast({
        title: "Error fetching instructors",
        description: error.message || "Failed to load instructors.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter logic
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && instructor.isActive) ||
      (statusFilter === "inactive" && !instructor.isActive);
    const matchesLevel =
      levelFilter === "all" || instructor.currentLevel === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
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
  const handleViewClick = (instructor) => {
    setViewInstructor(instructor);
    onViewOpen();
  };

  const handleEditClick = (instructor) => {
    setSelectedInstructor(instructor);
    onEditOpen();
  };

  const handleInstructorUpdated = (updated) => {
    setInstructors((prev) =>
      prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)),
    );
  };

  const handleToggleStatus = async (instructor) => {
    setTogglingStatus(instructor.id);
    try {
      const updated = await instructorAPI.toggleInstructorStatus(
        instructor.id,
        instructor.isActive,
      );
      setInstructors((prev) =>
        prev.map((i) => (i.id === instructor.id ? { ...i, ...updated } : i)),
      );
      toast({
        title: "Status updated",
        description: `${instructor.name} is now ${updated.isActive ? "Active" : "Inactive"}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error.message || "Failed to update status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setTogglingStatus(null);
    }
  };

  const handleInstructorCreated = () => {
    fetchInstructors();
  };

  const handleDeleteClick = (instructor) => {
    setDeleteTarget(instructor);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await instructorAPI.deleteInstructor(deleteTarget.id);
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
    } catch (error) {
      toast({
        title: "Error deleting instructor",
        description: error.message || "Failed to delete instructor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
              <HStack spacing={4} flex="1" w={{ base: "100%", md: "auto" }}>
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
                <Select
                  maxW="180px"
                  bg="white"
                  borderColor="gray.300"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
                <Select
                  maxW="180px"
                  bg="white"
                  borderColor="gray.300"
                  value={levelFilter}
                  onChange={(e) => {
                    setLevelFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Levels</option>
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
              </HStack>
              {/* <Button
                size="sm"
                variant="outline"
                onClick={fetchInstructors}
                isLoading={loading}
                loadingText="Refreshing..."
              >
                Refresh
              </Button> */}
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
                        Courses
                      </Th>
                      <Th
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.500"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        py={4}
                      >
                        Created At
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
                        <Td colSpan={6} textAlign="center" py={10}>
                          <Text color="gray.500">No instructors found.</Text>
                        </Td>
                      </Tr>
                    ) : (
                      paginatedInstructors.map((instructor, index) => {
                        const statusKey = instructor.isActive
                          ? "active"
                          : "inactive";
                        const statusStyle = statusColors[statusKey];
                        return (
                          <Tr
                            key={instructor.id}
                            _hover={{ bg: "gray.50", cursor: "pointer" }}
                            transition="background-color 0.15s"
                            onClick={() => handleViewClick(instructor)}
                          >
                            <Td py={4}>
                              <HStack spacing={3}>
                                <Avatar
                                  size="sm"
                                  name={instructor.name}
                                  src={instructor.avatar}
                                  bg={
                                    avatarBgColors[
                                      index % avatarBgColors.length
                                    ]
                                  }
                                  color={avatarBgColors[
                                    index % avatarBgColors.length
                                  ].replace(".100", ".700")}
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
                                bg="blue.50"
                                color="blue.700"
                              >
                                {instructor.coursesCount} courses
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {instructor.createdAt
                                  ? new Date(
                                      instructor.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "-"}
                              </Text>
                            </Td>
                            <Td>
                              <HStack spacing={3}>
                                <Badge
                                  px={2.5}
                                  py={0.5}
                                  borderRadius="full"
                                  fontSize="xs"
                                  fontWeight="medium"
                                  bg={statusStyle.bg}
                                  color={statusStyle.color}
                                >
                                  {instructor.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </HStack>
                            </Td>
                            <Td textAlign="right">
                              <HStack
                                spacing={4}
                                justify="flex-end"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Switch
                                  size="sm"
                                  colorScheme="green"
                                  isChecked={instructor.isActive}
                                  isDisabled={togglingStatus === instructor.id}
                                  onChange={() =>
                                    handleToggleStatus(instructor)
                                  }
                                />
                                <IconButton
                                  aria-label="Edit instructor"
                                  icon={<EditIcon />}
                                  size="sm"
                                  variant="ghost"
                                  color="gray.400"
                                  _hover={{
                                    color: "blue.600",
                                    bg: "blue.50",
                                  }}
                                  onClick={() => handleEditClick(instructor)}
                                />
                                <IconButton
                                  aria-label="Delete instructor"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  color="gray.400"
                                  _hover={{
                                    color: "red.600",
                                    bg: "red.50",
                                  }}
                                  onClick={() => handleDeleteClick(instructor)}
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      })
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

          {/* Create Modal */}
          <CreateInstructorModal
            isOpen={isCreateOpen}
            onClose={onCreateClose}
            onCreated={handleInstructorCreated}
          />

          {/* Edit Modal */}
          <UpdateInstructorModal
            isOpen={isEditOpen}
            onClose={onEditClose}
            instructor={selectedInstructor}
            onUpdated={handleInstructorUpdated}
          />

          {/* View Info Modal */}
          <InstructorInfoModal
            isOpen={isViewOpen}
            onClose={onViewClose}
            instructor={viewInstructor}
          />

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
                    isLoading={isDeleting}
                    loadingText="Deleting..."
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
