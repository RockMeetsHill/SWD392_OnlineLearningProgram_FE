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
    IconButton,
    Avatar,
    Divider,
    Link as ChakraLink,
} from '@chakra-ui/react'
import { 
    CheckCircleIcon, 
    StarIcon, 
    InfoIcon,
    BellIcon,
    ArrowForwardIcon,
    ViewIcon,
} from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
    const navigate = useNavigate()

    // Color mode values
    const bgColor = useColorModeValue('brand.light', 'brand.dark')
    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const courseItemBg = useColorModeValue('gray.50', 'gray.900')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')

    // Mock course data
    const activatedCourses = [
        {
            id: 1,
            title: 'Advanced Business English',
            icon: '🌐',
        },
        {
            id: 2,
            title: 'Mastering Fluency: Speaking',
            icon: '🎙️',
        },
    ]

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
                            bg={useColorModeValue('brand.dark', 'primary.500')}
                            rounded="full"
                            align="center"
                            justify="center"
                            shadow="xl"
                        >
                            <CheckCircleIcon
                                boxSize={12}
                                color={useColorModeValue('primary.500', 'brand.dark')}
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
                            We've received your payment. Your courses have been activated and are ready for you to explore.
                        </Text>
                    </VStack>

                    {/* Activated Courses Section */}
                    <Box
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        rounded="xl"
                        p={8}
                        shadow="sm"
                    >
                        <HStack spacing={2} mb={6} pb={4} borderBottom="1px" borderColor={borderColor}>
                            <StarIcon color="primary.500" />
                            <Heading size="md" color={textColor}>
                                Activated Courses
                            </Heading>
                        </HStack>

                        <VStack spacing={4} align="stretch">
                            {activatedCourses.map((course) => (
                                <Flex
                                    key={course.id}
                                    align="center"
                                    justify="space-between"
                                    p={4}
                                    bg={courseItemBg}
                                    rounded="lg"
                                    border="1px"
                                    borderColor={borderColor}
                                    transition="all 0.2s"
                                    _hover={{ shadow: 'md' }}
                                >
                                    <HStack spacing={4}>
                                        <Flex
                                            w={16}
                                            h={12}
                                            bg="brand.dark"
                                            rounded="md"
                                            align="center"
                                            justify="center"
                                            fontSize="2xl"
                                        >
                                            {course.icon}
                                        </Flex>
                                        <VStack align="start" spacing={1}>
                                            <Heading size="sm" color={textColor}>
                                                {course.title}
                                            </Heading>
                                            <HStack spacing={1} color="green.500" fontSize="xs" fontWeight="semibold">
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
                                        _hover={{ bg: 'primary.400' }}
                                        _active={{ transform: 'scale(0.95)' }}
                                        rightIcon={<ArrowForwardIcon />}
                                    >
                                        Start Learning
                                    </Button>
                                </Flex>
                            ))}
                        </VStack>
                    </Box>

                    {/* Action Buttons */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
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
                            _hover={{ transform: 'scale(1.02)' }}
                            transition="all 0.2s"
                            leftIcon={<Icon viewBox="0 0 24 24">
                                <path fill="currentColor" d="M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18M12,3L1,9L12,15L21,10.09V17H23V9L12,3Z" />
                            </Icon>}
                        >
                            Go to My Learning
                        </Button>

                        <Button
                            flex={1}
                            variant="outline"
                            borderWidth={2}
                            borderColor={useColorModeValue('brand.dark', 'primary.500')}
                            color={useColorModeValue('brand.dark', 'primary.500')}
                            size="lg"
                            fontWeight="bold"
                            rounded="full"
                            _hover={{
                                bg: useColorModeValue('brand.dark', 'primary.500'),
                                color: useColorModeValue('white', 'brand.dark'),
                            }}
                            transition="all 0.2s"
                            leftIcon={<ViewIcon />}
                            onClick={() => navigate('/courses')}
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
    )
}

export default PaymentSuccess