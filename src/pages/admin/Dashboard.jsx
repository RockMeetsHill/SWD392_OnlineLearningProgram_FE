import { useState, useEffect } from "react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Heading,
    Button,
    useColorModeValue,
    Card,
    CardBody,
    CardHeader,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    useDisclosure,
    Textarea,
    useToast,
    Spinner,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
    SimpleGrid,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { courseAPI } from "../../services/courseService";
import CourseStatusBadge from "../../components/CourseStatusBadge";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true });
    };

    const [pendingCourses, setPendingCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [rejectNote, setRejectNote] = useState("");

    const {
        isOpen: isApproveOpen,
        onOpen: onApproveOpen,
        onClose: onApproveClose
    } = useDisclosure();

    const {
        isOpen: isRejectOpen,
        onOpen: onRejectOpen,
        onClose: onRejectClose
    } = useDisclosure();

    const {
        isOpen: isDetailOpen,
        onOpen: onDetailOpen,
        onClose: onDetailClose
    } = useDisclosure();

    const bgColor = useColorModeValue("#f8f8f5", "#0A1926");
    const cardBg = useColorModeValue("white", "rgba(30, 41, 59, 0.5)");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");

    // Fetch pending courses
    const fetchPendingCourses = async () => {
        try {
            const data = await courseAPI.getPendingCourses();
            setPendingCourses(data || []);
        } catch (error) {
            console.error("Error fetching pending courses:", error);
            toast({
                title: "Lỗi",
                description: error.message || "Không tải được danh sách chờ duyệt",
                status: "error",
                duration: 3000,
            });
        }
    };

    // Fetch all courses with status filter
    const fetchAllCourses = async (status = null) => {
        try {
            const filters = status ? { status } : {};
            const data = await courseAPI.getCourses(filters);
            setAllCourses(data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast({
                title: "Error",
                description: error.message || "Không tải được danh sách khóa học",
                status: "error",
                duration: 3000,
            });
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchPendingCourses(),
                fetchAllCourses(),
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Handle approve course
    const handleApprove = async () => {
        if (!selectedCourse) return;

        try {
            setProcessing(true);
            await courseAPI.approveCourse(selectedCourse.courseId);

            toast({
                title: "Thành công",
                description: "Đã duyệt khóa học",
                status: "success",
                duration: 3000,
            });

            onApproveClose();
            setSelectedCourse(null);
            await Promise.all([
                fetchPendingCourses(),
                fetchAllCourses(),
            ]);
        } catch (error) {
            console.error("Error approving course:", error);
            toast({
                title: "Error",
                description: error.message || "Duyệt khóa học thất bại",
                status: "error",
                duration: 3000,
            });
        } finally {
            setProcessing(false);
        }
    };

    // Handle reject course
    const handleReject = async () => {
        if (!selectedCourse || !rejectNote.trim()) {
            toast({
                title: "Cần bổ sung",
                description: "Vui lòng nhập lý do từ chối",
                status: "warning",
                duration: 3000,
            });
            return;
        }

        try {
            setProcessing(true);
            await courseAPI.rejectCourse(selectedCourse.courseId, rejectNote);

            toast({
                title: "Thành công",
                description: "Đã từ chối khóa học",
                status: "success",
                duration: 3000,
            });

            onRejectClose();
            setRejectNote("");
            setSelectedCourse(null);
            await Promise.all([
                fetchPendingCourses(),
                fetchAllCourses(),
            ]);
        } catch (error) {
            console.error("Error rejecting course:", error);
            toast({
                title: "Error",
                description: error.message || "Từ chối khóa học thất bại",
                status: "error",
                duration: 3000,
            });
        } finally {
            setProcessing(false);
        }
    };

    const openApproveModal = (course) => {
        setSelectedCourse(course);
        onApproveOpen();
    };

    const openRejectModal = (course) => {
        setSelectedCourse(course);
        setRejectNote("");
        onRejectOpen();
    };

    const openDetailModal = (course) => {
        setSelectedCourse(course);
        onDetailOpen();
    };

    const CourseCard = ({ course }) => (
        <Card
            bg={cardBg}
            border="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
            borderRadius="xl"
            overflow="hidden"
            _hover={{
                boxShadow: "lg",
                transform: "translateY(-2px)",
            }}
            transition="all 0.2s"
        >
            <CardHeader pb={2}>
                <Flex justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex={1}>
                        <Heading size="md" color={textColor} noOfLines={2}>
                            {course.title}
                        </Heading>
                        <Text fontSize="sm" color={mutedColor}>
                            Instructor: {course.instructor?.fullName || "—"}
                        </Text>
                    </VStack>
                    <CourseStatusBadge status={course.status} />
                </Flex>
            </CardHeader>
            <CardBody pt={0}>
                <VStack align="stretch" spacing={4}>
                    {course.thumbnailUrl && (
                        <Image
                            src={course.thumbnailUrl}
                            alt={course.title}
                            borderRadius="md"
                            maxH="200px"
                            objectFit="cover"
                        />
                    )}
                    <Text fontSize="sm" color={mutedColor} noOfLines={3}>
                        {course.description || "Chưa có mô tả"}
                    </Text>
                    <HStack justify="space-between" fontSize="xs" color={mutedColor}>
                        <Text>
                            {course.modules?.length || 0} module
                        </Text>
                        <Text>
                            {course.modules?.reduce((sum, m) => sum + (m._count?.lessons || 0), 0) || 0} bài học
                        </Text>
                        <Text>
                            {new Date(course.createdAt).toLocaleDateString()}
                        </Text>
                    </HStack>
                    {course.status === "pending_review" && (
                        <HStack spacing={2}>
                            <Button
                                colorScheme="green"
                                size="sm"
                                flex={1}
                                onClick={() => openApproveModal(course)}
                            >
                                Duyệt
                            </Button>
                            <Button
                                colorScheme="red"
                                size="sm"
                                flex={1}
                                onClick={() => openRejectModal(course)}
                            >
                                Từ chối
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDetailModal(course)}
                            >
                                Xem chi tiết
                            </Button>
                        </HStack>
                    )}
                    {course.status !== "pending_review" && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailModal(course)}
                        >
                            Xem chi tiết
                        </Button>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );

    return (
        <Box bg={bgColor} minH="100vh" p={8}>
            <VStack spacing={6} align="stretch" maxW="1400px" mx="auto">
                <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <Box>
                        <Breadcrumb fontWeight="medium" color={mutedColor}>
                            <BreadcrumbItem>
                                <BreadcrumbLink as={RouterLink} to="/admin/dashboard" color="blue.500">
                                    Admin
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <BreadcrumbLink href="#" color={mutedColor}>
                                    Duyệt bài
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <Heading color={textColor} size="xl" mt={2}>
                            Duyệt bài của Instructor
                        </Heading>
                        <Text color={mutedColor}>
                            Xem và duyệt/từ chối khóa học do instructor gửi lên
                        </Text>
                    </Box>
                    <Button
                        variant="outline"
                        colorScheme="red"
                        size="sm"
                        onClick={handleLogout}
                    >
                        Đăng xuất
                    </Button>
                </Flex>

                {loading ? (
                    <Flex justify="center" align="center" minH="400px">
                        <Spinner size="xl" />
                    </Flex>
                ) : (
                    <Tabs colorScheme="blue">
                        <TabList>
                            <Tab>
                                Chờ duyệt ({pendingCourses.length})
                            </Tab>
                            <Tab>Tất cả khóa học</Tab>
                        </TabList>

                        <TabPanels>
                            {/* Pending Review Tab */}
                            <TabPanel>
                                {pendingCourses.length === 0 ? (
                                    <VStack textAlign="center" py={20} spacing={3}>
                                        <Box
                                            fontSize="4xl"
                                            aria-hidden
                                        >
                                            📋
                                        </Box>
                                        <Text color={mutedColor} fontSize="lg" fontWeight="medium">
                                            Chưa có bài chờ duyệt
                                        </Text>
                                        <Text color={mutedColor} fontSize="sm">
                                            Khi instructor gửi khóa học lên, bài sẽ hiện tại đây.
                                        </Text>
                                    </VStack>
                                ) : (
                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                        {pendingCourses.map((course) => (
                                            <CourseCard key={course.courseId} course={course} />
                                        ))}
                                    </SimpleGrid>
                                )}
                            </TabPanel>

                            {/* All Courses Tab */}
                            <TabPanel>
                                <VStack spacing={4} align="stretch">
                                    <HStack spacing={4}>
                                        <Button
                                            size="sm"
                                            variant={allCourses.length === 0 ? "solid" : "outline"}
                                            onClick={() => fetchAllCourses()}
                                        >
                                            Tất cả
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => fetchAllCourses("pending_review")}
                                        >
                                            Chờ duyệt
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => fetchAllCourses("approved_upload")}
                                        >
                                            Đã duyệt
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => fetchAllCourses("rejected")}
                                        >
                                            Từ chối
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => fetchAllCourses("published")}
                                        >
                                            Đã xuất bản
                                        </Button>
                                    </HStack>
                                    {allCourses.length === 0 ? (
                                        <VStack textAlign="center" py={20} spacing={3}>
                                            <Box fontSize="4xl" aria-hidden>
                                                📚
                                            </Box>
                                            <Text color={mutedColor} fontSize="lg">
                                                Không có khóa học
                                            </Text>
                                        </VStack>
                                    ) : (
                                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                            {allCourses.map((course) => (
                                                <CourseCard key={course.courseId} course={course} />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                )}

                {/* Approve Modal */}
                <Modal isOpen={isApproveOpen} onClose={onApproveClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Duyệt khóa học</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Bạn chắc chắn muốn duyệt "{selectedCourse?.title}"?
                            </Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onApproveClose}>
                                Hủy
                            </Button>
                            <Button
                                colorScheme="green"
                                onClick={handleApprove}
                                isLoading={processing}
                            >
                                Duyệt
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Reject Modal */}
                <Modal isOpen={isRejectOpen} onClose={onRejectClose} isCentered size="lg">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Từ chối khóa học</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4} align="stretch">
                                <Text>
                                    Nhập lý do từ chối "{selectedCourse?.title}":
                                </Text>
                                <Textarea
                                    value={rejectNote}
                                    onChange={(e) => setRejectNote(e.target.value)}
                                    placeholder="Lý do từ chối (bắt buộc)..."
                                    rows={5}
                                />
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onRejectClose}>
                                Hủy
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleReject}
                                isLoading={processing}
                                isDisabled={!rejectNote.trim()}
                            >
                                Từ chối
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Course Detail Modal */}
                <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="xl" scrollBehavior="inside">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            <VStack align="start" spacing={2}>
                                <Text>{selectedCourse?.title}</Text>
                                <CourseStatusBadge status={selectedCourse?.status} />
                            </VStack>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {selectedCourse && (
                                <VStack spacing={4} align="stretch">
                                    <Box>
                                        <Text fontWeight="bold" mb={2}>Mô tả</Text>
                                        <Text color={mutedColor}>
                                            {selectedCourse.description || "Chưa có mô tả"}
                                        </Text>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Text fontWeight="bold" mb={2}>Instructor</Text>
                                        <Text color={mutedColor}>
                                            {selectedCourse.instructor?.fullName || "—"}
                                        </Text>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Text fontWeight="bold" mb={2}>Cấu trúc khóa học</Text>
                                        <VStack align="stretch" spacing={2}>
                                            {selectedCourse.modules?.map((module, idx) => (
                                                <Box key={module.moduleId || idx} pl={4} borderLeft="2px" borderColor="blue.200">
                                                    <Text fontWeight="medium">{module.title}</Text>
                                                    <Text fontSize="sm" color={mutedColor}>
                                                        {module._count?.lessons || 0} bài học
                                                    </Text>
                                                </Box>
                                            ))}
                                        </VStack>
                                    </Box>
                                    {selectedCourse.adminNote && (
                                        <>
                                            <Divider />
                                            <Box>
                                                <Text fontWeight="bold" mb={2} color="red.500">
                                                    Ghi chú admin (lý do từ chối)
                                                </Text>
                                                <Text color={mutedColor}>
                                                    {selectedCourse.adminNote}
                                                </Text>
                                            </Box>
                                        </>
                                    )}
                                </VStack>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onDetailClose}>Đóng</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </VStack>
        </Box>
    );
};

export default AdminDashboard;
