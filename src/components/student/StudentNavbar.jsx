import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Avatar,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
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
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

const StudentNavbar = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const menuBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const unreadBg = useColorModeValue("yellow.50", "gray.700");
  const hoverItemBg = useColorModeValue("gray.50", "gray.600");

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock notifications - replace with real data later
  const notifications = [
    { id: 1, message: "New course available!", isRead: false },
    { id: 2, message: "Your certificate is ready", isRead: false },
    { id: 3, message: "Welcome to BeeEnglish!", isRead: true },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={8}
      py={4}
      position="sticky"
      top={0}
      zIndex={10}
      backdropFilter="blur(12px)"
    >
      <Flex justify="space-between" align="center">
        {/* Search Bar */}
        <InputGroup maxW="500px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search for lessons, quizzes, resources..."
            bg={useColorModeValue("gray.50", "gray.700")}
            border="none"
            rounded="lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
        </InputGroup>

        {/* User Actions */}
        <HStack spacing={3}>
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
                      <Text
                        fontSize="sm"
                        color="primary.500"
                        fontWeight="semibold"
                        cursor="pointer"
                        onClick={() => navigate("/notifications")}
                      >
                        View all notifications
                      </Text>
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
                onClick={() => navigate("/student/dashboard")}
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
        </HStack>
      </Flex>
    </Box>
  );
};

export default StudentNavbar;
