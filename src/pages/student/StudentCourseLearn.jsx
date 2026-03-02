import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
    Box,
    Flex,
    VStack,
    Text,
    Button,
    Spinner,
    useColorModeValue,
    Link,
    Divider,
    Collapse,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Sidebar from "../../components/student/StudentSidebar";
import StudentNavbar from "../../components/student/StudentNavbar";
import TakeQuizModal from "../../components/student/TakeQuizModal";
import AITutorChat from "../../components/student/AITutorChat";
import { courseAPI } from "../../services/courseService";
import { lessonResourceAPI } from "../../services/lessonResourceService";
import { progressAPI } from "../../services/progressService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");

const StudentCourseLearn = () => {
    const { courseId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const lessonIdParam = searchParams.get("lessonId");
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [resourcesLoading, setResourcesLoading] = useState(false);
    const [expandedModules, setExpandedModules] = useState({});
    const [takeQuizId, setTakeQuizId] = useState(null);
    const [takeQuizTitle, setTakeQuizTitle] = useState("");
    const [courseProgress, setCourseProgress] = useState(null);

    const bgColor = useColorModeValue("#f8f8f5", "gray.900");
    const sidebarBg = useColorModeValue("white", "gray.800");
    const sidebarHoverBg = useColorModeValue("gray.50", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const contentBoxBg = useColorModeValue("white", "gray.800");

    const allLessons = course?.modules?.flatMap((m) => m.lessons || []) || [];
    const selectedLessonId = lessonIdParam ? Number.parseInt(lessonIdParam, 10) : (allLessons[0]?.lessonId ?? null);
    const selectedLesson = selectedLessonId ? allLessons.find((l) => l.lessonId === selectedLessonId) : null;

    useEffect(() => {
        if (!course?.modules?.length || lessonIdParam) return;
        const first = course.modules[0]?.lessons?.[0];
        if (first?.lessonId) setSearchParams({ lessonId: String(first.lessonId) }, { replace: true });
    }, [course?.modules, lessonIdParam, setSearchParams]);

    useEffect(() => {
        if (!courseId) return;
        let cancelled = false;
        setLoading(true);
        courseAPI
            .getCourseById(courseId)
            .then((data) => {
                if (!cancelled) {
                    setCourse(data);
                    if (!data.isEnrolled) {
                        navigate(`/courses/${courseId}`, { replace: true });
                        return;
                    }
                    return progressAPI.getCourseProgress(courseId);
                }
            })
            .then((progress) => {
                if (progress) setCourseProgress(progress);
            })
            .catch(() => {
                if (!cancelled) setCourse(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [courseId, navigate]);

    const refetchProgress = () => {
        if (courseId) {
            progressAPI.getCourseProgress(courseId).then(setCourseProgress).catch(() => {});
        }
    };

    useEffect(() => {
        if (!selectedLessonId) {
            setResources([]);
            return;
        }
        setResourcesLoading(true);
        lessonResourceAPI
            .listByLesson(selectedLessonId)
            .then((list) => setResources(Array.isArray(list) ? list : []))
            .catch(() => setResources([]))
            .finally(() => setResourcesLoading(false));
    }, [selectedLessonId]);

    const lessonStatusMap = (() => {
        if (!courseProgress?.modules) return {};
        const map = {};
        courseProgress.modules.forEach((mod) => {
            (mod.lessons || []).forEach((l) => {
                map[l.lessonId] = l.status;
            });
        });
        return map;
    })();

    const setLesson = (lessonId) => {
        setSearchParams({ lessonId: String(lessonId) });
        progressAPI.updateLessonProgress(lessonId, { status: "in_progress" }).then(() => refetchProgress()).catch(() => {});
    };

    const toggleModule = (moduleId) => {
        setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    if (loading || !course) {
        return (
            <Box bg={bgColor} minH="100vh">
                <StudentNavbar />
                <Flex justify="center" align="center" minH="60vh">
                    <Spinner size="xl" color={PRIMARY_COLOR} />
                </Flex>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minH="100vh">
            <StudentNavbar />
            <Flex>
                <Sidebar />
                <Box flex={1} ml={{ base: 0, md: "240px" }} pt="70px" pb={8}>
                    <Flex>
                        {/* Sidebar: modules & lessons */}
                        <Box
                            w="280px"
                            minH="calc(100vh - 70px)"
                            bg={sidebarBg}
                            borderRight="1px"
                            borderColor={borderColor}
                            py={4}
                            px={3}
                            display={{ base: "none", md: "block" }}
                        >
                            <Text fontWeight="bold" color={textColor} mb={3} fontSize="sm">
                                Nội dung khóa học
                            </Text>
                            {courseProgress && (
                                <Text fontSize="xs" color={mutedColor} mb={2}>
                                    {courseProgress.completedLessons}/{courseProgress.totalLessons} bài hoàn thành
                                </Text>
                            )}
                            <VStack align="stretch" spacing={1}>
                                {course.modules?.map((mod) => {
                                    const isExpanded = expandedModules[mod.moduleId] !== false;
                                    const lessons = mod.lessons || [];
                                    return (
                                        <Box key={mod.moduleId}>
                                            <Flex
                                                align="center"
                                                justify="space-between"
                                                py={2}
                                                px={2}
                                                cursor="pointer"
                                                borderRadius="md"
                                                _hover={{ bg: sidebarHoverBg }}
                                                onClick={() => toggleModule(mod.moduleId)}
                                            >
                                                <Text fontSize="sm" fontWeight="medium" color={textColor} noOfLines={1}>
                                                    {mod.title}
                                                </Text>
                                                {isExpanded ? (
                                                    <ChevronDownIcon boxSize={4} color={mutedColor} />
                                                ) : (
                                                    <ChevronRightIcon boxSize={4} color={mutedColor} />
                                                )}
                                            </Flex>
                                            <Collapse in={isExpanded}>
                                                <VStack align="stretch" spacing={0} pl={2}>
                                                    {lessons.map((lesson) => (
                                                        <Button
                                                            key={lesson.lessonId}
                                                            size="sm"
                                                            variant="ghost"
                                                            justifyContent="flex-start"
                                                            fontWeight={selectedLessonId === lesson.lessonId ? "bold" : "normal"}
                                                            color={selectedLessonId === lesson.lessonId ? PRIMARY_COLOR : textColor}
                                                            bg={selectedLessonId === lesson.lessonId ? `${PRIMARY_COLOR}15` : "transparent"}
                                                            onClick={() => setLesson(lesson.lessonId)}
                                                        >
                                                            {lessonStatusMap[lesson.lessonId] === "completed" ? "✓ " : ""}
                                                            {lesson.title}
                                                        </Button>
                                                    ))}
                                                </VStack>
                                            </Collapse>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </Box>

                        {/* Main content */}
                        <Box flex={1} px={{ base: 4, md: 8 }} pt={6}>
                            {!selectedLesson ? (
                                <Text color={mutedColor}>Chọn một bài học từ danh sách bên trái.</Text>
                            ) : (
                                <VStack align="stretch" spacing={6}>
                                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                        {selectedLesson.title}
                                    </Text>
                                    {selectedLesson.contentText && (
                                        <Box
                                            p={4}
                                            borderRadius="lg"
                                            bg={contentBoxBg}
                                            border="1px"
                                            borderColor={borderColor}
                                        >
                                            <Text whiteSpace="pre-wrap" color={textColor}>
                                                {selectedLesson.contentText}
                                            </Text>
                                        </Box>
                                    )}
                                    {(selectedLesson.mediaUrl || (resources.some((r) => r.fileType === "video"))) && (
                                        <Box>
                                            <Text fontWeight="semibold" color={textColor} mb={2}>
                                                Video
                                            </Text>
                                            <VStack align="stretch" spacing={4}>
                                                {selectedLesson.mediaUrl && (
                                                    <Box
                                                        as="video"
                                                        src={selectedLesson.mediaUrl.startsWith("http") ? selectedLesson.mediaUrl : `${API_BASE}${selectedLesson.mediaUrl}`}
                                                        controls
                                                        w="100%"
                                                        maxH="400px"
                                                        borderRadius="lg"
                                                        bg="black"
                                                    />
                                                )}
                                                {resources
                                                    .filter((r) => r.fileType === "video")
                                                    .map((r) => (
                                                        <Box key={r.resourceId}>
                                                            {r.title && (
                                                                <Text fontSize="sm" color={mutedColor} mb={1}>
                                                                    {r.title}
                                                                </Text>
                                                            )}
                                                            <Box
                                                                as="video"
                                                                src={r.fileUrl.startsWith("http") ? r.fileUrl : `${API_BASE}${r.fileUrl}`}
                                                                controls
                                                                w="100%"
                                                                maxH="400px"
                                                                borderRadius="lg"
                                                                bg="black"
                                                            />
                                                        </Box>
                                                    ))}
                                            </VStack>
                                        </Box>
                                    )}
                                    <Box>
                                        <Text fontWeight="semibold" color={textColor} mb={2}>
                                            Tài liệu
                                        </Text>
                                        {resourcesLoading ? (
                                            <Spinner size="sm" />
                                        ) : resources.filter((r) => r.fileType !== "video").length === 0 ? (
                                            <Text color={mutedColor} fontSize="sm">
                                                Không có tài liệu.
                                            </Text>
                                        ) : (
                                            <VStack align="stretch" spacing={2}>
                                                {resources
                                                    .filter((r) => r.fileType !== "video")
                                                    .map((r) => (
                                                        <Link
                                                            key={r.resourceId}
                                                            href={r.fileUrl.startsWith("http") ? r.fileUrl : `${API_BASE}${r.fileUrl}`}
                                                            isExternal
                                                            fontSize="sm"
                                                            color={PRIMARY_COLOR}
                                                        >
                                                            {r.title || "Tài liệu"}
                                                        </Link>
                                                    ))}
                                            </VStack>
                                        )}
                                    </Box>
                                    <Divider />
                                    {selectedLesson.quizzes?.length > 0 && (
                                        <Box>
                                            <Text fontWeight="semibold" color={textColor} mb={2}>
                                                Quiz
                                            </Text>
                                            {selectedLesson.quizzes.map((q) => (
                                                <Button
                                                    key={q.quizId}
                                                    size="sm"
                                                    bg={PRIMARY_COLOR}
                                                    color="#0A1926"
                                                    onClick={() => {
                                                        setTakeQuizId(q.quizId);
                                                        setTakeQuizTitle(q.title || "Quiz");
                                                    }}
                                                >
                                                    Làm bài: {q.title || "Quiz"}
                                                </Button>
                                            ))}
                                        </Box>
                                    )}
                                    <Box>
                                        <Text fontWeight="semibold" color={textColor} mb={2}>
                                            AI Tutor
                                        </Text>
                                        <AITutorChat lessonId={selectedLessonId} />
                                    </Box>
                                </VStack>
                            )}
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <TakeQuizModal
                isOpen={!!takeQuizId}
                onClose={() => { setTakeQuizId(null); setTakeQuizTitle(""); }}
                quizId={takeQuizId}
                quizTitle={takeQuizTitle}
                onSubmitted={() => {
                    if (selectedLessonId) {
                        progressAPI.updateLessonProgress(selectedLessonId, { status: "completed" }).then(() => refetchProgress()).catch(() => {});
                    }
                }}
            />
        </Box>
    );
};

export default StudentCourseLearn;
