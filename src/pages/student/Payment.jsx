import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Image,
    Divider,
    Spinner,
    Center,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue,
    Icon,
    Flex,
    useToast,
    Badge,
    SimpleGrid,
} from "@chakra-ui/react";
import {
    CheckCircleIcon,
    LockIcon,
    ArrowBackIcon,
} from "@chakra-ui/icons";
import { courseAPI } from "../../services/courseService";
import { paymentAPI } from "../../services/paymentService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Custom Icons
const SecureIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
        />
    </Icon>
);

const PaymentIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"
        />
    </Icon>
);

const Payment = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();

    const courseId = searchParams.get("courseId");

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Color mode values
    const bgColor = useColorModeValue("brand.light", "brand.dark");
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("brand.dark", "white");
    const mutedColor = useColorModeValue("gray.600", "gray.400");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const sidebarBg = useColorModeValue("brand.dark", "gray.900");

    // Fetch course details
    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                setError("No course selected for payment");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await courseAPI.getCourseById(courseId);
                setCourse(data);
            } catch (err) {
                setError(err.message || "Failed to load course details");
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    // Handle payment creation
    const handlePayment = async () => {
        try {
            setProcessing(true);
            setError(null);

            const response = await paymentAPI.createPayment(courseId);

            if (response.paymentUrl) {
                toast({
                    title: "Redirecting to VNPay...",
                    description: "You will be redirected to complete your payment.",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                });

                // Redirect to VNPay payment gateway
                setTimeout(() => {
                    window.location.href = response.paymentUrl;
                }, 1000);
            } else {
                throw new Error("Payment URL not received");
            }
        } catch (err) {
            setProcessing(false);

            const errorMessage = err.message || "Failed to create payment";

            if (errorMessage.includes("Already enrolled") || errorMessage.includes("already enrolled")) {
                toast({
                    title: "Already Enrolled",
                    description: "You are already enrolled in this course.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/student/courses");
                return;
            }

            if (errorMessage.includes("free") || errorMessage.includes("Free")) {
                toast({
                    title: "Free Course",
                    description: "This course is free. Please enroll directly.",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
                navigate(`/courses/${courseId}`);
                return;
            }

            if (errorMessage.includes("own course")) {
                toast({
                    title: "Cannot Enroll",
                    description: "You cannot enroll in your own course.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                navigate(`/courses/${courseId}`);
                return;
            }

            toast({
                title: "Payment Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setError(errorMessage);
        }
    };

    // Format price
    const formatPrice = (price) => {
        if (!price || price === 0) return "Free";
        return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
    };

    // Loading state
    if (loading) {
        return (
            <Box minH="100vh" bg={bgColor}>
                <Navbar />
                <Center py={20}>
                    <VStack spacing={4}>
                        <Spinner size="xl" color="primary.500" thickness="4px" />
                        <Text color={mutedColor}>Loading payment details...</Text>
                    </VStack>
                </Center>
                <Footer />
            </Box>
        );
    }

    // Error state - no course
    if (error && !course) {
        return (
            <Box minH="100vh" bg={bgColor}>
                <Navbar />
                <Container maxW="4xl" py={20}>
                    <Alert
                        status="error"
                        variant="subtle"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        height="200px"
                        borderRadius="xl"
                    >
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Payment Error
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">{error}</AlertDescription>
                        <Button
                            mt={4}
                            leftIcon={<ArrowBackIcon />}
                            onClick={() => navigate("/courses")}
                        >
                            Browse Courses
                        </Button>
                    </Alert>
                </Container>
                <Footer />
            </Box>
        );
    }

    return (
        <Box minH="100vh" bg={bgColor}>
            <Navbar />

            <Container maxW="7xl" py={8} px={{ base: 4, md: 10 }}>
                {/* Breadcrumbs */}
                <HStack spacing={2} mb={6} fontSize="sm">
                    <Text
                        color={mutedColor}
                        cursor="pointer"
                        _hover={{ color: textColor }}
                        onClick={() => navigate("/")}
                    >
                        Learning Platform
                    </Text>
                    <Text color={mutedColor}>/</Text>
                    <Text
                        color={mutedColor}
                        cursor="pointer"
                        _hover={{ color: textColor }}
                        onClick={() => navigate(`/courses/${courseId}`)}
                    >
                        Course Details
                    </Text>
                    <Text color={mutedColor}>/</Text>
                    <Text color={textColor} fontWeight="bold">
                        Secure Checkout
                    </Text>
                </HStack>

                {/* Page Header */}
                <VStack align="start" spacing={2} mb={8}>
                    <Heading
                        size="2xl"
                        color={textColor}
                        fontWeight="extrabold"
                        letterSpacing="tight"
                    >
                        Checkout
                    </Heading>
                    <Text color={mutedColor} fontSize="lg">
                        Review your order and proceed to secure payment with VNPay.
                    </Text>
                </VStack>

                <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={10}
                    align="flex-start"
                >
                    {/* Left Column: Payment Info */}
                    <VStack flex={1} spacing={8} align="stretch">
                        {/* Payment Method */}
                        <Box
                            bg={cardBg}
                            borderRadius="xl"
                            p={6}
                            border="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <HStack spacing={2} mb={6}>
                                <PaymentIcon boxSize={5} color={textColor} />
                                <Heading size="md" color={textColor}>
                                    Payment Method
                                </Heading>
                            </HStack>

                            {/* VNPay Option - Selected */}
                            <Box
                                border="2px"
                                borderColor="primary.500"
                                borderRadius="xl"
                                p={5}
                                bg={useColorModeValue("primary.50", "primary.900")}
                                position="relative"
                            >
                                <Badge
                                    position="absolute"
                                    top={-2}
                                    right={4}
                                    bg="primary.500"
                                    color="brand.dark"
                                    px={2}
                                    py={0.5}
                                    borderRadius="full"
                                    fontSize="xs"
                                    fontWeight="bold"
                                >
                                    RECOMMENDED
                                </Badge>
                                <HStack spacing={4}>
                                    <Image
                                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                                        alt="VNPay"
                                        h="50px"
                                        objectFit="contain"
                                    />
                                    <VStack align="start" spacing={0} flex={1}>
                                        <Text fontWeight="bold" color={textColor} fontSize="lg">
                                            VNPay Gateway
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Pay securely with ATM Card, Credit Card, or QR Code
                                        </Text>
                                    </VStack>
                                    <CheckCircleIcon color="primary.500" boxSize={6} />
                                </HStack>
                            </Box>

                            {/* Supported Payment Methods */}
                            <Box
                                mt={6}
                                p={4}
                                bg={useColorModeValue("gray.50", "gray.900")}
                                borderRadius="lg"
                                borderLeft="4px"
                                borderColor="primary.500"
                            >
                                <Text fontWeight="bold" color={textColor} mb={3}>
                                    Supported Payment Methods:
                                </Text>
                                <SimpleGrid columns={2} spacing={2}>
                                    <HStack>
                                        <CheckCircleIcon color="green.500" boxSize={3} />
                                        <Text fontSize="sm" color={mutedColor}>
                                            Vietnamese Banks (ATM)
                                        </Text>
                                    </HStack>
                                    <HStack>
                                        <CheckCircleIcon color="green.500" boxSize={3} />
                                        <Text fontSize="sm" color={mutedColor}>
                                            Visa / Mastercard / JCB
                                        </Text>
                                    </HStack>
                                    <HStack>
                                        <CheckCircleIcon color="green.500" boxSize={3} />
                                        <Text fontSize="sm" color={mutedColor}>
                                            VNPay QR Code
                                        </Text>
                                    </HStack>
                                    <HStack>
                                        <CheckCircleIcon color="green.500" boxSize={3} />
                                        <Text fontSize="sm" color={mutedColor}>
                                            E-Wallets
                                        </Text>
                                    </HStack>
                                </SimpleGrid>
                            </Box>

                            {/* Test Card Info */}
                            <Alert
                                status="info"
                                borderRadius="lg"
                                mt={6}
                                bg={useColorModeValue("blue.50", "blue.900")}
                            >
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize="sm">VNPay Sandbox Test Card</AlertTitle>
                                    <AlertDescription fontSize="xs">
                                        Bank: NCB | Card: 9704198526191432198 | Name: NGUYEN VAN A | Date: 07/15 | OTP: 123456
                                    </AlertDescription>
                                </Box>
                            </Alert>

                            {/* Security Info */}
                            <HStack
                                mt={6}
                                p={4}
                                bg={useColorModeValue("green.50", "green.900")}
                                borderRadius="lg"
                                spacing={3}
                            >
                                <SecureIcon color="green.500" boxSize={6} />
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="medium" fontSize="sm" color={textColor}>
                                        256-bit SSL Encrypted Secure Connection
                                    </Text>
                                    <Text fontSize="xs" color={mutedColor}>
                                        Your payment is processed securely by VNPay.
                                    </Text>
                                </VStack>
                            </HStack>
                        </Box>

                        {/* How It Works */}
                        <Box
                            bg={cardBg}
                            borderRadius="xl"
                            p={6}
                            border="1px"
                            borderColor={borderColor}
                            shadow="sm"
                        >
                            <Heading size="md" color={textColor} mb={4}>
                                How It Works
                            </Heading>
                            <VStack align="start" spacing={4}>
                                <HStack align="start" spacing={4}>
                                    <Box
                                        w={8}
                                        h={8}
                                        bg="primary.500"
                                        color="brand.dark"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        flexShrink={0}
                                    >
                                        1
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="semibold" color={textColor}>
                                            Click "Pay with VNPay"
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            You'll be redirected to VNPay's secure payment page
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack align="start" spacing={4}>
                                    <Box
                                        w={8}
                                        h={8}
                                        bg="primary.500"
                                        color="brand.dark"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        flexShrink={0}
                                    >
                                        2
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="semibold" color={textColor}>
                                            Choose your payment method
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Select your bank or card and complete the payment
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack align="start" spacing={4}>
                                    <Box
                                        w={8}
                                        h={8}
                                        bg="primary.500"
                                        color="brand.dark"
                                        borderRadius="full"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        fontWeight="bold"
                                        flexShrink={0}
                                    >
                                        3
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="semibold" color={textColor}>
                                            Start learning immediately
                                        </Text>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Your course will be activated instantly after payment
                                        </Text>
                                    </VStack>
                                </HStack>
                            </VStack>
                        </Box>
                    </VStack>

                    {/* Right Column: Order Summary */}
                    <Box w={{ base: "full", lg: "400px" }}>
                        <Box
                            position="sticky"
                            top={8}
                            bg={sidebarBg}
                            borderRadius="xl"
                            p={6}
                            shadow="xl"
                            color="white"
                        >
                            <Heading size="md" mb={6} pb={4} borderBottom="1px" borderColor="whiteAlpha.200">
                                Order Summary
                            </Heading>

                            {/* Course Item */}
                            <HStack spacing={4} mb={6}>
                                <Image
                                    src={course?.image || course?.thumbnail || "https://via.placeholder.com/80"}
                                    alt={course?.title || course?.name}
                                    boxSize="70px"
                                    objectFit="cover"
                                    borderRadius="lg"
                                    bg="whiteAlpha.100"
                                />
                                <VStack align="start" spacing={1} flex={1}>
                                    <Text fontWeight="bold" fontSize="sm" noOfLines={2}>
                                        {course?.title || course?.name}
                                    </Text>
                                    {course?.instructor && (
                                        <Text fontSize="xs" color="gray.400">
                                            By {course.instructor.fullName || course.instructor.name}
                                        </Text>
                                    )}
                                </VStack>
                            </HStack>

                            <Divider borderColor="whiteAlpha.200" mb={6} />

                            {/* What's Included */}
                            <VStack align="start" spacing={2} mb={6}>
                                <Text fontWeight="semibold" fontSize="sm">
                                    What's Included:
                                </Text>
                                <HStack fontSize="xs" color="gray.300">
                                    <CheckCircleIcon color="primary.500" boxSize={3} />
                                    <Text>Full lifetime access</Text>
                                </HStack>
                                <HStack fontSize="xs" color="gray.300">
                                    <CheckCircleIcon color="primary.500" boxSize={3} />
                                    <Text>Access on mobile and desktop</Text>
                                </HStack>
                                <HStack fontSize="xs" color="gray.300">
                                    <CheckCircleIcon color="primary.500" boxSize={3} />
                                    <Text>Certificate of completion</Text>
                                </HStack>
                            </VStack>

                            <Divider borderColor="whiteAlpha.200" mb={6} />

                            {/* Price Breakdown */}
                            <VStack spacing={3} mb={6}>
                                <HStack justify="space-between" w="full" fontSize="sm">
                                    <Text color="gray.400">Subtotal</Text>
                                    <Text>{formatPrice(course?.price)}</Text>
                                </HStack>
                                <HStack justify="space-between" w="full" fontSize="sm">
                                    <Text color="gray.400">Tax</Text>
                                    <Text>0 VNĐ</Text>
                                </HStack>
                                <Divider borderColor="whiteAlpha.300" />
                                <HStack justify="space-between" w="full">
                                    <Text fontWeight="bold" fontSize="lg">
                                        Total
                                    </Text>
                                    <Text
                                        fontWeight="extrabold"
                                        fontSize="2xl"
                                        color="primary.500"
                                    >
                                        {formatPrice(course?.price)}
                                    </Text>
                                </HStack>
                            </VStack>

                            {/* Error Display */}
                            {error && (
                                <Alert status="error" borderRadius="lg" mb={4} bg="red.900">
                                    <AlertIcon />
                                    <AlertDescription fontSize="sm">{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Pay Button */}
                            <Button
                                w="full"
                                size="lg"
                                bg="primary.500"
                                color="brand.dark"
                                fontWeight="extrabold"
                                fontSize="lg"
                                py={7}
                                borderRadius="xl"
                                leftIcon={<LockIcon />}
                                onClick={handlePayment}
                                isLoading={processing}
                                loadingText="Creating payment..."
                                _hover={{
                                    transform: "translateY(-2px)",
                                    shadow: "lg",
                                }}
                                _active={{
                                    transform: "translateY(0)",
                                }}
                                transition="all 0.2s"
                                boxShadow="0 4px 0 rgba(200, 180, 0, 1)"
                            >
                                Pay with VNPay
                            </Button>

                            <Text
                                fontSize="10px"
                                color="gray.500"
                                textAlign="center"
                                mt={4}
                                lineHeight="relaxed"
                            >
                                By completing this purchase, you agree to our{" "}
                                <Text as="span" textDecor="underline" cursor="pointer">
                                    Terms of Service
                                </Text>{" "}
                                and{" "}
                                <Text as="span" textDecor="underline" cursor="pointer">
                                    Privacy Policy
                                </Text>
                                .
                            </Text>

                            {/* Money Back Guarantee */}
                            <HStack
                                justify="center"
                                mt={6}
                                p={3}
                                bg="whiteAlpha.100"
                                borderRadius="lg"
                            >
                                <SecureIcon color="primary.500" boxSize={4} />
                                <Text fontSize="xs" color="gray.300" fontWeight="medium">
                                    30-Day Money-Back Guarantee
                                </Text>
                            </HStack>
                        </Box>
                    </Box>
                </Flex>
            </Container>

            <Footer />
        </Box>
    );
};

export default Payment;