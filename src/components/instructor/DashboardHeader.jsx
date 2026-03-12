import {
    Box,
    Flex,
    Heading,
    Select,
    Button,
    HStack,
    useColorModeValue,
    Badge,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import { PRIMARY_COLOR } from "../../constants/instructor";

const DashboardHeader = ({
    selectedCourse,
    courses,
    statusFilter,
    onCourseChange,
    onStatusFilterChange,
    onSubmitForReview,
    onPublish,
    onReviseCourse,
    onOpenCreateModal,
    onEditCourse,
    onDeleteCourse,
    submitting,
    publishing,
    revising,
}) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const getStatusBadge = (status) => {
        const statusConfig = {
            in_progress: { colorScheme: "gray", label: "Đang soạn" },
            published: { colorScheme: "green", label: "Đã xuất bản" },
            archived: { colorScheme: "orange", label: "Lưu trữ" },
        };
        const config = statusConfig[status] || { colorScheme: "gray", label: status };
        return <Badge colorScheme={config.colorScheme}>{config.label}</Badge>;
    };

    const handleCourseSelect = (e) => {
        const courseId = parseInt(e.target.value, 10);
        const course = courses.find((c) => c.courseId === courseId);
        onCourseChange(course || null);
    };

    // Chỉ cho xóa khi course đang soạn (chưa xuất bản)
    const canDelete = selectedCourse && selectedCourse.status === "in_progress";

    return (
        <Box
            bg={bgColor}
            px={6}
            py={4}
            borderBottom="1px"
            borderColor={borderColor}
            position="sticky"
            top={0}
            zIndex={10}
        >
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                {/* Left side - Course selection */}
                <HStack spacing={4} flex={1} minW="300px">
                    <Heading size="md" color={textColor} whiteSpace="nowrap">
                        Khóa học:
                    </Heading>

                    <Select
                        value={selectedCourse?.courseId || ""}
                        onChange={handleCourseSelect}
                        maxW="300px"
                        placeholder="Chọn khóa học"
                    >
                        {courses.map((course) => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.title}
                            </option>
                        ))}
                    </Select>

                    {selectedCourse && (
                        <>
                            {getStatusBadge(selectedCourse.status)}

                            {/* Menu actions cho course */}
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    icon={<HamburgerIcon />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Course actions"
                                />
                                <MenuList>
                                    <MenuItem
                                        icon={<EditIcon />}
                                        onClick={() => onEditCourse?.(selectedCourse)}
                                    >
                                        Chỉnh sửa
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem
                                        icon={<DeleteIcon />}
                                        color="red.500"
                                        onClick={() => onDeleteCourse?.(selectedCourse)}
                                        isDisabled={!canDelete}
                                    >
                                        Xóa khóa học
                                        {!canDelete && " (Chỉ xóa được khi đang soạn)"}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    )}
                </HStack>

                {/* Right side - Actions */}
                <HStack spacing={3}>
                    {/* Filter by status */}
                    <Select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        maxW="150px"
                        size="sm"
                    >
                        <option value="">Tất cả</option>
                        <option value="in_progress">Đang soạn</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="archived">Lưu trữ</option>
                    </Select>

                    {/* Chỉ xuất bản khi đang soạn */}
                    {selectedCourse?.status === "in_progress" && (
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => onPublish?.(selectedCourse.courseId)}
                            isLoading={publishing}
                            loadingText="Đang xuất bản..."
                        >
                            Xuất bản
                        </Button>
                    )}

                    {/* Create new course button */}
                    <Button
                        leftIcon={<AddIcon />}
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        size="sm"
                        onClick={onOpenCreateModal}
                        _hover={{ opacity: 0.8 }}
                    >
                        Tạo khóa học
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
};

export default DashboardHeader;