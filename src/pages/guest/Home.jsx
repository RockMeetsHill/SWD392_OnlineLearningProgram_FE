import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    HStack,
    VStack,
    SimpleGrid,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    Image,
    Card,
    CardBody,
    Badge,
    useColorModeValue,
    Flex,
    Avatar,
} from '@chakra-ui/react'
import { SearchIcon, ArrowForwardIcon, StarIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useState } from 'react'

// Data
const stats = [
    { number: '1,000+', label: 'Happy Bees' },
    { number: '50+', label: 'Queen Teachers' },
    { number: '120', label: 'Courses' },
    { number: '4.9', label: 'Star Rating' },
]

const levels = [
    {
        icon: '🧑‍🎓',
        title: 'Beginner',
        description: 'Start your English journey with fundamental grammar, essential vocabulary, and basic conversation skills.',
    },
    {
        icon: '📈',
        title: 'Intermediate',
        description: 'Expand your fluency with complex sentence structures, idioms, and more natural speaking practice.',
    },
    {
        icon: '✈️',
        title: 'Advanced',
        description: 'Master professional and academic English. Perfect your nuance, tone, and near-native proficiency.',
    },
]

const teachers = [
    {
        name: 'Sarah Johnson',
        role: 'IELTS Expert',
        info: '8.5 IELTS, 7 Years Experience',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    {
        name: 'David Lee',
        role: 'TOEIC Specialist',
        info: 'MBA, Business English Coach',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
    {
        name: 'Emma Watson',
        role: 'Communication',
        info: 'TESOL Certified, Native Speaker',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    },
    {
        name: 'Michael Chen',
        role: 'Grammar & Writing',
        info: 'PhD in Linguistics',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
]

const Home = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')

    // Xử lý tìm kiếm
    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`)
        } else {
            navigate('/courses')
        }
    }

    // Xử lý khi nhấn Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // Color mode values
    const bgLight = useColorModeValue('brand.light', 'brand.dark')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')
    const cardBg = useColorModeValue('white', 'gray.800')
    const statsBg = useColorModeValue('white', 'gray.800')

    return (
        <Box bg={bgLight} minH="100vh">
            <Navbar />

            {/* Hero Section */}
            <Box
                as="header"
                position="relative"
                overflow="hidden"
                pt={{ base: 16, lg: 32 }}
                pb={{ base: 24, lg: 40 }}
            >
                {/* Animated Background Path */}
                <Box
                    position="absolute"
                    inset={0}
                    pointerEvents="none"
                    opacity={useColorModeValue(0.2, 0.1)}
                    zIndex={0}
                >
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 1000 500"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M-50,250 C150,400 300,100 500,250 C700,400 850,100 1050,250"
                            stroke={useColorModeValue('#0A1926', '#FDE80B')}
                            strokeWidth="2"
                            strokeDasharray="10, 10"
                            style={{
                                animation: 'dash 20s linear infinite',
                            }}
                        />
                    </svg>
                </Box>

                <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }} position="relative" zIndex={10}>
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 12, lg: 16 }} alignItems="center">
                        {/* Left Content */}
                        <VStack
                            spacing={6}
                            align={{ base: 'center', lg: 'start' }}
                            textAlign={{ base: 'center', lg: 'left' }}
                        >
                            <Heading
                                as="h1"
                                fontSize={{ base: '4xl', lg: '6xl' }}
                                fontWeight="bold"
                                color={textColor}
                                lineHeight="1.1"
                                letterSpacing="tight"
                            >
                                Fly High with{' '}
                                <Box as="br" display={{ base: 'none', md: 'block' }} />
                                <Box as="span" position="relative" display="inline-block" zIndex={10}>
                                    <Box
                                        as="span"
                                        position="absolute"
                                        insetX={0}
                                        bottom={2}
                                        h="50%"
                                        bg="primary.500"
                                        zIndex={-1}
                                        opacity={0.9}
                                    />
                                    BeeEnglish
                                </Box>
                            </Heading>

                            <Text
                                fontSize="xl"
                                color={mutedColor}
                                maxW="lg"
                                mx={{ base: 'auto', lg: 0 }}
                            >
                                Master English with our fun, interactive, and structured learning paths.
                                From beginners to IELTS experts, we help you buzz with confidence.
                            </Text>

                            {/* Search Box */}
                            <Box maxW="lg" w="full" mx={{ base: 'auto', lg: 0 }}>
                                <InputGroup size="lg">
                                    <InputLeftElement pl={4}>
                                        <SearchIcon color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="What do you want to learn?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        bg={cardBg}
                                        border="1px"
                                        borderColor={useColorModeValue('gray.200', 'gray.700')}
                                        borderRadius="full"
                                        pl={12}
                                        pr={16}
                                        py={6}
                                        fontSize="md"
                                        fontWeight="medium"
                                        boxShadow="lg"
                                        _focus={{
                                            borderColor: 'primary.500',
                                            boxShadow: '0 0 0 2px rgba(253, 232, 11, 0.5)',
                                        }}
                                    />
                                    <InputRightElement pr={2} h="full">
                                        <IconButton
                                            icon={<ArrowForwardIcon />}
                                            bg="primary.500"
                                            color="brand.dark"
                                            borderRadius="full"
                                            size="md"
                                            _hover={{ bg: 'primary.600' }}
                                            aria-label="Search"
                                            onClick={handleSearch}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </Box>

                            {/* CTA Buttons */}
                            <HStack spacing={4} pt={4}>
                                <Button
                                    size="lg"
                                    bg="primary.500"
                                    color="brand.dark"
                                    borderRadius="full"
                                    px={8}
                                    fontWeight="bold"
                                    _hover={{
                                        bg: 'primary.600',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 0 15px rgba(253, 232, 11, 0.5)',
                                    }}
                                    transition="all 0.2s"
                                    onClick={() => navigate('/courses')}
                                >
                                    Start Learning
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    borderColor={textColor}
                                    color={textColor}
                                    borderRadius="full"
                                    px={8}
                                    fontWeight="bold"
                                    _hover={{
                                        bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.100'),
                                    }}
                                    onClick={() => navigate('/register')}
                                >
                                    Join Free
                                </Button>
                            </HStack>
                        </VStack>

                        {/* Right Image */}
                        <Box position="relative">
                            <Box
                                position="absolute"
                                inset={-4}
                                bg="primary.500"
                                opacity={0.2}
                                borderRadius="full"
                                filter="blur(40px)"
                            />
                            <Box
                                position="relative"
                                borderRadius="3xl"
                                overflow="hidden"
                                boxShadow="2xl"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"
                                    alt="Students learning English"
                                    w="full"
                                    h="auto"
                                    objectFit="cover"
                                />
                            </Box>
                            {/* Decorative elements */}
                            <Box
                                position="absolute"
                                top={-10}
                                right={-10}
                                w={24}
                                h={24}
                                bg="primary.500"
                                opacity={0.6}
                                clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                                className="bee-float"
                            />
                        </Box>
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box
                py={10}
                bg={statsBg}
                borderY="1px"
                borderColor={useColorModeValue('gray.100', 'gray.800')}
            >
                <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} textAlign="center">
                        {stats.map((stat, index) => (
                            <VStack key={index} p={4}>
                                <Heading
                                    size="xl"
                                    color={useColorModeValue('brand.dark', 'primary.500')}
                                >
                                    {stat.number}
                                </Heading>
                                <Text color={mutedColor} fontWeight="medium">
                                    {stat.label}
                                </Text>
                            </VStack>
                        ))}
                    </SimpleGrid>
                </Container>
            </Box>

            {/* Learning Levels Section */}
            <Box py={24} bg={bgLight}>
                <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
                    <VStack spacing={16}>
                        <VStack spacing={4} textAlign="center">
                            <Heading color={textColor} letterSpacing="tight">
                                Learning Levels
                            </Heading>
                            <Text color={mutedColor} fontSize="lg" maxW="2xl">
                                Find the perfect class for your current proficiency. Take our placement test to know exactly where to start.
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                            {levels.map((level, index) => (
                                <Card
                                    key={index}
                                    bg={cardBg}
                                    borderRadius="3xl"
                                    p={8}
                                    boxShadow="sm"
                                    border="1px"
                                    borderColor="transparent"
                                    _hover={{
                                        boxShadow: 'xl',
                                        borderColor: 'primary.500',
                                        transform: 'translateY(-4px)',
                                    }}
                                    transition="all 0.3s"
                                    cursor="pointer"
                                    h="full"
                                >
                                    <CardBody p={0} display="flex" flexDirection="column">
                                        <Flex
                                            w={14}
                                            h={14}
                                            bg="primary.500"
                                            borderRadius="2xl"
                                            align="center"
                                            justify="center"
                                            mb={6}
                                            fontSize="2xl"
                                            boxShadow="sm"
                                            mx="auto"
                                        >
                                            {level.icon}
                                        </Flex>
                                        <Heading size="lg" color={textColor} mb={3}>
                                            {level.title}
                                        </Heading>
                                        <Text color={mutedColor} mb={8} flex={1} lineHeight="relaxed">
                                            {level.description}
                                        </Text>
                                        <HStack
                                            color={textColor}
                                            fontWeight="bold"
                                            _hover={{ color: 'primary.500' }}
                                            transition="color 0.2s"
                                        >
                                            <Text>View Curriculum</Text>
                                            <ArrowForwardIcon />
                                        </HStack>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            {/* Teachers Section */}
            <Box py={24} bg={bgLight}>
                <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
                    <VStack spacing={16}>
                        <VStack spacing={4} textAlign="center">
                            <Heading color={textColor} letterSpacing="tight">
                                Meet our Queen Bee Teachers
                            </Heading>
                            <Text color={mutedColor} fontSize="lg">
                                Experienced, certified, and passionate about helping you grow.
                            </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} w="full">
                            {teachers.map((teacher, index) => (
                                <VStack
                                    key={index}
                                    textAlign="center"
                                    role="group"
                                    cursor="pointer"
                                >
                                    <Box position="relative" mb={6}>
                                        <Box
                                            position="absolute"
                                            inset={0}
                                            bg="primary.500"
                                            borderRadius="full"
                                            opacity={0}
                                            transform="scale(0.9)"
                                            _groupHover={{
                                                opacity: 1,
                                                transform: 'scale(1.1)',
                                            }}
                                            transition="all 0.3s"
                                        />
                                        <Avatar
                                            src={teacher.avatar}
                                            name={teacher.name}
                                            size="2xl"
                                            border="4px"
                                            borderColor={useColorModeValue('gray.100', 'gray.700')}
                                            position="relative"
                                            zIndex={10}
                                        />
                                    </Box>
                                    <Heading size="md" color={textColor}>
                                        {teacher.name}
                                    </Heading>
                                    <Text
                                        color={textColor}
                                        fontWeight="medium"
                                        fontSize="sm"
                                        textTransform="uppercase"
                                        letterSpacing="wide"
                                        opacity={0.8}
                                    >
                                        {teacher.role}
                                    </Text>
                                    <Text color={mutedColor} fontSize="sm">
                                        {teacher.info}
                                    </Text>
                                </VStack>
                            ))}
                        </SimpleGrid>
                    </VStack>
                </Container>
            </Box>

            <Footer />

            {/* Global Styles */}
            <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        .bee-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
        </Box>
    )
}

export default Home