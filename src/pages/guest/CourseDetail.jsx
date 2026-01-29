import { useParams, useNavigate } from 'react-router-dom'
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
} from '@chakra-ui/react'
import {
    StarIcon,
    ChevronRightIcon,
    CheckCircleIcon,
} from '@chakra-ui/icons'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// Custom Icons
const PlayIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M8 5v14l11-7z" />
    </Icon>
)

const GroupIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        />
    </Icon>
)

const LanguageIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
        />
    </Icon>
)

const VideoIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
        />
    </Icon>
)

const DescriptionIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
        />
    </Icon>
)

const AllInclusiveIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"
        />
    </Icon>
)

const DevicesIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"
        />
    </Icon>
)

const CertificateIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M9.68 13.69L12 11.93l2.31 1.76-.88-2.85L15.75 9h-2.84L12 6.19 11.09 9H8.25l2.31 1.84-.88 2.85zM20 10c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.03.76 3.87 2 5.28V23l6-2 6 2v-7.72c1.24-1.41 2-3.25 2-5.28zm-8-6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z"
        />
    </Icon>
)

// Mock data cho khóa học
const coursesData = {
    1: {
        id: 1,
        title: 'IELTS Academic Masterclass: Step-by-Step to Band 8.0+',
        subtitle: 'Master all four modules of the IELTS Academic test with expert strategies, real-world practice sessions, and personalized feedback systems.',
        instructor: {
            name: 'Dr. Robert Sterling',
            title: 'Ex-IELTS Examiner, 15+ Yrs Exp.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        },
        price: 84.99,
        originalPrice: 129.99,
        discount: 35,
        rating: 4.8,
        reviews: 2450,
        students: 15420,
        language: 'English [Auto]',
        duration: '15 hours',
        resources: 24,
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        level: 'Intermediate',
        lastUpdated: 'December 2024',
        whatYouLearn: [
            'Proven strategies to achieve Band 8.0+ in Reading and Listening modules.',
            'Advanced essay structure templates for Writing Task 1 and 2.',
            'Confidence-building techniques for the Speaking examination.',
            'Time management hacks to ensure you finish every section early.',
            'Common mistakes analysis and how to avoid them.',
            'Over 500+ academic vocabulary words and collocations.',
        ],
        description: `Are you struggling to reach your target IELTS score? Do you feel overwhelmed by the complexity of the Reading passages or the strict timing of the Writing tasks? The IELTS Academic Masterclass is designed to take you from confused to confident.

This comprehensive course covers every single aspect of the IELTS Academic test. Unlike other courses that only provide practice tests, we focus on systematic skill-building. We break down complex grammar, show you how to identify keywords in Listening, and provide step-by-step drafting for high-scoring essays.

With over 15 hours of video content, you'll feel like you're sitting in a private classroom with a world-class instructor.`,
        ratingBreakdown: {
            5: 80,
            4: 12,
            3: 5,
            2: 2,
            1: 1,
        },
    },
    2: {
        id: 2,
        title: 'IELTS Speaking Mastery: Band 8+ Secrets',
        subtitle: 'Unlock the secrets to achieving Band 8+ in IELTS Speaking with proven techniques and extensive practice materials.',
        instructor: {
            name: 'Jameson Miller',
            title: 'Native Speaker Coach, 10+ Yrs Exp.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        },
        price: 24.99,
        originalPrice: 39.99,
        discount: 38,
        rating: 4.7,
        reviews: 840,
        students: 8200,
        language: 'English',
        duration: '8 hours',
        resources: 15,
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
        level: 'Advanced',
        lastUpdated: 'January 2025',
        whatYouLearn: [
            'Master all three parts of the IELTS Speaking test.',
            'Learn 100+ topic-specific vocabulary sets.',
            'Develop natural fluency and pronunciation.',
            'Handle unexpected questions with confidence.',
            'Use advanced grammar structures naturally.',
            'Practice with real exam simulations.',
        ],
        description: `The IELTS Speaking test can be intimidating, but with the right preparation, you can walk into the exam room with complete confidence.

This course breaks down each part of the Speaking test and provides you with proven strategies to maximize your score. You'll learn how to structure your answers, expand your ideas naturally, and use a wide range of vocabulary and grammar.

Includes 50+ practice questions with model answers and detailed feedback guides.`,
        ratingBreakdown: {
            5: 70,
            4: 18,
            3: 8,
            2: 3,
            1: 1,
        },
    },
    3: {
        id: 3,
        title: 'Full IELTS Preparation: 4-in-1 Ultimate Guide',
        subtitle: 'Complete preparation for all four IELTS modules - Listening, Reading, Writing, and Speaking in one comprehensive course.',
        instructor: {
            name: 'Oxford Academy Online',
            title: 'Premium Education Provider',
            avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        },
        price: 89.99,
        originalPrice: 149.99,
        discount: 40,
        rating: 4.8,
        reviews: 1200,
        students: 12500,
        language: 'English [Auto]',
        duration: '22 hours',
        resources: 50,
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
        level: 'Beginner',
        lastUpdated: 'January 2025',
        whatYouLearn: [
            'Complete understanding of IELTS test format and scoring.',
            'Listening strategies for all question types.',
            'Speed reading techniques for the Reading module.',
            'Essay writing frameworks for Task 1 and Task 2.',
            'Speaking confidence and fluency development.',
            'Full-length practice tests with detailed explanations.',
        ],
        description: `This is the most comprehensive IELTS preparation course available online. Whether you're just starting your IELTS journey or looking to improve your current score, this course has everything you need.

Covering all four modules in detail, you'll learn not just what to expect, but exactly how to approach each question type for maximum marks. Our systematic approach has helped thousands of students achieve their target scores.

Includes 4 full practice tests, 100+ hours of practice materials, and lifetime access to course updates.`,
        ratingBreakdown: {
            5: 75,
            4: 15,
            3: 6,
            2: 3,
            1: 1,
        },
    },
    4: {
        id: 4,
        title: 'IELTS Writing Task 1 & 2 Strategy',
        subtitle: 'Master the art of IELTS Academic Writing with proven templates and strategies for both Task 1 and Task 2.',
        instructor: {
            name: 'Maria Garcia',
            title: 'IELTS Writing Specialist',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        },
        price: 34.99,
        originalPrice: 59.99,
        discount: 42,
        rating: 4.6,
        reviews: 530,
        students: 6800,
        language: 'English',
        duration: '15 hours',
        resources: 30,
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
        level: 'Intermediate',
        lastUpdated: 'December 2024',
        whatYouLearn: [
            'Task 1: Describe graphs, charts, and diagrams effectively.',
            'Task 2: Structure argumentative and discussion essays.',
            'Use high-scoring vocabulary and collocations.',
            'Master grammar for academic writing.',
            'Time management strategies for both tasks.',
            'Common mistakes and how to avoid them.',
        ],
        description: `Writing is often the most challenging module for IELTS candidates. This focused course will transform your writing skills and help you achieve your target band score.

Learn the exact structures and techniques that examiners are looking for. With detailed breakdowns of high-scoring essays and step-by-step writing guides, you'll develop the skills to write confidently under exam conditions.

Includes 50+ sample essays with examiner comments and scoring breakdowns.`,
        ratingBreakdown: {
            5: 65,
            4: 20,
            3: 10,
            2: 4,
            1: 1,
        },
    },
    5: {
        id: 5,
        title: 'Ace the IELTS Listening Test',
        subtitle: 'Develop sharp listening skills and learn strategies to tackle every question type in the IELTS Listening module.',
        instructor: {
            name: 'Tom Richards',
            title: 'Listening Skills Expert',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        },
        price: 19.99,
        originalPrice: 29.99,
        discount: 33,
        rating: 4.5,
        reviews: 210,
        students: 3500,
        language: 'English',
        duration: '5 hours',
        resources: 12,
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800',
        level: 'Beginner',
        lastUpdated: 'November 2024',
        whatYouLearn: [
            'Understand all IELTS Listening question types.',
            'Develop prediction and anticipation skills.',
            'Improve note-taking under time pressure.',
            'Recognize accents and speaking patterns.',
            'Avoid common traps and distractors.',
            'Practice with authentic test materials.',
        ],
        description: `The IELTS Listening test moves fast, and you only hear the audio once. This course will train your ears and sharpen your focus so you can catch every answer.

Learn proven techniques for each question type, from multiple choice to map labeling. Develop the ability to predict answers before you hear them and stay focused throughout the 30-minute test.

Includes 10 full practice tests with answer keys and audio transcripts.`,
        ratingBreakdown: {
            5: 60,
            4: 25,
            3: 10,
            2: 4,
            1: 1,
        },
    },
    6: {
        id: 6,
        title: 'Intensive IELTS Vocabulary Builder',
        subtitle: 'Build a powerful vocabulary foundation with 500+ essential words and phrases for IELTS success.',
        instructor: {
            name: 'Language Pro Institute',
            title: 'Vocabulary & Language Experts',
            avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        },
        price: 0,
        originalPrice: null,
        discount: null,
        rating: 4.9,
        reviews: 3100,
        students: 25000,
        language: 'English',
        duration: '10 hours',
        resources: 20,
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
        level: 'Beginner',
        lastUpdated: 'January 2025',
        whatYouLearn: [
            'Learn 500+ essential IELTS vocabulary words.',
            'Master topic-specific word lists.',
            'Understand collocations and word families.',
            'Use vocabulary naturally in speaking and writing.',
            'Memorization techniques for long-term retention.',
            'Practice exercises and quizzes for each topic.',
        ],
        description: `Vocabulary is the foundation of IELTS success. This free course provides you with all the essential words and phrases you need to excel in every module of the IELTS test.

Organized by topic and difficulty level, you'll build your vocabulary systematically. Each word comes with definitions, example sentences, pronunciation guides, and practice exercises.

This course is completely free and provides lifetime access to all materials and future updates.`,
        ratingBreakdown: {
            5: 85,
            4: 10,
            3: 3,
            2: 1,
            1: 1,
        },
    },
}

// Component hiển thị sao đánh giá
const StarRating = ({ rating, size = 'sm' }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const starSize = size === 'sm' ? 3 : 4

    return (
        <HStack spacing={0.5}>
            {[...Array(5)].map((_, i) => (
                <StarIcon
                    key={i}
                    boxSize={starSize}
                    color={i < fullStars ? 'orange.400' : i === fullStars && hasHalfStar ? 'orange.400' : 'gray.300'}
                />
            ))}
        </HStack>
    )
}

const CourseDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const course = coursesData[id] || coursesData[1]

    // Color mode values
    const bgColor = useColorModeValue('white', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('gray.900', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const highlightBg = useColorModeValue('yellow.50', 'yellow.900')
    const highlightBorder = useColorModeValue('yellow.100', 'yellow.800')

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
                        <BreadcrumbLink href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/courses" onClick={(e) => { e.preventDefault(); navigate('/courses') }}>
                            Courses
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <Text color={textColor} fontWeight="medium" noOfLines={1} maxW="200px">
                            {course.title}
                        </Text>
                    </BreadcrumbItem>
                </Breadcrumb>

                {/* Main Content */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={12}>
                    {/* Left Content */}
                    <Box gridColumn={{ lg: 'span 2' }}>
                        <VStack spacing={10} align="stretch">
                            {/* Hero Section */}
                            <VStack spacing={6} align="start">
                                <Heading
                                    as="h1"
                                    size="2xl"
                                    color={textColor}
                                    lineHeight="tight"
                                >
                                    {course.title.split(':')[0]}:
                                    <br />
                                    <Box
                                        as="span"
                                        bg="primary.500"
                                        color="brand.dark"
                                        px={2}
                                        display="inline"
                                    >
                                        {course.title.split(':')[1] || ''}
                                    </Box>
                                </Heading>

                                <Text fontSize="xl" color={mutedColor} maxW="2xl" lineHeight="relaxed">
                                    {course.subtitle}
                                </Text>

                                {/* Meta Info */}
                                <Flex wrap="wrap" gap={6} fontSize="sm">
                                    <HStack>
                                        <Text fontWeight="bold" color="orange.500">{course.rating}</Text>
                                        <StarRating rating={course.rating} />
                                        <Text color={mutedColor}>({course.reviews.toLocaleString()} reviews)</Text>
                                    </HStack>
                                    <HStack color={mutedColor}>
                                        <GroupIcon boxSize={4} />
                                        <Text>{course.students.toLocaleString()} students enrolled</Text>
                                    </HStack>
                                    <HStack color={mutedColor}>
                                        <LanguageIcon boxSize={4} />
                                        <Text>{course.language}</Text>
                                    </HStack>
                                </Flex>
                            </VStack>

                            {/* What You'll Learn */}
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
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={12} spacingY={4}>
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

                            {/* Course Description */}
                            <VStack spacing={4} align="start">
                                <Heading size="lg" color={textColor}>
                                    Course Description
                                </Heading>
                                <Box color={mutedColor} lineHeight="tall">
                                    {course.description.split('\n\n').map((paragraph, index) => (
                                        <Text key={index} mb={4}>
                                            {paragraph}
                                        </Text>
                                    ))}
                                </Box>
                            </VStack>

                            {/* Student Feedback */}
                            <VStack spacing={6} align="start">
                                <Heading size="lg" color={textColor}>
                                    Student Feedback
                                </Heading>
                                <Flex
                                    direction={{ base: 'column', md: 'row' }}
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
                                        <Text fontSize="5xl" fontWeight="extrabold" color={textColor} mb={2}>
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
                                                    value={course.ratingBreakdown[star]}
                                                    flex={1}
                                                    h={3}
                                                    borderRadius="full"
                                                    bg={useColorModeValue('gray.100', 'gray.700')}
                                                    sx={{
                                                        '& > div': {
                                                            bg: useColorModeValue('gray.800', 'primary.500'),
                                                        },
                                                    }}
                                                />
                                                <HStack w="100px" spacing={0.5}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            boxSize={3}
                                                            color={i < star ? 'orange.400' : 'gray.300'}
                                                        />
                                                    ))}
                                                </HStack>
                                                <Text fontSize="sm" fontWeight="semibold" w="40px">
                                                    {course.ratingBreakdown[star]}%
                                                </Text>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </Flex>
                            </VStack>
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
                                            src={course.image}
                                            alt={course.title}
                                            objectFit="cover"
                                            w="full"
                                            h="full"
                                            transition="transform 0.5s"
                                            _groupHover={{ transform: 'scale(1.05)' }}
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
                                                _groupHover={{ transform: 'scale(1.1)' }}
                                            >
                                                <PlayIcon boxSize={8} color="gray.900" ml={1} />
                                            </Flex>
                                            <Text color="white" fontWeight="bold" fontSize="lg" textShadow="md">
                                                Preview this course
                                            </Text>
                                        </Flex>
                                    </Box>
                                </AspectRatio>

                                {/* Card Content */}
                                <VStack p={6} spacing={6} align="stretch">
                                    {/* Price */}
                                    <HStack spacing={4}>
                                        <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
                                            {course.price === 0 ? 'Free' : `$${course.price}`}
                                        </Text>
                                        {course.originalPrice && (
                                            <>
                                                <Text fontSize="lg" color="gray.400" textDecoration="line-through">
                                                    ${course.originalPrice}
                                                </Text>
                                                <Badge bg="primary.500" color="brand.dark" px={2} py={0.5} borderRadius="md">
                                                    {course.discount}% OFF
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
                                        >
                                            {course.price === 0 ? 'Enroll for Free' : 'Enroll Now'}
                                        </Button>
                                        {course.price > 0 && (
                                            <Button
                                                w="full"
                                                variant="outline"
                                                borderWidth={2}
                                                borderColor={borderColor}
                                                fontWeight="bold"
                                                py={6}
                                                borderRadius="xl"
                                                _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                                            >
                                                Add to Cart
                                            </Button>
                                        )}
                                    </VStack>

                                    <Text textAlign="center" fontSize="xs" color="gray.400">
                                        30-Day Money-Back Guarantee
                                    </Text>

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
                                            <HStack>
                                                <VideoIcon color="gray.400" />
                                                <Text fontSize="sm" color={mutedColor}>
                                                    {course.duration} on-demand video
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <DescriptionIcon color="gray.400" />
                                                <Text fontSize="sm" color={mutedColor}>
                                                    {course.resources} downloadable resources
                                                </Text>
                                            </HStack>
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

                                    <Divider borderColor={borderColor} />

                                    {/* Actions */}
                                    <HStack justify="space-between" fontSize="xs" fontWeight="bold" color={mutedColor}>
                                        <Button variant="link" size="xs" fontWeight="bold" color={mutedColor}>
                                            Share
                                        </Button>
                                        <Button variant="link" size="xs" fontWeight="bold" color={mutedColor}>
                                            Gift this course
                                        </Button>
                                        <Button variant="link" size="xs" fontWeight="bold" color={mutedColor}>
                                            Apply Coupon
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>

                            {/* Instructor Card */}
                            <Box
                                mt={6}
                                bg={cardBg}
                                p={6}
                                borderRadius="2xl"
                                border="1px"
                                borderColor={borderColor}
                            >
                                <Text fontSize="sm" fontWeight="bold" color={textColor} mb={4}>
                                    Your Instructor
                                </Text>
                                <HStack spacing={4}>
                                    <Avatar
                                        src={course.instructor.avatar}
                                        name={course.instructor.name}
                                        size="lg"
                                        border="2px"
                                        borderColor="primary.500"
                                    />
                                    <Box>
                                        <Text fontWeight="bold" color={textColor}>
                                            {course.instructor.name}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                            {course.instructor.title}
                                        </Text>
                                    </Box>
                                </HStack>
                            </Box>
                        </Box>
                    </Box>
                </SimpleGrid>
            </Container>

            <Footer />
        </Box>
    )
}

export default CourseDetail