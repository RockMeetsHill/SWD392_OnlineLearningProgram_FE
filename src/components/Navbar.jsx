import {
    Box,
    Flex,
    HStack,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    useColorMode,
    useColorModeValue,
    Container,
    Text,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody,
    VStack,
} from '@chakra-ui/react'
import { SearchIcon, MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const bgColor = useColorModeValue('rgba(255, 253, 245, 0.9)', 'rgba(10, 25, 38, 0.9)')
    const borderColor = useColorModeValue('gray.100', 'gray.800')
    const textColor = useColorModeValue('brand.dark', 'gray.200')
    const logoColor = useColorModeValue('brand.dark', 'primary.500')

    return (
        <Box
            as="nav"
            position="sticky"
            top={0}
            zIndex={100}
            bg={bgColor}
            backdropFilter="blur(12px)"
            borderBottom="1px"
            borderColor={borderColor}
            transition="all 0.3s"
        >
            <Container maxW="7xl" px={{ base: 4, md: 6, lg: 8 }}>
                <Flex justify="space-between" h="80px" align="center" position="relative">
                    {/* Logo */}
                    <Link to="/">
                        <HStack spacing={2} cursor="pointer" zIndex={20}>
                            <Text
                                fontSize="3xl"
                                fontFamily="'Pacifico', cursive"
                                color={logoColor}
                            >
                                BeeEnglish
                            </Text>
                            <Text fontSize="3xl" className="bee-float">🐝</Text>
                        </HStack>
                    </Link>

                    {/* Center Navigation - Desktop */}
                    <HStack
                        spacing={10}
                        display={{ base: 'none', md: 'flex' }}
                        position="absolute"
                        left="50%"
                        transform="translateX(-50%)"
                    >
                        <Link to="/courses">
                            <Text
                                color={textColor}
                                fontWeight="bold"
                                fontSize="lg"
                                _hover={{ color: 'primary.500' }}
                                transition="color 0.2s"
                            >
                                Courses
                            </Text>
                        </Link>
                        <Link to="/categories">
                            <Text
                                color={textColor}
                                fontWeight="bold"
                                fontSize="lg"
                                _hover={{ color: 'primary.500' }}
                                transition="color 0.2s"
                            >
                                Categories
                            </Text>
                        </Link>
                        <Link to="/about">
                            <Text
                                color={textColor}
                                fontWeight="bold"
                                fontSize="lg"
                                _hover={{ color: 'primary.500' }}
                                transition="color 0.2s"
                            >
                                About Us
                            </Text>
                        </Link>
                    </HStack>

                    {/* Right Actions - Desktop */}
                    <HStack spacing={4} display={{ base: 'none', md: 'flex' }} zIndex={20}>
                        <Button
                            variant="outline"
                            color={textColor}
                            borderColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
                            _hover={{
                                borderColor: textColor,
                                bg: 'transparent',
                            }}
                            borderRadius="full"
                            px={6}
                            fontWeight="bold"
                            onClick={() => navigate('/login')}
                        >
                            Sign in
                        </Button>
                        <Button
                            bg="primary.500"
                            color="brand.dark"
                            px={6}
                            borderRadius="full"
                            fontWeight="bold"
                            _hover={{
                                bg: 'primary.600',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 0 15px rgba(253, 232, 11, 0.5)',
                            }}
                            transition="all 0.2s"
                            onClick={() => navigate('/register')}
                        >
                            Join now
                        </Button>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            borderRadius="full"
                            color={useColorModeValue('gray.600', 'primary.500')}
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                            aria-label="Toggle color mode"
                        />
                    </HStack>

                    {/* Mobile Menu */}
                    <HStack display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            borderRadius="full"
                            aria-label="Toggle color mode"
                        />
                        <IconButton
                            icon={<HamburgerIcon boxSize={6} />}
                            onClick={onOpen}
                            variant="ghost"
                            aria-label="Open menu"
                        />
                    </HStack>
                </Flex>
            </Container>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} onClose={onClose} placement="right">
                <DrawerOverlay />
                <DrawerContent bg={useColorModeValue('white', 'brand.dark')}>
                    <DrawerCloseButton />
                    <DrawerBody pt={16}>
                        <VStack spacing={6} align="stretch">
                            <Link to="/courses" onClick={onClose}>
                                <Text fontWeight="bold" fontSize="lg">Courses</Text>
                            </Link>
                            <Link to="/categories" onClick={onClose}>
                                <Text fontWeight="bold" fontSize="lg">Categories</Text>
                            </Link>
                            <Link to="/about" onClick={onClose}>
                                <Text fontWeight="bold" fontSize="lg">About Us</Text>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => { navigate('/login'); onClose(); }}
                            >
                                Sign in
                            </Button>
                            <Button
                                bg="primary.500"
                                color="brand.dark"
                                onClick={() => { navigate('/register'); onClose(); }}
                            >
                                Join now
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    )
}

export default Navbar