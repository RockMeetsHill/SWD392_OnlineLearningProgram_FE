import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/student/StudentSidebar";
import StudentNavbar from "../../components/student/StudentNavbar";
import { certificateAPI } from "../../services/certificateService";

const Certificates = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const bgColor = useColorModeValue("#f8f8f5", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("brand.dark", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    let cancelled = false;

    const fetchCertificates = async () => {
      try {
        setLoadingList(true);
        const data = await certificateAPI.getMyCertificates();
        if (cancelled) return;
        setCertificates(Array.isArray(data) ? data : []);

        const targetId = certificateId
          ? Number.parseInt(certificateId, 10)
          : data?.[0]?.id;

        if (targetId && targetId !== Number.parseInt(certificateId || "", 10)) {
          navigate(`/student/certificates/${targetId}`, { replace: !certificateId });
        }
      } catch (error) {
        if (!cancelled) {
          toast({
            title: "Unable to load certificates",
            description: error.message || "Please try again later.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingList(false);
        }
      }
    };

    fetchCertificates();

    return () => {
      cancelled = true;
    };
  }, [certificateId, navigate, toast]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";

    const fetchSelectedCertificate = async () => {
      if (!certificateId) {
        setSelectedCertificate(null);
        setPreviewUrl("");
        return;
      }

      try {
        setLoadingDetail(true);
        const detail = await certificateAPI.getCertificateById(certificateId);
        if (cancelled) return;
        setSelectedCertificate(detail);

        const blob = await certificateAPI.getCertificatePreviewBlob(certificateId);
        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (error) {
        if (!cancelled) {
          setSelectedCertificate(null);
          setPreviewUrl("");
          toast({
            title: "Unable to open certificate",
            description: error.message || "Please try again later.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    };

    fetchSelectedCertificate();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [certificateId, toast]);

  const selectedId = useMemo(
    () => (certificateId ? Number.parseInt(certificateId, 10) : null),
    [certificateId]
  );

  const handleDownload = async () => {
    if (!selectedCertificate?.id) return;

    try {
      setDownloading(true);
      const { blob, filename } = await certificateAPI.downloadCertificatePdf(
        selectedCertificate.id
      );
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast({
        title: "Download failed",
        description: error.message || "Please try again later.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Flex minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box flex={1}>
        <StudentNavbar />
        <Box px={8} py={6}>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="lg" color={textColor} mb={2}>
                My Certificates
              </Heading>
              <Text color={mutedColor}>
                View and download certificates earned from completed courses.
              </Text>
            </Box>

            {loadingList ? (
              <Flex justify="center" py={20}>
                <Spinner size="xl" color="primary.500" />
              </Flex>
            ) : certificates.length === 0 ? (
              <Card bg={cardBg} shadow="sm" rounded="xl">
                <CardBody>
                  <VStack py={10} spacing={3}>
                    <Text fontSize="4xl">🎓</Text>
                    <Text fontWeight="semibold" color={textColor}>
                      No certificates yet
                    </Text>
                    <Text color={mutedColor}>
                      Finish a course to unlock your first certificate.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <Flex gap={6} direction={{ base: "column", xl: "row" }}>
                <VStack w={{ base: "100%", xl: "360px" }} align="stretch" spacing={4}>
                  {certificates.map((certificate) => (
                    <Card
                      key={certificate.id}
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={certificate.id === selectedId ? "primary.500" : borderColor}
                      shadow="sm"
                      rounded="xl"
                      cursor="pointer"
                      onClick={() => navigate(`/student/certificates/${certificate.id}`)}
                    >
                      <CardBody>
                        <VStack align="stretch" spacing={2}>
                          <Text fontWeight="bold" color={textColor}>
                            {certificate.title}
                          </Text>
                          <Text fontSize="sm" color={mutedColor}>
                            Instructor: {certificate.instructor}
                          </Text>
                          <Text fontSize="sm" color={mutedColor}>
                            Completed: {new Date(certificate.issuedAt).toLocaleDateString()}
                          </Text>
                          <Text fontSize="sm" color={mutedColor}>
                            Grade: {certificate.grade}%
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>

                <Card flex={1} bg={cardBg} shadow="sm" rounded="xl">
                  <CardBody>
                    {loadingDetail || !selectedCertificate ? (
                      <Flex justify="center" align="center" minH="520px">
                        <Spinner size="lg" color="primary.500" />
                      </Flex>
                    ) : (
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between" flexWrap="wrap">
                          <Box>
                            <Heading size="md" color={textColor}>
                              {selectedCertificate.title}
                            </Heading>
                            <Text color={mutedColor}>
                              Serial: {selectedCertificate.serialNumber}
                            </Text>
                          </Box>

                          <Button
                            leftIcon={<DownloadIcon />}
                            colorScheme="blue"
                            onClick={handleDownload}
                            isLoading={downloading}
                          >
                            Download PDF
                          </Button>
                        </HStack>

                        <Box borderWidth="1px" borderColor={borderColor} rounded="lg" overflow="hidden">
                          {previewUrl ? (
                            <Box
                              as="iframe"
                              src={previewUrl}
                              title="Certificate Preview"
                              w="100%"
                              minH="780px"
                              border="0"
                            />
                          ) : (
                            <Flex justify="center" align="center" minH="400px">
                              <Spinner size="lg" color="primary.500" />
                            </Flex>
                          )}
                        </Box>
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </Flex>
            )}
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default Certificates;
