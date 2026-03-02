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
} from "@chakra-ui/react";
// Sửa import đúng
import { courseAPI } from "../../services/courseService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Load course data khi modal mở
    useEffect(() => {
        if (isOpen && course) {
            setFormData({
                title: course.title || "",
                description: course.description || "",
            });
            setErrors({});
        }
    }, [isOpen, course]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Tên khóa học không được để trống";
        } else if (formData.title.trim().length < 5) {
            newErrors.title = "Tên khóa học phải có ít nhất 5 ký tự";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Mô tả không được để trống";
        } else if (formData.description.trim().length < 5) {
            newErrors.description = "Mô tả phải có ít nhất 5 ký tự";
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

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Sử dụng courseAPI.updateCourse
            const updatedCourse = await courseAPI.updateCourse(course.courseId, {
                title: formData.title.trim(),
                description: formData.description.trim(),
            });

            toast({
                title: "Cập nhật thành công!",
                description: "Khóa học đã được cập nhật.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            if (onCourseUpdated) {
                onCourseUpdated(updatedCourse);
            }

            onClose();
        } catch (error) {
            console.error("Update course error:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Không thể cập nhật khóa học",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: "", description: "" });
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Chỉnh sửa khóa học</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired isInvalid={!!errors.title}>
                            <FormLabel>Tên khóa học</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Nhập tên khóa học"
                            />
                            {errors.title && (
                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.description}>
                            <FormLabel>Mô tả</FormLabel>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả khóa học"
                                rows={5}
                                resize="vertical"
                            />
                            {errors.description && (
                                <FormErrorMessage>{errors.description}</FormErrorMessage>
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
                        Lưu thay đổi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditCourseModal;