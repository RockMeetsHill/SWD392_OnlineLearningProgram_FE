import {
    Box,
    Flex,
    VStack,
    Text,
    Button,
    IconButton,
    Divider,
    Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    SchoolIcon,
    DashboardIcon,
    BookIcon,
    SettingsIcon,
    LogoutIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "./Icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const SIDEBAR_BG = "#08121a";

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: DashboardIcon },
        { id: "courses", label: "My Courses", icon: BookIcon },
    ];

    const sidebarWidth = isCollapsed ? "20" : "72";

    return (
        <Box
            w={sidebarWidth}
            bg={SIDEBAR_BG}
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
                        bg={PRIMARY_COLOR}
                        borderRadius="lg"
                        w={10}
                        h={10}
                        align="center"
                        justify="center"
                        flexShrink={0}
                    >
                        <SchoolIcon boxSize={6} color={SIDEBAR_BG} />
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

            {/* Toggle Button when collapsed */}
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
                        bg={PRIMARY_COLOR}
                        color={SIDEBAR_BG}
                    >
                        <Button
                            leftIcon={!isCollapsed ? <item.icon boxSize={5} /> : undefined}
                            justifyContent={isCollapsed ? "center" : "flex-start"}
                            px={isCollapsed ? 0 : 4}
                            py={6}
                            borderRadius="lg"
                            bg={activeTab === item.id ? PRIMARY_COLOR : "transparent"}
                            color={activeTab === item.id ? SIDEBAR_BG : "gray.400"}
                            fontWeight={activeTab === item.id ? "semibold" : "medium"}
                            fontSize="sm"
                            _hover={{
                                bg: activeTab === item.id ? PRIMARY_COLOR : "gray.800",
                                color: activeTab === item.id ? SIDEBAR_BG : "white",
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

export default Sidebar;
