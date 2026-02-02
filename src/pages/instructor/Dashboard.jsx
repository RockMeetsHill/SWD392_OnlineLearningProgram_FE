import { useState } from "react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Heading,
    Button,
    IconButton,
    Icon,
    Divider,
    useColorModeValue,
    Collapse,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Custom Icons
const SchoolIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
        />
    </Icon>
);

const DashboardIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
        />
    </Icon>
);

const BookIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"
        />
    </Icon>
);

const DragIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        />
    </Icon>
);

const ExpandMoreIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </Icon>
);

const ChevronRightIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </Icon>
);

const ChevronLeftIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </Icon>
);

const MenuIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </Icon>
);

const EditIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        />
    </Icon>
);

const DeleteIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        />
    </Icon>
);

const VideoIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
        />
    </Icon>
);

const QuizIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
        />
    </Icon>
);

const SettingsIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
        />
    </Icon>
);

const AddCircleIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
        />
    </Icon>
);

const AddIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </Icon>
);

const CheckCircleIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        />
    </Icon>
);

const AssignmentIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
        />
    </Icon>
);

const CloudUploadIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
        />
    </Icon>
);

const LogoutIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
        <path
            fill="currentColor"
            d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
        />
    </Icon>
);

// Mock data for courses
const mockModules = [
    {
        id: 1,
        title: "Module 1: Getting Started with English Basics",
        lessonsCount: 3,
        duration: "45 Minutes",
        isExpanded: true,
        lessons: [
            {
                id: "1.1",
                title: "Common Greetings & Introductions",
                hasVideo: false,
                hasQuiz: false,
            },
            {
                id: "1.2",
                title: "The English Alphabet & Phonetics",
                hasVideo: true,
                hasQuiz: false,
            },
            {
                id: "1.3",
                title: "Basic Sentence Structure",
                hasVideo: true,
                hasQuiz: true,
            },
        ],
    },
    {
        id: 2,
        title: "Module 2: Essential Daily Vocabulary",
        lessonsCount: 5,
        duration: "1h 20m",
        isExpanded: true,
        lessons: [
            {
                id: "2.1",
                title: "Food, Drinks & Ordering at Restaurants",
                hasVideo: true,
                hasQuiz: true,
            },
        ],
    },
    {
        id: 3,
        title: "Module 3: Intermediate Grammar Structures",
        lessonsCount: 4,
        duration: "2h 00m",
        isExpanded: false,
        lessons: [],
    },
];

