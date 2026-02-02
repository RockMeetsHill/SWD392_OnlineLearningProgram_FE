import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    HStack,
    VStack,
    SimpleGrid,
    Card,
    CardBody,
    Avatar,
    Badge,
    useColorModeValue,
    Flex,
    Divider,
    Icon,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useDisclosure,
    Select,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import StudentNavbar from '../../components/student/StudentNavbar'
import Sidebar from '../../components/student/StudentSidebar'
import { useAuth } from '../../context/AuthContext'

const StudentProfile = () => {
    const { user, isLoading: authLoading } = useAuth()
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    // Initialize student data from authenticated user
    const [studentData, setStudentData] = useState({
        name: '',
        email: '',
        phone: 'Not provided',
        joinDate: 'N/A',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        bio: 'Welcome to your learning journey!',
        level: 'Beginner',
        country: 'Not specified',
    })

    // Update student data when user changes
    useEffect(() => {
        if (user) {
            const newStudentData = {
                name: user.name || 'User',
                email: user.email || '',
                phone: user.phone || 'Not provided',
                joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
                avatar: user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                bio: user.bio || 'Welcome to your learning journey!',
                level: user.level || 'Beginner',
                country: user.country || 'Not specified',
            }
            setStudentData(newStudentData)
            setEditData(newStudentData)
        }
    }, [user])

    // Modal for editing profile
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [editData, setEditData] = useState(studentData)

    // Update editData when studentData changes
    useEffect(() => {
        setEditData(studentData)
    }, [studentData])

    // Color mode values
    const bgColor = useColorModeValue('#f8f8f5', 'gray.900')
    const cardBg = useColorModeValue('white', 'gray.800')
    const textColor = useColorModeValue('brand.dark', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')

    // Show loading while authentication is initializing
    if (authLoading) {
        return (
            <Flex minH="100vh" bg={bgColor}>
                <Sidebar />
                <Box flex={1}>
                    <StudentNavbar />
                    <Container maxW="7xl" centerContent py={32}>
                        <Text color={textColor} fontSize="lg">
                            Loading your profile...
                        </Text>
                    </Container>
                </Box>
            </Flex>
        )
    }

    // Redirect if not logged in
    if (!user) {
        return (
            <Flex minH="100vh" bg={bgColor}>
                <Sidebar />
                <Box flex={1}>
                    <StudentNavbar />
                    <Container maxW="7xl" centerContent py={32}>
                        <VStack spacing={4}>
                            <Heading color={textColor}>Access Denied</Heading>
                            <Text color={mutedColor}>Please log in to view your profile.</Text>
                        </VStack>
                    </Container>
                </Box>
            </Flex>
        )
    }

    const handleEditChange = (field, value) => {
        setEditData({ ...editData, [field]: value })
    }

    const handleSaveProfile = async () => {
        if (!user?.id) return

        try {
            const response = await fetch(`${API_URL}/students/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: editData.name,
                    email: editData.email,
                    phone: editData.phone,
                    country: editData.country,
                    level: editData.level,
                    bio: editData.bio,
                }),
            })

            if (response.ok) {
                const updatedUser = await response.json()
                setStudentData(editData)
                localStorage.setItem('user', JSON.stringify(updatedUser))
                onClose()
            } else {
                alert('Failed to save profile changes')
            }
        } catch (error) {
            console.error('Error saving profile:', error)
            alert('Error saving profile changes')
        }
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
                    <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                        {/* Left Column - Profile Info */}
                        <GridItem colSpan={{ base: 12 }}>
                            <VStack spacing={6} align="stretch">
                                {/* Welcome Section */}
                                <Box>
                                    <Heading size="lg" color={textColor} mb={1}>
                                        My Profile 👤
                                    </Heading>
                                    <Text color={mutedColor}>
                                        Manage your account information and settings
                                    </Text>
                                </Box>

                                {/* Profile Card */}
                                <Card bg={cardBg} shadow="sm" rounded="2xl">
                                    <CardBody>
                                        <VStack spacing={6} align="stretch">
                                            {/* Profile Header */}
                                            <Flex align="center" justify="space-between">
                                                <HStack spacing={6}>
                                                    {/* Avatar */}
                                                    <Box position="relative">
                                                        <Avatar
                                                            src={studentData.avatar}
                                                            name={studentData.name}
                                                            size="2xl"
                                                        />
                                                    </Box>

                                                    {/* Profile Info */}
                                                    <VStack align="start" spacing={2}>
                                                        <Heading size="md" color={textColor}>
                                                            {studentData.name}
                                                        </Heading>
                                                        <Badge
                                                            bg="primary.500"
                                                            color="brand.dark"
                                                            fontSize="xs"
                                                            fontWeight="bold"
                                                            px={3}
                                                            py={1}
                                                            rounded="full"
                                                        >
                                                            {studentData.level} Level
                                                        </Badge>
                                                        <Text color={mutedColor} fontSize="sm">
                                                            Member since {studentData.joinDate}
                                                        </Text>
                                                    </VStack>
                                                </HStack>

                                                <Button
                                                    leftIcon={<EditIcon />}
                                                    bg="primary.500"
                                                    color="brand.dark"
                                                    fontWeight="bold"
                                                    rounded="full"
                                                    _hover={{ bg: 'primary.600' }}
                                                    onClick={onOpen}
                                                >
                                                    Edit Profile
                                                </Button>
                                            </Flex>

                                            <Divider />

                                            {/* Bio Section */}
                                            <VStack align="stretch" spacing={3}>
                                                <Heading size="sm" color={textColor}>
                                                    About Me
                                                </Heading>
                                                <Text color={mutedColor}>
                                                    {studentData.bio}
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    </CardBody>
                                </Card>

                                {/* Personal Information */}
                                <Card bg={cardBg} shadow="sm" rounded="2xl">
                                    <CardBody>
                                        <VStack spacing={6} align="stretch">
                                            <Heading size="sm" color={textColor}>
                                                Personal Information
                                            </Heading>

                                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                                {[
                                                    { label: 'Email', value: studentData.email },
                                                    { label: 'Phone', value: studentData.phone },
                                                    { label: 'Country', value: studentData.country },
                                                    { label: 'Level', value: studentData.level },
                                                ].map((item, index) => (
                                                    <VStack key={index} spacing={2} align="start">
                                                        <Text
                                                            fontSize="xs"
                                                            color="primary.600"
                                                            fontWeight="bold"
                                                            textTransform="uppercase"
                                                        >
                                                            {item.label}
                                                        </Text>
                                                        <Text color={textColor} fontWeight="medium">
                                                            {item.value}
                                                        </Text>
                                                    </VStack>
                                                ))}
                                            </Grid>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>
            </Box>

            {/* Edit Profile Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent bg={cardBg} borderRadius="2xl">
                    <ModalHeader color={textColor} fontSize="2xl" fontWeight="bold">
                        Edit Profile
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <VStack spacing={6}>
                            <FormControl>
                                <FormLabel color={textColor} fontWeight="bold">
                                    Full Name
                                </FormLabel>
                                <Input
                                    placeholder="Enter your full name"
                                    value={editData.name}
                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                    bg={bgColor}
                                    color={textColor}
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px rgba(253, 232, 11, 0.5)',
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor} fontWeight="bold">
                                    Email
                                </FormLabel>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={editData.email}
                                    onChange={(e) => handleEditChange('email', e.target.value)}
                                    bg={bgColor}
                                    color={textColor}
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px rgba(253, 232, 11, 0.5)',
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor} fontWeight="bold">
                                    Phone
                                </FormLabel>
                                <Input
                                    placeholder="Enter your phone number"
                                    value={editData.phone}
                                    onChange={(e) => handleEditChange('phone', e.target.value)}
                                    bg={bgColor}
                                    color={textColor}
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px rgba(253, 232, 11, 0.5)',
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor} fontWeight="bold">
                                    Country
                                </FormLabel>
                                <Input
                                    placeholder="Enter your country"
                                    value={editData.country}
                                    onChange={(e) => handleEditChange('country', e.target.value)}
                                    bg={bgColor}
                                    color={textColor}
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px rgba(253, 232, 11, 0.5)',
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor} fontWeight="bold">
                                    Learning Level
                                </FormLabel>
                                <Select
                                    value={editData.level}
                                    onChange={(e) => handleEditChange('level', e.target.value)}
                                    bg={bgColor}
                                    color={textColor}
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px rgba(253, 232, 11, 0.5)',
                                    }}
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel color={textColor} fontWeight="bold">
                                    Bio
                                </FormLabel>
                                <Textarea
                                    placeholder="Tell us about yourself"
                                    value={editData.bio}
                                    onChange={(e) => handleEditChange('bio', e.target.value)}
                                    bg={bgColor}
                                    color={textColor}
                                    _focus={{
                                        borderColor: 'primary.500',
                                        boxShadow: '0 0 0 1px rgba(253, 232, 11, 0.5)',
                                    }}
                                    rows={4}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter gap={4}>
                        <Button
                            variant="outline"
                            borderColor={textColor}
                            color={textColor}
                            borderRadius="full"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            bg="primary.500"
                            color="brand.dark"
                            fontWeight="bold"
                            borderRadius="full"
                            _hover={{ bg: 'primary.600' }}
                            onClick={handleSaveProfile}
                        >
                            Save Changes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}

export default StudentProfile
