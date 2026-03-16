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
    useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { DeleteIcon } from "./Icons";
const LessonSettingsModal = ({ isOpen, onClose, lesson, onEdit, onDelete }) => {
    const textColor = useColorModeValue("gray.900", "white");

    const handleEdit = () => {
        onClose();
        onEdit?.(lesson);
    };

    const handleDelete = () => {
        onClose();
        onDelete?.(lesson);
    };

    if (!lesson) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader color={textColor}>Lesson settings</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text color={textColor} fontSize="sm" mb={4}>
                        {lesson.title}
                    </Text>
                    <VStack spacing={2} align="stretch">
                        <Button
                            leftIcon={<EditIcon />}
                            variant="outline"
                            colorScheme="blue"
                            size="sm"
                            onClick={handleEdit}
                        >
                            Edit lesson
                        </Button>
                        <Button
                            leftIcon={<DeleteIcon boxSize={4} />}
                            variant="outline"
                            colorScheme="red"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Delete lesson
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LessonSettingsModal;
