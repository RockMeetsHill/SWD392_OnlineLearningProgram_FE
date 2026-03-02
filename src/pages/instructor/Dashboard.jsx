import { useState } from "react";
import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useAuth } from "../../context/AuthContext";
import { useInstructorCourses } from "../../hooks/useInstructorCourses";
import Sidebar from "../../components/instructor/Sidebar";
import DashboardHeader from "../../components/instructor/DashboardHeader";
import DashboardContent from "../../components/instructor/DashboardContent";
import EmptyState from "../../components/instructor/EmptyState";
import CreateCourseModal from "../../components/instructor/CreateCourseModal";
import EditCourseModal from "../../components/instructor/EditCourseModal";
import DeleteCourseModal from "../../components/instructor/DeleteCourseModal";

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("courses");
    const [statusFilter, setStatusFilter] = useState("");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

    // State cho Edit Course Modal
    const [editCourseModal, setEditCourseModal] = useState({
        isOpen: false,
        course: null,
    });

    // State cho Delete Course Modal
    const [deleteCourseModal, setDeleteCourseModal] = useState({
        isOpen: false,
        course: null,
    });

    const {
        courses,
        selectedCourse,
        setSelectedCourse,
        loading,
        submitting,
        revising,
        submitForReview,
        reviseCourse,
        refetch,
    } = useInstructorCourses(user?.userId, statusFilter);

    const bgColor = useColorModeValue("#f8f8f5", "#0A1926");
    const mainMarginLeft = isSidebarCollapsed ? "20" : "72";

    const handleToggleModule = (moduleId) => {
        if (!selectedCourse) return;

        const updatedModules = selectedCourse.modules.map((m) =>
            (m.moduleId || m.id) === moduleId
                ? { ...m, isExpanded: !m.isExpanded }
                : m
        );

        setSelectedCourse({
            ...selectedCourse,
            modules: updatedModules,
        });
    };

    const handleSubmitForReview = async (courseId) => {
        await submitForReview(courseId);
    };

    const handleReviseCourse = async (courseId) => {
        await reviseCourse(courseId);
    };

    // Mở modal edit course
    const handleEditCourse = (course) => {
        setEditCourseModal({
            isOpen: true,
            course: course,
        });
    };

    // Đóng modal edit course
    const handleCloseEditModal = () => {
        setEditCourseModal({
            isOpen: false,
            course: null,
        });
    };

    // Callback khi course được update thành công
    const handleCourseUpdated = (updatedCourse) => {
        refetch();
        if (selectedCourse?.courseId === updatedCourse.courseId) {
            setSelectedCourse(updatedCourse);
        }
    };

    // Mở modal delete course
    const handleDeleteCourse = (course) => {
        setDeleteCourseModal({
            isOpen: true,
            course: course,
        });
    };

    // Đóng modal delete course
    const handleCloseDeleteModal = () => {
        setDeleteCourseModal({
            isOpen: false,
            course: null,
        });
    };

    // Callback khi course bị xóa thành công
    const handleCourseDeleted = (deletedCourseId) => {
        // Reset selected course nếu đang chọn course vừa xóa
        if (selectedCourse?.courseId === deletedCourseId) {
            setSelectedCourse(null);
        }
        // Refetch danh sách courses
        refetch();
    };

    return (
        <Box bg={bgColor} minH="100vh">
            <Flex>
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                <Box
                    flex={1}
                    ml={mainMarginLeft}
                    minH="100vh"
                    transition="margin-left 0.3s ease"
                >
                    <DashboardHeader
                        selectedCourse={selectedCourse}
                        courses={courses}
                        statusFilter={statusFilter}
                        onCourseChange={setSelectedCourse}
                        onStatusFilterChange={setStatusFilter}
                        onSubmitForReview={handleSubmitForReview}
                        onReviseCourse={handleReviseCourse}
                        onOpenCreateModal={onCreateOpen}
                        onEditCourse={handleEditCourse}
                        onDeleteCourse={handleDeleteCourse}
                        submitting={submitting}
                        revising={revising}
                    />

                    {/* Create Course Modal */}
                    <CreateCourseModal
                        isOpen={isCreateOpen}
                        onClose={onCreateClose}
                        onSuccess={refetch}
                    />

                    {/* Edit Course Modal */}
                    <EditCourseModal
                        isOpen={editCourseModal.isOpen}
                        onClose={handleCloseEditModal}
                        course={editCourseModal.course}
                        onCourseUpdated={handleCourseUpdated}
                    />

                    {/* Delete Course Modal */}
                    <DeleteCourseModal
                        isOpen={deleteCourseModal.isOpen}
                        onClose={handleCloseDeleteModal}
                        course={deleteCourseModal.course}
                        onCourseDeleted={handleCourseDeleted}
                    />

                    {courses.length === 0 && !loading ? (
                        <EmptyState
                            message="No courses found. Create your first course to get started."
                            onCreateClick={onCreateOpen}
                        />
                    ) : !selectedCourse && !loading ? (
                        <EmptyState message="Please select a course from the dropdown above." />
                    ) : (
                        <DashboardContent
                            courseId={selectedCourse?.courseId}
                            modules={selectedCourse?.modules || []}
                            loading={loading}
                            onToggleModule={handleToggleModule}
                            onRefetch={refetch}
                        />
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

export default InstructorDashboard;