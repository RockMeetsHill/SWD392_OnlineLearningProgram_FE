import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
  Badge,
  Alert,
  AlertIcon,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import { adminDashboardAPI } from "../../services/admin/dashboardService";
import { courseAPI } from "../../services/courseService";

// Custom Icons
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

const ChartIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"
    />
  </Icon>
);

const FlagIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z"
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

const TotalInstructorsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M17.13,17C15.92,18.85 14.11,20.24 12,20.92C9.89,20.24 8.08,18.85 6.87,17C6.53,16.5 6.24,16 6,15.47C6,13.82 8.71,12.47 12,12.47C15.29,12.47 18,13.79 18,15.47C17.76,16 17.47,16.5 17.13,17Z"
    />
  </Icon>
);

const TotalStudentsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"
    />
  </Icon>
);

const TotalCoursesIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V6.5C10.55,5.4 8.45,5 6.5,5Z"
    />
  </Icon>
);

const PendingApprovalsIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
    />
  </Icon>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [statsSummary, setStatsSummary] = useState({
    instructors: 0,
    students: 0,
    courses: 0,
    flaggedCourses: 0,
  });
  const [flaggedCoursesCount, setFlaggedCoursesCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  // Color mode values
  const bgColor = useColorModeValue("#f8f8f5", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("brand.dark", "white");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  const hoverShadow = useColorModeValue("xl", "dark-lg");

  const iconBgBlue = useColorModeValue("blue.50", "blue.900");
  const iconBgGreen = useColorModeValue("green.50", "green.900");
  const iconBgPurple = useColorModeValue("purple.50", "purple.900");
  const iconBgOrange = useColorModeValue("orange.50", "orange.900");

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setIsLoadingStats(true);
        setStatsError("");
        const [stats, coursesData] = await Promise.all([
          adminDashboardAPI.getOverviewStats(),
          courseAPI.getCourses(),
        ]);
        if (!isMounted) return;
        setStatsSummary((prev) => ({ ...prev, ...stats }));
        const coursesList = Array.isArray(coursesData)
          ? coursesData
          : coursesData?.data || coursesData?.courses || [];
        setFlaggedCoursesCount(
          (coursesList || []).filter((course) => course?.contentFlagged).length,
        );
      } catch (error) {
        if (!isMounted) return;
        setStatsError(error.message || "Failed to load dashboard statistics.");
      } finally {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-US").format(value || 0);

  const stats = useMemo(
    () => [
      {
        label: "Instructors",
        value: formatNumber(statsSummary.instructors),
        borderColor: "blue.500",
        icon: TotalInstructorsIcon,
        iconColor: "blue.500",
        iconBg: iconBgBlue,
      },
      {
        label: "Students",
        value: formatNumber(statsSummary.students),
        borderColor: "green.500",
        icon: TotalStudentsIcon,
        iconColor: "green.500",
        iconBg: iconBgGreen,
      },
      {
        label: "Courses",
        value: formatNumber(statsSummary.courses),
        borderColor: "purple.500",
        icon: TotalCoursesIcon,
        iconColor: "purple.500",
        iconBg: iconBgPurple,
      },
      {
        label: "Flagged Courses",
        value: formatNumber(flaggedCoursesCount),
        borderColor: "orange.500",
        icon: FlagIcon,
        iconColor: "orange.500",
        iconBg: iconBgOrange,
      },
    ],
    [
      statsSummary,
      flaggedCoursesCount,
      iconBgBlue,
      iconBgGreen,
      iconBgPurple,
      iconBgOrange,
    ],
  );

  // Feature cards data
  const featureCards = useMemo(
    () => [
      {
        title: "Instructors Management",
        description:
          "Review pending applications, verify certifications, and onboard new teachers to the platform.",
        icon: InstructorApprovalIcon,
        link: "/admin/manage/instructors",
        linkText: "Go to Approvals",
      },
      {
        title: "Students Management",
        description:
          "Update user details, manage enrollments, handle suspensions, and reset student credentials.",
        icon: StudentsIcon,
        link: "/admin/manage/students",
        linkText: "View Student List",
      },
      {
        title: "Course Flags",
        description:
          "Review course content, flag inappropriate courses, and manage content visibility.",
        icon: FlagIcon,
        link: "/admin/course-approvals",
        linkText: "Review Courses",
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
    ],
    [],
  );

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

          {statsError && (
            <Alert status="warning" mb={6} rounded="lg">
              <AlertIcon />
              {statsError}
            </Alert>
          )}

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
            {stats.map((stat) => (
              <Card
                key={stat.label}
                bg={cardBg}
                shadow="sm"
                borderLeftWidth="4px"
                borderLeftColor={stat.borderColor}
              >
                <CardBody p={4}>
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text
                      fontSize="xs"
                      color={mutedColor}
                      textTransform="uppercase"
                      fontWeight="semibold"
                    >
                      {stat.label}
                    </Text>
                    <Box p={2} bg={stat.iconBg} rounded="lg">
                      <stat.icon boxSize={6} color={stat.iconColor} />
                    </Box>
                  </Flex>
                  <Skeleton isLoaded={!isLoadingStats} rounded="md">
                    <Text fontSize="4xl" fontWeight="bold" color={textColor}>
                      {stat.value}
                    </Text>
                  </Skeleton>
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
                  key={card.title}
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
