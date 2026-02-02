import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const logoColor = useColorModeValue("brand.dark", "primary.500");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

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
  ];

  return (
    <Box
      w="240px"
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
    >
      <VStack spacing={6} align="stretch" px={4}>
        {/* Logo */}
        <Link to="/">
          <HStack spacing={2} px={2} cursor="pointer">
            <Text
              fontSize="2xl"
              fontFamily="'Pacifico', cursive"
              color={logoColor}
            >
              BeeEnglish
            </Text>
            <Text fontSize="2xl">🐝</Text>
          </HStack>
        </Link>

        <Divider />

        {/* Menu Items */}
        <VStack spacing={2} align="stretch">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
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
                  _hover={{
                    bg: isActive ? "primary.500" : hoverBg,
                  }}
                >
                  <HStack spacing={3}>
                    {item.icon}
                    <Text fontSize="sm">{item.name}</Text>
                  </HStack>
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Sidebar;