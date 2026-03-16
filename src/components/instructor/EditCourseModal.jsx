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
    Box,
    FormControl,
    FormLabel,
    Image,
    Input,
    Textarea,
    Select,
    VStack,
    useToast,
    FormErrorMessage,
} from "@chakra-ui/react";
import { courseAPI } from "../../services/courseService";
import { COURSE_CATEGORY_OPTIONS, LEVEL_TARGET_OPTIONS, PRIMARY_COLOR } from "../../constants/instructor";

const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Communication",
        levelTarget: "A1",
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    // Load course data khi modal mở
    useEffect(() => {
        if (isOpen && course) {
            setFormData({
                title: course.title || "",
                description: course.description || "",
                price: course.price || "",
                category: course.category || "Communication",
                levelTarget: course.levelTarget || "A1",
            });
            setThumbnailFile(null);
            setThumbnailPreview(null);
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

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setThumbnailFile(null);
            setThumbnailPreview(null);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            let updatedCourse = await courseAPI.updateCourse(course.courseId, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                price: formData.price === "" ? 0 : Number(formData.price),
                category: formData.category,
                levelTarget: formData.levelTarget,
            });

            if (thumbnailFile) {
                try {
                    updatedCourse = await courseAPI.uploadCourseThumbnail(course.courseId, thumbnailFile);
                } catch (uploadErr) {
                    toast({
                        title: "Cập nhật thành công, ảnh bìa lỗi",
                        description: uploadErr.message,
                        status: "warning",
                        duration: 4000,
                    });
                }
            }

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
        setFormData({ title: "", description: "", price: "", category: "Communication", levelTarget: "A1" });
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Course</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired isInvalid={!!errors.title}>
                            <FormLabel>Course Name</FormLabel>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter course name"
                            />
                            {errors.title && (
                                <FormErrorMessage>{errors.title}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl isRequired isInvalid={!!errors.description}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter course description"
                                rows={4}
                                resize="vertical"
                            />
                            {errors.description && (
                                <FormErrorMessage>{errors.description}</FormErrorMessage>
                            )}
                        </FormControl>

                        <FormControl>
                            <FormLabel>Price (VND)</FormLabel>
                            <Input
                                name="price"
                                type="number"
                                min={0}
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0 for free"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                {COURSE_CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Level</FormLabel>
                            <Select
                                name="levelTarget"
                                value={formData.levelTarget}
                                onChange={handleChange}
                            >
                                {LEVEL_TARGET_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Thumbnail</FormLabel>
                            {(course?.thumbnailUrl || thumbnailPreview) && (
                                <Box mb={2}>
                                    <Image
                                        src={thumbnailPreview || course.thumbnailUrl}
                                        alt="Thumbnail"
                                        maxH="120px"
                                        borderRadius="md"
                                    />
                                </Box>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                pt={1}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        onClick={handleSubmit}
                        isLoading={loading}
                        loadingText="Saving..."
                        _hover={{ opacity: 0.8 }}
                    >
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditCourseModal;