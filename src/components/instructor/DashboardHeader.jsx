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
    onReviseCourse,
    onOpenCreateModal,
    onEditCourse,
    onDeleteCourse,
    submitting,
    revising,
}) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.800", "white");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { colorScheme: "gray", label: "Nháp" },
            pending: { colorScheme: "yellow", label: "Chờ duyệt" },
            approved: { colorScheme: "green", label: "Đã duyệt" },
            rejected: { colorScheme: "red", label: "Từ chối" },
        };
        const config = statusConfig[status] || { colorScheme: "gray", label: status };
        return <Badge colorScheme={config.colorScheme}>{config.label}</Badge>;
    };

    const handleCourseSelect = (e) => {
        const courseId = parseInt(e.target.value, 10);
        const course = courses.find((c) => c.courseId === courseId);
        onCourseChange(course || null);
    };

    // Kiểm tra xem course có thể xóa được không (chỉ draft và rejected)
    const canDelete = selectedCourse &&
        (selectedCourse.status === "draft" || selectedCourse.status === "rejected");

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
                                        {!canDelete && " (Chỉ xóa được draft/rejected)"}
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
                        <option value="draft">Nháp</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                    </Select>

                    {/* Submit/Revise buttons */}
                    {selectedCourse?.status === "draft" && (
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => onSubmitForReview(selectedCourse.courseId)}
                            isLoading={submitting}
                            loadingText="Đang gửi..."
                        >
                            Gửi duyệt
                        </Button>
                    )}

                    {selectedCourse?.status === "rejected" && (
                        <Button
                            colorScheme="orange"
                            size="sm"
                            onClick={() => onReviseCourse(selectedCourse.courseId)}
                            isLoading={revising}
                            loadingText="Đang xử lý..."
                        >
                            Chỉnh sửa lại
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