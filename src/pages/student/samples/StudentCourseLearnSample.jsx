import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Spinner,
    useColorModeValue,
    Link,
    Divider,
    Card,
    CardBody,
    Icon,
    Badge,
} from "@chakra-ui/react";
import Sidebar from "../../../components/learning/LearningSidebar";
import StudentNavbar from "../../../components/learning/LearningNavbar";
import TakeQuizModal from "../samples/TakeQuizModal";
import AITutorChat from "../samples/AITutorChat";
import { courseAPI } from "../../../services/courseServiceOld";
import { lessonResourceAPI } from "../../../services/lessonResourceService";
import { progressAPI } from "../../../services/progressService";
import { PRIMARY_COLOR } from "../../../components/constants/instructor";

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
    const [takeQuizId, setTakeQuizId] = useState(null);
    const [takeQuizTitle, setTakeQuizTitle] = useState("");
    const [courseProgress, setCourseProgress] = useState(null);
    const [isAITutorOpen, setIsAITutorOpen] = useState(false);

    const bgColor = useColorModeValue("#f8f8f5", "gray.900");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const contentBoxBg = useColorModeValue("white", "gray.800");
    const resourceBg = useColorModeValue("gray.50", "gray.700");

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

    // Define animations
    const slideUpIn = keyframes`
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    const fadeIn = keyframes`
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    `;

    const pulse = keyframes`
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(218, 165, 32, 0.7);
        }
        50% {
            box-shadow: 0 0 0 10px rgba(218, 165, 32, 0);
        }
    `;

    if (loading || !course) {
        return (
            <Box bg={bgColor} minH="100vh">
                <Flex justify="center" align="center" minH="60vh">
                    <Spinner size="xl" color={PRIMARY_COLOR} />
                </Flex>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minH="100vh">
            <Flex direction="column" minH="100vh">
                {/* Top Navbar */}
                <StudentNavbar />
                
                <Flex flex={1}>
                    {/* Sidebar */}
                    <Sidebar 
                        course={course}
                        selectedLessonId={selectedLessonId}
                        lessonStatusMap={lessonStatusMap}
                        onSetLesson={setLesson}
                        primaryColor={PRIMARY_COLOR}
                    />
                    
                    {/* Main Content */}
                    <Box flex={1} pt={{ base: 4, md: 8 }} pb={8} px={{ base: 4, md: 8 }}>
                        {selectedLesson && (
                                <VStack align="stretch" spacing={2}>
                                {/* Lesson Header */}
                                <Box mb={2}>
                                    <Flex justify="space-between" align="start" mb={2}>
                                        <VStack align="start" spacing={3}>
                                            <Badge bg={PRIMARY_COLOR} color="#0A1926" px={3} py={1} rounded="full" fontSize="xs" fontWeight="bold">
                                                {course?.title}
                                            </Badge>
                                            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                                {selectedLesson.title}
                                            </Text>
                                        </VStack>
                                    </Flex>
                                </Box>

                                <Divider />

                                {/* Lesson Content */}
                                {selectedLesson.contentText && (
                                    <Card bg={contentBoxBg} shadow="sm" rounded="xl" border="1px" borderColor={borderColor}>
                                        <CardBody>
                                            <VStack align="stretch" spacing={3}>
                                                <Text fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR} textTransform="uppercase">
                                                    Lesson Content
                                                </Text>
                                                <Text whiteSpace="pre-wrap" color={textColor} lineHeight="1.8">
                                                    {selectedLesson.contentText}
                                                </Text>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                )}

                                {/* Videos Section */}
                                {(selectedLesson.mediaUrl || resources.some((r) => r.fileType === "video")) && (
                                    <Card bg={contentBoxBg} shadow="sm" rounded="xl" border="1px" borderColor={borderColor}>
                                        <CardBody>
                                            <VStack align="stretch" spacing={4}>
                                                <HStack spacing={2}>
                                                    <Icon viewBox="0 0 24 24" boxSize={5} color={PRIMARY_COLOR}>
                                                        <path fill="currentColor" d="M8,5.14V19.14L19.14,12.14L8,5.14Z" />
                                                    </Icon>
                                                    <Text fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR} textTransform="uppercase">
                                                        Videos
                                                    </Text>
                                                </HStack>
                                                <VStack align="stretch" spacing={4}>
                                                    {selectedLesson.mediaUrl && (
                                                        <Box
                                                            as="video"
                                                            src={selectedLesson.mediaUrl.startsWith("http") ? selectedLesson.mediaUrl : `${API_BASE}${selectedLesson.mediaUrl}`}
                                                            controls
                                                            w="100%"
                                                            maxH="500px"
                                                            borderRadius="lg"
                                                            bg="black"
                                                            transition="all 0.3s"
                                                            _hover={{ shadow: "lg" }}
                                                        />
                                                    )}
                                                    {resources
                                                        .filter((r) => r.fileType === "video")
                                                        .map((r) => (
                                                            <Box key={r.resourceId}>
                                                                {r.title && (
                                                                    <Text fontSize="sm" fontWeight="medium" color={mutedColor} mb={2}>
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
                                                                    transition="all 0.3s"
                                                                    _hover={{ shadow: "lg" }}
                                                                />
                                                            </Box>
                                                        ))}
                                                </VStack>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                )}

                                {/* Resources Section */}
                                <Card bg={contentBoxBg} shadow="sm" rounded="xl" border="1px" borderColor={borderColor}>
                                    <CardBody>
                                        <VStack align="stretch" spacing={4}>
                                            <HStack spacing={2}>
                                                <Icon viewBox="0 0 24 24" boxSize={5} color={PRIMARY_COLOR}>
                                                    <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                                </Icon>
                                                <Text fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR} textTransform="uppercase">
                                                    Resources
                                                </Text>
                                            </HStack>
                                            {resourcesLoading ? (
                                                <Flex justify="center" py={4}>
                                                    <Spinner size="sm" color={PRIMARY_COLOR} />
                                                </Flex>
                                            ) : resources.filter((r) => r.fileType !== "video").length === 0 ? (
                                                <Text color={mutedColor} fontSize="sm">
                                                    No resources available for this lesson.
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
                                                                _hover={{ textDecoration: "none" }}
                                                            >
                                                                <Flex
                                                                    p={3}
                                                                    bg={resourceBg}
                                                                    rounded="lg"
                                                                    align="center"
                                                                    gap={3}
                                                                    transition="all 0.2s"
                                                                    _hover={{
                                                                        bg: `${PRIMARY_COLOR}15`,
                                                                        transform: "translateX(4px)",
                                                                    }}
                                                                >
                                                                    <Icon boxSize={4} color={PRIMARY_COLOR}>
                                                                        <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z" />
                                                                    </Icon>
                                                                    <Text fontSize="sm" color={textColor} fontWeight="medium">
                                                                        {r.title || "Download Resource"}
                                                                    </Text>
                                                                </Flex>
                                            </Link>
                                            ))}
                                                </VStack>
                                            )}
                                        </VStack>
                                    </CardBody>
                                </Card>

                                <Divider />

                                {/* Quiz Section */}
                                {selectedLesson.quizzes?.length > 0 && (
                                    <Card bg={contentBoxBg} shadow="sm" rounded="xl" border="1px" borderColor={borderColor}>
                                        <CardBody>
                                            <VStack align="stretch" spacing={4}>
                                                <HStack spacing={2}>
                                                    <Icon viewBox="0 0 24 24" boxSize={5} color={PRIMARY_COLOR}>
                                                        <path fill="currentColor" d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12.5,7H11V13L16.2,16.2L17,15.3L12.5,12.4V7Z" />
                                                    </Icon>
                                                    <Text fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR} textTransform="uppercase">
                                                        Test Your Knowledge
                                                    </Text>
                                                </HStack>
                                                <VStack align="stretch" spacing={2}>
                                                    {selectedLesson.quizzes.map((q) => (
                                                        <Button
                                                            key={q.quizId}
                                                            size="md"
                                                            bg={PRIMARY_COLOR}
                                                            color="#0A1926"
                                                            fontWeight="bold"
                                                            rounded="lg"
                                                            transition="all 0.2s"
                                                            _hover={{
                                                                transform: "translateY(-2px)",
                                                                shadow: "lg",
                                                                bg: PRIMARY_COLOR,
                                                                opacity: 0.9,
                                                            }}
                                                            onClick={() => {
                                                                setTakeQuizId(q.quizId);
                                                                setTakeQuizTitle(q.title || "Quiz");
                                                            }}
                                                        >
                                                            {q.title || "Take Quiz"}
                                                        </Button>
                                                    ))}
                                                </VStack>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                )}

                                {/* AI Tutor Floating Button */}
                                <Box
                                    position="fixed"
                                    bottom={8}
                                    right={8}
                                    w={16}
                                    h={16}
                                    bg={PRIMARY_COLOR}
                                    rounded="full"
                                    shadow="lg"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    cursor="pointer"
                                    transition="all 0.3s"
                                    _hover={{
                                        transform: "scale(1.1)",
                                        shadow: "xl",
                                    }}
                                    animation={`${pulse} 2s infinite`}
                                    zIndex={20}
                                    onClick={() => setIsAITutorOpen(!isAITutorOpen)}
                                >
                                    <Icon viewBox="0 0 24 24" boxSize={8} color="#0A1926">
                                        <path fill="currentColor" d="M20,2H4C2.9,2 2,2.9 2,4V22L6,18H20C21.1,18 22,17.1 22,16V4C22,2.9 21.1,2 20,2M6,9H18V11H6V9M14,15H6V13H14V15M18,10H6V8H18V10Z" />
                                    </Icon>
                                </Box>

                                {/* AI Tutor Chat Modal */}
                                {isAITutorOpen && (
                                    <Box
                                        position="fixed"
                                        bottom={28}
                                        right={8}
                                        w={{ base: "90vw", md: "400px" }}
                                        bg={contentBoxBg}
                                        rounded="xl"
                                        shadow="2xl"
                                        zIndex={19}
                                        border="1px"
                                        borderColor={borderColor}
                                        maxH="500px"
                                        overflowY="auto"
                                        animation={`${slideUpIn} 0.4s ease-out`}
                                    >
                                        <Card 
                                            bg={contentBoxBg} 
                                            shadow="none" 
                                            rounded="xl"
                                            animation={`${fadeIn} 0.6s ease-in`}
                                        >
                                            <CardBody>
                                                <VStack align="stretch" spacing={3}>
                                                    <Flex justify="space-between" align="center">
                                                        <HStack spacing={2}>
                                                            <Icon viewBox="0 0 24 24" boxSize={5} color={PRIMARY_COLOR}>
                                                                <path fill="currentColor" d="M20,2H4C2.9,2 2,2.9 2,4V22L6,18H20C21.1,18 22,17.1 22,16V4C22,2.9 21.1,2 20,2M6,9H18V11H6V9M14,15H6V13H14V15M18,10H6V8H18V10Z" />
                                                            </Icon>
                                                            <Text fontSize="sm" fontWeight="semibold" color={PRIMARY_COLOR} textTransform="uppercase">
                                                                AI Tutor
                                                            </Text>
                                                        </HStack>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setIsAITutorOpen(false)}
                                                        >
                                                            ✕
                                                        </Button>
                                                    </Flex>
                                                    <Divider />
                                                    <AITutorChat lessonId={selectedLessonId} />
                                                </VStack>
                                            </CardBody>
                                        </Card>
                                    </Box>
                                )}
                            </VStack>
                        )}
                    </Box>
                </Flex>
            </Flex>

            {/* Modals */}
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
