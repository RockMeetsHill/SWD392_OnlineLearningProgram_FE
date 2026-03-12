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
    VStack,
    Box,
    FormControl,
    FormLabel,
    Input,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { PRIMARY_COLOR } from "../../constants/instructor";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const UploadLessonVideoModal = ({ isOpen, onClose, lessonId, lessonTitle, existingVideoUrl, videoResourceId: propsVideoResourceId, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
    const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
    const [videoResourceId, setVideoResourceId] = useState(null);
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const textColor = useColorModeValue("gray.900", "white");
    const modalBg = useColorModeValue("white", "gray.800");
    const inputBg = useColorModeValue("white", "gray.700");
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            setCurrentVideoUrl(existingVideoUrl || null);
            setLocalPreviewUrl(null);
            setFile(null);
            setTitle("");
            setError("");
            setVideoResourceId(propsVideoResourceId || null);
            setShouldRefetch(false);
        }
    }, [isOpen, existingVideoUrl, propsVideoResourceId]);

    useEffect(() => {
        return () => {
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }
        };
    }, [localPreviewUrl]);

    const handleDeleteVideo = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa video này?")) {
            return;
        }

        setDeleting(true);
        setError("");
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/resources/${videoResourceId}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                credentials: "include",
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.error || "Không thể xóa video");
            }

            // Xóa blob URL nếu có
            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
                setLocalPreviewUrl(null);
            }

            // Clear video và quay lại mode upload
            setCurrentVideoUrl(null);
            setVideoResourceId(null);
            setFile(null);
            setTitle("");

            toast({
                title: "Thành công",
                description: "Video đã được xóa",
                status: "success",
                duration: 3000,
            });

            // Refetch data khi xóa thành công
            if (onSuccess) onSuccess();

        } catch (err) {
            const errorMessage = err?.message || "Xóa video thất bại";
            setError(errorMessage);
            toast({
                title: "Lỗi",
                description: errorMessage,
                status: "error",
                duration: 3000,
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!file) {
            setError("Vui lòng chọn file video");
            return;
        }
        if (!lessonId) {
            setError("Lesson không hợp lệ");
            return;
        }
        setUploading(true);
        let response;
        let data = {};
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("video", file);
            if (title.trim()) formData.append("title", title.trim());

            response = await fetch(`${API_URL}/videos/lesson/${lessonId}/upload`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                credentials: "include",
                body: formData,
            });

            if (response) {
                data = await response.json().catch(() => ({}));
            }
            if (!response) {
                throw new Error("Network error");
            }
            if (!response.ok) {
                throw new Error(data?.error || "Upload failed");
            }

            // Lấy resourceId từ response nếu có
            if (data?.resourceId) {
                setVideoResourceId(data.resourceId);
            }

            const blobUrl = URL.createObjectURL(file);

            if (localPreviewUrl) {
                URL.revokeObjectURL(localPreviewUrl);
            }

            setLocalPreviewUrl(blobUrl);
            setCurrentVideoUrl(null);

            toast({
                title: "Thành công",
                description: "Video đã được upload",
                status: "success",
                duration: 3000,
            });

            setTitle("");
            setFile(null);

            // Đánh dấu cần refetch khi modal đóng, không gọi ngay
            setShouldRefetch(true);

        } catch (err) {
            const errorMessage =
                err?.message ?? data?.error ?? (response ? "Upload failed" : "Network error");
            setError(errorMessage);
            toast({
                title: "Lỗi",
                description: errorMessage,
                status: "error",
                duration: 3000,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setTitle("");
        setFile(null);
        if (localPreviewUrl) {
            URL.revokeObjectURL(localPreviewUrl);
        }
        setLocalPreviewUrl(null);
        setCurrentVideoUrl(null);
        setVideoResourceId(null);

        // Gọi refetch khi modal đóng nếu có upload thành công
        if (shouldRefetch && onSuccess) {
            onSuccess();
        }

        onClose();
    };

    const displayVideoUrl = localPreviewUrl || currentVideoUrl;
    const hasVideo = !!displayVideoUrl;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent bg={modalBg}>
                <ModalHeader color={textColor}>
                    {hasVideo ? "Video bài học" : "Upload Video"} {lessonTitle ? `– ${lessonTitle}` : ""}
                </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            {hasVideo && (
                                <Box borderRadius="lg" overflow="hidden" bg="black">
                                    <video
                                        key={displayVideoUrl}
                                        src={displayVideoUrl}
                                        controls
                                        style={{ width: "100%", maxHeight: "400px" }}
                                    />
                                </Box>
                            )}

                            {error && (
                                <Text color="red.500" fontSize="sm">
                                    {error}
                                </Text>
                            )}

                            {!hasVideo && (
                                <>
                                    <FormControl>
                                        <FormLabel color={textColor}>Tiêu đề (tùy chọn)</FormLabel>
                                        <Input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Tiêu đề video"
                                            bg={inputBg}
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel color={textColor}>Chọn file video</FormLabel>
                                        <Input
                                            type="file"
                                            accept=".mp4,.avi,.mov,.wmv,.flv,.webm,video/*"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            bg={inputBg}
                                        />
                                    </FormControl>
                                </>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleClose}>
                            Đóng
                        </Button>

                        {hasVideo && (
                            <Button
                                colorScheme="red"
                                mr={3}
                                onClick={handleDeleteVideo}
                                isLoading={deleting}
                            >
                                Xóa Video
                            </Button>
                        )}

                        {!hasVideo && file && (
                            <Button
                                bg={PRIMARY_COLOR}
                                color="#0A1926"
                                fontWeight="bold"
                                type="submit"
                                isLoading={uploading}
                            >
                                Upload
                            </Button>
                        )}
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default UploadLessonVideoModal;