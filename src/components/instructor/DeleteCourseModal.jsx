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
import { courseAPI } from "../../services/courseService";

const DeleteCourseModal = ({ isOpen, onClose, course, onCourseDeleted }) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        if (!course) return;

        setLoading(true);
        try {
            await courseAPI.deleteCourse(course.courseId);

            toast({
                title: "Xóa thành công!",
                description: `Khóa học "${course.title}" đã được xóa.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            if (onCourseDeleted) {
                onCourseDeleted(course.courseId);
            }

            onClose();
        } catch (error) {
            console.error("Delete course error:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Không thể xóa khóa học",
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
                <ModalHeader color="red.500">Xóa khóa học</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="center" py={4}>
                        <Icon as={WarningTwoIcon} w={16} h={16} color="red.500" />

                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                            Bạn có chắc chắn muốn xóa?
                        </Text>

                        <Text textAlign="center" color="gray.600">
                            Khóa học <strong>"{course?.title}"</strong> sẽ bị xóa vĩnh viễn.
                        </Text>

                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                Hành động này không thể hoàn tác. Tất cả modules, lessons, quizzes và dữ liệu liên quan sẽ bị xóa.
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
                        Xóa khóa học
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteCourseModal;