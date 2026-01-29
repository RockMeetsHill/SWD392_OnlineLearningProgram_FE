import { useState } from 'react'
import {
    Box,
    Container,
    Flex,
    Heading,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Button,
    IconButton,
    SimpleGrid,
    Card,
    CardBody,
    Image,
    Badge,
    HStack,
    VStack,
    Checkbox,
    CheckboxGroup,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    useColorModeValue,
    Divider,
    Icon,
} from '@chakra-ui/react'
import {
    SearchIcon,
    CloseIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

// Custom Icon Components (thay thế react-icons)
const CartIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
        />
    </Icon>
)

const BarChartIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"
        />
    </Icon>
)

const DollarIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
        />
    </Icon>
)

// Mock data cho khóa học
const coursesData = [
    {
        id: 1,
        title: 'Mastering IELTS Academic: The Full Course',
        instructor: 'Dr. Sarah Jenkins',
        price: 49.99,
        originalPrice: null,
        rating: 4.9,
        reviews: 2450,
        duration: '12.5 hours',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
        badge: 'Best Seller',
        level: 'Intermediate',
    },
    {
        id: 2,
        title: 'IELTS Speaking Mastery: Band 8+ Secrets',
        instructor: 'Jameson Miller',
        price: 24.99,
        originalPrice: 39.99,
        rating: 4.7,
        reviews: 840,
        duration: '8 hours',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
        badge: 'New',
        level: 'Advanced',
    },
    {
        id: 3,
        title: 'Full IELTS Preparation: 4-in-1 Ultimate Guide',
        instructor: 'Oxford Academy Online',
        price: 89.99,
        originalPrice: null,
        rating: 4.8,
        reviews: 1200,
        duration: '22 hours',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
        badge: null,
        level: 'Beginner',
    },
    {
        id: 4,
        title: 'IELTS Writing Task 1 & 2 Strategy',
        instructor: 'Maria Garcia',
        price: 34.99,
        originalPrice: null,
        rating: 4.6,
        reviews: 530,
        duration: '15 hours',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        badge: null,
        level: 'Intermediate',
    },
    {
        id: 5,
        title: 'Ace the IELTS Listening Test',
        instructor: 'Tom Richards',
        price: 19.99,
        originalPrice: null,
        rating: 4.5,
        reviews: 210,
        duration: '5 hours',
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400',
        badge: null,
        level: 'Beginner',
    },
    {
        id: 6,
        title: 'Intensive IELTS Vocabulary Builder',
        instructor: 'Language Pro Institute',
        price: 0,
        originalPrice: null,
        rating: 4.9,
        reviews: 3100,
        duration: '10 hours',
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
        badge: 'Best Value',
        level: 'Beginner',
    },
]

// Component hiển thị sao đánh giá
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const primaryColor = useColorModeValue('primary.500', 'primary.400')
    const emptyColor = useColorModeValue('gray.300', 'gray.600')

    return (
        <HStack spacing={0.5}>
            {[...Array(5)].map((_, i) => (
                <StarIcon
                    key={i}
                    boxSize={3}
                    color={i < fullStars ? primaryColor : emptyColor}
                />
            ))}
        </HStack>
    )
}

// Component Card khóa học
const CourseCard = ({ course, onClick }) => {
    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.100', 'gray.700')
    const textColor = useColorModeValue('gray.900', 'white')
    const mutedColor = useColorModeValue('gray.500', 'gray.400')
    const hoverShadow = useColorModeValue('xl', 'dark-lg')

    return (
        <Card
            bg={cardBg}
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            overflow="hidden"
            cursor="pointer"
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: hoverShadow,
            }}
            onClick={onClick}
            h="full"
        >
            {/* Image */}
            <Box position="relative" h="48" overflow="hidden">
                <Image
                    src={course.image}
                    alt={course.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                    transition="transform 0.5s"
                    _groupHover={{ transform: 'scale(1.05)' }}
                />
                {course.badge && (
                    <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        bg="primary.500"
                        color="gray.900"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="10px"
                        fontWeight="extrabold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                    >
                        {course.badge}
                    </Badge>
                )}
                <Badge
                    position="absolute"
                    bottom={3}
                    right={3}
                    bg="blackAlpha.700"
                    color="white"
                    px={2.5}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="medium"
                    backdropFilter="blur(4px)"
                >
                    {course.duration}
                </Badge>
            </Box>

            {/* Content */}
            <CardBody p={5} display="flex" flexDirection="column">
                <Heading
                    size="md"
                    color={textColor}
                    mb={2}
                    noOfLines={2}
                    lineHeight="snug"
                    _groupHover={{ color: 'primary.500' }}
                >
                    {course.title}
                </Heading>

                <Text color={mutedColor} fontSize="sm" fontWeight="medium" mb={3}>
                    {course.instructor}
                </Text>

                {/* Rating */}
                <HStack mb={4}>
                    <Text color={textColor} fontWeight="bold" fontSize="sm">
                        {course.rating}
                    </Text>
                    <StarRating rating={course.rating} />
                    <Text color="gray.400" fontSize="xs" fontWeight="medium">
                        ({course.reviews.toLocaleString()})
                    </Text>
                </HStack>

                {/* Price */}
                <Flex
                    mt="auto"
                    align="center"
                    justify="space-between"
                    pt={4}
                    borderTop="1px"
                    borderColor={borderColor}
                >
                    <VStack align="start" spacing={0}>
                        <Text fontSize="xl" fontWeight="bold" color={textColor}>
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                        </Text>
                        {course.originalPrice && (
                            <Text fontSize="xs" color="gray.400" textDecoration="line-through">
                                ${course.originalPrice}
                            </Text>
                        )}
                    </VStack>
                    <IconButton
                        icon={<CartIcon boxSize={5} />}
                        aria-label="Add to cart"
                        borderRadius="full"
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        color={useColorModeValue('gray.600', 'gray.300')}
                        _hover={{
                            bg: 'primary.500',
                            color: 'gray.900',
                        }}
                        onClick={(e) => {
                            e.stopPropagation()
                            // Add to cart logic
                        }}
                    />
                </Flex>
            </CardBody>
        </Card>
    )
}

// Component Filter Sidebar
const FilterSidebar = ({ filters, setFilters }) => {
    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.100', 'gray.700')
    const textColor = useColorModeValue('gray.800', 'gray.100')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const iconBg = useColorModeValue('gray.100', 'gray.700')

    const clearAllFilters = () => {
        setFilters({
            levels: [],
            duration: [],
            price: [],
            rating: [],
        })
    }

    return (
        <Box
            bg={cardBg}
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            p={6}
            position="sticky"
            top="100px"
        >
            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color={textColor}>
                    Filters
                </Heading>
                <Button
                    variant="link"
                    size="sm"
                    color={mutedColor}
                    fontWeight="medium"
                    textDecoration="underline"
                    _hover={{ color: textColor }}
                    onClick={clearAllFilters}
                >
                    Clear all
                </Button>
            </Flex>

            <Accordion allowMultiple defaultIndex={[0]}>
                {/* Level Filter */}
                <AccordionItem border="none">
                    <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                        <HStack flex={1} spacing={3}>
                            <Flex
                                w={6}
                                h={6}
                                bg={iconBg}
                                borderRadius="md"
                                align="center"
                                justify="center"
                            >
                                <BarChartIcon color={mutedColor} boxSize={4} />
                            </Flex>
                            <Text fontWeight="bold" color={textColor}>
                                Level
                            </Text>
                        </HStack>
                        <AccordionIcon color={mutedColor} />
                    </AccordionButton>
                    <AccordionPanel pb={4} pl={1}>
                        <CheckboxGroup
                            value={filters.levels}
                            onChange={(values) => setFilters({ ...filters, levels: values })}
                        >
                            <VStack align="start" spacing={3}>
                                <Checkbox value="beginner" colorScheme="yellow">
                                    <Text color={mutedColor} _hover={{ color: textColor }}>
                                        Beginner
                                    </Text>
                                </Checkbox>
                                <Checkbox value="intermediate" colorScheme="yellow">
                                    <Text color={mutedColor} _hover={{ color: textColor }}>
                                        Intermediate
                                    </Text>
                                </Checkbox>
                                <Checkbox value="advanced" colorScheme="yellow">
                                    <Text color={mutedColor} _hover={{ color: textColor }}>
                                        Advanced
                                    </Text>
                                </Checkbox>
                            </VStack>
                        </CheckboxGroup>
                    </AccordionPanel>
                </AccordionItem>

                <Divider my={4} borderColor={borderColor} />

                <Divider my={4} borderColor={borderColor} />

                {/* Price Filter */}
                <AccordionItem border="none">
                    <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                        <HStack flex={1} spacing={3}>
                            <Flex
                                w={6}
                                h={6}
                                bg={iconBg}
                                borderRadius="md"
                                align="center"
                                justify="center"
                            >
                                <DollarIcon color={mutedColor} boxSize={4} />
                            </Flex>
                            <Text fontWeight="bold" color={textColor}>
                                Price
                            </Text>
                        </HStack>
                        <AccordionIcon color={mutedColor} />
                    </AccordionButton>
                    <AccordionPanel pb={4} pl={1}>
                        <CheckboxGroup
                            value={filters.price}
                            onChange={(values) => setFilters({ ...filters, price: values })}
                        >
                            <VStack align="start" spacing={3}>
                                <Checkbox value="free" colorScheme="yellow">
                                    <Text color={mutedColor}>Free</Text>
                                </Checkbox>
                                <Checkbox value="paid" colorScheme="yellow">
                                    <Text color={mutedColor}>Paid</Text>
                                </Checkbox>
                            </VStack>
                        </CheckboxGroup>
                    </AccordionPanel>
                </AccordionItem>

                <Divider my={4} borderColor={borderColor} />
            </Accordion>

            {/* Apply Button */}
            <Button
                w="full"
                mt={8}
                bg="brand.dark"
                color="white"
                fontWeight="bold"
                py={6}
                borderRadius="xl"
                _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                }}
                transition="all 0.2s"
            >
                Apply Filters
            </Button>
        </Box>
    )
}

// Component Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const buttonBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const textColor = useColorModeValue('gray.700', 'gray.200')

    return (
        <HStack spacing={2} justify="center" mt={16}>
            <IconButton
                icon={<ChevronLeftIcon boxSize={5} />}
                aria-label="Previous page"
                borderRadius="lg"
                bg={buttonBg}
                border="1px"
                borderColor={borderColor}
                color="gray.500"
                _hover={{ color: textColor }}
                isDisabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            />

            {[1, 2, 3].map((page) => (
                <Button
                    key={page}
                    w={11}
                    h={11}
                    borderRadius="lg"
                    bg={currentPage === page ? 'primary.500' : buttonBg}
                    color={currentPage === page ? 'gray.900' : textColor}
                    fontWeight={currentPage === page ? 'bold' : 'normal'}
                    border={currentPage === page ? 'none' : '1px'}
                    borderColor={borderColor}
                    _hover={{
                        bg: currentPage === page ? 'primary.500' : 'gray.50',
                    }}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            <Text color="gray.400" fontWeight="medium" px={2}>
                ...
            </Text>

            <Button
                w={11}
                h={11}
                borderRadius="lg"
                bg={buttonBg}
                color={textColor}
                border="1px"
                borderColor={borderColor}
                _hover={{ bg: 'gray.50' }}
                onClick={() => onPageChange(12)}
            >
                12
            </Button>

            <IconButton
                icon={<ChevronRightIcon boxSize={5} />}
                aria-label="Next page"
                borderRadius="lg"
                bg={buttonBg}
                border="1px"
                borderColor={borderColor}
                color="gray.500"
                _hover={{ color: textColor }}
                isDisabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </HStack>
    )
}

// Main Component
const CourseSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [filters, setFilters] = useState({
        levels: [],
        price: [],
    })
    const [currentPage, setCurrentPage] = useState(1)


    const textColor = useColorModeValue('gray.900', 'white')
    const inputBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery })
        }
    }

    const clearSearch = () => {
        setSearchQuery('')
        setSearchParams({})
    }

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`)
    }

    // Filter courses based on search query
    const filteredCourses = coursesData.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Box minH="100vh">
            <Navbar />

            <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }} py={8}>
                {/* Search Bar */}
                <Box mb={10}>
                    <Flex
                        maxW="4xl"
                        mx="auto"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="sm"
                        _focusWithin={{
                            ring: 2,
                            ringColor: 'primary.500',
                            ringOffset: 2,
                        }}
                    >
                        <InputGroup size="lg" flex={1}>
                            <InputLeftElement pl={5} h="full">
                                <SearchIcon color="gray.400" boxSize={5} />
                            </InputLeftElement>
                            <Input
                                placeholder="What do you want to learn?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                bg={inputBg}
                                border="none"
                                pl={14}
                                pr={10}
                                py={6}
                                fontSize="lg"
                                _focus={{ border: 'none', boxShadow: 'none' }}
                            />
                            {searchQuery && (
                                <InputRightElement pr={4} h="full">
                                    <IconButton
                                        icon={<CloseIcon boxSize={3} />}
                                        aria-label="Clear search"
                                        variant="ghost"
                                        size="sm"
                                        color="gray.400"
                                        _hover={{ color: 'gray.600' }}
                                        onClick={clearSearch}
                                    />
                                </InputRightElement>
                            )}
                        </InputGroup>
                        <Button
                            px={10}
                            h="auto"
                            bg="primary.500"
                            color="gray.900"
                            fontWeight="bold"
                            fontSize="lg"
                            borderRadius="none"
                            borderLeft="1px"
                            borderColor={borderColor}
                            _hover={{ bg: 'primary.400' }}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Flex>
                </Box>

                {/* Results Header */}
                <Heading size="lg" color={textColor} mb={8} letterSpacing="tight">
                    {searchQuery
                        ? `Showing ${filteredCourses.length} results for "${searchQuery}"`
                        : `All Courses (${coursesData.length})`}
                </Heading>

                {/* Main Content */}
                <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
                    {/* Sidebar */}
                    <Box w={{ base: 'full', lg: '72' }} flexShrink={0}>
                        <FilterSidebar filters={filters} setFilters={setFilters} />
                    </Box>

                    {/* Course Grid */}
                    <Box flex={1}>
                        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={8}>
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onClick={() => handleCourseClick(course.id)}
                                />
                            ))}
                        </SimpleGrid>

                        {/* Pagination */}
                        {filteredCourses.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={12}
                                onPageChange={setCurrentPage}
                            />
                        )}

                        {/* No Results */}
                        {filteredCourses.length === 0 && (
                            <VStack py={20} spacing={4}>
                                <Text fontSize="6xl">🔍</Text>
                                <Heading size="md" color={textColor}>
                                    No courses found
                                </Heading>
                                <Text color="gray.500">
                                    Try adjusting your search or filters
                                </Text>
                            </VStack>
                        )}
                    </Box>
                </Flex>
            </Container>

            <Footer />
        </Box>
    )
}

export default CourseSearch