// Sidebar Component với tính năng thu gọn
const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const sidebarBg = "#08121a";
    const primaryColor = "#FDE80B";

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
        { id: "courses", label: "My Courses", icon: BookIcon },
    ];

    // Chiều rộng sidebar
    const sidebarWidth = isCollapsed ? "20" : "72";

    return (
        <Box
            w={sidebarWidth}
            bg={sidebarBg}
            borderRight="1px"
            borderColor="gray.800"
            position="fixed"
            h="100vh"
            display="flex"
            flexDirection="column"
            zIndex={10}
            transition="width 0.3s ease"
        >
            {/* Logo & Toggle Button */}
            <Flex p={isCollapsed ? 4 : 6} align="center" justify={isCollapsed ? "center" : "space-between"}>
                <Flex align="center" gap={3}>
                    <Flex
                        bg={primaryColor}
                        borderRadius="lg"
                        w={10}
                        h={10}
                        align="center"
                        justify="center"
                        flexShrink={0}
                    >
                        <SchoolIcon boxSize={6} color={sidebarBg} />
                    </Flex>
                    {!isCollapsed && (
                        <Box>
                            <Text color="white" fontSize="lg" fontWeight="bold" lineHeight="tight">
                                BeeEnglish
                            </Text>
                            <Text color="gray.400" fontSize="xs">
                                Instructor Panel
                            </Text>
                        </Box>
                    )}
                </Flex>
                {!isCollapsed && (
                    <IconButton
                        icon={<ChevronLeftIcon boxSize={5} />}
                        variant="ghost"
                        size="sm"
                        color="gray.400"
                        _hover={{ color: "white", bg: "gray.800" }}
                        onClick={() => setIsCollapsed(true)}
                        aria-label="Collapse sidebar"
                    />
                )}
            </Flex>

            {/* Toggle Button khi collapsed */}
            {isCollapsed && (
                <Flex justify="center" mb={4}>
                    <IconButton
                        icon={<ChevronRightIcon boxSize={5} />}
                        variant="ghost"
                        size="sm"
                        color="gray.400"
                        _hover={{ color: "white", bg: "gray.800" }}
                        onClick={() => setIsCollapsed(false)}
                        aria-label="Expand sidebar"
                    />
                </Flex>
            )}

            {/* Navigation */}
            <VStack flex={1} px={isCollapsed ? 2 : 4} mt={4} spacing={2} align="stretch">
                {menuItems.map((item) => (
                    <Tooltip
                        key={item.id}
                        label={item.label}
                        placement="right"
                        isDisabled={!isCollapsed}
                        hasArrow
                        bg={primaryColor}
                        color={sidebarBg}
                    >
                        <Button
                            leftIcon={!isCollapsed ? <item.icon boxSize={5} /> : undefined}
                            justifyContent={isCollapsed ? "center" : "flex-start"}
                            px={isCollapsed ? 0 : 4}
                            py={6}
                            borderRadius="lg"
                            bg={activeTab === item.id ? primaryColor : "transparent"}
                            color={activeTab === item.id ? sidebarBg : "gray.400"}
                            fontWeight={activeTab === item.id ? "semibold" : "medium"}
                            fontSize="sm"
                            _hover={{
                                bg: activeTab === item.id ? primaryColor : "gray.800",
                                color: activeTab === item.id ? sidebarBg : "white",
                            }}
                            onClick={() => setActiveTab(item.id)}
                            minW={isCollapsed ? "auto" : undefined}
                        >
                            {isCollapsed ? (
                                <item.icon boxSize={5} />
                            ) : (
                                item.label
                            )}
                        </Button>
                    </Tooltip>
                ))}

                {/* Spacer */}
                <Box flex={1} />

                {/* Settings & Logout */}
                <Divider borderColor="gray.800" my={2} />

                <Tooltip
                    label="Settings"
                    placement="right"
                    isDisabled={!isCollapsed}
                    hasArrow
                    bg="gray.700"
                    color="white"
                >
                    <Button
                        leftIcon={!isCollapsed ? <SettingsIcon boxSize={5} /> : undefined}
                        justifyContent={isCollapsed ? "center" : "flex-start"}
                        px={isCollapsed ? 0 : 4}
                        py={6}
                        borderRadius="lg"
                        bg="transparent"
                        color="gray.400"
                        fontWeight="medium"
                        fontSize="sm"
                        _hover={{ bg: "gray.800", color: "white" }}
                    >
                        {isCollapsed ? <SettingsIcon boxSize={5} /> : "Settings"}
                    </Button>
                </Tooltip>

                <Tooltip
                    label="Logout"
                    placement="right"
                    isDisabled={!isCollapsed}
                    hasArrow
                    bg="red.500"
                    color="white"
                >
                    <Button
                        leftIcon={!isCollapsed ? <LogoutIcon boxSize={5} /> : undefined}
                        justifyContent={isCollapsed ? "center" : "flex-start"}
                        px={isCollapsed ? 0 : 4}
                        py={6}
                        borderRadius="lg"
                        bg="transparent"
                        color="gray.400"
                        fontWeight="medium"
                        fontSize="sm"
                        _hover={{ bg: "red.900", color: "red.300" }}
                        onClick={handleLogout}
                        mb={4}
                    >
                        {isCollapsed ? <LogoutIcon boxSize={5} /> : "Logout"}
                    </Button>
                </Tooltip>
            </VStack>
        </Box>
    );
};

