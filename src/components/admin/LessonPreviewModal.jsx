import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { courseApprovalAPI } from "../../services/admin/courseApprovalService";
import FilePreviewModal from "./FilePreviewModal";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "");

/* ── Icons ──────────────────────────────────────────────────── */
const PlayCircleIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M10,16.5L16,12L10,7.5V16.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
    />
  </Icon>
);

const DocumentIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
    />
  </Icon>
);

const QuizIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3M15,14H13V16H11V14H9V12H11V10H13V12H15V14Z"
    />
  </Icon>
);

const buildUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
};

/* ── file type helpers ───────────────────────────────────────── */
const getFileExtension = (url, fileType) => {
  if (fileType) {
    const ft = fileType.toLowerCase();
    if (
      ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ft)
    ) {
      return ft;
    }
  }
  if (!url) return "";
  const match = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
  return match ? match[1].toLowerCase() : "";
};

const PREVIEWABLE_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
];

const isPreviewable = (url, fileType) => {
  const ext = getFileExtension(url, fileType);
  return PREVIEWABLE_EXTENSIONS.includes(ext);
};

const FILE_ICON_COLORS = {
  pdf: "red.500",
  doc: "blue.500",
  docx: "blue.500",
  xls: "green.500",
  xlsx: "green.500",
  ppt: "orange.500",
  pptx: "orange.500",
  txt: "gray.500",
};

const getFileIconColor = (url, fileType) => {
  const ext = getFileExtension(url, fileType);
  return FILE_ICON_COLORS[ext] || "blue.400";
};

