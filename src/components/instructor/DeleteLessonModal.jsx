import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Text,
    VStack,
    Icon,
    useToast,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { lessonAPI } from "../../services/lessonService";

const DeleteLessonModal = ({ isOpen, onClose, lesson, onLessonDeleted }) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        if (!lesson) return;

        setLoading(true);
        try {
            await lessonAPI.deleteLesson(lesson.lessonId);

            toast({
                title: "Xóa thành công!",
                description: `Bài học "${lesson.title}" đã được xóa.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            if (onLessonDeleted) {
                onLessonDeleted(lesson.lessonId);
            }

            onClose();
        } catch (error) {
            console.error("Delete lesson error:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Không thể xóa bài học",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="red.500">Xóa bài học</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="center" py={4}>
                        <Icon as={WarningTwoIcon} w={12} h={12} color="red.500" />

                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                            Bạn có chắc chắn muốn xóa?
                        </Text>

                        <Text textAlign="center" color="gray.600">
                            Bài học <strong>"{lesson?.title}"</strong> sẽ bị xóa vĩnh viễn.
                        </Text>

                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                Tất cả video, tài liệu và quiz của bài học này cũng sẽ bị xóa.
                            </Text>
                        </Alert>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={handleDelete}
                        isLoading={loading}
                        loadingText="Đang xóa..."
                    >
                        Xóa bài học
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteLessonModal;