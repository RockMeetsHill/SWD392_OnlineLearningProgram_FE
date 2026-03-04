import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ArrowBackIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { courseAPI } from "../../services/courseService";

/* ── Icons ──────────────────────────────────────────────────── */
const PlayCircleIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M10,16.5L16,12L10,7.5V16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
    />
  </Icon>
);

const money = (v) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    v ?? 0,
  );

/* ── status helpers (matching real API values) ───────────────── */
const STATUS_MAP = {
  draft: { scheme: "gray", label: "Draft" },
  pending_review: { scheme: "yellow", label: "Pending Review" },
  approved_upload: { scheme: "green", label: "Approved" },
  rejected: { scheme: "red", label: "Rejected" },
  published: { scheme: "purple", label: "Published" },
};

const statusInfo = (raw) => {
  const key = raw?.toLowerCase().replace(/\s+/g, "_");
  return STATUS_MAP[key] || { scheme: "gray", label: raw || "Unknown" };
};

export default function CourseApprovalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Modals
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();
  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onClose: onApproveClose,
  } = useDisclosure();
  const [adminNote, setAdminNote] = useState("");

  /* ── colors ────────────────────────────────────────────────── */
  const bg = useColorModeValue("gray.50", "gray.900");
  const card = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.400");
  const moduleBg = useColorModeValue("gray.50", "gray.900");
  const lessonCodeBg = useColorModeValue("gray.100", "gray.700");
  const noVideoBg = useColorModeValue("gray.100", "gray.700");

  /* ── normalize API response ─────────────────────────────────── */
  const normalize = useCallback((c) => {
    if (!c) return null;

    const modules = (c.modules || c.curriculum || c.sections || []).map(
      (mod, idx) => {
        const lessons = (mod.lessons || mod.lectures || mod.items || []).map(
          (lesson, lIdx) => ({
            id: lesson.lessonId || lesson._id || lesson.id || `${idx}-${lIdx}`,
            code: lesson.code || `${idx + 1}.${lIdx + 1}`,
            title: lesson.title || lesson.name || `Lesson ${lIdx + 1}`,
            type: lesson.type || lesson.contentType || "Video",
            length: lesson.length || lesson.duration || "0:00",
            previewUrl:
              lesson.previewUrl || lesson.videoUrl || lesson.url || "",
            description: lesson.description || "",
          }),
        );

        return {
          id: mod.moduleId || mod._id || mod.id || idx,
          title: mod.title || mod.name || `Module ${idx + 1}`,
          lessonsCount:
            mod._count?.lessons || lessons.length || mod.lessonsCount || 0,
          duration: mod.duration || mod.totalDuration || "N/A",
          lessons,
        };
      },
    );

    const totalLessons = modules.reduce(
      (acc, m) => acc + m.lessons.length,
      0,
    );

    // Target audience
    let targetAudience = c.targetAudience || c.target_audience || [];
    if (typeof targetAudience === "string") {
      targetAudience = targetAudience.split(",").map((a) => a.trim()).filter(Boolean);
    }
    if (!Array.isArray(targetAudience) || targetAudience.length === 0) {
      targetAudience = [];
    }

    return {
      id: c.courseId || c._id || c.id,
      title: c.title || c.name || "",
      status: c.status || "draft",
      price: c.price ?? 0,
      instructor: c.instructor?.fullName || c.instructor?.name || "Unknown",
      instructorAvatar:
        c.instructor?.avatar || c.instructor?.profileImage || "",
      instructorEmail: c.instructor?.email || "",
      category: c.category || c.level || "Uncategorized",
      level: c.level || c.difficulty || "N/A",
      thumbnail: c.thumbnailUrl || c.thumbnail || c.image || c.coverImage || "",
      description: c.description || "No description available.",
      targetAudience,
      modules,
      totalModules: modules.length,
      totalLessons,
      duration: c.duration || c.totalDuration || `${totalLessons} lessons`,
      createdAt: c.createdAt || "",
      updatedAt: c.updatedAt || "",
      adminNote: c.adminNote || c.admin_note || "",
    };
  }, []);

  /* ── fetch ─────────────────────────────────────────────────── */
  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const fromState = location.state?.course;

      // Try API first for complete data (with modules & lessons)
      try {
        const response = await courseAPI.getCourseById(id);
        const data = response?.data || response?.course || response;
        const normalized = normalize(data);
        if (normalized) {
          setCourse(normalized);
          return;
        }
      } catch (apiErr) {
        console.warn("API fetch failed, using navigation state:", apiErr.message);
      }

      // Fallback to navigation state
      if (fromState) {
        setCourse(normalize(fromState));
        return;
      }

      setCourse(null);
    } catch (error) {
      toast({
        title: "Failed to load course details",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [id, location.state, normalize, toast]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  /* ── approve ───────────────────────────────────────────────── */
  const handleApprove = async () => {
    if (!course) return;
    try {
      setActionLoading(true);
      await courseAPI.approveCourse(course.id);
      toast({
        title: "Course approved",
        description: `"${course.title}" has been approved successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setCourse((prev) => ({ ...prev, status: "approved_upload" }));
      onApproveClose();
    } catch (error) {
      toast({
        title: "Failed to approve course",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* ── reject ────────────────────────────────────────────────── */
  const handleConfirmReject = async () => {
    if (!course || !adminNote.trim()) return;
    try {
      setActionLoading(true);
      await courseAPI.rejectCourse(course.id, adminNote);
      toast({
        title: "Course rejected",
        description: `"${course.title}" has been rejected.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      setCourse((prev) => ({
        ...prev,
        status: "rejected",
        adminNote: adminNote,
      }));
      onRejectClose();
    } catch (error) {
      toast({
        title: "Failed to reject course",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openLessonPreview = (lesson) => {
    setSelectedLesson(lesson);
    onPreviewOpen();
  };

  /* ── loading ───────────────────────────────────────────────── */
  if (loading) {
    return (
      <Box bg={bg} minH="100vh">
        <AdminNavbar />
        <AdminSidebar />
        <Box ml={{ base: 0, md: "256px" }} pt="80px" px={{ base: 4, md: 8 }}>
          <Flex justify="center" align="center" py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text color={muted}>Loading course details...</Text>
            </VStack>
          </Flex>
        </Box>
      </Box>
    );
  }

  /* ── not found ─────────────────────────────────────────────── */
  if (!course) {
    return (
      <Box bg={bg} minH="100vh">
        <AdminNavbar />
        <AdminSidebar />
        <Box ml={{ base: 0, md: "256px" }} pt="80px" px={{ base: 4, md: 8 }}>
          <VStack spacing={4} py={20}>
            <Text fontSize="lg" color={muted}>
              Course not found.
            </Text>
            <Button onClick={() => navigate("/admin/course-approvals")}>
              Back to Course Approvals
            </Button>
          </VStack>
        </Box>
      </Box>
    );
  }

  const st = statusInfo(course.status);
  const canDecide = course.status === "pending_review";

  return (
    <Box bg={bg} minH="100vh">
      <AdminNavbar />
      <AdminSidebar />

      <Box
        ml={{ base: 0, md: "256px" }}
        pt="80px"
        pb="100px"
        px={{ base: 4, md: 8 }}
      >
        <VStack align="stretch" spacing={6}>
          {/* ── Top bar ─────────────────────────────────────────── */}
          <Flex justify="space-between" wrap="wrap" gap={3} align="center">
            <HStack spacing={3}>
              <Button
                variant="ghost"
                leftIcon={<ArrowBackIcon />}
                onClick={() => navigate("/admin/course-approvals")}
              >
                Back to List
              </Button>
              <Divider orientation="vertical" h="24px" />
              <Heading size="md" noOfLines={1}>
                {course.title}
              </Heading>
              <Badge
                colorScheme={st.scheme}
                borderRadius="full"
                px={2.5}
                py={1}
              >
                {st.label}
              </Badge>
            </HStack>

            {/* Quick stats */}
            <HStack fontSize="sm" color={muted} spacing={4}>
              <Text>{course.totalModules} modules</Text>
              <Text>{course.totalLessons} lessons</Text>
              {course.createdAt && (
                <Text>
                  Submitted:{" "}
                  {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              )}
            </HStack>
          </Flex>

          <SimpleGrid
            columns={{ base: 1, lg: 3 }}
            spacing={6}
            alignItems="start"
          >
            {/* ── Left: Curriculum ────────────────────────────────── */}
            <Box gridColumn={{ lg: "span 2" }}>
              <HStack justify="space-between" mb={3}>
                <Heading size="md">Course Curriculum</Heading>
                <Text fontSize="sm" color={muted}>
                  {course.totalModules} modules • {course.totalLessons} lessons
                </Text>
              </HStack>

              {/* Description card */}
              <Box
                bg={card}
                borderWidth="1px"
                borderColor={border}
                borderRadius="xl"
                p={5}
                mb={4}
              >
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Description
                </Text>
                <Text fontSize="sm" color={muted} whiteSpace="pre-wrap">
                  {course.description}
                </Text>
              </Box>

              <VStack spacing={4} align="stretch">
                {course.modules.map((module, idx) => (
                  <Box
                    key={module.id}
                    bg={card}
                    borderWidth="1px"
                    borderColor={border}
                    borderRadius="xl"
                    overflow="hidden"
                  >
                    {/* Module header */}
                    <Flex
                      px={5}
                      py={4}
                      bg={moduleBg}
                      borderBottomWidth="1px"
                      borderColor={border}
                      justify="space-between"
                      align="center"
                    >
                      <HStack spacing={3}>
                        <Flex
                          w="28px"
                          h="28px"
                          borderRadius="full"
                          bg="blue.500"
                          color="white"
                          align="center"
                          justify="center"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {idx + 1}
                        </Flex>
                        <Text fontWeight="bold">{module.title}</Text>
                      </HStack>
                      <Text fontSize="xs" color={muted}>
                        {module.lessonsCount} lessons • {module.duration}
                      </Text>
                    </Flex>

                    {/* Lessons */}
                    <VStack align="stretch" spacing={0}>
                      {module.lessons.map((lesson) => (
                        <Flex
                          key={lesson.id}
                          px={5}
                          py={4}
                          justify="space-between"
                          align="center"
                          borderBottomWidth="1px"
                          borderColor={border}
                          _last={{ borderBottomWidth: 0 }}
                          _hover={{ bg: moduleBg }}
                          transition="background 0.15s"
                        >
                          <HStack spacing={3}>
                            <Flex
                              w="32px"
                              h="32px"
                              borderRadius="full"
                              bg={lessonCodeBg}
                              align="center"
                              justify="center"
                              fontSize="xs"
                              fontWeight="bold"
                              color={muted}
                            >
                              {lesson.code}
                            </Flex>
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {lesson.title}
                              </Text>
                              <Text fontSize="xs" color={muted}>
                                {lesson.type} • {lesson.length}
                              </Text>
                            </Box>
                          </HStack>

                          {lesson.previewUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              leftIcon={<PlayCircleIcon boxSize={4} />}
                              onClick={() => openLessonPreview(lesson)}
                            >
                              Preview
                            </Button>
                          )}
                        </Flex>
                      ))}

                      {module.lessons.length === 0 && (
                        <Flex px={5} py={4} justify="center">
                          <Text fontSize="sm" color={muted}>
                            No lessons in this module yet.
                          </Text>
                        </Flex>
                      )}
                    </VStack>
                  </Box>
                ))}

                {course.modules.length === 0 && (
                  <Box
                    bg={card}
                    borderWidth="1px"
                    borderColor={border}
                    borderRadius="xl"
                    p={8}
                    textAlign="center"
                  >
                    <Text color={muted}>
                      No curriculum details available for this course.
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* ── Right: Sidebar ──────────────────────────────────── */}
            <Box position={{ lg: "sticky" }} top={{ lg: "92px" }}>
              <Box
                bg={card}
                borderWidth="1px"
                borderColor={border}
                borderRadius="xl"
                overflow="hidden"
              >
                {/* Thumbnail */}
                {course.thumbnail ? (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    w="100%"
                    h="200px"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w="100%"
                    h="200px"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color={muted}>No thumbnail</Text>
                  </Box>
                )}

                <VStack align="stretch" spacing={0} p={5}>
                  <Heading size="sm" mb={4}>
                    Course Summary
                  </Heading>

                  {/* Price */}
                  <HStack
                    justify="space-between"
                    py={3}
                    borderBottomWidth="1px"
                    borderColor={border}
                  >
                    <Text fontSize="sm" color={muted}>
                      Proposed Price
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" color="green.500">
                      {money(course.price)}
                    </Text>
                  </HStack>

                  {/* Instructor */}
                  <HStack
                    justify="space-between"
                    py={3}
                    borderBottomWidth="1px"
                    borderColor={border}
                  >
                    <Text fontSize="sm" color={muted}>
                      Instructor
                    </Text>
                    <HStack spacing={2}>
                      <Avatar
                        size="xs"
                        src={course.instructorAvatar}
                        name={course.instructor}
                      />
                      <Box textAlign="right">
                        <Text fontSize="sm" fontWeight="medium">
                          {course.instructor}
                        </Text>
                        {course.instructorEmail && (
                          <Text fontSize="xs" color={muted}>
                            {course.instructorEmail}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </HStack>

                  {/* Category */}
                  <HStack
                    justify="space-between"
                    py={3}
                    borderBottomWidth="1px"
                    borderColor={border}
                  >
                    <Text fontSize="sm" color={muted}>
                      Category
                    </Text>
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      {course.category}
                    </Badge>
                  </HStack>

                  {/* Level */}
                  <HStack
                    justify="space-between"
                    py={3}
                    borderBottomWidth="1px"
                    borderColor={border}
                  >
                    <Text fontSize="sm" color={muted}>
                      Level
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {course.level}
                    </Text>
                  </HStack>

                  {/* Stats */}
                  <HStack
                    justify="space-between"
                    py={3}
                    borderBottomWidth="1px"
                    borderColor={border}
                  >
                    <Text fontSize="sm" color={muted}>
                      Content
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      {course.totalModules} modules • {course.totalLessons}{" "}
                      lessons
                    </Text>
                  </HStack>

                  {/* Status */}
                  <HStack justify="space-between" py={3}>
                    <Text fontSize="sm" color={muted}>
                      Status
                    </Text>
                    <Badge
                      colorScheme={st.scheme}
                      borderRadius="full"
                      px={2}
                    >
                      {st.label}
                    </Badge>
                  </HStack>

                  {/* Target Audience */}
                  {course.targetAudience.length > 0 && (
                    <Box pt={3} borderTopWidth="1px" borderColor={border}>
                      <Text fontSize="sm" fontWeight="bold" mb={2}>
                        Target Audience
                      </Text>
                      <HStack wrap="wrap" spacing={2}>
                        {course.targetAudience.map((a, i) => (
                          <Badge
                            key={i}
                            colorScheme="gray"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {a}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  )}

                  {/* Admin note (if rejected) */}
                  {course.adminNote && course.status === "rejected" && (
                    <Box
                      mt={4}
                      p={3}
                      bg="red.50"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="red.200"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={1}
                        color="red.600"
                      >
                        Rejection Reason
                      </Text>
                      <Text fontSize="sm" color="red.700">
                        {course.adminNote}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* ── Bottom Action Bar ───────────────────────────────────── */}
      <Box
        position="fixed"
        bottom={0}
        right={0}
        left={{ base: 0, md: "256px" }}
        bg={card}
        borderTopWidth="1px"
        borderColor={border}
        p={4}
        zIndex={20}
      >
        <Flex
          maxW="7xl"
          mx="auto"
          justify="space-between"
          align="center"
          gap={4}
          wrap="wrap"
        >
          <HStack fontSize="sm" color={muted} spacing={3}>
            <Text>
              Status:{" "}
              <Badge
                colorScheme={st.scheme}
                borderRadius="full"
                px={2}
                ml={1}
              >
                {st.label}
              </Badge>
            </Text>
            {course.createdAt && (
              <Text>
                • Submitted:{" "}
                <Text as="span" fontWeight="semibold">
                  {new Date(course.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Text>
            )}
          </HStack>

          <HStack w={{ base: "100%", sm: "auto" }}>
            {canDecide ? (
              <>
                <Button
                  w={{ base: "full", sm: "160px" }}
                  variant="outline"
                  colorScheme="red"
                  leftIcon={<CloseIcon />}
                  isDisabled={actionLoading}
                  onClick={() => {
                    setAdminNote("");
                    onRejectOpen();
                  }}
                >
                  Reject Course
                </Button>
                <Button
                  w={{ base: "full", sm: "160px" }}
                  colorScheme="green"
                  leftIcon={<CheckIcon />}
                  isDisabled={actionLoading}
                  onClick={onApproveOpen}
                >
                  Approve Course
                </Button>
              </>
            ) : (
              <Text fontSize="sm" fontWeight="medium" color={muted}>
                {course.status === "approved_upload"
                  ? "✅ This course has been approved"
                  : course.status === "rejected"
                    ? "❌ This course has been rejected"
                    : course.status === "published"
                      ? "🟣 This course is published"
                      : course.status === "draft"
                        ? "📝 This course is still in draft"
                        : "No actions available"}
              </Text>
            )}
          </HStack>
        </Flex>
      </Box>

      {/*Approve Confirmation Modal */}
      <Modal isOpen={isApproveOpen} onClose={onApproveClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to approve{" "}
              <Text as="span" fontWeight="bold">
                "{course.title}"
              </Text>
              ?
            </Text>
            <Text mt={2} fontSize="sm" color={muted}>
              The instructor will be notified and the course status will change
              to Approved.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onApproveClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApprove}
              isLoading={actionLoading}
            >
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reject Modal*/}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>
              Please provide a reason for rejecting{" "}
              <Text as="span" fontWeight="bold">
                "{course.title}"
              </Text>
              . The instructor will be able to see this note.
            </Text>
            <Textarea
              placeholder="Enter rejection reason (required)..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={5}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRejectClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmReject}
              isLoading={actionLoading}
              isDisabled={!adminNote.trim()}
            >
              Confirm Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Lesson Preview Modal*/}
      <Modal
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        size="4xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedLesson?.title || "Lesson Preview"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedLesson?.previewUrl ? (
              <Box borderRadius="lg" overflow="hidden" mb={4}>
                <Box
                  as="iframe"
                  title={selectedLesson.title}
                  src={selectedLesson.previewUrl}
                  width="100%"
                  height="420px"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box
                h="240px"
                bg={noVideoBg}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                <Text color={muted}>No video preview available.</Text>
              </Box>
            )}
            {selectedLesson?.description && (
              <Text fontSize="sm" color={muted}>
                {selectedLesson.description}
              </Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}