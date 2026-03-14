import React, { useState, useRef, useEffect } from "react";
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
import { SearchIcon, DeleteIcon } from "@chakra-ui/icons";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StudentInfoModal from "../../components/admin/StudentInfoModal";
import { studentAPI } from "../../services/admin/studentManagementService";

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

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewStudent, setViewStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(null);

  const itemsPerPage = 10;
  const toast = useToast();
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

  // Fetch students from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentAPI.getAllStudents();
      setStudents(data);
    } catch (error) {
      toast({
        title: "Error fetching students",
        description: error.message || "Failed to load students.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && student.isActive) ||
      (statusFilter === "inactive" && !student.isActive);
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const startItem =
    filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredStudents.length);

  // Handlers
  const handleViewClick = (student) => {
    setViewStudent(student);
    onViewOpen();
  };

  const handleToggleStatus = async (student) => {
    setTogglingStatus(student.id);
    try {
      const updated = await studentAPI.toggleStudentStatus(
        student.id,
        student.isActive,
      );
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? updated : s)),
      );
      toast({
        title: "Status updated",
        description: `${student.name} is now ${updated.isActive ? "Active" : "Inactive"}.`,
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

  const handleDeleteClick = (student) => {
    setDeleteTarget(student);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await studentAPI.deleteStudent(deleteTarget.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast({
        title: "Student deleted",
        description: `${deleteTarget.name} has been removed.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: "Error deleting student",
        description: error.message || "Failed to delete student.",
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
                Student Management
              </Heading>
              <Text color="gray.500" mt={1}>
                Manage and monitor all student accounts.
              </Text>
            </Box>
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
              </HStack>
              {/* <Button
                size="sm"
                variant="outline"
                onClick={fetchStudents}
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
                        Enrollments
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
                    {paginatedStudents.length === 0 ? (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={10}>
                          <Text color="gray.500">No students found.</Text>
                        </Td>
                      </Tr>
                    ) : (
                      paginatedStudents.map((student, index) => {
                        const statusKey = student.isActive
                          ? "active"
                          : "inactive";
                        const statusStyle = statusColors[statusKey];
                        return (
                          <Tr
                            key={student.id}
                            _hover={{ bg: "gray.50", cursor: "pointer" }}
                            transition="background-color 0.15s"
                            onClick={() => handleViewClick(student)}
                          >
                            <Td py={4}>
                              <HStack spacing={3}>
                                <Avatar
                                  size="sm"
                                  name={student.name}
                                  src={student.avatar}
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
                                    {student.name}
                                  </Text>
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    display={{ base: "block", md: "none" }}
                                  >
                                    {student.email}
                                  </Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {student.email}
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
                                {student.enrollmentsCount} courses
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {student.createdAt
                                  ? new Date(
                                      student.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "-"}
                              </Text>
                            </Td>
                            <Td>
                              <Badge
                                px={2.5}
                                py={0.5}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="medium"
                                bg={statusStyle.bg}
                                color={statusStyle.color}
                              >
                                {student.isActive ? "Active" : "Inactive"}
                              </Badge>
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
                                  isChecked={student.isActive}
                                  isDisabled={togglingStatus === student.id}
                                  onChange={() => handleToggleStatus(student)}
                                />
                                <IconButton
                                  aria-label="Delete student"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  color="gray.400"
                                  _hover={{
                                    color: "red.600",
                                    bg: "red.50",
                                  }}
                                  onClick={() => handleDeleteClick(student)}
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
                  {filteredStudents.length}
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

          {/* View Info Modal */}
          <StudentInfoModal
            isOpen={isViewOpen}
            onClose={onViewClose}
            student={viewStudent}
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
                  Delete Student
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
};

export default StudentManagement;
