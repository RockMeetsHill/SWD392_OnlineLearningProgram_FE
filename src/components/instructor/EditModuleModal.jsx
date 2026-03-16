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
    Textarea,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { courseAPI } from "../../services/courseService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const EditModuleModal = ({ isOpen, onClose, courseId, module, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const textColor = useColorModeValue("gray.900", "white");
    const toast = useToast();

    useEffect(() => {
        if (module) {
            setTitle(module.title || "");
            setDescription(module.description || "");
        }
    }, [module]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!title.trim()) {
            setError("Module title is required");
            return;
        }
        if (!courseId || !module?.moduleId) {
            setError("Course or module is missing");
            return;
        }
        try {
            setSaving(true);
            await courseAPI.updateModule(courseId, module.moduleId, {
                title: title.trim(),
                description: description.trim() || null,
            });
            onClose();
            toast({
                title: "Success",
                description: "Module updated successfully",
                status: "success",
                duration: 3000,
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Failed to update module");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    if (!module) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader color={textColor}>Edit Module</ModalHeader>
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
                                <FormLabel color={textColor}>Module title</FormLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Week 1: Introduction"
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Description (optional)</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of this module"
                                    rows={3}
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
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
                            Save
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default EditModuleModal;
