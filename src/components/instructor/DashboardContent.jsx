import { useState } from "react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Button,
    Spinner,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import ModuleCard from "./ModuleCard";
import AddLessonModal from "./AddLessonModal";
import AddModuleModal from "./AddModuleModal";
import LessonResourcesModal from "./LessonResourcesModal";
import CreateQuizModal from "./CreateQuizModal";
import UploadLessonVideoModal from "./UploadLessonVideoModal";
import { AddCircleIcon } from "./Icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const DashboardContent = ({ courseId, modules, loading, onToggleModule, onRefetch }) => {
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const statBg = useColorModeValue("white", "rgba(30, 41, 59, 0.5)");
    const statBorderColor = useColorModeValue("gray.200", "gray.700");
    const {
        isOpen: isAddModuleOpen,
        onOpen: onAddModuleOpen,
        onClose: onAddModuleClose,
    } = useDisclosure();
    const {
        isOpen: isAddLessonOpen,
        onOpen: onAddLessonOpen,
        onClose: onAddLessonClose,
    } = useDisclosure();
    const [addLessonModuleId, setAddLessonModuleId] = useState(null);
    const [addLessonModuleTitle, setAddLessonModuleTitle] = useState("");
    const [resourceModalLesson, setResourceModalLesson] = useState(null);
    const [quizModalLesson, setQuizModalLesson] = useState(null);
    const [uploadVideoLesson, setUploadVideoLesson] = useState(null);

    const handleAddLessonClick = (moduleId, moduleTitle) => {
        setAddLessonModuleId(moduleId);
        setAddLessonModuleTitle(moduleTitle || "");
        onAddLessonOpen();
    };

    const totalModules = modules.length;
    const totalLessons = modules.reduce((acc, m) => acc + (m._count?.lessons || 0), 0);

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="400px">
                <Spinner size="xl" color={PRIMARY_COLOR} />
            </Flex>
        );
    }

    return (
        <>
            <Box px={10} py={8}>
                {/* Stats Bar */}
                <Flex justify="space-between" align="center" mb={8}>
                    <HStack spacing={6}>
                        <HStack
                            bg={statBg}
                            px={5}
                            py={3}
                            borderRadius="xl"
                            border="1px"
                            borderColor={statBorderColor}
                        >
                            <Text color={mutedColor} fontSize="sm" fontWeight="medium">
                                Modules:
                            </Text>
                            <Text color={textColor} fontSize="lg" fontWeight="bold">
                                {totalModules}
                            </Text>
                        </HStack>
                        <HStack
                            bg={statBg}
                            px={5}
                            py={3}
                            borderRadius="xl"
                            border="1px"
                            borderColor={statBorderColor}
                        >
                            <Text color={mutedColor} fontSize="sm" fontWeight="medium">
                                Lessons:
                            </Text>
                            <Text color={textColor} fontSize="lg" fontWeight="bold">
                                {totalLessons}
                            </Text>
                        </HStack>
                    </HStack>

                    <Button
                        leftIcon={<AddCircleIcon boxSize={5} />}
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        fontWeight="bold"
                        fontSize="sm"
                        px={6}
                        py={6}
                        _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                        boxShadow={`0 4px 14px ${PRIMARY_COLOR}30`}
                        transition="all 0.2s"
                        onClick={onAddModuleOpen}
                        isDisabled={!courseId}
                    >
                        Add New Module
                    </Button>
                </Flex>

                <Text color={mutedColor} fontSize="sm" mb={2}>
                    Steps: Add lessons to each module below → Preview course → Submit for review when ready.
                </Text>

                {/* Modules List */}
                <VStack spacing={6} align="stretch">
                    {modules.map((module, index) => (
                        <ModuleCard
                            key={module.moduleId || module.id || index}
                            module={module}
                            onToggle={onToggleModule}
                            onAddLesson={handleAddLessonClick}
                            onOpenResources={setResourceModalLesson}
                            onOpenQuiz={setQuizModalLesson}
                            onUploadVideo={setUploadVideoLesson}
                        />
                    ))}
                </VStack>
            </Box>

            <AddModuleModal
                isOpen={isAddModuleOpen}
                onClose={onAddModuleClose}
                courseId={courseId}
                onSuccess={onRefetch}
            />
            <AddLessonModal
                isOpen={isAddLessonOpen}
                onClose={onAddLessonClose}
                moduleId={addLessonModuleId}
                moduleTitle={addLessonModuleTitle}
                onSuccess={onRefetch}
            />
            <LessonResourcesModal
                isOpen={!!resourceModalLesson}
                onClose={() => setResourceModalLesson(null)}
                lessonId={resourceModalLesson?.lessonId ?? resourceModalLesson?.id}
                lessonTitle={resourceModalLesson?.title}
                onSuccess={onRefetch}
            />
            <CreateQuizModal
                isOpen={!!quizModalLesson}
                onClose={() => setQuizModalLesson(null)}
                lessonId={quizModalLesson?.lessonId ?? quizModalLesson?.id}
                lessonTitle={quizModalLesson?.title}
                onSuccess={onRefetch}
            />
            <UploadLessonVideoModal
                isOpen={!!uploadVideoLesson}
                onClose={() => setUploadVideoLesson(null)}
                lessonId={uploadVideoLesson?.lessonId ?? uploadVideoLesson?.id}
                lessonTitle={uploadVideoLesson?.title}
                existingVideoUrl={uploadVideoLesson?.mediaUrl ||
                    uploadVideoLesson?.lessonResources?.find(r => r.fileType === "video")?.fileUrl}
                videoResourceId={uploadVideoLesson?.lessonResources?.find(r => r.fileType === "video")?.resourceId}
                onSuccess={onRefetch}
            />
        </>
    );
};

export default DashboardContent;
