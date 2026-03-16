import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Badge,
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Spinner,
    Text,
    Textarea,
    VStack,
    useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import Sidebar from "../../components/instructor/Sidebar";
import assignmentAPI from "../../services/assignmentService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const AssignmentGrading = () => {
    const { lessonId } = useParams();
    const toast = useToast();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [gradeDrafts, setGradeDrafts] = useState({});
    const [feedbackDrafts, setFeedbackDrafts] = useState({});
    const [savingSubmissionId, setSavingSubmissionId] = useState(null);

    const bgColor = useColorModeValue("#f8f8f5", "#0A1926");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const mainMarginLeft = isSidebarCollapsed ? "20" : "72";

    const loadSubmissions = async () => {
        if (!lessonId) return;
        setLoading(true);
        setErrorMessage("");

        try {
            const data = await assignmentAPI.listLessonSubmissions(lessonId);
            setPayload(data);
            setGradeDrafts(
                Object.fromEntries((data.submissions || []).map((item) => [item.submissionId, item.grade ?? ""]))
            );
            setFeedbackDrafts(
                Object.fromEntries((data.submissions || []).map((item) => [item.submissionId, item.feedback || ""]))
            );
        } catch (error) {
            setErrorMessage(error.message || "Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonId]);

    const handleGrade = async (submissionId) => {
        setSavingSubmissionId(submissionId);
        try {
            await assignmentAPI.gradeSubmission(submissionId, {
                grade: Number(gradeDrafts[submissionId]),
                feedback: feedbackDrafts[submissionId],
            });
            toast({
                title: "Submission graded",
                status: "success",
                duration: 2500,
            });
            await loadSubmissions();
        } catch (error) {
            toast({
                title: "Unable to grade submission",
                description: error.message || "Please try again",
                status: "error",
                duration: 3000,
            });
        } finally {
            setSavingSubmissionId(null);
        }
    };

    return (
        <Box bg={bgColor} minH="100vh">
            <Sidebar
                activeTab="dashboard"
                setActiveTab={() => {}}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />
            <Box ml={mainMarginLeft} minH="100vh" transition="margin-left 0.3s ease" px={{ base: 4, md: 8 }} py={8}>
                <VStack align="stretch" spacing={6}>
                    <Box>
                        <Heading size="lg" color={textColor}>
                            Assignment Grading
                        </Heading>
                        <Text color={mutedColor} mt={2}>
                            Review student submissions and send grades with feedback.
                        </Text>
                    </Box>

                    {errorMessage && (
                        <Alert status="error" borderRadius="lg">
                            <AlertIcon />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <Spinner size="lg" color={PRIMARY_COLOR} />
                    ) : (
                        <VStack align="stretch" spacing={4}>
                            <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                <Text fontWeight="bold" color={textColor}>
                                    {payload?.assignment?.title || "Assignment"}
                                </Text>
                                <Text color={mutedColor} mt={2} whiteSpace="pre-wrap">
                                    {payload?.assignment?.instructions || "No instructions provided."}
                                </Text>
                            </Box>

                            {(payload?.submissions || []).length === 0 ? (
                                <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" p={5}>
                                    <Text color={mutedColor}>No student submissions yet.</Text>
                                </Box>
                            ) : (
                                (payload?.submissions || []).map((submission) => (
                                    <Box
                                        key={submission.submissionId}
                                        bg={cardBg}
                                        border="1px"
                                        borderColor={borderColor}
                                        borderRadius="xl"
                                        p={5}
                                    >
                                        <VStack align="stretch" spacing={4}>
                                            <HStack justify="space-between" align="flex-start">
                                                <Box>
                                                    <Text fontWeight="bold" color={textColor}>
                                                        {submission.student?.fullName || "Student"}
                                                    </Text>
                                                    <Text color={mutedColor} fontSize="sm">
                                                        {submission.student?.email || ""}
                                                    </Text>
                                                </Box>
                                                <Badge colorScheme={submission.status === "graded" ? "green" : "orange"}>
                                                    {submission.status === "graded" ? "Graded" : "Pending"}
                                                </Badge>
                                            </HStack>

                                            <Box>
                                                <Text color={mutedColor} fontSize="sm" mb={2}>
                                                    Student response
                                                </Text>
                                                <Text color={textColor} whiteSpace="pre-wrap">
                                                    {submission.contentText || "No text submitted."}
                                                </Text>
                                            </Box>

                                            <FormControl>
                                                <FormLabel color={textColor}>Grade</FormLabel>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={10}
                                                    value={gradeDrafts[submission.submissionId] ?? ""}
                                                    onChange={(event) =>
                                                        setGradeDrafts((prev) => ({
                                                            ...prev,
                                                            [submission.submissionId]: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel color={textColor}>Feedback</FormLabel>
                                                <Textarea
                                                    rows={4}
                                                    value={feedbackDrafts[submission.submissionId] ?? ""}
                                                    onChange={(event) =>
                                                        setFeedbackDrafts((prev) => ({
                                                            ...prev,
                                                            [submission.submissionId]: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </FormControl>

                                            <Button
                                                alignSelf="flex-start"
                                                bg={PRIMARY_COLOR}
                                                color="#0A1926"
                                                fontWeight="bold"
                                                onClick={() => handleGrade(submission.submissionId)}
                                                isLoading={savingSubmissionId === submission.submissionId}
                                            >
                                                Save Grade
                                            </Button>
                                        </VStack>
                                    </Box>
                                ))
                            )}
                        </VStack>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default AssignmentGrading;
