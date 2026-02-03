import {
    Box,
    Flex,
    HStack,
    Button,
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
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Badge,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    Icon,
} from "@chakra-ui/react";
import {
    MoonIcon,
    SunIcon,
    HamburgerIcon,
    BellIcon,
    ChevronDownIcon,
    SettingsIcon,
    AtSignIcon,
} from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

// Custom Cart Icon using Chakra's Icon component
const CartIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
        />
    </Icon>
);

// Custom User Icon
const UserIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        />
    </Icon>
);

// Custom Logout Icon
const LogoutIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
        />
    </Icon>
);

// Custom Dashboard Icon
const DashboardIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
        />
    </Icon>
);

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, token, isAuthenticated, isLoading, logout } = useAuth();

    useEffect(() => {
        console.log("Auth State:", {
            isAuthenticated,
            hasToken: !!token,
            hasUser: !!user
        });
    }, [isAuthenticated, token, user]);

    const bgColor = useColorModeValue(
        "rgba(255, 253, 245, 0.9)",
        "rgba(10, 25, 38, 0.9)"
    );
    const borderColor = useColorModeValue("gray.100", "gray.800");
    const textColor = useColorModeValue("brand.dark", "gray.200");
    const logoColor = useColorModeValue("brand.dark", "primary.500");
    const menuBg = useColorModeValue("white", "gray.800");
    const hoverBg = useColorModeValue("gray.100", "gray.700");
    const unreadBg = useColorModeValue("yellow.50", "gray.700");
    const hoverItemBg = useColorModeValue("gray.50", "gray.600");

    // Mock notifications - replace with real data later
    const notifications = [
        { id: 1, message: "New course available!", isRead: false },
        { id: 2, message: "Your certificate is ready", isRead: false },
        { id: 3, message: "Welcome to BeeEnglish!", isRead: true },
    ];

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Mock cart items - replace with real data later
    const cartItemsCount = 2;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const getDashboardPath = () => {
        if (!user || !user.roles) return "/";
        if (user.roles.includes("admin")) return "/admin/dashboard";
        if (user.roles.includes("instructor")) return "/instructor/dashboard";
        return "/student/dashboard";
    };

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
                <Flex
                    justify="space-between"
                    h="80px"
                    align="center"
                    position="relative"
                >
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
                            <Text fontSize="3xl" className="bee-float">
                                🐝
                            </Text>
                        </HStack>
                    </Link>

                    {/* Center Navigation - Desktop */}
                    <HStack
                        spacing={10}
                        display={{ base: "none", md: "flex" }}
                        position="absolute"
                        left="50%"
                        transform="translateX(-50%)"
                    >
                        <Link to="/courses">
                            <Text
                                color={textColor}
                                fontWeight="bold"
                                fontSize="lg"
                                _hover={{ color: "primary.500" }}
                                transition="color 0.2s"
                            >
                                Courses
                            </Text>
                        </Link>
                        <Link to="/about">
                            <Text
                                color={textColor}
                                fontWeight="bold"
                                fontSize="lg"
                                _hover={{ color: "primary.500" }}
                                transition="color 0.2s"
                            >
                                About Us
                            </Text>
                        </Link>
                    </HStack>

                    {/* Right Actions - Desktop */}
                    <HStack spacing={3} display={{ base: "none", md: "flex" }} zIndex={20}>
                        {isAuthenticated ? (
                            <>
                                {/* Cart Icon */}
                                <Box position="relative">
                                    <IconButton
                                        icon={<CartIcon boxSize={5} />}
                                        variant="ghost"
                                        borderRadius="full"
                                        color={textColor}
                                        _hover={{ bg: hoverBg }}
                                        aria-label="Shopping cart"
                                        onClick={() => navigate("/cart")}
                                    />
                                    {cartItemsCount > 0 && (
                                        <Badge
                                            position="absolute"
                                            top="-1"
                                            right="-1"
                                            colorScheme="red"
                                            borderRadius="full"
                                            minW="20px"
                                            textAlign="center"
                                            fontSize="xs"
                                        >
                                            {cartItemsCount}
                                        </Badge>
                                    )}
                                </Box>

                                {/* Notifications */}
                                <Popover placement="bottom-end">
                                    <PopoverTrigger>
                                        <Box position="relative">
                                            <IconButton
                                                icon={<BellIcon boxSize={5} />}
                                                variant="ghost"
                                                borderRadius="full"
                                                color={textColor}
                                                _hover={{ bg: hoverBg }}
                                                aria-label="Notifications"
                                            />
                                            {unreadCount > 0 && (
                                                <Badge
                                                    position="absolute"
                                                    top="-1"
                                                    right="-1"
                                                    colorScheme="red"
                                                    borderRadius="full"
                                                    minW="20px"
                                                    textAlign="center"
                                                    fontSize="xs"
                                                >
                                                    {unreadCount}
                                                </Badge>
                                            )}
                                        </Box>
                                    </PopoverTrigger>
                                    <PopoverContent bg={menuBg} w="300px">
                                        <PopoverArrow bg={menuBg} />
                                        <PopoverHeader fontWeight="bold" borderBottomWidth="1px">
                                            Notifications
                                        </PopoverHeader>
                                        <PopoverBody p={0}>
                                            {notifications.length > 0 ? (
                                                <VStack align="stretch" spacing={0}>
                                                    {notifications.map((notification) => (
                                                        <Box
                                                            key={notification.id}
                                                            p={3}
                                                            borderBottomWidth="1px"
                                                            bg={!notification.isRead ? unreadBg : "transparent"}
                                                            _hover={{ bg: hoverItemBg }}
                                                            cursor="pointer"
                                                        >
                                                            <Text fontSize="sm">{notification.message}</Text>
                                                        </Box>
                                                    ))}
                                                    <Box p={2} textAlign="center">
                                                        <Link to="/notifications">
                                                            <Text
                                                                fontSize="sm"
                                                                color="primary.500"
                                                                fontWeight="semibold"
                                                            >
                                                                View all notifications
                                                            </Text>
                                                        </Link>
                                                    </Box>
                                                </VStack>
                                            ) : (
                                                <Box p={4} textAlign="center">
                                                    <Text fontSize="sm" color="gray.500">
                                                        No notifications
                                                    </Text>
                                                </Box>
                                            )}
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>

                                {/* User Menu */}
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        variant="ghost"
                                        borderRadius="full"
                                        px={2}
                                        _hover={{ bg: hoverBg }}
                                    >
                                        <HStack spacing={2}>
                                            <Avatar
                                                size="sm"
                                                name={user?.fullName}
                                                bg="primary.500"
                                                color="brand.dark"
                                            />
                                            <Text
                                                display={{ base: "none", lg: "block" }}
                                                fontWeight="medium"
                                                maxW="120px"
                                                isTruncated
                                            >
                                                {user?.fullName}
                                            </Text>
                                            <ChevronDownIcon />
                                        </HStack>
                                    </MenuButton>
                                    <MenuList bg={menuBg}>
                                        <Box px={4} py={2}>
                                            <Text fontWeight="bold">{user?.fullName}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {user?.email}
                                            </Text>
                                        </Box>
                                        <MenuDivider />
                                        <MenuItem
                                            icon={<DashboardIcon boxSize={4} />}
                                            onClick={() => navigate(getDashboardPath())}
                                        >
                                            Dashboard
                                        </MenuItem>
                                        <MenuItem
                                            icon={<UserIcon boxSize={4} />}
                                            onClick={() => navigate("/profile")}
                                        >
                                            My Profile
                                        </MenuItem>
                                        <MenuItem
                                            icon={<SettingsIcon boxSize={4} />}
                                            onClick={() => navigate("/settings")}
                                        >
                                            Settings
                                        </MenuItem>
                                        <MenuDivider />
                                        <MenuItem
                                            icon={<LogoutIcon boxSize={4} />}
                                            onClick={handleLogout}
                                            color="red.500"
                                        >
                                            Sign Out
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    color={textColor}
                                    borderColor={useColorModeValue(
                                        "blackAlpha.200",
                                        "whiteAlpha.200"
                                    )}
                                    _hover={{
                                        borderColor: textColor,
                                        bg: "transparent",
                                    }}
                                    borderRadius="full"
                                    px={6}
                                    fontWeight="bold"
                                    onClick={() => navigate("/login")}
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
                                        bg: "primary.600",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 0 15px rgba(253, 232, 11, 0.5)",
                                    }}
                                    transition="all 0.2s"
                                    onClick={() => navigate("/register")}
                                >
                                    Join now
                                </Button>
                            </>
                        )}

                        {/* Dark Mode Toggle */}
                        <IconButton
                            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            variant="ghost"
                            borderRadius="full"
                            color={useColorModeValue("gray.600", "primary.500")}
                            _hover={{ bg: hoverBg }}
                            aria-label="Toggle color mode"
                        />
                    </HStack>

                    {/* Mobile Menu */}
                    <HStack display={{ base: "flex", md: "none" }} spacing={2}>
                        {isAuthenticated && (
                            <>
                                <Box position="relative">
                                    <IconButton
                                        icon={<CartIcon boxSize={4} />}
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Cart"
                                        onClick={() => navigate("/cart")}
                                    />
                                    {cartItemsCount > 0 && (
                                        <Badge
                                            position="absolute"
                                            top="-1"
                                            right="-1"
                                            colorScheme="red"
                                            borderRadius="full"
                                            fontSize="xs"
                                        >
                                            {cartItemsCount}
                                        </Badge>
                                    )}
                                </Box>
                                <Box position="relative">
                                    <IconButton
                                        icon={<BellIcon />}
                                        variant="ghost"
                                        size="sm"
                                        aria-label="Notifications"
                                    />
                                    {unreadCount > 0 && (
                                        <Badge
                                            position="absolute"
                                            top="-1"
                                            right="-1"
                                            colorScheme="red"
                                            borderRadius="full"
                                            fontSize="xs"
                                        >
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Box>
                            </>
                        )}
                        <IconButton
                            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
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
                <DrawerContent bg={useColorModeValue("white", "brand.dark")}>
                    <DrawerCloseButton />
                    <DrawerBody pt={16}>
                        <VStack spacing={6} align="stretch">
                            {isAuthenticated && (
                                <HStack spacing={3} pb={4} borderBottomWidth="1px">
                                    <Avatar
                                        size="md"
                                        name={user?.fullName}
                                        bg="primary.500"
                                        color="brand.dark"
                                    />
                                    <Box>
                                        <Text fontWeight="bold">{user?.fullName}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            {user?.email}
                                        </Text>
                                    </Box>
                                </HStack>
                            )}

                            <Link to="/courses" onClick={onClose}>
                                <Text fontWeight="bold" fontSize="lg">
                                    Courses
                                </Text>
                            </Link>
                            <Link to="/categories" onClick={onClose}>
                                <Text fontWeight="bold" fontSize="lg">
                                    Categories
                                </Text>
                            </Link>
                            <Link to="/about" onClick={onClose}>
                                <Text fontWeight="bold" fontSize="lg">
                                    About Us
                                </Text>
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to={getDashboardPath()} onClick={onClose}>
                                        <Text fontWeight="bold" fontSize="lg">
                                            Dashboard
                                        </Text>
                                    </Link>
                                    <Link to="/profile" onClick={onClose}>
                                        <Text fontWeight="bold" fontSize="lg">
                                            My Profile
                                        </Text>
                                    </Link>
                                    <Link to="/settings" onClick={onClose}>
                                        <Text fontWeight="bold" fontSize="lg">
                                            Settings
                                        </Text>
                                    </Link>
                                    <Button
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => {
                                            handleLogout();
                                            onClose();
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            navigate("/login");
                                            onClose();
                                        }}
                                    >
                                        Sign in
                                    </Button>
                                    <Button
                                        bg="primary.500"
                                        color="brand.dark"
                                        onClick={() => {
                                            navigate("/register");
                                            onClose();
                                        }}
                                    >
                                        Join now
                                    </Button>
                                </>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default Navbar;