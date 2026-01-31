import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Grid,
    GridItem,
    Progress,
    Badge,
    Card,
    CardBody,
    useColorModeValue,
    SimpleGrid,
    Divider,
    Icon,
} from '@chakra-ui/react'
import { ChevronRightIcon, DownloadIcon } from '@chakra-ui/icons'
// import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/student/StudentSidebar'
import StudentNavbar from '../../components/student/StudentNavbar'

const Dashboard = () => {
    // const navigate = useNavigate()

    // Color mode values
    const bgColor = useColorModeValue('#f8f8f5', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    // const borderColor = useColorModeValue('gray.200', 'gray.700')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')

    // Mock data
    const currentLesson = {
        title: 'Module 4: Advanced Speaking Skills',
        progress: 65,
        label: 'CURRENT LESSON',
    }

    const activeCourses = [
        {
            id: 1,
            title: 'IELTS Preparation Elite',
            instructor: 'Dr. Sarah Williams',
            progress: 67,
            completed: 12,
            total: 18,
            badge: 'SELF-PACED',
            icon: '🎯',
        },
        {
            id: 2,
            title: 'Business Communication',
            instructor: 'Mark Thompson',
            progress: 20,
            completed: 4,
            total: 20,
            badge: 'SELF-PACED',
            icon: '💼',
        },
    ]

    const accomplishments = [
        {
            id: 1,
            title: 'English for Beginners',
            date: 'Sep 15, 2023',
            bgColor: '#FFF9E6',
            icon: '🎓',
        },
        {
            id: 2,
            title: 'Intermediate Grammar',
            date: 'Aug 28, 2023',
            bgColor: '#E6F3FF',
            icon: '📚',
        },
    ]

    const deadlines = [
        {
            id: 1,
            title: 'Speaking Mock Test',
            time: 'Today, 5:00 PM',
            color: 'red.500',
        },
        {
            id: 2,
            title: 'Grammar Worksheet',
            time: 'Tomorrow, 10:00 AM',
            color: 'yellow.500',
        },
        {
            id: 3,
            title: 'Essay Submission',
            time: 'Oct 24, 11:59 PM',
            color: 'gray.400',
        },
    ]

    return (
        <Flex minH="100vh" bg={bgColor}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box flex={1}>
                {/* Student Navbar */}
                <StudentNavbar />

                {/* Main Content Area */}
                <Box px={8} py={6}>
                    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                        {/* Left Column - Main Content */}
                        <GridItem colSpan={{ base: 12, xl: 8 }}>
                            <VStack spacing={6} align="stretch">
                                {/* Welcome Section */}
                                <Box>
                                    <Heading size="lg" color={textColor} mb={1}>
                                        Welcome back, Alex! 👋
                                    </Heading>
                                    <Text color={mutedColor}>
                                        Ready for your IELTS prep today? You're doing great!
                                    </Text>
                                </Box>

                                {/* Current Lesson Card */}
                                <Card bg={cardBg} shadow="sm" rounded="2xl">
                                    <CardBody>
                                        <Flex
                                            direction={{ base: 'column', md: 'row' }}
                                            gap={6}
                                            align="center"
                                        >
                                            {/* Lesson Image */}
                                            <Box
                                                w={{ base: '100%', md: '200px' }}
                                                h="150px"
                                                bg="gray.800"
                                                rounded="xl"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                fontSize="4xl"
                                            >
                                                💬
                                            </Box>

                                            {/* Lesson Info */}
                                            <VStack flex={1} align="stretch" spacing={4}>
                                                <Badge
                                                    alignSelf="start"
                                                    bg="primary.500"
                                                    color="brand.dark"
                                                    fontSize="xs"
                                                    fontWeight="bold"
                                                    px={3}
                                                    py={1}
                                                    rounded="full"
                                                    textTransform="uppercase"
                                                >
                                                    {currentLesson.label}
                                                </Badge>

                                                <Heading size="md" color={textColor}>
                                                    {currentLesson.title}
                                                </Heading>

                                                <Box>
                                                    <Flex justify="space-between" mb={2}>
                                                        <Text fontSize="sm" color={mutedColor}>
                                                            Progress
                                                        </Text>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="bold"
                                                            color={textColor}
                                                        >
                                                            {currentLesson.progress}%
                                                        </Text>
                                                    </Flex>
                                                    <Progress
                                                        value={currentLesson.progress}
                                                        colorScheme="yellow"
                                                        bg={useColorModeValue('gray.200', 'gray.700')}
                                                        rounded="full"
                                                        size="sm"
                                                    />
                                                </Box>

                                                <Button
                                                    bg="primary.500"
                                                    color="brand.dark"
                                                    fontWeight="bold"
                                                    rounded="full"
                                                    alignSelf="start"
                                                    rightIcon={<ChevronRightIcon />}
                                                    _hover={{ bg: 'primary.400' }}
                                                >
                                                    Continue Learning
                                                </Button>
                                            </VStack>
                                        </Flex>
                                    </CardBody>
                                </Card>

                                {/* Active Courses */}
                                <Box>
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <Heading size="md" color={textColor}>
                                            Active Courses
                                        </Heading>
                                        <Button
                                            variant="link"
                                            color="primary.600"
                                            fontWeight="semibold"
                                            fontSize="sm"
                                        >
                                            View All
                                        </Button>
                                    </Flex>

                                    <Grid
                                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                                        gap={4}
                                    >
                                        {activeCourses.map((course) => (
                                            <Card key={course.id} bg={cardBg} shadow="sm" rounded="xl">
                                                <CardBody>
                                                    <VStack align="stretch" spacing={4}>
                                                        <Flex justify="space-between" align="start">
                                                            <Flex
                                                                w={12}
                                                                h={12}
                                                                bg={useColorModeValue(
                                                                    'blue.50',
                                                                    'blue.900'
                                                                )}
                                                                rounded="lg"
                                                                align="center"
                                                                justify="center"
                                                                fontSize="2xl"
                                                            >
                                                                {course.icon}
                                                            </Flex>
                                                            <Badge
                                                                bg={useColorModeValue(
                                                                    'gray.100',
                                                                    'gray.700'
                                                                )}
                                                                color={mutedColor}
                                                                fontSize="xs"
                                                                fontWeight="bold"
                                                                px={2}
                                                                py={1}
                                                                rounded="md"
                                                            >
                                                                {course.badge}
                                                            </Badge>
                                                        </Flex>

                                                        <VStack align="stretch" spacing={1}>
                                                            <Heading size="sm" color={textColor}>
                                                                {course.title}
                                                            </Heading>
                                                            <Text fontSize="sm" color={mutedColor}>
                                                                Instructor: {course.instructor}
                                                            </Text>
                                                        </VStack>

                                                        <Box>
                                                            <Flex justify="space-between" mb={2}>
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="primary.600"
                                                                    fontWeight="bold"
                                                                    textTransform="uppercase"
                                                                >
                                                                    Progress
                                                                </Text>
                                                                <Text
                                                                    fontSize="xs"
                                                                    fontWeight="bold"
                                                                    color={textColor}
                                                                >
                                                                    {course.progress}% ({course.completed}/
                                                                    {course.total} LESSONS)
                                                                </Text>
                                                            </Flex>
                                                            <Progress
                                                                value={course.progress}
                                                                colorScheme="yellow"
                                                                bg={useColorModeValue(
                                                                    'gray.200',
                                                                    'gray.700'
                                                                )}
                                                                rounded="full"
                                                                size="sm"
                                                            />
                                                        </Box>

                                                        <Button
                                                            variant="solid"
                                                            bg={useColorModeValue(
                                                                'gray.900',
                                                                'gray.700'
                                                            )}
                                                            color="white"
                                                            rounded="full"
                                                            fontWeight="bold"
                                                            rightIcon={<ChevronRightIcon />}
                                                            _hover={{
                                                                bg: useColorModeValue(
                                                                    'gray.800',
                                                                    'gray.600'
                                                                ),
                                                            }}
                                                        >
                                                            Continue Learning
                                                        </Button>
                                                    </VStack>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </Grid>
                                </Box>

                                {/* Recent Accomplishments */}
                                <Box>
                                    <Flex justify="space-between" align="center" mb={4}>
                                        <HStack spacing={2}>
                                            <Icon viewBox="0 0 24 24" boxSize={5} color="primary.500">
                                                <path
                                                    fill="currentColor"
                                                    d="M5,16L3,5L8.5,10L12,4L15.5,10L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z"
                                                />
                                            </Icon>
                                            <Heading size="md" color={textColor}>
                                                Recent Accomplishments
                                            </Heading>
                                        </HStack>
                                        <Button
                                            variant="link"
                                            color="primary.600"
                                            fontWeight="semibold"
                                            fontSize="sm"
                                        >
                                            View All
                                        </Button>
                                    </Flex>

                                    <Grid
                                        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                                        gap={4}
                                    >
                                        {accomplishments.map((item) => (
                                            <Card key={item.id} bg={item.bgColor} shadow="sm" rounded="xl">
                                                <CardBody>
                                                    <Flex justify="space-between" align="center">
                                                        <HStack spacing={4}>
                                                            <Flex
                                                                w={12}
                                                                h={12}
                                                                bg="white"
                                                                rounded="lg"
                                                                align="center"
                                                                justify="center"
                                                                fontSize="2xl"
                                                            >
                                                                {item.icon}
                                                            </Flex>
                                                            <VStack align="start" spacing={0}>
                                                                <Text
                                                                    fontWeight="bold"
                                                                    color="brand.dark"
                                                                    fontSize="sm"
                                                                >
                                                                    {item.title}
                                                                </Text>
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="gray.600"
                                                                >
                                                                    Completed: {item.date}
                                                                </Text>
                                                            </VStack>
                                                        </HStack>
                                                    </Flex>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </Grid>
                                </Box>
                            </VStack>
                        </GridItem>

                        {/* Right Column - Activity & Deadlines */}
                        <GridItem colSpan={{ base: 12, xl: 4 }}>
                            <VStack spacing={6} align="stretch" position="sticky" top="100px">
                                {/* Deadlines */}
                                <Card bg={cardBg} shadow="sm" rounded="xl">
                                    <CardBody>
                                        <Flex justify="space-between" align="center" mb={4}>
                                            <Heading size="sm" color={textColor}>
                                                Deadlines
                                            </Heading>
                                            <Badge colorScheme="red" rounded="full" px={2}>
                                                3 Tasks
                                            </Badge>
                                        </Flex>

                                        <VStack spacing={3} align="stretch">
                                            {deadlines.map((deadline) => (
                                                <Flex
                                                    key={deadline.id}
                                                    justify="space-between"
                                                    align="center"
                                                    py={2}
                                                    borderLeft="3px solid"
                                                    borderColor={deadline.color}
                                                    pl={3}
                                                    cursor="pointer"
                                                    transition="all 0.2s"
                                                    _hover={{
                                                        bg: useColorModeValue('gray.50', 'gray.700'),
                                                    }}
                                                >
                                                    <VStack align="start" spacing={0}>
                                                        <Text
                                                            fontSize="sm"
                                                            fontWeight="semibold"
                                                            color={textColor}
                                                        >
                                                            {deadline.title}
                                                        </Text>
                                                        <Text fontSize="xs" color={mutedColor}>
                                                            {deadline.time}
                                                        </Text>
                                                    </VStack>
                                                    <ChevronRightIcon color={mutedColor} />
                                                </Flex>
                                            ))}
                                        </VStack>

                                        <Divider my={4} />

                                        <Button
                                            w="full"
                                            variant="outline"
                                            size="sm"
                                            rounded="lg"
                                            fontWeight="semibold"
                                        >
                                            View All
                                        </Button>
                                    </CardBody>
                                </Card>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>
        </Flex>
    )
}

export default Dashboard