export default function LessonPreviewModal({
  isOpen,
  onClose,
  lesson,
  onOpenQuizPreview,
}) {
  const toast = useToast();

  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);

  // File preview
  const [selectedResource, setSelectedResource] = useState(null);
  const {
    isOpen: isFilePreviewOpen,
    onOpen: onFilePreviewOpen,
    onClose: onFilePreviewClose,
  } = useDisclosure();

  const border = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.400");
  const moduleBg = useColorModeValue("gray.50", "gray.900");
  const noContentBg = useColorModeValue("gray.100", "gray.700");

  /* ── fetch lesson content ──────────────────────────────────── */
  const fetchContent = useCallback(async () => {
    if (!lesson?.lessonId) return;
    setLoading(true);
    setResources([]);
    setQuizzes([]);
    try {
      const [resResult, quizResult] = await Promise.allSettled([
        courseApprovalAPI.getLessonResources(lesson.lessonId),
        courseApprovalAPI.getLessonQuizzes(lesson.lessonId),
      ]);

      setResources(
        resResult.status === "fulfilled" && Array.isArray(resResult.value)
          ? resResult.value
          : [],
      );

      const quizData =
        quizResult.status === "fulfilled"
          ? Array.isArray(quizResult.value)
            ? quizResult.value
            : quizResult.value?.quizzes || []
          : [];
      setQuizzes(quizData);
    } catch {
      setResources([]);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, [lesson]);

  useEffect(() => {
    if (isOpen && lesson) {
      fetchContent();
    }
  }, [isOpen, lesson, fetchContent]);

  /* ── close handler ─────────────────────────────────────────── */
  const handleClose = () => {
    setResources([]);
    setQuizzes([]);
    onClose();
  };

  /* ── open file preview ─────────────────────────────────────── */
  const openFilePreview = (resource) => {
    setSelectedResource(resource);
    onFilePreviewOpen();
  };

  const videoResources = resources.filter((r) => r.fileType === "video");
  const docResources = resources.filter((r) => r.fileType !== "video");
  const hasVideos = lesson?.mediaUrl || videoResources.length > 0;
  const hasNoContent =
    !lesson?.contentText &&
    !lesson?.mediaUrl &&
    !lesson?.previewUrl &&
    resources.length === 0 &&
    quizzes.length === 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="5xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>{lesson?.title || "Lesson Preview"}</Text>
              <Text fontSize="xs" color={muted} fontWeight="normal">
                {lesson?.type} • {lesson?.length}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            {loading ? (
              <Flex justify="center" py={10}>
                <VStack spacing={3}>
                  <Spinner size="lg" color="blue.500" />
                  <Text fontSize="sm" color={muted}>
                    Loading lesson content...
                  </Text>
                </VStack>
              </Flex>
            ) : (
              <VStack align="stretch" spacing={6}>
                {/* ── Text Content ──────────────────────────────── */}
                {lesson?.contentText && (
                  <Box>
                    <HStack mb={2}>
                      <DocumentIcon boxSize={5} color="blue.500" />
                      <Text fontWeight="semibold">Lesson Content</Text>
                    </HStack>
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={moduleBg}
                      border="1px"
                      borderColor={border}
                    >
                      <Text whiteSpace="pre-wrap" fontSize="sm">
                        {lesson.contentText}
                      </Text>
                    </Box>
                  </Box>
                )}

                {/* ── Videos ───────────────────────────────────── */}
                {hasVideos && (
                  <Box>
                    <HStack mb={2}>
                      <PlayCircleIcon boxSize={5} color="red.500" />
                      <Text fontWeight="semibold">Videos</Text>
                    </HStack>
                    <VStack align="stretch" spacing={4}>
                      {lesson?.mediaUrl && (
                        <Box borderRadius="lg" overflow="hidden" bg="black">
                          <Box
                            as="video"
                            src={buildUrl(lesson.mediaUrl)}
                            controls
                            w="100%"
                            maxH="420px"
                          />
                        </Box>
                      )}
                      {videoResources.map((r) => (
                        <Box key={r.resourceId}>
                          {r.title && (
                            <Text fontSize="sm" color={muted} mb={1}>
                              {r.title}
                            </Text>
                          )}
                          <Box borderRadius="lg" overflow="hidden" bg="black">
                            <Box
                              as="video"
                              src={buildUrl(r.fileUrl)}
                              controls
                              w="100%"
                              maxH="420px"
                            />
                          </Box>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* ── Iframe preview (YouTube, etc.) ───────────── */}
                {lesson?.previewUrl && !lesson?.mediaUrl && (
                  <Box>
                    <HStack mb={2}>
                      <PlayCircleIcon boxSize={5} color="red.500" />
                      <Text fontWeight="semibold">Video Preview</Text>
                    </HStack>
                    <Box borderRadius="lg" overflow="hidden">
                      <Box
                        as="iframe"
                        title={lesson.title}
                        src={lesson.previewUrl}
                        width="100%"
                        height="420px"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </Box>
                  </Box>
                )}

                {/* ── Documents & Resources ────────────────────── */}
                <Box>
                  <HStack mb={2}>
                    <DocumentIcon boxSize={5} color="green.500" />
                    <Text fontWeight="semibold">Documents & Resources</Text>
                  </HStack>
                  {docResources.length === 0 ? (
                    <Text fontSize="sm" color={muted}>
                      No documents available for this lesson.
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={2}>
                      {docResources.map((r) => {
                        const canPreview = isPreviewable(r.fileUrl, r.fileType);
                        const iconColor = getFileIconColor(
                          r.fileUrl,
                          r.fileType,
                        );
                        const ext = getFileExtension(r.fileUrl, r.fileType);

                        return (
                          <Flex
                            key={r.resourceId}
                            p={3}
                            borderRadius="md"
                            border="1px"
                            borderColor={border}
                            align="center"
                            justify="space-between"
                            _hover={{ bg: moduleBg }}
                            transition="background 0.15s"
                          >
                            <HStack spacing={3}>
                              <DocumentIcon boxSize={5} color={iconColor} />
                              <Box>
                                <Text fontSize="sm" fontWeight="medium">
                                  {r.title || "Document"}
                                </Text>
                                <HStack spacing={2}>
                                  <Text fontSize="xs" color={muted}>
                                    {r.fileType || "file"}
                                  </Text>
                                  {ext && (
                                    <Text
                                      fontSize="xs"
                                      color={muted}
                                      textTransform="uppercase"
                                    >
                                      .{ext}
                                    </Text>
                                  )}
                                </HStack>
                              </Box>
                            </HStack>

                            <HStack spacing={2}>
                              {canPreview && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  colorScheme="blue"
                                  leftIcon={<ViewIcon />}
                                  onClick={() => openFilePreview(r)}
                                >
                                  Preview
                                </Button>
                              )}
                              <Link
                                href={buildUrl(r.fileUrl)}
                                isExternal
                                _hover={{ textDecoration: "none" }}
                              >
                                <Button size="sm" variant="ghost">
                                  Download
                                </Button>
                              </Link>
                            </HStack>
                          </Flex>
                        );
                      })}
                    </VStack>
                  )}
                </Box>

                {/* ── Quizzes ──────────────────────────────────── */}
                <Box>
                  <HStack mb={2}>
                    <QuizIcon boxSize={5} color="purple.500" />
                    <Text fontWeight="semibold">Quizzes</Text>
                  </HStack>
                  {quizzes.length === 0 ? (
                    <Text fontSize="sm" color={muted}>
                      No quizzes available for this lesson.
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={2}>
                      {quizzes.map((quiz) => (
                        <Flex
                          key={quiz.quizId}
                          p={3}
                          borderRadius="md"
                          border="1px"
                          borderColor={border}
                          align="center"
                          justify="space-between"
                          _hover={{ bg: moduleBg, cursor: "pointer" }}
                          onClick={() => onOpenQuizPreview(quiz)}
                        >
                          <HStack spacing={3}>
                            <QuizIcon boxSize={5} color="purple.400" />
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {quiz.title || "Quiz"}
                              </Text>
                              <Text fontSize="xs" color={muted}>
                                {quiz._count?.questions ||
                                  quiz.questions?.length ||
                                  0}{" "}
                                questions
                              </Text>
                            </Box>
                          </HStack>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenQuizPreview(quiz);
                            }}
                          >
                            Preview Quiz
                          </Button>
                        </Flex>
                      ))}
                    </VStack>
                  )}
                </Box>

                {/* ── No content fallback ──────────────────────── */}
                {hasNoContent && (
                  <Box
                    h="200px"
                    bg={noContentBg}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color={muted}>
                      No content available for this lesson.
                    </Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── File Preview Modal ──────────────────────────────────── */}
      <FilePreviewModal
        isOpen={isFilePreviewOpen}
        onClose={onFilePreviewClose}
        resource={selectedResource}
      />
    </>
  );
}
