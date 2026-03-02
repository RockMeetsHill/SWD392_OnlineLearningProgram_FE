import { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    VStack,
    HStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    useColorModeValue,
    useToast,
    Spinner,
    IconButton,
    Link,
    Box,
} from "@chakra-ui/react";
import { lessonResourceAPI } from "../../services/lessonResourceService";
import { DeleteIcon, CloudUploadIcon, BookIcon } from "./Icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");

const LessonResourcesModal = ({ isOpen, onClose, lessonId, lessonTitle, onSuccess }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const toast = useToast();

    const fetchResources = async () => {
        if (!lessonId) return;
        setLoading(true);
        try {
            const list = await lessonResourceAPI.listByLesson(lessonId);
            setResources(Array.isArray(list) ? list : []);
        } catch (err) {
            toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && lessonId) fetchResources();
    }, [isOpen, lessonId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!file || !lessonId) {
            toast({ title: "Chọn file", description: "Vui lòng chọn file tài liệu.", status: "warning", duration: 3000 });
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (title.trim()) formData.append("title", title.trim());
            await lessonResourceAPI.create(lessonId, formData);
            setTitle("");
            setFile(null);
            await fetchResources();
            toast({ title: "Đã thêm tài liệu", status: "success", duration: 3000 });
            if (onSuccess) onSuccess();
        } catch (err) {
            toast({ title: "Lỗi", description: err.message, status: "error", duration: 3000 });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (resourceId) => {
        try {
            await lessonResourceAPI.delete(resourceId);
            setResources((prev) => prev.filter((r) => r.resourceId !== resourceId));
            toast({ title: "Đã xóa tài liệu", status: "success", duration: 3000 });
            if (onSuccess) onSuccess();
        } catch (err) {
            toast({ title: "Lỗi", description: err.message, status: "error", duration: 3000 });
        }
    };

    const handleClose = () => {
        setTitle("");
        setFile(null);
        setResources([]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader color={textColor}>
                    Tài liệu {lessonTitle ? `– ${lessonTitle}` : ""}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack align="stretch" spacing={4}>
                        <Box
                            as="form"
                            onSubmit={handleAdd}
                            p={4}
                            borderRadius="lg"
                            border="1px"
                            borderColor={useColorModeValue("gray.200", "gray.600")}
                            bg={useColorModeValue("gray.50", "gray.900")}
                        >
                            <Text fontWeight="semibold" color={textColor} mb={3}>
                                Thêm tài liệu
                            </Text>
                            <FormControl mb={3}>
                                <FormLabel fontSize="sm">Tiêu đề (tùy chọn)</FormLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Tên tài liệu"
                                    size="sm"
                                />
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel fontSize="sm">File</FormLabel>
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    size="sm"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                size="sm"
                                leftIcon={<CloudUploadIcon boxSize={4} />}
                                bg={PRIMARY_COLOR}
                                color="#0A1926"
                                isLoading={uploading}
                            >
                                Tải lên
                            </Button>
                        </Box>

                        <Text fontWeight="semibold" color={textColor}>
                            Danh sách tài liệu
                        </Text>
                        {loading ? (
                            <HStack justify="center" py={4}>
                                <Spinner size="sm" color={PRIMARY_COLOR} />
                            </HStack>
                        ) : resources.length === 0 ? (
                            <Text color={mutedColor} fontSize="sm">
                                Chưa có tài liệu. Thêm file ở trên.
                            </Text>
                        ) : (
                            <VStack align="stretch" spacing={2}>
                                {resources.map((r) => (
                                    <HStack
                                        key={r.resourceId}
                                        justify="space-between"
                                        p={2}
                                        borderRadius="md"
                                        bg={useColorModeValue("white", "gray.700")}
                                        border="1px"
                                        borderColor={useColorModeValue("gray.200", "gray.600")}
                                    >
                                        <HStack spacing={2} flex={1} minW={0}>
                                            <BookIcon boxSize={4} color={PRIMARY_COLOR} />
                                            <Link
                                                href={r.fileUrl.startsWith("http") ? r.fileUrl : `${API_BASE}${r.fileUrl}`}
                                                isExternal
                                                fontSize="sm"
                                                color={PRIMARY_COLOR}
                                                noOfLines={1}
                                            >
                                                {r.title || "Tài liệu"}
                                            </Link>
                                        </HStack>
                                        <IconButton
                                            aria-label="Xóa"
                                            icon={<DeleteIcon boxSize={4} />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => handleDelete(r.resourceId)}
                                        />
                                    </HStack>
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default LessonResourcesModal;
