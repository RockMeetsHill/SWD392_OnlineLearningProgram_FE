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
    Textarea,
    Select,
    Text,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import { courseAPI } from "../../services/courseService";
import { COURSE_CATEGORY_OPTIONS, LEVEL_TARGET_OPTIONS, PRIMARY_COLOR } from "../../constants/instructor";

const CreateCourseModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Communication");
    const [levelTarget, setLevelTarget] = useState("A1");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const textColor = useColorModeValue("gray.900", "white");
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        try {
            setSaving(true);
            const payload = {
                title: title.trim(),
                description: description.trim() || undefined,
                price: price === "" ? 0 : Number(price),
                category,
                levelTarget,
            };
            await courseAPI.createCourse(payload);
            setTitle("");
            setDescription("");
            setPrice("");
            setCategory("Communication");
            setLevelTarget("A1");
            onClose();
            toast({
                title: "Success",
                description: "Course created successfully",
                status: "success",
                duration: 3000,
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || "Failed to create course");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setError("");
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("Communication");
        setLevelTarget("A1");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader color={textColor}>Create New Course</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <VStack spacing={4} align="stretch">
                            {error && (
                                <FormControl isInvalid>
                                    <Text color="red.500" fontSize="sm">
                                        {error}
                                    </Text>
                                </FormControl>
                            )}
                            <FormControl isRequired>
                                <FormLabel color={textColor}>Title</FormLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Course title"
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Description</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief description of the course"
                                    rows={4}
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Price (VND)</FormLabel>
                                <Input
                                    type="number"
                                    min={0}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0 for free"
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Category</FormLabel>
                                <Select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                >
                                    {COURSE_CATEGORY_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel color={textColor}>Level target</FormLabel>
                                <Select
                                    value={levelTarget}
                                    onChange={(e) => setLevelTarget(e.target.value)}
                                    bg={useColorModeValue("white", "gray.700")}
                                    borderColor={useColorModeValue("gray.200", "gray.600")}
                                >
                                    {LEVEL_TARGET_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </Select>
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
                            Create Course
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default CreateCourseModal;
