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
    FormControl,
    FormLabel,
    Input,
    Text,
    HStack,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { lessonResourceAPI } from "../../services/lessonResourceService";
import { videoAPI } from "../../services/videoService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

const UploadLessonVideoModal = ({ isOpen, onClose, lessonId, lessonTitle, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [existingVideo, setExistingVideo] = useState(null);
    const textColor = useColorModeValue("gray.900", "white");
    const modalBg = useColorModeValue("white", "gray.800");
    const inputBg = useColorModeValue("white", "gray.700");
    const existingVideoBg = useColorModeValue("gray.50", "gray.700");
    const toast = useToast();

    useEffect(() => {
        if (!isOpen || !lessonId) {
            setExistingVideo(null);
            return;
        }
        let cancelled = false;
        lessonResourceAPI.listByLesson(lessonId)
            .then((list) => {
                const arr = Array.isArray(list) ? list : [];
                const video = arr.find((r) => r.fileType === "video");
                if (!cancelled) setExistingVideo(video || null);
            })
            .catch(() => {
                if (!cancelled) setExistingVideo(null);
            });
        return () => { cancelled = true; };
    }, [isOpen, lessonId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!file) {
            setError("Please select a video file");
            return;
        }
        if (!lessonId) {
            setError("Lesson is missing");
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
            toast({
                title: "Success",
                description: "Video uploaded successfully",
                status: "success",
                duration: 3000,
            });
            setTitle("");
            setFile(null);
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            const errorMessage =
                err?.message ?? data?.error ?? (response ? "Upload failed" : "Network error");
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 3000,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteVideo = async () => {
        if (!existingVideo?.resourceId) return;
        setError("");
        setDeleting(true);
        try {
            await videoAPI.deleteVideo(existingVideo.resourceId);
            setExistingVideo(null);
            toast({ title: "Video deleted", status: "success", duration: 3000 });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Failed to delete video");
            toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
        } finally {
            setDeleting(false);
        }
    };

    const handleClose = () => {
        setError("");
        setTitle("");
        setFile(null);
        setExistingVideo(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg={modalBg}>
                <ModalHeader color={textColor}>
                    Upload Video {lessonTitle ? `– ${lessonTitle}` : ""}
                </ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            {error && (
                                <Text color="red.500" fontSize="sm">
                                    {error}
                                </Text>
                            )}
                            {existingVideo && (
                                <HStack
                                    justify="space-between"
                                    p={3}
                                    bg={existingVideoBg}
                                    borderRadius="md"
                                    borderWidth="1px"
                                >
                                    <Text color={textColor} fontSize="sm" noOfLines={1}>
                                        Current video: {existingVideo.title || "Video"}
                                    </Text>
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={handleDeleteVideo}
                                        isLoading={deleting}
                                    >
                                        Delete video
                                    </Button>
                                </HStack>
                            )}
                            <FormControl>
                                <FormLabel color={textColor}>Title (optional)</FormLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Video title"
                                    bg={inputBg}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color={textColor}>Video file</FormLabel>
                                <Input
                                    type="file"
                                    accept=".mp4,.avi,.mov,.wmv,.flv,.webm,video/*"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    bg={inputBg}
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
                            fontWeight="bold"
                            type="submit"
                            isLoading={uploading}
                            isDisabled={!file}
                        >
                            Upload
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default UploadLessonVideoModal;
