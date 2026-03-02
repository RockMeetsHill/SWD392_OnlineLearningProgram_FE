import { useState } from "react";
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
    HStack,
    Text,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    useColorModeValue,
    useToast,
    Spinner,
    Box,
} from "@chakra-ui/react";
import { aiAPI } from "../../services/aiService";
import { PRIMARY_COLOR } from "../../constants/instructor";

/** Normalize question/answers for apply-quiz payload (content/contentText/question, answers/options) */
function normalizeForSave(list) {
  if (!Array.isArray(list)) return [];
  return list.map((q) => {
    const content = (q.content || q.contentText || q.question || "").trim();
    const rawAnswers = q.answers || q.options || [];
    const answers = rawAnswers.map((a, j) => ({
      content: (a.content || a.contentText || a.text || "").trim(),
      isCorrect: !!a.isCorrect,
      orderIndex: j,
    })).filter((a) => a.content.length > 0);
    const correctCount = answers.filter((a) => a.isCorrect).length;
    if (answers.length >= 2 && correctCount !== 1 && answers.length > 0) {
      answers[0].isCorrect = true;
      answers.forEach((a, i) => { if (i > 0) a.isCorrect = false; });
    }
    return { content, answers };
  }).filter((q) => q.content.length > 0 && q.answers.length >= 2);
}

const GenerateQuizWithAIModal = ({
    isOpen,
    onClose,
    lessonId,
    initialTitle = "Quiz",
    initialLessonTitle = "",
    initialTimeLimit = 0,
    initialPassingScore = 60,
    existingQuestions = [],
    onSaved,
}) => {
    const [numQuestions, setNumQuestions] = useState(5);
    const [generated, setGenerated] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const modalBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const previewBoxBg = useColorModeValue("gray.50", "gray.700");
    const toast = useToast();

    const handleGenerate = async () => {
        if (!lessonId) return;
        setLoading(true);
        setGenerated(null);
        try {
            const existingTexts = (existingQuestions || [])
                .map((q) => (q.contentText || q.content || q.question || "").trim())
                .filter(Boolean);
            const res = await aiAPI.generateQuiz(lessonId, numQuestions, existingTexts);
            setGenerated(res.questions || []);
        } catch (err) {
            toast({
                title: "Lỗi",
                description: err.message || "Không thể tạo câu hỏi bằng AI",
                status: "error",
                duration: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!lessonId || !generated?.length) return;
        const normalized = normalizeForSave(generated);
        if (normalized.length === 0) {
            toast({
                title: "Lỗi",
                description: "Không có câu hỏi hợp lệ để lưu (cần nội dung và ít nhất 2 đáp án, 1 đúng).",
                status: "error",
                duration: 4000,
            });
            return;
        }
        setSaving(true);
        try {
            const created = await aiAPI.applyGeneratedQuiz(lessonId, {
                title: title || "Quiz",
                timeLimitMinutes: initialTimeLimit,
                passingScore: initialPassingScore,
                questions: normalized,
            });
            if (!created || typeof created !== "object") {
                console.error("[GenerateQuizWithAIModal] API trả về không phải object:", created);
                toast({ title: "Lỗi", description: "Server trả dữ liệu sai. Xem Console (F12).", status: "error", duration: 5000 });
                return;
            }
            if (!created.quizId) {
                console.error("[GenerateQuizWithAIModal] Response thiếu quizId:", created);
                toast({ title: "Lỗi", description: "Server không trả quizId. Xem Console (F12).", status: "error", duration: 5000 });
                return;
            }
            const questionsFromServer = Array.isArray(created.questions) ? created.questions : [];
            if (questionsFromServer.length !== normalized.length) {
                toast({
                    title: "Cảnh báo",
                    description: `Đã lưu ${questionsFromServer.length}/${normalized.length} câu. Kiểm tra backend nếu thiếu.`,
                    status: "warning",
                    duration: 5000,
                });
            } else {
                const forLesson = initialLessonTitle ? ` cho ${initialLessonTitle}` : "";
                toast({ title: "Đã lưu bộ câu hỏi" + forLesson, description: `${questionsFromServer.length} câu đã lưu.`, status: "success", duration: 4000 });
            }
            if (onSaved) onSaved(created);
            handleClose();
        } catch (err) {
            const msg = err.message || "Không thể lưu";
            toast({
                title: "Lỗi",
                description: msg.includes("No valid questions") ? "Không có câu hỏi hợp lệ để lưu." : msg,
                status: "error",
                duration: 4000,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setGenerated(null);
        setNumQuestions(5);
        setTitle(initialTitle);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent bg={modalBg} maxH="90vh">
                <ModalHeader color={textColor}>Tạo quiz bằng AI (Gemini)</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="stretch" spacing={4}>
                        <FormControl>
                            <FormLabel fontSize="sm" color={textColor}>Số câu hỏi</FormLabel>
                            <NumberInput
                                min={1}
                                max={20}
                                value={numQuestions}
                                onChange={(_, v) => setNumQuestions(v || 5)}
                            >
                                <NumberInputField />
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="sm" color={textColor}>Tiêu đề quiz (khi lưu)</FormLabel>
                            <Box
                                as="input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Quiz"
                                width="100%"
                                px={3}
                                py={2}
                                borderRadius="md"
                                border="1px"
                                borderColor={borderColor}
                                fontSize="sm"
                            />
                        </FormControl>
                        {(existingQuestions || []).length > 0 && (
                            <Text fontSize="xs" color={mutedColor}>
                                Quiz đã có {(existingQuestions || []).length} câu → AI sẽ tạo thêm câu mới, không trùng nội dung.
                            </Text>
                        )}
                        <Button
                            size="sm"
                            bg={PRIMARY_COLOR}
                            color="#0A1926"
                            onClick={handleGenerate}
                            isLoading={loading}
                        >
                            Tạo câu hỏi bằng AI
                        </Button>
                        {loading && (
                            <HStack justify="center" py={4}>
                                <Spinner size="sm" color={PRIMARY_COLOR} />
                            </HStack>
                        )}
                        {generated && generated.length > 0 && (
                            <Box>
                                <Text fontWeight="semibold" color={textColor} mb={2}>
                                    Xem trước ({generated.length} câu)
                                </Text>
                                <VStack align="stretch" spacing={3} maxH="300px" overflowY="auto">
                                    {generated.map((q, i) => (
                                        <Box
                                            key={i}
                                            p={3}
                                            borderRadius="md"
                                            bg={previewBoxBg}
                                            border="1px"
                                            borderColor={borderColor}
                                        >
                                            <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                                {i + 1}. {q.content || q.contentText || q.question}
                                            </Text>
                                            <VStack align="stretch" pl={4} mt={2} spacing={1}>
                                                {(q.answers || q.options || []).map((a, j) => (
                                                    <Text key={j} fontSize="xs" color={mutedColor}>
                                                        • {a.content || a.contentText || a.text}
                                                        {a.isCorrect && " ✓"}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button
                        bg={PRIMARY_COLOR}
                        color="#0A1926"
                        onClick={handleSave}
                        isDisabled={!generated?.length}
                        isLoading={saving}
                    >
                        Lưu bộ câu hỏi
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GenerateQuizWithAIModal;
