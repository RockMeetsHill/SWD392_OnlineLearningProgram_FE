import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Icon,
    Badge,
    useColorModeValue,
    Divider,
    Image,
    Spinner,
    Center,
} from "@chakra-ui/react";
import {
    CheckCircleIcon,
    StarIcon,
    ArrowForwardIcon,
    ViewIcon,
} from "@chakra-ui/icons";
import { courseAPI } from "../../services/courseService";
import { paymentAPI } from "../../services/paymentService";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);

    // Get data from multiple sources (URL params, location state, localStorage)
    const courseIdFromParams = searchParams.get("courseId");
    const txnRefFromParams = searchParams.get("txnRef");
    const courseIdFromState = location.state?.courseId;
    const txnRefFromState = location.state?.txnRef;

    // Prioritize: URL params > location state > localStorage
    const courseId = courseIdFromParams || courseIdFromState;
    const txnRef = txnRefFromParams || txnRefFromState;

    // Color mode values
    const bgColor = useColorModeValue("brand.light", "brand.dark");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const courseItemBg = useColorModeValue("gray.50", "gray.900");
    const textColor = useColorModeValue("brand.dark", "white");
    const mutedColor = useColorModeValue("gray.600", "gray.400");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Try to get pending payment from localStorage
                let pendingPayment = null;
                try {
                    const pendingPaymentStr = localStorage.getItem('pendingPayment');
                    if (pendingPaymentStr) {
                        pendingPayment = JSON.parse(pendingPaymentStr);
                        // Check if it's recent (within 30 minutes)
                        const isRecent = pendingPayment.timestamp &&
                            (Date.now() - pendingPayment.timestamp) < 30 * 60 * 1000;
                        if (!isRecent) {
                            pendingPayment = null;
                            localStorage.removeItem('pendingPayment');
                        }
                    }
                } catch (e) {
                    console.error('Error parsing pending payment:', e);
                }

                // Determine which courseId to use
                const effectiveCourseId = courseId || pendingPayment?.courseId;

                if (effectiveCourseId) {
                    // Fetch course details
                    const courseData = await courseAPI.getCourseById(effectiveCourseId);
                    setCourse(courseData);

                    // Set payment data
                    setPaymentData({
                        orderId: pendingPayment?.orderId || null,
                        courseId: effectiveCourseId,
                        courseTitle: courseData?.title || pendingPayment?.courseTitle || 'Unknown Course',
                        amount: courseData?.price || pendingPayment?.amount || 0,
                        txnRef: txnRef || pendingPayment?.txnRef || null,
                        instructor: courseData?.instructor ? {
                            userId: courseData.instructor.userId,
                            fullName: courseData.instructor.fullName || courseData.instructor.name,
                            email: courseData.instructor.email,
                        } : null,
                    });

                    // Clear pending payment from localStorage after successful fetch
                    localStorage.removeItem('pendingPayment');
                    localStorage.removeItem('paymentResult');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, txnRef]);

    const formatPrice = (price) => {
        if (!price || price === 0) return "Free";
        return new Intl.NumberFormat("vi-VN", {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleStartLearning = () => {
        const effectiveCourseId = paymentData?.courseId || courseId;
        if (effectiveCourseId) {
            navigate(`/student/courses/${effectiveCourseId}/learn`);
        } else {
            navigate("/student/courses");
        }
    };

    if (loading) {
        return (
            <Box bg={bgColor} minH="100vh">
                <Center py={20}>
                    <VStack spacing={4}>
                        <Spinner size="xl" color="primary.500" thickness="4px" />
                        <Text color={mutedColor}>Loading your course...</Text>
                    </VStack>
                </Center>
            </Box>
        );
    }

    return (
        <Box bg={bgColor} minH="100vh" position="relative" overflow="hidden">
            {/* Background Pattern */}
            <Box
                position="fixed"
                inset="0"
                pointerEvents="none"
                opacity="0.1"
                bgImage="radial-gradient(#fde90d 0.5px, transparent 0.5px)"
                bgSize="20px 20px"
            />

            {/* Main Content */}
            <Container maxW="800px" py={12} px={4} position="relative">
                <VStack spacing={12} align="stretch">
                    {/* Success Hero */}
                    <VStack spacing={6} textAlign="center">
                        <Flex
                            w={24}
                            h={24}
                            bg={useColorModeValue("brand.dark", "primary.500")}
                            rounded="full"
                            align="center"
                            justify="center"
                            shadow="xl"
                            animation="pulse 2s infinite"
                        >
                            <CheckCircleIcon
                                boxSize={12}
                                color={useColorModeValue("primary.500", "brand.dark")}
                            />
                        </Flex>

                        <Badge
                            bg="brand.dark"
                            color="primary.500"
                            px={4}
                            py={1}
                            rounded="full"
                            fontSize="xs"
                            fontWeight="bold"
                            textTransform="uppercase"
                            letterSpacing="widest"
                        >
                            Payment Successful!
                        </Badge>

                        <Heading
                            size="2xl"
                            color={textColor}
                            fontWeight="extrabold"
                            letterSpacing="tight"
                        >
                            Your learning journey starts now!
                        </Heading>

                        <Text fontSize="lg" color={mutedColor} maxW="500px">
                            We've received your payment. Your course has been activated
                            and is ready for you to explore.
                        </Text>

                        {(paymentData?.txnRef || txnRef) && (
                            <Text fontSize="sm" color={mutedColor}>
                                Transaction ID: <strong>{paymentData?.txnRef || txnRef}</strong>
                            </Text>
                        )}
                    </VStack>

                    {/* Activated Course Section */}
                    <Box
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        rounded="xl"
                        p={8}
                        shadow="sm"
                    >
                        <HStack
                            spacing={2}
                            mb={6}
                            pb={4}
                            borderBottom="1px"
                            borderColor={borderColor}
                        >
                            <StarIcon color="primary.500" />
                            <Heading size="md" color={textColor}>
                                Activated Course
                            </Heading>
                        </HStack>

                        {course ? (
                            <Flex
                                align="center"
                                justify="space-between"
                                p={4}
                                bg={courseItemBg}
                                rounded="lg"
                                border="1px"
                                borderColor={borderColor}
                                direction={{ base: "column", md: "row" }}
                                gap={4}
                            >
                                <HStack spacing={4} flex={1}>
                                    <Image
                                        src={
                                            course.image ||
                                            course.thumbnail ||
                                            "https://via.placeholder.com/80"
                                        }
                                        alt={course.title}
                                        boxSize="80px"
                                        objectFit="cover"
                                        borderRadius="lg"
                                    />
                                    <VStack align="start" spacing={1}>
                                        <Heading size="sm" color={textColor}>
                                            {course.title || course.name || paymentData?.courseTitle}
                                        </Heading>
                                        {(paymentData?.instructor || course?.instructor) && (
                                            <Text fontSize="sm" color={mutedColor}>
                                                By{" "}
                                                {paymentData?.instructor?.fullName ||
                                                    course?.instructor?.fullName ||
                                                    course?.instructor?.name ||
                                                    "Unknown Instructor"}
                                            </Text>
                                        )}
                                        <HStack
                                            spacing={1}
                                            color="green.500"
                                            fontSize="xs"
                                            fontWeight="semibold"
                                        >
                                            <CheckCircleIcon boxSize={3} />
                                            <Text>ACTIVATED</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>

                                <Button
                                    bg="primary.500"
                                    color="brand.dark"
                                    fontWeight="bold"
                                    px={6}
                                    rounded="full"
                                    _hover={{ bg: "primary.400" }}
                                    _active={{ transform: "scale(0.95)" }}
                                    rightIcon={<ArrowForwardIcon />}
                                    onClick={handleStartLearning}
                                >
                                    Start Learning
                                </Button>
                            </Flex>
                        ) : (
                            <Flex
                                align="center"
                                justify="space-between"
                                p={4}
                                bg={courseItemBg}
                                rounded="lg"
                                border="1px"
                                borderColor={borderColor}
                            >
                                <VStack align="start" spacing={1}>
                                    <Heading size="sm" color={textColor}>
                                        {paymentData?.courseTitle || "Your Course"}
                                    </Heading>
                                    <HStack
                                        spacing={1}
                                        color="green.500"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        <CheckCircleIcon boxSize={3} />
                                        <Text>ACTIVATED</Text>
                                    </HStack>
                                </VStack>

                                <Button
                                    bg="primary.500"
                                    color="brand.dark"
                                    fontWeight="bold"
                                    px={6}
                                    rounded="full"
                                    _hover={{ bg: "primary.400" }}
                                    rightIcon={<ArrowForwardIcon />}
                                    onClick={() => navigate("/student/courses")}
                                >
                                    View My Courses
                                </Button>
                            </Flex>
                        )}
                    </Box>

                    {/* Order Summary */}
                    {(course || paymentData) && (
                        <Box
                            bg={cardBg}
                            border="1px"
                            borderColor={borderColor}
                            rounded="xl"
                            p={8}
                            shadow="sm"
                        >
                            <Heading size="md" color={textColor} mb={4}>
                                Order Summary
                            </Heading>
                            <Divider mb={4} />
                            <VStack spacing={3} align="stretch">
                                <HStack justify="space-between">
                                    <Text color={mutedColor}>Course:</Text>
                                    <Text color={textColor} fontWeight="medium">
                                        {course?.title || course?.name || paymentData?.courseTitle}
                                    </Text>
                                </HStack>
                                {(paymentData?.instructor || course?.instructor) && (
                                    <HStack justify="space-between">
                                        <Text color={mutedColor}>Instructor:</Text>
                                        <Text color={textColor} fontWeight="medium">
                                            {paymentData?.instructor?.fullName ||
                                                course?.instructor?.fullName ||
                                                course?.instructor?.name ||
                                                "Unknown Instructor"}
                                        </Text>
                                    </HStack>
                                )}
                                <HStack justify="space-between">
                                    <Text color={mutedColor}>Amount Paid:</Text>
                                    <Text
                                        color="green.500"
                                        fontWeight="bold"
                                        fontSize="lg"
                                    >
                                        {formatPrice(paymentData?.amount || course?.price)}
                                    </Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text color={mutedColor}>Payment Method:</Text>
                                    <HStack>
                                        <Image
                                            src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                                            alt="VNPay"
                                            h="20px"
                                        />
                                        <Text color={textColor}>VNPay</Text>
                                    </HStack>
                                </HStack>
                                {paymentData?.orderId && (
                                    <HStack justify="space-between">
                                        <Text color={mutedColor}>Order ID:</Text>
                                        <Text color={textColor} fontWeight="medium">
                                            #{paymentData.orderId}
                                        </Text>
                                    </HStack>
                                )}
                                <HStack justify="space-between">
                                    <Text color={mutedColor}>Status:</Text>
                                    <Badge colorScheme="green">Completed</Badge>
                                </HStack>
                            </VStack>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        gap={4}
                        justify="center"
                    >
                        <Button
                            flex={1}
                            bg="primary.500"
                            color="brand.dark"
                            size="lg"
                            fontWeight="bold"
                            rounded="full"
                            shadow="lg"
                            boxShadow="0 0 20px rgba(253, 232, 13, 0.2)"
                            _hover={{ transform: "scale(1.02)" }}
                            transition="all 0.2s"
                            leftIcon={
                                <Icon viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18M12,3L1,9L12,15L21,10.09V17H23V9L12,3Z"
                                    />
                                </Icon>
                            }
                            onClick={() => navigate("/student/courses")}
                        >
                            Go to My Learning
                        </Button>

                        <Button
                            flex={1}
                            variant="outline"
                            borderWidth={2}
                            borderColor={useColorModeValue(
                                "brand.dark",
                                "primary.500"
                            )}
                            color={useColorModeValue("brand.dark", "primary.500")}
                            size="lg"
                            fontWeight="bold"
                            rounded="full"
                            _hover={{
                                bg: useColorModeValue("brand.dark", "primary.500"),
                                color: useColorModeValue("white", "brand.dark"),
                            }}
                            transition="all 0.2s"
                            leftIcon={<ViewIcon />}
                            onClick={() => navigate("/courses")}
                        >
                            Browse More Courses
                        </Button>
                    </Flex>
                </VStack>
            </Container>

            {/* Footer */}
            <Box
                py={10}
                borderTop="1px"
                borderColor={borderColor}
                textAlign="center"
            >
                <Text fontSize="sm" color={mutedColor}>
                    © BeeEnglish Learning Platform. All rights reserved.
                </Text>
            </Box>
        </Box>
    );
};

export default PaymentSuccess;