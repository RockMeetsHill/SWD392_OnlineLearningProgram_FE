import { useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "");

/* ── Icons ──────────────────────────────────────────────────── */
const PdfIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M9.5,11.5C9.5,10.67 8.83,10 8,10H5.5V14H6.5V12.5H8C8.83,12.5 9.5,11.83 9.5,11.5M6.5,11H8A0.5,0.5 0 0,1 8.5,11.5A0.5,0.5 0 0,1 8,12H6.5V11M14,10H11.5V14H14A2,2 0 0,0 16,12A2,2 0 0,0 14,10M14,13H12.5V11H14A1,1 0 0,1 15,12A1,1 0 0,1 14,13M20,11V10H17V14H18V12.5H19.5V11.5H18V11H20Z"
    />
  </Icon>
);

const DocIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M9,13V19H7V13H9M15,15V19H13V15H15M12,11V19H10V11H12Z"
    />
  </Icon>
);

const FileIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
    />
  </Icon>
);

/* ── helpers ─────────────────────────────────────────────────── */
const buildUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
};

const getFileExtension = (url, fileType) => {
  if (fileType) {
    const ft = fileType.toLowerCase();
    if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ft)) {
      return ft;
    }
  }
  if (!url) return "";
  const match = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
  return match ? match[1].toLowerCase() : "";
};

const FILE_INFO = {
  pdf: { label: "PDF Document", color: "red.500", icon: PdfIcon },
  doc: { label: "Word Document", color: "blue.500", icon: DocIcon },
  docx: { label: "Word Document", color: "blue.500", icon: DocIcon },
  xls: { label: "Excel Spreadsheet", color: "green.500", icon: DocIcon },
  xlsx: { label: "Excel Spreadsheet", color: "green.500", icon: DocIcon },
  ppt: { label: "PowerPoint", color: "orange.500", icon: DocIcon },
  pptx: { label: "PowerPoint", color: "orange.500", icon: DocIcon },
  txt: { label: "Text File", color: "gray.500", icon: FileIcon },
};

const getFileInfo = (ext) =>
  FILE_INFO[ext] || { label: "File", color: "gray.500", icon: FileIcon };

/**
 * Returns the preview strategy for a given extension:
 *  - "native"        → render in <iframe> directly (browser-native: pdf, txt)
 *  - "office-viewer" → use Microsoft Office Online viewer (doc, docx, xls, xlsx, ppt, pptx)
 *  - "none"          → cannot preview, show download link
 */
const getPreviewStrategy = (ext) => {
  if (ext === "pdf" || ext === "txt") return "native";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext))
    return "office-viewer";
  return "none";
};

/**
 * Microsoft Office Online viewer URL.
 * Requires that `fileUrl` is publicly accessible.
 * Falls back to Google Docs viewer as alternative.
 */
const getOfficeViewerUrl = (fileUrl) =>
  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

const getGoogleViewerUrl = (fileUrl) =>
  `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

export default function FilePreviewModal({ isOpen, onClose, resource }) {
  const muted = useColorModeValue("gray.500", "gray.400");
  const border = useColorModeValue("gray.200", "gray.700");
  const infoBg = useColorModeValue("blue.50", "blue.900");

  const fileUrl = useMemo(
    () => buildUrl(resource?.fileUrl),
    [resource?.fileUrl],
  );

  const ext = useMemo(
    () => getFileExtension(resource?.fileUrl, resource?.fileType),
    [resource?.fileUrl, resource?.fileType],
  );

  const strategy = useMemo(() => getPreviewStrategy(ext), [ext]);
  const info = useMemo(() => getFileInfo(ext), [ext]);
  const IconComp = info.icon;

  /* ── build preview src ─────────────────────────────────────── */
  const previewSrc = useMemo(() => {
    if (!fileUrl) return "";
    if (strategy === "native") return fileUrl;
    if (strategy === "office-viewer") {
      // Office Online viewer needs a public URL
      // If localhost, fallback to Google Docs viewer
      if (
        fileUrl.includes("localhost") ||
        fileUrl.includes("127.0.0.1") ||
        fileUrl.startsWith("blob:")
      ) {
        return getGoogleViewerUrl(fileUrl);
      }
      return getOfficeViewerUrl(fileUrl);
    }
    return "";
  }, [fileUrl, strategy]);

  const canPreview = strategy !== "none" && !!previewSrc;

  /* ── local fallback for Office files on localhost ───────────── */
  const isLocalhost =
    fileUrl.includes("localhost") || fileUrl.includes("127.0.0.1");
  const isOfficeFile = strategy === "office-viewer";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent maxH="92vh" h="90vh">
        <ModalHeader>
          <HStack spacing={3}>
            <IconComp boxSize={6} color={info.color} />
            <Box>
              <Text fontSize="md">
                {resource?.title || "File Preview"}
              </Text>
              <Text fontSize="xs" color={muted} fontWeight="normal">
                {info.label}
                {ext ? ` (.${ext})` : ""}
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0} flex="1" overflow="hidden">
          {canPreview ? (
            <Box w="100%" h="100%" position="relative">
              {/* Localhost + Office file warning */}
              {isLocalhost && isOfficeFile && (
                <Box
                  p={3}
                  bg={infoBg}
                  borderBottomWidth="1px"
                  borderColor={border}
                >
                  <Text fontSize="xs" color="blue.600">
                    ⚠️ Office files on localhost may not preview correctly.
                    Online viewers require a publicly accessible URL. Use the
                    download button if the preview doesn't load.
                  </Text>
                </Box>
              )}

              <Box
                as="iframe"
                src={previewSrc}
                w="100%"
                h={isLocalhost && isOfficeFile ? "calc(100% - 52px)" : "100%"}
                border="none"
                title={resource?.title || "File Preview"}
              />
            </Box>
          ) : (
            /* ── Cannot preview fallback ───────────────────────── */
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              gap={4}
              p={8}
            >
              <IconComp boxSize={16} color={info.color} opacity={0.6} />
              <Text fontSize="lg" fontWeight="semibold" textAlign="center">
                Preview not available for this file type
              </Text>
              <Text fontSize="sm" color={muted} textAlign="center" maxW="400px">
                {ext
                  ? `Files with .${ext} extension cannot be previewed in the browser.`
                  : "This file type is not supported for preview."}
                {" "}Please download the file to view it.
              </Text>
              <Link href={fileUrl} isExternal>
                <Button colorScheme="blue" leftIcon={<ExternalLinkIcon />}>
                  Download File
                </Button>
              </Link>
            </Flex>
          )}
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={border}>
          <HStack spacing={3}>
            <Link href={fileUrl} isExternal _hover={{ textDecoration: "none" }}>
              <Button
                variant="outline"
                colorScheme="blue"
                size="sm"
                leftIcon={<ExternalLinkIcon />}
              >
                Download
              </Button>
            </Link>
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}