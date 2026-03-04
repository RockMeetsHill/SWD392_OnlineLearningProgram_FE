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
  Text,
  HStack,
  VStack,
  Badge,
  Avatar,
  Divider,
  Icon,
} from "@chakra-ui/react";
import {
  EmailIcon,
  PhoneIcon,
  CalendarIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  FaBook,
  FaGraduationCap,
  FaUser,
} from "react-icons/fa";

const InfoRow = ({ icon, label, value }) => (
  <HStack spacing={4} w="100%" py={2}>
    <HStack spacing={2} minW="140px" color="gray.500">
      {icon}
      <Text fontSize="sm" fontWeight="medium">
        {label}
      </Text>
    </HStack>
    <Text fontSize="sm" color="gray.800" fontWeight="medium">
      {value || "—"}
    </Text>
  </HStack>
);

function InstructorInfoModal({ isOpen, onClose, instructor }) {
  if (!instructor) return null;

  const statusColor = instructor.isActive
    ? { bg: "green.100", color: "green.800", label: "Active" }
    : { bg: "red.100", color: "red.800", label: "Inactive" };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={0}>Instructor Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          {/* Profile Header */}
          <VStack spacing={3} mb={6}>
            <Avatar
              size="xl"
              name={instructor.name}
              src={instructor.avatar}
              bg="blue.100"
              color="blue.700"
              fontWeight="bold"
            />
            <VStack spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                {instructor.name}
              </Text>
              <HStack spacing={2}>
                <Badge
                  px={2.5}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  bg={statusColor.bg}
                  color={statusColor.color}
                >
                  {statusColor.label}
                </Badge>
                <Badge
                  px={2.5}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  bg="purple.100"
                  color="purple.800"
                >
                  Instructor
                </Badge>
              </HStack>
            </VStack>
          </VStack>

          <Divider mb={4} />

          {/* Info Details */}
          <VStack spacing={0} align="stretch">
            <InfoRow
              icon={<Icon as={FaUser} boxSize={4} />}
              label="Full Name"
              value={instructor.name}
            />
            <InfoRow
              icon={<EmailIcon boxSize={4} />}
              label="Email"
              value={instructor.email}
            />
            <InfoRow
              icon={<PhoneIcon boxSize={4} />}
              label="Phone"
              value={instructor.phoneNumber}
            />
            <InfoRow
              icon={<Icon as={FaGraduationCap} boxSize={4} />}
              label="Level"
              value={
                instructor.currentLevel ? (
                  <Badge
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    fontSize="xs"
                    bg="orange.100"
                    color="orange.800"
                  >
                    {instructor.currentLevel}
                  </Badge>
                ) : null
              }
            />
            <InfoRow
              icon={<Icon as={FaBook} boxSize={4} />}
              label="Courses"
              value={
                <Badge
                  px={2}
                  py={0.5}
                  borderRadius="md"
                  fontSize="xs"
                  bg="blue.50"
                  color="blue.700"
                >
                  {instructor.coursesCount} courses
                </Badge>
              }
            />
            <InfoRow
              icon={<CalendarIcon boxSize={4} />}
              label="Created At"
              value={
                instructor.createdAt
                  ? new Date(instructor.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : null
              }
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="#FDE80B"
            color="gray.800"
            _hover={{ bg: "#e6d30a" }}
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default InstructorInfoModal;