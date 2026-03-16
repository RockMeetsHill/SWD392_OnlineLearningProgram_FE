import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const logoColor = useColorModeValue("brand.dark", "primary.500");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Force refresh khi về Home
  const handleGoHome = () => {
    globalThis.location.href = "/";
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: (
        <Icon viewBox="0 0 24 24" boxSize={5}>
          <path
            fill="currentColor"
            d="M13,9V3H21V9H13M13,21V11H21V21H13M3,21V15H11V21H3M3,13V3H11V13H3Z"
          />
        </Icon>
      ),
      path: "/student/dashboard",
    },
    {
      name: "My Courses",
      icon: (
        <Icon viewBox="0 0 24 24" boxSize={5}>
          <path
            fill="currentColor"
            d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"
          />
        </Icon>
      ),
      path: "/student/courses",
    },
    {
      name: "Certificates",
      icon: (
        <Icon viewBox="0 0 24 24" boxSize={5}>
          <path
            fill="currentColor"
            d="M4 3H14A2 2 0 0 1 16 5V9H20V19A2 2 0 0 1 18 21H8A2 2 0 0 1 6 19V15H4A2 2 0 0 1 2 13V5A2 2 0 0 1 4 3M8 15V19H18V11H16V13A2 2 0 0 1 14 15H8M11 7A3 3 0 0 0 8 10A3 3 0 0 0 11 13A3 3 0 0 0 14 10A3 3 0 0 0 11 7M11 9A1 1 0 0 1 12 10A1 1 0 0 1 11 11A1 1 0 0 1 10 10A1 1 0 0 1 11 9Z"
          />
        </Icon>
      ),
      path: "/student/certificates",
    },
  ];

  return (
    <Box
      w={isCollapsed ? "80px" : "240px"}
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      position="sticky"
      top={0}
      left={0}
      overflowY="auto"
      overflowX="auto"
      transition="all 0.3s ease"
    >
      <VStack spacing={6} align="stretch" px={4}>
        {/* Header with Logo and Toggle Button */}
        <Flex justify="space-between" align="center">
          {!isCollapsed && (
            <HStack
              spacing={2}
              px={2}
              cursor="pointer"
              onClick={handleGoHome}
            >
              <Text
                fontSize="2xl"
                fontFamily="'Pacifico', cursive"
                color={logoColor}
              >
                BeeEnglish
              </Text>
              <Text fontSize="2xl">🐝</Text>
            </HStack>
          )}
          <Tooltip
            label={isCollapsed ? "Expand" : "Collapse"}
            placement="right"
            openDelay={500}
          >
            <IconButton
              icon={
                isCollapsed ? (
                  <ChevronRightIcon boxSize={5} />
                ) : (
                  <ChevronLeftIcon boxSize={5} />
                )
              }
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              color={textColor}
              _hover={{ bg: hoverBg }}
            />
          </Tooltip>
        </Flex>

        <Divider />

        {/* Menu Items - giữ nguyên */}
        <VStack spacing={2} align="stretch">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip
                key={item.path}
                label={item.name}
                placement="right"
                isDisabled={!isCollapsed}
                openDelay={500}
              >
                <Link to={item.path}>
                  <Flex
                    align="center"
                    px={4}
                    py={3}
                    rounded="lg"
                    bg={isActive ? "primary.500" : "transparent"}
                    color={isActive ? "brand.dark" : textColor}
                    fontWeight={isActive ? "bold" : "medium"}
                    cursor="pointer"
                    transition="all 0.2s"
                    justifyContent={isCollapsed ? "center" : "flex-start"}
                    _hover={{
                      bg: isActive ? "primary.500" : hoverBg,
                    }}
                  >
                    <HStack spacing={3} display={isCollapsed ? "none" : "flex"}>
                      {item.icon}
                      <Text fontSize="sm">{item.name}</Text>
                    </HStack>
                    {isCollapsed && item.icon}
                  </Flex>
                </Link>
              </Tooltip>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Sidebar;