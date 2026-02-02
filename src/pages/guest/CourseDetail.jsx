import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  HStack,
  VStack,
  SimpleGrid,
  Icon,
  Divider,
  Avatar,
  Progress,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  AspectRatio,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { StarIcon, ChevronRightIcon, CheckCircleIcon } from "@chakra-ui/icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { courseAPI } from "../../services/courseService";
import { AuthContext } from "../../context/AuthContext";

// Custom Icons
const PlayIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M8 5v14l11-7z" />
  </Icon>
);

const GroupIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
    />
  </Icon>
);

const LanguageIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
    />
  </Icon>
);

const VideoIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
    />
  </Icon>
);

const DescriptionIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
    />
  </Icon>
);

const AllInclusiveIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"
    />
  </Icon>
);

const DevicesIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"
    />
  </Icon>
);

const CertificateIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M9.68 13.69L12 11.93l2.31 1.76-.88-2.85L15.75 9h-2.84L12 6.19 11.09 9H8.25l2.31 1.84-.88 2.85zM20 10c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.03.76 3.87 2 5.28V23l6-2 6 2v-7.72c1.24-1.41 2-3.25 2-5.28zm-8-6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z"
    />
  </Icon>
);

// Component hiển thị sao đánh giá
const StarRating = ({ rating, size = "sm" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const starSize = size === "sm" ? 3 : 4;

  return (
    <HStack spacing={0.5}>
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          boxSize={starSize}
          color={
            i < fullStars
              ? "orange.400"
              : i === fullStars && hasHalfStar
                ? "orange.400"
                : "gray.300"
          }
        />
      ))}
    </HStack>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  //Auth context
  const { user } = useContext(AuthContext);

  // State management
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.900", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightBg = useColorModeValue("yellow.50", "yellow.900");
  const highlightBorder = useColorModeValue("yellow.100", "yellow.800");

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseAPI.getCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err.message || "Failed to load course details");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Handle enrollment
  const handleEnroll = async () => {
    // Check if user is logged in
    if (!user) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    // If course is free, enroll directly
    if (course.price === 0 || course.price === "0" || !course.price) {
      try {
        await courseAPI.enrollInCourse(id);
        navigate("/student/courses");
      } catch (err) {
        console.error("Error enrolling in course:", err);
        alert(err.message || "Failed to enroll. Please try again.");
      }
      return;
    }

    // If course has a price, navigate to payment page
    navigate(`/student/payment?courseId=${id}`);
  };

  // Loading state
  if (loading) {
    return (
      <Box minH="100vh">
        <Navbar />
        <Center py={20}>
          <VStack spacing={4}>
            <Spinner size="xl" color="primary.500" thickness="4px" />
            <Text color={mutedColor}>Loading course details...</Text>
          </VStack>
        </Center>
        <Footer />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box minH="100vh">
        <Navbar />
        <Container maxW="7xl" py={20}>
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
              Failed to load course
            </AlertTitle>
            <AlertDescription maxWidth="sm">{error}</AlertDescription>
            <Button mt={4} onClick={() => navigate("/courses")}>
              Back to Courses
            </Button>
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  // No course found
  if (!course) {
    return (
      <Box minH="100vh">
        <Navbar />
        <Container maxW="7xl" py={20}>
          <Alert
            status="warning"
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
              Course not found
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              The course you're looking for doesn't exist.
            </AlertDescription>
            <Button mt={4} onClick={() => navigate("/courses")}>
              Browse Courses
            </Button>
          </Alert>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Calculate rating breakdown (if not provided by API)
  const ratingBreakdown = course.ratingBreakdown || {
    5: 70,
    4: 18,
    3: 8,
    2: 3,
    1: 1,
  };

  return (
    <Box minH="100vh">
      <Navbar />

      <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }} py={8}>
        {/* Breadcrumb */}
        <Breadcrumb
          spacing={2}
          separator={<ChevronRightIcon color="gray.500" />}
          fontSize="xs"
          color={mutedColor}
          mb={8}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/courses"
              onClick={(e) => {
                e.preventDefault();
                navigate("/courses");
              }}
            >
              Courses
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text
              color={textColor}
              fontWeight="medium"
              noOfLines={1}
              maxW="200px"
            >
              {course.title || course.name}
            </Text>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={12}>
          {/* Left Content */}
          <Box gridColumn={{ lg: "span 2" }}>
            <VStack spacing={10} align="stretch">
              {/* Hero Section */}
              <VStack spacing={6} align="start">
                <Heading
                  as="h1"
                  size="2xl"
                  color={textColor}
                  lineHeight="tight"
                >
                  {(course.title || course.name).includes(":") ? (
                    <>
                      {(course.title || course.name).split(":")[0]}:
                      <br />
                      <Box
                        as="span"
                        bg="primary.500"
                        color="brand.dark"
                        px={2}
                        display="inline"
                      >
                        {(course.title || course.name).split(":")[1] || ""}
                      </Box>
                    </>
                  ) : (
                    course.title || course.name
                  )}
                </Heading>

                <Text
                  fontSize="xl"
                  color={mutedColor}
                  maxW="2xl"
                  lineHeight="relaxed"
                >
                  {course.subtitle ||
                    course.description?.substring(0, 150) + "..."}
                </Text>

                {/* Meta Info */}
                <Flex wrap="wrap" gap={6} fontSize="sm">
                  {course.rating && (
                    <HStack>
                      <Text fontWeight="bold" color="orange.500">
                        {course.rating}
                      </Text>
                      <StarRating rating={course.rating} />
                      <Text color={mutedColor}>
                        (
                        {(
                          course.reviews ||
                          course.totalReviews ||
                          0
                        ).toLocaleString()}{" "}
                        reviews)
                      </Text>
                    </HStack>
                  )}
                  {course.students !== undefined && (
                    <HStack color={mutedColor}>
                      <GroupIcon boxSize={4} />
                      <Text>
                        {(
                          course.students ||
                          course.totalStudents ||
                          0
                        ).toLocaleString()}{" "}
                        students enrolled
                      </Text>
                    </HStack>
                  )}
                  {course.language && (
                    <HStack color={mutedColor}>
                      <LanguageIcon boxSize={4} />
                      <Text>{course.language}</Text>
                    </HStack>
                  )}
                </Flex>
              </VStack>

              {/* What You'll Learn */}
              {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                <Box
                  bg={highlightBg}
                  border="1px"
                  borderColor={highlightBorder}
                  p={8}
                  borderRadius="2xl"
                >
                  <Heading size="lg" mb={6} color={textColor}>
                    What you will learn
                  </Heading>
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacingX={12}
                    spacingY={4}
                  >
                    {course.whatYouLearn.map((item, index) => (
                      <HStack key={index} align="start" spacing={3}>
                        <CheckCircleIcon color="primary.500" mt={1} />
                        <Text fontSize="sm" color={mutedColor}>
                          {item}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              {/* Course Description */}
              {course.description && (
                <VStack spacing={4} align="start">
                  <Heading size="lg" color={textColor}>
                    Course Description
                  </Heading>
                  <Box color={mutedColor} lineHeight="tall">
                    {course.description
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <Text key={index} mb={4}>
                          {paragraph}
                        </Text>
                      ))}
                  </Box>
                </VStack>
              )}

              {/* Student Feedback */}
              {course.rating && (
                <VStack spacing={6} align="start">
                  <Heading size="lg" color={textColor}>
                    Student Feedback
                  </Heading>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    gap={12}
                    align="start"
                    w="full"
                  >
                    {/* Rating Summary */}
                    <Box
                      bg={cardBg}
                      p={8}
                      borderRadius="2xl"
                      textAlign="center"
                      minW="160px"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <Text
                        fontSize="5xl"
                        fontWeight="extrabold"
                        color={textColor}
                        mb={2}
                      >
                        {course.rating}
                      </Text>
                      <HStack justify="center" mb={2}>
                        <StarRating rating={course.rating} size="md" />
                      </HStack>
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        color={mutedColor}
                      >
                        Course Rating
                      </Text>
                    </Box>

                    {/* Rating Breakdown */}
                    <VStack flex={1} spacing={3} w="full">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <HStack key={star} w="full" spacing={4}>
                          <Progress
                            value={ratingBreakdown[star]}
                            flex={1}
                            h={3}
                            borderRadius="full"
                            bg={useColorModeValue("gray.100", "gray.700")}
                            sx={{
                              "& > div": {
                                bg: useColorModeValue(
                                  "gray.800",
                                  "primary.500",
                                ),
                              },
                            }}
                          />
                          <HStack w="100px" spacing={0.5}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                boxSize={3}
                                color={i < star ? "orange.400" : "gray.300"}
                              />
                            ))}
                          </HStack>
                          <Text fontSize="sm" fontWeight="semibold" w="40px">
                            {ratingBreakdown[star]}%
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Flex>
                </VStack>
              )}
            </VStack>
          </Box>

          {/* Sidebar */}
          <Box>
            <Box position="sticky" top="100px">
              {/* Course Card */}
              <Box
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="xl"
                overflow="hidden"
                border="1px"
                borderColor={borderColor}
              >
                {/* Video Preview */}
                <AspectRatio ratio={16 / 9}>
                  <Box position="relative" cursor="pointer" role="group">
                    <Image
                      src={
                        course.image ||
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"
                      }
                      alt={course.title || course.name}
                      objectFit="cover"
                      w="full"
                      h="full"
                      transition="transform 0.5s"
                      _groupHover={{ transform: "scale(1.05)" }}
                    />
                    <Flex
                      position="absolute"
                      inset={0}
                      bg="blackAlpha.500"
                      direction="column"
                      align="center"
                      justify="center"
                      gap={4}
                    >
                      <Flex
                        w={16}
                        h={16}
                        bg="white"
                        borderRadius="full"
                        align="center"
                        justify="center"
                        boxShadow="lg"
                        transition="transform 0.2s"
                        _groupHover={{ transform: "scale(1.1)" }}
                      >
                        <PlayIcon boxSize={8} color="gray.900" ml={1} />
                      </Flex>
                      <Text
                        color="white"
                        fontWeight="bold"
                        fontSize="lg"
                        textShadow="md"
                      >
                        Preview this course
                      </Text>
                    </Flex>
                  </Box>
                </AspectRatio>

                {/* Card Content */}
                <VStack p={6} spacing={6} align="stretch">
                  {/* Price */}
                  <HStack spacing={4}>
                    <Text
                      fontSize="3xl"
                      fontWeight="extrabold"
                      color={textColor}
                    >
                      {course.price === 0 || course.price === "0"
                        ? "Free"
                        : `${Number(course.price).toLocaleString("vi-VN")} VNĐ`}
                    </Text>
                    {course.originalPrice &&
                      course.originalPrice > course.price && (
                        <>
                          <Text
                            fontSize="lg"
                            color="gray.400"
                            textDecoration="line-through"
                          >
                            {Number(course.originalPrice).toLocaleString("vi-VN")} VNĐ
                          </Text>
                          <Badge
                            bg="primary.500"
                            color="brand.dark"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            {course.discount ||
                              Math.round(
                                (1 - course.price / course.originalPrice) * 100,
                              )}
                            % OFF
                          </Badge>
                        </>
                      )}
                  </HStack>

                  {/* Buttons */}
                  <VStack spacing={3}>
                    <Button
                      w="full"
                      bg="primary.500"
                      color="brand.dark"
                      fontWeight="bold"
                      py={6}
                      borderRadius="xl"
                      _hover={{ opacity: 0.9 }}
                      boxShadow="lg"
                      onClick={handleEnroll}
                    >
                      {course.price === 0 || course.price === "0"
                        ? "Enroll for Free"
                        : "Enroll Now"}
                    </Button>
                    {course.price > 0 && course.price !== "0" && (
                      <Button
                        w="full"
                        variant="outline"
                        borderWidth={2}
                        borderColor={borderColor}
                        fontWeight="bold"
                        py={6}
                        borderRadius="xl"
                        _hover={{
                          bg: useColorModeValue("gray.50", "gray.700"),
                        }}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </VStack>

                  <Divider borderColor={borderColor} />

                  {/* Course Includes */}
                  <VStack spacing={4} align="stretch">
                    <Text
                      fontSize="xs"
                      fontWeight="bold"
                      color="gray.500"
                      textTransform="uppercase"
                      letterSpacing="widest"
                    >
                      This course includes:
                    </Text>
                    <VStack spacing={3} align="stretch">
                      {course.duration && (
                        <HStack>
                          <VideoIcon color="gray.400" />
                          <Text fontSize="sm" color={mutedColor}>
                            {course.duration} on-demand video
                          </Text>
                        </HStack>
                      )}
                      {course.resources && (
                        <HStack>
                          <DescriptionIcon color="gray.400" />
                          <Text fontSize="sm" color={mutedColor}>
                            {course.resources} downloadable resources
                          </Text>
                        </HStack>
                      )}
                      <HStack>
                        <AllInclusiveIcon color="gray.400" />
                        <Text fontSize="sm" color={mutedColor}>
                          Full lifetime access
                        </Text>
                      </HStack>
                      <HStack>
                        <DevicesIcon color="gray.400" />
                        <Text fontSize="sm" color={mutedColor}>
                          Access on mobile and TV
                        </Text>
                      </HStack>
                      <HStack>
                        <CertificateIcon color="gray.400" />
                        <Text fontSize="sm" color={mutedColor}>
                          Certificate of completion
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </Box>

              {/* Instructor Card */}
              {course.instructor && (
                <Box
                  mt={6}
                  bg={cardBg}
                  p={6}
                  borderRadius="2xl"
                  border="1px"
                  borderColor={borderColor}
                >
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColor}
                    mb={4}
                  >
                    Your Instructor
                  </Text>
                  <HStack spacing={4}>
                    <Avatar
                      src={course.instructor.avatar || course.instructor.image}
                      name={
                        course.instructor.fullName || course.instructor.name
                      }
                      size="lg"
                      border="2px"
                      borderColor="primary.500"
                    />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        {course.instructor.fullName || course.instructor.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {course.instructor.title || course.instructor.bio}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              )}
            </Box>
          </Box>
        </SimpleGrid>
      </Container>

      <Footer />
    </Box>
  );
};

export default CourseDetail;
