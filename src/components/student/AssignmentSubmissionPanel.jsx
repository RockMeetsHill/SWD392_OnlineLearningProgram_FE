import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    Badge,
    Box,
    Button,
    FormControl,
    FormLabel,
    Text,
    Textarea,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import assignmentAPI from "../../services/assignmentService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const AssignmentSubmissionPanel = ({ lessonId, onSubmitted }) => {
    const [assignmentData, setAssignmentData] = useState(null);
    const [submissionText, setSubmissionText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const loadAssignment = async () => {
        if (!lessonId) return;
        setIsLoading(true);
        setErrorMessage("");

        try {
            const data = await assignmentAPI.getAssignmentByLesson(lessonId);
            setAssignmentData(data);
        } catch (error) {
            setErrorMessage(error.message || "Failed to load assignment");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setSubmissionText("");
        loadAssignment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessonId]);

    const handleSubmit = async () => {
        if (!submissionText.trim()) {
            setErrorMessage("Assignment answer is required");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await assignmentAPI.submitAssignment(lessonId, {
                contentText: submissionText.trim(),
            });
            setSubmissionText("");
            await loadAssignment();
            onSubmitted?.();
        } catch (error) {
            setErrorMessage(error.message || "Failed to submit assignment");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <Text color={mutedColor}>Loading assignment...</Text>;
    }

    if (errorMessage && !assignmentData) {
        return (
            <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
        );
    }

    const latestSubmission = assignmentData?.latestSubmission;

    return (
        <Box bg={cardBg} border="1px" borderColor={borderColor} borderRadius="lg" p={4}>
            <VStack align="stretch" spacing={4}>
                <Box>
                    <Text fontWeight="bold" color={textColor}>
                        {assignmentData?.assignment?.title || "Assignment"}
                    </Text>
                    <Text mt={2} color={mutedColor} whiteSpace="pre-wrap">
                        {assignmentData?.assignment?.instructions || "Submit your work for instructor review."}
                    </Text>
                </Box>

                {latestSubmission && (
                    <Box border="1px" borderColor={borderColor} borderRadius="lg" p={3}>
                        <Text fontWeight="semibold" color={textColor} mb={2}>
                            Latest submission
                        </Text>
                        <Badge colorScheme={latestSubmission.status === "graded" ? "green" : "orange"}>
                            {latestSubmission.status === "graded" ? "Graded" : "Pending review"}
                        </Badge>
                        {latestSubmission.grade != null && (
                            <Text mt={2} color={textColor}>
                                Grade: {latestSubmission.grade}
                            </Text>
                        )}
                        {latestSubmission.feedback && (
                            <Text mt={2} color={mutedColor} whiteSpace="pre-wrap">
                                Feedback: {latestSubmission.feedback}
                            </Text>
                        )}
                    </Box>
                )}

                {errorMessage && (
                    <Alert status="error" borderRadius="lg">
                        <AlertIcon />
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <FormControl>
                    <FormLabel color={textColor}>Your submission</FormLabel>
                    <Textarea
                        rows={6}
                        value={submissionText}
                        onChange={(event) => setSubmissionText(event.target.value)}
                        placeholder="Write your answer here..."
                    />
                </FormControl>

                <Button
                    alignSelf="flex-start"
                    bg={PRIMARY_COLOR}
                    color="#0A1926"
                    fontWeight="bold"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                >
                    Submit Assignment
                </Button>
            </VStack>
        </Box>
    );
};

AssignmentSubmissionPanel.propTypes = {
    lessonId: PropTypes.number,
    onSubmitted: PropTypes.func,
};

export default AssignmentSubmissionPanel;
