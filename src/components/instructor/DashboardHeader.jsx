import {
    Box,
    Alert,
    AlertDescription,
    AlertIcon,
    Flex,
    Heading,
    Select,
    Button,
    HStack,
    useColorModeValue,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Text,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { PRIMARY_COLOR } from "../../constants/instructor";
import CourseStatusBadge from "../CourseStatusBadge";

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

    const handleCourseSelect = (e) => {
        const courseId = Number.parseInt(e.target.value, 10);
        const course = courses.find((c) => c.courseId === courseId);
        onCourseChange(course || null);
    };

    // Chỉ cho xóa khi course đang soạn (chưa xuất bản)
    const canDelete = selectedCourse?.status === "in_progress";
    const isSelectedCourseFlagged = !!selectedCourse?.contentFlagged;

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
                        Course
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
                                {course.contentFlagged ? " [Bị đánh cờ]" : ""}
                            </option>
                        ))}
                    </Select>

                    {selectedCourse && (
                        <>
                            <CourseStatusBadge status={selectedCourse.status} />
                            {isSelectedCourseFlagged && <CourseStatusBadge status="flagged" />}

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
                                        Edit
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem
                                        icon={<DeleteIcon />}
                                        color="red.500"
                                        onClick={() => onDeleteCourse?.(selectedCourse)}
                                        isDisabled={!canDelete}
                                    >
                                        Delete Course
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
                        <option value="">All</option>
                        <option value="in_progress">In Progress</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </Select>

                    {/* Only publish when in progress */}
                    {selectedCourse?.status === "in_progress" && (
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => onPublish?.(selectedCourse.courseId)}
                            isLoading={publishing}
                            loadingText="Publishing..."
                            isDisabled={isSelectedCourseFlagged}
                        >
                            Publish
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
                        Create course
                    </Button>
                </HStack>
            </Flex>

            {isSelectedCourseFlagged && (
                <Alert mt={4} status="error" rounded="md" alignItems="flex-start">
                    <AlertIcon mt={1} />
                    <AlertDescription>
                        <Text fontWeight="semibold" mb={1}>

                            73
                            This course has been taken down by the admin and is now hidden from the public list.
                        </Text>
                        <Text fontSize="sm">
                            {selectedCourse.contentFlaggedReason ||
                                "Chưa có lý do cụ thể. Vui lòng kiểm tra lại nội dung khóa học trước khi tiếp tục."}
                        </Text>
                    </AlertDescription>
                </Alert>
            )}
        </Box>
    );
};

DashboardHeader.propTypes = {
    selectedCourse: PropTypes.shape({
        courseId: PropTypes.number,
        status: PropTypes.string,
        contentFlagged: PropTypes.bool,
        contentFlaggedReason: PropTypes.string,
    }),
    courses: PropTypes.arrayOf(
        PropTypes.shape({
            courseId: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            contentFlagged: PropTypes.bool,
        })
    ).isRequired,
    statusFilter: PropTypes.string.isRequired,
    onCourseChange: PropTypes.func.isRequired,
    onStatusFilterChange: PropTypes.func.isRequired,
    onSubmitForReview: PropTypes.func,
    onPublish: PropTypes.func,
    onReviseCourse: PropTypes.func,
    onOpenCreateModal: PropTypes.func.isRequired,
    onEditCourse: PropTypes.func,
    onDeleteCourse: PropTypes.func,
    submitting: PropTypes.bool,
    publishing: PropTypes.bool,
    revising: PropTypes.bool,
};

export default DashboardHeader;