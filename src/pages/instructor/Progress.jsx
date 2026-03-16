import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Flex,
    HStack,
    Progress,
    Select,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/instructor/Sidebar";
import { useInstructorStudentProgress } from "../../hooks/useInstructorStudentProgress";

const statusColorScheme = {
    not_started: "gray",
    in_progress: "blue",
    completed: "green",
};

const formatStatus = (status) => {
    if (status === "completed") return "Completed";
    if (status === "in_progress") return "In Progress";
    return "Not Started";
};

const formatDateTime = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatDuration = (durationMs) => {
    if (durationMs == null || Number.isNaN(Number(durationMs))) return "N/A";

    const totalMinutes = Math.max(0, Math.round(Number(durationMs) / 60000));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
    return parts.join(" ");
};

const getQuizStatusLabel = (quiz) => {
    if (!quiz) return "No quiz";
    return quiz.passed ? "Passed" : "Not passed";
};

const getProgressColor = (value) => {
    if (value >= 100) return "green";
    if (value >= 60) return "blue";
    if (value > 0) return "yellow";
    return "gray";
};

const InstructorProgress = () => {
    const { user } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const {
        courses,
        selectedCourseId,
        setSelectedCourseId,
        progressData,
        loadingCourses,
        loadingProgress,
    } = useInstructorStudentProgress(user?.userId);

    const bgColor = useColorModeValue("#f8f8f5", "#0A1926");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const moduleHeaderBg = useColorModeValue("gray.50", "gray.700");
    const chartTrackBg = useColorModeValue("gray.100", "gray.700");
    const subtleBg = useColorModeValue("gray.50", "gray.900");
    const mainMarginLeft = isSidebarCollapsed ? "20" : "72";
    const students = progressData?.students || [];
    const hasStudents = students.length > 0;

    const summary = useMemo(() => {
        if (!students.length) {
            return {
                totalStudents: 0,
                averageProgress: 0,
                completedStudents: 0,
                activeStudents: 0,
                notStartedStudents: 0,
                sortedStudents: [],
                fastestCompletions: [],
                earliestCompletions: [],
            };
        }

        const completedStudents = students.filter((entry) => Number(entry.progressPercent) >= 100).length;
        const notStartedStudents = students.filter((entry) => Number(entry.progressPercent) === 0).length;
        const activeStudents = students.length - completedStudents - notStartedStudents;
        const averageProgress = Math.round(
            students.reduce((sum, entry) => sum + Number(entry.progressPercent || 0), 0) / students.length
        );
        const sortedStudents = [...students].sort(
            (left, right) => Number(right.progressPercent || 0) - Number(left.progressPercent || 0)
        );
        const completedEntries = students.filter(
            (entry) => Number(entry.progressPercent) >= 100 && entry.courseCompletedAt && entry.completionDurationMs != null
        );
        const fastestCompletions = [...completedEntries]
            .sort((left, right) => Number(left.completionDurationMs || 0) - Number(right.completionDurationMs || 0))
            .slice(0, 5);
        const earliestCompletions = [...completedEntries]
            .sort(
                (left, right) =>
                    new Date(left.courseCompletedAt).getTime() - new Date(right.courseCompletedAt).getTime()
            )
            .slice(0, 5);

        return {
            totalStudents: students.length,
            averageProgress,
            completedStudents,
            activeStudents,
            notStartedStudents,
            sortedStudents,
            fastestCompletions,
            earliestCompletions,
        };
    }, [students]);

    return (
        <Box bg={bgColor} minH="100vh">
            <Flex>
                <Sidebar
                    activeTab="progress"
                    setActiveTab={() => {}}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                <Box
                    flex={1}
                    ml={mainMarginLeft}
                    minH="100vh"
                    transition="margin-left 0.3s ease"
                    px={{ base: 4, md: 8 }}
                    py={8}
                >
                    <VStack align="stretch" spacing={6}>
                        <Box>
                            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                Student Progress
                            </Text>
                            <Text color={mutedColor} mt={1}>
                                Track each student&apos;s current module, lesson, and lesson-by-lesson completion.
                            </Text>
                        </Box>

                        <Box
                            bg={cardBg}
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="xl"
                            p={5}
                        >
                            <Text fontSize="sm" fontWeight="semibold" color={mutedColor} mb={2}>
                                Course
                            </Text>
                            <Select
                                value={selectedCourseId}
                                onChange={(event) => setSelectedCourseId(event.target.value)}
                                maxW="360px"
                                isDisabled={loadingCourses || courses.length === 0}
                            >
                                {courses.map((course) => (
                                    <option key={course.courseId} value={course.courseId}>
                                        {course.title}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        {loadingCourses || loadingProgress ? (
                            <Flex justify="center" py={16}>
                                <Spinner size="xl" color="blue.400" />
                            </Flex>
                        ) : !hasStudents ? (
                            <Box
                                bg={cardBg}
                                border="1px"
                                borderColor={borderColor}
                                borderRadius="xl"
                                p={8}
                            >
                                <Text color={mutedColor}>
                                    No enrolled students found for this course yet.
                                </Text>
                            </Box>
                        ) : (
                            <VStack align="stretch" spacing={4}>
                                <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={4}>
                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="sm" color={mutedColor} mb={2}>Total Students</Text>
                                        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                            {summary.totalStudents}
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Enrolled in this course
                                        </Text>
                                    </Box>
                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="sm" color={mutedColor} mb={2}>Average Progress</Text>
                                        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                            {summary.averageProgress}%
                                        </Text>
                                        <Progress
                                            mt={3}
                                            value={summary.averageProgress}
                                            colorScheme={getProgressColor(summary.averageProgress)}
                                            bg={chartTrackBg}
                                            borderRadius="full"
                                        />
                                    </Box>
                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="sm" color={mutedColor} mb={2}>Completed Learners</Text>
                                        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                            {summary.completedStudents}
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Finished all lessons
                                        </Text>
                                    </Box>
                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="sm" color={mutedColor} mb={2}>Need Attention</Text>
                                        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                                            {summary.notStartedStudents}
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Not started yet
                                        </Text>
                                    </Box>
                                </SimpleGrid>

                                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={1}>
                                            Progress Overview
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor} mb={4}>
                                            Compare all students at a glance.
                                        </Text>
                                        <VStack align="stretch" spacing={3}>
                                            {summary.sortedStudents.map((entry) => (
                                                <Box key={entry.enrollmentId}>
                                                    <Flex justify="space-between" mb={1} gap={3}>
                                                        <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                                            {entry.student.fullName}
                                                        </Text>
                                                        <Text fontSize="sm" color={mutedColor}>
                                                            {entry.progressPercent}%
                                                        </Text>
                                                    </Flex>
                                                    <Progress
                                                        value={entry.progressPercent}
                                                        colorScheme={getProgressColor(Number(entry.progressPercent || 0))}
                                                        bg={chartTrackBg}
                                                        borderRadius="full"
                                                        size="sm"
                                                    />
                                                </Box>
                                            ))}
                                        </VStack>
                                    </Box>

                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={1}>
                                            Learner Distribution
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor} mb={4}>
                                            Quick view of completed, active, and not-started learners.
                                        </Text>

                                        <HStack spacing={0} h="18px" borderRadius="full" overflow="hidden" bg={chartTrackBg}>
                                            <Box
                                                bg="green.400"
                                                h="100%"
                                                w={`${(summary.completedStudents / summary.totalStudents) * 100}%`}
                                            />
                                            <Box
                                                bg="blue.400"
                                                h="100%"
                                                w={`${(summary.activeStudents / summary.totalStudents) * 100}%`}
                                            />
                                            <Box
                                                bg="gray.400"
                                                h="100%"
                                                w={`${(summary.notStartedStudents / summary.totalStudents) * 100}%`}
                                            />
                                        </HStack>

                                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} mt={4}>
                                            <Box bg={subtleBg} borderRadius="lg" p={3}>
                                                <Text fontSize="xs" color={mutedColor} textTransform="uppercase">
                                                    Completed
                                                </Text>
                                                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                                    {summary.completedStudents}
                                                </Text>
                                            </Box>
                                            <Box bg={subtleBg} borderRadius="lg" p={3}>
                                                <Text fontSize="xs" color={mutedColor} textTransform="uppercase">
                                                    In Progress
                                                </Text>
                                                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                                    {summary.activeStudents}
                                                </Text>
                                            </Box>
                                            <Box bg={subtleBg} borderRadius="lg" p={3}>
                                                <Text fontSize="xs" color={mutedColor} textTransform="uppercase">
                                                    Not Started
                                                </Text>
                                                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                                    {summary.notStartedStudents}
                                                </Text>
                                            </Box>
                                        </SimpleGrid>
                                    </Box>
                                </SimpleGrid>

                                <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={1}>
                                            Top 5 Fastest Completions
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor} mb={4}>
                                            Ranked by shortest time from enrollment to full course completion.
                                        </Text>

                                        {summary.fastestCompletions.length > 0 ? (
                                            <VStack align="stretch" spacing={3}>
                                                {summary.fastestCompletions.map((entry, index) => (
                                                    <Box
                                                        key={`fastest-${entry.enrollmentId}`}
                                                        bg={subtleBg}
                                                        borderRadius="lg"
                                                        p={4}
                                                    >
                                                        <Flex justify="space-between" align="start" gap={4}>
                                                            <Box>
                                                                <HStack spacing={3} mb={1}>
                                                                    <Badge colorScheme="purple">#{index + 1}</Badge>
                                                                    <Text fontWeight="semibold" color={textColor}>
                                                                        {entry.student.fullName}
                                                                    </Text>
                                                                    <Badge colorScheme="green">Completed</Badge>
                                                                </HStack>
                                                                <Text fontSize="sm" color={mutedColor}>
                                                                    Enrolled: {formatDateTime(entry.enrolledAt)}
                                                                </Text>
                                                                <Text fontSize="sm" color={mutedColor}>
                                                                    Completed: {formatDateTime(entry.courseCompletedAt)}
                                                                </Text>
                                                            </Box>
                                                            <Box textAlign="right">
                                                                <Text fontSize="xs" color={mutedColor} textTransform="uppercase">
                                                                    Duration
                                                                </Text>
                                                                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                                                    {formatDuration(entry.completionDurationMs)}
                                                                </Text>
                                                            </Box>
                                                        </Flex>
                                                    </Box>
                                                ))}
                                                <Text fontSize="xs" color={mutedColor}>
                                                    Only completed learners are ranked.
                                                </Text>
                                            </VStack>
                                        ) : (
                                            <Box bg={subtleBg} borderRadius="lg" p={4}>
                                                <Text color={mutedColor}>
                                                    No completed learners yet for this course, so the fastest-completion ranking is empty.
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>

                                    <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                        <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={1}>
                                            Top 5 Earliest Completions
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor} mb={4}>
                                            Ranked by the earliest course completion timestamp.
                                        </Text>

                                        {summary.earliestCompletions.length > 0 ? (
                                            <VStack align="stretch" spacing={3}>
                                                {summary.earliestCompletions.map((entry, index) => (
                                                    <Box
                                                        key={`earliest-${entry.enrollmentId}`}
                                                        bg={subtleBg}
                                                        borderRadius="lg"
                                                        p={4}
                                                    >
                                                        <Flex justify="space-between" align="start" gap={4}>
                                                            <Box>
                                                                <HStack spacing={3} mb={1}>
                                                                    <Badge colorScheme="orange">#{index + 1}</Badge>
                                                                    <Text fontWeight="semibold" color={textColor}>
                                                                        {entry.student.fullName}
                                                                    </Text>
                                                                    <Badge colorScheme="green">Completed</Badge>
                                                                </HStack>
                                                                <Text fontSize="sm" color={mutedColor}>
                                                                    Completed: {formatDateTime(entry.courseCompletedAt)}
                                                                </Text>
                                                                <Text fontSize="sm" color={mutedColor}>
                                                                    Enrolled: {formatDateTime(entry.enrolledAt)}
                                                                </Text>
                                                            </Box>
                                                            <Box textAlign="right">
                                                                <Text fontSize="xs" color={mutedColor} textTransform="uppercase">
                                                                    Duration
                                                                </Text>
                                                                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                                                    {formatDuration(entry.completionDurationMs)}
                                                                </Text>
                                                            </Box>
                                                        </Flex>
                                                    </Box>
                                                ))}
                                                <Text fontSize="xs" color={mutedColor}>
                                                    Only completed learners are ranked.
                                                </Text>
                                            </VStack>
                                        ) : (
                                            <Box bg={subtleBg} borderRadius="lg" p={4}>
                                                <Text color={mutedColor}>
                                                    No completed learners yet for this course, so the earliest-completion ranking is empty.
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                </SimpleGrid>

                                {progressData.students.map((entry) => (
                                    <Box
                                        key={entry.enrollmentId}
                                        bg={cardBg}
                                        border="1px"
                                        borderColor={borderColor}
                                        borderRadius="xl"
                                        p={5}
                                    >
                                        <Progress
                                            value={entry.progressPercent}
                                            colorScheme={getProgressColor(Number(entry.progressPercent || 0))}
                                            bg={chartTrackBg}
                                            borderRadius="full"
                                            mb={4}
                                        />
                                        <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={4} mb={4}>
                                            <Box>
                                                <Text fontWeight="bold" color={textColor}>
                                                    {entry.student.fullName}
                                                </Text>
                                                <Text fontSize="sm" color={mutedColor}>
                                                    {entry.student.email}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" color={mutedColor}>Progress</Text>
                                                <Text fontWeight="bold" color={textColor}>
                                                    {entry.progressPercent}% ({entry.completedLessons}/{entry.totalLessons} lessons)
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" color={mutedColor}>Current Module</Text>
                                                <Text fontWeight="medium" color={textColor}>
                                                    {entry.currentModule?.moduleTitle || "Completed all modules"}
                                                </Text>
                                            </Box>
                                            <Box>
                                                <Text fontSize="sm" color={mutedColor}>Current Lesson</Text>
                                                <Text fontWeight="medium" color={textColor}>
                                                    {entry.currentLesson?.lessonTitle || "Completed all lessons"}
                                                </Text>
                                            </Box>
                                        </SimpleGrid>

                                        <Accordion allowMultiple>
                                            {entry.modules.map((module) => (
                                                <AccordionItem key={module.moduleId} border="none" mb={2}>
                                                    <AccordionButton
                                                        bg={moduleHeaderBg}
                                                        borderRadius="lg"
                                                    >
                                                        <Box flex="1" textAlign="left">
                                                            <HStack spacing={3}>
                                                                <Text fontWeight="semibold">{module.moduleTitle}</Text>
                                                                <Badge colorScheme={statusColorScheme[module.status] || "gray"}>
                                                                    {formatStatus(module.status)}
                                                                </Badge>
                                                            </HStack>
                                                            <Text fontSize="sm" color={mutedColor}>
                                                                {module.completedLessons}/{module.totalLessons} lessons completed
                                                            </Text>
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                    <AccordionPanel px={0} pt={3}>
                                                        <Stack spacing={3}>
                                                            {module.lessons.map((lesson) => (
                                                                <Box
                                                                    key={lesson.lessonId}
                                                                    border="1px"
                                                                    borderColor={borderColor}
                                                                    borderRadius="lg"
                                                                    p={4}
                                                                >
                                                                    <HStack justify="space-between" align="start" mb={2}>
                                                                        <Box>
                                                                            <Text fontWeight="medium" color={textColor}>
                                                                                {lesson.lessonTitle}
                                                                            </Text>
                                                                            <Text fontSize="sm" color={mutedColor}>
                                                                                {lesson.lessonType}
                                                                            </Text>
                                                                        </Box>
                                                                        <HStack spacing={2}>
                                                                            {entry.currentLesson?.lessonId === lesson.lessonId && (
                                                                                <Badge colorScheme="purple">Current</Badge>
                                                                            )}
                                                                            <Badge colorScheme={statusColorScheme[lesson.status] || "gray"}>
                                                                                {formatStatus(lesson.status)}
                                                                            </Badge>
                                                                        </HStack>
                                                                    </HStack>

                                                                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                                                                        <Text fontSize="sm" color={mutedColor}>
                                                                            Content viewed: {lesson.contentViewedAt ? "Yes" : "No"}
                                                                        </Text>
                                                                        <Text fontSize="sm" color={mutedColor}>
                                                                            Primary video: {lesson.videoCompletedAt ? "Completed" : "Not completed"}
                                                                        </Text>
                                                                        <Text fontSize="sm" color={mutedColor}>
                                                                            Quiz: {getQuizStatusLabel(lesson.quiz)}
                                                                        </Text>
                                                                    </SimpleGrid>

                                                                    {lesson.resources?.length > 0 && (
                                                                        <VStack align="stretch" spacing={2} mt={3}>
                                                                            {lesson.resources.map((resource) => (
                                                                                <HStack key={resource.resourceId} justify="space-between">
                                                                                    <Text fontSize="sm" color={textColor}>
                                                                                        {resource.title || `Resource ${resource.resourceId}`}
                                                                                    </Text>
                                                                                    <Badge colorScheme={statusColorScheme[resource.status] || "gray"}>
                                                                                        {formatStatus(resource.status)}
                                                                                    </Badge>
                                                                                </HStack>
                                                                            ))}
                                                                        </VStack>
                                                                    )}
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
};

export default InstructorProgress;
