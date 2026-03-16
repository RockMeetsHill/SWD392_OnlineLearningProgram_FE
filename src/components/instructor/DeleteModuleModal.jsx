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
    Icon,
    useToast,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { courseAPI } from "../../services/courseService";

const DeleteModuleModal = ({ isOpen, onClose, courseId, module, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        if (!courseId || !module) return;

        setLoading(true);
        try {
            await courseAPI.deleteModule(courseId, module.moduleId ?? module.id);

            toast({
                title: "Deleted",
                description: `Module "${module.title}" has been deleted.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            toast({
                title: "Error",
                description: err.message || "Failed to delete module",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="red.500">Delete Module</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="center" py={4}>
                        <Icon as={WarningTwoIcon} w={16} h={16} color="red.500" />
                        <Text fontWeight="bold" fontSize="lg" textAlign="center">
                            Delete this module?
                        </Text>
                        <Text textAlign="center" color="gray.600">
                            Module <strong>"{module?.title}"</strong> and all its lessons will be permanently deleted.
                        </Text>
                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <Text fontSize="sm">
                                This action cannot be undone.
                            </Text>
                        </Alert>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} isLoading={loading}>
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteModuleModal;
