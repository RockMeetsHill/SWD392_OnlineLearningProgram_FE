import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    IconButton,
    Collapse,
    Divider,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    DragIcon,
    ExpandMoreIcon,
    ChevronRightIcon,
    EditIcon,
    DeleteIcon,
    VideoIcon,
    QuizIcon,
    SettingsIcon,
    AddIcon,
    CheckCircleIcon,
    AssignmentIcon,
    BookIcon,
} from "./Icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const ModuleCard = ({ module, onToggle, onAddLesson, onOpenResources, onOpenQuiz, onUploadVideo }) => {
    const cardBg = useColorModeValue("white", "rgba(30, 41, 59, 0.4)");
    const headerBg = useColorModeValue("gray.50", "rgba(30, 41, 59, 0.2)");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const lessonBg = useColorModeValue("white", "#0A1926");
    const lessonBorder = useColorModeValue("gray.100", "gray.700");

    const lessons = module.lessons || [];
    const lessonsCount = module._count?.lessons || lessons.length || 0;
    const isExpanded = module.isExpanded !== false;


    const lessonHasVideo = (lesson) =>
        lesson.mediaUrl ||
        (lesson.lessonResources && lesson.lessonResources.some((r) => r.fileType === "video"));

    return (
        <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            overflow="hidden"
        >
            {/* Module Header */}
            <Flex
                p={5}
                align="center"
                gap={4}
                borderBottom={isExpanded ? "1px" : "none"}
                borderColor={borderColor}
                bg={headerBg}
            >
                <DragIcon color="gray.400" boxSize={5} cursor="grab" />
                <IconButton
                    icon={
                        isExpanded ? (
                            <ExpandMoreIcon boxSize={5} />
                        ) : (
                            <ChevronRightIcon boxSize={5} />
                        )
                    }
                    variant="ghost"
                    size="sm"
                    color="gray.400"
                    onClick={() => onToggle(module.moduleId || module.id)}
                    aria-label="Toggle module"
                />
                <Box flex={1}>
                    <Text color={textColor} fontWeight="bold" fontSize="lg">
                        {module.title}
                    </Text>
                    <Text color={mutedColor} fontSize="sm" mt={1}>
                        {lessonsCount} Lessons
                    </Text>
                </Box>
                <HStack spacing={2}>
                    <IconButton
                        icon={<EditIcon boxSize={5} />}
                        variant="ghost"
                        size="md"
                        color="gray.400"
                        _hover={{ color: textColor, bg: useColorModeValue("gray.100", "gray.700") }}
                        aria-label="Edit module"
                    />
                    <IconButton
                        icon={<DeleteIcon boxSize={5} />}
                        variant="ghost"
                        size="md"
                        color="gray.400"
                        _hover={{ color: "red.500", bg: "red.50" }}
                        aria-label="Delete module"
                    />
                </HStack>
            </Flex>

            {/* Lessons */}
            <Collapse in={isExpanded}>
                <VStack p={5} spacing={4} align="stretch">
                    {lessons.map((lesson, idx) => {
                        // Calculate hasDocumentResources for each lesson
                        const hasDocumentResources = lesson?.lessonResources?.some(r => r.fileType !== "video") || false;

                        return (
                            <Flex
                                key={lesson.lessonId || lesson.id || idx}
                                align="center"
                                gap={4}
                                p={4}
                                bg={lessonBg}
                                borderRadius="lg"
                                border="1px"
                                borderColor={lessonBorder}
                                _hover={{ borderColor: `${PRIMARY_COLOR}50`, shadow: "sm" }}
                                transition="all 0.2s"
                            >
                                <DragIcon color="gray.300" boxSize={5} cursor="grab" />
                                <Box flex={1}>
                                    <HStack spacing={3}>
                                        <Text fontSize="sm" fontWeight="bold" color={PRIMARY_COLOR}>
                                            {lesson.orderIndex || idx + 1}
                                        </Text>
                                        <Text fontSize="md" fontWeight="semibold" color={textColor}>
                                            {lesson.title}
                                        </Text>
                                    </HStack>
                                </Box>
                                <HStack spacing={4}>
                                    {lessonHasVideo(lesson) ? (
                                        // Video Ready - bấm để xem video
                                        <Button
                                            size="sm"
                                            leftIcon={<CheckCircleIcon boxSize={4} />}
                                            bg="green.50"
                                            color="green.600"
                                            fontWeight="bold"
                                            _hover={{
                                                bg: "green.100",
                                            }}
                                            onClick={() => onUploadVideo && onUploadVideo(lesson)}
                                        >
                                            Video Ready
                                        </Button>
                                    ) : (
                                        // Chưa có video - hiện nút Upload Video
                                        <Button
                                            size="sm"
                                            leftIcon={<VideoIcon boxSize={4} />}
                                            bg={useColorModeValue("gray.100", "gray.800")}
                                            color={useColorModeValue("gray.600", "gray.300")}
                                            fontWeight="bold"
                                            _hover={{
                                                bg: `${PRIMARY_COLOR}20`,
                                                color: PRIMARY_COLOR,
                                            }}
                                            onClick={() => onUploadVideo && onUploadVideo(lesson)}
                                        >
                                            Upload Video
                                        </Button>
                                    )}
                                    {lesson.quizzes && lesson.quizzes.length > 0 ? (
                                        <Button
                                            size="sm"
                                            leftIcon={<AssignmentIcon boxSize={4} />}
                                            variant="outline"
                                            colorScheme="blue"
                                            fontWeight="bold"
                                            onClick={() => onOpenQuiz && onOpenQuiz(lesson)}
                                        >
                                            {lesson.quizzes.length > 1 ? `Quizzes (${lesson.quizzes.length})` : "Quiz"}
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            leftIcon={<QuizIcon boxSize={4} />}
                                            bg={useColorModeValue("gray.100", "gray.800")}
                                            color={useColorModeValue("gray.600", "gray.300")}
                                            fontWeight="bold"
                                            _hover={{
                                                bg: `${PRIMARY_COLOR}20`,
                                                color: PRIMARY_COLOR,
                                            }}
                                            onClick={() => onOpenQuiz && onOpenQuiz(lesson)}
                                        >
                                            Add Quiz
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        leftIcon={<BookIcon boxSize={4} />}
                                        bg={hasDocumentResources ? "rgba(66, 153, 225, 0.1)" : useColorModeValue("gray.100", "gray.800")}
                                        color={hasDocumentResources ? PRIMARY_COLOR : useColorModeValue("gray.600", "gray.300")}
                                        fontWeight="bold"
                                        _hover={{
                                            bg: hasDocumentResources ? "rgba(66, 153, 225, 0.2)" : `${PRIMARY_COLOR}20`,
                                            color: PRIMARY_COLOR,
                                        }}
                                        onClick={() => onOpenResources && onOpenResources(lesson)}
                                    >
                                        File
                                        {hasDocumentResources && (
                                            <Text fontSize="xs" ml={1.5} fontWeight="600">
                                                ({lesson.lessonResources.filter(r => r.fileType !== "video").length})
                                            </Text>
                                        )}
                                    </Button>
                                    <Divider
                                        orientation="vertical"
                                        h={6}
                                        borderColor={useColorModeValue("gray.200", "gray.700")}
                                    />
                                    <IconButton
                                        icon={<SettingsIcon boxSize={5} />}
                                        variant="ghost"
                                        size="sm"
                                        color="gray.400"
                                        _hover={{ color: textColor }}
                                        aria-label="Lesson settings"
                                    />
                                </HStack>
                            </Flex>
                        )
                    })}

                    {/* Add Lesson Button */}
                    <Button
                        w="full"
                        py={4}
                        variant="outline"
                        borderWidth={2}
                        borderStyle="dashed"
                        borderColor={useColorModeValue("gray.300", "gray.700")}
                        borderRadius="lg"
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="bold"
                        leftIcon={<AddIcon boxSize={5} />}
                        _hover={{
                            color: PRIMARY_COLOR,
                            borderColor: PRIMARY_COLOR,
                            bg: `${PRIMARY_COLOR}05`,
                        }}
                        onClick={() => onAddLesson && onAddLesson(module.moduleId || module.id, module.title)}
                    >
                        Add New Lesson to Module
                    </Button>
                </VStack>
            </Collapse>
        </Box>
    );
};

export default ModuleCard;
