import { useState } from "react";
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
    Select,
    Text,
    Textarea,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { lessonAPI } from "../../services/lessonService";
import { LESSON_TYPE_OPTIONS, PRIMARY_COLOR } from "../../constants/instructor";

const AddLessonModal = ({ isOpen, onClose, moduleId, moduleTitle, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("video");
    const [contentText, setContentText] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const textColor = useColorModeValue("gray.900", "white");
    const modalContentBg = useColorModeValue("white", "gray.800");
    const inputBg = useColorModeValue("white", "gray.700");
    const inputBorderColor = useColorModeValue("gray.200", "gray.600");
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!title.trim()) {
            setError("Lesson title is required");
            return;
        }
        if (!moduleId) {
            setError("Module is missing");
            return;
        }
        try {
            setSaving(true);
            await lessonAPI.createLesson(moduleId, {
                title: title.trim(),
                type,
                orderIndex: 0,
                ...(contentText.trim() && { contentText: contentText.trim() }),
            });
            setTitle("");
            setType("video");
            setContentText("");
            onClose();
            toast({
                title: "Success",
                description: "Lesson added successfully",
                status: "success",
                duration: 3000,
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Failed to add lesson");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setError("");
        setTitle("");
        setType("video");
        setContentText("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg={modalContentBg}>
                <ModalHeader color={textColor}>
                    Add New Lesson {moduleTitle ? `to ${moduleTitle}` : ""}
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
                            <FormControl isRequired>
                                <FormLabel color={textColor}>Lesson title</FormLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Introduction to the topic"
                                    bg={inputBg}
                                    borderColor={inputBorderColor}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Type</FormLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    bg={inputBg}
                                    borderColor={inputBorderColor}
                                >
                                    {LESSON_TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Content / description (optional)</FormLabel>
                                <Textarea
                                    value={contentText}
                                    onChange={(e) => setContentText(e.target.value)}
                                    placeholder="Brief description or text content for this lesson"
                                    bg={inputBg}
                                    borderColor={inputBorderColor}
                                    rows={3}
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
                            isLoading={saving}
                        >
                            Add Lesson
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AddLessonModal;