// Module Component
const ModuleCard = ({ module, onToggle }) => {
    const cardBg = useColorModeValue("white", "rgba(30, 41, 59, 0.4)");
    const headerBg = useColorModeValue("gray.50", "rgba(30, 41, 59, 0.2)");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const lessonBg = useColorModeValue("white", "#0A1926");
    const lessonBorder = useColorModeValue("gray.100", "gray.700");
    const primaryColor = "#FDE80B";

    return (
        <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
            overflow="hidden"
        >
            {/* Module Header */}
            <Flex
                p={5}
                align="center"
                gap={4}
                borderBottom={module.isExpanded ? "1px" : "none"}
                borderColor={borderColor}
                bg={headerBg}
            >
                <DragIcon color="gray.400" boxSize={5} cursor="grab" />
                <IconButton
                    icon={
                        module.isExpanded ? (
                            <ExpandMoreIcon boxSize={5} />
                        ) : (
                            <ChevronRightIcon boxSize={5} />
                        )
                    }
                    variant="ghost"
                    size="sm"
                    color="gray.400"
                    onClick={() => onToggle(module.id)}
                    aria-label="Toggle module"
                />
                <Box flex={1}>
                    <Text color={textColor} fontWeight="bold" fontSize="lg">
                        {module.title}
                    </Text>
                    <Text color={mutedColor} fontSize="sm" mt={1}>
                        {module.lessonsCount} Lessons • {module.duration} Total
                    </Text>
                </Box>
                <HStack spacing={2}>
                    <IconButton
                        icon={<EditIcon boxSize={5} />}
                        variant="ghost"
                        size="md"
                        color="gray.400"
                        _hover={{ color: textColor, bg: useColorModeValue("gray.100", "gray.700") }}
                        aria-label="Edit module"
                    />
                    <IconButton
                        icon={<DeleteIcon boxSize={5} />}
                        variant="ghost"
                        size="md"
                        color="gray.400"
                        _hover={{ color: "red.500", bg: "red.50" }}
                        aria-label="Delete module"
                    />
                </HStack>
            </Flex>

            {/* Lessons */}
            <Collapse in={module.isExpanded}>
                <VStack p={5} spacing={4} align="stretch">
                    {module.lessons.map((lesson) => (
                        <Flex
                            key={lesson.id}
                            align="center"
                            gap={4}
                            p={4}
                            bg={lessonBg}
                            borderRadius="lg"
                            border="1px"
                            borderColor={lessonBorder}
                            _hover={{ borderColor: `${primaryColor}50`, shadow: "sm" }}
                            transition="all 0.2s"
                        >
                            <DragIcon color="gray.300" boxSize={5} cursor="grab" />
                            <Box flex={1}>
                                <HStack spacing={3}>
                                    <Text fontSize="sm" fontWeight="bold" color={primaryColor}>
                                        {lesson.id}
                                    </Text>
                                    <Text
                                        fontSize="md"
                                        fontWeight="semibold"
                                        color={textColor}
                                    >
                                        {lesson.title}
                                    </Text>
                                </HStack>
                            </Box>
                            <HStack spacing={4}>
                                {lesson.hasVideo ? (
                                    <HStack spacing={2} px={3} py={1.5} bg="green.50" borderRadius="md">
                                        <CheckCircleIcon color="green.500" boxSize={4} />
                                        <Text
                                            fontSize="xs"
                                            fontWeight="bold"
                                            color="green.600"
                                            textTransform="uppercase"
                                        >
                                            Video Ready
                                        </Text>
                                    </HStack>
                                ) : (
                                    <Button
                                        size="sm"
                                        leftIcon={<VideoIcon boxSize={4} />}
                                        bg={useColorModeValue("gray.100", "gray.800")}
                                        color={useColorModeValue("gray.600", "gray.300")}
                                        fontWeight="bold"
                                        _hover={{
                                            bg: `${primaryColor}20`,
                                            color: primaryColor,
                                        }}
                                    >
                                        Upload Video
                                    </Button>
                                )}
                                {lesson.hasQuiz ? (
                                    <HStack spacing={2} px={3} py={1.5} bg={`${primaryColor}15`} borderRadius="md">
                                        <AssignmentIcon color={primaryColor} boxSize={4} />
                                        <Text
                                            fontSize="xs"
                                            fontWeight="bold"
                                            color={useColorModeValue("gray.700", "gray.300")}
                                            textTransform="uppercase"
                                        >
                                            Quiz Active
                                        </Text>
                                    </HStack>
                                ) : (
                                    <Button
                                        size="sm"
                                        leftIcon={<QuizIcon boxSize={4} />}
                                        bg={useColorModeValue("gray.100", "gray.800")}
                                        color={useColorModeValue("gray.600", "gray.300")}
                                        fontWeight="bold"
                                        _hover={{
                                            bg: `${primaryColor}20`,
                                            color: primaryColor,
                                        }}
                                    >
                                        Add Quiz
                                    </Button>
                                )}
                                <Divider
                                    orientation="vertical"
                                    h={6}
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                />
                                <IconButton
                                    icon={<SettingsIcon boxSize={5} />}
                                    variant="ghost"
                                    size="sm"
                                    color="gray.400"
                                    _hover={{ color: textColor }}
                                    aria-label="Lesson settings"
                                />
                            </HStack>
                        </Flex>
                    ))}

                    {/* Add Lesson Button */}
                    <Button
                        w="full"
                        py={4}
                        variant="outline"
                        borderWidth={2}
                        borderStyle="dashed"
                        borderColor={useColorModeValue("gray.300", "gray.700")}
                        borderRadius="lg"
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="bold"
                        leftIcon={<AddIcon boxSize={5} />}
                        _hover={{
                            color: primaryColor,
                            borderColor: primaryColor,
                            bg: `${primaryColor}05`,
                        }}
                    >
                        Add New Lesson to Module {module.id}
                    </Button>
                </VStack>
            </Collapse>
        </Box>
    );
};

