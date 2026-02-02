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
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    Select,
    Divider,
} from '@chakra-ui/react'
import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import Sidebar from '../../components/student/StudentSidebar'
import StudentNavbar from '../../components/student/StudentNavbar'
import { useAuth } from '../../context/AuthContext'

const StudentCourses = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    // Color mode values
    const bgColor = useColorModeValue('#f8f8f5', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')

    const { user } = useAuth()

    // Mock data - All courses
    const allCourses = [
        {
            id: 1,
            title: 'IELTS Preparation Elite',
            instructor: 'Dr. Sarah Williams',
            progress: 67,
            completed: 12,
            total: 18,
            badge: 'SELF-PACED',
            icon: '🎯',
            status: 'active',
            enrollDate: 'Oct 1, 2023',
            lastAccessed: '2 hours ago',
            lessons: 18,
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
            status: 'active',
            enrollDate: 'Sep 15, 2023',
            lastAccessed: '1 day ago',
            lessons: 20,
        },
        {
            id: 3,
            title: 'Advanced Grammar Mastery',
            instructor: 'Jennifer Lee',
            progress: 100,
            completed: 15,
            total: 15,
            badge: 'COMPLETED',
            icon: '📚',
            status: 'completed',
            enrollDate: 'Aug 1, 2023',
            lastAccessed: 'Sep 28, 2023',
            lessons: 15,
        },
        {
            id: 4,
            title: 'Pronunciation Perfection',
            instructor: 'Michael Chen',
            progress: 45,
            completed: 9,
            total: 20,
            badge: 'SELF-PACED',
            icon: '🎤',
            status: 'active',
            enrollDate: 'Sep 20, 2023',
            lastAccessed: '3 hours ago',
            lessons: 20,
        },
        {
            id: 5,
            title: 'English for Beginners',
            instructor: 'Emma Wilson',
            progress: 100,
            completed: 12,
            total: 12,
            badge: 'COMPLETED',
            icon: '🌟',
            status: 'completed',
            enrollDate: 'Jul 10, 2023',
            lastAccessed: 'Sep 15, 2023',
            lessons: 12,
        },
        {
            id: 6,
            title: 'TOEFL Intensive',
            instructor: 'Dr. Robert Davis',
            progress: 35,
            completed: 7,
            total: 20,
            badge: 'SELF-PACED',
            icon: '🎓',
            status: 'active',
            enrollDate: 'Oct 10, 2023',
            lastAccessed: '5 hours ago',
            lessons: 20,
        },
    ]

    // Filter courses
    const filteredCourses = allCourses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterStatus === 'all' || course.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const activeCourses = allCourses.filter((c) => c.status === 'active')
    const completedCourses = allCourses.filter((c) => c.status === 'completed')

    const CourseCard = ({ course }) => (
        <Card bg={cardBg} shadow="sm" rounded="xl" transition="all 0.3s" _hover={{ shadow: 'md' }}>
            <CardBody>
                <VStack align="stretch" spacing={4}>
                    {/* Header */}
                    <Flex justify="space-between" align="start">
                        <Flex
                            w={12}
                            h={12}
                            bg={useColorModeValue('blue.50', 'blue.900')}
                            rounded="lg"
                            align="center"
                            justify="center"
                            fontSize="2xl"
                        >
                            {course.icon}
                        </Flex>
                        <Badge
                            bg={
                                course.status === 'active'
                                    ? useColorModeValue('gray.100', 'gray.700')
                                    : 'primary.100'
                            }
                            color={
                                course.status === 'active'
                                    ? mutedColor
                                    : 'primary.700'
                            }
                            fontSize="xs"
                            fontWeight="bold"
                            px={2}
                            py={1}
                            rounded="md"
                        >
                            {course.badge}
                        </Badge>
                    </Flex>

                    {/* Title & Instructor */}
                    <VStack align="stretch" spacing={1}>
                        <Heading size="sm" color={textColor}>
                            {course.title}
                        </Heading>
                        <Text fontSize="sm" color={mutedColor}>
                            Instructor: {course.instructor}
                        </Text>
                    </VStack>

                    {/* Progress Bar */}
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
                            <Text fontSize="xs" fontWeight="bold" color={textColor}>
                                {course.progress}% ({course.completed}/{course.total} LESSONS)
                            </Text>
                        </Flex>
                        <Progress
                            value={course.progress}
                            colorScheme="yellow"
                            bg={useColorModeValue('gray.200', 'gray.700')}
                            rounded="full"
                            size="sm"
                        />
                    </Box>

                    {/* Meta Info */}
                    <HStack spacing={4} fontSize="xs" color={mutedColor}>
                        <Text>📅 Enrolled: {course.enrollDate}</Text>
                        <Text>⏱️ {course.lastAccessed}</Text>
                    </HStack>

                    {/* Action Button */}
                    <Button
                        variant="solid"
                        bg={useColorModeValue('gray.900', 'gray.700')}
                        color="white"
                        rounded="full"
                        fontWeight="bold"
                        rightIcon={<ChevronRightIcon />}
                        _hover={{
                            bg: useColorModeValue('gray.800', 'gray.600'),
                        }}
                        w="full"
                    >
                        {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                    </Button>
                </VStack>
            </CardBody>
        </Card>
    )

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
                    <VStack spacing={6} align="stretch">
                        {/* Header Section */}
                        <Box>
                            <Heading size="lg" color={textColor} mb={2}>
                                My Courses
                            </Heading>
                            <Text color={mutedColor}>
                                Manage and continue your learning journey
                            </Text>
                        </Box>

                        {/* Stats Section */}
                        <Grid
                            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                            gap={4}
                        >
                            <Card bg={cardBg} shadow="sm" rounded="xl">
                                <CardBody>
                                    <VStack align="stretch" spacing={2}>
                                        <Heading size="md" color="primary.500">
                                            {allCourses.length}
                                        </Heading>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Total Courses
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                            <Card bg={cardBg} shadow="sm" rounded="xl">
                                <CardBody>
                                    <VStack align="stretch" spacing={2}>
                                        <Heading size="md" color="primary.500">
                                            {activeCourses.length}
                                        </Heading>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Active Courses
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                            <Card bg={cardBg} shadow="sm" rounded="xl">
                                <CardBody>
                                    <VStack align="stretch" spacing={2}>
                                        <Heading size="md" color="primary.500">
                                            {completedCourses.length}
                                        </Heading>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Completed
                                        </Text>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </Grid>

                        {/* Search & Filter Section */}
                        <HStack spacing={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
                            <InputGroup maxW={{ base: '100%', md: '400px' }}>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color={mutedColor} />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    bg={cardBg}
                                    border="1px solid"
                                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                                    rounded="lg"
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                                    }}
                                />
                            </InputGroup>

                            <Select
                                maxW={{ base: '100%', md: '150px' }}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                bg={cardBg}
                                border="1px solid"
                                borderColor={useColorModeValue('gray.200', 'gray.700')}
                                rounded="lg"
                                _focus={{
                                    borderColor: 'primary.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                                }}
                            >
                                <option value="all">All Courses</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </Select>
                        </HStack>

                        {/* Courses Grid */}
                        <Box>
                            <Heading size="md" color={textColor} mb={4}>
                                {filterStatus === 'all'
                                    ? `All Courses (${filteredCourses.length})`
                                    : filterStatus === 'active'
                                    ? `Active Courses (${filteredCourses.length})`
                                    : `Completed Courses (${filteredCourses.length})`}
                            </Heading>

                            {filteredCourses.length > 0 ? (
                                <Grid
                                    templateColumns={{
                                        base: '1fr',
                                        md: 'repeat(2, 1fr)',
                                        lg: 'repeat(3, 1fr)',
                                    }}
                                    gap={6}
                                >
                                    {filteredCourses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </Grid>
                            ) : (
                                <Card bg={cardBg} shadow="sm" rounded="xl">
                                    <CardBody>
                                        <VStack spacing={4} align="center" py={10}>
                                            <Text fontSize="4xl">📚</Text>
                                            <Text
                                                fontSize="lg"
                                                fontWeight="semibold"
                                                color={textColor}
                                            >
                                                No courses found
                                            </Text>
                                            <Text color={mutedColor}>
                                                Try adjusting your search or filter
                                            </Text>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            )}
                        </Box>

                        {/* Continue Learning Section */}
                        {activeCourses.length > 0 && (
                            <>
                                <Divider />
                                <Box>
                                    <Heading size="md" color={textColor} mb={4}>
                                        Continue Learning
                                    </Heading>
                                    <Card bg={cardBg} shadow="sm" rounded="2xl">
                                        <CardBody>
                                            <Flex
                                                direction={{ base: 'column', md: 'row' }}
                                                gap={6}
                                                align="center"
                                            >
                                                <Box
                                                    w={{ base: '100%', md: '200px' }}
                                                    h="150px"
                                                    bg={useColorModeValue(
                                                        'gray.100',
                                                        'gray.800'
                                                    )}
                                                    rounded="xl"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    fontSize="5xl"
                                                >
                                                    {activeCourses[0].icon}
                                                </Box>

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
                                                        RECOMMENDED FOR YOU
                                                    </Badge>

                                                    <Heading size="md" color={textColor}>
                                                        {activeCourses[0].title}
                                                    </Heading>

                                                    <Text color={mutedColor} fontSize="sm">
                                                        You're making great progress! Keep going with{' '}
                                                        <strong>
                                                            {activeCourses[0].instructor}
                                                        </strong>
                                                        's course.
                                                    </Text>

                                                    <Box>
                                                        <Flex justify="space-between" mb={2}>
                                                            <Text
                                                                fontSize="sm"
                                                                color={mutedColor}
                                                            >
                                                                Progress
                                                            </Text>
                                                            <Text
                                                                fontSize="sm"
                                                                fontWeight="bold"
                                                                color={textColor}
                                                            >
                                                                {activeCourses[0].progress}%
                                                            </Text>
                                                        </Flex>
                                                        <Progress
                                                            value={
                                                                activeCourses[0].progress
                                                            }
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
                                                        bg="primary.500"
                                                        color="brand.dark"
                                                        fontWeight="bold"
                                                        rounded="full"
                                                        alignSelf="start"
                                                        rightIcon={<ChevronRightIcon />}
                                                        _hover={{
                                                            bg: 'primary.400',
                                                        }}
                                                    >
                                                        Continue Learning
                                                    </Button>
                                                </VStack>
                                            </Flex>
                                        </CardBody>
                                    </Card>
                                </Box>
                            </>
                        )}
                    </VStack>
                </Box>
            </Box>
        </Flex>
    )
}

export default StudentCourses
