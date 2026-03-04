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
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { instructorAPI } from "../../services/admin/instructorManagementService";

const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"];

function UpdateInstructorModal({ isOpen, onClose, instructor, onUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    currentLevel: "A0",
  });
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (instructor) {
      setFormData({
        name: instructor.name || "",
        email: instructor.email || "",
        phoneNumber: instructor.phoneNumber || "",
        currentLevel: instructor.currentLevel || "A0",
      });
    }
  }, [instructor]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      const updated = await instructorAPI.updateInstructor(
        instructor.id,
        formData,
      );
      toast({
        title: "Instructor updated",
        description: `${formData.name}'s information has been updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onUpdated(updated);
      onClose();
    } catch (error) {
      toast({
        title: "Error updating instructor",
        description: error.message || "Failed to update instructor.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Instructor</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Level</FormLabel>
              <Select
                value={formData.currentLevel}
                onChange={(e) => handleChange("currentLevel", e.target.value)}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            bg="#FDE80B"
            color="gray.800"
            _hover={{ bg: "#e6d30a" }}
            onClick={handleSave}
            isLoading={isSaving}
            loadingText="Saving..."
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateInstructorModal;
