import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { courseAPI } from "../../services/courseService";
import { courseApprovalAPI } from "../../services/admin/courseApprovalService";
import FlagContentConfirmModal from "../../components/admin/FlagContentConfirmModal";

const PAGE_SIZE = 10;

const money = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v ?? 0,
  );

/* ── status helpers ─────────────────────────────────────────── */
const STATUS_MAP = {
  in_progress: { scheme: "gray", label: "Drafting" },
  published: { scheme: "green", label: "Published" },
  archived: { scheme: "orange", label: "Archived" },
};

const statusStyle = (raw) => {
  const key = raw?.toLowerCase().replace(/\s+/g, "_");
  return STATUS_MAP[key] || { scheme: "gray", label: raw || "Unknown" };
};

/* ── status options shown in filter dropdown ─────────────────── */
const STATUS_OPTIONS = [
  { value: "All", label: "Status: All" },
  { value: "in_progress", label: "Drafting" },
  { value: "published", label: "Published" },
];

export default function CourseApprovals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("published");
  const [page, setPage] = useState(1);

  // Flag modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [flagCourseId, setFlagCourseId] = useState(null);
  const [flagReason, setFlagReason] = useState("");

  const bg = useColorModeValue("gray.50", "gray.900");
  const card = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.400");

  const navigate = useNavigate();
  const toast = useToast();

  /* ── fetch ─────────────────────────────────────────────────── */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getCourses();
      const courses = Array.isArray(data)
        ? data
        : data?.data || data?.courses || [];

      const normalized = courses.map((c) => ({
        // keep the raw object so we can pass it to detail page
        _raw: c,
        id: c.courseId || c._id || c.id,
        courseName: c.title || c.name || "",
        instructor: c.instructor?.fullName || c.instructor?.name || "Unknown",
        instructorAvatar:
          c.instructor?.avatar || c.instructor?.profileImage || "",
        category: c.category || c.level || "Uncategorized",
        price: c.price ?? 0,
        status: c.status || "in_progress",
        contentFlagged: c.contentFlagged ?? false,
        thumbnail:
          c.thumbnailUrl || c.thumbnail || c.image || c.coverImage || "",
        description: c.description || "",
        createdAt: c.createdAt || "",
        modulesCount: c.modules?.length || 0,
        lessonsCount:
          c.modules?.reduce(
            (sum, m) => sum + (m._count?.lessons || m.lessons?.length || 0),
            0,
          ) || 0,
      }));

      setRows(normalized);
    } catch (error) {
      toast({
        title: "Failed to load courses",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* ── derived data ──────────────────────────────────────────── */
  const categories = useMemo(
    () => ["All Categories", ...new Set(rows.map((r) => r.category))],
    [rows],
  );

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchText =
        !text ||
        r.courseName.toLowerCase().includes(text) ||
        r.instructor.toLowerCase().includes(text);
      const matchCategory =
        category === "All Categories" || r.category === category;
      const matchStatus = status === "All" || r.status === status;
      return matchText && matchCategory && matchStatus;
    });
  }, [rows, q, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  const countByStatus = (s) => rows.filter((r) => r.status === s).length;

  const inProgressCount = countByStatus("in_progress");
  const publishedCount = countByStatus("published");
  const flaggedCount = rows.filter((r) => r.contentFlagged).length;

  /* ── actions ───────────────────────────────────────────────── */
  const handleOpenFlag = (courseId) => {
    setFlagCourseId(courseId);
    setFlagReason("");
    onOpen();
  };

  const handleConfirmFlag = async () => {
    if (!flagCourseId) return;
    try {
      setActionLoading(flagCourseId);
      await courseApprovalAPI.flagCourse(flagCourseId, { reason: flagReason });
      toast({
        title: "Course flagged",
        description: "Course has been flagged as inappropriate.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      await fetchCourses();
    } catch (error) {
      toast({
        title: "Failed to flag course",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnflag = async (courseId) => {
    try {
      setActionLoading(courseId);
      await courseApprovalAPI.unflagCourse(courseId);
      toast({
        title: "Flag removed",
        description: "Course is no longer flagged.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchCourses();
    } catch (error) {
      toast({
        title: "Failed to unflag course",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setActionLoading(null);
    }
  };

  //render
  return (
    <Box bg={bg} minH="100vh">
      <AdminNavbar />
      <AdminSidebar />

      <Box
        ml={{ base: 0, md: "256px" }}
        pt="40px"
        px={{ base: 4, md: 8 }}
        pb={8}
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex
            justify="space-between"
            align={{ base: "start", md: "end" }}
            wrap="wrap"
            gap={4}
          >
            <Box>
              <Heading size="lg">Course Approvals</Heading>
              <Text mt={1} color={muted}>
                Manage and approve incoming course submissions from instructors.
              </Text>
            </Box>
            <HStack flexWrap="wrap">
              <Badge px={3} py={1.5} borderRadius="full" colorScheme="gray">
                {inProgressCount} Drafting
              </Badge>
              <Badge px={3} py={1.5} borderRadius="full" colorScheme="green">
                {publishedCount} Published
              </Badge>
              <Badge px={3} py={1.5} borderRadius="full" colorScheme="red">
                {flaggedCount} Flagged
              </Badge>
            </HStack>
          </Flex>

          {/* Filters */}
          <Flex
            bg={card}
            borderWidth="1px"
            borderColor={border}
            borderRadius="xl"
            p={4}
            gap={3}
            wrap="wrap"
            align="center"
            justify="space-between"
          >
            <InputGroup maxW="420px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by course name or instructor..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
            </InputGroup>

            <HStack w={{ base: "100%", md: "auto" }}>
              <Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                maxW="190px"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>

              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                maxW="180px"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>

              {/* <Button
                size="sm"
                variant="outline"
                onClick={fetchCourses}
                isLoading={loading}
              >
                Refresh
              </Button> */}
            </HStack>
          </Flex>

          {/* Table */}
          <Box
            bg={card}
            borderWidth="1px"
            borderColor={border}
            borderRadius="xl"
            overflow="hidden"
          >
            {loading ? (
              <Flex justify="center" align="center" py={16}>
                <VStack spacing={4}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <Text color={muted}>Loading courses...</Text>
                </VStack>
              </Flex>
            ) : items.length === 0 ? (
              <Flex justify="center" align="center" py={16}>
                <Text color={muted} fontSize="lg">
                  No courses found.
                </Text>
              </Flex>
            ) : (
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Course Name</Th>
                      <Th>Instructor</Th>
                      <Th>Category</Th>
                      <Th textAlign="right">Price</Th>
                      <Th>Status</Th>
                      <Th>Flagged</Th>
                      <Th textAlign="center">Modules</Th>
                      <Th textAlign="right">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((r) => {
                      const st = statusStyle(r.status);
                      const isActing = actionLoading === r.id;

                      return (
                        <Tr key={r.id}>
                          <Td>
                            <HStack spacing={3}>
                              <Box
                                w="40px"
                                h="40px"
                                borderRadius="md"
                                bgImage={
                                  r.thumbnail
                                    ? `url(${r.thumbnail})`
                                    : undefined
                                }
                                bgPos="center"
                                bgSize="cover"
                                bgColor="gray.200"
                                flexShrink={0}
                              />
                              <Box>
                                <Text
                                  as="button"
                                  type="button"
                                  fontWeight="semibold"
                                  textAlign="left"
                                  noOfLines={1}
                                  _hover={{
                                    color: "blue.500",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/admin/course-approvals/${r.id}`,
                                      {
                                        state: { course: r._raw },
                                      },
                                    )
                                  }
                                >
                                  {r.courseName}
                                </Text>
                                <Text fontSize="xs" color={muted}>
                                  {new Date(r.createdAt).toLocaleDateString(
                                    "vi-VN",
                                  )}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Avatar
                                size="xs"
                                src={r.instructorAvatar}
                                name={r.instructor}
                              />
                              <Text fontSize="sm">{r.instructor}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme="blue"
                              borderRadius="full"
                              px={2}
                            >
                              {r.category}
                            </Badge>
                          </Td>
                          <Td textAlign="right" fontWeight="medium">
                            {money(r.price)}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={st.scheme}
                              borderRadius="full"
                              px={2}
                            >
                              {st.label}
                            </Badge>
                          </Td>
                          <Td>
                            {r.contentFlagged ? (
                              <Badge
                                colorScheme="red"
                                borderRadius="full"
                                px={2}
                              >
                                Flagged
                              </Badge>
                            ) : (
                              <Text fontSize="sm" color={muted}>
                                —
                              </Text>
                            )}
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="sm">
                              {r.modulesCount} modules • {r.lessonsCount}{" "}
                              lessons
                            </Text>
                          </Td>
                          <Td textAlign="right">
                            <HStack justify="flex-end" spacing={2}>
                              {r.contentFlagged ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  colorScheme="orange"
                                  isDisabled={isActing}
                                  isLoading={isActing}
                                  onClick={() => handleUnflag(r.id)}
                                >
                                  Unflag
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  colorScheme="red"
                                  isDisabled={isActing}
                                  isLoading={isActing}
                                  onClick={() => handleOpenFlag(r.id)}
                                >
                                  Flag
                                </Button>
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            <Flex
              p={4}
              borderTopWidth="1px"
              borderColor={border}
              justify="space-between"
              align="center"
            >
              <Text fontSize="sm" color={muted}>
                Showing {filtered.length ? start + 1 : 0}–
                {Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length} results
              </Text>
              <HStack>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<ChevronLeftIcon />}
                  isDisabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Text fontSize="sm" fontWeight="medium">
                  {safePage} / {totalPages}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<ChevronRightIcon />}
                  isDisabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>
        </VStack>
      </Box>

      {/* Flag Modal */}
      <FlagContentConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        reason={flagReason}
        onReasonChange={(e) => setFlagReason(e.target.value)}
        onConfirm={handleConfirmFlag}
        isLoading={actionLoading === flagCourseId}
      />
    </Box>
  );
}