// Main Dashboard Component
const InstructorDashboard = () => {
    const [activeTab, setActiveTab] = useState("courses");
    const [modules, setModules] = useState(mockModules);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bgColor = useColorModeValue("#f8f8f5", "#0A1926");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const primaryColor = "#FDE80B";

    // Margin left động theo trạng thái sidebar
    const mainMarginLeft = isSidebarCollapsed ? "20" : "72";

    const toggleModule = (moduleId) => {
        setModules((prev) =>
            prev.map((m) => (m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m))
        );
    };

    const totalModules = modules.length;
    const totalLessons = modules.reduce((acc, m) => acc + m.lessonsCount, 0);

    return (
        <Box bg={bgColor} minH="100vh">
            <Flex>
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                {/* Main Content - Full Width */}
                <Box
                    flex={1}
                    ml={mainMarginLeft}
                    minH="100vh"
                    transition="margin-left 0.3s ease"
                >
                    {/* Header */}
                    <Box
                        bg={useColorModeValue("white", "rgba(30, 41, 59, 0.3)")}
                        borderBottom="1px"
                        borderColor={useColorModeValue("gray.200", "gray.800")}
                        px={10}
                        py={6}
                        position="sticky"
                        top={0}
                        zIndex={5}
                        backdropFilter="blur(10px)"
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                            maxW="full"
                        >
                            <Box>
                                <Heading
                                    color={textColor}
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    letterSpacing="tight"
                                >
                                    Course Curriculum Builder
                                </Heading>
                                <Text color={mutedColor} fontSize="sm" mt={1}>
                                    Design and organize your course modules and lessons
                                </Text>
                            </Box>
                            <HStack spacing={4}>
                                <Button
                                    bg={useColorModeValue("gray.100", "gray.800")}
                                    color={textColor}
                                    fontWeight="semibold"
                                    fontSize="sm"
                                    px={6}
                                    _hover={{
                                        bg: useColorModeValue("gray.200", "gray.700"),
                                    }}
                                >
                                    Preview Course
                                </Button>
                                <Button
                                    bg={primaryColor}
                                    color="#0A1926"
                                    fontWeight="bold"
                                    fontSize="sm"
                                    px={6}
                                    _hover={{ opacity: 0.9 }}
                                    boxShadow={`0 4px 14px ${primaryColor}30`}
                                >
                                    Save Changes
                                </Button>
                            </HStack>
                        </Flex>
                    </Box>

                    {/* Content */}
                    <Box px={10} py={8}>
                        {/* Stats Bar */}
                        <Flex justify="space-between" align="center" mb={8}>
                            <HStack spacing={6}>
                                <HStack
                                    bg={useColorModeValue("white", "rgba(30, 41, 59, 0.5)")}
                                    px={5}
                                    py={3}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                >
                                    <Text color={mutedColor} fontSize="sm" fontWeight="medium">
                                        Modules:
                                    </Text>
                                    <Text color={textColor} fontSize="lg" fontWeight="bold">
                                        {totalModules}
                                    </Text>
                                </HStack>
                                <HStack
                                    bg={useColorModeValue("white", "rgba(30, 41, 59, 0.5)")}
                                    px={5}
                                    py={3}
                                    borderRadius="xl"
                                    border="1px"
                                    borderColor={useColorModeValue("gray.200", "gray.700")}
                                >
                                    <Text color={mutedColor} fontSize="sm" fontWeight="medium">
                                        Total Lessons:
                                    </Text>
                                    <Text color={textColor} fontSize="lg" fontWeight="bold">
                                        {totalLessons}
                                    </Text>
                                </HStack>
                            </HStack>
                            <Button
                                leftIcon={<AddCircleIcon boxSize={5} />}
                                bg={primaryColor}
                                color="#0A1926"
                                fontWeight="bold"
                                fontSize="sm"
                                px={6}
                                py={6}
                                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                                boxShadow={`0 4px 14px ${primaryColor}30`}
                                transition="all 0.2s"
                            >
                                Add New Module
                            </Button>
                        </Flex>

                        {/* Modules List */}
                        <VStack spacing={6} align="stretch">
                            {modules.map((module) => (
                                <ModuleCard
                                    key={module.id}
                                    module={module}
                                    onToggle={toggleModule}
                                />
                            ))}
                        </VStack>
                    </Box>
                </Box>
            </Flex>

            {/* Upload Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
                <ModalContent
                    bg={useColorModeValue("white", "gray.900")}
                    borderRadius="2xl"
                    border="1px"
                    borderColor="gray.800"
                >
                    <ModalHeader borderBottom="1px" borderColor="gray.800">
                        Upload Lesson Video
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody p={10}>
                        <VStack
                            border="2px dashed"
                            borderColor={`${primaryColor}40`}
                            borderRadius="xl"
                            p={12}
                            bg={`${primaryColor}05`}
                            spacing={4}
                        >
                            <CloudUploadIcon boxSize={16} color={primaryColor} />
                            <Heading size="md">Select files to upload</Heading>
                            <Text color={mutedColor} fontSize="sm">
                                Drag and drop MP4 or MOV files here
                            </Text>
                            <Button
                                mt={4}
                                bg={primaryColor}
                                color="#0A1926"
                                fontWeight="bold"
                                px={8}
                                py={6}
                            >
                                Browse Files
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default InstructorDashboard;