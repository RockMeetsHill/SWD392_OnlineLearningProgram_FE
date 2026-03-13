import { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    VStack,
    Radio,
    RadioGroup,
    Text,
    useColorModeValue,
    useToast,
    Spinner,
    Box,
    Divider,
    HStack,
    Badge,
    Icon,
    CircularProgress,
    CircularProgressLabel,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { quizAPI } from "../../services/quizService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const TakeQuizModal = ({ isOpen, onClose, quizId, quizTitle, onSubmitted }) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [selections, setSelections] = useState({});
    const toast = useToast();
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const cardBg = useColorModeValue("gray.50", "gray.700");

    useEffect(() => {
        if (!isOpen || !quizId) return;
        setResult(null);
        setSelections({});
        setLoading(true);
        quizAPI
            .getQuizById(quizId)
            .then((data) => {
                console.log("Quiz data loaded:", data);
                const quizData = data?.quiz ?? data;
                setQuiz(quizData);

                const questionResultsFromApi = Array.isArray(data?.questionResults)
                    ? data.questionResults
                    : [];

                if (questionResultsFromApi.length > 0) {
                    const totalQuestions =
                        questionResultsFromApi.length || quizData?.questions?.length || 0;
                    const correctCount = questionResultsFromApi.filter((r) => r.isCorrect).length;
                    const scoreFromAttempt =
                        data?.attempt && data.attempt.totalScore != null
                            ? Number(data.attempt.totalScore)
                            : null;
                    const score =
                        scoreFromAttempt != null && !Number.isNaN(scoreFromAttempt)
                            ? Math.round(scoreFromAttempt)
                            : totalQuestions > 0
                                ? Math.round((correctCount / totalQuestions) * 100)
                                : 0;
                    const passingScore =
                        typeof quizData?.passingScore === "number" ? quizData.passingScore : 70;
                    const passed = score >= passingScore;

                    setResult({
                        score,
                        correctCount,
                        totalQuestions,
                        passed,
                        questionResults: questionResultsFromApi,
                    });
                }
            })
            .catch((err) => {
                console.error("Error loading quiz:", err);
                toast({ title: "Lỗi", description: err.message, status: "error", duration: 3000 });
                onClose();
            })
            .finally(() => setLoading(false));
    }, [isOpen, quizId, onClose, toast]);

    const handleSubmit = async () => {
        const answers = Object.entries(selections).map(([questionId, answerId]) => ({
            questionId: parseInt(questionId, 10),
            answerId: parseInt(answerId, 10),
        }));
        const unanswered = (quiz?.questions?.length || 0) - answers.length;
        if (unanswered > 0) {
            toast({
                title: "Chưa trả lời hết",
                description: `Còn ${unanswered} câu chưa chọn đáp án.`,
                status: "warning",
                duration: 3000,
            });
            return;
        }
        setSubmitting(true);
        try {
            const res = await quizAPI.submitQuiz(quizId, answers);
            console.log("Submit result:", res);

            // Lưu kết quả từ API response
            setResult(res);

            toast({
                title: "Nộp bài thành công!",
                description: `Điểm của bạn: ${res.score || res.percentage || 0}%`,
                status: res.passed ? "success" : "info",
                duration: 3000,
            });

            if (onSubmitted) onSubmitted(res);
        } catch (err) {
            console.error("Submit error:", err);
            toast({ title: "Lỗi", description: err.message, status: "error", duration: 3000 });
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setQuiz(null);
        setResult(null);
        setSelections({});
        onClose();
    };

    const handleRetake = () => {
        setResult(null);
        setSelections({});
    };

    // Render kết quả quiz với UI đẹp hơn
    const renderResult = () => {
        if (!result) return null;

        // Xử lý các format response khác nhau từ API
        const score = result.score ?? result.percentage ?? 0;
        const correctCount = result.correctCount ?? result.correctAnswers ?? 0;
        const totalQuestions = result.totalQuestions ?? quiz?.questions?.length ?? 0;
        const passed = result.passed ?? (score >= 70);
        const questionResults = result.questionResults ?? result.details ?? [];

        return (
            <VStack align="stretch" spacing={5}>
                {/* Score Overview */}
                <VStack spacing={4} py={4}>
                    <CircularProgress
                        value={score}
                        size="120px"
                        thickness="10px"
                        color={passed ? "green.400" : "red.400"}
                    >
                        <CircularProgressLabel>
                            <VStack spacing={0}>
                                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                                    {score}%
                                </Text>
                            </VStack>
                        </CircularProgressLabel>
                    </CircularProgress>

                    <Badge
                        colorScheme={passed ? "green" : "red"}
                        fontSize="md"
                        px={4}
                        py={2}
                        rounded="full"
                    >
                        <HStack spacing={2}>
                            <Icon as={passed ? CheckCircleIcon : WarningIcon} />
                            <Text>{passed ? "ĐẠT" : "CHƯA ĐẠT"}</Text>
                        </HStack>
                    </Badge>

                    <HStack spacing={6}>
                        <VStack spacing={0}>
                            <Text fontSize="xl" fontWeight="bold" color="green.500">
                                {correctCount}
                            </Text>
                            <Text fontSize="sm" color={mutedColor}>Câu đúng</Text>
                        </VStack>
                        <VStack spacing={0}>
                            <Text fontSize="xl" fontWeight="bold" color="red.500">
                                {totalQuestions - correctCount}
                            </Text>
                            <Text fontSize="sm" color={mutedColor}>Câu sai</Text>
                        </VStack>
                        <VStack spacing={0}>
                            <Text fontSize="xl" fontWeight="bold" color={textColor}>
                                {totalQuestions}
                            </Text>
                            <Text fontSize="sm" color={mutedColor}>Tổng số</Text>
                        </VStack>
                    </HStack>
                </VStack>

                <Divider />

                {/* Chi tiết từng câu */}
                {questionResults.length > 0 && (
                    <>
                        <Text fontWeight="semibold" color={textColor}>
                            Chi tiết từng câu
                        </Text>
                        {questionResults.map((r, i) => (
                            <Box
                                key={r.questionId || i}
                                p={3}
                                borderRadius="md"
                                bg={cardBg}
                                borderLeft="4px"
                                borderColor={r.isCorrect ? "green.500" : "red.500"}
                            >
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                        Câu {i + 1}: {r.questionContent || r.questionText || ""}
                                    </Text>
                                    <Badge colorScheme={r.isCorrect ? "green" : "red"} size="sm">
                                        {r.isCorrect ? "Đúng" : "Sai"}
                                    </Badge>
                                </HStack>
                                <Text fontSize="xs" color={mutedColor} mt={1}>
                                    Bạn chọn: {r.userAnswerContent || r.selectedAnswer || "—"}
                                </Text>
                                {!r.isCorrect && (r.correctAnswerContent || r.correctAnswer) && (
                                    <Text fontSize="xs" color="green.600" mt={1}>
                                        Đáp án đúng: {r.correctAnswerContent || r.correctAnswer}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </>
                )}

                {/* Message nếu không có chi tiết */}
                {questionResults.length === 0 && (
                    <Box textAlign="center" py={4}>
                        {passed ? (
                            <Text color="green.600">
                                🎉 Chúc mừng! Bạn đã hoàn thành bài quiz.
                            </Text>
                        ) : (
                            <Text color={mutedColor}>
                                💪 Cố gắng lên! Hãy xem lại bài học và thử lại.
                            </Text>
                        )}
                    </Box>
                )}
            </VStack>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent bg={useColorModeValue("white", "gray.800")} maxH="90vh">
                <ModalHeader color={textColor}>
                    {result ? "Kết quả" : (quizTitle || quiz?.title || "Quiz")}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {loading ? (
                        <VStack py={8}>
                            <Spinner size="lg" color={PRIMARY_COLOR} />
                            <Text color={mutedColor}>Đang tải câu hỏi...</Text>
                        </VStack>
                    ) : result ? (
                        renderResult()
                    ) : quiz?.questions?.length ? (
                        <VStack align="stretch" spacing={4}>
                            {quiz.questions.map((q, idx) => (
                                <Box key={q.questionId}>
                                    <Text fontWeight="medium" color={textColor} mb={2}>
                                        {idx + 1}. {q.contentText}
                                    </Text>
                                    <RadioGroup
                                        value={selections[q.questionId]?.toString() || ""}
                                        onChange={(val) =>
                                            setSelections((prev) => ({
                                                ...prev,
                                                [q.questionId]: parseInt(val, 10),
                                            }))
                                        }
                                    >
                                        <VStack align="stretch" spacing={2} pl={2}>
                                            {(q.questionAnswers || []).map((a) => (
                                                <Radio key={a.answerId} value={a.answerId.toString()} size="sm">
                                                    {a.contentText}
                                                </Radio>
                                            ))}
                                        </VStack>
                                    </RadioGroup>
                                    <Divider mt={3} />
                                </Box>
                            ))}
                        </VStack>
                    ) : (
                        <Text color={mutedColor}>Không có câu hỏi.</Text>
                    )}
                </ModalBody>
                <ModalFooter>
                    {result ? (
                        <>
                            <Button
                                variant="outline"
                                mr={3}
                                onClick={handleRetake}
                            >
                                Làm lại
                            </Button>
                            <Button colorScheme="blue" onClick={handleClose}>
                                Đóng
                            </Button>
                        </>
                    ) : quiz?.questions?.length ? (
                        <Button
                            bg={PRIMARY_COLOR}
                            color="#0A1926"
                            onClick={handleSubmit}
                            isLoading={submitting}
                            loadingText="Đang nộp..."
                        >
                            Nộp bài
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={handleClose}>
                            Đóng
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TakeQuizModal;