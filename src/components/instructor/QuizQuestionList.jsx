import { useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    FormControl,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    useColorModeValue,
} from "@chakra-ui/react";
import { quizAPI } from "../../services/quizService";
import { PRIMARY_COLOR } from "../../constants/instructor";

const QuizQuestionList = ({ questions = [], quizId, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editAnswers, setEditAnswers] = useState([]);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const textColor = useColorModeValue("gray.900", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const cardBg = useColorModeValue("gray.50", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const startEdit = (q) => {
        setEditingId(q.questionId);
        setEditContent(q.contentText || "");
        setEditAnswers((q.questionAnswers || []).map((a) => ({
            answerId: a.answerId,
            contentText: a.contentText || "",
            isCorrect: !!a.isCorrect,
            orderIndex: a.orderIndex ?? 0,
        })));
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent("");
        setEditAnswers([]);
    };

    const updateEditAnswer = (idx, field, value) => {
        setEditAnswers((prev) =>
            prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
        );
    };

    const setCorrectAnswer = (idx) => {
        setEditAnswers((prev) =>
            prev.map((a, i) => ({ ...a, isCorrect: i === idx }))
        );
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editContent.trim()) return;
        if (editAnswers.filter((a) => a.contentText?.trim()).length < 2) return;
        if (!editAnswers.some((a) => a.isCorrect)) return;
        setSaving(true);
        try {
            await quizAPI.updateQuestion(editingId, { contentText: editContent.trim() });
            const valid = editAnswers.filter((a) => a.contentText?.trim());
            for (let i = 0; i < valid.length; i++) {
                const a = valid[i];
                const payload = { contentText: a.contentText.trim(), isCorrect: a.isCorrect, orderIndex: i };
                if (a.answerId) {
                    await quizAPI.updateAnswer(a.answerId, payload);
                } else {
                    await quizAPI.createAnswer(editingId, payload);
                }
            }
            cancelEdit();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm("Xóa câu hỏi này?")) return;
        setDeletingId(questionId);
        try {
            await quizAPI.deleteQuestion(questionId);
            if (editingId === questionId) cancelEdit();
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    if (!questions.length) return null;

    return (
        <VStack align="stretch" spacing={3}>
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                Chi tiết các câu hỏi ({questions.length} câu)
            </Text>
            <Box maxH="320px" overflowY="auto" pr={2}>
                {questions.map((q, idx) => (
                    <Box
                        key={q.questionId}
                        p={3}
                        borderRadius="md"
                        bg={cardBg}
                        border="1px"
                        borderColor={borderColor}
                        mb={2}
                    >
                        {editingId === q.questionId ? (
                            <VStack align="stretch" spacing={3}>
                                <FormControl>
                                    <FormLabel fontSize="xs" color={textColor}>Nội dung câu hỏi</FormLabel>
                                    <Input
                                        size="sm"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        placeholder="Nội dung câu hỏi"
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontSize="xs" color={textColor}>Đáp án</FormLabel>
                                    <RadioGroup
                                        value={editAnswers.findIndex((a) => a.isCorrect) >= 0 ? String(editAnswers.findIndex((a) => a.isCorrect)) : "0"}
                                        onChange={(i) => setCorrectAnswer(parseInt(i, 10))}
                                    >
                                        <VStack align="stretch" spacing={2}>
                                            {editAnswers.map((a, i) => (
                                                <HStack key={a.answerId || i}>
                                                    <Radio value={String(i)} size="sm" />
                                                    <Input
                                                        size="sm"
                                                        value={a.contentText}
                                                        onChange={(e) => updateEditAnswer(i, "contentText", e.target.value)}
                                                        placeholder={`Đáp án ${i + 1}`}
                                                        flex={1}
                                                    />
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </RadioGroup>
                                </FormControl>
                                <HStack>
                                    <Button size="sm" bg={PRIMARY_COLOR} color="#0A1926" onClick={handleSaveEdit} isLoading={saving}>
                                        Lưu
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEdit}>Hủy</Button>
                                </HStack>
                            </VStack>
                        ) : (
                            <>
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                        {idx + 1}. {q.contentText}
                                    </Text>
                                    <HStack>
                                        <Button size="xs" variant="outline" onClick={() => startEdit(q)}>Sửa</Button>
                                        <Button
                                            size="xs"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleDelete(q.questionId)}
                                            isLoading={deletingId === q.questionId}
                                        >
                                            Xóa
                                        </Button>
                                    </HStack>
                                </HStack>
                                <VStack align="stretch" pl={4} spacing={1}>
                                    {(q.questionAnswers || []).map((a, j) => (
                                        <Text key={a.answerId || j} fontSize="xs" color={mutedColor}>
                                            • {a.contentText}
                                            {a.isCorrect && " ✓"}
                                        </Text>
                                    ))}
                                </VStack>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
        </VStack>
    );
};

export default QuizQuestionList;
