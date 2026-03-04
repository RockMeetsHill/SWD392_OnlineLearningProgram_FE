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

// Custom Icons
const DashboardIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M13,9V3H21V9H13M13,21V11H21V21H13M3,21V15H11V21H3M3,13V3H11V13H3Z"
    />
  </Icon>
);

const InstructorApprovalIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z"
    />
  </Icon>
);

const StudentsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"
    />
  </Icon>
);

const RevenueIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16,11.5A2.5,2.5 0 0,1 18.5,14A2.5,2.5 0 0,1 16,16.5A2.5,2.5 0 0,1 13.5,14A2.5,2.5 0 0,1 16,11.5M16,9A5,5 0 0,0 11,14A5,5 0 0,0 16,19A5,5 0 0,0 21,14A5,5 0 0,0 16,9M3,5V19H11.03A8.64,8.64 0 0,1 9,14C9,11.64 10.15,9.55 11.91,8.23L15,2L17.47,6.38C19.5,6.92 21.23,8.19 22.36,9.9L24,8L22,4L18.7,1.23L15.76,3.97L14.19,2L11,6.5L10.5,5H3Z"
    />
  </Icon>
);

const PlatformFeeIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M18.5,3.5L3.5,18.5L5.5,20.5L20.5,5.5M7,4A3,3 0 0,0 4,7A3,3 0 0,0 7,10A3,3 0 0,0 10,7A3,3 0 0,0 7,4M17,14A3,3 0 0,0 14,17A3,3 0 0,0 17,20A3,3 0 0,0 20,17A3,3 0 0,0 17,14Z"
    />
  </Icon>
);

const ReportsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M9,17H7V10H9V17M13,17H11V7H13V17M17,17H15V13H17V17Z"
    />
  </Icon>
);

const SettingsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
    />
  </Icon>
);

const SupportIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"
    />
  </Icon>
);

const CollapseIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H10V5H19V19M15.5,12L12,15.5V12.5H5V11.5H12V8.5L15.5,12Z"
    />
  </Icon>
);

const ExpandIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H10V5H19V19M8.5,12L12,8.5V11.5H19V12.5H12V15.5L8.5,12Z"
    />
  </Icon>
);

const WalletIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21 7H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2m0 10H3V9h18v8M16 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M20 5H4V3h16v2Z"
    />
  </Icon>
);

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const hoverBg = useColorModeValue("gray.200", "whiteAlpha.100");
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  const mainMenuItems = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      path: "/admin/dashboard",
    },
    {
      name: "Instructor Management",
      icon: InstructorApprovalIcon,
      path: "/admin/manage/instructors",
    },
    {
      name: "Student Management",
      icon: StudentsIcon,
      path: "/admin/manage/students",
    },
    {
      name: "Course Approvals",
      icon: PlatformFeeIcon,
      path: "/admin/course-approvals",
    },
        {
      name: "Revenue Tracking",
      icon: RevenueIcon,
      path: "/admin/revenue",
    },
        {
      name: "Instructor Payroll",
      icon: WalletIcon,
      path: "/admin/instructor-payroll",
    },
  ];

  // const systemMenuItems = [
  //   {
  //     name: "Reports",
  //     icon: ReportsIcon,
  //     path: "/admin/reports",
  //   },
  //   {
  //     name: "Settings",
  //     icon: SettingsIcon,
  //     path: "/admin/settings",
  //   },
  //   {
  //     name: "Support",
  //     icon: SupportIcon,
  //     path: "/admin/support",
  //   },
  // ];

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    const IconComponent = item.icon;

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
            py={2.5}
            rounded="lg"
            bg={isActive ? "primary.500" : "transparent"}
            color={isActive ? "brand.dark" : textColor}
            fontWeight={isActive ? "semibold" : "medium"}
            cursor="pointer"
            transition="all 0.2s"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            _hover={{
              bg: isActive ? "primary.500" : hoverBg,
            }}
            boxShadow={isActive ? "sm" : "none"}
          >
            <IconComponent boxSize={5} />
            {!isCollapsed && (
              <Text fontSize="sm" ml={3}>
                {item.name}
              </Text>
            )}
          </Flex>
        </Link>
      </Tooltip>
    );
  };

  return (
    <Box
      w={isCollapsed ? "80px" : "256px"}
      h="calc(100vh - 64px)"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      position="fixed"
      left={0}
      top="64px"
      overflowY="auto"
      transition="all 0.3s ease"
      display="flex"
      flexDirection="column"
    >
      {/* Menu Content */}
      <Box p={6} flex="1">
        {/* Main Menu Section */}
        {!isCollapsed && (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={mutedColor}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={4}
            pl={4}
          >
            Main Menu
          </Text>
        )}
        <VStack spacing={1} align="stretch" mb={6}>
          {mainMenuItems.map(renderMenuItem)}
        </VStack>

        {/* System Section */}
        {/* {!isCollapsed && (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={mutedColor}
            textTransform="uppercase"
            letterSpacing="wider"
            mb={4}
            mt={6}
            pl={4}
          >
            System
          </Text>
        )} */}
        {/* <VStack spacing={1} align="stretch">
          {systemMenuItems.map(renderMenuItem)}
        </VStack> */}
      </Box>

      {/* Collapse Button */}
      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <Tooltip
          label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          placement="right"
          openDelay={500}
        >
          <Flex
            align="center"
            px={4}
            py={2.5}
            rounded="lg"
            color={textColor}
            fontWeight="medium"
            cursor="pointer"
            transition="all 0.2s"
            justifyContent={isCollapsed ? "center" : "flex-start"}
            onClick={() => setIsCollapsed(!isCollapsed)}
            _hover={{
              bg: hoverBg,
            }}
          >
            {isCollapsed ? (
              <CollapseIcon boxSize={5} />
            ) : (
              <ExpandIcon boxSize={5} />
            )}
            {!isCollapsed && (
              <Text fontSize="sm" ml={3}>
                Collapse
              </Text>
            )}
          </Flex>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
