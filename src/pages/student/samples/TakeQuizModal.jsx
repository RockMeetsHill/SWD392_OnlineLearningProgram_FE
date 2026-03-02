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
} from "@chakra-ui/react";
import { quizAPI } from "../../../services/quizService";
import { PRIMARY_COLOR } from "../../../components/constants/instructor";

const TakeQuizModal = ({ isOpen, onClose, quizId, quizTitle, onSubmitted }) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [selections, setSelections] = useState({});
    const toast = useToast();
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");

    useEffect(() => {
        if (!isOpen || !quizId) return;
        setResult(null);
        setSelections({});
        setLoading(true);
        quizAPI
            .getQuizById(quizId)
            .then((data) => {
                setQuiz(data);
            })
            .catch((err) => {
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
            setResult(res);
            if (onSubmitted) onSubmitted();
        } catch (err) {
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
                        </VStack>
                    ) : result ? (
                        <VStack align="stretch" spacing={4}>
                            <Box
                                p={4}
                                borderRadius="lg"
                                bg={result.passed ? "green.50" : "red.50"}
                                borderWidth="1px"
                                borderColor={result.passed ? "green.200" : "red.200"}
                            >
                                <Text fontWeight="bold" fontSize="lg">
                                    Điểm: {result.score}% ({result.correctCount}/{result.totalQuestions} câu đúng)
                                </Text>
                                <Text color={mutedColor}>
                                    {result.passed ? "Đạt" : "Chưa đạt"}
                                </Text>
                            </Box>
                            <Text fontWeight="semibold" color={textColor}>
                                Chi tiết từng câu
                            </Text>
                            {(result.questionResults || []).map((r, i) => (
                                <Box
                                    key={r.questionId || i}
                                    p={3}
                                    borderRadius="md"
                                    bg={useColorModeValue("gray.50", "gray.700")}
                                    borderLeft="4px"
                                    borderColor={r.isCorrect ? "green.500" : "red.500"}
                                >
                                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                        {r.questionContent}
                                    </Text>
                                    <Text fontSize="xs" color={mutedColor} mt={1}>
                                        Bạn chọn: {r.userAnswerContent || "—"}
                                    </Text>
                                    {!r.isCorrect && r.correctAnswerContent && (
                                        <Text fontSize="xs" color="green.600">
                                            Đáp án đúng: {r.correctAnswerContent}
                                        </Text>
                                    )}
                                </Box>
                            ))}
                        </VStack>
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
                        <Button colorScheme="blue" onClick={handleClose}>
                            Đóng
                        </Button>
                    ) : quiz?.questions?.length ? (
                        <Button
                            bg={PRIMARY_COLOR}
                            color="#0A1926"
                            onClick={handleSubmit}
                            isLoading={submitting}
                        >
                            Nộp bài
                        </Button>
                    ) : null}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TakeQuizModal;
