import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate, Link } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";

// Custom Icons
const PersonAddIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"
    />
  </Icon>
);

const ManageAccountsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M10 4A4 4 0 0 0 6 8A4 4 0 0 0 10 12A4 4 0 0 0 14 8A4 4 0 0 0 10 4M17 12C16.87 12 16.76 12.09 16.74 12.21L16.55 13.53C16.25 13.66 15.96 13.82 15.7 14L14.46 13.5C14.35 13.5 14.22 13.5 14.15 13.63L13.15 15.36C13.09 15.47 13.11 15.6 13.21 15.68L14.27 16.5C14.25 16.67 14.24 16.83 14.24 17C14.24 17.17 14.25 17.33 14.27 17.5L13.21 18.32C13.12 18.4 13.09 18.53 13.15 18.64L14.15 20.37C14.21 20.5 14.35 20.5 14.46 20.5L15.7 20C15.96 20.18 16.24 20.35 16.55 20.47L16.74 21.79C16.76 21.91 16.86 22 17 22H19C19.11 22 19.22 21.91 19.24 21.79L19.43 20.47C19.73 20.34 20 20.18 20.27 20L21.5 20.5C21.63 20.5 21.76 20.5 21.83 20.37L22.83 18.64C22.89 18.53 22.86 18.4 22.77 18.32L21.7 17.5C21.72 17.33 21.74 17.17 21.74 17C21.74 16.83 21.73 16.67 21.7 16.5L22.76 15.68C22.85 15.6 22.88 15.47 22.82 15.36L21.82 13.63C21.76 13.5 21.63 13.5 21.5 13.5L20.27 14C20 13.82 19.73 13.65 19.42 13.53L19.23 12.21C19.22 12.09 19.11 12 19 12H17M10 14C5.58 14 2 15.79 2 18V20H11.68A7 7 0 0 1 11 17A7 7 0 0 1 11.64 14.09C11.11 14.03 10.56 14 10 14M18 15.5C18.83 15.5 19.5 16.17 19.5 17C19.5 17.83 18.83 18.5 18 18.5C17.16 18.5 16.5 17.83 16.5 17C16.5 16.17 17.17 15.5 18 15.5Z"
    />
  </Icon>
);

const ChartIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"
    />
  </Icon>
);

const PercentIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M18.5,3.5L3.5,18.5L5.5,20.5L20.5,5.5M7,4A3,3 0 0,0 4,7A3,3 0 0,0 7,10A3,3 0 0,0 10,7A3,3 0 0,0 7,4M17,14A3,3 0 0,0 14,17A3,3 0 0,0 17,20A3,3 0 0,0 20,17A3,3 0 0,0 17,14Z"
    />
  </Icon>
);

const ArrowForwardIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,4L10.59,5.41L16.17,11H4V13H16.17L10.59,18.59L12,20L20,12L12,4Z"
    />
  </Icon>
);

const CalendarIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1"
    />
  </Icon>
);

const DashboardShortcutIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Color mode values
  const bgColor = useColorModeValue("#f8f8f5", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const hoverShadow = useColorModeValue("xl", "dark-lg");

  // Stats data
  const stats = [
    { label: "Active Users", value: "12,403", borderColor: "primary.500" },
    { label: "New Signups", value: "+128", borderColor: "primary.400" },
    { label: "Total Classes", value: "892", borderColor: "primary.300" },
    { label: "Pending Approvals", value: "14", borderColor: "primary.200" },
  ];

  // Feature cards data
  const featureCards = [
    {
      title: "Instructors Management",
      description:
        "Review pending applications, verify certifications, and onboard new teachers to the platform.",
      icon: PersonAddIcon,
      link: "/admin/instructors",
      linkText: "Go to Approvals",
      badge: { text: "14 Pending", colorScheme: "red" },
    },
    {
      title: "Students Management",
      description:
        "Update user details, manage enrollments, handle suspensions, and reset student credentials.",
      icon: ManageAccountsIcon,
      link: "/admin/students",
      linkText: "View Student List",
    },
    {
      title: "Course Approvals",
      description:
        "Review pending course submissions, approve or reject new courses, and manage course categories.",
      icon: PercentIcon,
      link: "/admin/fees",
      linkText: "Configure Pricing",
    },
        {
      title: "Revenue Tracking",
      description:
        "Monitor earnings, transactions, platform performance, and financial insights.",
      icon: ChartIcon,
      link: "/admin/revenue",
      linkText: "View Revenue",
    },
    {
      title: "Instructor Payroll",
      description:
        "Track payout requests, confirm payments, and monitor payout history.",
      icon: WalletIcon,
      link: "/admin/instructor-payroll",
      linkText: "Manage Payroll",
    },
  ];

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Navbar */}
      <AdminNavbar />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <Box ml={{ base: 0, md: "256px" }} transition="margin-left 0.3s ease">
        <Box p={{ base: 6, lg: 10 }} minH="calc(100vh - 64px)">
          {/* Header */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "flex-end" }}
            mb={10}
            gap={4}
          >
            <Box>
              <Heading size="xl" color={textColor} mb={1}>
                Admin Control Center
              </Heading>
              <Text color={mutedColor}>
                Welcome back, {user?.fullName || "Admin"}. Here's your platform
                overview.
              </Text>
            </Box>

            {/* Date Display */}
            <HStack
              bg={cardBg}
              px={4}
              py={2}
              rounded="lg"
              shadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <CalendarIcon boxSize={4} color={mutedColor} />
              <Text fontSize="sm" fontWeight="medium" color={mutedColor}>
                {currentDate}
              </Text>
            </HStack>
          </Flex>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
            {stats.map((stat, index) => (
              <Card
                key={index}
                bg={cardBg}
                shadow="sm"
                borderLeftWidth="4px"
                borderLeftColor={stat.borderColor}
              >
                <CardBody p={4}>
                  <Text
                    fontSize="xs"
                    color={mutedColor}
                    textTransform="uppercase"
                    fontWeight="semibold"
                    mb={1}
                  >
                    {stat.label}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                    {stat.value}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Feature Cards */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, lg: 8 }}>
            {featureCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card
                  key={index}
                  bg={cardBg}
                  shadow="sm"
                  border="1px"
                  borderColor={borderColor}
                  overflow="hidden"
                  position="relative"
                  transition="all 0.3s"
                  cursor="pointer"
                  role="group"
                  _hover={{
                    shadow: hoverShadow,
                    transform: "translateY(-2px)",
                  }}
                  onClick={() => navigate(card.link)}
                >
                  {/* Background decoration */}
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    w="128px"
                    h="128px"
                    bg="primary.50"
                    borderRadius="full"
                    mr="-64px"
                    mt="-64px"
                    transition="transform 0.5s"
                    _groupHover={{ transform: "scale(1.5)" }}
                  />

                  <CardBody p={8} position="relative" zIndex={1}>
                    {/* Header with Icon and Badge */}
                    <Flex justify="space-between" align="flex-start" mb={6}>
                      <Box
                        w="64px"
                        h="64px"
                        bg="primary.500"
                        rounded="2xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        shadow="lg"
                        transition="transform 0.3s"
                        _groupHover={{
                          transform:
                            index % 2 === 0 ? "rotate(6deg)" : "rotate(-6deg)",
                        }}
                      >
                        <IconComponent boxSize={10} color="brand.dark" />
                      </Box>
                      {card.badge && (
                        <Badge
                          colorScheme={card.badge.colorScheme}
                          fontSize="xs"
                          fontWeight="bold"
                          px={2}
                          py={1}
                          rounded="full"
                        >
                          {card.badge.text}
                        </Badge>
                      )}
                    </Flex>

                    {/* Content */}
                    <Heading
                      size="md"
                      color={textColor}
                      mb={2}
                      transition="color 0.3s"
                      _groupHover={{ color: "primary.600" }}
                    >
                      {card.title}
                    </Heading>
                    <Text
                      color={mutedColor}
                      fontSize="sm"
                      mb={8}
                      lineHeight="relaxed"
                    >
                      {card.description}
                    </Text>

                    {/* Link */}
                    <HStack
                      color={textColor}
                      fontWeight="semibold"
                      transition="all 0.3s"
                      _groupHover={{
                        color: "primary.600",
                        transform: "translateX(4px)",
                      }}
                    >
                      <Text>{card.linkText}</Text>
                      <ArrowForwardIcon boxSize={5} />
                    </HStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>

          {/* Footer */}
          <Box
            mt={12}
            pt={6}
            borderTop="1px"
            borderColor={borderColor}
            textAlign={{ base: "center", md: "left" }}
          >
            <Text fontSize="sm" color={mutedColor}>
              © 2026 BeeEnglish Platform. All rights reserved.
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
