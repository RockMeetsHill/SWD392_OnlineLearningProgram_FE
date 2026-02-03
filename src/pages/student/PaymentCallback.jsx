import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    VStack,
    Heading,
    Text,
    Button,
    Spinner,
    Center,
    Icon,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useAuth } from "../../context/AuthContext";

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [status, setStatus] = useState("processing"); // processing, success, failed, error
    const [message, setMessage] = useState("");
    const [courseId, setCourseId] = useState(null);

    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.600", "gray.400");

    useEffect(() => {
        const payment = searchParams.get("payment");
        const course = searchParams.get("courseId");
        const errorMsg = searchParams.get("error");
        const txnRef = searchParams.get("txnRef");

        setCourseId(course);

        // Xử lý kết quả thanh toán từ VNPay callback
        if (payment === "success") {
            setStatus("success");
            setMessage("Payment completed successfully! Your course has been activated.");

            // Redirect to success page after 2 seconds
            setTimeout(() => {
                navigate("/student/payment/success", {
                    state: {
                        courseId: course,
                        txnRef: txnRef,
                    },
                });
            }, 2000);
        } else if (payment === "failed") {
            setStatus("failed");
            setMessage(errorMsg || "Payment was not successful. Please try again.");
        } else if (payment === "error") {
            setStatus("error");
            setMessage("An error occurred while processing your payment.");
        } else {
            setStatus("error");
            setMessage("Invalid payment callback.");
        }
    }, [searchParams, navigate]);

    const handleRetry = () => {
        if (courseId) {
            navigate(`/student/payment?courseId=${courseId}`);
        } else {
            navigate("/courses");
        }
    };

    const handleGoToCourses = () => {
        navigate("/student/courses");
    };

    const handleBrowseCourses = () => {
        navigate("/courses");
    };

    return (
        <Box minH="100vh" bg={bgColor}>
            <Container maxW="lg" py={20}>
                <VStack
                    spacing={8}
                    bg={cardBg}
                    p={10}
                    borderRadius="2xl"
                    shadow="xl"
                    textAlign="center"
                >
                    {/* Processing State */}
                    {status === "processing" && (
                        <>
                            <Spinner
                                size="xl"
                                color="primary.500"
                                thickness="4px"
                            />
                            <Heading size="lg" color={textColor}>
                                Processing Payment...
                            </Heading>
                            <Text color={mutedColor}>
                                Please wait while we verify your payment.
                            </Text>
                        </>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <>
                            <Box
                                w={24}
                                h={24}
                                bg="green.100"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <CheckCircleIcon
                                    boxSize={12}
                                    color="green.500"
                                />
                            </Box>
                            <Heading size="lg" color="green.500">
                                Payment Successful!
                            </Heading>
                            <Text color={mutedColor}>{message}</Text>
                            <Text fontSize="sm" color={mutedColor}>
                                Redirecting to your courses...
                            </Text>
                            <Spinner size="sm" color="green.500" />
                        </>
                    )}

                    {/* Failed State */}
                    {status === "failed" && (
                        <>
                            <Box
                                w={24}
                                h={24}
                                bg="orange.100"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <WarningIcon boxSize={12} color="orange.500" />
                            </Box>
                            <Heading size="lg" color="orange.500">
                                Payment Failed
                            </Heading>
                            <Alert status="warning" borderRadius="lg">
                                <AlertIcon />
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                            <VStack spacing={4} w="full">
                                <Button
                                    w="full"
                                    bg="primary.500"
                                    color="brand.dark"
                                    size="lg"
                                    fontWeight="bold"
                                    onClick={handleRetry}
                                    _hover={{ opacity: 0.9 }}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    w="full"
                                    variant="outline"
                                    size="lg"
                                    onClick={handleBrowseCourses}
                                >
                                    Browse Other Courses
                                </Button>
                            </VStack>
                        </>
                    )}

                    {/* Error State */}
                    {status === "error" && (
                        <>
                            <Box
                                w={24}
                                h={24}
                                bg="red.100"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon
                                    viewBox="0 0 24 24"
                                    boxSize={12}
                                    color="red.500"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                                    />
                                </Icon>
                            </Box>
                            <Heading size="lg" color="red.500">
                                Something Went Wrong
                            </Heading>
                            <Alert status="error" borderRadius="lg">
                                <AlertIcon />
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                            <VStack spacing={4} w="full">
                                <Button
                                    w="full"
                                    bg="primary.500"
                                    color="brand.dark"
                                    size="lg"
                                    fontWeight="bold"
                                    onClick={handleBrowseCourses}
                                    _hover={{ opacity: 0.9 }}
                                >
                                    Browse Courses
                                </Button>
                                <Button
                                    w="full"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate("/")}
                                >
                                    Go to Home
                                </Button>
                            </VStack>
                        </>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default PaymentCallback;