import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  Divider,
  VStack,
} from "@chakra-ui/react";

const PRESET_REASONS = [
  "Inappropriate language or content",
  "Misleading course description",
  "Plagiarized or copied content",
  "Low quality materials",
  "Outdated or inaccurate information",
  "Violates community guidelines",
];

/**
 * FlagContentConfirmModal
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {string}   reason
 * @param {Function} onReasonChange  (e) => void
 * @param {Function} onConfirm
 * @param {boolean}  isLoading
 */
export default function FlagContentConfirmModal({
  isOpen,
  onClose,
  reason,
  onReasonChange,
  onConfirm,
  isLoading = false,
}) {
  const handlePresetClick = (preset) => {
    const syntheticEvent = {
      target: {
        value: reason
          ? reason.includes(preset)
            ? reason
                .replace(`, ${preset}`, "")
                .replace(`${preset}, `, "")
                .replace(preset, "")
                .trim()
            : `${reason}, ${preset}`
          : preset,
      },
    };
    onReasonChange(syntheticEvent);
  };

  const isSelected = (preset) => reason?.includes(preset);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Flag with inappropriate content</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text>
              State the reason for flagging (optional). Flagged courses will not
              appear on the public list.
            </Text>

            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                Quick select reasons:
              </Text>
              <Wrap spacing={2}>
                {PRESET_REASONS.map((preset) => (
                  <WrapItem key={preset}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant={isSelected(preset) ? "solid" : "outline"}
                      colorScheme={isSelected(preset) ? "red" : "gray"}
                      cursor="pointer"
                      onClick={() => handlePresetClick(preset)}
                      _hover={{
                        colorScheme: "red",
                        opacity: 0.8,
                      }}
                      transition="all 0.15s"
                    >
                      <TagLabel>{preset}</TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>

            <Divider />

            <VStack align="stretch" spacing={2}>
              <Text fontSize="sm" fontWeight="semibold" color="gray.500">
                Or type a custom reason:
              </Text>
              <Textarea
                placeholder="Reason for flagging..."
                value={reason}
                onChange={onReasonChange}
                rows={4}
              />
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading}>
            Flag
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
