import { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from "@chakra-ui/react";
import { lessonAPI } from "../../services/lessonService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const EditLessonModal = ({ isOpen, onClose, lesson, onLessonUpdated }) => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        orderIndex: 1,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Load lesson data khi modal mở
    useEffect(() => {
        if (isOpen && lesson) {
            setFormData({
                title: lesson.title || "",
                content: lesson.content || "",
                orderIndex: lesson.orderIndex || 1,
            });
            setErrors({});
        }
    }, [isOpen, lesson]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Tên bài học không được để trống";
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Tên bài học phải có ít nhất 3 ký tự";
        }

        if (formData.orderIndex < 1) {
            newErrors.orderIndex = "Thứ tự phải lớn hơn 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleOrderChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            orderIndex: parseInt(value) || 1,
        }));
        if (errors.orderIndex) {
            setErrors((prev) => ({
                ...prev,
                orderIndex: "",
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const updatedLesson = await lessonAPI.updateLesson(lesson.lessonId, {
                title: formData.title.trim(),
                content: formData.content.trim(),
                orderIndex: formData.orderIndex,
            });

            toast({
                title: "Cập nhật thành công!",
                description: "Bài học đã được cập nhật.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            if (onLessonUpdated) {
                onLessonUpdated(updatedLesson);
            }

            onClose();
        } catch (error) {
            console.error("Update lesson error:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Không thể cập nhật bài học",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: "", content: "", orderIndex: 1 });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Lesson</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired isInvalid={!!errors.title}>
                            <FormLabel>Lesson Name</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter lesson name"
                            />
                            {errors.title && (
                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl>
                            <FormLabel>Content</FormLabel>
                            <Textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Enter lesson content"
                                rows={5}
                                resize="vertical"
                            />
                        </FormControl>

                        <FormControl isInvalid={!!errors.orderIndex}>
                            <FormLabel>Thứ tự</FormLabel>
                            <NumberInput
                                value={formData.orderIndex}
                                onChange={handleOrderChange}
                                min={1}
                                max={100}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            {errors.orderIndex && (
                                <FormErrorMessage>{errors.orderIndex}</FormErrorMessage>
                            )}
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        onClick={handleSubmit}
                        isLoading={loading}
                        loadingText="Đang lưu..."
                        _hover={{ opacity: 0.8 }}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditLessonModal;