import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Alert,
    AlertIcon,
    AlertDescription,
    VStack,
    HStack,
    Grid,
    Progress,
    Badge,
    Card,
    CardBody,
    useColorModeValue,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Divider,
    Spinner,
    useToast,
    Image,
} from '@chakra-ui/react'
import { ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/student/StudentSidebar'
import StudentNavbar from '../../components/student/StudentNavbar'
import { useAuth } from '../../context/AuthContext'
import { certificateAPI } from '../../services/certificateService'
import { dashboardAPI } from '../../services/student/dashboardService'

const StudentCourses = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const toast = useToast()

    // Color mode values
    const bgColor = useColorModeValue('#f8f8f5', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const thumbnailFallbackBg = useColorModeValue('gray.100', 'gray.700')
    const activeStatusBg = useColorModeValue('blue.100', 'blue.900')
    const expiredStatusBg = useColorModeValue('orange.100', 'orange.900')
    const flaggedStatusBg = useColorModeValue('red.100', 'red.900')
    const courseButtonBg = useColorModeValue('gray.900', 'gray.700')
    const courseButtonHoverBg = useColorModeValue('gray.800', 'gray.600')
    const progressTrackBg = useColorModeValue('gray.200', 'gray.700')
    const formBorderColor = useColorModeValue('gray.200', 'gray.700')

    const { user } = useAuth()

    // Fetch courses từ API
    useEffect(() => {
        const fetchCourses = async () => {
            if (!user?.userId) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const [courseData, progressData, certificatesData] = await Promise.all([
                    dashboardAPI.getCoursesByStudentId(user.userId),
                    dashboardAPI.getUserProgress(),
                    certificateAPI.getMyCertificates(),
                ])

                const progressByCourseId = new Map(
                    (progressData || []).map((entry) => [entry.courseId, entry])
                )
                const certificateByCourseId = new Map(
                    (certificatesData || []).map((item) => [item.courseId, item])
                )

                // Transform data từ API để phù hợp với UI
                const transformedCourses = courseData.map((course) => {
                    const progressEntry = progressByCourseId.get(course.courseId)
                    // Tính tổng số lessons từ modules
                    const totalLessons = course.modules?.reduce(
                        (acc, module) => acc + (module._count?.lessons || 0),
                        0
                    ) || 0

                    const progress = Number(progressEntry?.percentage ?? course.progressPercent ?? 0)
                    const completedLessons = Number(progressEntry?.completedLessons ?? 0)
                    const hasCompletedAllLessons = totalLessons > 0 && completedLessons >= totalLessons
                    const status = course.enrollmentStatus || 'active'
                    const normalizedStatus =
                        status === 'expired'
                            ? 'expired'
                            : status === 'completed' || progress >= 100 || hasCompletedAllLessons
                                ? 'completed'
                                : 'active'
                    const certificate = certificateByCourseId.get(course.courseId)

                    return {
                        id: course.courseId,
                        title: course.title,
                        instructor: course.instructor?.fullName || 'Unknown Instructor',
                        instructorAvatar: course.instructor?.avatarUrl,
                        thumbnail: course.thumbnailUrl,
                        description: course.description,
                        levelTarget: course.levelTarget,
                        totalLessons,
                        enrolledAt: course.enrolledAt,
                        expiryDate: course.expiryDate,
                        progress,
                        completedLessons,
                        status: normalizedStatus,
                        contentFlagged: !!course.contentFlagged,
                        contentFlaggedReason: course.contentFlaggedReason || '',
                        certificateId: certificate?.id || null,
                    }
                })

                setCourses(transformedCourses)
            } catch (err) {
                console.error('Error fetching courses:', err)
                toast({
                    title: 'Error',
                    description: err.message || 'Failed to load your courses',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            } finally {
                setLoading(false)
            }
        }

        fetchCourses()
    }, [user?.userId, toast])

    // Filter courses
    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterStatus === 'all' || course.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const activeCourses = courses.filter((c) => c.status === 'active')
    const completedCourses = courses.filter((c) => c.status === 'completed')
    const expiredCourses = courses.filter((c) => c.status === 'expired')
    const recommendedActiveCourses = [...activeCourses]
        .filter((course) => !course.contentFlagged)
        .sort((a, b) => b.progress - a.progress)

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    // Get level badge color
    const getLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'beginner':
                return 'green'
            case 'intermediate':
                return 'yellow'
            case 'advanced':
                return 'red'
            default:
                return 'gray'
        }
    }

    // Navigate to course learn page
    const handleContinueLearning = (courseId) => {
        navigate(`/student/courses/${courseId}/learn`)
    }

    const handleViewCertificate = (certificateId) => {
        navigate(`/student/certificates/${certificateId}`)
    }

    const CourseCard = ({ course }) => (
        <Card bg={cardBg} shadow="sm" rounded="xl" transition="all 0.3s" _hover={{ shadow: 'md' }}>
            <CardBody>
                <VStack align="stretch" spacing={4}>
                    {/* Thumbnail */}
                    <Box
                        w="100%"
                        h="150px"
                        bg={thumbnailFallbackBg}
                        rounded="lg"
                        overflow="hidden"
                    >
                        {course.thumbnail ? (
                            <Image
                                src={course.thumbnail}
                                alt={course.title}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                            />
                        ) : (
                            <Flex
                                w="100%"
                                h="100%"
                                align="center"
                                justify="center"
                                fontSize="4xl"
                            >
                                📚
                            </Flex>
                        )}
                    </Box>

                    {/* Header */}
                    <Flex justify="space-between" align="start">
                        <Badge
                            colorScheme={getLevelColor(course.levelTarget)}
                            fontSize="xs"
                            fontWeight="bold"
                            px={2}
                            py={1}
                            rounded="md"
                        >
                            {course.levelTarget || 'All Levels'}
                        </Badge>
                        <Badge
                            bg={
                                course.contentFlagged
                                    ? flaggedStatusBg
                                    : course.status === 'active'
                                        ? activeStatusBg
                                        : course.status === 'expired'
                                            ? expiredStatusBg
                                            : 'green.100'
                            }
                            color={
                                course.contentFlagged
                                    ? 'red.700'
                                    : course.status === 'active'
                                        ? 'blue.700'
                                        : course.status === 'expired'
                                            ? 'orange.700'
                                            : 'green.700'
                            }
                            fontSize="xs"
                            fontWeight="bold"
                            px={2}
                            py={1}
                            rounded="md"
                        >
                            {course.contentFlagged
                                ? 'FLAGGED'
                                : course.status === 'completed'
                                    ? 'COMPLETED'
                                    : course.status === 'expired'
                                        ? 'EXPIRED'
                                        : 'IN PROGRESS'}
                        </Badge>
                    </Flex>

                    {/* Title & Instructor */}
                    <VStack align="stretch" spacing={1}>
                        <Heading size="sm" color={textColor} noOfLines={2}>
                            {course.title}
                        </Heading>
                        <HStack spacing={2}>
                            {course.instructorAvatar && (
                                <Image
                                    src={course.instructorAvatar}
                                    alt={course.instructor}
                                    boxSize="20px"
                                    rounded="full"
                                />
                            )}
                            <Text fontSize="sm" color={mutedColor}>
                                {course.instructor}
                            </Text>
                        </HStack>
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
                                {course.progress}% ({course.completedLessons}/{course.totalLessons} LESSONS)
                            </Text>
                        </Flex>
                        <Progress
                            value={course.progress}
                            colorScheme="yellow"
                            bg={progressTrackBg}
                            rounded="full"
                            size="sm"
                        />
                    </Box>

                    {course.contentFlagged && (
                        <Alert status="error" rounded="lg" alignItems="flex-start">
                            <AlertIcon mt={1} />
                            <AlertDescription fontSize="sm">
                                Sorry, this course is temporarily unavailable because it was flagged by
                                the admin. Please come back later.
                                {course.contentFlaggedReason
                                    ? ` Reason: ${course.contentFlaggedReason}`
                                    : ''}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Meta Info */}
                    <HStack spacing={4} fontSize="xs" color={mutedColor} flexWrap="wrap">
                        <Text>📅 Enrolled: {formatDate(course.enrolledAt)}</Text>
                        {course.expiryDate && (
                            <Text>⏳ Expires: {formatDate(course.expiryDate)}</Text>
                        )}
                    </HStack>

                    {/* Action Button */}
                    <Button
                        variant="solid"
                        bg={courseButtonBg}
                        color="white"
                        rounded="full"
                        fontWeight="bold"
                        rightIcon={<ChevronRightIcon />}
                        _hover={{
                            bg: courseButtonHoverBg,
                        }}
                        w="full"
                        isDisabled={course.status === 'expired' || course.contentFlagged}
                        onClick={() => handleContinueLearning(course.id)}
                    >
                        {course.contentFlagged
                            ? 'Flagged - Check Back Later'
                            : course.status === 'completed'
                                ? 'Review'
                                : course.status === 'expired'
                                    ? 'Course Expired'
                                    : 'Continue Learning'}
                    </Button>
                    {course.status === 'completed' && course.certificateId && (
                        <Button
                            variant="outline"
                            rounded="full"
                            fontWeight="bold"
                            onClick={() => handleViewCertificate(course.certificateId)}
                        >
                            View Certificate
                        </Button>
                    )}
                </VStack>
            </CardBody>
        </Card>
    )

    // Loading state
    if (loading) {
        return (
            <Flex minH="100vh" bg={bgColor}>
                <Sidebar />
                <Box flex={1}>
                    <StudentNavbar />
                    <Flex h="80vh" align="center" justify="center">
                        <VStack spacing={4}>
                            <Spinner size="xl" color="primary.500" thickness="4px" />
                            <Text color={mutedColor}>Loading your courses...</Text>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        )
    }

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
                            templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
                            gap={4}
                        >
                            <Card bg={cardBg} shadow="sm" rounded="xl">
                                <CardBody>
                                    <VStack align="stretch" spacing={2}>
                                        <Heading size="md" color="primary.500">
                                            {courses.length}
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
                            <Card bg={cardBg} shadow="sm" rounded="xl">
                                <CardBody>
                                    <VStack align="stretch" spacing={2}>
                                        <Heading size="md" color="orange.500">
                                            {expiredCourses.length}
                                        </Heading>
                                        <Text fontSize="sm" color={mutedColor}>
                                            Expired Courses
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
                                    borderColor={formBorderColor}
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
                                borderColor={formBorderColor}
                                rounded="lg"
                                _focus={{
                                    borderColor: 'primary.500',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                                }}
                            >
                                <option value="all">All Courses</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="expired">Expired</option>
                            </Select>
                        </HStack>

                        {/* Courses Grid */}
                        <Box>
                            <Heading size="md" color={textColor} mb={4}>
                                {filterStatus === 'all'
                                    ? `All Courses (${filteredCourses.length})`
                                    : filterStatus === 'active'
                                        ? `Active Courses (${filteredCourses.length})`
                                        : filterStatus === 'completed'
                                            ? `Completed Courses (${filteredCourses.length})`
                                            : `Expired Courses (${filteredCourses.length})`}
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
                                                {courses.length === 0
                                                    ? 'No courses enrolled yet'
                                                    : 'No courses found'}
                                            </Text>
                                            <Text color={mutedColor}>
                                                {courses.length === 0
                                                    ? 'Start your learning journey by enrolling in a course'
                                                    : 'Try adjusting your search or filter'}
                                            </Text>
                                            {courses.length === 0 && (
                                                <Button
                                                    colorScheme="yellow"
                                                    onClick={() => navigate('/courses')}
                                                >
                                                    Browse Courses
                                                </Button>
                                            )}
                                        </VStack>
                                    </CardBody>
                                </Card>
                            )}
                        </Box>

                        {/* Continue Learning Section */}
                        {recommendedActiveCourses.length > 0 && (
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
                                                    bg={thumbnailFallbackBg}
                                                    rounded="xl"
                                                    overflow="hidden"
                                                >
                                                    {recommendedActiveCourses[0].thumbnail ? (
                                                        <Image
                                                            src={recommendedActiveCourses[0].thumbnail}
                                                            alt={recommendedActiveCourses[0].title}
                                                            w="100%"
                                                            h="100%"
                                                            objectFit="cover"
                                                        />
                                                    ) : (
                                                        <Flex
                                                            w="100%"
                                                            h="100%"
                                                            align="center"
                                                            justify="center"
                                                            fontSize="5xl"
                                                        >
                                                            📚
                                                        </Flex>
                                                    )}
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
                                                        {recommendedActiveCourses[0].title}
                                                    </Heading>

                                                    <Text color={mutedColor} fontSize="sm">
                                                        You're making great progress! Keep going with{' '}
                                                        <strong>
                                                            {recommendedActiveCourses[0].instructor}
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
                                                                {recommendedActiveCourses[0].progress}%
                                                            </Text>
                                                        </Flex>
                                                        <Progress
                                                            value={
                                                                recommendedActiveCourses[0].progress
                                                            }
                                                            colorScheme="yellow"
                                                            bg={progressTrackBg}
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
                                                        onClick={() => handleContinueLearning(recommendedActiveCourses[0].id)}
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